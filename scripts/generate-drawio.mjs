import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { dimensionsByGroup } from "../data/dimensions.js";
import { professions } from "../data/professions.js";
import {
  TIE_BREAKER_THRESHOLD,
  questions,
  tieBreakers,
} from "../data/questions.js";

const outputUrl = new URL("../docs/VTDT-profesiju-izveles-modelis.drawio", import.meta.url);
const tieBreakerThresholdLabel = String(TIE_BREAKER_THRESHOLD).replace(".", ",");

const xml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const node = ({ id, label, x, y, width = 170, height = 58, style }) => `
  <mxCell id="${xml(id)}" value="${xml(label)}" style="${xml(style)}" vertex="1" parent="1">
    <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/>
  </mxCell>`;

const edge = ({ id, source, target, label = "", style = "" }) => `
  <mxCell id="${xml(id)}" value="${xml(label)}" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#6f68a8;endArrow=block;endFill=1;${xml(style)}" edge="1" parent="1" source="${xml(source)}" target="${xml(target)}">
    <mxGeometry relative="1" as="geometry"/>
  </mxCell>`;

const page = (id, name, cells, { width = 1169, height = 827 } = {}) => `
  <diagram id="${xml(id)}" name="${xml(name)}">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${width}" pageHeight="${height}" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        ${cells.join("\n")}
      </root>
    </mxGraphModel>
  </diagram>`;

const styles = {
  start:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#292561;fontColor=#ffffff;strokeColor=#1f1b50;fontStyle=1;shadow=1;",
  process:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#eee9ff;fontColor=#292561;strokeColor=#8f7cf3;fontStyle=1;",
  decision:
    "rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;fontColor=#5e4510;strokeColor=#d6b656;fontStyle=1;",
  result:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;fontColor=#1f5b49;strokeColor=#82b366;fontStyle=1;shadow=1;",
  group:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#e7e2fb;fontColor=#292561;strokeColor=#8f7cf3;fontStyle=1;",
  sector:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;fontColor=#203f66;strokeColor=#6c8ebf;fontStyle=1;",
  active:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;fontColor=#1f5b49;strokeColor=#82b366;",
  legacy:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;fontColor=#6c5216;strokeColor=#d6b656;dashed=1;",
  unverified:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#f5f5f5;fontColor=#666666;strokeColor=#999999;dashed=1;",
  note:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;fontColor=#555555;strokeColor=#b9b3d5;dashed=1;",
};

const flowCells = [
  node({ id: "flow_start", label: "Sākums", x: 35, y: 160, style: styles.start }),
  node({
    id: "flow_questions",
    label: `${questions.length} pamata jautājumi`,
    x: 245,
    y: 160,
    style: styles.process,
  }),
  node({
    id: "flow_profile",
    label: "Normalizēts dimensiju profils",
    x: 455,
    y: 160,
    width: 190,
    style: styles.process,
  }),
  node({
    id: "flow_compare",
    label: "Profesiju profilu salīdzināšana",
    x: 685,
    y: 160,
    width: 200,
    style: styles.process,
  }),
  node({
    id: "flow_close",
    label: `Top 2 starpība < ${tieBreakerThresholdLabel} punkta un ≥ 9 saturīgas atbildes?`,
    x: 920,
    y: 145,
    width: 190,
    height: 90,
    style: styles.decision,
  }),
  node({
    id: "flow_tie",
    label: "1–2 precizējoši jautājumi (svars 0,5)",
    x: 710,
    y: 320,
    width: 200,
    style: styles.process,
  }),
  node({
    id: "flow_result",
    label: "Top 3 + skaidrojums + sakritības indekss",
    x: 940,
    y: 320,
    width: 190,
    style: styles.result,
  }),
  node({
    id: "flow_note",
    label: "Viena atbilde nepiešķir profesiju. Neitrālam profilam nav noklusējuma līdera.",
    x: 385,
    y: 485,
    width: 400,
    height: 72,
    style: styles.note,
  }),
  edge({ id: "flow_e1", source: "flow_start", target: "flow_questions" }),
  edge({ id: "flow_e2", source: "flow_questions", target: "flow_profile" }),
  edge({ id: "flow_e3", source: "flow_profile", target: "flow_compare" }),
  edge({ id: "flow_e4", source: "flow_compare", target: "flow_close" }),
  edge({
    id: "flow_e5",
    source: "flow_close",
    target: "flow_tie",
    label: "Jā",
    style: "strokeColor=#a05b11;",
  }),
  edge({
    id: "flow_e6",
    source: "flow_close",
    target: "flow_result",
    label: "Nē",
    style: "strokeColor=#27816b;",
  }),
  edge({ id: "flow_e7", source: "flow_tie", target: "flow_result" }),
];

const sectorNames = [...new Set(professions.map(({ sector }) => sector))].sort((a, b) =>
  a.localeCompare(b, "lv"),
);
const sectorId = (sector) =>
  `sector_${sector.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase()}`;

