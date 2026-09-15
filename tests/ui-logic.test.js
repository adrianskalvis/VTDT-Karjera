import assert from "node:assert/strict";
import test from "node:test";

import { getKeyboardSelection, isSharedLeader } from "../js/ui-logic.js";

test("tastatūras izvēle saglabā ekrānu pirms stāvokļa maiņas", () => {
  assert.deepEqual(getKeyboardSelection("question", "3"), {
    screen: "question",
    optionId: "rather_no",
  });
  assert.deepEqual(getKeyboardSelection("tieBreaker", "4"), {
    screen: "tieBreaker",
    optionId: "no",
  });
  assert.equal(getKeyboardSelection("results", "1"), null);
  assert.equal(getKeyboardSelection("question", "5"), null);
});

test("kopīgas pirmās vietas marķējumu rāda tikai īstā neizšķirtā", () => {
  const first = { profession: { id: "first" } };
  const second = { profession: { id: "second" } };
  assert.equal(
    isSharedLeader({ sharedFirst: false, sharedLeaders: [first] }, first),
    false,
  );
  assert.equal(
    isSharedLeader(
      { sharedFirst: true, sharedLeaders: [first, second] },
      first,
    ),
    true,
  );
  assert.equal(
    isSharedLeader(
      { sharedFirst: true, sharedLeaders: [first, second] },
      { profession: { id: "third" } },
    ),
    false,
  );
});
