# Sākotnējā binārā koka audits

Šis dokuments fiksē publiskā repozitorija sākotnējo stāvokli pirms pārbūves. Audits veikts 2026-08-01 pret `main` commit `ccf7f6e` (`css pielāgošana`). Sākotnējā versija sastāvēja no `index.html`, `styles.css`, `script.js` un vienas rindas `README.md`.

## Koka struktūra

| Rādītājs | Rezultāts |
|---|---:|
| Profesijas | 15 |
| Jautājumu mezgli | 108 |
| `yes/no` pārejas | 216 |
| No `root` sasniedzami jautājumi | 104 |
| Miruši jautājumu mezgli | 4 |
| Pilni saknes–rezultāta ceļi | 137 |
| Īsākais ceļš | 6 jautājumi |
| Garākais ceļš | 11 jautājumi |

Mirušie mezgli bija:

- `q7_no_yes_yes_no_no_no`;
- `q7_no_yes_yes_no_yes_no`;
- `q7_no_yes_yes_yes_no_no`;
- `q7_no_yes_yes_yes_yes_no`.

Visas 216 pārejas tehniski norādīja uz eksistējošu jautājumu vai profesiju, un visas 15 profesijas bija sasniedzamas. Tas tomēr nenozīmēja vienlīdzīgu vai pamatotu sasniedzamību.

Ceļu garumu sadalījums:

| Jautājumu skaits ceļā | Ceļu skaits |
|---:|---:|
| 6 | 27 |
| 7 | 58 |
| 8 | 27 |
| 9 | 5 |
| 11 | 20 |

## Strukturālais aizspriedums

Pirmā jautājuma “Jā” zars atstāja tikai 5 no 15 profesijām, bet “Nē” zars — 12. Tātad viena ļoti vispārīga atbilde uzreiz izslēdza divas trešdaļas kataloga.

Pie neatkarīgām, vienādi iespējamām “Jā” un “Nē” atbildēm precīzais rezultātu sadalījums bija:

| Profesija | Rezultāta īpatsvars |
|---|---:|
| Apdares darbu tehniķis | 17,96875% |
| Programmēšanas tehniķis | 15,62500% |
| Datorsistēmu tehniķis | 15,62500% |
| Ēku būvtehniķis | 12,74414% |
| Mēbeļu galdnieks | 11,71875% |
| Namdaris | 6,49414% |
| Arhitektūras tehniķis | 6,49414% |
| Atjaunojamās enerģētikas tehniķis | 2,34375% |
| Augkopības tehniķis | 2,14844% |
| Elektrotehniķis | 1,80664% |
| Apģērbu dizainera asistents | 1,56250% |
| Automehāniķis | 1,56250% |
| Autovirsbūvju remontatslēdznieks | 1,56250% |
| Lauksaimniecības mehānizācijas tehniķis | 1,56250% |
| Inženiersistēmu būvtehniķis | 0,78125% |

Šie skaitļi iegūti, uzskaitot visus pilnos ceļus un katram ceļam piešķirot svaru `2^(-ceļa garums)`.

## Atkārtojumi un neefektīvi jautājumi

108 mezglos bija tikai 40 unikāli jautājumu teksti. Jautājums par programmu vai datorspēļu veidošanu atkārtojās 10 mezglos, bet jautājums par ilgstošu meistarošanu — 8 mezglos.

Piecos sasniedzamos mezglos “Jā” un “Nē” veda uz vienu un to pašu nākamo mezglu, tādēļ atbilde neko nemainīja:

- `q4_no_no_yes`;
- `q4_no_yes_no`;
- `q4_yes_no_no`;
- `q5_no_no_no_yes`;
- `q5_no_no_yes_no`.

Testā bija arī profesionālajai piemērotībai vāji saistīti jautājumi par kopmītnēm, svešvalodām, mācību uzņēmuma dibināšanu un vispārīgu gatavību izaicinājumiem.

## JavaScript kļūdas

- `findProfessionByBacktracking()` ignorēja konkrēti izvēlēto `path.answer`, katrā vēstures solī vispirms pārbaudīja `yes`, tad `no`, un beigās bez pierādījumiem atgrieza `programmesanas_tehnikis`.
- `goBack()` pēc vismaz divām atbildēm parādīja vienu jautājumu par agru. Piemēram, no `q3_yes_no` tas atgrieza uz `root`, nevis `q2_yes`.
- `maxQuestions = 25` neatbilda nevienam reālam ceļam. Progresa solis bija 4%, pēc tam rezultāta brīdī josla uzlēca līdz 100%.
- Rezultātu skatā poga “Atpakaļ” tika paslēpta, tāpēc atbildi labot nevarēja.
- Paslēptā ASCII “Atbilžu ceļa” vizualizācija tika pārrēķināta pēc katras atbildes, lai gan tās virsraksts un saturs CSS vienmēr bija paslēpti.

## HTML un CSS problēmas

- `id="question-container"` bija izmantots divreiz.
- Sākuma, atbilžu un atpakaļ vadīklas bija klikšķināmi `div` ar inline `onclick`, nevis semantiski `button`.
- Trūka `aria-live`, progresa semantikas, tastatūras fokusa stila un saprotamu paziņojumu ekrānlasītājiem.
- Ārējām saitēm ar `target="_blank"` trūka `rel="noopener noreferrer"`.
- Footer lietoja `@`, nevis `©`.
- `.options` bija definēts divreiz; vēlākā `display: flex` deklarācija pārrakstīja sākotnējo `display: grid`.
- Divi `max-width: 768px` media bloki deva savstarpēji pretrunīgus `.header h1` izmērus. Vēlākais `2rem` pārrakstīja arī agrāko mazo ekrānu vērtību.
- `.footer`, `.header .subtitle`, `.tree` un `--header-height` netika izmantoti.
- Fiksētais apakšējais footer prasīja manuālu `body` atkāpi un varēja aizsegt saturu.

## Kataloga neatbilstības

Sākotnējā katalogā Namdaris bija pie “Kokapstrādes”, Arhitektūras tehniķim bija izveidota atsevišķa nozare “Arhitektūra”, bet IKT bija saīsināts līdz “IT”. Tika izmantoti arī vēsturiski vai kļūdaini nosaukumi “Inženieristēmu būvtehniķis” un “Autovirsbūvju remontatslēdznieks”. Aprakstos bija formas “remontējat”, “piedalas” un nepamatoti popularitātes apgalvojumi.

## Audita secinājums

Koku nebija lietderīgi paplašināt. Tas tika pilnībā aizstāts ar deklaratīvu divu slāņu dimensiju modeli. Jaunajā versijā visas atbildes vispirms veido lietotāja profilu, nav backtracking, nav noklusējuma profesijas un rezultāts vienmēr tiek pārrēķināts no pašreizējiem atbilžu masīviem.