const modelCells = [
  node({
    id: "model_q_interest",
    label: "Jautājumi par interešu veidu",
    x: 25,
    y: 80,
    width: 185,
    style: styles.start,
  }),
  node({
    id: "model_q_tasks",
    label: "Jautājumi par uzdevumiem",
    x: 25,
    y: 175,
    width: 185,
    style: styles.start,
  }),
  node({
    id: "model_q_environment",
    label: "Jautājumi par vidi un darba stilu",
    x: 25,
    y: 270,
    width: 185,
    style: styles.start,
  }),
  node({
    id: "model_d_riasec",
    label: `RIASEC dimensijas (${dimensionsByGroup.riasec.length}) · 25%`,
    x: 270,
    y: 80,
    width: 205,
    style: styles.group,
  }),
  node({
    id: "model_d_tasks",
    label: `VTDT uzdevumu dimensijas (${dimensionsByGroup.tasks.length}) · 55%`,
    x: 270,
    y: 175,
    width: 205,
    style: styles.group,
  }),
  node({
    id: "model_d_environment",
    label: `VTDT vides/stila dimensijas (${dimensionsByGroup.environment.length}) · 20%`,
    x: 270,
    y: 270,
    width: 205,
    style: styles.group,
  }),
  edge({ id: "model_qe1", source: "model_q_interest", target: "model_d_riasec" }),
  edge({ id: "model_qe2", source: "model_q_tasks", target: "model_d_tasks" }),
  edge({
    id: "model_qe3",
    source: "model_q_environment",
    target: "model_d_environment",
  }),
  node({ id: "legend_active", label: "active", x: 25, y: 430, width: 110, height: 38, style: styles.active }),
  node({ id: "legend_legacy", label: "legacy", x: 150, y: 430, width: 110, height: 38, style: styles.legacy }),
  node({ id: "legend_unverified", label: "unverified", x: 275, y: 430, width: 110, height: 38, style: styles.unverified }),
];

sectorNames.forEach((sector, index) => {
  const y = 35 + index * 95;
  const id = sectorId(sector);
  modelCells.push(
    node({ id, label: sector, x: 545, y, width: 200, style: styles.sector }),
  );
  ["model_d_riasec", "model_d_tasks", "model_d_environment"].forEach(
    (dimensionNodeId, dimensionIndex) => {
      modelCells.push(
        edge({
          id: `model_ds_${index}_${dimensionIndex}`,
          source: dimensionNodeId,
          target: id,
          style: "opacity=45;",
        }),
      );
    },
  );
});

let professionRow = 0;
for (const sector of sectorNames) {
  for (const profession of professions.filter((item) => item.sector === sector)) {
    const id = `profession_${profession.id}`;
    const y = 20 + professionRow * 67;
    modelCells.push(
      node({
        id,
        label: `${profession.title} [${profession.status}]`,
        x: 825,
        y,
        width: 285,
        height: 48,
        style: styles[profession.status],
      }),
      edge({
        id: `model_sp_${profession.id}`,
        source: sectorId(sector),
        target: id,
      }),
    );
    professionRow += 1;
  }
}

const statusStyleFor = (professionId) => {
  const status = professions.find(({ id }) => id === professionId)?.status ?? "unverified";
  return styles[status];
};

const tieCells = [
  node({ id: "tie_legend_active", label: "active", x: 25, y: 25, width: 110, height: 38, style: styles.active }),
  node({ id: "tie_legend_legacy", label: "legacy", x: 150, y: 25, width: 110, height: 38, style: styles.legacy }),
  node({
    id: "tie_note",
    label: "9 īpašie pāri + datu kolekcijas vispārīgs fallback citiem Top 2. Atbildes maina tikai dimensijas.",
    x: 300,
    y: 20,
    width: 560,
    height: 48,
    style: styles.note,
  }),
];

tieBreakers.forEach((collection, index) => {
  const y = 95 + index * 100;
  const [leftId, rightId] = collection.pair;
  const left = professions.find(({ id }) => id === leftId);
  const right = professions.find(({ id }) => id === rightId);
  const leftNode = `tie_left_${collection.id}`;
  const centerNode = `tie_center_${collection.id}`;
  const rightNode = `tie_right_${collection.id}`;
  tieCells.push(
    node({
      id: leftNode,
      label: `${left.title} [${left.status}]`,
      x: 25,
      y,
      width: 285,
      height: 55,
      style: statusStyleFor(leftId),
    }),
    node({
      id: centerNode,
      label: `${collection.id}\n${collection.questions.length} jautājumi`,
      x: 390,
      y,
      width: 265,
      height: 55,
      style: styles.group,
    }),
    node({
      id: rightNode,
      label: `${right.title} [${right.status}]`,
      x: 735,
      y,
      width: 300,
      height: 55,
      style: statusStyleFor(rightId),
    }),
    edge({ id: `tie_e_left_${index}`, source: leftNode, target: centerNode }),
    edge({ id: `tie_e_right_${index}`, source: centerNode, target: rightNode }),
  );
});

const document = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2026-08-01T00:00:00.000Z" agent="VTDT diagram generator" version="24.7.17" type="device">
${page("flow", "1. Aplikācijas plūsma", flowCells)}
${page("model", "2. Jautājumi, dimensijas un profesijas", modelCells, { width: 1169, height: 1169 })}
${page("tie-breakers", "3. Adaptīvie pāri", tieCells, { width: 1169, height: 1169 })}
</mxfile>
`;

await writeFile(outputUrl, document, "utf8");
console.log(`Izveidots ${fileURLToPath(outputUrl)}`);
