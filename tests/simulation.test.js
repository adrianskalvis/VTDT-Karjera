import assert from "node:assert/strict";
import test from "node:test";

import { professions } from "../data/professions.js";
import {
  ANSWER_SCALE,
  ASSESSMENT_MODES,
  getQuestionsForMode,
} from "../data/questions.js";
import {
  evaluateAssessment,
  selectNextTieBreaker,
  shouldAskTieBreaker,
} from "../js/scoring.js";

const PROFILE_COUNT = 30_000;

const mulberry32 = (seed) => () => {
  let value = (seed += 0x6d2b79f5);
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
};

const pickAnswer = (random) =>
  ANSWER_SCALE[Math.floor(random() * ANSWER_SCALE.length)].id;

const simulateMode = ({ modeId, seed, count = PROFILE_COUNT }) => {
  const random = mulberry32(seed);
  const mode = ASSESSMENT_MODES[modeId];
  const baseQuestions = getQuestionsForMode(modeId);
  const topOne = Object.fromEntries(professions.map(({ id }) => [id, 0]));
  const topThree = Object.fromEntries(professions.map(({ id }) => [id, 0]));
  const clarifierCounts = Array(mode.maxClarifiers + 1).fill(0);
  let minimumQuestions = Infinity;
  let maximumQuestions = 0;

  for (let profileIndex = 0; profileIndex < count; profileIndex += 1) {
    const answers = baseQuestions.map(({ id }) => ({
      questionId: id,
      optionId: pickAnswer(random),
    }));
    const tieBreakerAnswers = [];
    let evaluation = evaluateAssessment({ answers, baseQuestions });

    while (
      shouldAskTieBreaker(evaluation, {
        modeId,
        askedCount: tieBreakerAnswers.length,
      }) && tieBreakerAnswers.length < mode.maxClarifiers
    ) {
      const next = selectNextTieBreaker({
        evaluation,
        answers,
        tieBreakerAnswers,
        baseQuestions,
        modeId,
      });
      if (!next) break;
      tieBreakerAnswers.push({
        questionId: next.id,
        optionId: pickAnswer(random),
      });
      evaluation = evaluateAssessment({
        answers,
        tieBreakerAnswers,
        baseQuestions,
      });
    }

    const exactLeaders = evaluation.ranked.filter(
      ({ score }) => Math.abs(evaluation.ranked[0].score - score) < 1e-10,
    );
    for (const { profession } of exactLeaders) {
      topOne[profession.id] += 1 / exactLeaders.length;
    }
    const thirdScore = evaluation.ranked[Math.min(2, evaluation.ranked.length - 1)].score;
    for (const { profession, score } of evaluation.ranked) {
      if (score + 1e-10 >= thirdScore) topThree[profession.id] += 1;
    }
    clarifierCounts[tieBreakerAnswers.length] += 1;
    const total = baseQuestions.length + tieBreakerAnswers.length;
    minimumQuestions = Math.min(minimumQuestions, total);
    maximumQuestions = Math.max(maximumQuestions, total);
  }

  return { topOne, topThree, clarifierCounts, minimumQuestions, maximumQuestions };
};

for (const [modeId, seed] of [["quick", 0x51a7], ["deep", 0xd33f]]) {
  test(`${modeId}: 30 000 nejaušu profilu simulācija ir sasniedzama un līdzsvarota`, { timeout: 120_000 }, (context) => {
    const result = simulateMode({ modeId, seed });
    const topOneShares = Object.fromEntries(
      Object.entries(result.topOne).map(([id, count]) => [id, count / PROFILE_COUNT]),
    );
    const topThreeShares = Object.fromEntries(
      Object.entries(result.topThree).map(([id, count]) => [id, count / PROFILE_COUNT]),
    );
    context.diagnostic(
      JSON.stringify({
        modeId,
        topOnePercent: Object.fromEntries(
          Object.entries(topOneShares).map(([id, share]) => [id, +(100 * share).toFixed(2)]),
        ),
        minimumTopThreePercent: +(
          100 * Math.min(...Object.values(topThreeShares))
        ).toFixed(2),
        clarifierCounts: result.clarifierCounts,
        questionRange: [result.minimumQuestions, result.maximumQuestions],
      }),
    );
    for (const profession of professions) {
      assert.ok(topOneShares[profession.id] > 0, profession.id);
      assert.ok(topThreeShares[profession.id] >= 0.02, profession.id);
    }
    assert.ok(Math.max(...Object.values(topOneShares)) <= 0.2);
    assert.ok(result.minimumQuestions >= ASSESSMENT_MODES[modeId].baseQuestionIds.length);
    assert.ok(
      result.maximumQuestions <=
        ASSESSMENT_MODES[modeId].baseQuestionIds.length +
          ASSESSMENT_MODES[modeId].maxClarifiers,
    );
  });
}

test("tukšs profils nerada dominējošu fallback profesiju", () => {
  for (const modeId of ["quick", "deep"]) {
    const baseQuestions = getQuestionsForMode(modeId);
    const evaluation = evaluateAssessment({ answers: [], baseQuestions });
    assert.equal(evaluation.leader, null);
    assert.equal(evaluation.lowInformation, true);
    assert.equal(new Set(evaluation.ranked.map(({ score }) => score)).size, 1);
  }
});

export { simulateMode };
