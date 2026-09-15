import assert from "node:assert/strict";
import test from "node:test";

import { dimensionIds, dimensions } from "../data/dimensions.js";
import { professions } from "../data/professions.js";
import {
  ANSWER_SCALE,
  ASSESSMENT_MODES,
  QUICK_QUESTION_IDS,
  questions,
  tieBreakers,
} from "../data/questions.js";

const EXPECTED_TITLES = [
  "Apģērbu dizainera asistents",
  "Lauksaimniecības mehanizācijas tehniķis",
  "Augkopības tehniķis",
  "Mēbeļu galdnieks",
  "Apdares darbu tehniķis",
  "Ēku būvtehniķis",
  "Namdaris",
  "Arhitektūras tehniķis",
  "Datorsistēmu tehniķis",
  "Programmēšanas tehniķis",
  "Automehāniķis",
  "Autovirsbūvju remonta tehniķis",
  "Elektrotehniķis",
];

const normalizeWords = (text) =>
  new Set(
    text
      .toLocaleLowerCase("lv")
      .replaceAll(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !["vai", "tev", "tevi", "patīk", "nekā"].includes(word)),
  );

const jaccard = (first, second) => {
  const intersection = [...first].filter((token) => second.has(token)).length;
  return intersection / new Set([...first, ...second]).size;
};

test("runtime katalogā ir tieši 13 aktuālās VTDT profesijas", () => {
  assert.equal(professions.length, 13);
  assert.deepEqual(
    professions.map(({ title }) => title),
    EXPECTED_TITLES,
  );
  assert.ok(professions.every(({ status }) => status === "active"));
  const serialized = JSON.stringify(professions);
  assert.doesNotMatch(serialized, /inzeniersistemu|atjaunojamas_energetikas/i);
  assert.doesNotMatch(
    serialized,
    /Inženiersistēmu būvtehniķis|Atjaunojamās enerģētikas tehniķis/,
  );
});

