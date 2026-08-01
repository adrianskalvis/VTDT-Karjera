import {
  DIMENSION_GROUPS,
  dimensionIds,
  dimensions,
  dimensionsByGroup,
} from "../data/dimensions.js";
import {
  DEFAULT_INCLUDED_STATUSES,
  professions,
} from "../data/professions.js";
import {
  MIN_SUBSTANTIVE_FOR_TIE_BREAKER,
  QUESTION_EFFECT_CAP,
  TIE_BREAKER_THRESHOLD,
  questionById,
  questions,
  tieBreakerQuestionById,
} from "../data/questions.js";

export const NEGATIVE_EVIDENCE_WEIGHT = 0.65;
export const TIE_BREAKER_EFFECT_WEIGHT = 0.5;

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

const emptyDimensionRecord = (initialValue = 0) =>
  Object.fromEntries(dimensionIds.map((id) => [id, initialValue]));

const findOption = (question, optionId) =>
  question?.options.find((option) => option.id === optionId);

const getValidSelections = (answers, lookup) =>
  answers.flatMap((answer) => {
    if (!answer || typeof answer !== "object") return [];
    const question = lookup[answer.questionId];
    const option = findOption(question, answer.optionId);
    return question && option ? [{ answer, question, option }] : [];
  });

const getTieBreakerQuestionsInUse = (tieBreakerAnswers) => {
  const ids = new Set(
    tieBreakerAnswers
      .filter(Boolean)
      .map((answer) => answer.questionId)
      .filter((id) => tieBreakerQuestionById[id]),
  );
  return [...ids].map((id) => tieBreakerQuestionById[id]);
};

const effectForDimension = (option, dimensionId, weight = 1) =>
  clamp(
    Number(option.effects?.[dimensionId] ?? 0),
    -QUESTION_EFFECT_CAP,
    QUESTION_EFFECT_CAP,
  ) * weight;

export const getDimensionCapacities = ({
  baseQuestions = questions,
  tieBreakerQuestions = [],
} = {}) => {
  const positive = emptyDimensionRecord();
  const negative = emptyDimensionRecord();

  const pools = [
    ...baseQuestions.map((question) => ({ question, weight: 1 })),
    ...tieBreakerQuestions.map((question) => ({
      question,
      weight: TIE_BREAKER_EFFECT_WEIGHT,
    })),
  ];

  for (const { question, weight } of pools) {
    for (const dimensionId of dimensionIds) {
      const effects = question.options.map((option) =>
        effectForDimension(option, dimensionId, weight),
      );
      positive[dimensionId] += Math.max(0, ...effects);
      negative[dimensionId] += Math.max(0, ...effects.map((effect) => -effect));
    }
  }

  return { positive, negative };
};

export const calculateDimensionProfile = ({
  answers = [],
  tieBreakerAnswers = [],
  baseQuestions = questions,
} = {}) => {
  const tieBreakerQuestions = getTieBreakerQuestionsInUse(tieBreakerAnswers);
  const capacities = getDimensionCapacities({
    baseQuestions,
    tieBreakerQuestions,
  });
  const positiveRaw = emptyDimensionRecord();
  const negativeRaw = emptyDimensionRecord();

  const selections = [
    ...getValidSelections(
      answers,
      Object.fromEntries(baseQuestions.map((question) => [question.id, question])),
    ).map((selection) => ({ ...selection, weight: 1 })),
    ...getValidSelections(tieBreakerAnswers, tieBreakerQuestionById).map(
      (selection) => ({ ...selection, weight: TIE_BREAKER_EFFECT_WEIGHT }),
    ),
  ];

  for (const { option, weight } of selections) {
    for (const dimensionId of dimensionIds) {
      const effect = effectForDimension(option, dimensionId, weight);
      if (effect > 0) positiveRaw[dimensionId] += effect;
      if (effect < 0) negativeRaw[dimensionId] += Math.abs(effect);
    }
  }

  const values = Object.fromEntries(
    dimensionIds.map((dimensionId) => {
      const positive = capacities.positive[dimensionId]
        ? positiveRaw[dimensionId] / capacities.positive[dimensionId]
        : 0;
      const negative = capacities.negative[dimensionId]
        ? negativeRaw[dimensionId] / capacities.negative[dimensionId]
        : 0;
      const weightedNegative = NEGATIVE_EVIDENCE_WEIGHT * negative;
      const evidence = clamp(positive + weightedNegative, 0, 1);
      const direction = clamp(positive - weightedNegative, -1, 1);

      return [
        dimensionId,
        Object.freeze({
          raw: positiveRaw[dimensionId] - negativeRaw[dimensionId],
          positive,
          negative,
          evidence,
          direction,
        }),
      ];
    }),
  );

  return Object.freeze({
    values: Object.freeze(values),
    capacities: Object.freeze({
      positive: Object.freeze(capacities.positive),
      negative: Object.freeze(capacities.negative),
    }),
    substantiveAnswerCount: selections.filter(({ option }) => !option.isNeutral)
      .length,
  });
};

