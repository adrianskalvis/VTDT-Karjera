import { dimensionIds } from "./dimensions.js?v=2026.6";

export const VTDT_SOURCES = Object.freeze({
  catalogue: "https://www.vtdt.lv/profesijas",
  openDays2026:
    "https://www.vtdt.lv/single-post/profesiju-atv%C4%93rto-durvju-dienas-2026",
});

const LAST_VERIFIED = "2026-08-01";

const createProfile = (overrides) =>
  Object.freeze(
    Object.fromEntries(dimensionIds.map((id) => [id, overrides[id] ?? 0.1])),
  );

const professionSeeds = [
  {
    id: "apgerbu_dizainera_asistents",
    title: "Apģērbu dizainera asistents",
    sector: "Dizains",
    description:
      "Palīdz izstrādāt apģērbu idejas un paraugus, strādājot ar skicēm, piegrieztnēm, audumiem un šūšanas tehnoloģijām.",
    tasks: [
      "veidot skices, piegrieztnes un apģērba paraugus",
      "izvēlēties un apstrādāt tekstilmateriālus",
      "pārbaudīt izstrādājuma piegulumu, kvalitāti un detaļas",
    ],
    workEnvironment:
      "Dizaina un šūšanas darbnīca; darbs mijas starp radošu ideju attīstīšanu un ļoti precīzu izpildi.",
    aspects: [
      "pārvērst vizuālu ieceri taustāmā izstrādājumā",
      "eksperimentēt ar audumiem, formām un detaļām",
      "redzēt pakāpenisku rezultātu no skices līdz gatavam paraugam",
    ],
    challenge:
      "Radošā iecere jāspēj izpildīt tehniski precīzi; šūšana un pielaikošana prasa pacietību un atkārtotus labojumus.",
    learningTask:
      "Izveidot vienkārša apģērba detaļas skici, piegriezt paraugu un sašūt izmēģinājuma variantu.",
    officialUrl: "https://www.vtdt.lv/apgerbu-dizainera-asistents",
    sourceUrl: "https://www.vtdt.lv/apgerbu-dizainera-asistents",
    profile: createProfile({
      realistic: 0.55,
      investigative: 0.35,
      artistic: 1,
      social: 0.45,
      enterprising: 0.4,
      conventional: 0.65,
      textileDesign: 1,
      spatialDrawing: 0.55,
      precisionPatience: 0.9,
      physicalWork: 0.35,
      outdoorWork: 0.05,
      teamwork: 0.65,
      independentFocus: 0.8,
    }),
  },
  {
    id: "lauksaimniecibas_mehanizacijas_tehnikis",
    title: "Lauksaimniecības mehanizācijas tehniķis",
    sector: "Lauksaimniecība",
    description:
      "Strādā ar lauksaimniecības mašīnām un agregātiem: izvēlas iestatījumus, veic apkopes un palīdz atrast tehniskus bojājumus.",
    tasks: [
      "sagatavot un iestatīt tehniku konkrētam darbam",
      "veikt mezglu apskati, apkopi un diagnostiku",
      "plānot drošu un efektīvu mašīnu izmantošanu",
    ],
    workEnvironment:
      "Darbnīca, tehnikas novietne un lauks; sezonās darba ritms un apstākļi var būt mainīgi.",
    aspects: [
      "izprast lielu un sarežģītu mehānismu darbību",
      "savienot diagnostiku ar praktisku remontu",
      "redzēt, kā pareizi iestatīta tehnika paveic lielu darbu",
    ],
    challenge:
      "Jārēķinās ar lielām iekārtām, drošības prasībām, fizisku darbu un intensīvāku ritmu sezonas laikā.",
    learningTask:
      "Pēc tehniskās shēmas veikt traktora ikdienas pārbaudi un pamatot agregāta iestatījumu izvēli.",
    officialUrl: "https://www.vtdt.lv/mehanizacijas-tehnikis",
    sourceUrl: "https://www.vtdt.lv/mehanizacijas-tehnikis",
    profile: createProfile({
      realistic: 1,
      investigative: 0.75,
      artistic: 0.15,
      social: 0.35,
      enterprising: 0.5,
      conventional: 0.7,
      mechanicsDiagnostics: 0.9,
      electricityEnergy: 0.45,
      plantProcesses: 0.5,
      agriculturalMachinery: 1,
      precisionPatience: 0.75,
      physicalWork: 0.85,
      outdoorWork: 0.9,
      teamwork: 0.65,
      independentFocus: 0.6,
    }),
  },
  {
    id: "augkopibas_tehnikis",
    title: "Augkopības tehniķis",
    sector: "Lauksaimniecība",
    description:
      "Plāno un uzrauga kultūraugu audzēšanu, vērtējot augsni, augu attīstību, laikapstākļus un veicamos darbus.",
    tasks: [
      "novērot augu stāvokli un noteikt nepieciešamos darbus",
      "plānot sēju, kopšanu, ražas novākšanu un uzskaiti",
      "izmantot mērījumus un lauka datus lēmumu pieņemšanai",
    ],
    workEnvironment:
      "Lauks, saimniecība un plānošanas darbs telpās; rezultāts veidojas ilgākā sezonālā ciklā.",
    aspects: [
      "sekot dzīviem dabas procesiem un pamanīt pārmaiņas",
      "savienot novērojumus ar praktisku rīcību",
      "plānot darbu, kura rezultāts nobriest pakāpeniski",
    ],
    challenge:
      "Dabas procesus nevar pilnīgi kontrolēt, tādēļ jāpielāgojas laikapstākļiem un jāpieņem pamatoti lēmumi ar nepilnīgu informāciju.",
    learningTask:
      "Novērtēt nelielu sējumu, pierakstīt augu un augsnes pazīmes un izveidot nākamās kopšanas darbības plānu.",
    officialUrl: "https://www.vtdt.lv/augkopibas-tehnikis",
    sourceUrl: "https://www.vtdt.lv/augkopibas-tehnikis",
    profile: createProfile({
      realistic: 0.8,
      investigative: 0.9,
      artistic: 0.25,
      social: 0.4,
      enterprising: 0.55,
      conventional: 0.7,
      mechanicsDiagnostics: 0.25,
      plantProcesses: 1,
      agriculturalMachinery: 0.5,
      precisionPatience: 0.75,
      physicalWork: 0.7,
      outdoorWork: 1,
      teamwork: 0.6,
      independentFocus: 0.7,
    }),
  },
  {
    id: "mebelu_galdnieks",
    title: "Mēbeļu galdnieks",
    sector: "Kokapstrāde",
    description:
      "Izgatavo un montē mēbeles un citus precīzus koka izstrādājumus pēc rasējuma, apvienojot roku darbu ar darbmašīnām.",
    tasks: [
      "lasīt rasējumus un sagatavot koka detaļas",
      "veidot precīzus savienojumus un montēt izstrādājumu",
      "slīpēt, apstrādāt un pārbaudīt gatavās virsmas",
    ],
    workEnvironment:
      "Kokapstrādes darbnīca ar instrumentiem un darbmašīnām; liela nozīme ir mērījumiem, secībai un tīrai apdarei.",
    aspects: [
      "izgatavot ilgmūžīgu priekšmetu no atsevišķām detaļām",
      "savienot konstrukciju ar estētisku izskatu",
      "pilnveidot precizitāti un amatniecisku meistarību",
    ],
    challenge:
      "Kļūda mērījumā vai apstrādes secībā var sabojāt detaļu, tādēļ nepieciešama ilgstoša koncentrēšanās.",
    learningTask:
      "Pēc vienkārša rasējuma nomērīt, izgatavot un savienot nelielas koka kārbas detaļas.",
    officialUrl: "https://www.vtdt.lv/mebelu-galdnieks",
    sourceUrl: "https://www.vtdt.lv/mebelu-galdnieks",
    profile: createProfile({
      realistic: 1,
      investigative: 0.55,
      artistic: 0.75,
      social: 0.25,
      enterprising: 0.35,
      conventional: 0.85,
      spatialDrawing: 0.75,
      woodworking: 1,
      precisionPatience: 1,
      physicalWork: 0.7,
      outdoorWork: 0.05,
      teamwork: 0.5,
      independentFocus: 0.95,
    }),
  },
  {
    id: "apdares_darbu_tehnikis",
    title: "Apdares darbu tehniķis",
    sector: "Būvniecība",
    description:
      "Sagatavo un apdarina ēku virsmas, veicot, piemēram, apmešanu, krāsošanu, flīzēšanu un citus iekšdarbus vai ārdarbus.",
    tasks: [
      "novērtēt un sagatavot virsmu apdarei",
      "precīzi uzklāt vai montēt izvēlēto apdares materiālu",
      "pārbaudīt līdzenumu, rakstu, toni un darba kvalitāti",
    ],
    workEnvironment:
      "Būvobjekti telpās un reizēm ārā; darba vieta mainās, un redzams rezultāts rodas pa posmiem.",
    aspects: [
      "redzēt izteiktu telpas pārvērtību pirms un pēc darba",
      "savienot materiālu izjūtu ar precīzu izpildi",
      "strādāt ar dažādām tehnikām un virsmām",
    ],
    challenge:
      "Darbs var būt fizisks un putekļains, bet kvalitatīvai apdarei nepieciešama arī ļoti rūpīga virsmas sagatavošana.",
    learningTask:
      "Sagatavot nelielu sienas paraugu un izveidot taisnu, vienmērīgu flīžu vai dekoratīvās apdares laukumu.",
    officialUrl: "https://www.vtdt.lv/apdares-darbu-tehnikis",
    sourceUrl: "https://www.vtdt.lv/apdares-darbu-tehnikis",
    profile: createProfile({
      realistic: 1,
      investigative: 0.2,
      artistic: 1,
      social: 0.3,
      enterprising: 0.25,
      conventional: 0.75,
      spatialDrawing: 0.3,
      constructionCoordination: 0.9,
      woodworking: 0.1,
      precisionPatience: 0.9,
      physicalWork: 0.9,
      outdoorWork: 0.2,
      teamwork: 0.55,
      independentFocus: 0.75,
    }),
  },
  {
    id: "eku_buvtehnikis",
    title: "Ēku būvtehniķis",
    sector: "Būvniecība",
    description:
      "Piedalās ēku būvdarbu plānošanā, organizēšanā un kvalitātes kontrolē, sasaistot rasējumus ar darbu objektā.",
    tasks: [
      "lasīt projekta dokumentāciju un plānot darbu secību",
      "koordinēt materiālus, izpildītājus un termiņus",
      "veikt mērījumus un pārbaudīt būvdarbu kvalitāti",
    ],
    workEnvironment:
      "Būvobjekts un biroja tipa plānošanas darbs; regulāri jāsazinās ar dažādiem projekta dalībniekiem.",
    aspects: [
      "redzēt, kā no plāna pakāpeniski top vesela ēka",
      "risināt praktiskus jautājumus lielā projektā",
      "uzņemties atbildību par secību, kvalitāti un drošību",
    ],
    challenge:
      "Jāspēj vienlaikus sekot rasējumiem, termiņiem, kvalitātei un cilvēku darbam; kļūdu sekas var būt nozīmīgas.",
    learningTask:
      "Izlasīt neliela būvmezgla rasējumu, aprēķināt materiālu daudzumu un sastādīt darba secību.",
    officialUrl: "https://www.vtdt.lv/eku-buvtehnikis",
    sourceUrl: "https://www.vtdt.lv/eku-buvtehnikis",
    profile: createProfile({
      realistic: 0.85,
      investigative: 0.65,
      artistic: 0.3,
      social: 0.65,
      enterprising: 0.9,
      conventional: 0.9,
      spatialDrawing: 0.7,
      constructionCoordination: 1,
      woodworking: 0.25,
      electricityEnergy: 0.25,
      precisionPatience: 0.85,
      physicalWork: 0.7,
      outdoorWork: 0.65,
      teamwork: 1,
      independentFocus: 0.45,
    }),
  },
  {
    id: "namdaris",
    title: "Namdaris",
    sector: "Būvniecība",
    description:
      "Izgatavo, montē un remontē ēku koka konstrukcijas, piemēram, karkasus, pārsegumus, kāpnes un jumta elementus.",
    tasks: [
      "nolasīt konstrukcijas izmērus un sagatavot kokmateriālus",
      "izgatavot un savienot nesošas koka detaļas",
      "montēt konstrukcijas objektā un pārbaudīt to ģeometriju",
    ],
    workEnvironment:
      "Būvobjekti, darbnīca un darbs ārā; nepieciešama droša instrumentu lietošana, kustīgums un komandas saskaņa.",
    aspects: [
      "veidot lielas, telpiskas konstrukcijas no koka",
      "savienot tradicionālus paņēmienus ar moderniem instrumentiem",
      "redzēt sava darba nozīmi ēkas uzbūvē",
    ],
    challenge:
      "Darbs bieži ir fizisks, notiek mainīgos apstākļos un prasa stingru drošības disciplīnu.",
    learningTask:
      "Pēc mezgla skices nomērīt un izgatavot koka konstrukcijas savienojuma paraugu, pārbaudot leņķus.",
    officialUrl: "https://www.vtdt.lv/namdaris",
    sourceUrl: "https://www.vtdt.lv/namdaris",
    profile: createProfile({
      realistic: 1,
      investigative: 0.5,
      artistic: 0.5,
      social: 0.35,
      enterprising: 0.45,
      conventional: 0.7,
      spatialDrawing: 0.7,
      constructionCoordination: 0.85,
      woodworking: 1,
      precisionPatience: 0.8,
      physicalWork: 1,
      outdoorWork: 0.9,
      teamwork: 0.8,
      independentFocus: 0.6,
    }),
  },
  {
    id: "arhitekturas_tehnikis",
    title: "Arhitektūras tehniķis",
    sector: "Būvniecība",
    description:
      "Sagatavo ēku rasējumus, modeļus un tehnisko dokumentāciju, palīdzot telpisku ieceri pārvērst izpildāmā projektā.",
    tasks: [
      "veidot un noformēt 2D rasējumus un 3D modeļus",
      "pārbaudīt izmērus, telpisko loģiku un dokumentu atbilstību",
      "saskaņot tehniskos risinājumus ar projekta komandu",
    ],
    workEnvironment:
      "Pārsvarā darbs pie datora ar specializētām projektēšanas programmām, papildināts ar sadarbību un objekta izpēti.",
    aspects: [
      "savienot telpisku iztēli ar tehnisku precizitāti",
      "detalizēti attīstīt ideju rasējumā vai modelī",
      "redzēt, kā dokumentācija palīdz iecerei kļūt uzbūvējamai",
    ],
    challenge:
      "Daudz laika jāpavada pie precīzas dokumentācijas; radošajai iecerei jāatbilst tehniskām un praktiskām prasībām.",
    learningTask:
      "Nomērīt nelielu telpu un izveidot tās mērogotu plānu un vienkāršu 3D modeli.",
    officialUrl: "https://www.vtdt.lv/arhitekturas-tehnikis",
    sourceUrl: "https://www.vtdt.lv/arhitekturas-tehnikis",
    profile: createProfile({
      realistic: 0.5,
      investigative: 0.85,
      artistic: 0.9,
      social: 0.5,
      enterprising: 0.55,
      conventional: 0.9,
      programming: 0.2,
      spatialDrawing: 1,
      constructionCoordination: 0.75,
      precisionPatience: 0.95,
      physicalWork: 0.15,
      outdoorWork: 0.1,
      teamwork: 0.75,
      independentFocus: 0.85,
    }),
  },
  {
    id: "datorsistemu_tehnikis",
    title: "Datorsistēmu tehniķis",
    sector: "Informācijas un komunikācijas tehnoloģijas",
    description:
      "Uzstāda, konfigurē, uztur un diagnosticē datorus, operētājsistēmas, perifēriju un datortīklus.",
    tasks: [
      "salikt vai uzlabot datoru un pārbaudīt komponentes",
      "konfigurēt operētājsistēmas, lietotājus un tīkla savienojumus",
      "secīgi diagnosticēt aparatūras vai tīkla darbības traucējumus",
    ],
    workEnvironment:
      "IKT laboratorija, birojs vai darbs pie lietotāja sistēmas; praktiska konfigurēšana mijas ar koncentrētu diagnostiku.",
    aspects: [
      "atrast konkrētu cēloni sistēmā, kas nedarbojas",
      "savienot fiziskas komponentes ar programmatūras iestatījumiem",
      "atjaunot stabilu un drošu datora vai tīkla darbību",
    ],
    challenge:
      "Bojājuma simptoms ne vienmēr uzreiz atklāj cēloni, tādēļ jāspēj sistemātiski pārbaudīt vairākas iespējas.",
    learningTask:
      "Saslēgt nelielu lokālo tīklu, konfigurēt ierīces un pēc dotām pazīmēm atrast vienu tīši radītu kļūmi.",
    officialUrl: "https://www.vtdt.lv/datorsistemu-tehnikis",
    sourceUrl: "https://www.vtdt.lv/datorsistemu-tehnikis",
    profile: createProfile({
      realistic: 0.75,
      investigative: 0.95,
      artistic: 0.2,
      social: 0.5,
      enterprising: 0.4,
      conventional: 0.85,
      programming: 0.4,
      hardwareNetworks: 1,
      mechanicsDiagnostics: 0.35,
      electricityEnergy: 0.5,
      precisionPatience: 0.9,
      physicalWork: 0.15,
      outdoorWork: 0.05,
      teamwork: 0.65,
      independentFocus: 0.9,
    }),
  },
  {
    id: "programmesanas_tehnikis",
    title: "Programmēšanas tehniķis",
    sector: "Informācijas un komunikācijas tehnoloģijas",
    description:
      "Izstrādā, pārbauda un uzlabo programmatūras risinājumus, pārvēršot prasības algoritmos un strādājošā kodā.",
    tasks: [
      "sadalīt problēmu loģiskos soļos un uzrakstīt kodu",
      "testēt programmu un atrast kļūdas tās darbībā",
      "pilnveidot risinājumu un dokumentēt būtiskos lēmumus",
    ],
    workEnvironment:
      "Pārsvarā darbs pie datora, individuāli koncentrējoties un regulāri saskaņojot risinājumu ar komandu.",
    aspects: [
      "uzbūvēt darbojošos digitālu risinājumu no idejas",
      "atšķetināt loģiskas kļūdas un uzlabot algoritmu",
      "mācīties jaunus rīkus, valodas un problēmu risināšanas paņēmienus",
    ],
    challenge:
      "Kļūdu meklēšana var prasīt daudz pacietības, un daļa darba nav uzreiz vizuāli redzama.",
    learningTask:
      "Izveidot nelielu tīmekļa lietotni, kas apstrādā lietotāja ievadi, un uzrakstīt tai vairākus pārbaudes gadījumus.",
    officialUrl: "https://www.vtdt.lv/programmesanas-tehnikis",
    sourceUrl: "https://www.vtdt.lv/programmesanas-tehnikis",
    profile: createProfile({
      realistic: 0.2,
      investigative: 1,
      artistic: 0.55,
      social: 0.3,
      enterprising: 0.4,
      conventional: 0.8,
      programming: 1,
      hardwareNetworks: 0.3,
      spatialDrawing: 0.2,
      precisionPatience: 0.9,
      physicalWork: 0.05,
      outdoorWork: 0.05,
      teamwork: 0.6,
      independentFocus: 1,
    }),
  },
  {
    id: "automehanikis",
    title: "Automehāniķis",
    sector: "Autotransports",
    description:
      "Veic automobiļu tehnisko apkopi, diagnostiku un mehānisko vai elektrisko sistēmu remontu.",
    tasks: [
      "pārbaudīt automobiļa sistēmas un interpretēt diagnostikas datus",
      "noteikt bojājuma cēloni un izvēlēties remonta secību",
      "nomainīt vai remontēt mezglus un pārbaudīt rezultātu",
    ],
    workEnvironment:
      "Autoserviss ar pacēlājiem, instrumentiem un diagnostikas iekārtām; darbā ir troksnis, kustība un tehniska atbildība.",
    aspects: [
      "saprast mehānismu un atrast slēptu bojājuma cēloni",
      "apvienot mērījumus ar praktisku remontu",
      "uzreiz pārbaudīt, vai sistēma atkal darbojas pareizi",
    ],
    challenge:
      "Darbs var būt fizisks un netīrs; drošs remonts prasa ievērot secību un neatstāt nepārbaudītus pieņēmumus.",
    learningTask:
      "Veikt bremžu mezgla pārbaudi mācību automobilim, izmērīt detaļas un pamatot remonta lēmumu.",
    officialUrl: "https://www.vtdt.lv/automehanikis",
    sourceUrl: "https://www.vtdt.lv/automehanikis",
    profile: createProfile({
      realistic: 1,
      investigative: 0.9,
      artistic: 0.15,
      social: 0.3,
      enterprising: 0.4,
      conventional: 0.8,
      hardwareNetworks: 0.2,
      mechanicsDiagnostics: 1,
      metalBodywork: 0.55,
      electricityEnergy: 0.5,
      precisionPatience: 0.85,
      physicalWork: 0.85,
      outdoorWork: 0.2,
      teamwork: 0.7,
      independentFocus: 0.7,
    }),
  },
  {
    id: "autovirsbuvju_remonta_tehnikis",
    title: "Autovirsbūvju remonta tehniķis",
    sector: "Autotransports",
    description:
      "Novērtē un atjauno bojātas automobiļu virsbūves, strādājot ar metāla detaļām, ģeometriju, savienošanu un virsmu sagatavošanu.",
    tasks: [
      "novērtēt virsbūves bojājumu un izmērīt ģeometriju",
      "taisnot, nomainīt vai savienot metāla detaļas",
      "sagatavot virsmu un pārbaudīt atjaunotās formas kvalitāti",
    ],
    workEnvironment:
      "Virsbūvju remonta darbnīca ar metālapstrādes instrumentiem un aizsardzības līdzekļiem; svarīga ir forma, drošība un precīza apdare.",
    aspects: [
      "redzēt izteiktu bojātas detaļas pārvērtību",
      "praktiski atjaunot sarežģītu metāla formu",
      "apvienot tehnisku mērījumu ar rūpīgu virsmas kvalitāti",
    ],
    challenge:
      "Metālapstrāde prasa fizisku piepūli un stingru darba aizsardzību; gala formai jābūt gan vizuāli, gan tehniski pareizai.",
    learningTask:
      "Izmērīt deformētu mācību detaļu, izplānot taisnošanas secību un atjaunot tās kontrolpunktus.",
    officialUrl: "https://www.vtdt.lv/autovirsbuvju-remontatsledznieks",
    sourceUrl: "https://www.vtdt.lv/autovirsbuvju-remontatsledznieks",
    profile: createProfile({
      realistic: 1,
      investigative: 0.55,
      artistic: 0.6,
      social: 0.25,
      enterprising: 0.35,
      conventional: 0.75,
      mechanicsDiagnostics: 0.65,
      metalBodywork: 1,
      spatialDrawing: 0.55,
      precisionPatience: 0.9,
      physicalWork: 0.9,
      outdoorWork: 0.15,
      teamwork: 0.65,
      independentFocus: 0.75,
    }),
  },
  {
    id: "elektrotehnikis",
    title: "Elektrotehniķis",
    sector: "Enerģētika",
    description:
      "Montē, pārbauda, uztur un remontē elektroietaises, vadības ķēdes un elektroiekārtas, ievērojot stingras drošības prasības.",
    tasks: [
      "lasīt elektriskās shēmas un izvēlēties komponentes",
      "montēt savienojumus un veikt elektriskos mērījumus",
      "atrast bojājumu, novērst to un droši pārbaudīt sistēmu",
    ],
    workEnvironment:
      "Darbnīca, ēkas un tehniski objekti; nepieciešama kārtīga darba vieta, mērījumu precizitāte un drošības disciplīna.",
    aspects: [
      "izprast neredzamu enerģijas plūsmu pēc shēmām un mērījumiem",
      "izveidot kārtīgu, pārbaudāmu elektrisko savienojumu",
      "sistemātiski atrast ķēdes darbības traucējumu",
    ],
    challenge:
      "Elektrība nepiedod paviršību: pirms darba un pārbaudes konsekventi jāievēro drošības procedūras.",
    learningTask:
      "Pēc shēmas samontēt zemsprieguma vadības ķēdi, izmērīt tās parametrus un droši atrast tīši radītu kļūmi.",
    officialUrl: "https://www.vtdt.lv/elektrotehnikis",
    sourceUrl: "https://www.vtdt.lv/elektrotehnikis",
    profile: createProfile({
      realistic: 0.9,
      investigative: 0.9,
      artistic: 0.15,
      social: 0.4,
      enterprising: 0.5,
      conventional: 0.95,
      hardwareNetworks: 0.35,
      mechanicsDiagnostics: 0.3,
      electricityEnergy: 1,
      spatialDrawing: 0.5,
      constructionCoordination: 0.4,
      precisionPatience: 1,
      physicalWork: 0.65,
      outdoorWork: 0.4,
      teamwork: 0.75,
      independentFocus: 0.75,
    }),
  },
];

export const professions = Object.freeze(
  professionSeeds.map((profession) =>
    Object.freeze({
      ...profession,
      status: "active",
      lastVerified: LAST_VERIFIED,
    }),
  ),
);

export const professionById = Object.freeze(
  Object.fromEntries(professions.map((profession) => [profession.id, profession])),
);