test("katrai profesijai ir pilns 22 dimensiju profils un oficiāla saite", () => {
  for (const profession of professions) {
    assert.deepEqual(Object.keys(profession.profile), dimensionIds);
    for (const value of Object.values(profession.profile)) {
      assert.equal(typeof value, "number");
      assert.ok(value >= 0 && value <= 1);
    }
    assert.match(profession.officialUrl, /^https:\/\/www\.vtdt\.lv\//);
    assert.match(profession.sourceUrl, /^https:\/\/www\.vtdt\.lv\//);
    assert.match(profession.lastVerified, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("ir tieši 18 pamata jautājumi un ātrajā režīmā tieši 10 no tiem", () => {
  assert.equal(questions.length, 18);
  assert.equal(new Set(questions.map(({ id }) => id)).size, 18);
  assert.equal(QUICK_QUESTION_IDS.length, 10);
  assert.equal(new Set(QUICK_QUESTION_IDS).size, 10);
  assert.ok(QUICK_QUESTION_IDS.every((id) => questions.some((q) => q.id === id)));
  assert.deepEqual(ASSESSMENT_MODES.quick.baseQuestionIds, QUICK_QUESTION_IDS);
  assert.equal(ASSESSMENT_MODES.quick.maxClarifiers, 3);
  assert.equal(ASSESSMENT_MODES.deep.baseQuestionIds.length, 18);
  assert.equal(ASSESSMENT_MODES.deep.maxClarifiers, 2);
});

test("visiem jautājumiem ir tā pati četru atbilžu skala", () => {
  assert.deepEqual(
    ANSWER_SCALE.map(({ label, coefficient }) => [label, coefficient]),
    [["Jā", 2], ["Drīzāk jā", 1], ["Drīzāk nē", -1], ["Nē", -2]],
  );
  assert.doesNotMatch(JSON.stringify(ANSWER_SCALE), /unknown|Nezinu/i);
  for (const question of [...questions, ...tieBreakers]) {
    assert.equal(question.options, ANSWER_SCALE);
    assert.equal(question.options.length, 4);
    assert.ok(question.options.every(({ coefficient }) => coefficient !== 0));
    assert.ok(question.options.every((option) => !("professionId" in option)));
    assert.ok(question.options.every((option) => !("effects" in option)));
  }
});

test("pamata jautājumi ir īsi, netieši un semantiski atšķirīgi", () => {
  const forbidden = [
    "programm",
    "automeh",
    "autovirsb",
    "mēbel",
    "augkop",
    "apģērb",
    "datorsistēm",
    "elektroteh",
    "piegrieztn",
  ];
  for (const question of questions) {
    const wordCount = question.prompt.trim().split(/\s+/).length;
    assert.ok(wordCount >= 8 && wordCount <= 14, question.prompt);
    assert.ok(question.prompt.length <= 100, question.prompt);
    assert.ok(forbidden.every((root) => !question.prompt.toLocaleLowerCase("lv").includes(root)));
    assert.ok(Object.keys(question.vector).length >= 3);
    assert.ok(Object.keys(question.vector).length <= 6);
  }
  assert.equal(new Set(questions.map(({ concept }) => concept)).size, 18);
  for (let first = 0; first < questions.length; first += 1) {
    for (let second = first + 1; second < questions.length; second += 1) {
      assert.ok(
        jaccard(normalizeWords(questions[first].prompt), normalizeWords(questions[second].prompt)) < 0.6,
        `${questions[first].id} un ${questions[second].id} ir pārāk līdzīgi`,
      );
    }
  }
});

test("lietotāja norādītie neskaidrie formulējumi ir aizstāti", () => {
  const byId = Object.fromEntries(questions.map((question) => [question.id, question]));
  assert.match(byId.q02_tangible.prompt, /savu stilu un izskatu/i);
  assert.match(byId.q03_detail.prompt, /vai Tu tāpat cīnies līdz galam/i);
  assert.match(byId.q04_spatial.prompt, /cita cilvēka lomā/i);
  assert.match(byId.q05_movement.prompt, /strādājot ārā/i);

  const serialized = questions.map(({ prompt }) => prompt).join(" ");
  assert.doesNotMatch(serialized, /prātā pagriezt|kustētos nekā ilgi sēdētu/i);
  assert.doesNotMatch(serialized, /kustība un spēks|ierīces iekšpusē/i);
  assert.doesNotMatch(serialized, /vide laika gaitā|vairākas daļas darbojas kopā/i);
  assert.doesNotMatch(serialized, /ar rokām izveidot kaut ko gatavu/i);
});

test("precizējošie jautājumi ir īsi, skaidri un nemin profesijas", () => {
  const forbidden = [
    "programmēšanas tehniķ",
    "datorsistēmu tehniķ",
    "būvtehniķ",
    "automehāniķ",
    "galdniek",
    "elektrotehniķ",
  ];
  for (const question of tieBreakers) {
    const wordCount = question.prompt.trim().split(/\s+/).length;
    assert.ok(wordCount >= 8 && wordCount <= 14, question.prompt);
    assert.ok(question.prompt.length <= 100, question.prompt);
    assert.ok(
      forbidden.every(
        (term) => !question.prompt.toLocaleLowerCase("lv").includes(term),
      ),
      question.prompt,
    );
  }
  assert.equal(new Set(tieBreakers.map(({ prompt }) => prompt)).size, tieBreakers.length);
  assert.equal(tieBreakers.length, 31);
});

test("precizējumos ir galveno līdzīgo profesiju darba izvēļu nošķīrēji", () => {
  const byId = Object.fromEntries(tieBreakers.map((question) => [question.id, question]));
  const expectedContrasts = {
    c17_programs_devices: ["programming", "hardwareNetworks"],
    c18_mechanics_bodywork: ["mechanicsDiagnostics", "metalBodywork"],
    c19_plants_machinery: ["plantProcesses", "agriculturalMachinery"],
    c23_circuits_mechanics: ["electricityEnergy", "mechanicsDiagnostics"],
    c28_drawings_algorithms: ["spatialDrawing", "programming"],
    c29_circuits_computers: ["electricityEnergy", "hardwareNetworks"],
    c30_wood_metal: ["woodworking", "metalBodywork"],
  };
  for (const [questionId, [positiveId, negativeId]] of Object.entries(expectedContrasts)) {
    assert.ok(byId[questionId], questionId);
    assert.ok(byId[questionId].vector[positiveId] > 0, questionId);
    assert.ok(byId[questionId].vector[negativeId] < 0, questionId);
  }
});

test("visi efekti atsaucas uz dimensijām un katra dimensija mērīta vairākkārt", () => {
  const counts = Object.fromEntries(dimensionIds.map((id) => [id, 0]));
  for (const question of [...questions, ...tieBreakers]) {
    for (const [dimensionId, weight] of Object.entries(question.vector)) {
      assert.ok(dimensions[dimensionId], `${question.id}: ${dimensionId}`);
      assert.ok(Number.isFinite(weight));
      assert.ok(Math.abs(weight) <= 1);
      if (question.type === "base" && weight !== 0) counts[dimensionId] += 1;
    }
  }
  for (const [dimensionId, count] of Object.entries(counts)) {
    assert.ok(count > 1, `${dimensionId} mērīta tikai ${count} jautājumos`);
  }
});

test("ātrā režīma jautājumi pārklāj visas 22 dimensijas un trīs grupas", () => {
  const quick = questions.filter(({ id }) => QUICK_QUESTION_IDS.includes(id));
  const measured = new Set(quick.flatMap(({ vector }) => Object.keys(vector)));
  assert.deepEqual([...measured].sort(), [...dimensionIds].sort());
  const groups = new Set(
    [...measured].map((dimensionId) => dimensions[dimensionId].group),
  );
  assert.deepEqual([...groups].sort(), ["environment", "riasec", "tasks"]);
});

test("jautājumu datos nav tiešu profesiju rezultātu", () => {
  const inspect = JSON.stringify({ questions, tieBreakers });
  for (const profession of professions) {
    assert.ok(!inspect.includes(profession.id));
    assert.ok(!inspect.includes(profession.title));
  }
  assert.doesNotMatch(inspect, /targetProfession|professionResult|defaultProfession/i);
});
