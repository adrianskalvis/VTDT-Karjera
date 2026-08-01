# VTDT profesiju izvēles novērtēšanas modelis

Modeļa versija: `2026.1`. Tas ir karjeras izpētes palīgs, nevis psiholoģisks tests vai profesionālās piemērotības diagnoze.

## Datu plūsma

1. Lietotājs atbild uz 18 pamata jautājumiem.
2. Katras atbildes efekti veido normalizētu dimensiju profilu.
3. Profils tiek salīdzināts ar pēc noklusējuma 13 aktīvo VTDT profesiju profiliem.
4. Ja divi pirmie rezultāti ir tuvāki par 0,25 neapaļotiem indeksa punktiem un ir vismaz 9 saturīgas pamata atbildes, tiek uzdots viens vai divi precizējoši jautājumi.
5. Lietotājs saņem Top 3, personalizētu pamatojumu, galvenās dimensijas, iespējamo izaicinājumu un mācību uzdevuma piemēru.

Atbildes nekad nesatur profesijas ID. Profesiju pāru ID atrodas tikai precizējošo jautājumu kolekcijas metadatos, lai izvēlētos piemērotu jautājumu; arī šo jautājumu atbildes maina tikai dimensijas.

## Divi satura slāņi un trīs svaru grupas

Pirmais slānis ir sešas RIASEC interešu dimensijas:

- Praktiskais (`realistic`);
- Pētnieciskais (`investigative`);
- Mākslinieciskais (`artistic`);
- Sociālais (`social`);
- Uzņēmīgais (`enterprising`);
- Strukturētais (`conventional`).

Otrais slānis ir 16 VTDT specifiskās dimensijas. Formulā tās sadalītas divās grupās:

- 11 uzdevumu un profesionālo interešu dimensijas: programmēšana, datoru aparatūra un tīkli, mehānika un diagnostika, metāls un virsbūves, elektrība un enerģija, telpiskā domāšana un rasēšana, būvniecības process, kokapstrāde, tekstils un dizains, augi un dabas procesi, lauksaimniecības tehnika;
- 5 darba vides un stila dimensijas: precizitāte un pacietība, fizisks darbs, darbs ārā, komandas darbs, patstāvīga koncentrēšanās.

Grupu gala svari ir:

| Grupa | Svars |
|---|---:|
| RIASEC | 25% |
| Konkrēti uzdevumi un intereses | 55% |
| Darba vide un darba stils | 20% |

Katras grupas rezultāts ir visu tās dimensiju fiksēts vidējais, arī dimensijām bez signāla. Tādēļ viena atbilde nevar pārņemt visu 55% uzdevumu slāni.

## Atbilžu efekti un ierobežojumi

Katram atbildes efektam `e(q,a,d)` ir vesela vērtība intervālā `[-2; 2]`:

- pozitīva vērtība pastiprina dimensiju;
- `0` dimensiju nemaina;
- negatīva vērtība norāda uz mazāku interesi vai komfortu;
- “Grūti pateikt” efekti ir tukši un punktus nedod.

12. un 17. jautājums ir pretēji vērtēts. To efekti datos jau ir negatīvi; scoring tos otrreiz neinvertē.

Precizējoša jautājuma efekts tiek reizināts ar `0,5`. Tādēļ ne vairāk kā divi precizējumi papildina, nevis pārraksta, 18 pamata atbilžu profilu.

## Normalizācija

Katrai dimensijai `d` vispirms aprēķina teorētisko pozitīvo un negatīvo kapacitāti visos pamata jautājumos:

```text
P_d = Σ_q max_a(max(e(q,a,d), 0))
N_d = Σ_q max_a(max(-e(q,a,d), 0))
```

No konkrēti izvēlētajām atbildēm:

```text
pos_d = Σ_izvēlētās max(e, 0) / P_d
neg_d = Σ_izvēlētās max(-e, 0) / N_d
```

Ja dalītājs ir nulle, attiecīgā vērtība ir nulle. Izmantoto precizējošo jautājumu svērtā kapacitāte tiek pievienota tiem pašiem dalītājiem. `pos_d` un `neg_d` atrodas intervālā `[0; 1]`.

Negatīvs signāls ir informatīvs, tomēr tam nav atļauts būt tik spēcīgam kā pozitīvai izvēlei:

```text
λ = 0,65
weightedNeg_d = λ × neg_d
evidence_d = min(1, pos_d + weightedNeg_d)
```

## Dimensijas sakritība ar profesiju

Katras profesijas profilā `p_d` ir redakcionāla vērtība intervālā `[0; 1]`. Pozitīvs lietotāja signāls salīdzinās ar `p_d`, bet negatīvs — ar `1 - p_d`:

```text
targetMatch_d =
  (pos_d × p_d + weightedNeg_d × (1 - p_d)) /
  (pos_d + weightedNeg_d)

dimensionMatch_d = 0,5 + evidence_d × (targetMatch_d - 0,5)
```

Ja dimensijai nav pierādījuma (`pos_d + weightedNeg_d = 0`), `dimensionMatch_d = 0,5` visām profesijām. Nezināms signāls tādēļ nevienu profesiju nepaaugstina un nepazemina.

