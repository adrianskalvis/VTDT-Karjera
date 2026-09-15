# VTDT karjeras tests

## Īsa dokumentācija pašpārvaldei un vadībai

**Sagatavots:** 2026. gada 15. septembrī  
**Vietne:** https://vtdt-karjeras-tests.vercel.app  
**Oficiālais profesiju avots:** https://www.vtdt.lv/profesijas

## Kas ir šis rīks

VTDT karjeras tests ir īss tīmekļa rīks 9. un 10. klašu jauniešiem. Tas palīdz sākt sarunu par profesiju izvēli un parāda trīs VTDT virzienus, ko būtu vērts iepazīt tālāk.

Tests nepasaka vienīgo pareizo izvēli un neaizstāj sarunu ar pedagogu, karjeras konsultantu vai profesijas praktisku iepazīšanu. Tas dod saprotamu sākumpunktu.

## Kāds ir jaunieša maršruts

1. Sākumā jaunietis izvēlas ātro vai padziļināto testa režīmu.
2. Viņš atbild uz jautājumiem ar vienu kopīgu skalu: Jā, Drīzāk jā, Drīzāk nē vai Nē.
3. Atbildes izveido 22 dimensiju profilu, kas apraksta intereses, uzdevumus un darba stilu.
4. Profils tiek salīdzināts ar 13 aktuālajām VTDT profesijām.
5. Ja tuvākie rezultāti ir pārāk līdzīgi vai kādā jomā trūkst informācijas, tests uzdod īsu precizējošu jautājumu.
6. Beigās redzams Top 3, kopīga pirmā vieta vai vairāki plaši virzieni, ja atbildēs nav pietiekami skaidra signāla.

## Kā strādā loģika aiz ekrāna

Katra atbilde vispirms ietekmē dimensijas, nevis konkrētu profesiju. Tāpēc viena atbilde nevar uzreiz piešķirt vienu amatu.

| Profila daļa | Ko tā apraksta | Ietekme gala rādītājā |
|---|---|---:|
| Interešu veids | Praktiska darbošanās, izpēte, radošums, sadarbība, iniciatīva un kārtība | 25% |
| Uzdevumi un intereses | Programmēšana, datori, mehānika, elektrība, būvniecība, kokapstrāde, dizains, augi un lauksaimniecības tehnika | 55% |
| Darba vide un stils | Precizitāte, fiziska darbošanās, darbs ārā, komandas darbs un patstāvīga koncentrēšanās | 20% |

Pēc tam šis profils tiek salīdzināts ar katras profesijas profilu. Rīks izmanto atbilstības rādītāju skalā no 0 līdz 100. Tas nav varbūtības procents un nav psiholoģiska diagnoze.

## Profesiju struktūra

Tests pašlaik izmanto 13 profesijas septiņās nozarēs.

| Nozare | Profesijas |
|---|---|
| Autotransports | Automehāniķis; Autovirsbūvju remonta tehniķis |
| Būvniecība | Apdares darbu tehniķis; Arhitektūras tehniķis; Ēku būvtehniķis; Namdaris |
| Dizains | Apģērbu dizainera asistents |
| Enerģētika | Elektrotehniķis |
| Informācijas un komunikācijas tehnoloģijas | Datorsistēmu tehniķis; Programmēšanas tehniķis |
| Kokapstrāde | Mēbeļu galdnieks |
| Lauksaimniecība | Augkopības tehniķis; Lauksaimniecības mehanizācijas tehniķis |

Profesijas ir gala salīdzinājuma punkti. Savienojums starp jautājumu un profesiju notiek caur 22 dimensijām.

## Pārbaudīts maršruts dzīvajā vietnē

Ātrajā režīmā tika iziets viens pilns piemērs ar 10 pamata atbildēm. Vietne pēc tam uzdeva vienu precizējošu jautājumu un parādīja rezultātu.

| Solis | Ko redzējām vietnē |
|---:|---|
| 1 | Sākums un izvēle Ātrais tests |
| 2 | 10 pamata jautājumi ar progresa joslu Atbildēti 10 no 10 |
| 3 | Viens precizējošs jautājums par elektrisku shēmu mērīšanu un mehānisku detaļu remontu |
| 4 | Rezultāts Elektrotehniķis ar atbilstības rādītāju 63,8 no 100 |
| 5 | Rezultātā redzamas divas spēcīgākās iezīmes, profesijas darba apraksts un saite uz VTDT katalogu |

Šis maršruts tika pārbaudīts Vercel publicētajā vietnē 2026. gada 15. septembrī.

## Kā vietni atjaunina

Jautājumi, dimensijas, profesiju profili un redzamie teksti glabājas projekta GitHub repozitorijā. Pēc satura izmaiņām tiek pārbaudīta testa darbība, atjaunota shēma un izmaiņas publicējas Vercel vietnē no repozitorijas galvenā zara.

Svarīgākais atjaunināšanas princips ir saglabāt vienādu secību: vispirms izmaina avota datus, pēc tam pārbauda testu un tikai tad publicē jauno versiju.

## Ko ir vērts atcerēties

- Tests palīdz sākt profesiju izpēti, bet gala izvēli jaunietis izdara pats.
- Rezultātu ieteicams pārrunāt ar pedagogu, karjeras konsultantu vai ģimeni.
- Pirms svarīgām modeļa izmaiņām būtu vērtīgs izmēģinājums ar īstiem 9. un 10. klašu skolēniem.
