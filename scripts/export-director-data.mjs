import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { DIMENSION_GROUPS, dimensions, dimensionsByGroup } from "../data/dimensions.js";
import { professions, VTDT_SOURCES } from "../data/professions.js";
import {
  ANSWER_SCALE,
  ASSESSMENT_MODES,
  ASSESSMENT_VERSION,
  questions,
  tieBreakers,
} from "../data/questions.js";

const outputPath = resolve(process.argv[2] ?? "tmp/director-data.json");
const payload = {
  generatedAt: "2026-08-30",
  assessmentVersion: ASSESSMENT_VERSION,
  dimensions,
  dimensionsByGroup,
  dimensionGroups: DIMENSION_GROUPS,
  professions,
  sources: VTDT_SOURCES,
  answerScale: ANSWER_SCALE,
  modes: ASSESSMENT_MODES,
  questions,
  tieBreakers,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Eksportēts: ${outputPath}`);
