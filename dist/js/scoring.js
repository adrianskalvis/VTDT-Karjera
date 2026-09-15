import {
  DIMENSION_GROUPS,
  dimensionIds,
  dimensions,
  dimensionsByGroup,
} from "../data/dimensions.js?v=2026.6";
import { professions } from "../data/professions.js?v=2026.6";
import {
  ANSWER_SCALE,
  ASSESSMENT_MODES,
  answerById,
  questions,
  tieBreakerQuestionById,
  tieBreakers,
} from "../data/questions.js?v=2026.6";

export const CLARIFIER_MULTIPLIER = 0.75;
export const PRACTICAL_TIE_EPSILON = 0.35;

const MODE_THRESHOLDS = Object.freeze({
  quick: Object.freeze({ closeGap: 0.4, closeTopThreeRange: 0.8 }),
  deep: Object.freeze({ closeGap: 0.45, closeTopThreeRange: 0.85 }),
});

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

const emptyDimensions = (initialValue = 0) =>
  Object.fromEntries(dimensionIds.map((id) => [id, initialValue]));

const lookupForQuestions = (items) =>
  Object.fromEntries(items.map((question) => [question.id, question]));

const getValidSelections = (answers, lookup, multiplier) =>
  answers.flatMap((answer) => {
    if (!answer || typeof answer !== "object") return [];
    const question = lookup[answer.questionId];
    const option = answerById[answer.optionId];
    return question && option ? [{ answer, question, option, multiplier }] : [];
  });

export const getAppliedEffects = (question, optionId, multiplier = 1) => {
  const option = answerById[optionId];
  if (!question || !option) return Object.freeze({});
  return Object.freeze(
    Object.fromEntries(
      Object.entries(question.vector).map(([dimensionId, weight]) => [
        dimensionId,
        multiplier * option.coefficient * weight,
      ]),
    ),
  );
};

export const calculateDimensionProfile = ({
  answers = [],
  tieBreakerAnswers = [],
  baseQuestions = questions,
} = {}) => {
  const signed = emptyDimensions();
  const evidence = emptyDimensions();
  const exposureCount = emptyDimensions();
  const baseLookup = lookupForQuestions(baseQuestions);
  const selections = [
    ...getValidSelections(answers, baseLookup, 1),
    ...getValidSelections(
      tieBreakerAnswers,
      tieBreakerQuestionById,
      CLARIFIER_MULTIPLIER,
    ),
  ];

  for (const selection of selections) {
    const { question, option, multiplier } = selection;
    for (const [dimensionId, weight] of Object.entries(question.vector)) {
      const effect = multiplier * option.coefficient * weight;
      signed[dimensionId] += effect;
      evidence[dimensionId] += Math.abs(effect);
      exposureCount[dimensionId] += 1;
    }
  }

  const values = Object.fromEntries(
    dimensionIds.map((dimensionId) => {
      const totalEvidence = evidence[dimensionId];
      const direction = totalEvidence ? signed[dimensionId] / totalEvidence : 0;
      const target = (direction + 1) / 2;
      const consistency = Math.abs(direction);
      const reliability = totalEvidence
        ? Math.min(1, totalEvidence / 4) * consistency
        : 0;
      return [
        dimensionId,
        Object.freeze({
          raw: signed[dimensionId],
          capacity: totalEvidence,
          exposureCount: exposureCount[dimensionId],
          direction,
          target,
          reliability,
          evidence: reliability,
          positive: Math.max(0, direction) * reliability,
          negative: Math.max(0, -direction) * reliability,
        }),
      ];
    }),
  );

  return Object.freeze({
    values: Object.freeze(values),
    substantiveAnswerCount: selections.length,
    answeredCount: selections.length,
  });
};

export const matchDimension = (dimensionEvidence, professionValue) => {
  const reliability = dimensionEvidence?.reliability ?? 0;
  if (!reliability) return 0.5;
  const target = dimensionEvidence.target;
  const directMatch = 1 - Math.abs(target - professionValue);
  return clamp(0.5 + reliability * (directMatch - 0.5), 0, 1);
};

