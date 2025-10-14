const professions = {
    'apgerbu_dizainera_asistents': {
        title: 'Apģērbu dizainera asistents',
        sector: 'Dizains',
        description: 'Apģērbu dizainera asistents strādā ar audumiem, šūšanu un modeļu izveidi, palīdzot dizaineriem izveidot jaunas kolekcijas.',
        url: 'https://www.vtdt.lv/apgerbu-dizainera-asistents'
    },
    'lauksaimniecibas_mehanizacijas_tehnikis': {
        title: 'Lauksaimniecības mehānizācijas tehniķis',
        sector: 'Lauksaimniecība',
        description: 'Lauksaimniecības mehānizācijas tehniķis strādā ar lauksaimniecības tehniku, nodrošinot tās efektīvu darbību un uzturēšanu.',
        url: 'https://www.vtdt.lv/lauksaimniecibas-mehanizacijas-tehnikis'
    },
    'augkopibas_tehnikis': {
        title: 'Augkopības tehniķis',
        sector: 'Lauksaimniecība',
        description: 'Augkopības tehniķi nodarbojas ar augu audzēšanu, ražas plānošanu un lauksaimniecības tehnoloģiju pielietošanu.',
        url: 'https://www.vtdt.lv/augkopibas-tehnikis'
    },
    'mebelu_galdnieks': {
        title: 'Mēbeļu galdnieks',
        sector: 'Kokapstrāde',
        description: 'Mēbeļu galdnieks rada unikālus mēbeļu izstrādājumus, apvienojot amatniecības prasmes ar mūsdienīgām tehnoloģijām.',
        url: 'https://www.vtdt.lv/mebelu-galdnieks'
    },
    'apdares_darbu_tehnikis': {
        title: 'Apdares darbu tehniķis',
        sector: 'Būvniecība',
        description: 'Apdares darbu tehniķis veic iekšējos un ārējos apdares darbus ēkās, apvienojot precizitāti un radošumu.',
        url: 'https://www.vtdt.lv/apdares-darbu-tehnikis'
    },
    'eku_buvtehnikis': {
        title: 'Ēku būvtehniķis',
        sector: 'Būvniecība',
        description: 'Ēku būvtehniķis strādā pie ēku būvniecības projektiem, koordinējot darbu izpildi un nodrošinot kvalitāti.',
        url: 'https://www.vtdt.lv/eku-buvtehnikis'
    },
    'namdaris': {
        title: 'Namdaris',
        sector: 'Kokapstrāde',
        description: 'Namdaris veido un remontējat koka konstrukcijas, piemēram, mājas karkasus un mēbeles.',
        url: 'https://www.vtdt.lv/namdaris'
    },
    'arhitekturas_tehnikis': {
        title: 'Arhitektūras tehniķis',
        sector: 'Arhitektūra',
        description: 'Arhitektūras tehniķis piedalas ēku plānošanā un projektēšanā, izmantojot gan tehniskās, gan radošās prasmes.',
        url: 'https://www.vtdt.lv/arhitekturas-tehnikis'
    },
    'inzeniersistemu_buvtehnikis': {
        title: 'Inženieristēmu būvtehniķis',
        sector: 'Būvniecība',
        description: 'Inženieristēmu būvtehniķis uzrauga un projektē inženieristēmas ēkās (apkure, ūdensvadi, elektrība).',
        url: 'https://www.vtdt.lv/inzeniersistemu-buvtehnikis'
    },
    'datorsistemu_tehnikis': {
        title: 'Datorsistēmu tehniķis',
        sector: 'IT',
        description: 'Datorsistēmu tehniķis ir atbildīgs par datorsistēmu uzturēšanu, diagnostiku un remontu.',
        url: 'https://www.vtdt.lv/datorsistemu-tehnikis'
    },
    'programmesanas_tehnikis': {
        title: 'Programmēšanas tehniķis',
        sector: 'IT',
        description: 'Programmēšanas tehniķis izstrādā programmatūru un aplikācijas - viena no pieprasītākajām profesijām mūsdienu digitālajā pasaulē.',
        url: 'https://www.vtdt.lv/programmesanas-tehnikis'
    },
    'automehanikis': {
        title: 'Automehāniķis',
        sector: 'Autotransports',
        description: 'Automehāniķi diagnosticē un remontējat automobiļus - profesija, kas vienmēr būs pieprasīta.',
        url: 'https://www.vtdt.lv/automehanikis'
    },
    'autovirsbuvju_remontatsledznieks': {
        title: 'Autovirsbūvju remontatslēdznieks',
        sector: 'Autotransports',
        description: 'Autovirsbūvju remontatslēdznieks specializējas autovirsbūvju remontā un modificēšanā.',
        url: 'https://www.vtdt.lv/autovirsbuvju-remontatsledznieks'
    },
    'elektrotehnikis': {
        title: 'Elektrotehniķis',
        sector: 'Enerģētika',
        description: 'Elektrotehniķis uzstāda, uztur un remontē elektrotehnikas sistēmas gan mājās, gan uzņēmumos.',
        url: 'https://www.vtdt.lv/elektrotehnikis'
    },
    'atjaunojamas_energetikas_tehnikis': {
        title: 'Atjaunojamās enerģētikas tehniķis',
        sector: 'Enerģētika',
        description: 'Atjaunojamās enerģētikas tehniķi strādā pie saules, vēja un citu atjaunojamo enerģijas avotu sistēmām - nākotnes profesija.',
        url: 'https://www.vtdt.lv/atjaunojamas-energetikas-tehnikis'
    }
};


