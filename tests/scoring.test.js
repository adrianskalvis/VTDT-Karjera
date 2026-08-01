import assert from "node:assert/strict";
import test from "node:test";

import { dimensionIds } from "../data/dimensions.js";
import { professions } from "../data/professions.js";
import { questions, tieBreakers } from "../data/questions.js";
import {
  calculateDimensionProfile,
  evaluateAssessment,
  getDimensionCapacities,
  matchDimension,
  rankProfessions,
  replaceAnswer,
  shouldAskTieBreaker,
} from "../js/scoring.js";
import { personas } from "./personas.js";

const neutralAnswers = questions.map((question) => ({
  questionId: question.id,
  optionId: question.options.find((option) => option.isNeutral).id,
}));

const firstSubstantiveAnswers = questions.map((question) => ({
  questionId: question.id,
  optionId: question.options.find((option) => !option.isNeutral).id,
}));

test("normalizācija paliek 0..1 robežās un izmanto teorētiskās kapacitātes", () => {
  const capacities = getDimensionCapacities();
  const profile = calculateDimensionProfile({ answers: firstSubstantiveAnswers });

  for (const dimensionId of dimensionIds) {
    assert.ok(capacities.positive[dimensionId] >= 0);
    assert.ok(capacities.negative[dimensionId] >= 0);
    assert.ok(profile.values[dimensionId].positive >= 0);
    assert.ok(profile.values[dimensionId].positive <= 1);
    assert.ok(profile.values[dimensionId].negative >= 0);
    assert.ok(profile.values[dimensionId].negative <= 1);
    assert.ok(profile.values[dimensionId].evidence >= 0);
    assert.ok(profile.values[dimensionId].evidence <= 1);
  }
});

test("pozitīvs un negatīvs efekts virza dimensiju pretējos virzienos", () => {
  const positive = calculateDimensionProfile({
    answers: [{ questionId: "q01_free_saturday", optionId: "q01_digital_tool" }],
  });
  const negative = calculateDimensionProfile({
    answers: [{ questionId: "q12_least_appealing", optionId: "q12_code_screen" }],
  });

  assert.ok(positive.values.programming.positive > 0);
  assert.equal(positive.values.programming.negative, 0);
  assert.ok(positive.values.programming.direction > 0);
  assert.ok(negative.values.programming.negative > 0);
  assert.equal(negative.values.programming.positive, 0);
  assert.ok(negative.values.programming.direction < 0);
  assert.ok(matchDimension(positive.values.programming, 1) > 0.5);
  assert.ok(matchDimension(negative.values.programming, 1) < 0.5);
});

test("neitrālas atbildes dod vienādus indeksus un neizvēlas noklusējuma profesiju", () => {
  const evaluation = evaluateAssessment({ answers: neutralAnswers });
  const scores = new Set(evaluation.ranked.map(({ score }) => score));

  assert.deepEqual([...scores], [50]);
  assert.equal(evaluation.leader, null);
  assert.equal(evaluation.lowInformation, true);
  assert.equal(evaluation.resultMode, "broad");
  assert.equal(shouldAskTieBreaker(evaluation), false);
  assert.ok(evaluation.broadDirections.length > 2);
});

test("Top 3 secība seko neapaļotam sakritības indeksam", () => {
  const programmer = personas.find(({ targetProfessionId }) =>
    targetProfessionId === "programmesanas_tehnikis"
  );
  const evaluation = evaluateAssessment({ answers: programmer.answers });

  assert.equal(evaluation.ranked[0].profession.id, "programmesanas_tehnikis");
  assert.equal(evaluation.topThree.length, 3);
  assert.ok(evaluation.topThree[0].score >= evaluation.topThree[1].score);
  assert.ok(evaluation.topThree[1].score >= evaluation.topThree[2].score);
});

test("vienādi rezultāti saglabā vienādus indeksus un līderis paliek null", () => {
  const profile = Object.fromEntries(dimensionIds.map((id) => [id, 0.5]));
  const twins = ["alpha", "beta", "gamma"].map((id) => ({
    id,
    title: id,
    status: "active",
    sector: "Testa nozare",
    profile,
  }));
  const evaluation = evaluateAssessment({
    answers: firstSubstantiveAnswers,
    professionCatalog: twins,
  });

  assert.equal(evaluation.ranked[0].score, evaluation.ranked[1].score);
  assert.equal(evaluation.leader, null);
  assert.equal(evaluation.lowInformation, false);
  assert.equal(evaluation.resultMode, "ranked");
  assert.equal(evaluation.exactTopTie, true);
});

