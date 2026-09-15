import { ANSWER_SCALE } from "../data/questions.js";

const ANSWER_SCREENS = new Set(["question", "tieBreaker"]);

export const getKeyboardSelection = (screen, key) => {
  if (!ANSWER_SCREENS.has(screen)) return null;
  const index = Number(key) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= ANSWER_SCALE.length) {
    return null;
  }
  return Object.freeze({ screen, optionId: ANSWER_SCALE[index].id });
};

export const isSharedLeader = (evaluation, result) =>
  Boolean(
    evaluation?.sharedFirst && evaluation.sharedLeaders?.includes(result),
  );