const questionTree = {
    // 1. RINDA - SAKNE
    'root': {
        text: "Vai Tu esi gatavs jauniem izaicinājumiem?",
        yes: 'q2_yes',
        no: 'q2_no'
    },

    // 2. RINDA
    'q2_no': {
        text: "Tev patīk jaunākās tehnoloģijas?",
        yes: 'q3_no_yes',
        no: 'q3_no_no'
    },
    'q2_yes': {
        text: "Tu gribētu dibināt savu mācību uzņēmumu?",
        yes: 'q3_yes_yes',
        no: 'q3_yes_no'
    },

    // 3. RINDA
    'q3_no_no': {
        text: "Tu gribētu dzīvot kopmītnēs?",
        yes: 'q4_no_no_yes',
        no: 'q4_no_no_no'
    },
    'q3_no_yes': {
        text: "Tev patīk strādāt vienatnē?",
        yes: 'q4_no_yes_yes',
        no: 'q4_no_yes_no'
    },
    'q3_yes_no': {
        text: "Tev patīk patstāvīgi pieņemt lēmumus?",
        yes: 'q4_yes_no_yes',
        no: 'q4_yes_no_no'
    },
    'q3_yes_yes': {
        text: "Tev padodas svešvalodas?",
        yes: 'q4_yes_yes_yes',
        no: 'q4_yes_yes_no'
    },

    // 4. RINDA
    'q4_no_no_no': {
        text: "Tev patīk sadarboties ar cilvēkiem?",
        yes: 'q5_no_no_no_yes',
        no: 'q5_no_no_no_no'
    },
    'q4_no_no_yes': {
        text: "Tev patīk gatavot ēst (sev un citiem)?",
        yes: 'q5_no_no_yes_yes',
        no: 'q5_no_no_yes_no'
    },
    'q4_no_yes_no': {
        text: "Tev patīk strādāt ar rokām (veidot, kaut ko izgatavot)?",
        yes: 'q5_no_yes_no_yes',
        no: 'q5_no_yes_no_no'
    },
    'q4_no_yes_yes': {
        text: "Tev patīk izzināt lietas praktiski darbojoties?",
        yes: 'q5_no_yes_yes_yes',
        no: 'q5_no_yes_yes_no'
    },
    'q4_yes_no_no': {
        text: "Tev patīk izdomāt jaunas idejas?",
        yes: 'q5_yes_no_no_yes',
        no: 'q5_yes_no_no_no'
    },
    'q4_yes_no_yes': {
        text: "Tev patīk izdomāt jaunas idejas?",
        yes: 'q5_yes_no_yes_yes',
        no: 'q5_yes_no_yes_no'
    },
    'q4_yes_yes_no': {
        text: "Tev patīk radošs darbs?",
        yes: 'q5_yes_yes_no_yes',
        no: 'q5_yes_yes_no_no'
    },
    'q4_yes_yes_yes': {
        text: "Tev patīk izdomāt jaunas idejas?",
        yes: 'q5_yes_yes_yes_yes',
        no: 'q5_yes_yes_yes_no'
    },

    // 5. RINDA
    'q5_no_no_no_no': {
        text: "Tu vari palīdzēt nepazīstamiem cilvēkiem?",
        yes: 'q6_no_no_no_no_yes',
        no: 'q6_no_no_no_no_no'
    },
    'q5_no_no_no_yes': {
        text: "Vai Tu viegli kontaktējies ar citiem?",
        yes: 'q6_no_no_no_yes_yes',
        no: 'q6_no_no_no_yes_no'
    },
    'q5_no_no_yes_no': {
        text: "Vai Tu viegli kontaktējies ar citiem?",
        yes: 'q6_no_no_yes_no_yes',
        no: 'q6_no_no_yes_no_no'
    },
    'q5_no_yes_no_no': {
        text: "Tev interesē arhitektūra?",
        yes: 'q6_no_yes_no_no_yes',
        no: 'q6_no_yes_no_no_no'
    },
    'q5_no_yes_yes_no': {
        text: "Tev patīk risināt problēmas?",
        yes: 'q6_no_yes_yes_no_yes',
        no: 'q6_no_yes_yes_no_no'
    },
    'q5_no_yes_yes_yes': {
        text: "Tev patīk risināt problēmas?",
        yes: 'q6_no_yes_yes_yes_yes',
        no: 'q6_no_yes_yes_yes_no'
    },
    'q5_yes_no_no_no': {
        text: "Tev patīk radošs darbs?",
        yes: 'q6_yes_no_no_no_yes',
        no: 'q6_yes_no_no_no_no'
    },
    'q5_yes_no_yes_no': {
        text: "Tev patīk analizēt, domāt, izgudrot, eksperimentēt?",
        yes: 'q6_yes_no_yes_no_yes',
        no: 'q6_yes_no_yes_no_no'
    },
    'q5_yes_no_yes_yes': {
        text: "Tev patīk analizēt, domāt, izgudrot, eksperimentēt?",
        yes: 'q6_yes_no_yes_yes_yes',
        no: 'q6_yes_no_yes_yes_no'
    },
    'q5_yes_yes_no_no': {
        text: "Tev patīk radošs darbs?",
        yes: 'q6_yes_yes_no_no_yes',
        no: 'q6_yes_yes_no_no_no'
    },
    'q5_yes_yes_no_yes': {
        text: "Tev patīk strādāt ar audumiem un šūšanu?",
        yes: 'q6_yes_yes_no_yes_yes',
        no: 'q6_yes_yes_no_yes_no'
    },
    'q5_yes_yes_yes_no': {
        text: "Tev patīk radošs darbs?",
        yes: 'q6_yes_yes_yes_no_yes',
        no: 'q6_yes_yes_yes_no_no'
    },
    'q5_yes_yes_yes_yes': {
        text: "Tev patīk radošs darbs?",
        yes: 'q6_yes_yes_yes_yes_yes',
        no: 'q6_yes_yes_yes_yes_no'
    },

    // 6. RINDA
    'q6_no_no_no_no_no': {
        text: "Tev patīk darboties ar lietām, instrumentiem, mašīnām, tehniku?",
        yes: 'q7_no_no_no_no_no_yes',
        no: 'q7_no_no_no_no_no_no'
    },
    'q6_no_no_no_no_yes': {
        text: "Tev patīk darboties ar lietām, instrumentiem, mašīnām, tehniku?",
        yes: 'q7_no_no_no_no_yes_yes',
        no: 'q7_no_no_no_no_yes_no'
    },
    'q6_no_no_no_yes_no': {
        text: "Vai Tev interesē, kā darbojas datorprogrammas?",
        yes: 'q7_no_no_no_yes_no_yes',
        no: 'q7_no_no_no_yes_no_no'
    },
    'q6_no_no_yes_no_no': {
        text: "Vai Tev interesē, kā darbojas datorprogrammas?",
        yes: 'q7_no_no_yes_no_no_yes',
        no: 'q7_no_no_yes_no_no_no'
    },
    'q6_no_yes_no_no_no': {
        text: "Tu būtu gatavs rīkoties ar specializētām datorprogrammām?",
        yes: 'arhitekturas_tehnikis',
        no: 'q7_no_yes_no_no_no_no'
    },
    'q6_no_yes_no_no_yes': {
        text: "Tu būtu gatavs rīkoties ar specializētām datorprogrammām?",
        yes: 'arhitekturas_tehnikis',
        no: 'q7_no_yes_no_no_yes_no'
    },
    'q6_no_yes_yes_no_no': {
        text: "Tev patīk strādāt ar datoru iekārtām?",
        yes: 'q7_no_yes_yes_no_no_yes',
        no: 'q7_labot_lietas'
    },
    'q6_no_yes_yes_no_yes': {
        text: "Tev patīk strādāt ar datoru iekārtām?",
        yes: 'q7_no_yes_yes_no_yes_yes',
        no: 'q7_labot_lietas'
    },
    'q6_no_yes_yes_yes_no': {
        text: "Tev patīk strādāt ar datoru iekārtām?",
        yes: 'q7_no_yes_yes_yes_no_yes',
        no: 'q7_labot_lietas'
    },
    'q6_no_yes_yes_yes_yes': {
        text: "Tev patīk strādāt ar datoru iekārtām?",
        yes: 'q7_no_yes_yes_yes_yes_yes',
        no: 'q7_labot_lietas'
    },
    'q6_yes_no_no_no_no': {
        text: "Vai tev patīk strādāt iekštelpās?",
        yes: 'eku_buvtehnikis',
        no: 'q7_yes_no_no_no_no_no'
    },
    'q6_yes_no_no_no_yes': {
        text: "Vai tev patīk strādāt iekštelpās?",
        yes: 'eku_buvtehnikis',
        no: 'q7_yes_no_no_no_yes_no'
    },
    'q6_yes_no_yes_no_no': {
        text: "Vai tev patīk strādāt iekštelpās?",
        yes: 'eku_buvtehnikis',
        no: 'q7_yes_no_yes_no_no_no'
    },
    'q6_yes_no_yes_no_yes': {
        text: "Vai tev patīk strādāt iekštelpās?",
        yes: 'eku_buvtehnikis',
        no: 'q7_yes_no_yes_no_yes_no'
    },
    'q6_yes_no_yes_yes_no': {
        text: "Vai tev patīk strādāt iekštelpās?",
        yes: 'eku_buvtehnikis',
        no: 'q7_yes_no_yes_yes_no_no'
    },
    'q6_yes_no_yes_yes_yes': {
        text: "Vai tev patīk strādāt iekštelpās?",
        yes: 'eku_buvtehnikis',
        no: 'q7_yes_no_yes_yes_yes_no'
    },
    'q6_yes_yes_no_no_no': {
        text: "Vai tev patīk ilgi meistarojot kaut ko darīt?",
        yes: 'mebelu_galdnieks',
        no: 'apdares_darbu_tehnikis'
    },
    'q6_yes_yes_no_no_yes': {
        text: "Vai tev patīk ilgi meistarojot kaut ko darīt?",
        yes: 'mebelu_galdnieks',
        no: 'apdares_darbu_tehnikis'
    },
    'q6_yes_yes_no_yes_no': {
        text: "Vai tev patīk ilgi meistarojot kaut ko darīt?",
        yes: 'mebelu_galdnieks',
        no: 'apdares_darbu_tehnikis'
    },
    'q6_yes_yes_no_yes_yes': {
        text: "Tev patīk izveidot modeļus vai prototipus?",
        yes: 'apgerbu_dizainera_asistents',
        no: 'q7_ilgi_meistarojot'
    },
    'q6_yes_yes_yes_no_no': {
        text: "Vai tev patīk ilgi meistarojot kaut ko darīt?",
        yes: 'mebelu_galdnieks',
        no: 'apdares_darbu_tehnikis'
    },
    'q6_yes_yes_yes_no_yes': {
        text: "Vai tev patīk ilgi meistarojot kaut ko darīt?",
        yes: 'mebelu_galdnieks',
        no: 'apdares_darbu_tehnikis'
    },
    'q6_yes_yes_yes_yes_no': {
        text: "Vai tev patīk ilgi meistarojot kaut ko darīt?",
        yes: 'mebelu_galdnieks',
        no: 'apdares_darbu_tehnikis'
    },
    'q6_yes_yes_yes_yes_yes': {
        text: "Vai tev patīk ilgi meistarojot kaut ko darīt?",
        yes: 'mebelu_galdnieks',
        no: 'apdares_darbu_tehnikis'
    },

    // 7. RINDA - LABOTIE MEZGLI
    'q7_labot_lietas': {
        text: "Tev patīk labot lietas?",
        yes: 'q8_mehaniskas_ierices',
        no: 'q8_elektroniskas_ierices'
    },
    'q7_ilgi_meistarojot': {
        text: "Vai tev patīk ilgi meistarojot kaut ko darīt?",
        yes: 'mebelu_galdnieks',
        no: 'apdares_darbu_tehnikis'
    },

    'q7_no_no_no_no_no_yes': {
        text: "Tev patīk elektronika?",
        yes: 'q8_no_no_no_no_no_yes_yes',
        no: 'q8_no_no_no_no_no_yes_no'
    },
    'q7_no_no_no_no_no_no': {
        text: "Tev patīk strādāt ārā?",
        yes: 'q8_no_no_no_no_no_no_yes',
        no: 'q8_no_no_no_no_no_no_no'
    },
    'q7_no_no_no_no_yes_yes': {
        text: "Tev patīk elektronika?",
        yes: 'q8_no_no_no_no_yes_yes_yes',
        no: 'q8_no_no_no_no_yes_yes_no'
    },
    'q7_no_no_no_no_yes_no': {
        text: "Tev patīk strādāt ārā?",
        yes: 'q8_no_no_no_no_yes_no_yes',
        no: 'q8_no_no_no_no_yes_no_no'
    },
    'q7_no_no_no_yes_no_yes': {
        text: "Tev patīk strādāt ar programmēšanas valodām?",
        yes: 'programmesanas_tehnikis',
        no: 'datorsistemu_tehnikis'
    },
    'q7_no_no_no_yes_no_no': {
        text: "Tev patīk strādāt ar programmēšanas valodām?",
        yes: 'programmesanas_tehnikis',
        no: 'datorsistemu_tehnikis'
    },
    'q7_no_no_yes_no_no_yes': {
        text: "Tev patīk strādāt ar programmēšanas valodām?",
        yes: 'programmesanas_tehnikis',
        no: 'datorsistemu_tehnikis'
    },
    'q7_no_no_yes_no_no_no': {
        text: "Tev patīk strādāt ar programmēšanas valodām?",
        yes: 'programmesanas_tehnikis',
        no: 'datorsistemu_tehnikis'
    },
    'q7_no_yes_no_no_no_no': {
        text: "Tev patīk veidot programmas vai datorspēles?",
        yes: 'programmesanas_tehnikis',
        no: 'datorsistemu_tehnikis'
    },
    'q7_no_yes_no_no_yes_no': {
        text: "Tev patīk veidot programmas vai datorspēles?",
        yes: 'programmesanas_tehnikis',
        no: 'datorsistemu_tehnikis'
    },
    'q7_no_yes_yes_no_no_yes': {
        text: "Tev patīk veidot programmas vai datorspēles?",
        yes: 'programmesanas_tehnikis',
        no: 'datorsistemu_tehnikis'
    },
    'q7_no_yes_yes_no_no_no': {
        text: "Tev patīk veidot programmas vai datorspēles?",
        yes: 'programmesanas_tehnikis',
        no: 'datorsistemu_tehnikis'
    },
    'q7_no_yes_yes_no_yes_yes': {
        text: "Tev patīk veidot programmas vai datorspēles?",
        yes: 'programmesanas_tehnikis',
        no: 'datorsistemu_tehnikis'
    },
    'q7_no_yes_yes_no_yes_no': {
        text: "Tev patīk veidot programmas vai datorspēles?",
        yes: 'programmesanas_tehnikis',
        no: 'datorsistemu_tehnikis'
    },
    'q7_no_yes_yes_yes_no_yes': {
        text: "Tev patīk veidot programmas vai datorspēles?",
        yes: 'programmesanas_tehnikis',
        no: 'datorsistemu_tehnikis'
    },
    'q7_no_yes_yes_yes_no_no': {
        text: "Tev patīk veidot programmas vai datorspēles?",
        yes: 'programmesanas_tehnikis',
        no: 'datorsistemu_tehnikis'
    },
    'q7_no_yes_yes_yes_yes_yes': {
        text: "Tev patīk veidot programmas vai datorspēles?",
        yes: 'programmesanas_tehnikis',
        no: 'datorsistemu_tehnikis'
    },
    'q7_no_yes_yes_yes_yes_no': {
        text: "Tev patīk veidot programmas vai datorspēles?",
        yes: 'programmesanas_tehnikis',
        no: 'datorsistemu_tehnikis'
    },
    'q7_yes_no_no_no_no_no': {
        text: "Vai tev patīk kautko veidot no kokmateriāliem?",
        yes: 'namdaris',
        no: 'apdares_darbu_tehnikis'
    },
    'q7_yes_no_no_no_yes_no': {
        text: "Vai tev patīk kautko veidot no kokmateriāliem?",
        yes: 'namdaris',
        no: 'apdares_darbu_tehnikis'
    },
    'q7_yes_no_yes_no_no_no': {
        text: "Vai tev patīk kautko veidot no kokmateriāliem?",
        yes: 'namdaris',
        no: 'apdares_darbu_tehnikis'
    },
    'q7_yes_no_yes_no_yes_no': {
        text: "Vai tev patīk kautko veidot no kokmateriāliem?",
        yes: 'namdaris',
        no: 'apdares_darbu_tehnikis'
    },
    'q7_yes_no_yes_yes_no_no': {
        text: "Vai tev patīk kautko veidot no kokmateriāliem?",
        yes: 'namdaris',
        no: 'apdares_darbu_tehnikis'
    },
    'q7_yes_no_yes_yes_yes_no': {
        text: "Vai tev patīk kautko veidot no kokmateriāliem?",
        yes: 'namdaris',
        no: 'apdares_darbu_tehnikis'
    },

    // 8. RINDA
    'q8_mehaniskas_ierices': {
        text: "Vai Tev patīk restaurēt, mopēdus vai mašīnas?",
        yes: 'autovirsbuvju_remontatsledznieks',
        no: 'automehanikis'
    },
    'q8_elektroniskas_ierices': {
        text: "Tev patīk elektronika?",
        yes: 'elektrotehnikis',
        no: 'atjaunojamas_energetikas_tehnikis'
    },

    'q8_no_no_no_no_no_yes_yes': {
        text: "Tev patīk strādāt ar sistēmām (ūdens, gāze, elektrība)?",
        yes: 'inzeniersistemu_buvtehnikis',
        no: 'q9_no_no_no_no_no_yes_yes_no'
    },
    'q8_no_no_no_no_no_yes_no': {
        text: "Tev interesē atjaunojamā enerģija?",
        yes: 'atjaunojamas_energetikas_tehnikis',
        no: 'q9_no_no_no_no_no_yes_no_no'
    },
    'q8_no_no_no_no_no_no_yes': {
        text: "Tev patīk lielas lauksaimniecības mašīnas?",
        yes: 'lauksaimniecibas_mehanizacijas_tehnikis',
        no: 'q9_no_no_no_no_no_no_yes_no'
    },
    'q8_no_no_no_no_no_no_no': {
        text: "Tev patīk lielas lauksaimniecības mašīnas?",
        yes: 'lauksaimniecibas_mehanizacijas_tehnikis',
        no: 'augkopibas_tehnikis'
    },
    'q8_no_no_no_no_yes_yes_yes': {
        text: "Tev patīk strādāt ar sistēmām (ūdens, gāze, elektrība)?",
        yes: 'inzeniersistemu_buvtehnikis',
        no: 'q9_no_no_no_no_yes_yes_yes_no'
    },
    'q8_no_no_no_no_yes_yes_no': {
        text: "Tev interesē atjaunojamā enerģija?",
        yes: 'atjaunojamas_energetikas_tehnikis',
        no: 'q9_no_no_no_no_yes_yes_no_no'
    },
    'q8_no_no_no_no_yes_no_yes': {
        text: "Tev patīk lielas lauksaimniecības mašīnas?",
        yes: 'lauksaimniecibas_mehanizacijas_tehnikis',
        no: 'augkopibas_tehnikis'
    },
    'q8_no_no_no_no_yes_no_no': {
        text: "Tev patīk lielas lauksaimniecības mašīnas?",
        yes: 'lauksaimniecibas_mehanizacijas_tehnikis',
        no: 'augkopibas_tehnikis'
    },

    // 9. RINDA
    'q9_no_no_no_no_no_yes_yes_no': {
        text: "Tev patīk detalizēti rasēt, precīzi ko nomērīt?",
        yes: 'q10_no_no_no_no_no_yes_yes_no_yes',
        no: 'augkopibas_tehnikis'
    },
    'q9_no_no_no_no_no_yes_no_no': {
        text: "Tev patīk detalizēti rasēt, precīzi ko nomērīt?",
        yes: 'q10_no_no_no_no_no_yes_no_no_yes',
        no: 'augkopibas_tehnikis'
    },
    'q9_no_no_no_no_no_no_yes_no': {
        text: "Tev patīk detalizēti rasēt, precīzi ko nomērīt?",
        yes: 'q10_no_no_no_no_no_no_yes_no_yes',
        no: 'augkopibas_tehnikis'
    },
    'q9_no_no_no_no_yes_yes_yes_no': {
        text: "Tev patīk detalizēti rasēt, precīzi ko nomērīt?",
        yes: 'q10_no_no_no_no_yes_yes_yes_no_yes',
        no: 'augkopibas_tehnikis'
    },
    'q9_no_no_no_no_yes_yes_no_no': {
        text: "Tev patīk detalizēti rasēt, precīzi ko nomērīt?",
        yes: 'q10_no_no_no_no_yes_yes_no_no_yes',
        no: 'augkopibas_tehnikis'
    },

    // 10. RINDA
    'q10_no_no_no_no_no_yes_yes_no_yes': {
        text: "Tev patīk nodarboties ar koku?",
        yes: 'q11_no_no_no_no_no_yes_yes_no_yes_yes',
        no: 'q11_no_no_no_no_no_yes_yes_no_yes_no'
    },
    'q10_no_no_no_no_no_yes_no_no_yes': {
        text: "Tev patīk nodarboties ar koku?",
        yes: 'q11_no_no_no_no_no_yes_no_no_yes_yes',
        no: 'q11_no_no_no_no_no_yes_no_no_yes_no'
    },
    'q10_no_no_no_no_no_no_yes_no_yes': {
        text: "Tev patīk nodarboties ar koku?",
        yes: 'q11_no_no_no_no_no_no_yes_no_yes_yes',
        no: 'q11_no_no_no_no_no_no_yes_no_yes_no'
    },
    'q10_no_no_no_no_yes_yes_yes_no_yes': {
        text: "Tev patīk nodarboties ar koku?",
        yes: 'q11_no_no_no_no_yes_yes_yes_no_yes_yes',
        no: 'q11_no_no_no_no_yes_yes_yes_no_yes_no'
    },
    'q10_no_no_no_no_yes_yes_no_no_yes': {
        text: "Tev patīk nodarboties ar koku?",
        yes: 'q11_no_no_no_no_yes_yes_no_no_yes_yes',
        no: 'q11_no_no_no_no_yes_yes_no_no_yes_no'
    },

    // 11. RINDA
    'q11_no_no_no_no_no_yes_yes_no_yes_yes': {
        text: "Tev patīk rīkoties ar dzelžiem?",
        yes: 'eku_buvtehnikis',
        no: 'namdaris'
    },
    'q11_no_no_no_no_no_yes_yes_no_yes_no': {
        text: "Tev interesē veidot 3D modeļus?",
        yes: 'arhitekturas_tehnikis',
        no: 'elektrotehnikis'
    },
    'q11_no_no_no_no_no_yes_no_no_yes_yes': {
        text: "Tev patīk rīkoties ar dzelžiem?",
        yes: 'eku_buvtehnikis',
        no: 'namdaris'
    },
    'q11_no_no_no_no_no_yes_no_no_yes_no': {
        text: "Tev interesē veidot 3D modeļus?",
        yes: 'arhitekturas_tehnikis',
        no: 'elektrotehnikis'
    },
    'q11_no_no_no_no_no_no_yes_no_yes_yes': {
        text: "Tev patīk rīkoties ar dzelžiem?",
        yes: 'eku_buvtehnikis',
        no: 'namdaris'
    },
    'q11_no_no_no_no_no_no_yes_no_yes_no': {
        text: "Tev interesē veidot 3D modeļus?",
        yes: 'arhitekturas_tehnikis',
        no: 'elektrotehnikis'
    },
    'q11_no_no_no_no_yes_yes_yes_no_yes_yes': {
        text: "Tev patīk rīkoties ar dzelžiem?",
        yes: 'eku_buvtehnikis',
        no: 'namdaris'
    },
    'q11_no_no_no_no_yes_yes_yes_no_yes_no': {
        text: "Tev interesē veidot 3D modeļus?",
        yes: 'arhitekturas_tehnikis',
        no: 'elektrotehnikis'
    },
    'q11_no_no_no_no_yes_yes_no_no_yes_yes': {
        text: "Tev patīk rīkoties ar dzelžiem?",
        yes: 'eku_buvtehnikis',
        no: 'namdaris'
    },
    'q11_no_no_no_no_yes_yes_no_no_yes_no': {
        text: "Tev interesē veidot 3D modeļus?",
        yes: 'arhitekturas_tehnikis',
        no: 'elektrotehnikis'
    }
};

