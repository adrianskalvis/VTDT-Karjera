import { questions } from "../data/questions.js";

const answersFrom = (optionIds) => {
  if (optionIds.length !== questions.length) {
    throw new Error(`Skolēna profilam vajadzīgas ${questions.length} atbildes.`);
  }
  return questions.map(({ id }, index) => ({ questionId: id, optionId: optionIds[index] }));
};

const journey = (id, description, expectedProfessionIds, optionIds) =>
  Object.freeze({
    id,
    description,
    expectedProfessionIds: Object.freeze(expectedProfessionIds),
    answers: Object.freeze(answersFrom(optionIds)),
  });

export const studentJourneys = Object.freeze([
  journey(
    "digital_creator",
    "Patīk veidot digitālus risinājumus, uzlabot sīkumus un strādāt patstāvīgi.",
    ["programmesanas_tehnikis", "datorsistemu_tehnikis"],
    ["yes", "no", "yes", "rather_yes", "no", "yes", "rather_yes", "rather_no", "yes", "yes", "no", "yes", "rather_no", "yes", "no", "no", "rather_yes", "rather_yes"],
  ),
  journey(
    "computer_troubleshooter",
    "Grib atrast kļūmes, pārbaudīt faktus un saprast ierīču darbību.",
    ["datorsistemu_tehnikis", "elektrotehnikis", "programmesanas_tehnikis"],
    ["yes", "rather_no", "yes", "rather_no", "rather_no", "rather_no", "yes", "yes", "rather_no", "yes", "no", "yes", "no", "yes", "no", "no", "yes", "rather_yes"],
  ),
  journey(
    "visual_creator",
    "Domā vizuāli, pamana detaļas un grib rūpīgi izveidot glītu rezultātu.",
    ["apgerbu_dizainera_asistents", "arhitekturas_tehnikis", "mebelu_galdnieks"],
    ["rather_no", "yes", "yes", "yes", "rather_no", "no", "rather_yes", "no", "yes", "rather_no", "no", "yes", "yes", "rather_no", "no", "yes", "no", "yes"],
  ),
  journey(
    "active_team_builder",
    "Vēlas kustīgu darbu, taustāmu rezultātu un kopā īstenotu plānu.",
    ["eku_buvtehnikis", "namdaris", "apdares_darbu_tehnikis"],
    ["rather_no", "yes", "rather_yes", "yes", "yes", "rather_yes", "rather_yes", "no", "rather_no", "no", "rather_yes", "rather_yes", "rather_no", "rather_yes", "rather_no", "yes", "rather_yes", "yes"],
  ),
  journey(
    "nature_observer",
    "Patīk daba, kustīga diena, ilgāki procesi un lēmumi pēc novērojumiem.",
    ["augkopibas_tehnikis", "lauksaimniecibas_mehanizacijas_tehnikis"],
    ["rather_no", "yes", "rather_yes", "no", "yes", "yes", "rather_yes", "no", "rather_no", "no", "rather_no", "yes", "rather_yes", "yes", "yes", "rather_no", "rather_no", "rather_yes"],
  ),
  journey(
    "machine_explorer",
    "Aizrauj mehānismi, diagnostika, kustīgas detaļas un praktiska pārbaude.",
    ["automehanikis", "lauksaimniecibas_mehanizacijas_tehnikis", "autovirsbuvju_remonta_tehnikis"],
    ["yes", "yes", "rather_yes", "rather_no", "yes", "rather_yes", "rather_yes", "yes", "rather_no", "no", "yes", "yes", "rather_yes", "yes", "rather_no", "rather_yes", "yes", "rather_yes"],
  ),
  journey(
    "careful_system_checker",
    "Rūpīgi pārbauda secību, savienojumus un datus pirms darba pabeigšanas.",
    ["elektrotehnikis", "datorsistemu_tehnikis", "programmesanas_tehnikis"],
    ["yes", "rather_no", "yes", "rather_no", "rather_no", "no", "yes", "yes", "no", "yes", "rather_no", "yes", "no", "yes", "no", "no", "yes", "yes"],
  ),
  journey(
    "workshop_maker",
    "Patīk darbnīca, precīzas formas, materiāli un redzams gala rezultāts.",
    ["mebelu_galdnieks", "namdaris", "autovirsbuvju_remonta_tehnikis"],
    ["rather_no", "yes", "yes", "yes", "rather_yes", "no", "yes", "rather_no", "rather_no", "no", "rather_no", "yes", "yes", "rather_no", "no", "yes", "yes", "rather_yes"],
  ),
  journey(
    "space_planner",
    "Iztēlojas telpu, plāno soļus un pārbauda idejas pirms īstenošanas.",
    ["arhitekturas_tehnikis", "eku_buvtehnikis", "mebelu_galdnieks"],
    ["rather_no", "rather_yes", "yes", "yes", "rather_no", "no", "yes", "no", "yes", "rather_no", "no", "yes", "yes", "yes", "no", "yes", "rather_no", "yes"],
  ),
  journey(
    "balanced_interests",
    "Intereses ir plašas, un atbildes dalās starp vairākiem darba stiliem bez izteiktas galējības.",
    [],
    ["rather_no", "rather_yes", "rather_no", "rather_yes", "rather_no", "rather_no", "rather_yes", "rather_no", "rather_yes", "rather_yes", "rather_no", "rather_yes", "rather_no", "rather_yes", "rather_no", "rather_no", "rather_yes", "rather_yes"],
  ),
]);
