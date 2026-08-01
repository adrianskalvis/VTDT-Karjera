export const uiText = Object.freeze({
  brand: "VTDT virzienu kompass",
  eyebrow: "Profesiju izvēles palīgs",
  introductionTitle: "Atrodi virzienu, ko vērts izmēģināt",
  introduction:
    "18 situācijas palīdzēs pamanīt Tavu interešu, uzdevumu un darba vides kombināciju. Te nav vienas “pareizās” atbildes.",
  startPrinciples: Object.freeze([
    Object.freeze({
      title: "Bez izslēgšanas",
      description: "Viena atbilde nenoslēdz veselu nozari.",
    }),
    Object.freeze({
      title: "18 + līdz 2",
      description: "Precizējums parādās tikai ļoti tuviem rezultātiem.",
    }),
    Object.freeze({
      title: "Top 3",
      description: "Saņem vairākus virzienus un godīgu skaidrojumu.",
    }),
  ]),
  start: "Sākt testu",
  continue: "Turpināt testu",
  back: "Atpakaļ",
  baseProgress: (answered, total) => `Atbildēti ${answered} no ${total}`,
  baseQuestion: (current, total) => `Pamata jautājums ${current} no ${total}`,
  tieProgress: (current, total) =>
    `Precizējošs jautājums ${current} no ${total}`,
  tieIntro:
    "Divi virzieni ir ļoti tuvi. Šī īsā izvēle palīdzēs pamanīt atšķirību; tā nepārraksta iepriekšējās atbildes.",
  keyboardHint: "Vari lietot Tab un Enter vai ciparu taustiņus 1–6.",
  optionsAriaLabel: "Atbilžu varianti",
  resultEyebrow: "Tavs virzienu salikums",
  resultTitle: "Trīs profesijas, kuras vērts izpētīt tālāk",
  closeResults:
    "Vairāki virzieni Tev ir gandrīz vienlīdz piemēroti. Uztver tos kā labas alternatīvas, nevis stingru vietu sadalījumu.",
  exactTopTie:
    "Divi pirmie virzieni ieguva vienādu sakritības indeksu. To secība ir tikai attēlošanas kārtība — uztver abus kā kopīgu pirmo vietu.",
  lowInformationTitle: "Kompass vēl rāda vairākus plašus virzienus",
  lowInformation:
    "Daudzas atbildes bija neitrālas vai savstarpēji līdzsvarojās. Tāpēc nav godīgi nosaukt vienu uzvarētāju — zemāk ir vairāki izpētes sākumpunkti.",
  lowInformationExamples: "Trīs dažādi sākumpunkti (bez stingras secības)",
  broadDirectionsAriaLabel: "Plašie virzieni",
  indexLabel: "Sakritības indekss",
  confidenceLabel: "Atbilžu skaidrība",
  whyTitle: "Kāpēc šāds rezultāts?",
  whyIntro:
    "Modelis vispirms izveido dimensiju profilu un tikai tad salīdzina to ar profesijām. Visstiprākie saskanīgie signāli bija:",
  aspectsTitle: "Kas Tev varētu patikt",
  challengeTitle: "Godīgs iespējamais izaicinājums",
  learningTaskTitle: "Ko reāli varētu darīt mācībās",
  compare: "Salīdzināt Top 3",
  hideComparison: "Aizvērt salīdzinājumu",
  comparisonIntro:
    "Salīdzini uzdevumu veidu un darba vidi; indeksa neliela starpība nav spriedums par Tavu piemērotību.",
  comparisonColumns: Object.freeze({
    profession: "Profesija",
    sector: "Nozare",
    index: "Indekss",
    environment: "Raksturīga darba vide",
    vtdt: "VTDT",
  }),
  primaryRank: "#1 ieteikums",
  sharedPrimaryRank: "Kopīga #1 vieta",
  signalSuffix: "signāls",
  open: "Atvērt",
  exploreAtVtdt: "Izpētīt VTDT",
  secondaryAtVtdt: "Iepazīt VTDT",
  editAnswers: "Mainīt atbildes",
  restart: "Sākt no jauna",
  viewAtVtdt: "Skatīt profesiju VTDT",
  comparisonTitle: "Top 3 salīdzinājums",
  noDefault:
    "Neviena profesija netiek piešķirta pēc vienas atbildes, un neitrālam profilam nav noklusējuma rezultāta.",
  disclaimer:
    "Rezultāts ir karjeras izpētes ieteikums, nevis profesionāla psiholoģiska diagnoze. Visdrošāk profesiju iepazīt arī klātienē un praktiskā nodarbībā.",
  footer: "© Vidzemes Tehnoloģiju un dizaina tehnikums",
});

export const confidenceText = Object.freeze({
  low: {
    label: "zema",
    description: "atbildēs vēl ir daudz atvērtu virzienu",
  },
  medium: {
    label: "vidēja",
    description: "redzamas vairākas stabilas intereses",
  },
  high: {
    label: "augsta",
    description: "atbildēs izveidojies skaidrs un daudzpusīgs raksts",
  },
});

export const resultTemplates = Object.freeze({
  primaryReason: ({ answerStatements, dimensionLabels }) => {
    const answerPart = answerStatements.length
      ? `Tu ${answerStatements.join(" un ")}. Šie signāli`
      : "Tavs kopējais atbilžu raksts";
    const dimensionPart = dimensionLabels.length
      ? dimensionLabels.join(", ")
      : "vairākas līdzsvarotas intereses";
    return `${answerPart} visvairāk sasaucas ar šīs profesijas uzdevumiem. Svarīgākie kopīgie signāli: ${dimensionPart}.`;
  },
  secondaryReason: ({ dimensionLabels }) =>
    dimensionLabels.length
      ? `Īpaši saskan: ${dimensionLabels.join(", ")}.`
      : "Sakritību veido vairāku nelielu signālu kopums.",
  liveQuestion: ({ current, total, prompt }) =>
    `Jautājums ${current} no ${total}. ${prompt}`,
  liveTieQuestion: ({ current, total, prompt }) =>
    `Precizējošs jautājums ${current} no ${total}. ${prompt}`,
  liveResult: ({ title, score }) =>
    title
      ? `Rezultāts gatavs. Augstākais virziens: ${title}, sakritības indekss ${score} no 100.`
      : "Rezultāts gatavs. Vairāki virzieni ir līdzvērtīgi, tādēļ nav viena uzvarētāja.",
  liveTiedResult: ({ firstTitle, secondTitle, score }) =>
    `Rezultāts gatavs. Kopīga pirmā vieta: ${firstTitle} un ${secondTitle}, sakritības indekss ${score} no 100.`,
  answerStatement: ({ answer, reverse }) =>
    reverse
      ? `kā mazāk vēlamu minēji “${answer}”`
      : `izvēlējies “${answer}”`,
});
