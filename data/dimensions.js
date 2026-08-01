export const DIMENSION_GROUPS = Object.freeze({
  riasec: Object.freeze({
    id: "riasec",
    label: "Interešu veids (RIASEC)",
    weight: 0.25,
  }),
  tasks: Object.freeze({
    id: "tasks",
    label: "Uzdevumi un profesionālās intereses",
    weight: 0.55,
  }),
  environment: Object.freeze({
    id: "environment",
    label: "Darba vide un darba stils",
    weight: 0.2,
  }),
});

export const dimensions = Object.freeze({
  realistic: {
    id: "realistic",
    label: "Praktiskais",
    shortLabel: "Praktiska darbošanās",
    group: "riasec",
    description: "Vēlme darboties ar materiāliem, instrumentiem, tehniku un redzamu rezultātu.",
  },
  investigative: {
    id: "investigative",
    label: "Pētnieciskais",
    shortLabel: "Izpēte un analīze",
    group: "riasec",
    description: "Interese noskaidrot cēloņus, analizēt sistēmas un pārbaudīt risinājumus.",
  },
  artistic: {
    id: "artistic",
    label: "Mākslinieciskais",
    shortLabel: "Radošums un forma",
    group: "riasec",
    description: "Vēlme veidot vizuāli, telpiski vai materiāli izteiksmīgus risinājumus.",
  },
  social: {
    id: "social",
    label: "Sociālais",
    shortLabel: "Sadarbība un atbalsts",
    group: "riasec",
    description: "Gatavība sadarboties, skaidrot un palīdzēt kopīgam darbam virzīties uz priekšu.",
  },
  enterprising: {
    id: "enterprising",
    label: "Uzņēmīgais",
    shortLabel: "Iniciatīva un koordinēšana",
    group: "riasec",
    description: "Vēlme uzņemties iniciatīvu, pieņemt lēmumus un koordinēt darbu.",
  },
  conventional: {
    id: "conventional",
    label: "Strukturētais",
    shortLabel: "Kārtība un process",
    group: "riasec",
    description: "Patika pret precīzu secību, pārbaudāmiem datiem un sakārtotu darba gaitu.",
  },
  programming: {
    id: "programming",
    label: "Programmēšana un abstraktā loģika",
    shortLabel: "Programmēšana",
    group: "tasks",
    description: "Algoritmi, programmatūras uzbūve un loģisku risinājumu veidošana.",
  },
  hardwareNetworks: {
    id: "hardwareNetworks",
    label: "Datoru aparatūra un tīkli",
    shortLabel: "Datori un tīkli",
    group: "tasks",
    description: "Datoru komponentes, operētājsistēmas, savienojumi un tīklu darbība.",
  },
  mechanicsDiagnostics: {
    id: "mechanicsDiagnostics",
    label: "Mehānika un diagnostika",
    shortLabel: "Mehānika un diagnostika",
    group: "tasks",
    description: "Mehānismu darbības izpratne, defektu atrašana un tehniskais remonts.",
  },
  metalBodywork: {
    id: "metalBodywork",
    label: "Metāls un virsbūvju atjaunošana",
    shortLabel: "Metāls un virsbūves",
    group: "tasks",
    description: "Metāla formas atjaunošana, savienošana, virsmu sagatavošana un remonts.",
  },
  electricityEnergy: {
    id: "electricityEnergy",
    label: "Elektrība un enerģija",
    shortLabel: "Elektrība un enerģija",
    group: "tasks",
    description: "Elektriskās ķēdes, mērījumi, iekārtu pieslēgšana un enerģijas sistēmas.",
  },
  spatialDrawing: {
    id: "spatialDrawing",
    label: "Telpiskā domāšana un tehniskā rasēšana",
    shortLabel: "Telpa un rasēšana",
    group: "tasks",
    description: "Plānu, rasējumu un 3D formu izpratne, izveide un pārbaude.",
  },
  constructionCoordination: {
    id: "constructionCoordination",
    label: "Būvniecība un procesu koordinēšana",
    shortLabel: "Būvniecības process",
    group: "tasks",
    description: "Būvdarbu secība, materiāli, kvalitātes kontrole un darbu koordinēšana.",
  },
  woodworking: {
    id: "woodworking",
    label: "Kokapstrāde un precīza amatniecība",
    shortLabel: "Kokapstrāde",
    group: "tasks",
    description: "Koka detaļu izgatavošana, savienošana, apstrāde un precīza montāža.",
  },
  textileDesign: {
    id: "textileDesign",
    label: "Tekstils un vizuālais dizains",
    shortLabel: "Tekstils un dizains",
    group: "tasks",
    description: "Audumi, piegrieztnes, šūšana, krāsa, kompozīcija un izstrādājuma tēls.",
  },
  plantProcesses: {
    id: "plantProcesses",
    label: "Augi un dabas procesi",
    shortLabel: "Augi un daba",
    group: "tasks",
    description: "Augu attīstība, augsne, laikapstākļi un audzēšanas procesa novērošana.",
  },
  agriculturalMachinery: {
    id: "agriculturalMachinery",
    label: "Lauksaimniecības tehnika",
    shortLabel: "Lauksaimniecības tehnika",
    group: "tasks",
    description: "Lielas lauksaimniecības mašīnas, to iestatīšana, lietošana un apkope.",
  },
  precisionPatience: {
    id: "precisionPatience",
    label: "Precizitāte un pacietība",
    shortLabel: "Precizitāte un pacietība",
    group: "environment",
    description: "Gatavība rūpīgi mērīt, atkārtot, pārbaudīt un pabeigt detaļas.",
  },
  physicalWork: {
    id: "physicalWork",
    label: "Fizisks darbs",
    shortLabel: "Fiziska darbošanās",
    group: "environment",
    description: "Komforts ar kustīgu, praktisku darbu un ķermeņa iesaisti.",
  },
  outdoorWork: {
    id: "outdoorWork",
    label: "Darbs ārā",
    shortLabel: "Darbs ārā",
    group: "environment",
    description: "Gatavība strādāt mainīgos laikapstākļos un atklātā vidē.",
  },
  teamwork: {
    id: "teamwork",
    label: "Komandas darbs",
    shortLabel: "Komandas darbs",
    group: "environment",
    description: "Patika saskaņot savu darbu ar citiem un kopīgi atbildēt par rezultātu.",
  },
  independentFocus: {
    id: "independentFocus",
    label: "Patstāvīga koncentrēšanās",
    shortLabel: "Patstāvīga koncentrēšanās",
    group: "environment",
    description: "Spēja ilgāk strādāt patstāvīgi un noturēt uzmanību uz vienu uzdevumu.",
  },
});

export const dimensionIds = Object.freeze(Object.keys(dimensions));

export const dimensionsByGroup = Object.freeze(
  Object.fromEntries(
    Object.keys(DIMENSION_GROUPS).map((groupId) => [
      groupId,
      Object.freeze(dimensionIds.filter((id) => dimensions[id].group === groupId)),
    ]),
  ),
);
