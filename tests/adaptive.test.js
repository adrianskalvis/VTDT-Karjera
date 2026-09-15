import assert from "node:assert/strict";
import test from "node:test";

import { professions } from "../data/professions.js";
import {
  ASSESSMENT_MODES,
  getQuestionsForMode,
  tieBreakers,
  tieBreakerQuestionById,
} from "../data/questions.js";
import {
  evaluateAssessment,
  getAdaptiveTriggerReasons,
  scoreClarifierCandidate,
  selectNextTieBreaker,
  shouldAskTieBreaker,
} from "../js/scoring.js";

const baseAnswers = (modeId, optionForIndex) =>
  getQuestionsForMode(modeId).map(({ id }, index) => ({
    questionId: id,
    optionId: optionForIndex(index),
  }));

const runAdaptive = (modeId, answers, optionId = "rather_yes") => {
  const baseQuestions = getQuestionsForMode(modeId);
  const mode = ASSESSMENT_MODES[modeId];
  const tieBreakerAnswers = [];
  const ids = [];
  while (tieBreakerAnswers.length < mode.maxClarifiers) {
    const evaluation = evaluateAssessment({ answers, tieBreakerAnswers, baseQuestions });
    if (!shouldAskTieBreaker(evaluation, { modeId, askedCount: tieBreakerAnswers.length })) break;
    const next = selectNextTieBreaker({
      evaluation,
      answers,
      tieBreakerAnswers,
      baseQuestions,
      modeId,
    });
    if (!next) break;
    ids.push(next.id);
    tieBreakerAnswers.push({ questionId: next.id, optionId });
  }
  return { ids, tieBreakerAnswers };
};

test("tuvi rezultāti aktivizē precizējumu bez neitrālas atbildes", () => {
  for (const modeId of ["quick", "deep"]) {
    const baseQuestions = getQuestionsForMode(modeId);
    const answers = baseAnswers(modeId, (index) =>
      index % 2 ? "rather_yes" : "rather_no",
    );
    const evaluation = evaluateAssessment({ answers, baseQuestions });
    const reasons = getAdaptiveTriggerReasons(evaluation, modeId);
    assert.ok(reasons.length > 0, `${modeId}: precizējums netika aktivizēts`);
    assert.ok(
      reasons.some((reason) =>
        ["closeTop", "closeTopThree", "mixedSectors", "sameSectorChoice"].includes(reason),
      ),
      `${modeId}: ${reasons.join(", ")}`,
    );
  }
});

test("precizējuma izvēle ir determinēta un neatkārto izmantotu jautājumu", () => {
  const modeId = "quick";
  const baseQuestions = getQuestionsForMode(modeId);
  const answers = baseAnswers(modeId, (index) =>
    index % 2 ? "rather_yes" : "rather_no",
  );
  const evaluation = evaluateAssessment({ answers, baseQuestions });
  const first = selectNextTieBreaker({ evaluation, answers, baseQuestions, modeId });
  const repeated = selectNextTieBreaker({ evaluation, answers, baseQuestions, modeId });
  assert.ok(first);
  assert.equal(first.id, repeated.id);

  const tieBreakerAnswers = [{ questionId: first.id, optionId: "rather_yes" }];
  const nextEvaluation = evaluateAssessment({ answers, tieBreakerAnswers, baseQuestions });
  const second = selectNextTieBreaker({
    evaluation: nextEvaluation,
    answers,
    tieBreakerAnswers,
    baseQuestions,
    modeId,
  });
  if (second) assert.notEqual(second.id, first.id);
});

test("režīmu precizējumu limiti saglabā 10–13 un 18–20 jautājumus", () => {
  for (const modeId of ["quick", "deep"]) {
    const answers = baseAnswers(modeId, (index) =>
      index % 2 ? "rather_yes" : "rather_no",
    );
    const result = runAdaptive(modeId, answers);
    const mode = ASSESSMENT_MODES[modeId];
    const baseCount = mode.baseQuestionIds.length;
    assert.ok(result.ids.length <= mode.maxClarifiers);
    assert.ok(baseCount + result.ids.length <= baseCount + mode.maxClarifiers);
    assert.equal(new Set(result.ids).size, result.ids.length);
    assert.ok(result.ids.every((id) => tieBreakerQuestionById[id]));
  }
});

