# VTDT karjeras tests

Statisks Vidzemes Tehnoloģiju un dizaina tehnikuma profesiju izvēles palīgs 9.–10. klašu jauniešiem. Lietotājs izvēlas ātro vai padziļināto režīmu, atbild ar četrām īsām atbildēm un saņem Top 3 virzienus vai godīgi parādītu neizšķirtu.

Production versija ir parasts HTML, CSS un ES moduļu JavaScript. Tai nav framework, bundler, backend, datubāzes vai frontend runtime atkarību, un tā darbojas GitHub Pages bez build soļa.

## Režīmi

| Režīms | Pamata jautājumi | Adaptīvi precizējumi | Kopā | Aptuvenais laiks |
|---|---:|---:|---:|---:|
| Ātrais (ieteicamais) | 10 | 0–3 | 10–13 | 1–2 minūtes |
| Padziļinātais | 18 | 0–2 | 18–20 | ap 3 minūtēm |

Abos režīmos katram jautājumam ir viena skala: **Jā**, **Drīzāk jā**, **Drīzāk nē**, **Nē**. Pozitīvās atbildes UI ir zaļas, negatīvās — sarkanas; intensitāte atbilst koeficientam.

## Projekta mērķi

- dot jaunietim ātru un viegli saprotamu sākumpunktu profesiju izpētei;
- neļaut vienai atbildei noteikt profesiju vai izslēgt veselu nozari;
- lietot netiešus, starpnozaru jautājumus, no kuriem nevar vienkārši “atminēt” rezultātu;
- saglabāt auditējamu 22 dimensiju un `25/55/20` vērtēšanas modeli;
- tukšai vai bojātai atbilžu vēsturei nerādīt noklusējuma profesiju;
- skaidri saukt rezultātu par **atbilstības rādītāju**, nevis varbūtību vai diagnozi.

## Failu struktūra

```text
.
├── index.html
├── styles.css
├── data/
│   ├── content.js                    # centralizēti UI un rezultātu teksti
│   ├── dimensions.js                 # 22 dimensijas un grupu svari
│   ├── professions.js                # tieši 13 aktuālās profesijas un profili
│   └── questions.js                  # 18 jautājumi, režīmi, skala, 31 precizējums
├── js/
│   ├── app.js                        # UI, navigācija, pieejamība, localStorage
│   ├── scoring.js                    # tīras normalizācijas un adaptācijas funkcijas
│   └── ui-logic.js                   # testējama tastatūras un rangu UI loģika
├── tests/
│   ├── adaptive.test.js
│   ├── candidate-cohort.js           # 130 sintētisku kandidātu kohorta
│   ├── candidate-cohort.test.js
│   ├── data-integrity.test.js
│   ├── docs-integrity.test.js
│   ├── personas.js
│   ├── personas.test.js
│   ├── scoring.test.js
│   ├── student-journeys.js           # 10 atšķirīgi jauniešu profili
│   ├── student-journeys.test.js
│   ├── simulation.test.js            # 30 000 profili katram režīmam
│   └── ui-logic.test.js
├── docs/
│   ├── current-tree-audit.md
│   ├── assessment-model.md
│   ├── VTDT-karjeras-paligs-direktoram.md
│   ├── VTDT-karjeras-paligs-direktoram.docx
│   └── VTDT-profesiju-izveles-modelis.drawio
├── scripts/
│   ├── export-director-data.mjs
│   ├── generate-director-docx.py
│   ├── generate-director-markdown.mjs
│   ├── audit-candidate-cohort.mjs
│   └── generate-drawio.mjs
├── output/pdf/
│   └── VTDT-karjeras-paligs-direktoram.pdf
└── package.json
```

## Lokāla palaišana

ES moduļu dēļ projektu atver caur statisku HTTP serveri, nevis ar dubultklikšķi uz `index.html`.

```bash
python3 -m http.server 8000
```

Pēc tam atver <http://localhost:8000>. `npm install` nav vajadzīgs.

## Testi

Nepieciešams Node.js 20 vai jaunāks.

```bash
npm test
npm run check
```

`npm run check` pārbauda JavaScript sintaksi un palaiž visu `node:test` komplektu. Testi aptver datu integritāti, normalizāciju, atbildes maiņu, neizšķirtu, adaptīvo izvēli, 13 profesiju personas, 130 kandidātu kohortu, 10 atšķirīgus jauniešu scenārijus un divas deterministiskas 30 000 profilu simulācijas.

Detalizētu 130 kandidātu rezultātu var atkārtot atsevišķi:

```bash
npm run audit:candidates
```

Metodika, rezultāti pirms/pēc un profesiju pāru nošķīrēji aprakstīti [130 kandidātu auditā](docs/candidate-cohort-audit.md).

