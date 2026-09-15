import { dimensionIds } from "./dimensions.js?v=2026.6";

export const ASSESSMENT_VERSION = "2026.6";
export const QUESTION_EFFECT_CAP = 1;

export const ANSWER_SCALE = Object.freeze([
  Object.freeze({ id: "yes", label: "Jā", coefficient: 2 }),
  Object.freeze({ id: "rather_yes", label: "Drīzāk jā", coefficient: 1 }),
  Object.freeze({ id: "rather_no", label: "Drīzāk nē", coefficient: -1 }),
  Object.freeze({ id: "no", label: "Nē", coefficient: -2 }),
]);

const answerIds = new Set(ANSWER_SCALE.map(({ id }) => id));

const freezeVector = (effects) =>
  Object.freeze(
    Object.fromEntries(
      Object.entries(effects).map(([dimensionId, weight]) => {
        if (!dimensionIds.includes(dimensionId)) {
          throw new Error(`Nezināma dimensija jautājumā: ${dimensionId}`);
        }
        return [
          dimensionId,
          Math.max(-QUESTION_EFFECT_CAP, Math.min(QUESTION_EFFECT_CAP, weight)),
        ];
      }),
    ),
  );

const makeQuestion = ({ effects, ...question }) =>
  Object.freeze({
    ...question,
    vector: freezeVector(effects),
    options: ANSWER_SCALE,
  });

