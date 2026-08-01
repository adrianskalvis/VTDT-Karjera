import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  DIMENSION_GROUPS,
  dimensionIds,
  dimensions,
} from "../data/dimensions.js";
import {
  professionStatusConfig,
  professions,
} from "../data/professions.js";
import {
  findTieBreakerForPair,
  genericTieBreakerQuestions,
  questions,
  tieBreakers,
} from "../data/questions.js";
import { evaluateAssessment, shouldAskTieBreaker } from "../js/scoring.js";
import { personas } from "./personas.js";

const professionIds = new Set(professions.map(({ id }) => id));

test("katalogā saglabātas visas 15 profesijas ar 13 active un 2 legacy", () => {
  assert.equal(professions.length, 15);
  assert.equal(professionStatusConfig.active.length, 13);
  assert.equal(professionStatusConfig.legacy.length, 2);
  assert.equal(professionStatusConfig.unverified.length, 0);
  assert.deepEqual(
    new Set(professionStatusConfig.active),
    new Set(
      professions.filter(({ status }) => status === "active").map(({ id }) => id),
    ),
  );
});

test("ir tieši 18 pamata jautājumi pareizā numerācijā", () => {
  assert.equal(questions.length, 18);
  assert.deepEqual(
    questions.map(({ number }) => number),
    Array.from({ length: 18 }, (_, index) => index + 1),
  );
  assert.equal(new Set(questions.map(({ id }) => id)).size, 18);
  assert.ok(
    questions.filter(({ type }) => type === "scenario" || type === "forced-choice")
      .length >= 12,
  );
});

test("katram jautājumam ir 4 vai 5 saturiskas atbildes un viena neitrāla", () => {
  for (const question of questions) {
    const neutralOptions = question.options.filter(({ isNeutral }) => isNeutral);
    const substantiveOptions = question.options.filter(({ isNeutral }) => !isNeutral);
    assert.ok(
      substantiveOptions.length === 4 || substantiveOptions.length === 5,
      `${question.id}: ${substantiveOptions.length} saturiskas atbildes`,
    );
    assert.equal(neutralOptions.length, 1, question.id);
    assert.deepEqual(neutralOptions[0].effects, {}, question.id);
    assert.ok(question.options.every(({ label }) => label.trim().length > 2));
    assert.equal(
      new Set(question.options.map(({ id }) => id)).size,
      question.options.length,
      question.id,
    );
  }
});

test("visi efekti izmanto eksistējošas dimensijas un nepārsniedz vienas atbildes limitu", () => {
  const allQuestions = [
    ...questions,
    ...tieBreakers.flatMap(({ questions: clarifiers }) => clarifiers),
    ...genericTieBreakerQuestions,
  ];
  for (const question of allQuestions) {
    for (const option of question.options) {
      for (const [dimensionId, effect] of Object.entries(option.effects)) {
        assert.ok(dimensions[dimensionId], `${question.id}/${option.id}: ${dimensionId}`);
        assert.ok(Number.isFinite(effect));
        assert.ok(effect >= -2 && effect <= 2, `${question.id}/${option.id}`);
      }
    }
  }
});

test("katru dimensiju mēra vairāk nekā viens pamata jautājums", () => {
  for (const dimensionId of dimensionIds) {
    const measuringQuestions = questions.filter((question) =>
      question.options.some((option) => option.effects[dimensionId] !== undefined),
    );
    assert.ok(
      measuringQuestions.length > 1,
      `${dimensionId} mēra tikai ${measuringQuestions.length} jautājums`,
    );
  }
});

test("grupu svari ir 25/55/20 un summā veido 1", () => {
  assert.equal(DIMENSION_GROUPS.riasec.weight, 0.25);
  assert.equal(DIMENSION_GROUPS.tasks.weight, 0.55);
  assert.equal(DIMENSION_GROUPS.environment.weight, 0.2);
  assert.equal(
    Object.values(DIMENSION_GROUPS).reduce((sum, group) => sum + group.weight, 0),
    1,
  );
});