export const scoreProfession = (
  dimensionProfile,
  profession,
  { taskFocusWeight = 0 } = {},
) => {
  const dimensionMatches = Object.fromEntries(
    dimensionIds.map((dimensionId) => [
      dimensionId,
      matchDimension(
        dimensionProfile.values[dimensionId],
        profession.profile[dimensionId],
      ),
    ]),
  );

  const groupMatches = Object.fromEntries(
    Object.values(DIMENSION_GROUPS).map((group) => {
      const ids = dimensionsByGroup[group.id];
      const broadMatch =
        ids.reduce((sum, id) => sum + dimensionMatches[id], 0) / ids.length;
      if (group.id !== "tasks" || !taskFocusWeight) {
        return [group.id, broadMatch];
      }

      const coreTaskIds = ids.filter((id) => profession.profile[id] >= 0.75);
      const coreTaskWeight = coreTaskIds.reduce(
        (sum, id) => sum + profession.profile[id],
        0,
      );
      const coreTaskMatch = coreTaskWeight
        ? coreTaskIds.reduce(
            (sum, id) => sum + profession.profile[id] * dimensionMatches[id],
            0,
          ) / coreTaskWeight
        : broadMatch;

      return [
        group.id,
        (1 - taskFocusWeight) * broadMatch + taskFocusWeight * coreTaskMatch,
      ];
    }),
  );

  const score =
    100 *
    Object.values(DIMENSION_GROUPS).reduce(
      (sum, group) => sum + group.weight * groupMatches[group.id],
      0,
    );

  return Object.freeze({
    profession,
    score,
    groupMatches: Object.freeze(groupMatches),
    dimensionMatches: Object.freeze(dimensionMatches),
  });
};

export const rankProfessions = ({
  dimensionProfile,
  professionCatalog = professions,
  taskFocusWeight = 0,
} = {}) =>
  professionCatalog
    .map((profession) =>
      scoreProfession(dimensionProfile, profession, { taskFocusWeight }),
    )
    .sort(
      (first, second) =>
        second.score - first.score ||
        first.profession.title.localeCompare(second.profession.title, "lv"),
    );

const countGroupObservations = (selections) =>
  Object.fromEntries(
    Object.keys(DIMENSION_GROUPS).map((groupId) => [
      groupId,
      selections.filter(({ question }) =>
        Object.keys(question.vector).some(
          (dimensionId) => dimensions[dimensionId].group === groupId,
        ),
      ).length,
    ]),
  );

const calculateConfidence = ({ answers, tieBreakerAnswers, baseQuestions, profile }) => {
  const baseSelections = getValidSelections(answers, lookupForQuestions(baseQuestions), 1);
  const clarifierSelections = getValidSelections(
    tieBreakerAnswers,
    tieBreakerQuestionById,
    CLARIFIER_MULTIPLIER,
  );
  const selections = [...baseSelections, ...clarifierSelections];
  const substantiveBase = baseSelections.length;
  const substantiveClarifiers = clarifierSelections.length;
  const substantive = substantiveBase + substantiveClarifiers;
  const answered = selections.length;
  const answerCoverage = baseQuestions.length
    ? substantiveBase / baseQuestions.length
    : 0;
  const dimensionCoverage =
    dimensionIds.filter((id) => profile.values[id].capacity > 0).length /
    dimensionIds.length;
  const meanReliability =
    dimensionIds.reduce(
      (sum, id) => sum + profile.values[id].reliability,
      0,
    ) / dimensionIds.length;
  const value = clamp(
    100 * (0.7 * answerCoverage + 0.3 * meanReliability),
    0,
    100,
  );
  return Object.freeze({
    value,
    answered,
    substantive,
    substantiveBase,
    substantiveClarifiers,
    answerCoverage,
    dimensionCoverage,
    meanReliability,
    groupObservations: Object.freeze(countGroupObservations(selections)),
    level: value < 45 ? "low" : value < 72 ? "medium" : "high",
  });
};

const getBroadDirections = (ranked) => {
  const sectors = new Map();
  for (const result of ranked) {
    const score = sectors.get(result.profession.sector) ?? -Infinity;
    sectors.set(result.profession.sector, Math.max(score, result.score));
  }
  const sorted = [...sectors].sort(
    ([firstSector, firstScore], [secondSector, secondScore]) =>
      secondScore - firstScore || firstSector.localeCompare(secondSector, "lv"),
  );
  if (!sorted.length) return [];
  const best = sorted[0][1];
  return sorted
    .filter(([, score]) => best - score <= 1.5)
    .slice(0, 4)
    .map(([sector]) => sector);
};