Grupas sakritība ir tās dimensiju aritmētiskais vidējais. Gala indekss:

```text
sakritības indekss = 100 × (
  0,25 × RIASEC vidējais +
  0,55 × uzdevumu vidējais +
  0,20 × vides/stila vidējais
)
```

Rankošanai izmanto neapaļoto skaitli. UI to noapaļo līdz vienai zīmei aiz komata. Indekss nav varbūtība un neapgalvo zinātnisku precizitāti.

## Atbilžu skaidrība

Sakritības indekss un atbilžu skaidrība ir atsevišķi rādītāji. Skaidrība ņem vērā:

- saturīgo pamata atbilžu īpatsvaru;
- to dimensiju īpatsvaru, kurās ir signāls;
- pretrunu, ja vienā dimensijā uzkrājas gan pozitīvs, gan negatīvs signāls.

Praktiskā formula kodā:

```text
answerCoverage = saturīgās atbildes / 18
contradiction = Σ min(pos, 0,65 × neg) / Σ max(pos, 0,65 × neg)
clarityFactor = 0,75 + 0,25 × (1 - contradiction)
breadthFactor = 0,8 + 0,2 × dimensionCoverage
skaidrība = 100 × answerCoverage × clarityFactor × breadthFactor
```

Mazāk par 50 ir zema, 50–75 ir vidēja, bet no 75 — augsta atbilžu skaidrība. Mazāk nekā 9 saturīgas pamata atbildes vienmēr tiek uzskatītas par zemu informāciju un neaktivizē precizējošo jautājumu.

Pilnīgi neitrālam profilam visas profesijas matemātiski saņem indeksu `50`. Šādā gadījumā `leader` ir `null`: UI rāda vairākas nozares un dažādus izpētes sākumpunktus bez stingras secības. Noklusējuma profesijas nav.

Ja pilnam, informatīvam profilam divas pirmās profesijas iegūst precīzi vienādu indeksu, `leader` arī ir `null`, bet rezultāta režīms paliek `ranked`: UI rāda Top 3 un skaidri apzīmē kopīgu pirmo vietu. Tātad neizšķirts pats par sevi netiek sajaukts ar informācijas trūkumu.

## Adaptīvie precizējumi

Precizējums ir atļauts, ja:

- pamatdaļa ir pabeigta;
- ir vismaz 9 saturīgas pamata atbildes;
- pirmo divu neapaļoto indeksu starpība ir mazāka par `0,25`;
- var izvēlēties konkrētā pāra kolekciju vai vislabāk diskriminējošos vispārīgos precizējumus.

Pēc pirmā precizējuma viss rezultāts tiek pārrēķināts. Ja starpība vairs nav maza, rezultāts tiek rādīts uzreiz; pretējā gadījumā uzdod otro un pēdējo jautājumu. Datu kolekcijā ir divi jautājumi katram no deviņiem prasītajiem pāriem un seši vispārīgi jautājumi. Neatbalstītam pārim algoritms no vispārīgās kolekcijas izvēlas divus jautājumus, kuru abu atbilžu dimensijas visvairāk atšķir konkrētos profesiju profilus.

Slieksnis ir kalibrēts ar deterministisku 30 000 nejaušu profilu simulāciju. Tests pieprasa, lai precizējumam kvalificētos 10–50% profilu: tas pasargā no regresijas, kur precizējums kļūst gandrīz obligāts, vienlaikus nesimulējot īstu jauniešu izvēļu sadalījumu.

## Personalizēts pamatojums

Galvenās dimensijas izvēlas pēc lietotāja pierādījuma un konkrētās profesijas sakritības. Konkrēto atbilžu pamatojums izmanto “leave-one-out” aprēķinu: profesijas indekss tiek pārrēķināts, pa vienai noņemot izvēlēto atbildi. Atbildes ar lielāko pozitīvo starpību ir godīgs pamats sadaļai “Kāpēc šāds rezultāts?”.

## Pieejamība un stāvoklis

Scoring neuztur mutējamu punktu summu. Katrs rezultāts tiek no jauna aprēķināts no `answers` un `tieBreakerAnswers`, tādēļ pogas “Atpakaļ” un atbildes maiņa nevar atstāt vecus punktus.

`localStorage` stāvoklī ir `assessmentVersion`. Neatbilstoša versija, bojāts JSON, nezināms jautājums vai atbildes variants tiek droši ignorēts.

## Ierobežojumi

- Profesiju profilu koeficienti ir redakcionāls, pārbaudāms projekta modelis; VTDT avoti apstiprina nosaukumus, nozares, statusu un apraksta saturu, nevis šos koeficientus.
- Jautājumi un koeficienti nav psihometriski validēti reprezentatīvā jauniešu izlasē.
- Nejaušu atbilžu simulācija pārbauda strukturālu sasniedzamību un dominanci, nevis prognozē īstu lietotāju izvēļu sadalījumu.
- Intereses var mainīties, un profesijas ikdienu nevar pilnībā aprakstīt ar 18 jautājumiem.
- Rezultāts jāizmanto kā sākums sarunai, atvērto durvju dienai vai praktiskai iepazīšanai, nevis kā galīgs lēmums.