test("katrai profesijai ir pilns profils, statuss, saturs un oficiāls HTTPS URL", () => {
  for (const profession of professions) {
    assert.ok(["active", "legacy", "unverified"].includes(profession.status));
    assert.deepEqual(new Set(Object.keys(profession.profile)), new Set(dimensionIds));
    assert.ok(
      Object.values(profession.profile).every(
        (value) => Number.isFinite(value) && value >= 0 && value <= 1,
      ),
      profession.id,
    );
    assert.ok(profession.title.length > 3);
    assert.ok(profession.sector.length > 3);
    assert.ok(profession.description.length > 40);
    assert.equal(profession.tasks.length, 3);
    assert.equal(profession.aspects.length, 3);
    assert.ok(profession.workEnvironment.length > 30);
    assert.ok(profession.challenge.length > 30);
    assert.ok(profession.learningTask.length > 30);
    assert.equal(new URL(profession.officialUrl).protocol, "https:");
    assert.equal(new URL(profession.sourceUrl).hostname, "www.vtdt.lv");
    assert.match(profession.lastVerified, /^\d{4}-\d{2}-\d{2}$/);
    assert.doesNotMatch(
      profession.description,
      /vienmēr būs pieprasīt|viena no pieprasītāk|nākotnes profesija/i,
    );
  }
});

test("neviena atbilde nepiešķir profesiju tieši", () => {
  const answerObjects = [
    ...questions,
    ...tieBreakers.flatMap(({ questions: clarifiers }) => clarifiers),
    ...genericTieBreakerQuestions,
  ].flatMap(({ options }) => options);
  const forbiddenKeys = /profession|result|career|default/i;

  for (const option of answerObjects) {
    assert.equal(Object.keys(option).some((key) => forbiddenKeys.test(key)), false);
    const serialized = JSON.stringify(option.effects);
    for (const professionId of professionIds) {
      assert.equal(serialized.includes(professionId), false);
    }
  }
});

test("visi obligātie precizējošo jautājumu pāri ir datos un secība nav svarīga", () => {
  const requiredPairs = [
    ["programmesanas_tehnikis", "datorsistemu_tehnikis"],
    ["automehanikis", "autovirsbuvju_remonta_tehnikis"],
    ["arhitekturas_tehnikis", "eku_buvtehnikis"],
    ["namdaris", "mebelu_galdnieks"],
    ["augkopibas_tehnikis", "lauksaimniecibas_mehanizacijas_tehnikis"],
    ["elektrotehnikis", "atjaunojamas_energetikas_tehnikis"],
    ["elektrotehnikis", "inzeniersistemu_buvtehnikis"],
    ["apdares_darbu_tehnikis", "eku_buvtehnikis"],
    ["apgerbu_dizainera_asistents", "mebelu_galdnieks"],
  ];
  const pairKey = (pair) => [...pair].sort().join("|");
  const available = new Set(tieBreakers.map(({ pair }) => pairKey(pair)));

  for (const pair of requiredPairs) assert.ok(available.has(pairKey(pair)), pairKey(pair));
  for (const collection of tieBreakers) {
    assert.equal(collection.questions.length, 2);
    assert.ok(collection.pair.every((id) => professionIds.has(id)));
  }

  const generic = findTieBreakerForPair(
    "programmesanas_tehnikis",
    "augkopibas_tehnikis",
  );
  assert.equal(generic.generic, true);
  assert.equal(generic.questions.length, 2);
});

test("katrai vēsturiskajai profesijai ir loģiska testa persona", async (t) => {
  assert.equal(personas.length, professions.length);
  assert.deepEqual(
    new Set(personas.map(({ targetProfessionId }) => targetProfessionId)),
    professionIds,
  );

  for (const persona of personas) {
    await t.test(persona.id, () => {
      assert.equal(persona.answers.length, questions.length);
      assert.ok(persona.rationale.length > 30);
      const target = professions.find(({ id }) => id === persona.targetProfessionId);
      const evaluation = evaluateAssessment({
        answers: persona.answers,
        includedStatuses: ["active", "legacy"],
      });
      const rank =
        evaluation.ranked.findIndex(
          ({ profession }) => profession.id === persona.targetProfessionId,
        ) + 1;
      assert.ok(rank > 0 && rank <= 3, `${persona.id}: mērķis ir #${rank}`);
      if (target.status === "active") {
        assert.equal(rank, 1, `${persona.id}: aktīvās profesijas rangs #${rank}`);
      }
    });
  }
});

const mulberry32 = (seed) => () => {
  let value = (seed += 0x6d2b79f5);
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
};