export const evaluateAssessment = ({
  answers = [],
  tieBreakerAnswers = [],
  baseQuestions = questions,
  professionCatalog = professions,
} = {}) => {
  const dimensionProfile = calculateDimensionProfile({
    answers,
    tieBreakerAnswers,
    baseQuestions,
  });
  const confidence = calculateConfidence({
    answers,
    tieBreakerAnswers,
    baseQuestions,
    profile: dimensionProfile,
  });
  const taskFocusWeight = confidence.answerCoverage >= 1 ? 0.3 : 0;
  const ranked = rankProfessions({
    dimensionProfile,
    professionCatalog,
    taskFocusWeight,
  });
  const topGap =
    ranked.length > 1 ? ranked[0].score - ranked[1].score : Infinity;
  const topThreeRange =
    ranked.length > 2 ? ranked[0].score - ranked[2].score : Infinity;
  const exactTopTie = ranked.length > 1 && Math.abs(topGap) < 1e-10;
  const minimumSubstantive = Math.ceil(baseQuestions.length * 0.5);
  const lowInformation =
    confidence.substantive < minimumSubstantive ||
    confidence.dimensionCoverage < 0.35;
  const sharedLeaders = ranked.filter(
    ({ score }) => ranked.length && ranked[0].score - score <= PRACTICAL_TIE_EPSILON,
  );
  const sharedFirst = !lowInformation && sharedLeaders.length > 1;

  return Object.freeze({
    dimensionProfile,
    ranked: Object.freeze(ranked),
    topThree: Object.freeze(ranked.slice(0, 3)),
    leader: lowInformation || sharedFirst ? null : ranked[0] ?? null,
    sharedLeaders: Object.freeze(sharedLeaders),
    sharedFirst,
    exactTopTie,
    confidence,
    lowInformation,
    resultMode: lowInformation ? "broad" : "ranked",
    topGap,
    topThreeRange,
    closeResults: topThreeRange < 2,
    broadDirections: Object.freeze(getBroadDirections(ranked)),
  });
};

export const getAdaptiveTriggerReasons = (evaluation, modeId) => {
  const mode = ASSESSMENT_MODES[modeId];
  const thresholds = MODE_THRESHOLDS[modeId];
  if (!evaluation || !mode || !thresholds) return Object.freeze([]);
  const reasons = [];
  if (evaluation.topGap < thresholds.closeGap) reasons.push("closeTop");
  if (evaluation.topThreeRange < thresholds.closeTopThreeRange) {
    reasons.push("closeTopThree");
  }
  const first = evaluation.ranked[0];
  const second = evaluation.ranked[1];
  if (
    first &&
    second &&
    first.profession.sector !== second.profession.sector &&
    evaluation.topGap < 6
  ) {
    reasons.push("mixedSectors");
  }
  if (first) {
    const sameSectorAlternative = evaluation.ranked.find(
      ({ profession }) =>
        profession.id !== first.profession.id &&
        profession.sector === first.profession.sector,
    );
    if (
      sameSectorAlternative &&
      first.score - sameSectorAlternative.score < 6
    ) {
      reasons.push("sameSectorChoice");
    }
  }
  if (
    Object.values(evaluation.confidence.groupObservations).some(
      (observationCount) => observationCount < 2,
    )
  ) {
    reasons.push("lowCoverage");
  }
  return Object.freeze(reasons);
};

export const shouldAskTieBreaker = (
  evaluation,
  { modeId = "deep", askedCount = 0 } = {},
) => {
  const mode = ASSESSMENT_MODES[modeId];
  return Boolean(
    mode &&
      askedCount < mode.maxClarifiers &&
      getAdaptiveTriggerReasons(evaluation, modeId).length,
  );
};

const dimensionFormulaWeight = Object.freeze(
  Object.fromEntries(
    dimensionIds.map((id) => {
      const group = DIMENSION_GROUPS[dimensions[id].group];
      return [id, group.weight / dimensionsByGroup[group.id].length];
    }),
  ),
);

const projection = (profession, question) => {
  let numerator = 0;
  let denominator = 0;
  for (const [dimensionId, vectorWeight] of Object.entries(question.vector)) {
    const weight = dimensionFormulaWeight[dimensionId] * Math.abs(vectorWeight);
    numerator +=
      dimensionFormulaWeight[dimensionId] *
      vectorWeight *
      (2 * profession.profile[dimensionId] - 1);
    denominator += weight;
  }
  return denominator ? numerator / denominator : 0;
};

