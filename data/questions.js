import { professionById } from "./professions.js";

export const ASSESSMENT_VERSION = "2026.1";
export const QUESTION_EFFECT_CAP = 2;
export const TIE_BREAKER_THRESHOLD = 0.25;
export const MIN_SUBSTANTIVE_FOR_TIE_BREAKER = 9;
export const MAX_TIE_BREAKERS = 2;

const neutral = (id) => ({
  id,
  label: "Grūti pateikt",
  effects: {},
  isNeutral: true,
});

export const questions = Object.freeze([
  {
    id: "q01_free_saturday",
    number: 1,
    type: "scenario",
    prompt:
      "Tev ir brīva sestdiena, pieejami datori, darbnīca un dažādi materiāli. Ko Tu vislabprātāk paveiktu?",
    options: [
      {
        id: "q01_digital_tool",
        label: "Izveidotu mazu tīmekļa rīku vai spēles prototipu",
        effects: {
          programming: 2,
          investigative: 1,
          artistic: 1,
          independentFocus: 1,
        },
      },
      {
        id: "q01_computer_fix",
        label: "Atdzīvinātu vecu datoru un savienotu ierīces tīklā",
        effects: {
          hardwareNetworks: 2,
          investigative: 2,
          realistic: 1,
          precisionPatience: 1,
        },
      },
      {
        id: "q01_mechanism",
        label: "Izjauktu, pārbaudītu un saliktu velosipēda vai mopēda mezglu",
        effects: {
          mechanicsDiagnostics: 2,
          realistic: 2,
          physicalWork: 1,
          precisionPatience: 1,
        },
      },
      {
        id: "q01_wood",
        label: "Izgatavotu nelielu koka plauktu ar precīziem savienojumiem",
        effects: {
          woodworking: 2,
          realistic: 2,
          spatialDrawing: 1,
          precisionPatience: 1,
          physicalWork: 1,
        },
      },
      {
        id: "q01_textile",
        label: "Uzzīmētu un uzšūtu praktisku somu vai aksesuāru",
        effects: {
          textileDesign: 2,
          artistic: 2,
          precisionPatience: 1,
          independentFocus: 1,
        },
      },
      neutral("q01_unsure"),
    ],
  },
  {
    id: "q02_hidden_fault",
    number: 2,
    type: "scenario",
    prompt:
      "Kaut kas nedarbojas, bet cēlonis nav redzams. Kuru kļūmi būtu visinteresantāk atšķetināt?",
    options: [
      {
        id: "q02_code",
        label: "Programma dod nepareizu rezultātu tikai noteiktā situācijā",
        effects: {
          programming: 2,
          investigative: 2,
          precisionPatience: 1,
          independentFocus: 1,
        },
      },
      {
        id: "q02_network",
        label: "Viena ierīce nevar piekļūt tīklam, lai gan pārējās var",
        effects: {
          hardwareNetworks: 2,
          investigative: 2,
          conventional: 1,
          precisionPatience: 1,
        },
      },
      {
        id: "q02_engine",
        label: "Dzinējs reizēm darbojas nevienmērīgi, bet mērījumi nav acīmredzami",
        effects: {
          mechanicsDiagnostics: 2,
          investigative: 2,
          realistic: 1,
          precisionPatience: 1,
        },
      },
      {
        id: "q02_circuit",
        label: "Elektriskā ķēdē spriegums pazūd tikai zem slodzes",
        effects: {
          electricityEnergy: 2,
          investigative: 2,
          conventional: 1,
          precisionPatience: 2,
        },
      },
      {
        id: "q02_surface",
        label: "Sienas apdare vienā vietā plaisā vai lobās, lai gan citur turas",
        effects: {
          constructionCoordination: 2,
          investigative: 2,
          realistic: 1,
          precisionPatience: 1,
        },
      },
      neutral("q02_unsure"),
    ],
  },
  {
    id: "q03_before_after",
    number: 3,
    type: "forced-choice",
    prompt: "Kurš “pirms un pēc” rezultāts Tev dotu vislielāko gandarījumu?",
    options: [
      {
        id: "q03_bodywork",
        label: "Ieliekta un sarūsējusi virsbūves detaļa atkal ir taisna un gluda",
        effects: {
          metalBodywork: 2,
          realistic: 2,
          artistic: 1,
          physicalWork: 1,
          precisionPatience: 1,
        },
      },
      {
        id: "q03_finish",
        label: "Nelīdzena, tukša telpa kļuvusi precīzi un gaumīgi pabeigta",
        effects: {
          constructionCoordination: 2,
          spatialDrawing: 1,
          realistic: 2,
          artistic: 2,
          physicalWork: 1,
        },
      },
      {
        id: "q03_furniture",
        label: "Dēļu kaudze pārtapusi izturīgā, glītā mēbelē",
        effects: {
          woodworking: 2,
          realistic: 2,
          artistic: 1,
          precisionPatience: 2,
        },
      },
      {
        id: "q03_clothing",
        label: "Skice un audums pārtapuši labi piegulošā apģērba paraugā",
        effects: {
          textileDesign: 2,
          artistic: 2,
          realistic: 1,
          precisionPatience: 1,
        },
      },
      {
        id: "q03_crop",
        label: "Vājš sējums pēc rūpīgas kopšanas kļuvis vienmērīgs un veselīgs",
        effects: {
          plantProcesses: 2,
          investigative: 1,
          realistic: 1,
          outdoorWork: 2,
          precisionPatience: 1,
        },
      },
      neutral("q03_unsure"),
    ],
  },
  {
    id: "q04_process_video",
    number: 4,
    type: "forced-choice",
    prompt: "Kuru darba procesa video Tu, visticamāk, noskatītos līdz galam?",
    options: [
      {
        id: "q04_software",
        label: "Kā soli pa solim top lietotne un tiek salabota sarežģīta kļūda",
        effects: {
          programming: 2,
          investigative: 2,
          independentFocus: 1,
        },
      },
      {
        id: "q04_engine",
        label: "Kā izjauc, nomēra un atjauno dzinēja mezglu",
        effects: {
          mechanicsDiagnostics: 2,
          realistic: 2,
          precisionPatience: 1,
        },
      },
      {
        id: "q04_frame",
        label: "Kā no rasējuma un kokmateriāliem samontē ēkas karkasu",
        effects: {
          woodworking: 2,
          constructionCoordination: 2,
          spatialDrawing: 1,
          physicalWork: 2,
          outdoorWork: 1,
        },
      },
      {
        id: "q04_garment",
        label: "Kā no idejas, piegrieztnes un auduma izveido apģērba prototipu",
        effects: {
          textileDesign: 2,
          artistic: 2,
          precisionPatience: 1,
        },
      },
      {
        id: "q04_agri_machine",
        label: "Kā lielai lauksaimniecības mašīnai maina agregātu un precīzi to iestata",
        effects: {
          agriculturalMachinery: 2,
          mechanicsDiagnostics: 1,
          realistic: 2,
          outdoorWork: 1,
        },
      },
      neutral("q04_unsure"),
    ],
  },
  {
    id: "q05_natural_precision",
    number: 5,
    type: "forced-choice",
    prompt: "Kāda veida precizitāte Tev šķiet visdabiskākā?",
    options: [
      {
        id: "q05_logic",
        label: "Pārbaudīt katru loģikas soli un atrast vienu nepareizu nosacījumu",
        effects: {
          programming: 2,
          investigative: 1,
          conventional: 2,
          precisionPatience: 2,
          independentFocus: 1,
        },
      },
      {
        id: "q05_measurement",
        label: "Pareizi pieslēgt mēraparātu un salīdzināt vairākus rādījumus",
        effects: {
          electricityEnergy: 2,
          investigative: 1,
          conventional: 2,
          precisionPatience: 2,
        },
      },
      {
        id: "q05_joint",
        label: "Nomērīt detaļas līdz milimetram, lai savienojums būtu nevainojams",
        effects: {
          woodworking: 2,
          realistic: 1,
          conventional: 1,
          precisionPatience: 2,
          independentFocus: 1,
        },
      },
      {
        id: "q05_drawing",
        label: "Sakārtot izmērus un līnijas tehniskā plānā vai 3D modelī",
        effects: {
          spatialDrawing: 2,
          artistic: 1,
          conventional: 2,
          precisionPatience: 2,
        },
      },
      {
        id: "q05_surface",
        label: "Panākt vienmērīgu šuvi, rakstu vai virsmas apdari",
        effects: {
          textileDesign: 1,
          constructionCoordination: 2,
          artistic: 2,
          realistic: 1,
          precisionPatience: 2,
        },
      },
      neutral("q05_unsure"),
    ],
  },
  {
    id: "q06_project_role",
    number: 6,
    type: "scenario",
    prompt: "Klase veido kopīgu projektu. Kuru lomu Tu izvēlētos?",
    options: [
      {
        id: "q06_concept",
        label: "Izstrādāt ideju, skices un kopējo vizuālo risinājumu",
        effects: {
          artistic: 2,
          spatialDrawing: 1,
          textileDesign: 1,
          independentFocus: 1,
        },
      },
      {
        id: "q06_research",
        label: "Izpētīt variantus, veikt aprēķinus un pamatot izvēli",
        effects: {
          investigative: 2,
          conventional: 1,
          precisionPatience: 1,
          independentFocus: 2,
        },
      },
      {
        id: "q06_coordinate",
        label: "Sadalīt darbus, sekot termiņiem un savienot komandas idejas",
        effects: {
          enterprising: 2,
          social: 2,
          conventional: 1,
          teamwork: 2,
          constructionCoordination: 1,
        },
      },
      {
        id: "q06_build",
        label: "Uzņemties izgatavošanu, montāžu un instrumentu lietošanu",
        effects: {
          realistic: 2,
          physicalWork: 2,
          teamwork: 1,
          woodworking: 1,
          constructionCoordination: 1,
        },
      },
      {
        id: "q06_test",
        label: "Pārbaudīt prototipu, atrast trūkumus un fiksēt labojumus",
        effects: {
          investigative: 2,
          conventional: 2,
          precisionPatience: 2,
          teamwork: 1,
        },
      },
      neutral("q06_unsure"),
    ],
  },
  {
    id: "q07_work_environment",
    number: 7,
    type: "forced-choice",
    prompt: "Kurā vidē Tev darba diena varētu paiet visātrāk?",
    options: [
      {
        id: "q07_digital_lab",
        label: "Mierīgā datoru laboratorijā ar ekrāniem, iekārtām un tīkla stendu",
        effects: {
          programming: 1,
          hardwareNetworks: 2,
          investigative: 1,
          physicalWork: -1,
          outdoorWork: -2,
          independentFocus: 2,
        },
      },
      {
        id: "q07_craft_workshop",
        label: "Koka vai tekstila darbnīcā, kur redzamas detaļas un materiāli",
        effects: {
          woodworking: 1,
          textileDesign: 1,
          constructionCoordination: 1,
          artistic: 1,
          realistic: 2,
          precisionPatience: 1,
          outdoorWork: -1,
        },
      },
      {
        id: "q07_auto_shop",
        label: "Autoservisa vai metālapstrādes darbnīcā ar instrumentiem un pacēlājiem",
        effects: {
          mechanicsDiagnostics: 2,
          metalBodywork: 2,
          realistic: 2,
          physicalWork: 2,
          outdoorWork: -1,
        },
      },
      {
        id: "q07_building_site",
        label: "Būvobjektā, kur vienlaikus top vairākas ēkas daļas",
        effects: {
          constructionCoordination: 2,
          spatialDrawing: 1,
          enterprising: 1,
          physicalWork: 2,
          outdoorWork: 1,
          teamwork: 2,
        },
      },
      {
        id: "q07_field",
        label: "Laukā vai saimniecībā, sekojot augiem un lielai tehnikai",
        effects: {
          plantProcesses: 2,
          agriculturalMachinery: 2,
          realistic: 1,
          physicalWork: 1,
          outdoorWork: 2,
        },
      },
      neutral("q07_unsure"),
    ],
  },
  {
    id: "q08_problem_type",
    number: 8,
    type: "scenario",
    prompt: "Kuru problēmu Tu izvēlētos risināt, ja būtu pieejama palīdzība un vajadzīgie rīki?",
    options: [
      {
        id: "q08_automate",
        label: "Automatizēt atkārtojošos darbu ar nelielu programmu",
        effects: {
          programming: 2,
          investigative: 2,
          conventional: 1,
          independentFocus: 1,
        },
      },
      {
        id: "q08_connectivity",
        label: "Panākt, lai datori un ierīces atkal droši sazinās tīklā",
        effects: {
          hardwareNetworks: 2,
          investigative: 2,
          conventional: 1,
          teamwork: 1,
        },
      },
      {
        id: "q08_machine_noise",
        label: "Noskaidrot, kāpēc mehānisms vibrē vai rada neparastu skaņu",
        effects: {
          mechanicsDiagnostics: 2,
          agriculturalMachinery: 1,
          investigative: 2,
          realistic: 2,
        },
      },
      {
        id: "q08_building_plan",
        label: "Izdomāt, kā telpiski un secīgi uzbūvēt drošu konstrukciju",
        effects: {
          spatialDrawing: 2,
          constructionCoordination: 2,
          investigative: 1,
          enterprising: 1,
        },
      },
      {
        id: "q08_plant_stress",
        label: "Noteikt, kas augiem trūkst, salīdzinot augsni, lapas un laikapstākļus",
        effects: {
          plantProcesses: 2,
          investigative: 2,
          outdoorWork: 1,
          precisionPatience: 1,
        },
      },
      neutral("q08_unsure"),
    ],
  },
  {
    id: "q09_tolerable_conditions",
    number: 9,
    type: "scenario",
    prompt: "Ar kuriem darba apstākļiem Tu visvieglāk varētu sadzīvot?",
    options: [
      {
        id: "q09_screen_focus",
        label: "Ilgāku mierīgu darbu pie ekrāna, kamēr atrodas pareizais risinājums",
        effects: {
          programming: 1,
          hardwareNetworks: 1,
          physicalWork: -2,
          outdoorWork: -2,
          independentFocus: 2,
          precisionPatience: 1,
        },
      },
      {
        id: "q09_sawdust",
        label: "Instrumentu skaņu un skaidām, ja top precīzs koka izstrādājums",
        effects: {
          woodworking: 2,
          realistic: 2,
          physicalWork: 1,
          precisionPatience: 1,
        },
      },
      {
        id: "q09_grease_metal",
        label: "Eļļu, metāla skaņām un aizsargaprīkojumu remonta darbnīcā",
        effects: {
          mechanicsDiagnostics: 1,
          metalBodywork: 2,
          realistic: 2,
          physicalWork: 2,
        },
      },
      {
        id: "q09_site_dust",
        label: "Putekļiem, kustību un mainīgai temperatūrai būvobjektā",
        effects: {
          constructionCoordination: 2,
          realistic: 2,
          physicalWork: 2,
          outdoorWork: 1,
          teamwork: 1,
        },
      },
      {
        id: "q09_weather",
        label: "Dubļiem, laikapstākļiem un sezonāli mainīgam ritmam laukā",
        effects: {
          plantProcesses: 2,
          agriculturalMachinery: 1,
          realistic: 1,
          physicalWork: 1,
          outdoorWork: 2,
        },
      },
      neutral("q09_unsure"),
    ],
  },
  {
    id: "q10_short_deadline",
    number: 10,
    type: "scenario",
    prompt: "Komandai ir īss termiņš. Kā Tu visdrīzāk palīdzētu?",
    options: [
      {
        id: "q10_analyse",
        label: "Ātri sadalītu problēmu daļās un atrastu iespējamo cēloni",
        effects: {
          investigative: 2,
          programming: 1,
          mechanicsDiagnostics: 1,
          independentFocus: 1,
          teamwork: 1,
        },
      },
      {
        id: "q10_practical",
        label: "Paņemtu konkrētu praktisku posmu un izpildītu to līdz galam",
        effects: {
          realistic: 2,
          conventional: 1,
          physicalWork: 1,
          independentFocus: 2,
          teamwork: 1,
        },
      },
      {
        id: "q10_coordinate",
        label: "Sakārtotu prioritātes, sadalītu darbus un sekotu kopainai",
        effects: {
          enterprising: 2,
          social: 2,
          conventional: 2,
          constructionCoordination: 1,
          teamwork: 2,
        },
      },
      {
        id: "q10_quality",
        label: "Pārbaudītu kritiskās detaļas, lai steigā nepaliek bīstama kļūda",
        effects: {
          conventional: 2,
          investigative: 1,
          precisionPatience: 2,
          teamwork: 1,
        },
      },
      {
        id: "q10_prototype",
        label: "Ātri uztaisītu skici vai prototipu, par kuru komandai vienoties",
        effects: {
          artistic: 2,
          enterprising: 1,
          spatialDrawing: 1,
          textileDesign: 1,
          teamwork: 2,
        },
      },
      neutral("q10_unsure"),
    ],
  },
  {
    id: "q11_quality_responsibility",
    number: 11,
    type: "forced-choice",
    prompt: "Par kura gala rezultāta drošību un kvalitāti Tu vislabprātāk uzņemtos atbildību?",
    options: [
      {
        id: "q11_electrical",
        label: "Elektriska sistēma ir pareizi samontēta, izmērīta un droši ieslēdzama",
        effects: {
          electricityEnergy: 2,
          conventional: 2,
          precisionPatience: 2,
          realistic: 1,
        },
      },
      {
        id: "q11_vehicle",
        label: "Salabotais transportlīdzekļa mezgls droši darbojas uz ceļa",
        effects: {
          mechanicsDiagnostics: 2,
          metalBodywork: 1,
          conventional: 2,
          precisionPatience: 1,
          realistic: 2,
        },
      },
      {
        id: "q11_structure",
        label: "Konstrukcija atbilst rasējumam, ir stabila un kvalitatīvi uzbūvēta",
        effects: {
          constructionCoordination: 2,
          spatialDrawing: 2,
          enterprising: 1,
          conventional: 2,
          teamwork: 1,
        },
      },
      {
        id: "q11_digital",
        label: "Digitāls risinājums darbojas paredzami un lietotāja dati ir pasargāti",
        effects: {
          programming: 2,
          hardwareNetworks: 1,
          investigative: 1,
          conventional: 2,
          precisionPatience: 1,
        },
      },
      {
        id: "q11_field",
        label: "Lauka darbi un tehnikas izvēle ir droša un dod augiem labus apstākļus",
        effects: {
          plantProcesses: 2,
          agriculturalMachinery: 2,
          enterprising: 1,
          conventional: 1,
          outdoorWork: 1,
        },
      },
      neutral("q11_unsure"),
    ],
  },
  {
    id: "q12_least_appealing",
    number: 12,
    type: "reverse",
    prompt: "Kurš darba veids Tev šķiet vismazāk pievilcīgs?",
    helperText: "Šis ir pretēji vērtēts jautājums — izvēle samazina attiecīgo dimensiju svaru.",
    options: [
      {
        id: "q12_code_screen",
        label: "Vairākas stundas meklēt nelielu kļūdu kodā pie datora",
        effects: {
          programming: -2,
          investigative: -1,
          physicalWork: 1,
          independentFocus: -2,
          precisionPatience: -1,
        },
      },
      {
        id: "q12_noisy_workshop",
        label: "Strādāt trokšņainā darbnīcā ar smagiem instrumentiem",
        effects: {
          mechanicsDiagnostics: -1,
          metalBodywork: -2,
          realistic: -2,
          physicalWork: -2,
        },
      },
      {
        id: "q12_outdoors",
        label: "Strādāt ārā lietū, vējā vai karstumā",
        effects: {
          plantProcesses: -1,
          agriculturalMachinery: -1,
          outdoorWork: -2,
          physicalWork: -1,
        },
      },
      {
        id: "q12_delicate_finish",
        label: "Ilgi atkārtot ļoti smalku šuvi, slīpējumu vai virsmas labojumu",
        effects: {
          textileDesign: -1,
          woodworking: -1,
          artistic: -1,
          precisionPatience: -2,
          independentFocus: -1,
        },
      },
      {
        id: "q12_coordinate_people",
        label: "Nepārtraukti saskaņot cilvēkus, termiņus un mainīgus darba posmus",
        effects: {
          enterprising: -2,
          social: -2,
          constructionCoordination: -1,
          teamwork: -2,
        },
      },
      neutral("q12_unsure"),
    ],
  },
  {
    id: "q13_tool_for_a_day",
    number: 13,
    type: "forced-choice",
    prompt: "Kuru profesionālo rīku vai programmu Tu gribētu vienā dienā izmēģināt?",
    options: [
      {
        id: "q13_debugger",
        label: "Koda redaktoru ar atkļūdotāju un automātiskajiem testiem",
        effects: {
          programming: 2,
          investigative: 2,
          conventional: 1,
          independentFocus: 1,
        },
      },
      {
        id: "q13_network_tools",
        label: "Tīkla analizatoru un datoru diagnostikas rīku komplektu",
        effects: {
          hardwareNetworks: 2,
          electricityEnergy: 1,
          investigative: 2,
          precisionPatience: 1,
        },
      },
      {
        id: "q13_cad",
        label: "CAD/BIM programmu precīzam rasējumam un 3D ēkas modelim",
        effects: {
          spatialDrawing: 2,
          constructionCoordination: 1,
          artistic: 1,
          conventional: 1,
          independentFocus: 1,
        },
      },
      {
        id: "q13_vehicle_tools",
        label: "Auto diagnostikas skeneri un virsbūves ģeometrijas mēriekārtu",
        effects: {
          mechanicsDiagnostics: 2,
          metalBodywork: 2,
          investigative: 1,
          realistic: 2,
        },
      },
      {
        id: "q13_making_tools",
        label: "Programmējamu kokapstrādes, šūšanas vai materiālu griešanas iekārtu",
        effects: {
          woodworking: 1,
          textileDesign: 1,
          agriculturalMachinery: 1,
          constructionCoordination: 1,
          realistic: 2,
          artistic: 1,
          precisionPatience: 1,
        },
      },
      neutral("q13_unsure"),
    ],
  },
  {
    id: "q14_incomplete_instruction",
    number: 14,
    type: "scenario",
    prompt: "Uzdevumam nav pilnīgas instrukcijas. Kā Tu sāktu?",
    options: [
      {
        id: "q14_test_logic",
        label: "Izvirzītu pieņēmumu un pārbaudītu to ar mazu eksperimentu vai datiem",
        effects: {
          investigative: 2,
          programming: 1,
          plantProcesses: 1,
          independentFocus: 1,
        },
      },
      {
        id: "q14_inspect_object",
        label: "Apskatītu detaļas, izmērītu un praktiski pārbaudītu, kas kustas vai nedarbojas",
        effects: {
          realistic: 2,
          mechanicsDiagnostics: 2,
          metalBodywork: 1,
          constructionCoordination: 1,
          precisionPatience: 1,
        },
      },
      {
        id: "q14_sketch",
        label: "Uzzīmētu vairākus variantus vai modeli, lai ieraudzītu iespējamo risinājumu",
        effects: {
          artistic: 2,
          spatialDrawing: 2,
          textileDesign: 1,
          independentFocus: 1,
        },
      },
      {
        id: "q14_team_plan",
        label: "Noskaidrotu mērķi, vienotos ar komandu un sastādītu darba secību",
        effects: {
          social: 2,
          enterprising: 2,
          conventional: 2,
          constructionCoordination: 1,
          teamwork: 2,
        },
      },
      {
        id: "q14_safe_manual",
        label: "Vispirms atrastu shēmu vai rokasgrāmatu un noteiktu drošas pārbaudes soļus",
        effects: {
          conventional: 2,
          electricityEnergy: 1,
          hardwareNetworks: 1,
          precisionPatience: 2,
          independentFocus: 1,
        },
      },
      neutral("q14_unsure"),
    ],
  },
  {
    id: "q15_result_tempo",
    number: 15,
    type: "forced-choice",
    prompt: "Kāds darba ritms un rezultāta brīdis Tev šķiet saistošākais?",
    options: [
      {
        id: "q15_immediate_repair",
        label: "Atrastu bojājumu, salabotu un uzreiz pārbaudītu, vai viss darbojas",
        effects: {
          mechanicsDiagnostics: 2,
          hardwareNetworks: 1,
          electricityEnergy: 1,
          investigative: 1,
          realistic: 2,
        },
      },
      {
        id: "q15_long_build",
        label: "Vairākas nedēļas būvētu lielāku objektu, redzot progresu pa posmiem",
        effects: {
          constructionCoordination: 2,
          woodworking: 1,
          enterprising: 1,
          physicalWork: 2,
          teamwork: 2,
        },
      },
      {
        id: "q15_digital",
        label: "Veidotu digitālu risinājumu, ko var izmēģināt un uzlabot daudzās versijās",
        effects: {
          programming: 2,
          investigative: 1,
          artistic: 1,
          physicalWork: -1,
          independentFocus: 2,
        },
      },
      {
        id: "q15_season",
        label: "Sekotu sezonālam procesam, kur rezultātu ietekmē daba un savlaicīgi lēmumi",
        effects: {
          plantProcesses: 2,
          agriculturalMachinery: 1,
          investigative: 1,
          precisionPatience: 1,
          outdoorWork: 2,
        },
      },
      {
        id: "q15_crafted",
        label: "Ilgāk slīpētu vienu izstrādājumu, līdz forma un detaļas ir tieši pareizas",
        effects: {
          woodworking: 1,
          textileDesign: 1,
          metalBodywork: 1,
          constructionCoordination: 1,
          realistic: 1,
          artistic: 2,
          precisionPatience: 2,
          independentFocus: 2,
        },
      },
      neutral("q15_unsure"),
    ],
  },
  {
    id: "q16_best_compliment",
    number: 16,
    type: "forced-choice",
    prompt: "Kurš kompliments par Tavu paveikto darbu šķistu visvērtīgākais?",
    options: [
      {
        id: "q16_clever",
        label: "“Tu atradi cēloni, ko citi nepamanīja, un risinājums tiešām strādā.”",
        effects: {
          investigative: 2,
          programming: 1,
          hardwareNetworks: 1,
          mechanicsDiagnostics: 1,
          independentFocus: 1,
        },
      },
      {
        id: "q16_precise",
        label: "“Katra detaļa ir precīza, tīra un rūpīgi pabeigta.”",
        effects: {
          conventional: 2,
          woodworking: 1,
          textileDesign: 1,
          precisionPatience: 2,
          independentFocus: 1,
        },
      },
      {
        id: "q16_durable",
        label: "“Tas ir praktiski, izturīgi un uzbūvēts tā, lai kalpotu.”",
        effects: {
          realistic: 2,
          constructionCoordination: 1,
          woodworking: 1,
          mechanicsDiagnostics: 1,
          physicalWork: 1,
        },
      },
      {
        id: "q16_visual",
        label: "“Risinājums ir oriģināls, gaumīgs un vizuāli pārliecinošs.”",
        effects: {
          artistic: 2,
          textileDesign: 2,
          spatialDrawing: 1,
          metalBodywork: 1,
          constructionCoordination: 1,
        },
      },
      {
        id: "q16_team",
        label: "“Tu palīdzēji komandai visu saskaņot un pabeigt droši laikā.”",
        effects: {
          social: 2,
          enterprising: 2,
          conventional: 1,
          constructionCoordination: 1,
          teamwork: 2,
        },
      },
      neutral("q16_unsure"),
    ],
  },
  {
    id: "q17_second_least",
    number: 17,
    type: "reverse",
    prompt: "Kuru ikdienas situāciju Tu vismazāk gribētu piedzīvot regulāri?",
    helperText: "Arī šī izvēle tiek vērtēta pretējā virzienā.",
    options: [
      {
        id: "q17_micro_precision",
        label: "Daudzkārt mērīt un pārtaisīt ļoti mazu detaļu",
        effects: {
          conventional: -1,
          woodworking: -1,
          textileDesign: -1,
          electricityEnergy: -1,
          precisionPatience: -2,
        },
      },
      {
        id: "q17_heavy_outdoor",
        label: "Visu dienu fiziski strādāt ārā mainīgos laikapstākļos",
        effects: {
          plantProcesses: -1,
          agriculturalMachinery: -1,
          constructionCoordination: -1,
          physicalWork: -2,
          outdoorWork: -2,
        },
      },
      {
        id: "q17_solo_screen",
        label: "Ilgi vienatnē koncentrēties uz abstraktu uzdevumu pie ekrāna",
        effects: {
          programming: -2,
          investigative: -1,
          physicalWork: 1,
          independentFocus: -2,
        },
      },
      {
        id: "q17_metal_noise",
        label: "Regulāri strādāt ar eļļu, metālu, vibrāciju un darbnīcas troksni",
        effects: {
          mechanicsDiagnostics: -1,
          metalBodywork: -2,
          realistic: -1,
          physicalWork: -1,
        },
      },
      {
        id: "q17_constant_coordination",
        label: "Bieži pārtraukt savu darbu, lai saskaņotu citu cilvēku uzdevumus",
        effects: {
          social: -2,
          enterprising: -2,
          constructionCoordination: -1,
          teamwork: -2,
          independentFocus: 1,
        },
      },
      neutral("q17_unsure"),
    ],
  },
  {
    id: "q18_month_project",
    number: 18,
    type: "scenario",
    prompt: "Ja skolā vienam mēnesim būtu jāizvēlas projekts, kuru Tu ņemtu?",
    helperText:
      "Šis jautājums pārbauda kopējo virzienu, taču tā ietekme nav lielāka par citiem jautājumiem.",
    options: [
      {
        id: "q18_app",
        label: "Izveidot noderīgu lietotni, iztestēt to un parādīt lietotājiem",
        effects: {
          programming: 2,
          investigative: 1,
          artistic: 1,
          conventional: 1,
          teamwork: 1,
          independentFocus: 1,
        },
      },
      {
        id: "q18_smart_lab",
        label: "Ierīkot nelielu datoru tīklu ar sensoriem un atrast tajā radītas kļūmes",
        effects: {
          hardwareNetworks: 2,
          electricityEnergy: 1,
          investigative: 2,
          realistic: 1,
          teamwork: 1,
        },
      },
      {
        id: "q18_vehicle_restore",
        label: "Diagnosticēt un atjaunot nelielu transportlīdzekļa mezglu vai virsbūves detaļu",
        effects: {
          mechanicsDiagnostics: 2,
          metalBodywork: 2,
          realistic: 2,
          physicalWork: 1,
          precisionPatience: 1,
        },
      },
      {
        id: "q18_design_build",
        label: "Izplānot un izgatavot telpas, koka konstrukcijas vai dizaina izstrādājuma prototipu",
        effects: {
          spatialDrawing: 2,
          constructionCoordination: 2,
          woodworking: 2,
          textileDesign: 1,
          artistic: 2,
          realistic: 1,
          precisionPatience: 1,
          physicalWork: 1,
        },
      },
      {
        id: "q18_field_trial",
        label: "Izaudzēt izmēģinājuma kultūru un salīdzināt tehnikas vai kopšanas paņēmienus",
        effects: {
          plantProcesses: 2,
          agriculturalMachinery: 2,
          investigative: 1,
          realistic: 1,
          outdoorWork: 2,
          precisionPatience: 1,
        },
      },
      neutral("q18_unsure"),
    ],
  },
]);

