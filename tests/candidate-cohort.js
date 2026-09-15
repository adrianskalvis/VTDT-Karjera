import { DIMENSION_GROUPS, dimensionIds, dimensions, dimensionsByGroup } from "../data/dimensions.js";
import { professions } from "../data/professions.js";
import {
  ASSESSMENT_MODES,
  getQuestionsForMode,
} from "../data/questions.js";
import {
  evaluateAssessment,
  selectNextTieBreaker,
  shouldAskTieBreaker,
} from "../js/scoring.js";

const clamp = (value, minimum = 0.05, maximum = 0.95) =>
  Math.min(maximum, Math.max(minimum, value));

const stringHash = (value) => {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const deterministicJitter = (key) =>
  (((stringHash(key) % 2001) / 2000) * 2 - 1) * 0.055;

const CORE_DIMENSIONS = Object.freeze({
  apgerbu_dizainera_asistents: ["textileDesign", "artistic", "precisionPatience"],
  lauksaimniecibas_mehanizacijas_tehnikis: [
    "agriculturalMachinery",
    "mechanicsDiagnostics",
    "realistic",
  ],
  augkopibas_tehnikis: ["plantProcesses", "outdoorWork", "investigative"],
  mebelu_galdnieks: ["woodworking", "precisionPatience", "realistic"],
  apdares_darbu_tehnikis: [
    "artistic",
    "constructionCoordination",
    "precisionPatience",
    "physicalWork",
  ],
  eku_buvtehnikis: [
    "constructionCoordination",
    "enterprising",
    "teamwork",
    "conventional",
  ],
  namdaris: ["woodworking", "constructionCoordination", "physicalWork", "outdoorWork"],
  arhitekturas_tehnikis: ["spatialDrawing", "artistic", "precisionPatience"],
  datorsistemu_tehnikis: ["hardwareNetworks", "investigative", "precisionPatience"],
  programmesanas_tehnikis: ["programming", "investigative", "independentFocus"],
  automehanikis: ["mechanicsDiagnostics", "investigative", "realistic"],
  autovirsbuvju_remonta_tehnikis: [
    "metalBodywork",
    "realistic",
    "precisionPatience",
  ],
  elektrotehnikis: ["electricityEnergy", "precisionPatience", "conventional"],
});

const VARIANTS = Object.freeze([
  {
    id: "prototype",
    label: "izteikts profesijas pamata profils",
    offsets: {},
  },
  {
    id: "quiet",
    label: "klusāks un patstāvīgāks kandidāts",
    offsets: { social: -0.3, teamwork: -0.22, independentFocus: 0.25 },
  },
  {
    id: "collaborative",
    label: "sabiedriskāks komandas cilvēks",
    offsets: { social: 0.28, teamwork: 0.28, independentFocus: -0.16 },
  },
  {
    id: "creative",
    label: "radošāks kandidāts ar to pašu profesionālo interesi",
    offsets: { artistic: 0.25, conventional: -0.14, enterprising: 0.1 },
  },
  {
    id: "analytical",
    label: "analītiskāks un mazāk vizuāli orientēts kandidāts",
    offsets: { investigative: 0.24, artistic: -0.16, precisionPatience: 0.12 },
  },
  {
    id: "methodical",
    label: "ļoti rūpīgs un secīgs kandidāts",
    offsets: { conventional: 0.24, precisionPatience: 0.22, enterprising: -0.1 },
  },
  {
    id: "active",
    label: "fiziski aktīvāks kandidāts",
    offsets: { physicalWork: 0.26, outdoorWork: 0.14, independentFocus: -0.12 },
  },
  {
    id: "indoor",
    label: "kandidāts, kurš izvairās no darba ārā",
    offsets: { outdoorWork: -0.38, physicalWork: -0.14, independentFocus: 0.1 },
  },
  {
    id: "flexible",
    label: "elastīgāks un mazāk procesuāls kandidāts",
    offsets: { enterprising: 0.22, conventional: -0.22, teamwork: 0.1 },
  },
  {
    id: "developing",
    label: "vēl svārstīgs kandidāts ar skaidru galveno interesi",
    intensity: 0.72,
    offsets: { social: 0.08, artistic: 0.07, investigative: 0.07 },
  },
]);

const makePreferences = (profession, variant) => {
  const core = new Set(CORE_DIMENSIONS[profession.id]);
  const intensity = variant.intensity ?? 1;
  return Object.freeze(
    Object.fromEntries(
      dimensionIds.map((dimensionId) => {
        const centred = 0.5 + intensity * (profession.profile[dimensionId] - 0.5);
        const offset = core.has(dimensionId)
          ? 0
          : variant.offsets[dimensionId] ?? 0;
        const jitter = core.has(dimensionId)
          ? 0
          : deterministicJitter(`${profession.id}:${variant.id}:${dimensionId}`);
        const coreMinimum = core.has(dimensionId) ? 0.72 : 0.05;
        return [dimensionId, clamp(centred + offset + jitter, coreMinimum)];
      }),
    ),
  );
};

const dimensionFormulaWeight = Object.freeze(
  Object.fromEntries(
    dimensionIds.map((dimensionId) => {
      const group = DIMENSION_GROUPS[dimensions[dimensionId].group];
      return [
        dimensionId,
        group.weight / dimensionsByGroup[group.id].length,
      ];
    }),
  ),
);

const RESPONSE_VECTORS = Object.freeze({
  c17_programs_devices: { programming: 1, hardwareNetworks: -1 },
  c18_mechanics_bodywork: { mechanicsDiagnostics: 1, metalBodywork: -1 },
  c19_plants_machinery: { plantProcesses: 1, agriculturalMachinery: -1 },
  c20_drawings_site: { spatialDrawing: 1, constructionCoordination: -0.6 },
  c21_surfaces_structures: { artistic: 0.5, woodworking: -0.8, constructionCoordination: -0.4 },
  c22_wood_details: { woodworking: 1 },
  c23_circuits_mechanics: { electricityEnergy: 1, mechanicsDiagnostics: -1 },
  c24_coordinate_craft: { enterprising: 1, woodworking: -1 },
  c25_fabric_solid: { textileDesign: 1, woodworking: -1 },
  c26_large_fine_wood: { constructionCoordination: 0.5, physicalWork: 0.5, outdoorWork: 0.3, precisionPatience: -0.4 },
  c27_spaces_clothes: { spatialDrawing: 1, textileDesign: -1 },
  c28_drawings_algorithms: { spatialDrawing: 1, programming: -1 },
  c29_circuits_computers: { electricityEnergy: 1, hardwareNetworks: -1 },
  c30_wood_metal: { woodworking: 1, metalBodywork: -1 },
  c31_surfaces_fabric: { constructionCoordination: 0.8, physicalWork: 0.4, textileDesign: -1 },
});

const questionSignal = (preferences, question) => {
  let signed = 0;
  let total = 0;
  const responseVector = RESPONSE_VECTORS[question.id] ?? question.vector;
  for (const [dimensionId, vectorWeight] of Object.entries(responseVector)) {
    const weight = dimensionFormulaWeight[dimensionId] * Math.abs(vectorWeight);
    signed +=
      dimensionFormulaWeight[dimensionId] *
      vectorWeight *
      (2 * preferences[dimensionId] - 1);
    total += weight;
  }
  return total ? signed / total : 0;
};

const answerForQuestion = (candidate, question) => {
  const signal = questionSignal(candidate.preferences, question);
  const shifted = signal + deterministicJitter(`${candidate.id}:${question.id}`) * 0.75;
  if (shifted >= 0.34) return "yes";
  if (shifted >= 0) return "rather_yes";
  if (shifted > -0.34) return "rather_no";
  return "no";
};

export const candidateCohort = Object.freeze(
  professions.flatMap((profession) =>
    VARIANTS.map((variant) => {
      const candidate = {
        id: `${profession.id}__${variant.id}`,
        targetProfessionId: profession.id,
        targetSector: profession.sector,
        variantId: variant.id,
        description: `${profession.title}: ${variant.label}.`,
        preferences: makePreferences(profession, variant),
      };
      return Object.freeze(candidate);
    }),
  ),
);

export const simulateCandidate = (candidate, modeId) => {
  const mode = ASSESSMENT_MODES[modeId];
  const baseQuestions = getQuestionsForMode(modeId);
  const answers = baseQuestions.map((question) => ({
    questionId: question.id,
    optionId: answerForQuestion(candidate, question),
  }));
  const tieBreakerAnswers = [];
  const tieBreakerQuestionIds = [];
  let evaluation = evaluateAssessment({ answers, baseQuestions });

  while (
    shouldAskTieBreaker(evaluation, {
      modeId,
      askedCount: tieBreakerAnswers.length,
    }) && tieBreakerAnswers.length < mode.maxClarifiers
  ) {
    const question = selectNextTieBreaker({
      evaluation,
      answers,
      tieBreakerAnswers,
      baseQuestions,
      modeId,
    });
    if (!question) break;
    tieBreakerQuestionIds.push(question.id);
    tieBreakerAnswers.push({
      questionId: question.id,
      optionId: answerForQuestion(candidate, question),
    });
    evaluation = evaluateAssessment({ answers, tieBreakerAnswers, baseQuestions });
  }

  const targetRank =
    evaluation.ranked.findIndex(
      ({ profession }) => profession.id === candidate.targetProfessionId,
    ) + 1;
  const topSector = evaluation.ranked[0]?.profession.sector ?? null;
  const topThreeSectors = new Set(
    evaluation.topThree.map(({ profession }) => profession.sector),
  );

  return Object.freeze({
    candidate,
    answers: Object.freeze(answers),
    tieBreakerAnswers: Object.freeze(tieBreakerAnswers),
    tieBreakerQuestionIds: Object.freeze(tieBreakerQuestionIds),
    evaluation,
    targetRank,
    topSector,
    targetSectorTopOne: topSector === candidate.targetSector,
    targetSectorInTopThree: topThreeSectors.has(candidate.targetSector),
  });
};

export const auditCandidateCohort = (modeId) => {
  const results = candidateCohort.map((candidate) =>
    simulateCandidate(candidate, modeId),
  );
  const byProfession = Object.fromEntries(
    professions.map((profession) => {
      const professionResults = results.filter(
        ({ candidate }) => candidate.targetProfessionId === profession.id,
      );
      return [
        profession.id,
        Object.freeze({
          count: professionResults.length,
          topOne: professionResults.filter(({ targetRank }) => targetRank === 1).length,
          topThree: professionResults.filter(({ targetRank }) => targetRank <= 3).length,
          sectorTopOne: professionResults.filter(({ targetSectorTopOne }) => targetSectorTopOne).length,
          sectorTopThree: professionResults.filter(({ targetSectorInTopThree }) => targetSectorInTopThree).length,
          meanRank:
            professionResults.reduce((sum, { targetRank }) => sum + targetRank, 0) /
            professionResults.length,
        }),
      ];
    }),
  );
  return Object.freeze({
    modeId,
    count: results.length,
    results: Object.freeze(results),
    byProfession: Object.freeze(byProfession),
    topOne: results.filter(({ targetRank }) => targetRank === 1).length,
    topThree: results.filter(({ targetRank }) => targetRank <= 3).length,
    sectorTopOne: results.filter(({ targetSectorTopOne }) => targetSectorTopOne).length,
    sectorTopThree: results.filter(({ targetSectorInTopThree }) => targetSectorInTopThree).length,
  });
};
