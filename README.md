# VTDT virzienu kompass

Viegls, statisks Vidzemes Tehnoloģiju un dizaina tehnikuma profesiju izvēles palīgs. Lietotājs atbild uz 18 situāciju jautājumiem un, ja divi rezultāti ir ļoti tuvi, ne vairāk kā diviem adaptīviem precizējumiem. Rezultāts ir trīs izpētei piemērotākie virzieni ar personalizētu pamatojumu.

Lietotne neizmanto framework, bundler, backend, datubāzi vai frontend runtime atkarības. Production versija ir parasts HTML, CSS un ES moduļu JavaScript un darbojas GitHub Pages bez build soļa.

## Projekta mērķis

- palīdzēt jaunietim pēc pamatskolas pamanīt vairākus iespējamos profesionālos virzienus;
- nepiešķirt profesiju pēc vienas atbildes un neizslēgt nozari ar vienu bināru izvēli;
- skaidri nošķirt sakritības indeksu no varbūtības vai psiholoģiskas diagnozes;
- saglabāt visas 15 vēsturiskās profesijas, bet pēc noklusējuma vērtēt aktuālās 13;
- padarīt modeli, profesiju statusus un jautājumu efektus pārskatāmus un testējamus.

## Failu struktūra

```text
.
├── index.html                         # semantisks, pieejams aplikācijas karkass
├── styles.css                         # responsīvs dizains un CSS mainīgie
├── js/
│   ├── app.js                         # UI, navigācija, localStorage un rezultātu skats
│   └── scoring.js                     # tīras normalizācijas un rankošanas funkcijas
├── data/
│   ├── content.js                     # kopīgie UI un rezultātu teksti
│   ├── dimensions.js                  # 22 dimensijas un 25/55/20 grupu svari
│   ├── professions.js                 # 15 profesiju katalogs, statusi un profili
│   └── questions.js                   # 18 jautājumi, 9 pāru un vispārīgie tie-breaker
├── tests/
│   ├── data-integrity.test.js         # dati, personas un 30 000 profilu simulācija
│   ├── personas.js                    # 15 loģiskas testa personas
│   └── scoring.test.js                # formulas un stāvokļa pārrēķina testi
├── docs/
│   ├── current-tree-audit.md          # sākotnējā binārā koka audits
│   ├── assessment-model.md            # precīza formula un ierobežojumi
│   └── VTDT-profesiju-izveles-modelis.drawio
├── scripts/
│   └── generate-drawio.mjs            # diagrammas ģenerators no aplikācijas datiem
└── package.json                       # tikai Node iebūvētie testi un darba skripti
```

## Lokāla palaišana

ES moduļu dēļ atver projektu caur nelielu HTTP serveri, nevis ar dubultklikšķi uz `index.html`.

Ar Python:

```bash
python3 -m http.server 8000
```

