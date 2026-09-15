import { questions } from "../data/questions.js";

const createAnswers = (optionIds) => {
  if (optionIds.length !== questions.length) {
    throw new Error(`Personai vajadzīgas ${questions.length} atbildes.`);
  }
  return questions.map((question, index) => ({
    questionId: question.id,
    optionId: optionIds[index],
  }));
};

const persona = (id, targetProfessionId, rationale, optionIds) =>
  Object.freeze({
    id,
    targetProfessionId,
    rationale,
    answers: Object.freeze(createAnswers(optionIds)),
  });

export const personas = Object.freeze([
  persona(
    "persona_apparel",
    "apgerbu_dizainera_asistents",
    "Vizuāli radoša, pacietīga un precīza jauniete, kurai patīk materiāla detaļas un patstāvīgs darbs.",
    ["no", "rather_yes", "yes", "rather_yes", "no", "no", "rather_no", "no", "rather_yes", "rather_no", "no", "rather_yes", "rather_yes", "rather_no", "no", "rather_yes", "no", "rather_no"],
  ),
  persona(
    "persona_agricultural_machinery",
    "lauksaimniecibas_mehanizacijas_tehnikis",
    "Praktisks sistēmu domātājs, kurš pieņem darbu ārā, kustību un lielu mehānismu diagnostiku.",
    ["rather_yes", "yes", "rather_yes", "no", "yes", "yes", "rather_yes", "rather_yes", "no", "rather_no", "yes", "rather_yes", "rather_no", "rather_yes", "rather_yes", "rather_no", "rather_yes", "rather_no"],
  ),
  persona(
    "persona_crop",
    "augkopibas_tehnikis",
    "Pacietīgs dabas procesu vērotājs, kurš labprāt strādā ārā un lēmumus pārbauda ar datiem.",
    ["rather_no", "yes", "rather_yes", "no", "yes", "yes", "rather_no", "rather_no", "no", "rather_no", "rather_no", "rather_yes", "rather_no", "rather_yes", "yes", "rather_no", "rather_no", "rather_no"],
  ),
  persona(
    "persona_furniture",
    "mebelu_galdnieks",
    "Pacietīgs meistars, kuram svarīgs taustāms rezultāts, precīzas detaļas un koncentrēts darbs.",
    ["no", "yes", "yes", "no", "no", "no", "yes", "no", "yes", "rather_no", "rather_no", "yes", "rather_yes", "rather_no", "no", "yes", "rather_no", "rather_no"],
  ),
  persona(
    "persona_finishing",
    "apdares_darbu_tehnikis",
    "Praktisks un pacietīgs darītājs, kuru gandarī redzama, glīta un precīzi pabeigta pārvērtība.",
    ["no", "rather_yes", "rather_yes", "yes", "yes", "no", "rather_yes", "no", "rather_yes", "rather_no", "rather_no", "rather_yes", "yes", "no", "rather_no", "rather_yes", "no", "yes"],
  ),
  persona(
    "persona_building",
    "eku_buvtehnikis",
    "Komandas koordinētājs, kuram patīk plānot posmus, redzēt lielu rezultātu un ievērot secību.",
    ["rather_no", "yes", "rather_yes", "yes", "rather_yes", "rather_yes", "rather_yes", "no", "yes", "no", "rather_no", "rather_yes", "rather_no", "rather_yes", "no", "rather_no", "rather_no", "yes"],
  ),
  persona(
    "persona_carpenter",
    "namdaris",
    "Fiziski aktīvs komandas darītājs ar telpisku domāšanu un interesi par lielu taustāmu rezultātu.",
    ["no", "yes", "rather_yes", "rather_yes", "yes", "rather_yes", "rather_yes", "no", "rather_no", "no", "rather_no", "rather_yes", "rather_yes", "rather_no", "no", "rather_yes", "rather_no", "rather_yes"],
  ),
  persona(
    "persona_architecture",
    "arhitekturas_tehnikis",
    "Telpiski un vizuāli domājošs plānotājs, kurš spēj ilgi koncentrēties un saskaņot ideju ar prasībām.",
    ["rather_no", "rather_no", "rather_yes", "yes", "no", "rather_yes", "rather_yes", "no", "yes", "rather_yes", "rather_no", "yes", "rather_yes", "rather_yes", "rather_no", "rather_no", "rather_no", "yes"],
  ),
  persona(
    "persona_computer_systems",
    "datorsistemu_tehnikis",
    "Sistemātisks kļūdu meklētājs, kuru interesē savienojumi, sistēmu daļas un droša pārbaude.",
    ["yes", "rather_no", "rather_yes", "no", "no", "no", "rather_yes", "rather_yes", "rather_no", "yes", "rather_no", "yes", "rather_no", "rather_yes", "no", "rather_no", "yes", "rather_yes"],
  ),
  persona(
    "persona_programming",
    "programmesanas_tehnikis",
    "Patstāvīgs loģikas risinātājs, kuram patīk pārbaudīt idejas, plānot soļus un meklēt jaunus variantus.",
    ["rather_yes", "no", "rather_yes", "rather_no", "no", "no", "rather_yes", "rather_no", "rather_yes", "yes", "no", "yes", "rather_no", "yes", "no", "no", "rather_yes", "rather_yes"],
  ),
  persona(
    "persona_auto",
    "automehanikis",
    "Praktisks diagnostikas domātājs, kurš grib saprast kustību, atrast cēloni un pārbaudīt rezultātu.",
    ["rather_yes", "yes", "rather_yes", "no", "rather_no", "rather_no", "rather_yes", "yes", "no", "rather_no", "yes", "rather_yes", "rather_yes", "rather_yes", "rather_no", "rather_yes", "yes", "rather_no"],
  ),
  persona(
    "persona_bodywork",
    "autovirsbuvju_remonta_tehnikis",
    "Praktisks, vizuāli precīzs un pacietīgs darītājs, kuram svarīga formas un virsmas atjaunošana.",
    ["rather_no", "yes", "yes", "rather_yes", "no", "no", "rather_yes", "rather_yes", "rather_no", "rather_no", "rather_yes", "rather_yes", "yes", "rather_no", "no", "rather_yes", "rather_yes", "rather_no"],
  ),
  persona(
    "persona_electrical",
    "elektrotehnikis",
    "Precīzs sistēmu pārbaudītājs, kuram svarīga secība, drošība, mērījumi un praktisks rezultāts.",
    ["rather_yes", "yes", "rather_yes", "rather_no", "no", "rather_no", "yes", "yes", "rather_yes", "rather_no", "rather_yes", "yes", "no", "yes", "rather_no", "rather_no", "yes", "rather_yes"],
  ),
]);
