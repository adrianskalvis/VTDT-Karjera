import assert from "node:assert/strict";
import test from "node:test";

import { professions } from "../data/professions.js";
import { getQuestionsForMode } from "../data/questions.js";
import { evaluateAssessment } from "../js/scoring.js";
import { personas } from "./personas.js";

const evaluatePersona = (persona, modeId) => {
  const baseQuestions = getQuestionsForMode(modeId);
  const ids = new Set(baseQuestions.map(({ id }) => id));
  return evaluateAssessment({
    answers: persona.answers.filter(({ questionId }) => ids.has(questionId)),
    baseQuestions,
  });
};

test("ir viena loģiska persona katrai no 13 profesijām", () => {
  assert.equal(personas.length, 13);
  assert.equal(new Set(personas.map(({ targetProfessionId }) => targetProfessionId)).size, 13);
  assert.deepEqual(
    [...personas.map(({ targetProfessionId }) => targetProfessionId)].sort(),
    [...professions.map(({ id }) => id)].sort(),
  );
  assert.ok(personas.every(({ rationale }) => rationale.length >= 40));
});

test("pirms precizējumiem visu personu mērķa profesija ir padziļinātā Top 2", (context) => {
  for (const persona of personas) {
    const evaluation = evaluatePersona(persona, "deep");
    const rank = evaluation.ranked.findIndex(
      ({ profession }) => profession.id === persona.targetProfessionId,
    ) + 1;
    context.diagnostic(
      `${persona.targetProfessionId}: #${rank}, ${evaluation.ranked[rank - 1].score.toFixed(2)}`,
    );
    assert.ok(rank >= 1 && rank <= 2, `${persona.id}: #${rank}`);
  }
});

test("ātrajā režīmā visu personu mērķa profesija ir Top 3", (context) => {
  for (const persona of personas) {
    const evaluation = evaluatePersona(persona, "quick");
    const rank = evaluation.ranked.findIndex(
      ({ profession }) => profession.id === persona.targetProfessionId,
    ) + 1;
    context.diagnostic(
      `${persona.targetProfessionId}: #${rank}, ${evaluation.ranked[rank - 1].score.toFixed(2)}`,
    );
    assert.ok(rank >= 1 && rank <= 3, `${persona.id}: #${rank}`);
  }
});

test("personas ir informatīvas un izmanto gan pozitīvas, gan negatīvas atbildes", () => {
  for (const persona of personas) {
    const optionIds = persona.answers.map(({ optionId }) => optionId);
    assert.equal(optionIds.length, 18, persona.id);
    assert.ok(optionIds.every((id) => id !== "unknown"), persona.id);
    assert.ok(optionIds.some((id) => id === "yes" || id === "rather_yes"));
    assert.ok(optionIds.some((id) => id === "no" || id === "rather_no"));
  }
});