// Mainīgie testa vadīšanai
let currentQuestionId = "root";
let answeredQuestions = 0;
let answerPath = [];
const maxQuestions = 25; // Palielināts, lai ietilptu visi iespējamie maršruti

// Funkcijas
function startQuiz() {
    currentQuestionId = "root";
    answeredQuestions = 0;
    answerPath = [];
    showQuestion(currentQuestionId);
    updateTreeVisualization();
    /*
    document.getElementById("treeVisualization").style.display = "block";
    document.getElementById("treeOutput").style.display = "block";
    */
}

function showQuestion(questionId) {
    const question = questionTree[questionId];
    const container = document.getElementById('question-container');

    updateProgress();

    if (professions[questionId]) {
        showResult(questionId);
        return;
    }

    if (!question) {
        const profession = findProfessionByBacktracking();
        showResult(profession);
        return;
    }

    // Tīrām container saturu un pievienojam jautājumu + opcijas
    container.innerHTML = `
        <div class="question active">
            <h2>${question.text}</h2>
            <div class="options">
                <div class="option option-no" onclick="answerQuestion('${questionId}', 'no')">Nē</div>
                <div class="option option-yes" onclick="answerQuestion('${questionId}', 'yes')">Jā</div>
            </div>
        </div>
    `;

    // Rādām vai slēpam back pogu
    const backButton = document.getElementById("backButton");
    backButton.style.display = currentQuestionId === "root" ? "none" : "block";

    document.getElementById('start').classList.remove('active');
}



