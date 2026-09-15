import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import {
  DIMENSION_GROUPS,
  dimensions,
  dimensionsByGroup,
} from "../data/dimensions.js";
import { professions } from "../data/professions.js";
import {
  ANSWER_SCALE,
  ASSESSMENT_MODES,
  questions,
  tieBreakers,
} from "../data/questions.js";

const outputUrl = new URL(
  "../docs/VTDT-profesiju-izveles-modelis.drawio",
  import.meta.url,
);

const xml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const styles = Object.freeze({
  start:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#292561;fontColor=#ffffff;strokeColor=#1f1b50;fontStyle=1;shadow=1;",
  quick:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#eee9ff;fontColor=#292561;strokeColor=#8f7cf3;fontStyle=1;",
  deep:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;fontColor=#203f66;strokeColor=#6c8ebf;fontStyle=1;",
  process:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#f7f4ff;fontColor=#292561;strokeColor=#8f7cf3;fontStyle=1;",
  decision:
    "rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;fontColor=#5e4510;strokeColor=#d6b656;fontStyle=1;",
  result:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;fontColor=#1f5b49;strokeColor=#82b366;fontStyle=1;shadow=1;",
  riasec:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#e1d5e7;fontColor=#3f2850;strokeColor=#9673a6;fontStyle=1;",
  tasks:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;fontColor=#203f66;strokeColor=#6c8ebf;fontStyle=1;",
  environment:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;fontColor=#1f5b49;strokeColor=#82b366;fontStyle=1;",
  active:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;fontColor=#1f5b49;strokeColor=#82b366;",
  note:
    "rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;fontColor=#555555;strokeColor=#b9b3d5;dashed=1;",
});

const vertex = ({
  id,
  label,
  x,
  y,
  width = 180,
  height = 58,
  style = styles.process,
}) => `
  <mxCell id="${xml(id)}" value="${xml(label)}" style="${xml(style)}" vertex="1" parent="1">
    <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/>
  </mxCell>`;

const edge = ({ id, source, target, label = "", style = "" }) => `
  <mxCell id="${xml(id)}" value="${xml(label)}" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#6f68a8;endArrow=block;endFill=1;${xml(style)}" edge="1" parent="1" source="${xml(source)}" target="${xml(target)}">
    <mxGeometry relative="1" as="geometry"/>
  </mxCell>`;

const page = (id, name, cells, width, height) => `
  <diagram id="${xml(id)}" name="${xml(name)}">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${width}" pageHeight="${height}" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        ${cells.join("\n").trim()}
      </root>
    </mxGraphModel>
  </diagram>`;

const flowCells = [
  vertex({ id: "f_start", label: "Sākums", x: 40, y: 180, style: styles.start }),
  vertex({ id: "f_mode", label: "Režīma izvēle", x: 260, y: 180, style: styles.decision }),
  vertex({ id: "f_quick", label: `Ātrais · ${ASSESSMENT_MODES.quick.baseQuestionIds.length} jautājumi`, x: 490, y: 80, style: styles.quick }),
  vertex({ id: "f_deep", label: `Padziļinātais · ${ASSESSMENT_MODES.deep.baseQuestionIds.length} jautājumi`, x: 490, y: 280, style: styles.deep }),
  vertex({ id: "f_profile", label: "22 dimensiju profils", x: 730, y: 180, style: styles.process }),
  vertex({ id: "f_compare", label: `${professions.length} profesiju salīdzinājums`, x: 960, y: 180, width: 195, style: styles.process }),
  vertex({ id: "f_need", label: "Rezultāti tuvi vai trūkst pārklājuma?", x: 1200, y: 155, width: 210, height: 105, style: styles.decision }),
  vertex({ id: "f_select", label: `Labākais neatbildētais precizējums no ${tieBreakers.length}`, x: 1180, y: 360, width: 230, style: styles.process }),
  vertex({ id: "f_limit", label: "Sasniegts režīma limits?", x: 900, y: 360, width: 200, style: styles.decision }),
  vertex({ id: "f_result", label: "Top 3 vai kopīga 1. vieta", x: 1190, y: 525, width: 220, style: styles.result }),
  vertex({ id: "f_note", label: "Ātrais: līdz 3 precizējumiem · Padziļinātais: līdz 2 · viena atbilde profesiju nepiešķir", x: 455, y: 525, width: 560, height: 70, style: styles.note }),
  edge({ id: "fe1", source: "f_start", target: "f_mode" }),
  edge({ id: "fe2", source: "f_mode", target: "f_quick", label: "Ātrais" }),
  edge({ id: "fe3", source: "f_mode", target: "f_deep", label: "Padziļinātais" }),
  edge({ id: "fe4", source: "f_quick", target: "f_profile" }),
  edge({ id: "fe5", source: "f_deep", target: "f_profile" }),
  edge({ id: "fe6", source: "f_profile", target: "f_compare" }),
  edge({ id: "fe7", source: "f_compare", target: "f_need" }),
  edge({ id: "fe8", source: "f_need", target: "f_result", label: "Nē" }),
  edge({ id: "fe9", source: "f_need", target: "f_select", label: "Jā" }),
  edge({ id: "fe10", source: "f_select", target: "f_limit" }),
  edge({ id: "fe11", source: "f_limit", target: "f_profile", label: "Vēl drīkst" }),
  edge({ id: "fe12", source: "f_limit", target: "f_result", label: "Limits" }),
];

