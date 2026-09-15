import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import {
  DIMENSION_GROUPS,
  dimensions,
  dimensionsByGroup,
} from "../data/dimensions.js";
import { professions, VTDT_SOURCES } from "../data/professions.js";
import {
  ANSWER_SCALE,
  ASSESSMENT_MODES,
  ASSESSMENT_VERSION,
  questions,
  tieBreakers,
} from "../data/questions.js";

const outputUrl = new URL(
  "../docs/VTDT-karjeras-paligs-direktoram.md",
  import.meta.url,
);

const number = (value) => String(value).replace(".", ",");
const groupLabel = (groupId) => DIMENSION_GROUPS[groupId].label;
const quickIds = new Set(ASSESSMENT_MODES.quick.baseQuestionIds);

const professionRows = [...new Set(professions.map(({ sector }) => sector))]
  .sort((first, second) => first.localeCompare(second, "lv"))
  .map((sector) => {
    const titles = professions
      .filter((profession) => profession.sector === sector)
      .map(({ title }) => title)
      .join("; ");
    return `| ${sector} | ${titles} |`;
  })
  .join("\n");

const questionRows = questions
  .map((question) => {
    const measured = Object.entries(question.vector)
      .map(
        ([dimensionId, weight]) =>
          `${dimensions[dimensionId].shortLabel} (${number(weight)})`,
      )
      .join("; ");
    return `| ${question.number} | ${quickIds.has(question.id) ? "Ātrais + padziļinātais" : "Padziļinātais"} | ${question.prompt} | ${measured} |`;
  })
  .join("\n");

const answerRows = ANSWER_SCALE.map(
  ({ label, coefficient }) =>
    `| ${label} | ${coefficient > 0 ? "+" : ""}${coefficient} |`,
).join("\n");

const matrixTable = (groupId, dimensionSubset = dimensionsByGroup[groupId]) => {
  const headers = dimensionSubset.map((id) => dimensions[id].shortLabel);
  const separator = dimensionSubset.map(() => "---:");
  const rows = professions.map(
    (profession) =>
      `| ${profession.title} | ${dimensionSubset
        .map((id) => number(profession.profile[id].toFixed(2)))
        .join(" | ")} |`,
  );
  return [
    `| Profesija | ${headers.join(" | ")} |`,
    `|---|${separator.join("|")}|`,
    ...rows,
  ].join("\n");
};

const clarifierRows = tieBreakers
  .map((question, index) => {
    const positive = Object.entries(question.vector)
      .filter(([, weight]) => weight > 0)
      .sort((first, second) => second[1] - first[1])
      .slice(0, 3)
      .map(([id]) => dimensions[id].shortLabel)
      .join(", ");
    const negative = Object.entries(question.vector)
      .filter(([, weight]) => weight < 0)
      .sort((first, second) => first[1] - second[1])
      .slice(0, 3)
      .map(([id]) => dimensions[id].shortLabel)
      .join(", ");
    return `| ${index + 1} | ${question.prompt} | ${positive || "—"} | ${negative || "—"} |`;
  })
  .join("\n");

const taskFirst = dimensionsByGroup.tasks.slice(0, 6);
const taskSecond = dimensionsByGroup.tasks.slice(6);

