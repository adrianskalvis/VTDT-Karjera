import assert from "node:assert/strict";
import test from "node:test";

import { professions } from "../data/professions.js";
import {
  ANSWER_SCALE,
  getQuestionsForMode,
  isAnswerId,
  questions,
} from "../data/questions.js";
import {
  calculateDimensionProfile,
  evaluateAssessment,
  getAppliedEffects,
  replaceAnswer,
} from "../js/scoring.js";
import { personas } from "./personas.js";

const answer = (questionId, optionId) => ({ questionId, optionId });

test("dimensiju vektoru reizina ar fiksēto atbildes koeficientu", () => {
  const question = questions[0];
  assert.equal(getAppliedEffects(question, "yes").investigative, 2);
  assert.equal(getAppliedEffects(question, "rather_yes").investigative, 1);
  assert.equal(getAppliedEffects(question, "rather_no").investigative, -1);
  assert.equal(getAppliedEffects(question, "no").investigative, -2);
  assert.equal(isAnswerId("unknown"), false);
  assert.deepEqual(getAppliedEffects(question, "unknown"), {});
  assert.ok(ANSWER_SCALE.every(({ coefficient }) => coefficient !== 0));
});

test("pozitīva un negatīva atbilde ir simetriska", () => {
  const question = questions[0];
  const positive = calculateDimensionProfile({
    answers: [answer(question.id, "yes")],
    baseQuestions: questions,
  }).values.investigative;
  const negative = calculateDimensionProfile({
    answers: [answer(question.id, "no")],
    baseQuestions: questions,
  }).values.investigative;
  assert.equal(positive.direction, 1);
  assert.equal(negative.direction, -1);
  assert.equal(positive.reliability, negative.reliability);
  assert.equal(positive.target, 1);
  assert.equal(negative.target, 0);
});

test("pretrunīgas atbildes samazina uzticamību līdz neitrālam profilam", () => {
  const profile = calculateDimensionProfile({
    answers: [
      answer("q01_fault", "yes"),
      answer("q08_systems", "no"),
    ],
    baseQuestions: questions,
  });
  assert.ok(Math.abs(profile.values.investigative.direction) < 0.2);
  assert.ok(profile.values.investigative.reliability < 0.2);
});

test("tukšam profilam nav noklusējuma profesijas", () => {
  const baseQuestions = getQuestionsForMode("deep");
  const evaluation = evaluateAssessment({ answers: [], baseQuestions });
  assert.ok(
    evaluation.ranked.every(({ score }) => Math.abs(score - 50) < 1e-10),
  );
  assert.equal(evaluation.leader, null);
  assert.equal(evaluation.lowInformation, true);
  assert.equal(evaluation.resultMode, "broad");
  assert.equal(evaluation.confidence.substantive, 0);
});

test("Top 3 secību veido pilns profils, nevis viena atbilde", () => {
  const persona = personas.find(
    ({ targetProfessionId }) => targetProfessionId === "programmesanas_tehnikis",
  );
  const evaluation = evaluateAssessment({
    answers: persona.answers,
    baseQuestions: questions,
  });
  assert.equal(evaluation.ranked[0].profession.id, persona.targetProfessionId);
  assert.equal(evaluation.topThree.length, 3);
  assert.ok(evaluation.topThree[0].score >= evaluation.topThree[1].score);
  assert.ok(evaluation.topThree[1].score >= evaluation.topThree[2].score);
});

test("informatīvs neizšķirts saglabā kopīgu pirmo vietu", () => {
  const persona = personas[0];
  const first = professions[0];
  const twin = { ...first, id: "synthetic_twin", title: "Sintētisks dvīnis" };
  const evaluation = evaluateAssessment({
    answers: persona.answers,
    baseQuestions: questions,
    professionCatalog: [first, twin],
  });
  assert.equal(evaluation.lowInformation, false);
  assert.equal(evaluation.sharedFirst, true);
  assert.equal(evaluation.sharedLeaders.length, 2);
  assert.equal(evaluation.leader, null);
  assert.ok(Math.abs(evaluation.ranked[0].score - evaluation.ranked[1].score) < 1e-10);
});

test("atbildes maiņa visu rezultātu pārrēķina no vēstures", () => {
  const baseQuestions = getQuestionsForMode("quick");
  const initial = baseQuestions.map(({ id }) => answer(id, "rather_yes"));
  const changed = replaceAnswer(initial, answer(baseQuestions[0].id, "no"));
  const restored = replaceAnswer(changed, answer(baseQuestions[0].id, "rather_yes"));
  const firstEvaluation = evaluateAssessment({ answers: initial, baseQuestions });
  const changedEvaluation = evaluateAssessment({ answers: changed, baseQuestions });
  const restoredEvaluation = evaluateAssessment({ answers: restored, baseQuestions });
  assert.notDeepEqual(
    changedEvaluation.ranked.map(({ score }) => score),
    firstEvaluation.ranked.map(({ score }) => score),
  );
  assert.deepEqual(
    restoredEvaluation.ranked.map(({ score }) => score),
    firstEvaluation.ranked.map(({ score }) => score),
  );
});

test("viena atbilde viena pati nedod praktiski izšķirtu rezultātu", () => {
  let maximumGap = 0;
  let maximumRange = 0;
  for (const question of questions) {
    for (const optionId of ["yes", "rather_yes", "rather_no", "no"]) {
      const evaluation = evaluateAssessment({
        answers: [answer(question.id, optionId)],
        baseQuestions: questions,
      });
      maximumGap = Math.max(maximumGap, evaluation.topGap);
      maximumRange = Math.max(maximumRange, evaluation.topThreeRange);
      assert.equal(evaluation.leader, null);
      assert.ok(evaluation.topGap <= 2.5, `${question.id}/${optionId}: ${evaluation.topGap}`);
      assert.ok(
        evaluation.topThreeRange <= 5,
        `${question.id}/${optionId}: ${evaluation.topThreeRange}`,
      );
      assert.ok(
        evaluation.ranked.filter(
          ({ score }) => evaluation.ranked[0].score - score <= 2.5,
        ).length >= 3,
      );
    }
  }
  assert.ok(maximumGap > 0);
  assert.ok(maximumRange > 0);
});

test("ātrā un padziļinātā režīma rādītāji paliek vienā 0–100 skalā", () => {
  for (const persona of personas) {
    const scores = ["quick", "deep"].map((modeId) => {
      const baseQuestions = getQuestionsForMode(modeId);
      const ids = new Set(baseQuestions.map(({ id }) => id));
      const evaluation = evaluateAssessment({
        answers: persona.answers.filter(({ questionId }) => ids.has(questionId)),
        baseQuestions,
      });
      return evaluation.ranked.find(
        ({ profession }) => profession.id === persona.targetProfessionId,
      ).score;
    });
    assert.ok(scores.every((score) => score >= 0 && score <= 100));
    assert.ok(Math.abs(scores[0] - scores[1]) < 12, persona.id);
  }
});