const scaleLabel = ANSWER_SCALE.map(
  ({ label, coefficient }) => `${label} ${coefficient > 0 ? "+" : ""}${coefficient}`,
).join(" · ");
const scoringCells = [
  vertex({ id: "s_answer", label: `Atbilde\n${scaleLabel}`, x: 35, y: 185, width: 260, height: 80, style: styles.start }),
  vertex({ id: "s_vector", label: "Koeficients × jautājuma dimensiju vektors", x: 350, y: 185, width: 235, height: 80, style: styles.process }),
  vertex({ id: "s_profile", label: "Virziens + pierādījuma uzticamība katrā dimensijā", x: 650, y: 185, width: 245, height: 80, style: styles.process }),
  vertex({ id: "s_riasec", label: `RIASEC · ${dimensionsByGroup.riasec.length} dimensijas · 25%`, x: 965, y: 55, width: 235, style: styles.riasec }),
  vertex({ id: "s_tasks", label: `Uzdevumi/intereses · ${dimensionsByGroup.tasks.length} dimensijas · 55%`, x: 965, y: 185, width: 235, style: styles.tasks }),
  vertex({ id: "s_environment", label: `Vide/stils · ${dimensionsByGroup.environment.length} dimensijas · 20%`, x: 965, y: 315, width: 235, style: styles.environment }),
  vertex({ id: "s_formula", label: "100 × (0,25 × RIASEC + 0,55 × uzdevumi + 0,20 × vide)", x: 1270, y: 165, width: 270, height: 100, style: styles.process }),
  vertex({ id: "s_catalog", label: `${professions.length} aktuālo profesiju profili`, x: 650, y: 385, width: 245, style: styles.active }),
  vertex({ id: "s_rank", label: "Neapaļotu rādītāju salīdzinājums", x: 1270, y: 330, width: 270, style: styles.process }),
  vertex({ id: "s_top", label: "Atbilstības rādītājs + Top 3", x: 1270, y: 460, width: 270, style: styles.result }),
  vertex({ id: "s_note", label: "Pretrunīgi signāli samazina uzticamību. Viena atbilde profesiju nepiešķir. Rezultāts nav varbūtība.", x: 350, y: 500, width: 545, height: 70, style: styles.note }),
  edge({ id: "se1", source: "s_answer", target: "s_vector" }),
  edge({ id: "se2", source: "s_vector", target: "s_profile" }),
  edge({ id: "se3", source: "s_profile", target: "s_riasec" }),
  edge({ id: "se4", source: "s_profile", target: "s_tasks" }),
  edge({ id: "se5", source: "s_profile", target: "s_environment" }),
  edge({ id: "se6", source: "s_riasec", target: "s_formula" }),
  edge({ id: "se7", source: "s_tasks", target: "s_formula" }),
  edge({ id: "se8", source: "s_environment", target: "s_formula" }),
  edge({ id: "se9", source: "s_catalog", target: "s_rank" }),
  edge({ id: "se10", source: "s_formula", target: "s_rank" }),
  edge({ id: "se11", source: "s_rank", target: "s_top" }),
];

const coverageCells = [
  vertex({ id: "c_legend_quick", label: "Ātrā testa 10 jautājumi", x: 30, y: 25, width: 190, height: 42, style: styles.quick }),
  vertex({ id: "c_legend_deep", label: "Papildu 8 padziļinātie", x: 240, y: 25, width: 190, height: 42, style: styles.deep }),
  vertex({ id: "c_riasec", label: `RIASEC\n${dimensionsByGroup.riasec.map((id) => dimensions[id].shortLabel).join(" · ")}`, x: 790, y: 90, width: 520, height: 90, style: styles.riasec }),
  vertex({ id: "c_tasks", label: `Uzdevumi un intereses\n${dimensionsByGroup.tasks.map((id) => dimensions[id].shortLabel).join(" · ")}`, x: 790, y: 380, width: 520, height: 150, style: styles.tasks }),
  vertex({ id: "c_environment", label: `Darba vide un stils\n${dimensionsByGroup.environment.map((id) => dimensions[id].shortLabel).join(" · ")}`, x: 790, y: 730, width: 520, height: 100, style: styles.environment }),
];

questions.forEach((question, index) => {
  const quick = ASSESSMENT_MODES.quick.baseQuestionIds.includes(question.id);
  const x = quick ? 30 : 405;
  const row = quick ? index : index - ASSESSMENT_MODES.quick.baseQuestionIds.length;
  const y = 90 + row * 94;
  const id = `c_${question.id}`;
  coverageCells.push(
    vertex({
      id,
      label: `${question.number}. ${question.prompt}`,
      x,
      y,
      width: 340,
      height: 70,
      style: quick ? styles.quick : styles.deep,
    }),
  );
  const groups = new Set(
    Object.keys(question.vector).map((dimensionId) => dimensions[dimensionId].group),
  );
  for (const groupId of groups) {
    coverageCells.push(
      edge({
        id: `ce_${question.id}_${groupId}`,
        source: id,
        target: `c_${groupId}`,
        style: "opacity=42;",
      }),
    );
  }
});

const documentXml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2026-08-01T00:00:00.000Z" agent="VTDT generator" version="24.7.17" type="device">
${page("user-flow", "Lietotāja ceļš", flowCells, 1600, 720)}
${page("scoring-flow", "Punktu aprēķins", scoringCells, 1650, 680)}
${page("question-coverage", "Jautājumu pārklājums", coverageCells, 1400, 1100)}
</mxfile>
`;

await writeFile(fileURLToPath(outputUrl), documentXml, "utf8");
console.log(`Atjaunināts: ${fileURLToPath(outputUrl)}`);