const tieNeutral = (id) => neutral(id);

export const tieBreakers = Object.freeze([
  {
    id: "tb_programming_hardware",
    pair: ["programmesanas_tehnikis", "datorsistemu_tehnikis"],
    questions: [
      {
        id: "tb_programming_hardware_1",
        prompt: "Datoru laboratorijā ir brīva stunda. Kurš uzdevums Tevi ievilktu vairāk?",
        options: [
          {
            id: "tb_ph_1_code",
            label: "Uzrakstīt funkciju un ar testiem atrast kļūdu tās loģikā",
            effects: { programming: 2, investigative: 1, hardwareNetworks: -1 },
          },
          {
            id: "tb_ph_1_network",
            label: "Saslēgt ierīces un noskaidrot, kāpēc viena nav redzama tīklā",
            effects: { hardwareNetworks: 2, realistic: 1, programming: -1 },
          },
          tieNeutral("tb_ph_1_unsure"),
        ],
      },
      {
        id: "tb_programming_hardware_2",
        prompt: "Kuru neredzamo procesu Tu labprātāk izsekotu soli pa solim?",
        options: [
          {
            id: "tb_ph_2_data",
            label: "Kā dati mainās algoritmā no ievades līdz rezultātam",
            effects: { programming: 2, investigative: 1, independentFocus: 1 },
          },
          {
            id: "tb_ph_2_signal",
            label: "Kā signāls ceļo caur kabeli, maršrutētāju un datoru",
            effects: { hardwareNetworks: 2, electricityEnergy: 1, realistic: 1 },
          },
          tieNeutral("tb_ph_2_unsure"),
        ],
      },
    ],
  },
  {
    id: "tb_mechanics_bodywork",
    pair: ["automehanikis", "autovirsbuvju_remonta_tehnikis"],
    questions: [
      {
        id: "tb_mechanics_bodywork_1",
        prompt: "Bojātam auto drīksti izvēlēties vienu darba posmu. Kuru?",
        options: [
          {
            id: "tb_mb_1_mechanics",
            label: "Pēc skaņas un mērījumiem atrast ritošās daļas bojājumu",
            effects: { mechanicsDiagnostics: 2, investigative: 1, metalBodywork: -1 },
          },
          {
            id: "tb_mb_1_body",
            label: "Izmērīt deformāciju un atjaunot virsbūves detaļas formu",
            effects: { metalBodywork: 2, artistic: 1, mechanicsDiagnostics: -1 },
          },
          tieNeutral("tb_mb_1_unsure"),
        ],
      },
      {
        id: "tb_mechanics_bodywork_2",
        prompt: "Kurš gala pārbaudes brīdis šķiet gandarījošāks?",
        options: [
          {
            id: "tb_mb_2_drive",
            label: "Mehānisms testa braucienā atkal darbojas klusi un pareizi",
            effects: { mechanicsDiagnostics: 2, investigative: 1 },
          },
          {
            id: "tb_mb_2_shape",
            label: "Atjaunotās virsbūves līnijas un spraugas atkal precīzi sakrīt",
            effects: { metalBodywork: 2, spatialDrawing: 1, precisionPatience: 1 },
          },
          tieNeutral("tb_mb_2_unsure"),
        ],
      },
    ],
  },
  {
    id: "tb_architecture_building",
    pair: ["arhitekturas_tehnikis", "eku_buvtehnikis"],
    questions: [
      {
        id: "tb_architecture_building_1",
        prompt: "Ēkas projektā kurš darbs Tev šķiet tuvāks?",
        options: [
          {
            id: "tb_ab_1_model",
            label: "Detalizēt telpu un mezglus precīzā digitālā modelī",
            effects: { spatialDrawing: 2, artistic: 1, independentFocus: 1 },
          },
          {
            id: "tb_ab_1_site",
            label: "Objektā saskaņot darbu secību, materiālus un kvalitātes pārbaudes",
            effects: { constructionCoordination: 2, enterprising: 1, teamwork: 1 },
          },
          tieNeutral("tb_ab_1_unsure"),
        ],
      },
      {
        id: "tb_architecture_building_2",
        prompt: "Kura kļūda Tevi vairāk mudinātu ķerties pie risināšanas?",
        options: [
          {
            id: "tb_ab_2_drawing",
            label: "Rasējuma izmēri nesakrīt un telpiskais mezgls nav skaidrs",
            effects: { spatialDrawing: 2, investigative: 1, independentFocus: 1 },
          },
          {
            id: "tb_ab_2_schedule",
            label: "Divi būvdarbu posmi konfliktē un jāpārplāno komandas darbs",
            effects: { constructionCoordination: 2, enterprising: 1, teamwork: 2 },
          },
          tieNeutral("tb_ab_2_unsure"),
        ],
      },
    ],
  },
  {
    id: "tb_carpentry_furniture",
    pair: ["namdaris", "mebelu_galdnieks"],
    questions: [
      {
        id: "tb_carpentry_furniture_1",
        prompt: "Ar koku saistītā projektā kuru mērogu Tu izvēlētos?",
        options: [
          {
            id: "tb_cf_1_structure",
            label: "Montēt lielu ēkas karkasa mezglu objektā",
            effects: { constructionCoordination: 2, woodworking: 1, physicalWork: 2, outdoorWork: 1 },
          },
          {
            id: "tb_cf_1_furniture",
            label: "Darbnīcā izgatavot precīzu atvilktni ar tīriem savienojumiem",
            effects: { woodworking: 2, precisionPatience: 2, independentFocus: 1, outdoorWork: -1 },
          },
          tieNeutral("tb_cf_1_unsure"),
        ],
      },
      {
        id: "tb_carpentry_furniture_2",
        prompt: "Kurš izaicinājums šķiet saistošāks?",
        options: [
          {
            id: "tb_cf_2_site",
            label: "Droši salāgot lielas detaļas kopā ar komandu mainīgos apstākļos",
            effects: { constructionCoordination: 2, physicalWork: 2, outdoorWork: 2, teamwork: 1 },
          },
          {
            id: "tb_cf_2_detail",
            label: "Ilgi pieslīpēt detaļas, līdz mēbeles forma un virsma ir nevainojama",
            effects: { woodworking: 2, artistic: 1, precisionPatience: 2, independentFocus: 2 },
          },
          tieNeutral("tb_cf_2_unsure"),
        ],
      },
    ],
  },
  {
    id: "tb_plants_machinery",
    pair: ["augkopibas_tehnikis", "lauksaimniecibas_mehanizacijas_tehnikis"],
    questions: [
      {
        id: "tb_plants_machinery_1",
        prompt: "No rīta saimniecībā kuru pārbaudi Tu izvēlētos?",
        options: [
          {
            id: "tb_pm_1_plants",
            label: "Salīdzināt augu, augsnes un mitruma pazīmes vairākās lauka vietās",
            effects: { plantProcesses: 2, investigative: 1, agriculturalMachinery: -1 },
          },
          {
            id: "tb_pm_1_machine",
            label: "Pārbaudīt traktora mezglus un noregulēt agregātu dienas darbam",
            effects: { agriculturalMachinery: 2, mechanicsDiagnostics: 1, plantProcesses: -1 },
          },
          tieNeutral("tb_pm_1_unsure"),
        ],
      },
      {
        id: "tb_plants_machinery_2",
        prompt: "Par kuru rezultātu Tu labprātāk veiktu pierakstus un secinājumus?",
        options: [
          {
            id: "tb_pm_2_growth",
            label: "Kā kopšanas paņēmiens nedēļu gaitā mainīja augu attīstību",
            effects: { plantProcesses: 2, precisionPatience: 1 },
          },
          {
            id: "tb_pm_2_settings",
            label: "Kā mašīnas iestatījumi mainīja darba precizitāti un patēriņu",
            effects: { agriculturalMachinery: 2, mechanicsDiagnostics: 1, conventional: 1 },
          },
          tieNeutral("tb_pm_2_unsure"),
        ],
      },
    ],
  },
  {
    id: "tb_electrical_renewable",
    pair: ["elektrotehnikis", "atjaunojamas_energetikas_tehnikis"],
    questions: [
      {
        id: "tb_electrical_renewable_1",
        prompt: "Kurā sistēmā Tu labprātāk veiktu mērījumus?",
        options: [
          {
            id: "tb_er_1_panel",
            label: "Vadības skapī pārbaudītu ķēdes, aizsardzību un savienojumus",
            effects: { electricityEnergy: 2, conventional: 1, precisionPatience: 1, outdoorWork: -1 },
          },
          {
            id: "tb_er_1_solar",
            label: "Ārā salīdzinātu saules paneļu jaudu dažādos apstākļos",
            effects: { electricityEnergy: 1, investigative: 1, outdoorWork: 2, physicalWork: 1 },
          },
          tieNeutral("tb_er_1_unsure"),
        ],
      },
      {
        id: "tb_electrical_renewable_2",
        prompt: "Kurš montāžas darbs šķiet interesantāks?",
        options: [
          {
            id: "tb_er_2_wiring",
            label: "Pēc shēmas izveidot īpaši kārtīgu iekārtas elektroinstalāciju",
            effects: { electricityEnergy: 2, conventional: 2, precisionPatience: 2 },
          },
          {
            id: "tb_er_2_system",
            label: "Komandā objektā uzstādīt enerģijas ieguves iekārtas un pieslēgumus",
            effects: { electricityEnergy: 1, constructionCoordination: 1, outdoorWork: 2, teamwork: 2 },
          },
          tieNeutral("tb_er_2_unsure"),
        ],
      },
    ],
  },
  {
    id: "tb_electrical_building_systems",
    pair: ["elektrotehnikis", "inzeniersistemu_buvtehnikis"],
    questions: [
      {
        id: "tb_electrical_building_systems_1",
        prompt: "Ēkas tehniskajā telpā kurš uzdevums Tevi saistītu vairāk?",
        options: [
          {
            id: "tb_eb_1_circuit",
            label: "Izmērīt un atrast bojājumu elektriskā vadības ķēdē",
            effects: { electricityEnergy: 2, investigative: 1, precisionPatience: 1 },
          },
          {
            id: "tb_eb_1_systems",
            label: "Pēc rasējuma saskaņot cauruļvadus, iekārtas un montāžas secību",
            effects: { constructionCoordination: 2, spatialDrawing: 1, teamwork: 1 },
          },
          tieNeutral("tb_eb_1_unsure"),
        ],
      },
      {
        id: "tb_electrical_building_systems_2",
        prompt: "Kura atbildība šķiet tuvāka?",
        options: [
          {
            id: "tb_eb_2_electrical",
            label: "Lai katrs elektriskais savienojums un mērījums ir drošs",
            effects: { electricityEnergy: 2, conventional: 1, precisionPatience: 2 },
          },
          {
            id: "tb_eb_2_coordination",
            label: "Lai vairākas ēkas sistēmas objektā telpiski un laikā nekonfliktē",
            effects: { constructionCoordination: 2, spatialDrawing: 1, enterprising: 1, teamwork: 2 },
          },
          tieNeutral("tb_eb_2_unsure"),
        ],
      },
    ],
  },
  {
    id: "tb_finishing_building",
    pair: ["apdares_darbu_tehnikis", "eku_buvtehnikis"],
    questions: [
      {
        id: "tb_finishing_building_1",
        prompt: "Būvobjektā kuru rezultātu Tu gribētu radīt pats?",
        options: [
          {
            id: "tb_fb_1_surface",
            label: "Perfekti sagatavotu un pabeigtu vienu redzamu telpas virsmu",
            effects: { artistic: 1, constructionCoordination: 1, precisionPatience: 2, independentFocus: 1 },
          },
          {
            id: "tb_fb_1_whole",
            label: "Sakārtotu vairāku darbu secību, lai viss ēkas posms būtu gatavs laikā",
            effects: { constructionCoordination: 2, enterprising: 2, teamwork: 2 },
          },
          tieNeutral("tb_fb_1_unsure"),
        ],
      },
      {
        id: "tb_finishing_building_2",
        prompt: "Kur Tu labāk pamanītu kvalitāti?",
        options: [
          {
            id: "tb_fb_2_detail",
            label: "Līdzenumā, rakstā, malās un materiāla virsmā",
            effects: { artistic: 1, precisionPatience: 2, realistic: 1 },
          },
          {
            id: "tb_fb_2_process",
            label: "Rasējuma, materiālu, konstrukciju un komandas darba kopainā",
            effects: { constructionCoordination: 2, spatialDrawing: 1, conventional: 1, teamwork: 1 },
          },
          tieNeutral("tb_fb_2_unsure"),
        ],
      },
    ],
  },
  {
    id: "tb_textile_furniture",
    pair: ["apgerbu_dizainera_asistents", "mebelu_galdnieks"],
    questions: [
      {
        id: "tb_textile_furniture_1",
        prompt: "Precīzam dizaina izstrādājumam kuru materiālu Tu izvēlētos?",
        options: [
          {
            id: "tb_tf_1_textile",
            label: "Elastīgu audumu, kura forma un piegulums mainās kustībā",
            effects: { textileDesign: 2, artistic: 1, woodworking: -1 },
          },
          {
            id: "tb_tf_1_wood",
            label: "Masīvu koku, kur detaļām jāveido stingrs un precīzs savienojums",
            effects: { woodworking: 2, realistic: 1, textileDesign: -1 },
          },
          tieNeutral("tb_tf_1_unsure"),
        ],
      },
      {
        id: "tb_textile_furniture_2",
        prompt: "Kuru pielāgošanu Tu labprātāk veiktu?",
        options: [
          {
            id: "tb_tf_2_fit",
            label: "Mainītu piegrieztni, lai apģērbs labi piegulētu un kustētos",
            effects: { textileDesign: 2, artistic: 1, precisionPatience: 1 },
          },
          {
            id: "tb_tf_2_joint",
            label: "Pieslīpētu koka detaļas, lai mēbele būtu stabila un gluda",
            effects: { woodworking: 2, realistic: 1, precisionPatience: 1 },
          },
          tieNeutral("tb_tf_2_unsure"),
        ],
      },
    ],
  },
]);