test("pēc režīma limita precizējumu vairs neprasa", () => {
  for (const modeId of ["quick", "deep"]) {
    const mode = ASSESSMENT_MODES[modeId];
    const baseQuestions = getQuestionsForMode(modeId);
    const answers = baseAnswers(modeId, () => "rather_yes");
    const evaluation = evaluateAssessment({ answers, baseQuestions });
    assert.equal(
      shouldAskTieBreaker(evaluation, { modeId, askedCount: mode.maxClarifiers }),
      false,
    );
  }
});

test("nepilnīga atbilžu vēsture aktivizē pārklājuma precizējumu", () => {
  const modeId = "quick";
  const baseQuestions = getQuestionsForMode(modeId);
  const answers = baseAnswers(modeId, () => "rather_yes").slice(0, 1);
  const evaluation = evaluateAssessment({ answers, baseQuestions });
  assert.ok(getAdaptiveTriggerReasons(evaluation, modeId).includes("lowCoverage"));
  assert.equal(evaluation.lowInformation, true);
});

test("precizējuma atbilde palielina kopējo informācijas pietiekamību", () => {
  const baseQuestions = getQuestionsForMode("quick");
  const answers = baseAnswers("quick", () => "rather_yes");
  const before = evaluateAssessment({ answers, baseQuestions });
  const tieBreakerAnswers = [{ questionId: tieBreakers[0].id, optionId: "yes" }];
  const after = evaluateAssessment({ answers, tieBreakerAnswers, baseQuestions });
  assert.equal(after.confidence.substantiveBase, 10);
  assert.equal(after.confidence.substantiveClarifiers, 1);
  assert.equal(after.confidence.substantive, 11);
  assert.equal(after.confidence.answered, 11);
  assert.ok(
    after.dimensionProfile.substantiveAnswerCount >
      before.dimensionProfile.substantiveAnswerCount,
  );
});

test("spēcīgu nošķīrēju izvēlas arī tad, ja tā dimensijas jau nosegtas", () => {
  const modeId = "deep";
  const baseQuestions = getQuestionsForMode(modeId);
  const answers = baseAnswers(modeId, () => "rather_yes");
  const evaluation = evaluateAssessment({ answers, baseQuestions });
  const saturatedValues = Object.fromEntries(
    Object.entries(evaluation.dimensionProfile.values).map(([id, value]) => [
      id,
      { ...value, capacity: 3 },
    ]),
  );
  const saturated = {
    ...evaluation,
    dimensionProfile: { ...evaluation.dimensionProfile, values: saturatedValues },
  };
  const selected = selectNextTieBreaker({
    evaluation: saturated,
    answers,
    baseQuestions,
    modeId,
  });
  assert.ok(selected);
  const candidate = scoreClarifierCandidate({
    question: selected,
    evaluation: saturated,
    answeredQuestions: baseQuestions,
  });
  assert.ok(candidate.separation >= 0.12);
});

test("informatīvs dvīņu profils paliek kopīgā pirmajā vietā pēc limita", () => {
  const baseQuestions = getQuestionsForMode("deep");
  const answers = baseAnswers("deep", (index) =>
    index % 3 === 0 ? "no" : "yes",
  );
  const first = professions[0];
  const twin = { ...first, id: "twin", title: "Dvīņu profils" };
  const evaluation = evaluateAssessment({
    answers,
    baseQuestions,
    professionCatalog: [first, twin],
  });
  assert.equal(evaluation.lowInformation, false);
  assert.equal(evaluation.sharedFirst, true);
  assert.equal(evaluation.leader, null);
  assert.equal(
    shouldAskTieBreaker(evaluation, {
      modeId: "deep",
      askedCount: ASSESSMENT_MODES.deep.maxClarifiers,
    }),
    false,
  );
});
