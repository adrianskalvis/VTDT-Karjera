import assert from "node:assert/strict";
import test from "node:test";

import { professions } from "../data/professions.js";
import {
  auditCandidateCohort,
  candidateCohort,
} from "./candidate-cohort.js";

test("kohortā ir desmit atšķirīgi kandidāti katrai no 13 profesijām", () => {
  assert.equal(candidateCohort.length, 130);
  assert.equal(new Set(candidateCohort.map(({ id }) => id)).size, 130);
  for (const profession of professions) {
    const candidates = candidateCohort.filter(
      ({ targetProfessionId }) => targetProfessionId === profession.id,
    );
    assert.equal(candidates.length, 10, profession.id);
    assert.equal(new Set(candidates.map(({ variantId }) => variantId)).size, 10);
    assert.ok(candidates.every(({ description }) => description.length >= 30));
  }
});

for (const modeId of ["quick", "deep"]) {
  test(`${modeId}: 130 kandidātu profesionālā interese saglabājas vismaz Top 3`, (context) => {
    const audit = auditCandidateCohort(modeId);
    context.diagnostic(
      JSON.stringify({
        modeId,
        topOne: audit.topOne,
        topThree: audit.topThree,
        sectorTopOne: audit.sectorTopOne,
        sectorTopThree: audit.sectorTopThree,
        byProfession: audit.byProfession,
      }),
    );
    assert.equal(audit.count, 130);
    assert.equal(audit.topThree, 130);
    assert.equal(audit.sectorTopOne, 130);
    assert.equal(audit.sectorTopThree, 130);
    if (modeId === "deep") {
      assert.equal(audit.topOne, 130);
    } else {
      assert.ok(audit.topOne >= 129);
    }
    for (const result of Object.values(audit.byProfession)) {
      assert.equal(result.count, 10);
      assert.equal(result.topThree, 10);
      assert.equal(result.sectorTopOne, 10);
    }
  });
}