export const matchDimension = (dimensionEvidence, professionValue) => {
  const positive = dimensionEvidence?.positive ?? 0;
  const weightedNegative =
    NEGATIVE_EVIDENCE_WEIGHT * (dimensionEvidence?.negative ?? 0);
  const totalSignal = positive + weightedNegative;

  if (totalSignal === 0) return 0.5;

  const targetMatch =
    (positive * professionValue + weightedNegative * (1 - professionValue)) /
    totalSignal;
  const evidence = clamp(totalSignal, 0, 1);
  return clamp(0.5 + evidence * (targetMatch - 0.5), 0, 1);
};

export const scoreProfession = (dimensionProfile, profession) => {
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
    Object.keys(DIMENSION_GROUPS).map((groupId) => {
      const groupDimensions = dimensionsByGroup[groupId];
      const average =
        groupDimensions.reduce(
          (sum, dimensionId) => sum + dimensionMatches[dimensionId],
          0,
        ) / groupDimensions.length;
      return [groupId, average];
    }),
  );

  const score =
    100 *
    Object.values(DIMENSION_GROUPS).reduce(
      (sum, group) => sum + groupMatches[group.id] * group.weight,
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
  includedStatuses = DEFAULT_INCLUDED_STATUSES,
} = {}) => {
  const statuses = new Set(includedStatuses);
  return professionCatalog
    .filter((profession) => statuses.has(profession.status))
    .map((profession) => scoreProfession(dimensionProfile, profession))
    .sort(
      (first, second) =>
        second.score - first.score ||
        first.profession.title.localeCompare(second.profession.title, "lv"),
    );
};

const countSubstantiveBaseAnswers = (answers, baseQuestions = questions) => {
  const lookup = Object.fromEntries(
    baseQuestions.map((question) => [question.id, question]),
  );
  return getValidSelections(answers, lookup).filter(({ option }) => !option.isNeutral)
    .length;
};

const calculateConfidence = ({ answers, dimensionProfile, baseQuestions }) => {
  const substantive = countSubstantiveBaseAnswers(answers, baseQuestions);
  const answerCoverage = baseQuestions.length ? substantive / baseQuestions.length : 0;
  const signalledDimensions = dimensionIds.filter(
    (dimensionId) => dimensionProfile.values[dimensionId].evidence > 0,
  ).length;
  const dimensionCoverage = signalledDimensions / dimensionIds.length;

  const totals = dimensionIds.reduce(
    (accumulator, dimensionId) => {
      const { positive, negative } = dimensionProfile.values[dimensionId];
      const weightedNegative = NEGATIVE_EVIDENCE_WEIGHT * negative;
      accumulator.overlap += Math.min(positive, weightedNegative);
      accumulator.signal += Math.max(positive, weightedNegative);
      return accumulator;
    },
    { overlap: 0, signal: 0 },
  );
  const contradiction = totals.signal ? totals.overlap / totals.signal : 0;
  const clarityFactor = 0.75 + 0.25 * (1 - contradiction);
  const breadthFactor = 0.8 + 0.2 * dimensionCoverage;
  const value = clamp(100 * answerCoverage * clarityFactor * breadthFactor, 0, 100);

  return Object.freeze({
    value,
    substantive,
    answerCoverage,
    dimensionCoverage,
    contradiction,
    level: value < 50 ? "low" : value < 75 ? "medium" : "high",
  });
};

const getBroadDirections = (ranked) => {
  const sectors = new Map();
  for (const result of ranked) {
    const current = sectors.get(result.profession.sector) ?? [];
    current.push(result.score);
    sectors.set(result.profession.sector, current);
  }

  const sectorScores = [...sectors].map(([sector, scores]) => ({
    sector,
    score: Math.max(...scores),
  }));
  const bestScore = Math.max(...sectorScores.map(({ score }) => score), 0);
  return sectorScores
    .filter(({ score }) => bestScore - score < 2)
    .sort((first, second) =>
      first.sector.localeCompare(second.sector, "lv"),
    )
    .map(({ sector }) => sector);
};