Pēc tam atver [http://localhost:8000](http://localhost:8000).

Var izmantot jebkuru citu statisku failu serveri. Nav jāizpilda `npm install`, jo projektam nav ārēju pakotņu.

## Testi un pārbaudes

Nepieciešams Node.js 20 vai jaunāks.

```bash
npm test
```

Pilna sintakses un testu pārbaude:

```bash
npm run check
```

Testi izmanto tikai Node iebūvēto `node:test` un pārbauda:

- tieši 18 pamata jautājumus un to atbilžu struktūru;
- visu efektu dimensiju eksistenci un `[-2; 2]` limitu;
- katras dimensijas mērīšanu vairāk nekā vienā jautājumā;
- pilnus profesiju profilus, statusus un VTDT URL;
- tiešu profesijas rezultātu neesamību atbilžu datos;
- normalizāciju, pozitīvus un negatīvus signālus, neitrālu profilu un Top 3 secību;
- vienādus rezultātus bez noklusējuma līdera;
- tie-breaker slieksni, atbildes maiņu un pilnu pārrēķinu;
- `legacy` izslēgšanu/iekļaušanu;
- 15 loģiskas testa personas;
- deterministisku 30 000 nejaušu atbilžu simulāciju, lai pamanītu nesasniedzamas vai dominējošas profesijas.

Draw.io failu pēc profesiju vai precizējošo pāru datu maiņas atjauno ar:

```bash
npm run generate:diagram
```

## Vērtēšanas modelis īsumā

Atbildes maina 22 dimensiju profilu, nevis piešķir profesiju. Dimensijas ir sadalītas trīs grupās:

| Grupa | Svars |
|---|---:|
| RIASEC intereses | 25% |
| VTDT uzdevumi un profesionālās intereses | 55% |
| Darba vide un darba stils | 20% |

Katras dimensijas pozitīvais un negatīvais signāls tiek normalizēts pret teorētiski iespējamo maksimumu visos 18 jautājumos. Negatīva signāla svars ir `0,65`, bet precizējoša jautājuma efekta svars — `0,5`. Vienas atbildes efekts vienā dimensijā nepārsniedz `2`.

Nezināmas dimensijas sakritība visām profesijām ir neitrāli `0,5`. Gala rezultāts ir svērts grupu vidējais skalā `0–100`, ko sauc par **sakritības indeksu**. Tas nav varbūtības procents.

Ja Top 2 neapaļoto indeksu starpība ir mazāka par `0,25` un ir vismaz 9 saturīgas pamata atbildes, parādās līdz diviem precizējošiem jautājumiem. Slieksnis kalibrēts ar 30 000 nejaušu profilu simulāciju, lai precizējums būtu adaptīvs, nevis gandrīz obligāts. Deviņiem tuviem profesiju pāriem ir īpašas kolekcijas; citam pārim no vispārīgās kolekcijas automātiski izvēlas divus jautājumus ar lielāko dimensiju atšķiršanas spēju. Pēc katras atbildes viss rezultāts tiek pārrēķināts no `answers` un `tieBreakerAnswers`.

Ja visas atbildes ir neitrālas, visas profesijas iegūst vienādu bāzes indeksu `50`, līderis ir `null`, precizējums netiek uzdots un UI rāda vairākus plašus virzienus bez stingras secības.

Pilna formula: [docs/assessment-model.md](docs/assessment-model.md).

## Profesiju statuss

Statusi pārbaudīti 2026-08-01 pēc VTDT [profesiju kataloga](https://www.vtdt.lv/profesijas), [2026. gada atvērto durvju dienu saraksta](https://www.vtdt.lv/single-post/profesiju-atv%C4%93rto-durvju-dienas-2026) un [2025. gada vēsturiskā saraksta](https://www.vtdt.lv/single-post/profesiju-atv%C4%93rto-durvju-dienas-2025).

`active` šajā projektā nozīmē, ka profesija ir gan aktuālajā katalogā, gan 2026. gada 13 profesiju sarakstā. `legacy` nozīmē, ka profesija bija 2025. gada 15 profesiju sarakstā, bet nav aktuālajā katalogā vai 2026. gada sarakstā. Tā ir projekta pieejamības klasifikācija; VTDT šos angļu statusa vārdus savā vietnē nelieto.

| Profesija | Nozare | Statuss |
|---|---|---|
| Apģērbu dizainera asistents | Dizains | `active` |
| Lauksaimniecības mehanizācijas tehniķis | Lauksaimniecība | `active` |
| Augkopības tehniķis | Lauksaimniecība | `active` |
| Mēbeļu galdnieks | Kokapstrāde | `active` |
| Apdares darbu tehniķis | Būvniecība | `active` |
| Ēku būvtehniķis | Būvniecība | `active` |
| Namdaris | Būvniecība | `active` |
| Arhitektūras tehniķis | Būvniecība | `active` |
| Inženiersistēmu būvtehniķis | Būvniecība | `legacy` |
| Datorsistēmu tehniķis | Informācijas un komunikācijas tehnoloģijas | `active` |
| Programmēšanas tehniķis | Informācijas un komunikācijas tehnoloģijas | `active` |
| Automehāniķis | Autotransports | `active` |
| Autovirsbūvju remonta tehniķis | Autotransports | `active` |
| Elektrotehniķis | Enerģētika | `active` |
| Atjaunojamās enerģētikas tehniķis | Enerģētika | `legacy` |

Aktīvo kopu maina vienā vietā — `professionStatusConfig` failā `data/professions.js`. Pēc noklusējuma scoring iekļauj tikai statusu `active`; testos vai citā skatā var nodot arī `legacy` vai `unverified`.

VTDT lapā Autovirsbūvju remonta tehniķa URL joprojām satur vēsturisko slug `autovirsbuvju-remontatsledznieks`, lai gan aktuālā iegūstamā kvalifikācija katalogā ir “Autovirsbūvju remonta tehniķis”. Inženiersistēmu būvtehniķim stabila atsevišķa aktuālā lapa netika atrasta, bet Atjaunojamās enerģētikas tehniķa agrākā individuālā lapa pašlaik atgriež `404`; abām `legacy` profesijām katalogā tādēļ izmantots dzīvais VTDT 2025. gada oficiālais ieraksts.

## GitHub Pages publicēšana

1. GitHub repozitorijā atver **Settings → Pages**.
2. Sadaļā **Build and deployment** izvēlies **Deploy from a branch**.
3. Izvēlies vajadzīgo branch (parasti `main`) un mapi `/ (root)`.
4. Saglabā. GitHub publicēs `index.html` bez build soļa.

Visas iekšējās saites ir relatīvas, tādēļ lietotne darbojas arī projekta apakšceļā, piemēram, `https://lietotajs.github.io/VTDT-Karjera/`.

## Pieejamība un stāvoklis

- visas vadīklas ir semantiski `button` vai `a` elementi;
- redzams `:focus-visible`, darbojas Tab/Enter un ciparu taustiņi `1–6`;
- jautājumu un rezultātu maiņa tiek paziņota ar `aria-live`;
- progresa joslai ir `role="progressbar"` un atbilstošas vērtības;
- “Atpakaļ” atgriež tieši iepriekšējo jautājumu un saglabā izvēli;
- rezultātu skatā “Mainīt atbildes” atgriež uz pēdējo jautājumu;
- `localStorage` saglabā `assessmentVersion` un ignorē vecu vai bojātu stāvokli;
- visas jaunā logā atvērtās saites lieto `rel="noopener noreferrer"`;
- footer nav fiksēts un neaizsedz saturu.

## Ierobežojums

Rezultāts ir karjeras izpētes ieteikums, nevis profesionāla psiholoģiska diagnoze. Profesiju profilu koeficienti ir redakcionāls, testējams modelis, nevis VTDT apstiprināti psihometriski mērījumi. Lēmumu ieteicams papildināt ar sarunu, atvērto durvju dienu un praktisku profesijas iepazīšanu.