test("precizējošais jautājums aktivizējas tuvam un pietiekami pilnam profilam", () => {
  const profile = Object.fromEntries(dimensionIds.map((id) => [id, 0.5]));
  const twins = ["alpha", "beta"].map((id) => ({
    id,
    title: id,
    status: "active",
    sector: "Testa nozare",
    profile,
  }));
  const evaluation = evaluateAssessment({
    answers: firstSubstantiveAnswers,
    professionCatalog: twins,
  });

  assert.equal(evaluation.lowInformation, false);
  assert.equal(evaluation.topGap, 0);
  assert.equal(shouldAskTieBreaker(evaluation), true);
});

test("atbildes maiņa pārrēķina rezultātu no masīva un nemutē iepriekšējo masīvu", () => {
  const programmer = personas.find(({ targetProfessionId }) =>
    targetProfessionId === "programmesanas_tehnikis"
  );
  const original = programmer.answers.map((answer) => ({ ...answer }));
  const changed = replaceAnswer(original, {
    questionId: "q01_free_saturday",
    optionId: "q01_computer_fix",
  });
  const firstRun = evaluateAssessment({ answers: changed });
  const secondRun = evaluateAssessment({
    answers: changed.map((answer) => ({ ...answer })),
  });

  assert.deepEqual(original, programmer.answers);
  assert.notDeepEqual(changed, original);
  assert.deepEqual(
    firstRun.ranked.map(({ profession, score }) => [profession.id, score]),
    secondRun.ranked.map(({ profession, score }) => [profession.id, score]),
  );
});

test("maz informācijas dod zemu pārliecību un neaktivizē precizējumu", () => {
  const sparse = neutralAnswers.map((answer) => ({ ...answer }));
  sparse[0] = {
    questionId: "q01_free_saturday",
    optionId: "q01_mechanism",
  };
  const evaluation = evaluateAssessment({ answers: sparse });

  assert.equal(evaluation.confidence.level, "low");
  assert.equal(evaluation.lowInformation, true);
  assert.equal(evaluation.leader, null);
  assert.equal(shouldAskTieBreaker(evaluation), false);
});

test("legacy profesijas pēc noklusējuma izslēdz un ar konfigurāciju iekļauj", () => {
  const renewablePersona = personas.find(({ targetProfessionId }) =>
    targetProfessionId === "atjaunojamas_energetikas_tehnikis"
  );
  const activeOnly = evaluateAssessment({ answers: renewablePersona.answers });
  const withLegacy = evaluateAssessment({
    answers: renewablePersona.answers,
    includedStatuses: ["active", "legacy"],
  });

  assert.equal(
    activeOnly.ranked.some(({ profession }) => profession.status === "legacy"),
    false,
  );
  assert.equal(
    withLegacy.ranked.some(({ profession }) => profession.status === "legacy"),
    true,
  );
  assert.equal(withLegacy.ranked.length, professions.length);
});

test("tie-breaker efekts tiek ieskaitīts dimensiju profilā ar ierobežotu svaru", () => {
  const collection = tieBreakers.find(
    ({ id }) => id === "tb_programming_hardware",
  );
  const base = calculateDimensionProfile({ answers: neutralAnswers });
  const clarified = calculateDimensionProfile({
    answers: neutralAnswers,
    tieBreakerAnswers: [
      {
        questionId: collection.questions[0].id,
        optionId: "tb_ph_1_network",
      },
    ],
  });

  assert.equal(base.values.hardwareNetworks.evidence, 0);
  assert.ok(clarified.values.hardwareNetworks.evidence > 0);
  assert.ok(clarified.values.hardwareNetworks.evidence < 0.5);
});

test("rankProfessions nepaļaujas uz mutējamu globālu rezultātu", () => {
  const first = calculateDimensionProfile({ answers: neutralAnswers });
  const second = calculateDimensionProfile({
    answers: [{ questionId: "q02_hidden_fault", optionId: "q02_engine" }],
  });
  const firstRanking = rankProfessions({ dimensionProfile: first });
  const secondRanking = rankProfessions({ dimensionProfile: second });
  const firstAgain = rankProfessions({ dimensionProfile: first });

  assert.notDeepEqual(
    firstRanking.map(({ profession }) => profession.id),
    secondRanking.map(({ profession }) => profession.id),
  );
  assert.deepEqual(
    firstAgain.map(({ profession, score }) => [profession.id, score]),
    firstRanking.map(({ profession, score }) => [profession.id, score]),
  );
});
