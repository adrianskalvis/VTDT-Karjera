# VTDT profesiju izvēles novērtēšanas modelis

Modeļa versija: `2026.5`. Rīks ir karjeras izpētes palīgs, nevis psiholoģisks tests vai profesionālās piemērotības diagnoze.

## Datu plūsma un režīmi

1. Lietotājs izvēlas ātro vai padziļināto režīmu.
2. Ātrais režīms uzdod 10 apzināti atlasītus pamata jautājumus; padziļinātais — visus 18.
3. Katra atbilde veido 22 dimensiju profilu, nepiešķirot punktus profesijai tieši.
4. Profils tiek salīdzināts ar 13 aktuālo VTDT profesiju profiliem.
5. Ja rezultāti ir tuvi vai pārklājums vājš, algoritms determinēti izvēlas labāko neatbildēto precizējumu.
6. Ātrajā režīmā var būt ne vairāk kā 3 precizējumi (kopā 10–13 jautājumi), padziļinātajā — ne vairāk kā 2 (kopā 18–20).
7. Rezultāts ir Top 3, kopīga pirmā vieta vai vairāki plaši virzieni zemas informācijas profilam.

Rezultātu vienmēr pārrēķina no `answers` un `tieBreakerAnswers`. Mutējama globāla punktu summa netiek glabāta.

## 22 dimensijas un grupu svari

RIASEC slānis:

- Praktiskais (`realistic`);
- Pētnieciskais (`investigative`);
- Mākslinieciskais (`artistic`);
- Sociālais (`social`);
- Uzņēmīgais (`enterprising`);
- Strukturētais (`conventional`).

VTDT specifiskais slānis sastāv no 11 uzdevumu/interešu dimensijām un 5 darba vides/stila dimensijām. Precīzs saraksts un apraksti atrodas `data/dimensions.js`.

| Grupa | Dimensijas | Svars |
|---|---:|---:|
| RIASEC intereses | 6 | 25% |
| Uzdevumi un profesionālās intereses | 11 | 55% |
| Darba vide un darba stils | 5 | 20% |

Katras grupas rezultāts ir visu tās dimensiju fiksēts vidējais. Arī neizmērīta dimensija paliek neitrāla, tāpēc viena atbilde nevar pārņemt visu 55% slāni.

## Vienotā atbilžu skala

| Atbilde | Koeficients |
|---|---:|
| Jā | +2 |
| Drīzāk jā | +1 |
| Drīzāk nē | −1 |
| Nē | −2 |

Katram jautājumam ir dimensiju vektors `w(q,d)`. Izvēlētās atbildes koeficients `c` tiek reizināts ar šo vektoru:

```text
efekts(q,a,d) = c(a) × w(q,d)
```

Pamata jautājuma reizinātājs ir `m = 1`, precizējošā jautājuma reizinātājs — `m = 0,5`. Atbilžu skalā nav neitrālas izvēles; jaunietis izvēlas tuvāko no divām pozitīvām vai divām negatīvām atbildēm.

## Normalizācija

Katras dimensijas `d` virzienu aprēķina tikai no faktiski uzdotajiem un saturiski atbildētajiem jautājumiem:

```text
S_d = Σ m × c × w(q,d)
E_d = Σ m × |c × w(q,d)|
u_d = S_d / E_d, ja E_d > 0; citādi 0
x_d = (u_d + 1) / 2
r_d = min(1, E_d / 4) × |u_d|
```

- `S_d` ir parakstītais signāls;
- `E_d` ir faktiskais pierādījuma apjoms;
- `u_d` ir virziens intervālā `[-1; 1]`;
- `x_d` ir lietotāja mērķa pozīcija intervālā `[0; 1]`;
- `r_d` ir uzticamība.

Dalījums ar `4` nozīmē, ka viena atbilde nevar uzreiz dot pilnu uzticamību. Ja vienā dimensijā atbildes precīzi konfliktē, `S_d = 0`, tādēļ `r_d = 0` un salīdzinājums atgriežas neitrālā punktā. Tas neizveido mākslīgu priekšrocību profesijai ar profilu ap `0,5`.

## Dimensijas un profesijas sakritība

Profesijas profila vērtība dimensijā ir `p_d ∈ [0; 1]`:

```text
directMatch_d = 1 - |x_d - p_d|
dimensionMatch_d = 0,5 + r_d × (directMatch_d - 0,5)
```

Ja nav pierādījuma (`r_d = 0`), visu profesiju sakritība šajā dimensijā ir `0,5`.

Gala formula nav mainīta:

```text
atbilstības rādītājs = 100 × (
  0,25 × RIASEC vidējais +
  0,55 × uzdevumu/interešu vidējais +
  0,20 × vides/stila vidējais
)
```

Rankošanai izmanto neapaļotu vērtību. UI rāda vienu zīmi aiz komata. Tas nav varbūtības procents vai zinātniski noteikta precizitāte.

### Vienkāršots piemērs

Ja hipotētiski grupu sakritības ir `0,70`, `0,80` un `0,60`, tad:

```text
100 × (0,25 × 0,70 + 0,55 × 0,80 + 0,20 × 0,60)
= 100 × (0,175 + 0,440 + 0,120)
= 73,5
```

UI rādītu **73,5 / 100** kā atbilstības rādītāju.

## Kāpēc v1 ievades normalizācija tika mainīta