const baseQuestionSpecs = [
  {
    id: "q01_fault",
    concept: "fault-location",
    prompt: "Ja kaut kas nedarbojas, vai Tu gribi noskaidrot, kas tieši vainīgs?",
    effects: {
      investigative: 1,
      mechanicsDiagnostics: 0.75,
      hardwareNetworks: 0.65,
      electricityEnergy: 0.55,
      programming: 0.45,
      precisionPatience: 0.4,
    },
  },
  {
    id: "q02_tangible",
    concept: "creative-style",
    prompt: "Vai Tev patīk lietām piešķirt savu stilu un izskatu?",
    effects: {
      artistic: 1,
      textileDesign: 0.8,
      spatialDrawing: 0.5,
      woodworking: 0.35,
      metalBodywork: 0.35,
      precisionPatience: 0.3,
    },
  },
  {
    id: "q03_detail",
    concept: "perseverance",
    prompt: "Ja uzdevums apnīk, vai Tu tāpat cīnies līdz galam?",
    effects: {
      independentFocus: 1,
      precisionPatience: 0.9,
      conventional: 0.45,
      programming: 0.35,
      woodworking: 0.35,
      metalBodywork: 0.35,
    },
  },
  {
    id: "q04_spatial",
    concept: "empathy",
    prompt: "Vai Tu spēj iejusties cita cilvēka lomā un sajūtās?",
    effects: {
      social: 1,
      teamwork: 0.8,
      artistic: 0.4,
      enterprising: 0.35,
      textileDesign: 0.25,
      constructionCoordination: 0.25,
    },
  },
  {
    id: "q05_movement",
    concept: "outdoor-preference",
    prompt: "Vai Tu labprāt daļu dienas pavadītu, strādājot ārā?",
    effects: {
      outdoorWork: 1,
      physicalWork: 0.65,
      realistic: 0.5,
      plantProcesses: 0.45,
      agriculturalMachinery: 0.4,
      constructionCoordination: 0.3,
    },
  },
  {
    id: "q06_change",
    concept: "adapting-to-change",
    prompt: "Vai Tu viegli pielāgojies, ja plāns pēkšņi mainās?",
    effects: {
      enterprising: 0.8,
      teamwork: 0.55,
      outdoorWork: 0.35,
      plantProcesses: 0.35,
      investigative: 0.3,
      realistic: 0.2,
    },
  },
  {
    id: "q07_sequence",
    concept: "process-order",
    prompt: "Vai Tev patīk darīt visu noteiktā secībā no sākuma?",
    effects: {
      conventional: 1,
      precisionPatience: 0.6,
      programming: 0.45,
      electricityEnergy: 0.45,
      constructionCoordination: 0.4,
      agriculturalMachinery: 0.3,
    },
  },
  {
    id: "q08_systems",
    concept: "taking-things-apart",
    prompt: "Vai Tev patīk izjaukt lietas un saprast, kā tās darbojas?",
    effects: {
      mechanicsDiagnostics: 1,
      hardwareNetworks: 0.75,
      investigative: 0.7,
      electricityEnergy: 0.6,
      agriculturalMachinery: 0.5,
      realistic: 0.4,
    },
  },
  {
    id: "q09_ideas",
    concept: "draw-before-building",
    prompt: "Vai Tev patīk vispirms uzzīmēt vai izplānot savu ideju?",
    effects: {
      spatialDrawing: 1,
      artistic: 0.75,
      conventional: 0.45,
      constructionCoordination: 0.4,
      programming: 0.35,
      textileDesign: 0.35,
    },
  },
  {
    id: "q10_team",
    concept: "computer-focus",
    prompt: "Vai Tu labprāt pavadītu vairākas stundas pie datora?",
    effects: {
      programming: 0.85,
      independentFocus: 0.65,
      hardwareNetworks: 0.5,
      investigative: 0.35,
      physicalWork: -0.45,
      outdoorWork: -0.45,
    },
  },
  {
    id: "q11_motion",
    concept: "motion-and-force",
    prompt: "Vai Tev patīk saprast, kā darbojas dažādi mehānismi?",
    effects: {
      investigative: 0.55,
      realistic: 0.5,
      mechanicsDiagnostics: 1,
      agriculturalMachinery: 0.5,
      physicalWork: 0.35,
      spatialDrawing: 0.25,
    },
  },
  {
    id: "q12_focus",
    concept: "independent-focus",
    prompt: "Vai Tu vari patstāvīgi pabeigt uzdevumu bez biežas palīdzības?",
    effects: {
      independentFocus: 1,
      precisionPatience: 0.45,
      conventional: 0.45,
      investigative: 0.35,
      programming: 0.55,
      spatialDrawing: 0.4,
    },
  },
  {
    id: "q13_surface",
    concept: "surface-differences",
    prompt: "Vai Tu ātri pamani, ja kaut kas ir šķībs vai nelīdzens?",
    effects: {
      artistic: 0.7,
      precisionPatience: 0.8,
      metalBodywork: 0.9,
      realistic: 0.3,
      spatialDrawing: 0.25,
    },
  },
  {
    id: "q14_measure",
    concept: "evidence-check",
    prompt: "Vai pirms lēmuma Tu pārbaudi faktus, nevis tikai mini?",
    effects: {
      investigative: 0.85,
      conventional: 0.6,
      programming: 0.45,
      electricityEnergy: 0.55,
      plantProcesses: 0.5,
      precisionPatience: 0.4,
    },
  },
  {
    id: "q15_environment",
    concept: "long-term-environment",
    prompt: "Vai Tev patiktu rūpēties par augiem un redzēt, kā tie aug?",
    effects: {
      plantProcesses: 1,
      outdoorWork: 0.6,
      investigative: 0.6,
      realistic: 0.3,
      constructionCoordination: 0.3,
      artistic: 0.2,
    },
  },
  {
    id: "q16_material",
    concept: "material-shaping",
    prompt: "Vai Tev patīk pārveidot materiālus pēc savas ieceres?",
    effects: {
      realistic: 0.8,
      artistic: 0.7,
      woodworking: 0.65,
      metalBodywork: 0.6,
      textileDesign: 0.7,
      precisionPatience: 0.45,
    },
  },
  {
    id: "q17_safety",
    concept: "unsafe-connection",
    prompt: "Vai pirms lietošanas Tu pārbaudi, vai viss darbojas droši?",
    effects: {
      electricityEnergy: 0.8,
      hardwareNetworks: 0.6,
      mechanicsDiagnostics: 0.55,
      investigative: 0.55,
      conventional: 0.45,
      precisionPatience: 0.5,
    },
  },
  {
    id: "q18_planning",
    concept: "forward-planning",
    prompt: "Vai pirms darba sākšanas Tu izdomā, ko darīsi vispirms?",
    effects: {
      enterprising: 0.65,
      conventional: 0.75,
      programming: 0.55,
      constructionCoordination: 0.7,
      teamwork: 0.4,
      social: 0.35,
    },
  },
];

export const QUICK_QUESTION_IDS = Object.freeze([
  "q01_fault",
  "q02_tangible",
  "q03_detail",
  "q04_spatial",
  "q05_movement",
  "q06_change",
  "q07_sequence",
  "q08_systems",
  "q09_ideas",
  "q10_team",
]);

export const questions = Object.freeze(
  baseQuestionSpecs.map((spec, index) =>
    makeQuestion({ ...spec, number: index + 1, type: "base" }),
  ),
);