const vectorCosine = (first, second) => {
  let dot = 0;
  let firstLength = 0;
  let secondLength = 0;
  for (const dimensionId of dimensionIds) {
    const firstValue = first.vector[dimensionId] ?? 0;
    const secondValue = second.vector[dimensionId] ?? 0;
    dot += firstValue * secondValue;
    firstLength += firstValue * firstValue;
    secondLength += secondValue * secondValue;
  }
  return firstLength && secondLength
    ? dot / Math.sqrt(firstLength * secondLength)
    : 0;
};

export const scoreClarifierCandidate = ({
  question,
  evaluation,
  answeredQuestions = [],
  coverageOnly = false,
}) => {
  const top = evaluation.ranked.slice(0, 5).map(({ profession }) => profession);
  if (top.length < 2) return null;
  const projections = top.map((profession) => projection(profession, question));
  const topPairSeparation = Math.abs(projections[0] - projections[1]);
  const candidateSeparation = Math.max(...projections) - Math.min(...projections);
  const rawSeparation = 0.82 * topPairSeparation + 0.18 * candidateSeparation;
  const separation = clamp(rawSeparation / 1.25, 0, 1);

  let weightedNeed = 0;
  let totalVector = 0;
  for (const [dimensionId, vectorWeight] of Object.entries(question.vector)) {
    const weight = Math.abs(vectorWeight);
    const capacity = evaluation.dimensionProfile.values[dimensionId].capacity;
    weightedNeed += weight * (1 - Math.min(1, capacity / 3));
    totalVector += weight;
  }
  const need = totalVector ? weightedNeed / totalVector : 0;
  const maxSimilarity = answeredQuestions.length
    ? Math.max(
        ...answeredQuestions.map((answered) =>
          Math.abs(vectorCosine(question, answered)),
        ),
      )
    : 0;
  const novelty = 1 - maxSimilarity;
  const utility = coverageOnly
    ? 0.45 * separation + 0.45 * need + 0.1 * novelty
    : 0.7 * separation + 0.2 * need + 0.1 * novelty;

  return Object.freeze({ question, utility, separation, need, novelty });
};

export const selectNextTieBreaker = ({
  evaluation,
  answers = [],
  tieBreakerAnswers = [],
  baseQuestions = questions,
  candidates = tieBreakers,
  modeId = "deep",
} = {}) => {
  if (!evaluation) return null;
  const usedIds = new Set([
    ...answers.map(({ questionId }) => questionId),
    ...tieBreakerAnswers.map(({ questionId }) => questionId),
  ]);
  const answeredQuestions = [
    ...baseQuestions.filter(({ id }) => usedIds.has(id)),
    ...tieBreakers.filter(({ id }) => usedIds.has(id)),
  ];
  const reasons = getAdaptiveTriggerReasons(evaluation, modeId);
  const coverageOnly =
    reasons.length > 0 &&
    reasons.every((reason) => reason === "lowCoverage");

  const rankedCandidates = candidates
    .filter(({ id }) => !usedIds.has(id))
    .map((question) =>
      scoreClarifierCandidate({
        question,
        evaluation,
        answeredQuestions,
        coverageOnly,
      }),
    )
    .filter(
      (candidate) =>
        candidate &&
        (coverageOnly
          ? candidate.need >= 0.08
          : candidate.need >= 0.08 || candidate.separation >= 0.12),
    )
    .sort(
      (first, second) =>
        second.utility - first.utility ||
        first.question.id.localeCompare(second.question.id),
    );

  return rankedCandidates[0]?.question ?? null;
};

export const getStrongestDimensions = (
  evaluation,
  professionResult,
  limit = 4,
) =>
  dimensionIds
    .map((dimensionId) => {
      const userEvidence = evaluation.dimensionProfile.values[dimensionId];
      const professionValue = professionResult.profession.profile[dimensionId];
      const agreement = professionResult.dimensionMatches[dimensionId] - 0.5;
      return {
        id: dimensionId,
        dimension: dimensions[dimensionId],
        evidence: userEvidence.reliability,
        direction: userEvidence.direction,
        professionValue,
        agreement,
        strength: agreement * userEvidence.reliability,
      };
    })
    .filter(({ strength, direction }) => strength > 0 && direction > 0)
    .sort(
      (first, second) =>
        second.strength - first.strength || first.id.localeCompare(second.id),
    )
    .slice(0, limit);

export const replaceAnswer = (answers, nextAnswer) => [
  ...answers.filter(({ questionId }) => questionId !== nextAnswer.questionId),
  { ...nextAnswer },
];

export { MODE_THRESHOLDS };
