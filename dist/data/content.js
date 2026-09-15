export const uiText = Object.freeze({
  brand: "VTDT karjeras tests",
  eyebrow: "Profesiju izvēles palīgs",
  introductionTitle: "Kurš virziens varētu būt Tavējais?",
  introduction:
    "Izvēlies testa garumu un atbildi pēc pirmās sajūtas. Viena atbilde gala rezultātu nenosaka.",
  modes: Object.freeze({
    quick: Object.freeze({
      title: "Ātrais tests",
      badge: "Ieteicamais",
      description: "Apmēram 1–2 minūtes. Īsi jautājumi un ātrs Top 3 rezultāts.",
      action: "Sākt ātro testu",
    }),
    deep: Object.freeze({
      title: "Padziļinātais tests",
      description: "Apmēram 3 minūtes. Vairāk jautājumu precīzākam salīdzinājumam.",
      action: "Sākt padziļināto testu",
    }),
  }),
  back: "Atpakaļ",
  keyboardHint: "Atbildi ar pogu vai ciparu 1–4.",
  optionsAriaLabel: "Atbilžu varianti",
  baseProgress: (answered, total) => `Atbildēti ${answered} no ${total}`,
  baseQuestion: (current, total) => `Jautājums ${current} no ${total}`,
  tieProgress: (current, total) => `Precizējošs jautājums ${current} no ${total}`,
  tieIntro: "Vēl viens īss jautājums palīdzēs salīdzināt tuvākos virzienus.",
  selectedMode: (title) => `Izvēlēts: ${title}`,
  resultEyebrow: "Tavs rezultāts",
  resultTitle: "Virziens, ko vērts iepazīt",
  sharedResultTitle: "Tev vienlīdz labi der vairāki virzieni",
  lowInformationTitle: "Vēl ir vairāki plaši virzieni",
  lowInformation:
    "Atbildēs pagaidām ir par maz skaidru signālu, tāpēc nebūtu godīgi nosaukt vienu profesiju.",
  broadDirectionsAriaLabel: "Plašie profesionālie virzieni",
  indexLabel: "Atbilstības rādītājs",
  traitsTitle: "Divas spēcīgākās iezīmes",
  workTitle: "Ko šajā profesijā dara",
  compare: "Salīdzināt Top 3",
  hideComparison: "Aizvērt Top 3",
  whyTitle: "Kā radās šis rezultāts?",
  whyIntro:
    "Atbildes veido Tavu interešu un darba stila kopainu, ko salīdzina ar visiem 13 virzieniem.",
  editAnswers: "Mainīt atbildes",
  restart: "Sākt no jauna",
  upgrade: "Turpināt padziļināti",
  viewAtVtdt: "Skatīt profesiju VTDT",
  sharedFirst: "Kopīga 1. vieta",
  noDefault:
    "Atbildi pēc pirmās sajūtas — te nav pareizu vai nepareizu atbilžu.",
  disclaimer:
    "Atbilstības rādītājs ir karjeras izpētes orientieris, nevis garantēta vai psiholoģiska diagnoze.",
  footer: "© Vidzemes Tehnoloģiju un dizaina tehnikums",
});

export const confidenceText = Object.freeze({
  low: Object.freeze({ label: "zema", description: "vēl daudz atvērtu virzienu" }),
  medium: Object.freeze({ label: "vidēja", description: "redzama stabila ievirze" }),
  high: Object.freeze({ label: "augsta", description: "atbildes veido skaidru rakstu" }),
});

const formatTraitLabels = (labels) =>
  labels
    .slice(0, 2)
    .map((label) => `“${label}”`)
    .join(" un ");

export const resultTemplates = Object.freeze({
  primaryReason: ({ dimensionLabels, professionTitle }) => {
    const traits = dimensionLabels.length
      ? formatTraitLabels(dimensionLabels)
      : "vairākas līdzsvarotas intereses";
    return `Tavā atbilžu rakstā izceļas ${traits}; tas labi saskan ar virzienu “${professionTitle}”.`;
  },
  secondaryReason: ({ dimensionLabels }) =>
    dimensionLabels.length
      ? `Spēcīgākā sakritība ir ar iezīmēm ${formatTraitLabels(dimensionLabels)}.`
      : "Sakritību veido vairāki nelieli signāli.",
  liveQuestion: ({ current, total, prompt }) =>
    `Jautājums ${current} no ${total}. ${prompt}`,
  liveTieQuestion: ({ current, total, prompt }) =>
    `Precizējošs jautājums ${current} no ${total}. ${prompt}`,
  liveResult: ({ title, score }) =>
    title
      ? `Rezultāts gatavs. Pirmais virziens: ${title}. Atbilstības rādītājs ${score} no 100.`
      : "Rezultāts gatavs. Vairāki virzieni ir līdzvērtīgi.",
});