export const evaluateAssessment = ({
  answers = [],
  tieBreakerAnswers = [],
  baseQuestions = questions,
  professionCatalog = professions,
  includedStatuses = DEFAULT_INCLUDED_STATUSES,
} = {}) => {
  const dimensionProfile = calculateDimensionProfile({
    answers,
    tieBreakerAnswers,
    baseQuestions,
  });
  const ranked = rankProfessions({
    dimensionProfile,
    professionCatalog,
    includedStatuses,
  });
  const confidence = calculateConfidence({
    answers,
    dimensionProfile,
    baseQuestions,
  });
  const topGap =
    ranked.length >= 2 ? ranked[0].score - ranked[1].score : Number.POSITIVE_INFINITY;
  const topThreeRange =
    ranked.length >= 3 ? ranked[0].score - ranked[2].score : Number.POSITIVE_INFINITY;
  const lowInformation =
    confidence.substantive < MIN_SUBSTANTIVE_FOR_TIE_BREAKER ||
    confidence.level === "low";
  const exactTopTie = ranked.length >= 2 && Math.abs(topGap) < 1e-10;

  return Object.freeze({
    dimensionProfile,
    ranked: Object.freeze(ranked),
    topThree: Object.freeze(ranked.slice(0, 3)),
    leader: lowInformation || exactTopTie ? null : ranked[0] ?? null,
    confidence,
    lowInformation,
    resultMode: lowInformation ? "broad" : "ranked",
    exactTopTie,
    topGap,
    topThreeRange,
    closeResults: topThreeRange < 7,
    broadDirections: Object.freeze(getBroadDirections(ranked)),
  });
};

export const shouldAskTieBreaker = (evaluation) =>
  Boolean(
    evaluation &&
      !evaluation.lowInformation &&
      evaluation.ranked.length >= 2 &&
      evaluation.topGap < TIE_BREAKER_THRESHOLD,
  );

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
        evidence: userEvidence.evidence,
        direction: userEvidence.direction,
        professionValue,
        agreement,
        strength: agreement * userEvidence.evidence,
      };
    })
    .filter(({ strength, direction }) => strength > 0 && direction > 0)
    .sort((first, second) => second.strength - first.strength)
    .slice(0, limit);

const scoreTargetProfession = ({
  targetProfessionId,
  answers,
  tieBreakerAnswers,
  baseQuestions,
  professionCatalog,
}) => {
  const target = professionCatalog.find(
    (profession) => profession.id === targetProfessionId,
  );
  if (!target) return null;
  const profile = calculateDimensionProfile({
    answers,
    tieBreakerAnswers,
    baseQuestions,
  });
  return scoreProfession(profile, target).score;
};

export const getAnswerContributions = ({
  targetProfessionId,
  answers = [],
  tieBreakerAnswers = [],
  baseQuestions = questions,
  professionCatalog = professions,
  limit = 3,
} = {}) => {
  const fullScore = scoreTargetProfession({
    targetProfessionId,
    answers,
    tieBreakerAnswers,
    baseQuestions,
    professionCatalog,
  });
  if (fullScore === null) return [];

  const baseLookup = Object.fromEntries(
    baseQuestions.map((question) => [question.id, question]),
  );
  const allSelections = [
    ...getValidSelections(answers, baseLookup).map((selection) => ({
      ...selection,
      source: "base",
    })),
    ...getValidSelections(tieBreakerAnswers, tieBreakerQuestionById).map(
      (selection) => ({ ...selection, source: "tie" }),
    ),
  ].filter(({ option }) => !option.isNeutral);

  return allSelections
    .map(({ answer, question, option, source }) => {
      const nextAnswers =
        source === "base"
          ? answers.filter((candidate) => candidate?.questionId !== answer.questionId)
          : answers;
      const nextTieAnswers =
        source === "tie"
          ? tieBreakerAnswers.filter(
              (candidate) => candidate?.questionId !== answer.questionId,
            )
          : tieBreakerAnswers;
      const withoutScore = scoreTargetProfession({
        targetProfessionId,
        answers: nextAnswers,
        tieBreakerAnswers: nextTieAnswers,
        baseQuestions,
        professionCatalog,
      });
      return {
        questionId: question.id,
        question: question.prompt,
        questionType: question.type ?? "tie-breaker",
        optionId: option.id,
        answer: option.label,
        contribution: fullScore - withoutScore,
      };
    })
    .filter(({ contribution }) => contribution > 0)
    .sort((first, second) => second.contribution - first.contribution)
    .slice(0, limit);
};

export const replaceAnswer = (answers, nextAnswer) => {
  const copy = answers.filter(
    (answer) => answer?.questionId !== nextAnswer.questionId,
  );
  copy.push({ ...nextAnswer });
  return copy;
};

export const getSelectedOption = (answer) => {
  const question = questionById[answer?.questionId] ??
    tieBreakerQuestionById[answer?.questionId];
  return findOption(question, answer?.optionId) ?? null;
};