function answerQuestion(questionId, answer) {
    const question = questionTree[questionId];
    answeredQuestions++;
    answerPath.push({question: questionId, answer: answer});
    
    const nextQuestionId = question[answer];
    
    // Pārbauda, vai nākamais solis ir profesija
    if (professions[nextQuestionId]) {
        showResult(nextQuestionId);
    } else if (answeredQuestions >= maxQuestions) {
        // Ja sasniegts maksimālais jautājumu skaits
        const profession = findProfessionByBacktracking();
        showResult(profession);
    } else {
        currentQuestionId = nextQuestionId;
        showQuestion(nextQuestionId);
    }
    
    updateTreeVisualization();
}

function findProfessionByBacktracking() {
    // Meklējam pēdējo zināmo jautājumu un mēģinām atrast tuvāko profesiju
    for (let i = answerPath.length - 1; i >= 0; i--) {
        const path = answerPath[i];
        const question = questionTree[path.question];
        
        if (question) {
            // Pārbaudām abus iespējamos turpinājumus
            if (professions[question.yes]) return question.yes;
            if (professions[question.no]) return question.no;
        }
    }
    
    // Ja neko nevar atrast, atgriežam noklusējuma profesiju
    return 'programmesanas_tehnikis';
}

function showResult(professionKey) {
    const profession = professions[professionKey];

    document.getElementById('question-container').innerHTML = '';
    document.getElementById('result').classList.add('active');
    document.getElementById('professionCard').innerHTML = `
        <h3>${profession.title}</h3>
        <p><strong>Nozare:</strong> ${profession.sector}</p>
        <p class="small-gap">${profession.description}</p>
        <p class="small-gap"><strong>Skatīt profesiju:</strong> <a class="url" href="${profession.url}" target="_blank">VTDT lapa</a></p>
    `;

    document.getElementById('progressBar').style.width = '100%';
    /*
    document.getElementById('treeVisualization').style.display = 'block';
    document.getElementById('treeOutput').style.display = 'block';
    */

    // Paslēpt back pogu rezultātu lapā
    document.getElementById('backButton').style.display = 'none';
}