const markdown = `# VTDT karjeras un profesiju izvēles palīgs

## Direktora informatīvais apraksts

**Modeļa versija:** ${ASSESSMENT_VERSION}  
**Sagatavots:** 2026. gada 4. septembrī  
**Oficiālais profesiju avots:** [VTDT profesiju katalogs](${VTDT_SOURCES.catalogue})

> Šis dokuments izskaidro rīka darbību vadības, pedagogu un karjeras atbalsta vajadzībām. Rīks palīdz sākt profesiju izpēti, bet nav zinātniski validēts psiholoģisks tests.

## 1. Mērķis un auditorija

VTDT karjeras palīgs ir paredzēts galvenokārt 9.–10. klašu jauniešiem aptuveni 14–17 gadu vecumā. Tā uzdevums nav “izlemt skolēna vietā”, bet īsā sarunveida testā pamanīt interešu, domāšanas veida un vēlamās darba vides kombināciju un piedāvāt trīs VTDT profesijas tālākai izpētei.

Rīks ir statiska tīmekļa aplikācija bez ārēja servera, datubāzes un izsekošanas. Tā darbojas GitHub Pages un rezultātu aprēķina lietotāja pārlūkā.

## 2. Ātrais un padziļinātais režīms

| Kritērijs | Ātrais tests | Padziļinātais tests |
|---|---|---|
| Mērķis | Ātra iepazīšanās un Top 3 | Plašāks profesiju salīdzinājums |
| Pamata jautājumi | 10 | 18 |
| Adaptīvi precizējumi | 0–3 | 0–2 |
| Kopējais jautājumu skaits | 10–13 | 18–20 |
| Aptuvenais laiks | 1–2 minūtes | ap 3 minūtēm |
| Dimensiju grupu pārklājums | visas 3 grupas un visas 22 dimensijas | visas 3 grupas un visas 22 dimensijas ar atkārtotiem mērījumiem |

Ātrais tests ir sākuma ekrāna ieteiktais režīms. Ja jaunietis vēlas plašāku salīdzinājumu, viņš var turpināt padziļinātajā režīmā, saglabājot pirmo desmit jautājumu atbildes.

\`\`\`mermaid
flowchart LR
  A[Sākums] --> B{Režīms}
  B -->|Ātrais| C[10 pamata jautājumi]
  B -->|Padziļinātais| D[18 pamata jautājumi]
  C --> E[22 dimensiju profils]
  D --> E
  E --> F[13 profesiju salīdzinājums]
  F --> G{Vajag precizējumu?}
  G -->|Jā| H[Labākais neatbildētais jautājums]
  H --> E
  G -->|Nē vai limits| I[Top 3 / kopīga 1. vieta]
\`\`\`

## 3. Aktuālās profesijas pa nozarēm

Runtime katalogā ir tieši 13 profesijas, kas 2026. gada 1. augustā bija norādītas VTDT aktuālajā katalogā.

| Nozare | Profesijas |
|---|---|
${professionRows}

Inženiersistēmu būvtehniķis un Atjaunojamās enerģētikas tehniķis jaunajā runtime versijā nav iekļauti, jo tie nav aktuālajā VTDT katalogā. To vēsturiskais stāvoklis saglabāts projekta arhīva versijā.

## 4. Kāpēc jautājumi ir netieši

Tieši jautājumi, piemēram, “Vai Tev patīk programmēt?” vai “Vai Tev patīk remontēt automašīnas?”, ļauj jaunietim atminēt rezultātu un bieži mēra jau zināmu profesijas nosaukuma simpātiju, nevis darba stilu. Tāpēc jaunais komplekts izmanto starpnozaru situācijas: kļūdas atrašanu, taustāma rezultāta nozīmi, telpisku iztēli, pacietību, mainīgus apstākļus, darba secību, sadarbību un citus signālus.

Katrs pamata jautājums vienlaikus ietekmē 3–6 dimensijas. Atbilde neatsaucas uz profesijas ID. Viena atbilde tiek apzināti slāpēta ar pierādījuma uzticamību, tāpēc tā nevar izveidot praktiski izšķirtu rezultātu.

## 5. Visi 18 pamata jautājumi un to dimensiju svari

Svars tabulā ir jautājuma dimensiju vektors pirms atbildes koeficienta. Piemēram, “Drīzāk jā” reizina visas rindā norādītās vērtības ar \`+1\`, bet “Nē” — ar \`−2\`.

| Nr. | Režīms | Jautājums | Mērītās dimensijas un vektora svars |
|---:|---|---|---|
${questionRows}

## 6. Četru atbilžu koeficienti

| Atbilde | Koeficients |
|---|---:|
${answerRows}

Skalā nav neitrālas izvēles. Jaunietis izvēlas tuvāko no divām pozitīvām vai divām negatīvām atbildēm; neviena atbilde profesiju nepiešķir tieši.

## 7. Gala formula

Profils izmanto divus satura slāņus un trīs gala grupas:

| Grupa | Dimensiju skaits | Gala svars |
|---|---:|---:|
| RIASEC intereses | ${dimensionsByGroup.riasec.length} | 25% |
| Konkrēti uzdevumi un profesionālās intereses | ${dimensionsByGroup.tasks.length} | 55% |
| Darba vide un darba stils | ${dimensionsByGroup.environment.length} | 20% |

\`\`\`text
atbilstības rādītājs = 100 × (
  0,25 × RIASEC sakritība +
  0,55 × uzdevumu/interešu sakritība +
  0,20 × vides/stila sakritība
)
\`\`\`

Katras dimensijas signālu normalizē pret faktiski saturiski atbildētajiem jautājumiem. Uzticamība pieaug, ja par dimensiju ir vairāki savstarpēji saskanīgi signāli; pretrunīgas atbildes uzticamību samazina.

**Vienkāršots piemērs.** Ja RIASEC sakritība ir \`0,70\`, uzdevumu sakritība \`0,80\`, bet vides/stila sakritība \`0,60\`, tad:

\`\`\`text
100 × (0,25 × 0,70 + 0,55 × 0,80 + 0,20 × 0,60) = 73,5
\`\`\`

Rezultātā redzams **73,5 / 100** atbilstības rādītājs. Tas nav 73,5% varbūtība.

## 8. Adaptīvo precizējumu princips

Precizējumu var aktivizēt trīs iemesli: ļoti maza Top 1–Top 2 starpība, praktiski vienāds Top 3 vai nepietiekams dimensiju grupas pārklājums.

Algoritms no ${tieBreakers.length} netiešu jautājumu bankas izvēlas neatbildēto kandidātu, kas:

1. vislabāk nošķir pašreizējo Top 2 un Top 3 profesiju dimensiju profilus;
2. papildina vēl vāji mērītas dimensijas;
3. pēc vektora nav pārāk līdzīgs jau uzdotajiem jautājumiem.

Kandidātu neuzdod, ja tā dimensijas jau ir pietiekami nosegtas. Izvēle ir determinēta: vienāda atbilžu vēsture vienmēr dod to pašu precizējumu. Gan pamata, gan uzdotie precizējošie jautājumi piedalās informācijas pietiekamības aprēķinā. Ja pēc režīma limita rezultāti joprojām ir praktiski vienādi, UI rāda kopīgu pirmo vietu, nevis mākslīgu uzvarētāju.

| Nr. | Precizējošais jautājums | Spēcīgākais “jā” virziens | Spēcīgākais pretējais virziens |
|---:|---|---|---|
${clarifierRows}

## 9. Validācija, skolēnu profili un simulācijas

Automātiskais komplekts izmanto tikai Node iebūvēto \`node:test\` un pārbauda datu integritāti, normalizāciju, simetriju, tukšu profilu, atbildes maiņu, neizšķirtus, adaptīvo izvēli, stāvokļa limitus un sasniedzamību.

| Pārbaude | Rezultāts |
|---|---|
| Loģiskās personas | 13 no 13 padziļinātajā režīmā Top 1; 13 no 13 ātrajā režīmā Top 3 |
| Dažādi jauniešu scenāriji | 10 profili; vizuāli radošam profilam apģērbu dizains abos režīmos ir Top 3 |
| Vienas atbildes tests | nevienā gadījumā nav gala līdera; Top 1–Top 2 starpība nepārsniedz 2,5 punktus |
| Ātrais — 30 000 profili | Top 1 diapazons 1,30–17,35%; zemākais Top 3 11,19%; jautājumi 10–13 |
| Padziļinātais — 30 000 profili | Top 1 diapazons 1,74–16,68%; zemākais Top 3 9,46%; jautājumi 18–20 |
| Tukšs profils | visām profesijām 50,0; nav līdera vai fallback profesijas |

Nejauša simulācija pārbauda strukturālu sasniedzamību un pārmērīgu dominanci. Tā neprognozē īstu skolēnu atbilžu sadalījumu.

## 10. Profesiju un dimensiju svaru matrica

Vērtības \`0–1\` ir redakcionāls profesijas profils. Tās nav VTDT publicēti psihometriski normatīvi. Labākai salasāmībai 22 dimensijas sadalītas četrās tabulās.

### 10.1. RIASEC dimensijas

${matrixTable("riasec")}

### 10.2. Uzdevumu/interešu dimensijas — 1. daļa

${matrixTable("tasks", taskFirst)}

### 10.3. Uzdevumu/interešu dimensijas — 2. daļa

${matrixTable("tasks", taskSecond)}

### 10.4. Darba vide un darba stils

${matrixTable("environment")}

## 11. Ierobežojumi

- Tas ir karjeras orientācijas palīgs, nevis zinātniski validēts psiholoģisks tests.
- Profesiju dimensiju svari ir redakcionāli, auditējami pieņēmumi; VTDT katalogs apstiprina nosaukumus un nozares, nevis svarus.
- 30 000 nejaušu profilu simulācija neatdarina reālu jauniešu atbildes.
- Intereses var mainīties, un nevienas profesijas ikdienu nevar pilnībā aptvert ar 10 vai 18 jautājumiem.
- Rezultāts nav uzņemšanas lēmums, garantija vai atzinums par skolēna spējām.

## 12. Ieteikumi tālākai pārbaudei

1. Veikt pilotu ar vismaz 30–50 dažādu skolu 9.–10. klašu skolēniem.
2. Pēc testa īsā intervijā pajautāt, vai jautājumi bija saprotami un vai atbildes virziens nebija pārāk acīmredzams.
3. Salīdzināt ātrā un padziļinātā testa Top 3 stabilitāti vieniem un tiem pašiem skolēniem.
4. Iesaistīt VTDT profesionālo programmu pedagogus profilu matricas ekspertu pārskatā.
5. Pārbaudīt rezultātus kopā ar karjeras konsultantu, bet nesaukt to par psihometrisku validāciju bez atbilstošas metodikas.
6. Pēc pilotēšanas dokumentēti koriģēt tikai tos jautājumus vai svarus, kuriem ir atkārtojami pierādījumi.

## 13. Pārvaldība un atjaunināšana

- Aktuālo profesiju katalogu pārbaudīt pirms katra uzņemšanas cikla.
- Jautājumus, dimensijas un profesiju profilus glabāt centralizētajos \`data/\` failos.
- Pēc datu maiņas obligāti palaist \`npm run check\` un atjaunot Draw.io ar \`npm run generate:diagram\`.
- Modeļa izmaiņai palielināt \`assessmentVersion\`, lai vecs \`localStorage\` stāvoklis netiktu sajaukts ar jauno jautājumu modeli.

Detalizēta tehniskā formula: [assessment-model.md](assessment-model.md). Rediģējama diagramma: [VTDT-profesiju-izveles-modelis.drawio](VTDT-profesiju-izveles-modelis.drawio).
`;

await writeFile(fileURLToPath(outputUrl), markdown, "utf8");
console.log(`Atjaunināts: ${fileURLToPath(outputUrl)}`);
