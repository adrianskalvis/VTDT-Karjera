import { professions } from "../data/professions.js";
import { auditCandidateCohort } from "../tests/candidate-cohort.js";

for (const modeId of ["quick", "deep"]) {
  const audit = auditCandidateCohort(modeId);
  console.log(`\n${modeId.toUpperCase()} — ${audit.count} kandidāti`);
  console.log(
    `Profesija Top 1: ${audit.topOne}/${audit.count}; Top 3: ${audit.topThree}/${audit.count}; ` +
      `nozare Top 1: ${audit.sectorTopOne}/${audit.count}; nozare Top 3: ${audit.sectorTopThree}/${audit.count}`,
  );
  for (const profession of professions) {
    const result = audit.byProfession[profession.id];
    console.log(
      `${profession.title.padEnd(42)} ` +
        `#1 ${String(result.topOne).padStart(2)}/10  ` +
        `#3 ${String(result.topThree).padStart(2)}/10  ` +
        `nozare #1 ${String(result.sectorTopOne).padStart(2)}/10  ` +
        `vid. vieta ${result.meanRank.toFixed(2)}`,
    );
  }

  const misses = audit.results.filter(
    ({ targetRank, targetSectorTopOne }) => targetRank > 3 || !targetSectorTopOne,
  );
  if (misses.length) {
    console.log("Būtiskās kļūdas:");
    for (const result of misses) {
      const winner = result.evaluation.ranked[0].profession;
      console.log(
        `- ${result.candidate.id}: mērķis #${result.targetRank}, uzvar ${winner.title} ` +
          `(${winner.sector}); precizējumi ${result.tieBreakerQuestionIds.join(", ") || "nav"}`,
      );
    }
  }
}