// Fallback kolekcija ļauj precizēt arī neparedzētu tuvu Top 2 pāri. No šiem
// jautājumiem tiek izvēlēti divi ar lielāko profilu diskriminācijas spēju.
export const genericTieBreakerQuestions = Object.freeze([
  {
    id: "tb_generic_digital_physical",
    prompt: "Ja abi uzdevumi būtu vienlīdz sarežģīti, kurš Tevi vairāk ievilktu?",
    options: [
      {
        id: "tb_gdp_digital",
        label: "Izveidot un pārbaudīt neredzamu digitālu loģiku",
        effects: {
          programming: 2,
          investigative: 1,
          independentFocus: 1,
          physicalWork: -1,
        },
      },
      {
        id: "tb_gdp_physical",
        label: "Ar instrumentiem atjaunot fizisku mehānismu vai detaļu",
        effects: {
          mechanicsDiagnostics: 2,
          realistic: 2,
          physicalWork: 1,
          programming: -1,
        },
      },
      tieNeutral("tb_gdp_unsure"),
    ],
  },
  {
    id: "tb_generic_detail_coordination",
    prompt: "Lielākā projektā kuru darba daļu Tu izvēlētos?",
    options: [
      {
        id: "tb_gdc_detail",
        label: "Patstāvīgi noslīpēt vienu detaļu līdz ļoti precīzam rezultātam",
        effects: {
          artistic: 1,
          precisionPatience: 2,
          independentFocus: 2,
          teamwork: -1,
        },
      },
      {
        id: "tb_gdc_coordination",
        label: "Saskaņot cilvēkus un posmus, lai viss projekts virzās pareizā secībā",
        effects: {
          enterprising: 2,
          constructionCoordination: 2,
          teamwork: 2,
          independentFocus: -1,
        },
      },
      tieNeutral("tb_gdc_unsure"),
    ],
  },
  {
    id: "tb_generic_nature_machine",
    prompt: "Saimniecībā ir divi svarīgi novērojumi. Kuram Tu pievērstos?",
    options: [
      {
        id: "tb_gnm_nature",
        label: "Pētītu augu, augsnes un laikapstākļu radītās pārmaiņas",
        effects: {
          plantProcesses: 2,
          investigative: 1,
          outdoorWork: 1,
          agriculturalMachinery: -1,
        },
      },
      {
        id: "tb_gnm_machine",
        label: "Pārbaudītu un noregulētu lielas mašīnas mehānismus",
        effects: {
          agriculturalMachinery: 2,
          mechanicsDiagnostics: 2,
          realistic: 1,
          plantProcesses: -1,
        },
      },
      tieNeutral("tb_gnm_unsure"),
    ],
  },
  {
    id: "tb_generic_electric_computer",
    prompt: "Kuru sistēmu Tu labprātāk sakārtotu pēc shēmas?",
    options: [
      {
        id: "tb_gec_electric",
        label: "Elektrisko ķēdi ar mērījumiem, aizsardzību un savienojumiem",
        effects: {
          electricityEnergy: 2,
          conventional: 1,
          precisionPatience: 1,
          hardwareNetworks: -1,
        },
      },
      {
        id: "tb_gec_computer",
        label: "Datoru un tīkla ierīču konfigurāciju un datu savienojumus",
        effects: {
          hardwareNetworks: 2,
          investigative: 1,
          independentFocus: 1,
          electricityEnergy: -1,
        },
      },
      tieNeutral("tb_gec_unsure"),
    ],
  },
  {
    id: "tb_generic_textile_wood",
    prompt: "Kuru materiāla pārvērtību Tu gribētu izplānot un izgatavot?",
    options: [
      {
        id: "tb_gtw_textile",
        label: "Elastīgu, vizuālu tekstila izstrādājumu, kas pielāgojas cilvēkam",
        effects: {
          textileDesign: 2,
          artistic: 2,
          precisionPatience: 1,
          woodworking: -1,
        },
      },
      {
        id: "tb_gtw_wood",
        label: "Stingru koka izstrādājumu ar izturīgiem, precīziem savienojumiem",
        effects: {
          woodworking: 2,
          realistic: 2,
          precisionPatience: 1,
          textileDesign: -1,
        },
      },
      tieNeutral("tb_gtw_unsure"),
    ],
  },
  {
    id: "tb_generic_plan_execution",
    prompt: "Kad iecere jāpadara reāla, kurš posms Tev šķiet tuvāks?",
    options: [
      {
        id: "tb_gpe_plan",
        label: "Izstrādāt precīzu rasējumu vai 3D modeli un pārbaudīt izmērus",
        effects: {
          spatialDrawing: 2,
          artistic: 1,
          conventional: 1,
          independentFocus: 1,
          physicalWork: -1,
        },
      },
      {
        id: "tb_gpe_execution",
        label: "Objektā izgatavot vai samontēt risinājumu un uzreiz pārbaudīt kvalitāti",
        effects: {
          constructionCoordination: 2,
          realistic: 2,
          physicalWork: 2,
          teamwork: 1,
          spatialDrawing: -1,
        },
      },
      tieNeutral("tb_gpe_unsure"),
    ],
  },
]);