Arhīva versija `v1-weighted-multichoice` izmantoja atsevišķus katras atbildes efektus un negatīvā signāla koeficientu `0,65`. Jaunā saskarne lietotājam skaidri sola simetrisku skalu `+2 … −2`; saglabājot `0,65`, “Nē −2” matemātiski būtu vājāks par “Jā +2”. Tādēļ asimetrija izņemta un tās vietā izmantots iepriekš aprakstītais simetriskais virziens un uzticamība. Grupu proporcija `25/55/20` nav mainīta.

Strukturālās simulācijas salīdzinājums (nejaušas atbildes nav īstu skolēnu uzvedības prognoze):

| Modelis | Profili | Zemākais Top 1 | Augstākais Top 1 | Zemākais Top 3 |
|---|---:|---:|---:|---:|
| arhīva v1, 18 jautājumi | 30 000 | 0,17% | 14,54% | 3,90% |
| v5 ātrais, 10–13 jautājumi | 30 000 | 1,30% | 17,35% | 11,19% |
| v5 padziļinātais, 18–20 jautājumi | 30 000 | 1,74% | 16,68% | 9,46% |

## Atbilžu skaidrība un zema informācija

Atbilžu skaidrība nav profesijas rādītājs:

```text
answerCoverage = derīgās pamata atbildes / režīma pamata jautājumu skaits
meanReliability = 22 dimensiju uzticamību vidējais
skaidrība = 100 × (0,70 × answerCoverage + 0,30 × meanReliability)
```

Zema informācija ir tad, ja derīgi atbildēta mazāk nekā puse režīma pamata jautājumu vai nosegtas mazāk nekā `35%` dimensiju. Parastajā UI rezultātu rāda tikai pēc visu pamata jautājumu pabeigšanas, tāpēc šī aizsardzība galvenokārt pasargā no bojāta vai nepilnīga saglabātā stāvokļa.

Tukšam profilam visas 13 profesijas saņem tieši `50`, bet `leader = null`.

## Adaptīvie precizējumi

Precizējuma iemesli tiek vērtēti atsevišķi:

| Iemesls | Ātrais | Padziļinātais |
|---|---:|---:|
| Top 1–Top 2 starpība | `< 0,40` | `< 0,45` |
| Top 1–Top 3 diapazons | `< 0,80` | `< 0,85` |
| Grupas pārklājums | mazāk par 2 saturiskiem novērojumiem | mazāk par 2 saturiskiem novērojumiem |

No 16 netiešiem precizējumiem izvēlas neatbildēto kandidātu ar augstāko lietderību. Kandidāts tiek vērtēts pēc:

- pašreizējā Top 2 un Top 3 profesiju profilu atšķiršanas spējas;
- vajadzības mērīt vēl nepietiekami nosegtās dimensijas;
- semantiskas/vektoru novitātes pret jau uzdotajiem jautājumiem.

Ja iemesls ir tikai vājš pārklājums, lielāku svaru saņem pārklājuma vajadzība. Vienādas lietderības gadījumā izvēle notiek pēc stabila jautājuma ID, tādēļ identiska vēsture vienmēr dod identisku precizējumu.

Kandidātu izslēdz, ja tā vidējā nenosegto dimensiju vajadzība ir mazāka par `0,08`. Tādēļ pat liela teorētiska Top 3 nošķiršana nevar izraisīt jautājumu, kura dimensijas jau ir pietiekami izmērītas.

Ja pēc precizējumu limita Top 1 starpība ir ne vairāk kā `0,35`, rezultāts saglabā kopīgu pirmo vietu. Alfabētiska attēlošanas secība netiek pasniegta kā mākslīgs uzvarētājs.

## Validācija

Automātiskie testi pārbauda:

- tieši 13 profesijas, 18 pamata jautājumus un 10 jautājumu ātro apakškopu;
- fiksēto četru atbilžu skalu bez neitrālas izvēles;
- visu 22 dimensiju pārklājumu un to mērīšanu vairāk nekā vienā pamata jautājumā;
- pozitīvu/negatīvu simetriju, pretrunu slāpēšanu, neizšķirtu un pilnu pārrēķinu;
- vienas atbildes maksimāli ierobežotu ietekmi;
- 13 loģiskas personas: padziļināti visas Top 1, ātri visas Top 3;
- 10 atšķirīgus jauniešu scenārijus, tostarp vizuāli radošu profilu, kuram apģērbu dizains abos režīmos ir Top 3;
- 30 000 profilus katram režīmam, sasniedzamību un dominances robežas;
- adaptīvo izvēli, determinismu un jautājumu skaita limitus.

## Ierobežojumi

- Profesiju profilu svari ir redakcionāls un auditējams projekta modelis; VTDT avots apstiprina profesiju nosaukumus un nozares, nevis koeficientus.
- Jautājumi nav psihometriski validēti reprezentatīvā jauniešu izlasē.
- Nejauša simulācija atrod strukturālas kļūdas, bet neatdarina reālu skolēnu atbilžu sadalījumu.
- Rezultāts jāizmanto sarunas, atvērto durvju dienas vai praktiskas iepazīšanās sākšanai, nevis galīgam lēmumam.
- Nākamais nepieciešamais solis ir pilotpētījums ar 9.–10. klašu skolēniem un karjeras konsultanta novērojumiem.