test("30 000 nejaušu profilu simulācijā aktīvās profesijas ir praktiski sasniedzamas", (t) => {
  const iterations = 30_000;
  const random = mulberry32(20260801);
  const topOneShares = Object.fromEntries(
    professionStatusConfig.active.map((id) => [id, 0]),
  );
  const topThreeCounts = Object.fromEntries(
    professionStatusConfig.active.map((id) => [id, 0]),
  );
  let tieBreakerEligibleCount = 0;

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const answers = questions.map((question) => ({
      questionId: question.id,
      optionId: question.options[Math.floor(random() * question.options.length)].id,
    }));
    const evaluation = evaluateAssessment({ answers });
    if (shouldAskTieBreaker(evaluation)) tieBreakerEligibleCount += 1;
    const bestScore = evaluation.ranked[0].score;
    const leaders = evaluation.ranked.filter(
      ({ score }) => Math.abs(score - bestScore) < 1e-10,
    );
    for (const { profession } of leaders) {
      topOneShares[profession.id] += 1 / leaders.length;
    }
    for (const { profession } of evaluation.topThree) {
      topThreeCounts[profession.id] += 1;
    }
  }

  const topOneRates = Object.fromEntries(
    Object.entries(topOneShares).map(([id, count]) => [id, count / iterations]),
  );
  const topThreeRates = Object.fromEntries(
    Object.entries(topThreeCounts).map(([id, count]) => [id, count / iterations]),
  );
  t.diagnostic(
    `Top 1: ${JSON.stringify(topOneRates)}; Top 3: ${JSON.stringify(topThreeRates)}; precizējums: ${tieBreakerEligibleCount / iterations}`,
  );

  for (const id of professionStatusConfig.active) {
    assert.ok(topOneRates[id] >= 0.001, `${id}: Top 1 ${topOneRates[id]}`);
    assert.ok(topThreeRates[id] >= 0.005, `${id}: Top 3 ${topThreeRates[id]}`);
  }
  assert.ok(
    Math.max(...Object.values(topOneRates)) < 0.3,
    `dominējošais Top 1 īpatsvars ${Math.max(...Object.values(topOneRates))}`,
  );
  assert.ok(
    tieBreakerEligibleCount / iterations >= 0.1 &&
      tieBreakerEligibleCount / iterations <= 0.5,
    `precizējumu īpatsvars ${tieBreakerEligibleCount / iterations}`,
  );
});

test("HTML karkass ir semantisks un tajā nav veco inline vadīklu", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const app = await readFile(new URL("../js/app.js", import.meta.url), "utf8");
  const scoring = await readFile(new URL("../js/scoring.js", import.meta.url), "utf8");

  assert.equal((html.match(/id="question-container"/g) ?? []).length, 1);
  assert.doesNotMatch(html, /\sonclick\s*=/i);
  assert.doesNotMatch(app, /\sonclick\s*=/i);
  assert.match(html, /<script type="module" src="js\/app\.js"><\/script>/);
  assert.doesNotMatch(html, /script\.js/);
  assert.doesNotMatch(scoring, /findProfessionByBacktracking|DEFAULT_PROFESSION/);
  assert.match(app, /evaluation\.resultMode === "broad"/);
  assert.doesNotMatch(app, /evaluation\.lowInformation\s*\|\|\s*!evaluation\.leader/);
  assert.doesNotMatch(
    app,
    /#1 ieteikums|Iepazīt VTDT|Izpētīt VTDT|Salīdzini uzdevumu veidu/,
  );

  for (const tag of html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? []) {
    assert.match(tag, /rel="noopener noreferrer"/);
  }
  for (const tag of app.match(/<a\b[^>]*target=\\?"_blank\\?"[^>]*>/g) ?? []) {
    assert.match(tag, /rel=\\?"noopener noreferrer\\?"/);
  }
});

test("Draw.io ir trīs lapas un katram savienojumam ir eksistējošs source/target", async () => {
  const diagram = await readFile(
    new URL("../docs/VTDT-profesiju-izveles-modelis.drawio", import.meta.url),
    "utf8",
  );
  const diagrams = diagram.match(/<diagram\b/g) ?? [];
  const cells = diagram.match(/<mxCell\b[^>]*>/g) ?? [];
  const vertexIds = new Set(
    cells
      .filter((cell) => /vertex="1"/.test(cell))
      .map((cell) => cell.match(/\bid="([^"]+)"/)?.[1])
      .filter(Boolean),
  );
  const edges = cells.filter((cell) => /edge="1"/.test(cell));

  assert.equal(diagrams.length, 3);
  assert.ok(edges.length > 20);
  assert.match(diagram, /name="1\. Aplikācijas plūsma"/);
  assert.match(diagram, /name="2\. Jautājumi, dimensijas un profesijas"/);
  assert.match(diagram, /name="3\. Adaptīvie pāri"/);
  assert.match(diagram, /value="active"/);
  assert.match(diagram, /value="legacy"/);

  for (const edge of edges) {
    const source = edge.match(/\bsource="([^"]+)"/)?.[1];
    const target = edge.match(/\btarget="([^"]+)"/)?.[1];
    assert.ok(source, edge);
    assert.ok(target, edge);
    assert.ok(vertexIds.has(source), `nezināms source ${source}`);
    assert.ok(vertexIds.has(target), `nezināms target ${target}`);
  }
});