Draw.io failu no tiem pašiem aplikācijas datiem atjauno ar:

```bash
npm run generate:diagram
```

## Vērtēšanas modelis īsumā

Atbildes vispirms izveido lietotāja dimensiju profilu. Tikai pēc tam to salīdzina ar visu 13 profesiju profiliem.

| Grupa | Svars |
|---|---:|
| RIASEC intereses | 25% |
| VTDT uzdevumi un profesionālās intereses | 55% |
| Darba vide un darba stils | 20% |

Jautājuma dimensiju vektoru reizina ar koeficientu `+2`, `+1`, `−1` vai `−2`. Normalizācija izmanto konkrētajā režīmā uzdotos un atbildētos jautājumus, bet pierādījuma uzticamība ierobežo vienas atbildes spēku. Pēc visu pamata jautājumu atbildēšanas uzdevumu grupā 30% svara saņem profesijas galvenās darba intereses, lai personības atšķirības nepārspētu skaidru profesionālo interesi. Precizējumu izvēlas determinēti no 31 jautājuma bankas, ņemot vērā Top 5, nozares neskaidrību, profesiju nošķiršanu un pārklājumu.

Pilna formula, sliekšņi un ierobežojumi: [docs/assessment-model.md](docs/assessment-model.md).

## 13 aktuālās profesijas

Saraksts 2026-08-01 pārbaudīts VTDT [aktuālajā profesiju katalogā](https://www.vtdt.lv/profesijas).

| Nozare | Profesijas |
|---|---|
| Autotransports | Automehāniķis; Autovirsbūvju remonta tehniķis |
| Būvniecība | Apdares darbu tehniķis; Arhitektūras tehniķis; Ēku būvtehniķis; Namdaris |
| Dizains | Apģērbu dizainera asistents |
| Enerģētika | Elektrotehniķis |
| Informācijas un komunikācijas tehnoloģijas | Datorsistēmu tehniķis; Programmēšanas tehniķis |
| Kokapstrāde | Mēbeļu galdnieks |
| Lauksaimniecība | Augkopības tehniķis; Lauksaimniecības mehanizācijas tehniķis |

Inženiersistēmu būvtehniķis un Atjaunojamās enerģētikas tehniķis no jaunās runtime versijas ir izņemti, jo tie nav aktuālajā VTDT katalogā. To vēsturiskais stāvoklis saglabāts lokālajā arhīva versijā `v1-weighted-multichoice`.

## Stāvoklis un pieejamība

- visas izvēles ir semantiski `<button type="button">` elementi;
- darbojas Tab/Enter un ciparu taustiņi `1–4`;
- redzams `:focus-visible`, jautājumu un rezultātu maiņu paziņo `aria-live` reģions;
- progresa josla dinamiski izmanto 10 vai 18 pamata jautājumu maksimumu;
- precizējumi tiek parādīti atsevišķi ar režīma limitu;
- “Atpakaļ” saglabā iepriekšējo izvēli, bet atbildes maiņa anulē no vecā profila atkarīgos precizējumus;
- rezultātu vienmēr pārrēķina no atbilžu vēstures;
- `localStorage` glabā `assessmentVersion` un droši ignorē vecu vai bojātu stāvokli;
- jaunā logā atvērtām saitēm ir `rel="noopener noreferrer"`;
- fiksētajai VTDT apakšjoslai ir rezervēta vieta, tāpēc tā neaizsedz saturu;
- izkārtojums paredzēts 320, 375, 768 un desktop platumiem.

Vizuālā valoda apzināti saglabā sākotnējās VTDT karjeras palīga lapas tumši violeto galveni, gaiši violeto fonu, centrēto balto testa kartīti un VTDT apakšjoslu, lai rīku varētu organiski iekļaut esošajā skolas tīmekļvietnē.

## GitHub Pages publicēšana

1. Repozitorijā atver **Settings → Pages**.
2. Pie **Build and deployment** izvēlies **Deploy from a branch**.
3. Izvēlies publicējamo zaru un mapi `/ (root)`.
4. Saglabā iestatījumu.

Visas projekta iekšējās saites ir relatīvas, tāpēc aplikācija darbojas arī repozitorija apakšceļā. Build solis nav vajadzīgs.

## Ierobežojums

Atbilstības rādītājs ir karjeras orientācijas un izpētes ieteikums, nevis zinātniski validēta psiholoģiska diagnoze. Profesiju profilu koeficienti ir redakcionāls, testējams modelis. Rezultātu ieteicams papildināt ar sarunu, atvērto durvju dienu un praktisku profesijas iepazīšanu.
