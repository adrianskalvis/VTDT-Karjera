import assert from "node:assert/strict";
import test from "node:test";

import { getQuestionsForMode } from "../data/questions.js";
import { evaluateAssessment } from "../js/scoring.js";
import { studentJourneys } from "./student-journeys.js";

const evaluateJourney = (journey, modeId) => {
  const baseQuestions = getQuestionsForMode(modeId);
  const ids = new Set(baseQuestions.map(({ id }) => id));
  return evaluateAssessment({
    answers: journey.answers.filter(({ questionId }) => ids.has(questionId)),
    baseQuestions,
  });
};

test("desmit atšķirīgi jauniešu profili ir dokumentēti", () => {
  assert.equal(studentJourneys.length, 10);
  assert.equal(new Set(studentJourneys.map(({ id }) => id)).size, 10);
  assert.ok(studentJourneys.every(({ description }) => description.length >= 45));
});

for (const modeId of ["quick", "deep"]) {
  test(`${modeId}: deviņiem informatīviem profiliem Top 3 ir loģisks virziens`, (context) => {
    const informative = studentJourneys.filter(({ expectedProfessionIds }) => expectedProfessionIds.length);
    const firstPlaces = new Set();
    for (const journey of informative) {
      const evaluation = evaluateJourney(journey, modeId);
      const topThreeIds = evaluation.topThree.map(({ profession }) => profession.id);
      firstPlaces.add(evaluation.ranked[0].profession.id);
      context.diagnostic(`${journey.id}: ${topThreeIds.join(", ")}`);
      assert.ok(
        journey.expectedProfessionIds.some((id) => topThreeIds.includes(id)),
        `${journey.id}: ${topThreeIds.join(", ")}`,
      );
    }
    assert.ok(firstPlaces.size >= 5, `Pirmās vietas pārstāv tikai ${firstPlaces.size} virzienus.`);
  });
}

test("tukšai atbilžu vēsturei nav piespiedu profesijas", () => {
  for (const modeId of ["quick", "deep"]) {
    const baseQuestions = getQuestionsForMode(modeId);
    const evaluation = evaluateAssessment({ answers: [], baseQuestions });
    assert.equal(evaluation.lowInformation, true);
    assert.equal(evaluation.leader, null);
  }
});

test("vizuāli radošam profilam apģērbu dizains ir Top 3 abos režīmos", () => {
  const journey = studentJourneys.find(({ id }) => id === "visual_creator");
  for (const modeId of ["quick", "deep"]) {
    const evaluation = evaluateJourney(journey, modeId);
    assert.ok(
      evaluation.topThree.some(
        ({ profession }) => profession.id === "apgerbu_dizainera_asistents",
      ),
      `${modeId}: ${evaluation.topThree.map(({ profession }) => profession.id).join(", ")}`,
    );
  }
});

test("digitāla radītāja ātrais scenārijs dod programmēšanu Top 3", () => {
  const journey = studentJourneys.find(({ id }) => id === "digital_creator");
  const evaluation = evaluateJourney(journey, "quick");
  assert.ok(
    evaluation.topThree.some(({ profession }) => profession.id === "programmesanas_tehnikis"),
  );
});