const clarifierSpecs = [
  {
    id: "c01_hidden_visible",
    concept: "hidden-vs-visible",
    prompt: "Vai Tev vairāk patīk atrast kļūdu nekā mainīt izskatu?",
    effects: { investigative: 0.8, programming: 0.6, hardwareNetworks: 0.6, mechanicsDiagnostics: 0.45, electricityEnergy: 0.45, artistic: -0.75, textileDesign: -0.5, metalBodywork: -0.4, spatialDrawing: -0.3 },
  },
  {
    id: "c02_plan_movement",
    concept: "plan-vs-movement",
    prompt: "Vai Tev labāk patīk skaidrs plāns nekā neparedzama diena?",
    effects: { conventional: 0.75, spatialDrawing: 0.65, programming: 0.35, independentFocus: 0.45, precisionPatience: 0.45, physicalWork: -0.75, outdoorWork: -0.6, realistic: -0.35, agriculturalMachinery: -0.35 },
  },
  {
    id: "c03_team_solo",
    concept: "leading-vs-solo",
    prompt: "Vai Tu labprāt organizē citus, nevis strādā viens?",
    effects: { social: 0.8, enterprising: 0.8, teamwork: 1, constructionCoordination: 0.55, independentFocus: -1, precisionPatience: -0.3 },
  },
  {
    id: "c04_ideas_order",
    concept: "ideas-vs-order",
    prompt: "Vai Tu labāk izmēģini savu ideju nekā seko paraugam?",
    effects: { artistic: 0.9, investigative: 0.35, programming: 0.35, textileDesign: 0.35, conventional: -0.9, precisionPatience: -0.45 },
  },
  {
    id: "c05_logic_material",
    concept: "logic-vs-material",
    prompt: "Vai Tev digitāls rezultāts patīk vairāk nekā paša izgatavots priekšmets?",
    effects: { programming: 0.85, hardwareNetworks: 0.55, investigative: 0.65, electricityEnergy: 0.35, realistic: -0.65, woodworking: -0.55, metalBodywork: -0.55, textileDesign: -0.45, physicalWork: -0.3 },
  },
  {
    id: "c06_nature_room",
    concept: "nature-vs-room",
    prompt: "Vai Tu labprāt strādātu ārā arī mainīgos laikapstākļos?",
    effects: { plantProcesses: 1, outdoorWork: 0.8, investigative: 0.3, conventional: -0.4, spatialDrawing: -0.55, independentFocus: -0.35 },
  },
  {
    id: "c07_large_detail",
    concept: "large-vs-detail",
    prompt: "Vai Tevi vairāk interesē lielas mašīnas nekā sīkas detaļas?",
    effects: { mechanicsDiagnostics: 0.9, agriculturalMachinery: 0.8, realistic: 0.45, physicalWork: 0.45, precisionPatience: -0.7, textileDesign: -0.4, woodworking: -0.4, spatialDrawing: -0.3 },
  },
  {
    id: "c08_look_function",
    concept: "look-vs-function",
    prompt: "Vai gatavā darba izskats Tev ir svarīgāks par tā darbību?",
    effects: { artistic: 0.9, textileDesign: 0.55, metalBodywork: 0.45, spatialDrawing: 0.45, woodworking: 0.3, investigative: -0.55, programming: -0.45, hardwareNetworks: -0.45, electricityEnergy: -0.4, mechanicsDiagnostics: -0.35 },
  },
  {
    id: "c09_measure_create",
    concept: "measure-vs-create",
    prompt: "Vai pirms izvēles Tu vairāk uzticies mērījumiem nekā sajūtām?",
    effects: { conventional: 0.7, electricityEnergy: 0.65, precisionPatience: 0.65, investigative: 0.4, artistic: -0.75, textileDesign: -0.4, enterprising: -0.25 },
  },
  {
    id: "c10_outdoor_indoor",
    concept: "outdoor-vs-indoor",
    prompt: "Vai Tu labprātāk strādātu ārā nekā klusā telpā?",
    effects: { outdoorWork: 1, physicalWork: 0.7, realistic: 0.5, plantProcesses: 0.5, agriculturalMachinery: 0.4, constructionCoordination: 0.3, independentFocus: -0.65, programming: -0.35, textileDesign: -0.25, spatialDrawing: -0.3 },
  },
  {
    id: "c11_parts_image",
    concept: "parts-vs-image",
    prompt: "Vai Tev labāk patīk salikt detaļas nekā zīmēt idejas?",
    effects: { realistic: 0.55, mechanicsDiagnostics: 0.5, hardwareNetworks: 0.45, electricityEnergy: 0.45, woodworking: 0.45, artistic: -0.8, spatialDrawing: -0.45, textileDesign: -0.45, enterprising: -0.2 },
  },
  {
    id: "c12_precision_speed",
    concept: "precision-vs-speed",
    prompt: "Vai Tev svarīgāk darbu izdarīt rūpīgi nekā ātri?",
    effects: { precisionPatience: 0.9, conventional: 0.6, independentFocus: 0.65, woodworking: 0.35, spatialDrawing: 0.35, teamwork: -0.75, social: -0.6, enterprising: -0.65, constructionCoordination: -0.35 },
  },
  {
    id: "c13_long_immediate",
    concept: "long-vs-immediate",
    prompt: "Vai vari pacietīgi strādāt, ja rezultātu redzēsi tikai vēlāk?",
    effects: { plantProcesses: 0.6, constructionCoordination: 0.45, programming: 0.4, independentFocus: 0.4, conventional: 0.25, realistic: -0.45, metalBodywork: -0.4, artistic: -0.35, physicalWork: -0.25 },
  },
  {
    id: "c14_test_design",
    concept: "test-vs-design",
    prompt: "Vai Tev patīk vairākkārt pārbaudīt, vai viss darbojas pareizi?",
    effects: { investigative: 0.75, hardwareNetworks: 0.7, electricityEnergy: 0.6, programming: 0.6, mechanicsDiagnostics: 0.35, artistic: -0.75, textileDesign: -0.5, spatialDrawing: -0.4 },
  },
  {
    id: "c15_joints_surfaces",
    concept: "joints-vs-surfaces",
    prompt: "Vai Tevi vairāk interesē, kā lieta savienota, nevis izskatās?",
    effects: { mechanicsDiagnostics: 0.55, hardwareNetworks: 0.5, electricityEnergy: 0.5, woodworking: 0.45, conventional: 0.3, artistic: -0.65, textileDesign: -0.55, metalBodywork: -0.5 },
  },
  {
    id: "c16_adapt_plan",
    concept: "adapt-vs-plan",
    prompt: "Vai Tu viegli maini savu plānu, ja tas vajadzīgs?",
    effects: { enterprising: 0.6, investigative: 0.45, outdoorWork: 0.4, teamwork: 0.35, plantProcesses: 0.3, conventional: -0.75, precisionPatience: -0.4, independentFocus: -0.3, spatialDrawing: -0.25 },
  },
  {
    id: "c17_programs_devices",
    concept: "programs-vs-devices",
    prompt: "Vai Tevi vairāk aizrauj programmu veidošana nekā ierīču savienošana un iestatīšana?",
    effects: { programming: 1, independentFocus: 0.3, hardwareNetworks: -1, realistic: -0.25 },
  },
  {
    id: "c18_mechanics_bodywork",
    concept: "mechanics-vs-bodywork",
    prompt: "Vai Tevi vairāk saista mehānisku bojājumu atrašana nekā virsbūves formas atjaunošana?",
    effects: { mechanicsDiagnostics: 1, investigative: 0.45, metalBodywork: -1, artistic: -0.3 },
  },
  {
    id: "c19_plants_machinery",
    concept: "plants-vs-machinery",
    prompt: "Vai Tevi vairāk saista augu audzēšana nekā lielu mašīnu regulēšana?",
    effects: { plantProcesses: 1, outdoorWork: 0.3, agriculturalMachinery: -1, mechanicsDiagnostics: -0.4 },
  },
  {
    id: "c20_drawings_site",
    concept: "drawings-vs-site",
    prompt: "Vai Tu labprātāk veidotu precīzus rasējumus nekā organizētu darbu būvobjektā?",
    effects: { spatialDrawing: 1, independentFocus: 0.35, constructionCoordination: -0.7, enterprising: -0.5, physicalWork: -0.3, teamwork: -0.25 },
  },
  {
    id: "c21_surfaces_structures",
    concept: "surfaces-vs-structures",
    prompt: "Vai Tevi vairāk interesē gludu virsmu apdare nekā nesošu konstrukciju veidošana?",
    effects: { artistic: 0.65, precisionPatience: 0.5, textileDesign: -0.8, woodworking: -0.8, metalBodywork: -0.4, constructionCoordination: -0.3 },
  },
  {
    id: "c22_wood_details",
    concept: "wood-details",
    prompt: "Vai Tev patīk precīzi izgatavot un savienot koka detaļas?",
    effects: { woodworking: 1 },
  },
  {
    id: "c23_circuits_mechanics",
    concept: "circuits-vs-mechanics",
    prompt: "Vai Tevi vairāk saista elektrisku shēmu mērīšana nekā mehānisku detaļu remonts?",
    effects: { electricityEnergy: 1, mechanicsDiagnostics: -1 },
  },
  {
    id: "c24_coordinate_craft",
    concept: "coordinate-vs-craft",
    prompt: "Vai Tev vairāk patiktu koordinēt būvdarbus nekā pašam izgatavot detaļas?",
    effects: { enterprising: 1, social: 0.6, conventional: 0.5, constructionCoordination: 0.2, woodworking: -1, physicalWork: -0.7 },
  },
  {
    id: "c25_fabric_solid",
    concept: "fabric-vs-wood",
    prompt: "Vai Tev vairāk patīk veidot no auduma nekā no koka?",
    effects: { textileDesign: 1, woodworking: -1 },
  },
  {
    id: "c26_large_fine_wood",
    concept: "large-vs-fine-woodwork",
    prompt: "Vai Tevi vairāk saista lielas koka konstrukcijas nekā smalku detaļu izgatavošana?",
    effects: { constructionCoordination: 0.65, physicalWork: 0.55, outdoorWork: 0.5, woodworking: 0.4, precisionPatience: -0.7, independentFocus: -0.2 },
  },
  {
    id: "c27_spaces_clothes",
    concept: "spaces-vs-clothes",
    prompt: "Vai Tevi vairāk saista ēku un telpu plāni nekā apģērba skices?",
    effects: { spatialDrawing: 1, constructionCoordination: 0.5, textileDesign: -1, artistic: 0.2 },
  },
  {
    id: "c28_drawings_algorithms",
    concept: "drawings-vs-algorithms",
    prompt: "Vai Tevi vairāk saista telpiski rasējumi nekā algoritmu un programmu veidošana?",
    effects: { spatialDrawing: 1, constructionCoordination: 0.4, programming: -1, artistic: 0.2 },
  },
  {
    id: "c29_circuits_computers",
    concept: "circuits-vs-computers",
    prompt: "Vai Tevi vairāk saista elektriskas iekārtas nekā datoru un tīklu konfigurēšana?",
    effects: { electricityEnergy: 1, physicalWork: 0.2, hardwareNetworks: -1, programming: -0.6 },
  },
  {
    id: "c30_wood_metal",
    concept: "wood-vs-metal",
    prompt: "Vai Tev vairāk patīk veidot no koka nekā no metāla?",
    effects: { woodworking: 1, metalBodywork: -1 },
  },
  {
    id: "c31_surfaces_fabric",
    concept: "building-surfaces-vs-fabric",
    prompt: "Vai Tevi vairāk saista ēku virsmu apdare nekā veidošana no auduma?",
    effects: { constructionCoordination: 0.8, physicalWork: 0.4, textileDesign: -1 },
  },
];