export const questionById = Object.freeze(
  Object.fromEntries(questions.map((question) => [question.id, question])),
);

export const tieBreakerQuestionById = Object.freeze(
  Object.fromEntries(
    [
      ...tieBreakers.flatMap((collection) => collection.questions),
      ...genericTieBreakerQuestions,
    ].map((question) => [question.id, question]),
  ),
);

export const findTieBreakerForPair = (firstId, secondId) => {
  const wanted = new Set([firstId, secondId]);
  const exact = tieBreakers.find(
    ({ pair }) => pair.length === wanted.size && pair.every((id) => wanted.has(id)),
  );
  if (exact) return exact;

  const first = professionById[firstId];
  const second = professionById[secondId];
  if (!first || !second || firstId === secondId) return undefined;

  const utility = (question, profession) =>
    question.options
      .filter((option) => !option.isNeutral)
      .map((option) =>
        Object.entries(option.effects).reduce(
          (sum, [dimensionId, effect]) =>
            sum + effect * (2 * profession.profile[dimensionId] - 1),
          0,
        ),
      );
  const discrimination = (question) => {
    const firstUtilities = utility(question, first);
    const secondUtilities = utility(question, second);
    return Math.abs(
      firstUtilities[0] -
        firstUtilities[1] -
        (secondUtilities[0] - secondUtilities[1]),
    );
  };
  const selected = [...genericTieBreakerQuestions]
    .sort(
      (firstQuestion, secondQuestion) =>
        discrimination(secondQuestion) - discrimination(firstQuestion),
    )
    .slice(0, MAX_TIE_BREAKERS);

  return Object.freeze({
    id: `tb_generic_${[firstId, secondId].sort().join("_")}`,
    pair: Object.freeze([firstId, secondId]),
    generic: true,
    questions: Object.freeze(selected),
  });
};