function updateProgress() {
    const progress = (answeredQuestions / maxQuestions) * 100;
    document.getElementById('progressBar').style.width = Math.min(progress, 100) + '%';
}

function updateTreeVisualization() {
    let tree = "Root (Vai Tu esi gatavs jauniem izaicinājumem?)\n";
    let depth = 1;
    
    for (const answer of answerPath) {
        const indent = "  ".repeat(depth);
        const arrow = answer.answer === 'yes' ? '→' : '←';
        const questionText = questionTree[answer.question]?.text || "Profesija";
        tree += `${indent}${arrow} ${questionText.substring(0, 40)}${questionText.length > 40 ? '...' : ''}\n`;
        depth++;
    }
    
    document.getElementById('treeOutput').textContent = tree;
}

function goBack() {
    if (answerPath.length === 0) {
        restartQuiz(); // atpakaļ uz startu
        return;
    }

    // Noņem pēdējo atbildi
    answerPath.pop();
    answeredQuestions--;

    // Iepriekšējā jautājuma ID
    currentQuestionId = answerPath.length === 0 ? "root" : answerPath[answerPath.length - 1].question;

    showQuestion(currentQuestionId);
    updateTreeVisualization();
    document.getElementById('result').classList.remove('active');
}

function restartQuiz() {
    document.getElementById('result').classList.remove('active');
    document.getElementById('start').classList.add('active');
    document.getElementById('question-container').innerHTML = '';
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('treeVisualization').style.display = 'none';
    document.getElementById("treeOutput").style.display = "none";
    answeredQuestions = 0;
    answerPath = [];
}