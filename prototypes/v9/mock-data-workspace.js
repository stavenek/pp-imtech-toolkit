// Mock data for workspace prototype (references DB from mock-data.js)
const WS = {
  bestContributions: [
    // Alpha (3 best contributions)
    { id:'bc1', teamId:'alpha', title:'Förbättra kundkommunikation', startingPointText:'Vi har idag långa svarstider på kundärenden och bristande struktur i vår externa kommunikation. Kunder upplever att det är svårt att nå rätt person.', desiredStateText:'Alla kundärenden besvaras inom 4 timmar. Kommunikationen är tydlig, konsekvent och professionell i alla kanaler.', completionPct:55, archived:false, archivedDate:null, areaOfImprovement:[
      { id:'ai1', title:'Digitala kanaler', archived:false },
      { id:'ai2', title:'Inget förbättringsområde', archived:false }
    ]},
    { id:'bc2', teamId:'alpha', title:'Öka processeffektivitet', startingPointText:'Många manuella steg i våra arbetsflöden som tar tid och skapar fel. Rapporter genereras manuellt varje månad.', desiredStateText:'Automatiserade processer för alla återkommande arbetsuppgifter. Rapporter genereras automatiskt och distribueras till rätt mottagare.', completionPct:72, archived:false, archivedDate:null, areaOfImprovement:[
      { id:'ai3', title:'Automatisering', archived:false },
      { id:'ai4', title:'Dokumentation', archived:false },
      { id:'ai5', title:'Inget förbättringsområde', archived:false }
    ]},
    { id:'bc3', teamId:'alpha', title:'Stärka teamsamarbetet', startingPointText:'Teammedlemmar arbetar ofta i silos utan tillräcklig insyn i varandras arbete. Möten saknar struktur.', desiredStateText:'Ett team som kommunicerar öppet, delar kunskap dagligen och stöttar varandra aktivt. Strukturerade möten med tydliga agendor.', completionPct:35, archived:false, archivedDate:null, areaOfImprovement:[
      { id:'ai6', title:'Kommunikation', archived:false },
      { id:'ai7', title:'Inget förbättringsområde', archived:false }
    ]},
    // Beta (3 best contributions)
    { id:'bc4', teamId:'beta', title:'Produktutveckling Q1', startingPointText:'Vår produktkatalog behöver moderniseras. Användargränssnittet är föråldrat och sökfunktionen ger irrelevanta resultat.', desiredStateText:'En modern produktkatalog med snabb och relevant sökning, tilltalande design och smidig användarupplevelse.', completionPct:60, archived:false, archivedDate:null, areaOfImprovement:[
      { id:'ai8', title:'Funktionalitet', archived:false },
      { id:'ai9', title:'Inget förbättringsområde', archived:false }
    ]},
    { id:'bc10', teamId:'beta', title:'Förbättra testtäckning', startingPointText:'Testtäckningen ligger på 45% och regressionsbuggar upptäcks först vid manuell testning. Vi saknar end-to-end-tester helt.', desiredStateText:'Testtäckning över 80% med automatiserade enhets-, integrations- och end-to-end-tester som körs vid varje commit.', completionPct:30, archived:false, archivedDate:null, areaOfImprovement:[
      { id:'ai20', title:'Automatiserade tester', archived:false },
      { id:'ai21', title:'Regressionstester', archived:false },
      { id:'ai22', title:'Inget förbättringsområde', archived:false }
    ]},
    { id:'bc11', teamId:'beta', title:'Snabbare releaser', startingPointText:'Byggtiden är 12 minuter och releaseprocessen kräver manuella steg. Vi kan bara göra release varannan vecka.', desiredStateText:'Byggtid under 5 minuter med helt automatiserad CI/CD-pipeline. Möjlighet att releasa dagligen med feature flags.', completionPct:68, archived:false, archivedDate:null, areaOfImprovement:[
      { id:'ai23', title:'CI/CD-pipeline', archived:false },
      { id:'ai24', title:'Inget förbättringsområde', archived:false }
    ]},
    // Gamma (2 best contributions)
    { id:'bc5', teamId:'gamma', title:'Förbättra logistikflödet', startingPointText:'Genomsnittlig leveranstid är 120 timmar. Lagerpersonal saknar utbildning i det nya systemet och kommunikationen med transportörer är bristfällig.', desiredStateText:'Leveranstid under 48 timmar med full spårbarhet. Lagerpersonal är fullt utbildade och kommunikationen med transportörer är digital och automatiserad.', completionPct:40, archived:false, archivedDate:null, areaOfImprovement:[
      { id:'ai10', title:'Leveranstider', archived:false },
      { id:'ai11', title:'Inget förbättringsområde', archived:false }
    ]},
    { id:'bc6', teamId:'gamma', title:'Kundnöjdhet 2026', startingPointText:'NPS-score ligger på 35 och vi saknar systematisk uppföljning av kundfeedback. Klagomål hanteras reaktivt.', desiredStateText:'NPS-score över 70 genom proaktiv kundkontakt, snabb hantering av klagomål och regelbunden uppföljning via digitala formulär.', completionPct:45, archived:false, archivedDate:null, areaOfImprovement:[
      { id:'ai12', title:'Kommunikation', archived:false },
      { id:'ai13', title:'Inget förbättringsområde', archived:false }
    ]},
    // Stöd (2 best contributions)
    { id:'bc12', teamId:'stod', title:'Förbättra intern support', startingPointText:'Kollegor vet inte vem de ska kontakta vid problem. Supportprocesser är odokumenterade och svarstider varierar kraftigt.', desiredStateText:'Tydliga supportprocesser med dokumenterade flöden. Alla ärenden besvaras inom 4 timmar. Sökbar kunskapsbas tillgänglig för alla.', completionPct:38, archived:false, archivedDate:null, areaOfImprovement:[
      { id:'ai25', title:'Processer', archived:false },
      { id:'ai26', title:'Dokumentation', archived:false },
      { id:'ai27', title:'Inget förbättringsområde', archived:false }
    ]},
    { id:'bc13', teamId:'stod', title:'Kunskapsdelning', startingPointText:'Utbildningsinsatser sker sporadiskt och utan plan. Kompetensen är ojämnt fördelad i teamet.', desiredStateText:'Strukturerat utbildningsprogram med minst 20 timmar per person och kvartal. Alla har tillgång till relevant kompetensutveckling.', completionPct:22, archived:false, archivedDate:null, areaOfImprovement:[
      { id:'ai28', title:'Utbildningar', archived:false },
      { id:'ai29', title:'Inget förbättringsområde', archived:false }
    ]},
    // Utv (2 best contributions)
    { id:'bc7', teamId:'utv', title:'Modernisera teknikstack', startingPointText:'Vi kör fortfarande on-prem-servrar med manuell deploy. Infrastrukturen är dyr att underhålla och skapar flaskhalsar.', desiredStateText:'All infrastruktur i molnet med automatiserad CI/CD. Deploy-frekvens minst 5 gånger per vecka med noll nedtid.', completionPct:25, archived:false, archivedDate:null, areaOfImprovement:[
      { id:'ai14', title:'Infrastruktur', archived:false },
      { id:'ai15', title:'Inget förbättringsområde', archived:false }
    ]},
    { id:'bc14', teamId:'utv', title:'Förbättra kodkvalitet', startingPointText:'Saknar gemensamma kodstandarder. Code reviews görs sällan och tar lång tid. Inkonsekvent kodstil skapar förvirring.', desiredStateText:'Obligatorisk code review inom 2 timmar. Gemensam kodstilguide som alla följer. Automatiserade linters och formatters.', completionPct:58, archived:false, archivedDate:null, areaOfImprovement:[
      { id:'ai30', title:'Code review', archived:false },
      { id:'ai31', title:'Kodstandarder', archived:false },
      { id:'ai32', title:'Inget förbättringsområde', archived:false }
    ]},
    // Support (2 best contributions)
    { id:'bc8', teamId:'support', title:'Minska svarstider', startingPointText:'Genomsnittlig svarstid ligger på 24+ timmar. Ärenden saknar prioritering och hanteras i den ordning de kommer in.', desiredStateText:'Svarstid under 4 timmar med automatiserad prioritering baserad på allvarlighetsgrad. Automatisk kvittens till kund.', completionPct:50, archived:false, archivedDate:null, areaOfImprovement:[
      { id:'ai16', title:'Ärendehantering', archived:false },
      { id:'ai17', title:'Inget förbättringsområde', archived:false }
    ]},
    { id:'bc15', teamId:'support', title:'Öka kundnöjdheten', startingPointText:'NPS-score är 30. Kunder upplever att de inte får tillräcklig uppföljning och att kommunikationen är opersonlig.', desiredStateText:'NPS-score över 70 genom personlig kommunikation, proaktiv uppföljning och snabb ärendehantering. Alla kunder ska känna sig sedda.', completionPct:32, archived:false, archivedDate:null, areaOfImprovement:[
      { id:'ai33', title:'Kommunikation', archived:false },
      { id:'ai34', title:'Uppföljning', archived:false },
      { id:'ai35', title:'Inget förbättringsområde', archived:false }
    ]},
    // ARCHIVED best contributions
    { id:'bc20', teamId:'alpha', title:'Införa ny CRM-plattform', startingPointText:'Vi använder ett föråldrat CRM-system som inte stödjer moderna integreringar. Data är svår att exportera.', desiredStateText:'Modernt CRM med full integration mot e-post, kalender och ärendehantering. All kunddata tillgänglig i realtid.', completionPct:100, archived:true, archivedDate:'2025-12-01', areaOfImprovement:[
      { id:'ai40', title:'Systemintegration', archived:true },
      { id:'ai41', title:'Datamigration', archived:true }
    ]},
    { id:'bc21', teamId:'beta', title:'Uppgradera designsystem', startingPointText:'Vårt designsystem är inkonsekvent med flera olika knappstilar och färger. Designers och utvecklare jobbar mot olika specifikationer.', desiredStateText:'Enhetligt designsystem i Figma med matchande komponentbibliotek i kod. Alla nya features följer samma designprinciper.', completionPct:100, archived:true, archivedDate:'2025-12-01', areaOfImprovement:[
      { id:'ai42', title:'UI-konsistens', archived:true },
      { id:'ai43', title:'Komponentbibliotek', archived:true }
    ]},
    { id:'bc22', teamId:'gamma', title:'Digitalisera fraktsedlar', startingPointText:'Fraktsedlar hanteras på papper vilket skapar förseningar och ibland förlust av dokument.', desiredStateText:'Alla fraktsedlar hanteras digitalt med automatisk arkivering och spårbarhet.', completionPct:95, archived:true, archivedDate:'2025-11-15', areaOfImprovement:[
      { id:'ai44', title:'Digital dokumenthantering', archived:false },
      { id:'ai45', title:'Inget förbättringsområde', archived:false }
    ]},
  ],
  actions: [
    // Alpha (10 actions)
    { id:'a1', teamId:'alpha', bcId:'bc1', aiId:'ai1', title:'Uppdatera nyhetsbrev-mall', description:'Revidera den befintliga mallen för månatligt nyhetsbrev.', responsibleId:'u3', supportId:'u5', deadline:'2026-03-15', status:'in_progress', comment:'', emailReminder:false },
    { id:'a2', teamId:'alpha', bcId:'bc1', aiId:'ai1', title:'Implementera chattbot på webbsidan', description:'Sätta upp en AI-chattbot för vanliga kundfrågor.', responsibleId:'u6', supportId:'u3', deadline:'2026-04-01', status:'not_started', comment:'', emailReminder:true },
    { id:'a3', teamId:'alpha', bcId:'bc1', aiId:'ai2', title:'Skicka kundenkät Q1', description:'Skicka enkät till top-20 kunder', responsibleId:'u10', supportId:'', deadline:'2026-03-01', status:'overdue', comment:'Väntar på godkännande från ledning', emailReminder:true },
    { id:'a4', teamId:'alpha', bcId:'bc2', aiId:'ai3', title:'Automatisera rapportgenerering', description:'Bygg skript som genererar månadsrapporter.', responsibleId:'u5', supportId:'u9', deadline:'2026-03-20', status:'in_progress', comment:'', emailReminder:false },
    { id:'a5', teamId:'alpha', bcId:'bc2', aiId:'ai3', title:'Införa CI/CD för testmiljö', description:'Sätta upp automatiserad testning och deploy.', responsibleId:'u9', supportId:'', deadline:'2026-04-15', status:'not_started', comment:'', emailReminder:false },
    { id:'a6', teamId:'alpha', bcId:'bc2', aiId:'ai4', title:'Dokumentera API:er', description:'Skapa Swagger-dokumentation', responsibleId:'u3', supportId:'u6', deadline:'2026-02-28', status:'done', comment:'Klar 2026-02-20', emailReminder:false },
    { id:'a7', teamId:'alpha', bcId:'bc2', aiId:'ai4', title:'Uppdatera onboarding-guide', description:'Revidera och komplettera onboarding-dokumentation.', responsibleId:'u6', supportId:'', deadline:'2026-03-10', status:'in_progress', comment:'', emailReminder:false },
    { id:'a8', teamId:'alpha', bcId:'bc3', aiId:'ai6', title:'Veckovis standup-möte', description:'Inför dagliga standup-möten kl 09:00', responsibleId:'u3', supportId:'u10', deadline:'2026-02-15', status:'done', comment:'', emailReminder:false },
    { id:'a9', teamId:'alpha', bcId:'bc3', aiId:'ai6', title:'Teambuilding-aktivitet Q1', description:'Planera och genomför teamaktivitet', responsibleId:'u10', supportId:'u6', deadline:'2026-03-30', status:'not_started', comment:'', emailReminder:true },
    { id:'a10', teamId:'alpha', bcId:'bc3', aiId:'ai7', title:'Feedbackrunda mars', description:'Genomför 360-graders feedback i teamet.', responsibleId:'u14', supportId:'u3', deadline:'2026-03-15', status:'not_started', comment:'', emailReminder:false },
    // Beta (8 actions)
    { id:'a11', teamId:'beta', bcId:'bc4', aiId:'ai8', title:'Bygga sökfunktion', description:'Implementera fulltextsökning i produktkatalogen', responsibleId:'u5', supportId:'u8', deadline:'2026-03-01', status:'in_progress', comment:'', emailReminder:false },
    { id:'a12', teamId:'beta', bcId:'bc4', aiId:'ai8', title:'Migrera till ny databas', description:'Flytta produktdata till PostgreSQL.', responsibleId:'u8', supportId:'u13', deadline:'2026-04-01', status:'not_started', comment:'', emailReminder:true },
    { id:'a21', teamId:'beta', bcId:'bc4', aiId:'ai9', title:'Användartester av nya UI', description:'Boka in 5 testanvändare för feedback på nya gränssnittet.', responsibleId:'u13', supportId:'u5', deadline:'2026-03-10', status:'in_progress', comment:'3 av 5 bokade', emailReminder:false },
    { id:'a22', teamId:'beta', bcId:'bc10', aiId:'ai20', title:'Sätta upp end-to-end-tester', description:'Konfigurera Playwright för automatisk e2e-testning.', responsibleId:'u8', supportId:'u5', deadline:'2026-03-15', status:'in_progress', comment:'', emailReminder:false },
    { id:'a23', teamId:'beta', bcId:'bc10', aiId:'ai20', title:'Öka enhetstesttäckning till 80%', description:'Skriva tester för alla kritiska moduler.', responsibleId:'u5', supportId:'u8', deadline:'2026-04-01', status:'not_started', comment:'', emailReminder:false },
    { id:'a24', teamId:'beta', bcId:'bc10', aiId:'ai21', title:'Automatisera regressionstester', description:'Skapa automatiserade regressionstester i CI-pipeline.', responsibleId:'u13', supportId:'', deadline:'2026-03-20', status:'not_started', comment:'', emailReminder:false },
    { id:'a25', teamId:'beta', bcId:'bc11', aiId:'ai23', title:'Optimera build-pipeline', description:'Minska byggtid från 12 min till under 5 min.', responsibleId:'u8', supportId:'', deadline:'2026-02-28', status:'done', comment:'Byggtid nu 4 min 20 sek', emailReminder:false },
    { id:'a26', teamId:'beta', bcId:'bc11', aiId:'ai23', title:'Införa feature flags', description:'Implementera feature flag-system för stegvisa releaser.', responsibleId:'u5', supportId:'u13', deadline:'2026-03-25', status:'in_progress', comment:'', emailReminder:true },
    // Gamma (6 actions)
    { id:'a13', teamId:'gamma', bcId:'bc5', aiId:'ai10', title:'Kartlägga nuvarande leveranstider', description:'Mät genomsnittlig leveranstid per kategori', responsibleId:'u4', supportId:'u17', deadline:'2026-03-10', status:'in_progress', comment:'', emailReminder:false },
    { id:'a14', teamId:'gamma', bcId:'bc5', aiId:'ai10', title:'Förhandla nya fraktavtal', description:'Jämför tre leverantörer och förhandla bättre villkor.', responsibleId:'u17', supportId:'u4', deadline:'2026-04-01', status:'not_started', comment:'', emailReminder:false },
    { id:'a15', teamId:'gamma', bcId:'bc6', aiId:'ai12', title:'Implementera kundfeedback-formulär', description:'Skapa digitalt formulär som skickas efter leverans.', responsibleId:'u19', supportId:'u20', deadline:'2026-03-15', status:'in_progress', comment:'', emailReminder:true },
    { id:'a16', teamId:'gamma', bcId:'bc6', aiId:'ai12', title:'Veckovis kunduppföljning', description:'Ring topp-10 kunder varje vecka', responsibleId:'u20', supportId:'', deadline:'2026-02-28', status:'done', comment:'', emailReminder:false },
    { id:'a27', teamId:'gamma', bcId:'bc5', aiId:'ai11', title:'Utbilda lagerpersonal i nytt system', description:'Workshop för 15 lagermedarbetare.', responsibleId:'u4', supportId:'u19', deadline:'2026-03-20', status:'not_started', comment:'', emailReminder:false },
    { id:'a28', teamId:'gamma', bcId:'bc6', aiId:'ai13', title:'Skapa kundnyhetsbrev', description:'Månadsvis nyhetsbrev med leveransinformation.', responsibleId:'u19', supportId:'', deadline:'2026-03-01', status:'in_progress', comment:'Mall klar, innehåll pågår', emailReminder:false },
    // Stöd (6 actions)
    { id:'a29', teamId:'stod', bcId:'bc12', aiId:'ai25', title:'Dokumentera supportprocesser', description:'Kartlägg och dokumentera alla interna supportflöden.', responsibleId:'u15', supportId:'u12', deadline:'2026-03-15', status:'in_progress', comment:'', emailReminder:false },
    { id:'a30', teamId:'stod', bcId:'bc12', aiId:'ai25', title:'Skapa processkarta', description:'Visuell karta över alla stödprocesser.', responsibleId:'u12', supportId:'u9', deadline:'2026-03-20', status:'not_started', comment:'', emailReminder:false },
    { id:'a31', teamId:'stod', bcId:'bc12', aiId:'ai26', title:'Bygga intern kunskapsbas', description:'Wiki med vanliga frågor och lösningar.', responsibleId:'u9', supportId:'u16', deadline:'2026-04-01', status:'in_progress', comment:'Struktur klar, fyller på innehåll', emailReminder:true },
    { id:'a32', teamId:'stod', bcId:'bc13', aiId:'ai28', title:'Planera utbildningsschema Q2', description:'Ta fram plan för kompetenshöjning.', responsibleId:'u15', supportId:'', deadline:'2026-03-10', status:'done', comment:'', emailReminder:false },
    { id:'a33', teamId:'stod', bcId:'bc13', aiId:'ai28', title:'Genomföra Excel-utbildning', description:'Workshop i avancerad Excel för teamet.', responsibleId:'u16', supportId:'u15', deadline:'2026-03-25', status:'not_started', comment:'', emailReminder:false },
    { id:'a34', teamId:'stod', bcId:'bc13', aiId:'ai29', title:'Utvärdera utbildningsinsatser Q1', description:'Sammanställ resultat och feedback.', responsibleId:'u12', supportId:'', deadline:'2026-03-30', status:'not_started', comment:'', emailReminder:false },
    // Utv (7 actions)
    { id:'a17', teamId:'utv', bcId:'bc7', aiId:'ai14', title:'Migrera till molninfrastruktur', description:'Flytta tjänster till AWS', responsibleId:'u21', supportId:'u23', deadline:'2026-04-15', status:'in_progress', comment:'', emailReminder:false },
    { id:'a18', teamId:'utv', bcId:'bc7', aiId:'ai14', title:'Uppdatera CI/CD-pipeline', description:'Modernisera med GitHub Actions.', responsibleId:'u23', supportId:'', deadline:'2026-03-20', status:'not_started', comment:'', emailReminder:true },
    { id:'a35', teamId:'utv', bcId:'bc7', aiId:'ai15', title:'Stänga av äldre servrar', description:'Avveckla 3 on-prem servrar efter migrering.', responsibleId:'u21', supportId:'u23', deadline:'2026-05-01', status:'not_started', comment:'', emailReminder:false },
    { id:'a36', teamId:'utv', bcId:'bc14', aiId:'ai30', title:'Införa obligatorisk code review', description:'Alla PRs kräver minst en godkännare.', responsibleId:'u21', supportId:'', deadline:'2026-02-20', status:'done', comment:'Branch protection rules aktiverade', emailReminder:false },
    { id:'a37', teamId:'utv', bcId:'bc14', aiId:'ai30', title:'Veckovis kodgransknings-session', description:'Gemensam genomgång av komplexa PRs fredagar.', responsibleId:'u23', supportId:'u25', deadline:'2026-03-01', status:'in_progress', comment:'', emailReminder:false },
    { id:'a38', teamId:'utv', bcId:'bc14', aiId:'ai31', title:'Skapa kodstilguide', description:'Dokumentera TypeScript/React-konventioner.', responsibleId:'u23', supportId:'u21', deadline:'2026-03-10', status:'in_progress', comment:'Första utkast klart', emailReminder:false },
    { id:'a39', teamId:'utv', bcId:'bc14', aiId:'ai31', title:'Konfigurera linter', description:'Sätta upp ESLint + Prettier med teamets regler.', responsibleId:'u25', supportId:'', deadline:'2026-02-25', status:'done', comment:'', emailReminder:false },
    // Support (7 actions)
    { id:'a19', teamId:'support', bcId:'bc8', aiId:'ai16', title:'Införa ärendeprioriteringssystem', description:'Kategorisera ärenden efter allvarlighetsgrad.', responsibleId:'u22', supportId:'u24', deadline:'2026-03-01', status:'in_progress', comment:'', emailReminder:false },
    { id:'a20', teamId:'support', bcId:'bc8', aiId:'ai16', title:'Skapa FAQ-sida', description:'Dokumentera vanligaste frågorna', responsibleId:'u24', supportId:'', deadline:'2026-02-20', status:'done', comment:'', emailReminder:false },
    { id:'a40', teamId:'support', bcId:'bc8', aiId:'ai17', title:'Automatisera ärendekvittens', description:'Automatiskt e-postbekräftelse vid nytt ärende.', responsibleId:'u22', supportId:'', deadline:'2026-03-05', status:'done', comment:'', emailReminder:false },
    { id:'a41', teamId:'support', bcId:'bc15', aiId:'ai33', title:'Skapa standardsvar-mallar', description:'10 mallar för vanligaste ärendetyper.', responsibleId:'u24', supportId:'u22', deadline:'2026-03-10', status:'in_progress', comment:'6 av 10 klara', emailReminder:true },
    { id:'a42', teamId:'support', bcId:'bc15', aiId:'ai33', title:'Införa chattkanal för snabbfrågor', description:'Slack-kanal för enkla kundförfrågningar.', responsibleId:'u22', supportId:'', deadline:'2026-03-15', status:'not_started', comment:'', emailReminder:false },
    { id:'a43', teamId:'support', bcId:'bc15', aiId:'ai34', title:'Veckovis uppföljningssamtal', description:'Ring kunder med olösta ärenden.', responsibleId:'u24', supportId:'', deadline:'2026-03-01', status:'in_progress', comment:'', emailReminder:false },
    { id:'a44', teamId:'support', bcId:'bc15', aiId:'ai34', title:'Kundnöjdhetsenkät efter avslutat ärende', description:'Automatisk enkät via e-post.', responsibleId:'u22', supportId:'u24', deadline:'2026-03-20', status:'not_started', comment:'', emailReminder:true },
  ],
  ideas: [
    // Alpha (5 ideas)
    { id:'i1', teamId:'alpha', title:'Automationsverktyg för rapportering', description:'Vi borde se över möjligheten att automatisera månadsrapporter med ett verktyg som Power Automate eller Zapier.', createdBy:'u6', createdDate:'2026-02-10' },
    { id:'i2', teamId:'alpha', title:'Extern feedback från kunder', description:'Skicka ut en enkät till våra största kunder för att samla in synpunkter på kommunikation och leverans.', createdBy:'u3', createdDate:'2026-02-05' },
    { id:'i3', teamId:'alpha', title:'Mentorprogram', description:'Starta ett mentorprogram där erfarna medarbetare stöttar nyare kollegor.', createdBy:'u10', createdDate:'2026-01-28' },
    { id:'i4', teamId:'alpha', title:'Kunskapsdelnings-fredagar', description:'En timme varje fredag där någon i teamet presenterar ett ämne.', createdBy:'u14', createdDate:'2026-01-20' },
    { id:'i5', teamId:'alpha', title:'Dashboardförbättringar', description:'Lägga till graf som visar trender över tid.', createdBy:'u9', createdDate:'2026-02-14' },
    // Beta (4 ideas)
    { id:'i6', teamId:'beta', title:'Ny produktsida', description:'Designa om produktsidan med bättre bilder och beskrivningar.', createdBy:'u5', createdDate:'2026-02-12' },
    { id:'i11', teamId:'beta', title:'A/B-testning av checkout', description:'Testa två varianter av checkout-flödet för att se vilken som konverterar bäst.', createdBy:'u8', createdDate:'2026-02-08' },
    { id:'i12', teamId:'beta', title:'Mörkt läge i appen', description:'Många användare har efterfrågat dark mode. Relativt enkel implementation med CSS-variabler.', createdBy:'u13', createdDate:'2026-01-30' },
    { id:'i13', teamId:'beta', title:'Prestandaoptimering', description:'Analysera och förbättra laddningstider — lazy loading av bilder och code splitting.', createdBy:'u5', createdDate:'2026-01-22' },
    // Gamma (4 ideas)
    { id:'i7', teamId:'gamma', title:'GPS-spårning av leveranser', description:'Kunder vill kunna följa sina leveranser i realtid.', createdBy:'u17', createdDate:'2026-02-08' },
    { id:'i8', teamId:'gamma', title:'Retursystem', description:'Digitalt retursystem för enklare hantering.', createdBy:'u19', createdDate:'2026-01-25' },
    { id:'i14', teamId:'gamma', title:'Lageroptimering med AI', description:'Använda maskininlärning för att förutsäga lagerbehov baserat på historisk data.', createdBy:'u4', createdDate:'2026-02-15' },
    { id:'i15', teamId:'gamma', title:'Sampackning av leveranser', description:'Slå ihop leveranser till samma postnummer för att minska kostnader.', createdBy:'u20', createdDate:'2026-02-01' },
    // Stöd (3 ideas)
    { id:'i16', teamId:'stod', title:'Intern support-portal', description:'Bygga ett enkelt intranät där medarbetare kan söka efter svar på vanliga frågor.', createdBy:'u15', createdDate:'2026-02-12' },
    { id:'i17', teamId:'stod', title:'Onboarding-checklista', description:'Strukturerad checklista för nya medarbetares första 30 dagar.', createdBy:'u12', createdDate:'2026-02-03' },
    { id:'i18', teamId:'stod', title:'Lunchföreläsningar', description:'Bjud in externa talare en gång i månaden för kompetensutveckling.', createdBy:'u16', createdDate:'2026-01-28' },
    // Utv (4 ideas)
    { id:'i9', teamId:'utv', title:'Kodgranskningsverktyg', description:'Testa nytt verktyg för automatiska kodgranskningar.', createdBy:'u23', createdDate:'2026-02-11' },
    { id:'i19', teamId:'utv', title:'Hackathon varje kvartal', description:'Dedikera 2 dagar per kvartal för innovation och experimenterande.', createdBy:'u21', createdDate:'2026-02-06' },
    { id:'i20', teamId:'utv', title:'Mikrofrontend-arkitektur', description:'Bryta upp monoliten i oberoende deploybara frontends per domän.', createdBy:'u23', createdDate:'2026-01-29' },
    { id:'i21', teamId:'utv', title:'Gemensam komponentbibliotek', description:'Skapa delat React-komponentbibliotek med Storybook-dokumentation.', createdBy:'u25', createdDate:'2026-02-14' },
    // Support (4 ideas)
    { id:'i10', teamId:'support', title:'Chattbot för support', description:'AI-driven chattbot för vanliga supportfrågor.', createdBy:'u24', createdDate:'2026-02-05' },
    { id:'i22', teamId:'support', title:'Kunskapsdatabas för ärenden', description:'Sökbar databas med tidigare lösningar som agenter kan referera till.', createdBy:'u22', createdDate:'2026-02-10' },
    { id:'i23', teamId:'support', title:'Videoguider', description:'Korta instruktionsvideos för vanliga uppgifter som kunder kan följa själva.', createdBy:'u24', createdDate:'2026-01-30' },
    { id:'i24', teamId:'support', title:'Kundportal med ärendestatus', description:'Kunder ska kunna se status på sina ärenden utan att behöva ringa.', createdBy:'u22', createdDate:'2026-02-15' },
  ],
  meetings: [
    // Alpha (5 meetings)
    { id:'m1', teamId:'alpha', date:'2026-02-15', note:'Sprint review + retrospektiv', attendees:['u1','u3','u6','u9','u10','u14'] },
    { id:'m2', teamId:'alpha', date:'2026-02-01', note:'Planeringsmöte Q1', attendees:['u3','u6','u10','u14'] },
    { id:'m3', teamId:'alpha', date:'2026-01-15', note:'Kickoff 2026', attendees:['u1','u3','u6','u9','u10','u14'] },
    { id:'m4', teamId:'alpha', date:'2025-12-15', note:'Årsavslutning', attendees:['u1','u3','u6','u9','u14'] },
    { id:'m5', teamId:'alpha', date:'2025-12-01', note:'Sprint review', attendees:['u3','u6','u10','u14'] },
    // Beta (5 meetings)
    { id:'m6', teamId:'beta', date:'2026-02-10', note:'Sprint planering', attendees:['u5','u8','u13'] },
    { id:'m7', teamId:'beta', date:'2026-01-20', note:'Retrospektiv', attendees:['u5','u8','u11','u13'] },
    { id:'m14', teamId:'beta', date:'2026-01-06', note:'Sprint review Q4', attendees:['u5','u8','u13'] },
    { id:'m15', teamId:'beta', date:'2025-12-16', note:'Julplanering och Q1-prioritering', attendees:['u5','u8','u11','u13'] },
    { id:'m16', teamId:'beta', date:'2025-12-02', note:'Produktdemo för stakeholders', attendees:['u5','u8','u13'] },
    // Gamma (5 meetings)
    { id:'m8', teamId:'gamma', date:'2026-02-12', note:'Månadsmöte februari', attendees:['u4','u17','u19','u20'] },
    { id:'m9', teamId:'gamma', date:'2026-01-15', note:'Kickoff 2026', attendees:['u4','u17','u19'] },
    { id:'m10', teamId:'gamma', date:'2025-12-10', note:'Årsavslutning', attendees:['u4','u17','u19','u20'] },
    { id:'m17', teamId:'gamma', date:'2025-11-20', note:'Kvartalsavstämning Q4', attendees:['u4','u17','u19','u20'] },
    { id:'m18', teamId:'gamma', date:'2025-11-05', note:'Kundmöte — feedback på leveranser', attendees:['u4','u17','u20'] },
    // Stöd (4 meetings)
    { id:'m19', teamId:'stod', date:'2026-02-18', note:'Veckomöte — statusuppdatering', attendees:['u9','u12','u15','u16'] },
    { id:'m20', teamId:'stod', date:'2026-02-04', note:'Planeringsmöte Q1', attendees:['u12','u15','u16'] },
    { id:'m21', teamId:'stod', date:'2026-01-21', note:'Workshop intern support', attendees:['u9','u12','u15','u16'] },
    { id:'m22', teamId:'stod', date:'2026-01-07', note:'Kickoff 2026', attendees:['u9','u15','u16'] },
    // Utv (5 meetings)
    { id:'m11', teamId:'utv', date:'2026-02-14', note:'Sprint review', attendees:['u21','u23','u25'] },
    { id:'m12', teamId:'utv', date:'2026-01-28', note:'Planeringsmöte', attendees:['u21','u23'] },
    { id:'m23', teamId:'utv', date:'2026-01-14', note:'Arkitekturbeslut — mikrotjänster', attendees:['u21','u23','u25'] },
    { id:'m24', teamId:'utv', date:'2025-12-17', note:'Sprint review december', attendees:['u21','u23'] },
    { id:'m25', teamId:'utv', date:'2025-12-03', note:'Tech debt-prioritering', attendees:['u21','u23','u25'] },
    // Support (4 meetings)
    { id:'m13', teamId:'support', date:'2026-02-07', note:'Veckomöte', attendees:['u22','u24'] },
    { id:'m26', teamId:'support', date:'2026-01-24', note:'Kvartalsavstämning Q4', attendees:['u22','u24'] },
    { id:'m27', teamId:'support', date:'2026-01-10', note:'Kickoff 2026 — nya rutiner', attendees:['u22','u24'] },
    { id:'m28', teamId:'support', date:'2025-12-13', note:'Årsavslutning', attendees:['u22','u24'] },
  ],
  documents: [
    // Alpha (5 documents)
    { id:'d1', teamId:'alpha', title:'Strategidokument 2026', url:'https://company.com/strategy-2026.pdf', type:'pdf', createdDate:'2026-01-15', createdBy:'u3', isPreRead:true, preReadDate:'2026-03-15' },
    { id:'d2', teamId:'alpha', title:'Processmanual', url:'https://company.com/process-manual.docx', type:'doc', createdDate:'2025-11-20', createdBy:'u3', isPreRead:false, preReadDate:null },
    { id:'d3', teamId:'alpha', title:'Budgetöversikt Q1', url:'https://company.com/budget-q1.xlsx', type:'xls', createdDate:'2026-01-05', createdBy:'u6', isPreRead:false, preReadDate:null },
    { id:'d4', teamId:'alpha', title:'Teamöverenskommelse', url:'https://company.com/team-agreement.pdf', type:'pdf', createdDate:'2025-10-01', createdBy:'u10', isPreRead:false, preReadDate:null },
    { id:'d5', teamId:'alpha', title:'Kundfeedback-sammanställning', url:'https://company.com/customer-feedback.csv', type:'csv', createdDate:'2026-02-01', createdBy:'u14', isPreRead:false, preReadDate:null },
    // Beta (4 documents)
    { id:'d6', teamId:'beta', title:'Produktspecifikation', url:'https://company.com/product-spec.pptx', type:'ppt', createdDate:'2026-01-10', createdBy:'u5', isPreRead:true, preReadDate:'2026-03-15' },
    { id:'d11', teamId:'beta', title:'Teknisk designdokumentation', url:'https://company.com/tech-design.pdf', type:'pdf', createdDate:'2026-02-05', createdBy:'u8', isPreRead:false, preReadDate:null },
    { id:'d12', teamId:'beta', title:'Testrapport januari', url:'https://company.com/test-report-jan.pdf', type:'pdf', createdDate:'2026-01-28', createdBy:'u13', isPreRead:false, preReadDate:null },
    { id:'d13', teamId:'beta', title:'Release notes v2.3', url:'https://company.com/release-notes-2.3.docx', type:'doc', createdDate:'2026-02-12', createdBy:'u5', isPreRead:false, preReadDate:null },
    // Gamma (4 documents)
    { id:'d7', teamId:'gamma', title:'Logistikstrategi 2026', url:'https://company.com/logistics-2026.pdf', type:'pdf', createdDate:'2026-01-05', createdBy:'u4', isPreRead:true, preReadDate:'2026-03-15' },
    { id:'d8', teamId:'gamma', title:'Fraktavtalsöversikt', url:'https://company.com/freight-agreements.xlsx', type:'xls', createdDate:'2025-11-15', createdBy:'u17', isPreRead:false, preReadDate:null },
    { id:'d14', teamId:'gamma', title:'Leveransstatistik Q4', url:'https://company.com/delivery-stats-q4.xlsx', type:'xls', createdDate:'2026-01-08', createdBy:'u4', isPreRead:false, preReadDate:null },
    { id:'d15', teamId:'gamma', title:'Kundklagomål-sammanställning', url:'https://company.com/complaints-2025.pdf', type:'pdf', createdDate:'2025-12-20', createdBy:'u19', isPreRead:false, preReadDate:null },
    // Stöd (3 documents)
    { id:'d16', teamId:'stod', title:'Intern supportguide', url:'https://company.com/support-guide-intern.pdf', type:'pdf', createdDate:'2026-01-15', createdBy:'u15', isPreRead:false, preReadDate:null },
    { id:'d17', teamId:'stod', title:'Utbildningsplan Q1-Q2', url:'https://company.com/training-plan.docx', type:'doc', createdDate:'2026-01-20', createdBy:'u15', isPreRead:true, preReadDate:'2026-03-15' },
    { id:'d18', teamId:'stod', title:'Processkarta version 1', url:'https://company.com/process-map-v1.pptx', type:'ppt', createdDate:'2026-02-10', createdBy:'u12', isPreRead:false, preReadDate:null },
    // Utv (4 documents)
    { id:'d9', teamId:'utv', title:'Arkitekturskiss', url:'https://company.com/architecture.pdf', type:'pdf', createdDate:'2026-01-20', createdBy:'u21', isPreRead:false, preReadDate:null },
    { id:'d19', teamId:'utv', title:'Migreringsplan AWS', url:'https://company.com/migration-plan.docx', type:'doc', createdDate:'2026-01-25', createdBy:'u21', isPreRead:true, preReadDate:'2026-03-15' },
    { id:'d20', teamId:'utv', title:'Kodstilguide v1', url:'https://company.com/code-style-guide.pdf', type:'pdf', createdDate:'2026-02-08', createdBy:'u23', isPreRead:false, preReadDate:null },
    { id:'d21', teamId:'utv', title:'Infrastrukturbudget 2026', url:'https://company.com/infra-budget-2026.xlsx', type:'xls', createdDate:'2026-01-10', createdBy:'u21', isPreRead:false, preReadDate:null },
    // Support (3 documents)
    { id:'d10', teamId:'support', title:'Supporthandbok', url:'https://company.com/support-guide.docx', type:'doc', createdDate:'2025-12-01', createdBy:'u22', isPreRead:false, preReadDate:null },
    { id:'d22', teamId:'support', title:'Ärendestatistik januari', url:'https://company.com/ticket-stats-jan.xlsx', type:'xls', createdDate:'2026-02-01', createdBy:'u22', isPreRead:false, preReadDate:null },
    { id:'d23', teamId:'support', title:'FAQ-dokument v2', url:'https://company.com/faq-v2.pdf', type:'pdf', createdDate:'2026-02-15', createdBy:'u24', isPreRead:true, preReadDate:'2026-03-15' },
  ],
  newsflashes: [
    // Alpha (10 newsflashes)
    { id:'n1', teamId:'alpha', date:'2026-03-15', title:'Nytt mål för Q1', content:'Vi har justerat våra Q1-mål baserat på feedback från ledningsgruppen. Det nya fokusområdet är kundkommunikation.', createdBy:'u3' },
    { id:'n2', teamId:'alpha', date:'2026-03-01', title:'Välkommen Oscar!', content:'Oscar Gren ansluter till teamet som ny utvecklare. Välkommen!', createdBy:'u3' },
    { id:'n3', teamId:'alpha', date:'2026-02-20', title:'Systemuppgradering planerad', content:'IT-avdelningen planerar en systemuppgradering den 1 mars. Förbered er för kort driftavbrott.', createdBy:'u1' },
    { id:'n30', teamId:'alpha', date:'2026-02-15', title:'Sprint review genomförd', content:'Vi avslutade sprint 4 med alla user stories klara. Bra samarbete!', createdBy:'u3' },
    { id:'n31', teamId:'alpha', date:'2026-02-10', title:'Ny kundkontakt etablerad', content:'Vi har inlett samarbete med en ny strategisk kund inom tillverkningssektorn.', createdBy:'u3' },
    { id:'n32', teamId:'alpha', date:'2026-02-01', title:'Utbildningsdag planerad', content:'Den 20 februari kör vi en gemensam utbildningsdag kring kommunikationsverktyg.', createdBy:'u1' },
    { id:'n33', teamId:'alpha', date:'2026-01-25', title:'Processförbättring', content:'Vi har identifierat tre flaskhalsar i vår rapporteringsprocess som vi nu åtgärdar.', createdBy:'u3' },
    { id:'n34', teamId:'alpha', date:'2026-01-20', title:'Teambuilding genomförd', content:'Fantastisk teamdag med fokus på samarbete och kommunikation. Tack alla!', createdBy:'u3' },
    { id:'n35', teamId:'alpha', date:'2026-01-15', title:'Kickoff 2026', content:'Vi har satt nya mål för året och alla är engagerade i det nya fokusområdet.', createdBy:'u1' },
    { id:'n36', teamId:'alpha', date:'2026-01-05', title:'God nytt år!', content:'Välkomna tillbaka efter ledigheten. Vi har ett spännande år framför oss!', createdBy:'u3' },
    // Beta (3 newsflashes)
    { id:'n4', teamId:'beta', date:'2026-02-10', title:'Produktlansering framflyttad', content:'Vi flyttar lanseringsdatum från mars till april.', createdBy:'u5' },
    { id:'n7', teamId:'beta', date:'2026-01-28', title:'Ny testmiljö tillgänglig', content:'Staging-miljön är nu uppe med senaste koden. Alla uppmanas testa sina features där.', createdBy:'u8' },
    { id:'n8', teamId:'beta', date:'2026-01-15', title:'Byggtid halverad!', content:'Tack vare pipeline-optimeringarna är byggtiden nu under 5 minuter. Bra jobbat!', createdBy:'u5' },
    // Gamma (3 newsflashes)
    { id:'n5', teamId:'gamma', date:'2026-02-12', title:'Ny samarbetspartner', content:'Vi har tecknat avtal med en ny fraktleverantör som ger oss bättre villkor.', createdBy:'u4' },
    { id:'n9', teamId:'gamma', date:'2026-01-22', title:'Leveranstider förbättras', content:'Vi har minskat genomsnittlig leveranstid med 20% sedan november. Fortsätt det goda arbetet!', createdBy:'u4' },
    { id:'n10', teamId:'gamma', date:'2025-12-18', title:'Juluppehåll i leveranser', content:'Tänk på att leveranser pausas 23 dec–2 jan. Planera beställningar i förväg.', createdBy:'u17' },
    // Stöd (2 newsflashes)
    { id:'n11', teamId:'stod', date:'2026-02-18', title:'Ny kunskapsbas lanserad', content:'Första versionen av vår interna kunskapsbas är nu tillgänglig. Feedback uppskattas!', createdBy:'u15' },
    { id:'n12', teamId:'stod', date:'2026-01-21', title:'Workshop inplanerad', content:'Vi kör en intern support-workshop den 4 februari. Se till att alla är med!', createdBy:'u15' },
    // Utv (3 newsflashes)
    { id:'n6', teamId:'utv', date:'2026-02-14', title:'Ny teknikstack beslutad', content:'Vi går vidare med TypeScript + Next.js för alla nya projekt.', createdBy:'u21' },
    { id:'n13', teamId:'utv', date:'2026-01-28', title:'Första mikrotjänsten live!', content:'Auth-tjänsten är nu i produktion. Ett stort steg i moderniseringen!', createdBy:'u21' },
    { id:'n14', teamId:'utv', date:'2026-01-14', title:'Kodstilguide publicerad', content:'Version 1 av kodstilguiden finns nu i vår docs-mapp. Alla förväntas följa den.', createdBy:'u23' },
    // Support (2 newsflashes)
    { id:'n15', teamId:'support', date:'2026-02-07', title:'Svarstider förbättras', content:'Genomsnittlig svarstid har sjunkit till 12 timmar — en förbättring med 50% sedan november!', createdBy:'u22' },
    { id:'n16', teamId:'support', date:'2026-01-24', title:'FAQ-sida uppdaterad', content:'FAQ-sidan har nu 45 artiklar. Det har redan minskat repetitiva ärenden.', createdBy:'u24' },
  ],
  textModules: {
    alpha: {
      currentState: 'Vi har idag utmaningar med kundkommunikation — svarsförmågan på e-post är långsam och intern information når sällan ut till hela teamet i tid. Processerna för månadsrapportering är manuella och tidskrävande.',
      desiredState: 'Vi vill ha en organisation där kommunikation flödar snabbt och smidigt, både internt och externt. Rapportering ska vara automatiserad och alla teammedlemmar ska ha tillgång till samma information i realtid.',
      teamworkRules: '1. Vi börjar och slutar möten i tid\n2. Vi lyssnar aktivt på varandra\n3. Vi ger konstruktiv feedback\n4. Vi tar ansvar för våra åtgärder\n5. Vi firar framgångar tillsammans',
      reflections: [
        { id:'r1', date:'2026-02-15', text:'Bra sprint review. Vi noterade att standup-möten har förbättrat kommunikationen.' },
        { id:'r2', date:'2026-02-01', text:'Planeringsmötet gick bra men vi behöver bli bättre på att prioritera.' },
        { id:'r3', date:'2026-01-15', text:'Kickoff-mötet satte bra energi. Alla är engagerade i de nya målen.' },
      ],
    },
    beta: {
      currentState: 'Produktutvecklingen går framåt men vi tappar fart i testfasen. Byggtiderna har varit för långa och regressionsbuggar dyker upp för ofta vid releaser. Testtäckningen ligger på ca 45%.',
      desiredState: 'Snabbare releaser med högre kvalitet genom bättre automatiserade tester. Byggtider under 5 minuter, testtäckning över 80%, och releaser varje vecka utan regressionsbuggar.',
      teamworkRules: '1. Code review krävs för alla ändringar\n2. Tester innan merge\n3. Kommunicera blockeringar direkt\n4. Demo varje fredag',
      reflections: [
        { id:'r4', date:'2026-02-10', text:'Sprint planning gick smidigt. Bra att vi begränsade WIP till 3 items per person.' },
        { id:'r5', date:'2026-01-20', text:'Retrospektiven visade att vi behöver bättre testverktyg. Playwright verkar lovande.' },
        { id:'r12', date:'2026-01-06', text:'Q4-reviewn var positiv. Vi levererade 90% av planerade features.' },
      ],
    },
    gamma: {
      currentState: 'Leveranstiderna varierar kraftigt och vi får klagomål från kunder. Intern kommunikation mellan lager och transport är bristfällig. Returer hanteras manuellt och tar lång tid.',
      desiredState: 'Pålitliga leveranser inom 48h med full spårbarhet. Nöjda kunder som rekommenderar oss vidare. Digital returhantering som minskar handläggningstiden med 70%.',
      teamworkRules: '1. Daglig statusrapport kl 08:00\n2. Avvikelser rapporteras omedelbart\n3. Vi hjälper varandra vid toppar\n4. Kundklagomål hanteras inom 24h',
      reflections: [
        { id:'r6', date:'2026-02-12', text:'Bra möte, alla engagerade i förbättringsarbetet. Leveranstiderna trendar åt rätt håll.' },
        { id:'r7', date:'2026-01-15', text:'Kickoff gick bra, tydliga mål uppsatta. Ny fraktleverantör ska ge snabbare leveranser.' },
        { id:'r13', date:'2025-12-10', text:'Årsavslutning. Vi konstaterade att leveranstiderna förbättrats 20% sedan sommaren.' },
      ],
    },
    stod: {
      currentState: 'Stödgruppen saknar idag tydliga processer för intern support. Kollegor vet inte alltid vem de ska vända sig till. Dokumentation är utspridd och svår att hitta.',
      desiredState: 'En välorganiserad stödfunktion med tydliga processer, sökbar kunskapsbas och strukturerat utbildningsprogram. Alla medarbetare ska veta var de hittar hjälp inom 30 sekunder.',
      teamworkRules: '1. Alla ärenden loggas i systemet\n2. Svar inom 4 timmar\n3. Dokumentera alla lösningar\n4. Dela kunskap aktivt',
      reflections: [
        { id:'r14', date:'2026-02-18', text:'Veckomötet fungerar bra som forum. Kunskapsbasen börjar ta form.' },
        { id:'r15', date:'2026-02-04', text:'Planeringsmötet gav bra struktur för Q1. Vi har nu tydliga ansvarsområden.' },
        { id:'r16', date:'2026-01-21', text:'Workshopen var uppskattad. Många bra idéer kom fram som vi kan jobba vidare med.' },
      ],
    },
    utv: {
      currentState: 'Legacy-system på flera ställen. Deployprocessen är manuell och felbenägen. Saknar gemensamma kodstandarder och code review-rutiner. Teknisk skuld bromsar nya features.',
      desiredState: 'Modern teknikstack med automatiserad CI/CD. Alla utvecklare kan deploya tryggt. Gemensamma kodstandarder, obligatorisk code review, och teknisk skuld under kontroll.',
      teamworkRules: '1. Pull requests krävs\n2. Inga direkta pushes till main\n3. Dokumentera alla arkitekturbeslut\n4. Parprogrammering för komplexa uppgifter',
      reflections: [
        { id:'r8', date:'2026-02-14', text:'Bra sprint review. Första mikrotjänsten i produktion! Auth-tjänsten fungerar stabilt.' },
        { id:'r9', date:'2026-01-28', text:'Planering av migreringsordning klar. Vi börjar med user-tjänsten nästa sprint.' },
        { id:'r17', date:'2026-01-14', text:'Arkitekturbeslut taget — mikrotjänster med event-driven kommunikation.' },
      ],
    },
    support: {
      currentState: 'Svarstider för support-ärenden ligger på 12h i snitt (ner från 24h+). Många repetitiva frågor trots FAQ-sida. Saknar bra uppföljningsrutiner för olösta ärenden.',
      desiredState: 'Svarstid under 4h. FAQ och självbetjäning minskar volymen med 50%. Alla kunder får proaktiv uppföljning. NPS-score över 70.',
      teamworkRules: '1. Ärenden prioriteras enligt allvarlighetsgrad\n2. Eskalera efter 2h utan lösning\n3. Dokumentera alla lösningar\n4. Följ upp olösta ärenden dagligen',
      reflections: [
        { id:'r10', date:'2026-02-07', text:'Veckomötet visade positiv trend i svarstider. FAQ-sidan har haft stor effekt.' },
        { id:'r11', date:'2026-01-25', text:'FAQ-sidan har minskat repetitiva ärenden med 15%. Bra start, men vi behöver fler artiklar.' },
        { id:'r18', date:'2026-01-10', text:'Kickoff med nya rutiner. Ärendeprioritering och automatisk kvittens införs.' },
      ],
    }
  },
  strategicLinks: {
    alpha: {
      strategic: { url:'https://company.com/strategic-reasoning-2026', updatedDate:'2026-01-10' },
      progress: { url:'https://company.com/progress-strategic-focus-feb', updatedDate:'2026-02-01' },
    },
    beta: {
      strategic: { url:'https://company.com/beta-strategy', updatedDate:'2025-12-15' },
      progress: { url:'https://company.com/beta-progress', updatedDate:'2026-01-15' },
    },
    gamma: {
      strategic: { url:'https://company.com/gamma-logistics-strategy', updatedDate:'2026-01-05' },
      progress: { url:'https://company.com/gamma-progress-q1', updatedDate:'2026-02-01' },
    },
    stod: {
      strategic: { url:'https://company.com/stod-support-strategy', updatedDate:'2026-01-12' },
      progress: { url:'https://company.com/stod-progress-q1', updatedDate:'2026-02-04' },
    },
    utv: {
      strategic: { url:'https://company.com/utv-tech-strategy', updatedDate:'2026-01-20' },
      progress: { url:'https://company.com/utv-modernization-progress', updatedDate:'2026-02-10' },
    },
    support: {
      strategic: { url:'https://company.com/support-strategy-2026', updatedDate:'2025-12-20' },
      progress: { url:'https://company.com/support-response-metrics', updatedDate:'2026-02-05' },
    }
  },
  trackedContributions: [
    // Alpha (5 tracked contributions)
    { id:'tc1', teamId:'alpha', bcId:'bc1', title:'Kundnöjdhet (NPS)', targetValue:80, currentValue:62, unit:'poäng', targetLine:80, criticalLine:50, chartType:'line', measurements:[
      { date:'2025-10-01', value:45 },{ date:'2025-11-01', value:50 },{ date:'2025-12-01', value:55 },{ date:'2026-01-01', value:58 },{ date:'2026-02-01', value:62 }
    ]},
    { id:'tc2', teamId:'alpha', bcId:'bc1', title:'E-postsvarstid (h)', targetValue:4, currentValue:8, unit:'timmar', targetLine:4, criticalLine:16, chartType:'line', measurements:[
      { date:'2025-10-01', value:24 },{ date:'2025-11-01', value:18 },{ date:'2025-12-01', value:14 },{ date:'2026-01-01', value:10 },{ date:'2026-02-01', value:8 }
    ]},
    { id:'tc3', teamId:'alpha', bcId:'bc2', title:'Automatiserade rapporter', targetValue:10, currentValue:6, unit:'st', targetLine:10, criticalLine:3, chartType:'bar', measurements:[
      { date:'2025-11-01', value:0 },{ date:'2025-12-01', value:2 },{ date:'2026-01-01', value:4 },{ date:'2026-02-01', value:6 }
    ]},
    { id:'tc4', teamId:'alpha', bcId:'bc2', title:'Dokumenttäckning (%)', targetValue:100, currentValue:72, unit:'%', targetLine:100, criticalLine:50, chartType:'line', measurements:[
      { date:'2025-10-01', value:30 },{ date:'2025-11-01', value:45 },{ date:'2025-12-01', value:58 },{ date:'2026-01-01', value:65 },{ date:'2026-02-01', value:72 }
    ]},
    { id:'tc5', teamId:'alpha', bcId:'bc3', title:'Teamengagemang', targetValue:90, currentValue:78, unit:'%', targetLine:90, criticalLine:60, chartType:'bar', measurements:[
      { date:'2025-12-01', value:60 },{ date:'2026-01-01', value:70 },{ date:'2026-02-01', value:78 }
    ]},
    // Beta (3 tracked contributions)
    { id:'tc10', teamId:'beta', bcId:'bc4', title:'Produktfunktioner levererade', targetValue:20, currentValue:14, unit:'st', targetLine:20, criticalLine:8, chartType:'bar', measurements:[
      { date:'2025-10-01', value:3 },{ date:'2025-11-01', value:6 },{ date:'2025-12-01', value:9 },{ date:'2026-01-01', value:11 },{ date:'2026-02-01', value:14 }
    ]},
    { id:'tc11', teamId:'beta', bcId:'bc10', title:'Testtäckning (%)', targetValue:80, currentValue:52, unit:'%', targetLine:80, criticalLine:40, chartType:'line', measurements:[
      { date:'2025-11-01', value:35 },{ date:'2025-12-01', value:40 },{ date:'2026-01-01', value:45 },{ date:'2026-02-01', value:52 }
    ]},
    { id:'tc12', teamId:'beta', bcId:'bc11', title:'Byggtid (minuter)', targetValue:5, currentValue:4.3, unit:'min', targetLine:5, criticalLine:10, chartType:'line', measurements:[
      { date:'2025-10-01', value:12 },{ date:'2025-11-01', value:10 },{ date:'2025-12-01', value:8 },{ date:'2026-01-01', value:6.5 },{ date:'2026-02-01', value:4.3 }
    ]},
    // Gamma (2 tracked contributions)
    { id:'tc6', teamId:'gamma', bcId:'bc5', title:'Leveranstid (timmar)', targetValue:48, currentValue:72, unit:'h', targetLine:48, criticalLine:96, chartType:'line', measurements:[
      { date:'2025-11-01', value:120 },{ date:'2025-12-01', value:96 },{ date:'2026-01-01', value:84 },{ date:'2026-02-01', value:72 }
    ]},
    { id:'tc7', teamId:'gamma', bcId:'bc6', title:'Kundnöjdhet (NPS)', targetValue:70, currentValue:52, unit:'poäng', targetLine:70, criticalLine:40, chartType:'bar', measurements:[
      { date:'2025-11-01', value:35 },{ date:'2025-12-01', value:40 },{ date:'2026-01-01', value:45 },{ date:'2026-02-01', value:52 }
    ]},
    // Stöd (2 tracked contributions)
    { id:'tc13', teamId:'stod', bcId:'bc12', title:'Ärenden lösta inom 4h (%)', targetValue:90, currentValue:55, unit:'%', targetLine:90, criticalLine:40, chartType:'bar', measurements:[
      { date:'2025-12-01', value:20 },{ date:'2026-01-01', value:35 },{ date:'2026-02-01', value:55 }
    ]},
    { id:'tc14', teamId:'stod', bcId:'bc13', title:'Utbildningstimmar per person', targetValue:20, currentValue:8, unit:'h', targetLine:20, criticalLine:5, chartType:'bar', measurements:[
      { date:'2025-12-01', value:0 },{ date:'2026-01-01', value:3 },{ date:'2026-02-01', value:8 }
    ]},
    // Utv (3 tracked contributions)
    { id:'tc8', teamId:'utv', bcId:'bc7', title:'Deploy-frekvens (per vecka)', targetValue:5, currentValue:2, unit:'st', targetLine:5, criticalLine:1, chartType:'line', measurements:[
      { date:'2025-12-01', value:0.5 },{ date:'2026-01-01', value:1 },{ date:'2026-02-01', value:2 }
    ]},
    { id:'tc15', teamId:'utv', bcId:'bc7', title:'Servrar migrerade', targetValue:8, currentValue:3, unit:'st', targetLine:8, criticalLine:2, chartType:'bar', measurements:[
      { date:'2025-12-01', value:0 },{ date:'2026-01-01', value:1 },{ date:'2026-02-01', value:3 }
    ]},
    { id:'tc16', teamId:'utv', bcId:'bc14', title:'Code review-tid (h)', targetValue:2, currentValue:4, unit:'h', targetLine:2, criticalLine:8, chartType:'line', measurements:[
      { date:'2025-12-01', value:12 },{ date:'2026-01-01', value:8 },{ date:'2026-02-01', value:4 }
    ]},
    // Support (2 tracked contributions)
    { id:'tc9', teamId:'support', bcId:'bc8', title:'Svarstid (timmar)', targetValue:4, currentValue:12, unit:'h', targetLine:4, criticalLine:24, chartType:'line', measurements:[
      { date:'2025-11-01', value:36 },{ date:'2025-12-01', value:24 },{ date:'2026-01-01', value:18 },{ date:'2026-02-01', value:12 }
    ]},
    { id:'tc17', teamId:'support', bcId:'bc15', title:'Kundnöjdhet (NPS)', targetValue:70, currentValue:48, unit:'poäng', targetLine:70, criticalLine:35, chartType:'bar', measurements:[
      { date:'2025-11-01', value:30 },{ date:'2025-12-01', value:35 },{ date:'2026-01-01', value:42 },{ date:'2026-02-01', value:48 }
    ]},
  ],
  pdca: [
    // Alpha
    { bcId:'bc1', plan:100, do:75, check:50, act:25 },
    { bcId:'bc2', plan:100, do:100, check:80, act:40 },
    { bcId:'bc3', plan:100, do:60, check:30, act:10 },
    // Beta
    { bcId:'bc4', plan:100, do:80, check:60, act:30 },
    { bcId:'bc10', plan:100, do:50, check:20, act:5 },
    { bcId:'bc11', plan:100, do:90, check:70, act:45 },
    // Gamma
    { bcId:'bc5', plan:100, do:50, check:20, act:0 },
    { bcId:'bc6', plan:100, do:70, check:40, act:15 },
    // Stöd
    { bcId:'bc12', plan:100, do:60, check:25, act:10 },
    { bcId:'bc13', plan:100, do:40, check:15, act:5 },
    // Utv
    { bcId:'bc7', plan:100, do:40, check:10, act:0 },
    { bcId:'bc14', plan:100, do:75, check:50, act:30 },
    // Support
    { bcId:'bc8', plan:100, do:80, check:60, act:30 },
    { bcId:'bc15', plan:100, do:55, check:30, act:10 },
  ],
  locomotiveGoals: [
    { id:'lg1', orgId:'foretag', title:'Öka marknadsandel i Norden med 15%', description:'Fokusera på digital marknadsföring och partnerskap för att stärka vår position på den nordiska marknaden.', url:'https://example.com/strategy/nordic', updatedDate:'2026-03-01' },
    { id:'lg2', orgId:'foretag', title:'Hållbarhetscertifiering ISO 14001', description:'Genomföra certifieringsprocessen för att uppnå ISO 14001 och stärka vårt hållbarhetsarbete.', url:'https://example.com/strategy/iso14001', updatedDate:'2026-02-15' },
    { id:'lg3', orgId:'foretag', title:'Lansera ny produktlinje Q3', description:'Utveckla och lansera premiumsegmentet med fokus på kvalitet och hållbarhet.', url:'https://example.com/strategy/newproduct', updatedDate:'2026-03-10' },
  ],
  activityLog: [
    { date:'2026-02-18', type:'meeting', text:'Stödgrupp registrerade möte: Veckomöte — statusuppdatering (4 närvarande)' },
    { date:'2026-02-17', type:'action', text:'Anna A. markerade "Dokumentera API:er" som klar' },
    { date:'2026-02-16', type:'idea', text:'Karl L. skapade idén "Dashboardförbättringar"' },
    { date:'2026-02-15', type:'meeting', text:'Möte registrerat: Sprint review + retrospektiv (5 av 6 närvarande)' },
    { date:'2026-02-15', type:'news', text:'Anna A. publicerade "Nytt mål för Q1"' },
    { date:'2026-02-15', type:'idea', text:'Magnus B. skapade idén "Lageroptimering med AI"' },
    { date:'2026-02-14', type:'action', text:'Erik S. uppdaterade deadline för "Automatisera rapportgenerering"' },
    { date:'2026-02-14', type:'news', text:'Nils Å. publicerade "Ny teknikstack beslutad"' },
    { date:'2026-02-14', type:'meeting', text:'Utveckling registrerade möte: Sprint review (3 närvarande)' },
    { date:'2026-02-12', type:'news', text:'Magnus B. publicerade "Ny samarbetspartner"' },
    { date:'2026-02-12', type:'idea', text:'Anders B. skapade idén "Intern support-portal"' },
    { date:'2026-02-10', type:'meeting', text:'Team Beta registrerade möte: Sprint planering (3 närvarande)' },
    { date:'2026-02-10', type:'idea', text:'Sara K. skapade idén "Kunskapsdatabas för ärenden"' },
    { date:'2026-02-08', type:'action', text:'Sofia B. startade arbete med "Sätta upp end-to-end-tester"' },
    { date:'2026-02-07', type:'news', text:'Sara K. publicerade "Svarstider förbättras"' },
  ],
};