export const tieBreakers = Object.freeze(
  clarifierSpecs.map((spec, index) =>
    makeQuestion({ ...spec, number: index + 1, type: "clarifier" }),
  ),
);

export const ASSESSMENT_MODES = Object.freeze({
  quick: Object.freeze({
    id: "quick",
    title: "Ātrais tests",
    description: "Apmēram 1–2 minūtes. Īsi jautājumi un ātrs Top 3 rezultāts.",
    baseQuestionIds: QUICK_QUESTION_IDS,
    maxClarifiers: 3,
  }),
  deep: Object.freeze({
    id: "deep",
    title: "Padziļinātais tests",
    description: "Apmēram 3 minūtes. Vairāk jautājumu precīzākam salīdzinājumam.",
    baseQuestionIds: Object.freeze(questions.map(({ id }) => id)),
    maxClarifiers: 2,
  }),
});

export const questionById = Object.freeze(
  Object.fromEntries(questions.map((question) => [question.id, question])),
);
export const tieBreakerQuestionById = Object.freeze(
  Object.fromEntries(tieBreakers.map((question) => [question.id, question])),
);
export const answerById = Object.freeze(
  Object.fromEntries(ANSWER_SCALE.map((answer) => [answer.id, answer])),
);

export const isAnswerId = (id) => answerIds.has(id);

export const getQuestionsForMode = (modeId) => {
  const mode = ASSESSMENT_MODES[modeId];
  if (!mode) return [];
  return mode.baseQuestionIds.map((id) => questionById[id]);
};
