// Mock data for workspace prototype (references DB from mock-data.js)
const WS = {
  bestContributions: [
    { id:'bc1', teamId:'alpha', title:'Förbättra kundkommunikation', areaOfImprovement:[
      { id:'ai1', title:'Digitala kanaler' },
      { id:'ai2', title:'Inget förbättringsområde' }
    ]},
    { id:'bc2', teamId:'alpha', title:'Öka processeffektivitet', areaOfImprovement:[
      { id:'ai3', title:'Automatisering' },
      { id:'ai4', title:'Dokumentation' },
      { id:'ai5', title:'Inget förbättringsområde' }
    ]},
    { id:'bc3', teamId:'alpha', title:'Stärka teamsamarbetet', areaOfImprovement:[
      { id:'ai6', title:'Kommunikation' },
      { id:'ai7', title:'Inget förbättringsområde' }
    ]},
    { id:'bc4', teamId:'beta', title:'Produktutveckling Q1', areaOfImprovement:[
      { id:'ai8', title:'Funktionalitet' },
      { id:'ai9', title:'Inget förbättringsområde' }
    ]},
    { id:'bc5', teamId:'gamma', title:'Förbättra logistikflödet', areaOfImprovement:[
      { id:'ai10', title:'Leveranstider' },
      { id:'ai11', title:'Inget förbättringsområde' }
    ]},
    { id:'bc6', teamId:'gamma', title:'Kundnöjdhet 2026', areaOfImprovement:[
      { id:'ai12', title:'Kommunikation' },
      { id:'ai13', title:'Inget förbättringsområde' }
    ]},
    { id:'bc7', teamId:'utv', title:'Modernisera teknikstack', areaOfImprovement:[
      { id:'ai14', title:'Infrastruktur' },
      { id:'ai15', title:'Inget förbättringsområde' }
    ]},
    { id:'bc8', teamId:'support', title:'Minska svarstider', areaOfImprovement:[
      { id:'ai16', title:'Ärendehantering' },
      { id:'ai17', title:'Inget förbättringsområde' }
    ]},
  ],
  actions: [
    { id:'a1', teamId:'alpha', bcId:'bc1', aiId:'ai1', title:'Uppdatera nyhetsbrev-mall', description:'Revidera den befintliga mallen för månatligt nyhetsbrev.', responsibleId:'u3', supportId:'u5', deadline:'2026-03-15', status:'in_progress', comment:'' },
    { id:'a2', teamId:'alpha', bcId:'bc1', aiId:'ai1', title:'Implementera chattbot på webbsidan', description:'', responsibleId:'u6', supportId:'u3', deadline:'2026-04-01', status:'not_started', comment:'' },
    { id:'a3', teamId:'alpha', bcId:'bc1', aiId:'ai2', title:'Skicka kundenkät Q1', description:'Skicka enkät till top-20 kunder', responsibleId:'u10', supportId:'', deadline:'2026-03-01', status:'overdue', comment:'Väntar på godkännande från ledning' },
    { id:'a4', teamId:'alpha', bcId:'bc2', aiId:'ai3', title:'Automatisera rapportgenerering', description:'Bygg skript som genererar månadsrapporter.', responsibleId:'u5', supportId:'u9', deadline:'2026-03-20', status:'in_progress', comment:'' },
    { id:'a5', teamId:'alpha', bcId:'bc2', aiId:'ai3', title:'Införa CI/CD för testmiljö', description:'', responsibleId:'u9', supportId:'', deadline:'2026-04-15', status:'not_started', comment:'' },
    { id:'a6', teamId:'alpha', bcId:'bc2', aiId:'ai4', title:'Dokumentera API:er', description:'Skapa Swagger-dokumentation', responsibleId:'u3', supportId:'u6', deadline:'2026-02-28', status:'done', comment:'Klar 2026-02-20' },
    { id:'a7', teamId:'alpha', bcId:'bc2', aiId:'ai4', title:'Uppdatera onboarding-guide', description:'', responsibleId:'u6', supportId:'', deadline:'2026-03-10', status:'in_progress', comment:'' },
    { id:'a8', teamId:'alpha', bcId:'bc3', aiId:'ai6', title:'Veckovis standup-möte', description:'Inför dagliga standup-möten kl 09:00', responsibleId:'u3', supportId:'u10', deadline:'2026-02-15', status:'done', comment:'' },
    { id:'a9', teamId:'alpha', bcId:'bc3', aiId:'ai6', title:'Teambuilding-aktivitet Q1', description:'Planera och genomför teamaktivitet', responsibleId:'u10', supportId:'u6', deadline:'2026-03-30', status:'not_started', comment:'' },
    { id:'a10', teamId:'alpha', bcId:'bc3', aiId:'ai7', title:'Feedbackrunda mars', description:'', responsibleId:'u14', supportId:'u3', deadline:'2026-03-15', status:'not_started', comment:'' },
    { id:'a11', teamId:'beta', bcId:'bc4', aiId:'ai8', title:'Bygga sökfunktion', description:'Implementera fulltextsökning i produktkatalogen', responsibleId:'u5', supportId:'u8', deadline:'2026-03-01', status:'in_progress', comment:'' },
    { id:'a12', teamId:'beta', bcId:'bc4', aiId:'ai8', title:'Migrera till ny databas', description:'', responsibleId:'u8', supportId:'u13', deadline:'2026-04-01', status:'not_started', comment:'' },
    { id:'a13', teamId:'gamma', bcId:'bc5', aiId:'ai10', title:'Kartlägga nuvarande leveranstider', description:'Mät genomsnittlig leveranstid per kategori', responsibleId:'u4', supportId:'u17', deadline:'2026-03-10', status:'in_progress', comment:'' },
    { id:'a14', teamId:'gamma', bcId:'bc5', aiId:'ai10', title:'Förhandla nya fraktavtal', description:'', responsibleId:'u17', supportId:'u4', deadline:'2026-04-01', status:'not_started', comment:'' },
    { id:'a15', teamId:'gamma', bcId:'bc6', aiId:'ai12', title:'Implementera kundfeedback-formulär', description:'', responsibleId:'u19', supportId:'u20', deadline:'2026-03-15', status:'in_progress', comment:'' },
    { id:'a16', teamId:'gamma', bcId:'bc6', aiId:'ai12', title:'Veckovis kunduppföljning', description:'Ring topp-10 kunder varje vecka', responsibleId:'u20', supportId:'', deadline:'2026-02-28', status:'done', comment:'' },
    { id:'a17', teamId:'utv', bcId:'bc7', aiId:'ai14', title:'Migrera till molninfrastruktur', description:'Flytta tjänster till AWS', responsibleId:'u21', supportId:'u23', deadline:'2026-04-15', status:'in_progress', comment:'' },
    { id:'a18', teamId:'utv', bcId:'bc7', aiId:'ai14', title:'Uppdatera CI/CD-pipeline', description:'', responsibleId:'u23', supportId:'', deadline:'2026-03-20', status:'not_started', comment:'' },
    { id:'a19', teamId:'support', bcId:'bc8', aiId:'ai16', title:'Införa ärendeprioriteringssystem', description:'', responsibleId:'u22', supportId:'u24', deadline:'2026-03-01', status:'in_progress', comment:'' },
    { id:'a20', teamId:'support', bcId:'bc8', aiId:'ai16', title:'Skapa FAQ-sida', description:'Dokumentera vanligaste frågorna', responsibleId:'u24', supportId:'', deadline:'2026-02-20', status:'done', comment:'' },
  ],
  ideas: [
    { id:'i1', teamId:'alpha', title:'Automationsverktyg för rapportering', description:'Vi borde se över möjligheten att automatisera månadsrapporter med ett verktyg som Power Automate eller Zapier.', createdBy:'u6', createdDate:'2026-02-10' },
    { id:'i2', teamId:'alpha', title:'Extern feedback från kunder', description:'Skicka ut en enkät till våra största kunder för att samla in synpunkter på kommunikation och leverans.', createdBy:'u3', createdDate:'2026-02-05' },
    { id:'i3', teamId:'alpha', title:'Mentorprogram', description:'Starta ett mentorprogram där erfarna medarbetare stöttar nyare kollegor.', createdBy:'u10', createdDate:'2026-01-28' },
    { id:'i4', teamId:'alpha', title:'Kunskapsdelnings-fredagar', description:'En timme varje fredag där någon i teamet presenterar ett ämne.', createdBy:'u14', createdDate:'2026-01-20' },
    { id:'i5', teamId:'alpha', title:'Dashboardförbättringar', description:'Lägga till graf som visar trender över tid.', createdBy:'u9', createdDate:'2026-02-14' },
    { id:'i6', teamId:'beta', title:'Ny produktsida', description:'Designa om produktsidan med bättre bilder och beskrivningar.', createdBy:'u5', createdDate:'2026-02-12' },
    { id:'i7', teamId:'gamma', title:'GPS-spårning av leveranser', description:'Kunder vill kunna följa sina leveranser i realtid.', createdBy:'u17', createdDate:'2026-02-08' },
    { id:'i8', teamId:'gamma', title:'Retursystem', description:'Digitalt retursystem för enklare hantering.', createdBy:'u19', createdDate:'2026-01-25' },
    { id:'i9', teamId:'utv', title:'Kodgranskningsverktyg', description:'Testa nytt verktyg för automatiska kodgranskningar.', createdBy:'u23', createdDate:'2026-02-11' },
    { id:'i10', teamId:'support', title:'Chattbot för support', description:'AI-driven chattbot för vanliga supportfrågor.', createdBy:'u24', createdDate:'2026-02-05' },
  ],
  meetings: [
    { id:'m1', teamId:'alpha', date:'2026-02-15', note:'Sprint review + retrospektiv', attendees:['u1','u3','u6','u9','u10','u14'] },
    { id:'m2', teamId:'alpha', date:'2026-02-01', note:'Planeringsmöte Q1', attendees:['u3','u6','u10','u14'] },
    { id:'m3', teamId:'alpha', date:'2026-01-15', note:'Kickoff 2026', attendees:['u1','u3','u6','u9','u10','u14'] },
    { id:'m4', teamId:'alpha', date:'2025-12-15', note:'Årsavslutning', attendees:['u1','u3','u6','u9','u14'] },
    { id:'m5', teamId:'alpha', date:'2025-12-01', note:'Sprint review', attendees:['u3','u6','u10','u14'] },
    { id:'m6', teamId:'beta', date:'2026-02-10', note:'Sprint planering', attendees:['u5','u8','u13'] },
    { id:'m7', teamId:'beta', date:'2026-01-20', note:'Retrospektiv', attendees:['u5','u8','u11','u13'] },
    { id:'m8', teamId:'gamma', date:'2026-02-12', note:'Månadsmöte februari', attendees:['u4','u17','u19','u20'] },
    { id:'m9', teamId:'gamma', date:'2026-01-15', note:'Kickoff 2026', attendees:['u4','u17','u19'] },
    { id:'m10', teamId:'gamma', date:'2025-12-10', note:'Årsavslutning', attendees:['u4','u17','u19','u20'] },
    { id:'m11', teamId:'utv', date:'2026-02-14', note:'Sprint review', attendees:['u21','u23','u25'] },
    { id:'m12', teamId:'utv', date:'2026-01-28', note:'Planeringsmöte', attendees:['u21','u23'] },
    { id:'m13', teamId:'support', date:'2026-02-07', note:'Veckomöte', attendees:['u22','u24'] },
  ],
  documents: [
    { id:'d1', teamId:'alpha', title:'Strategidokument 2026', url:'https://company.com/strategy-2026.pdf', type:'pdf', createdDate:'2026-01-15', createdBy:'u3' },
    { id:'d2', teamId:'alpha', title:'Processmanual', url:'https://company.com/process-manual.docx', type:'doc', createdDate:'2025-11-20', createdBy:'u3' },
    { id:'d3', teamId:'alpha', title:'Budgetöversikt Q1', url:'https://company.com/budget-q1.xlsx', type:'xls', createdDate:'2026-01-05', createdBy:'u6' },
    { id:'d4', teamId:'alpha', title:'Teamöverenskommelse', url:'https://company.com/team-agreement.pdf', type:'pdf', createdDate:'2025-10-01', createdBy:'u10' },
    { id:'d5', teamId:'alpha', title:'Kundfeedback-sammanställning', url:'https://company.com/customer-feedback.csv', type:'csv', createdDate:'2026-02-01', createdBy:'u14' },
    { id:'d6', teamId:'beta', title:'Produktspecifikation', url:'https://company.com/product-spec.pptx', type:'ppt', createdDate:'2026-01-10', createdBy:'u5' },
    { id:'d7', teamId:'gamma', title:'Logistikstrategi 2026', url:'https://company.com/logistics-2026.pdf', type:'pdf', createdDate:'2026-01-05', createdBy:'u4' },
    { id:'d8', teamId:'gamma', title:'Fraktavtalsöversikt', url:'https://company.com/freight-agreements.xlsx', type:'xls', createdDate:'2025-11-15', createdBy:'u17' },
    { id:'d9', teamId:'utv', title:'Arkitekturskiss', url:'https://company.com/architecture.pdf', type:'pdf', createdDate:'2026-01-20', createdBy:'u21' },
    { id:'d10', teamId:'support', title:'Supporthandbok', url:'https://company.com/support-guide.docx', type:'doc', createdDate:'2025-12-01', createdBy:'u22' },
  ],
  newsflashes: [
    { id:'n1', teamId:'alpha', date:'2026-02-15', title:'Nytt mål för Q1', content:'Vi har justerat våra Q1-mål baserat på feedback från ledningsgruppen. Det nya fokusområdet är kundkommunikation.', createdBy:'u3' },
    { id:'n2', teamId:'alpha', date:'2026-02-01', title:'Välkommen Oscar!', content:'Oscar Gren ansluter till teamet som ny utvecklare. Välkommen!', createdBy:'u3' },
    { id:'n3', teamId:'alpha', date:'2026-01-20', title:'Systemuppgradering planerad', content:'IT-avdelningen planerar en systemuppgradering den 1 mars. Förbered er för kort driftavbrott.', createdBy:'u1' },
    { id:'n4', teamId:'beta', date:'2026-02-10', title:'Produktlansering framflyttad', content:'Vi flyttar lanseringsdatum från mars till april.', createdBy:'u5' },
    { id:'n5', teamId:'gamma', date:'2026-02-12', title:'Ny samarbetspartner', content:'Vi har tecknat avtal med en ny fraktleverantör som ger oss bättre villkor.', createdBy:'u4' },
    { id:'n6', teamId:'utv', date:'2026-02-14', title:'Ny teknikstack beslutad', content:'Vi går vidare med TypeScript + Next.js för alla nya projekt.', createdBy:'u21' },
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
      currentState: 'Produktutvecklingen går framåt men vi tappar fart i testfasen.',
      desiredState: 'Snabbare releaser med högre kvalitet genom bättre automatiserade tester.',
      teamworkRules: '1. Code review krävs för alla ändringar\n2. Tester innan merge\n3. Kommunicera blockeringar direkt',
      reflections: [
        { id:'r4', date:'2026-02-10', text:'Sprint planning gick smidigt.' },
        { id:'r5', date:'2026-01-20', text:'Retrospektiven visade att vi behöver bättre testverktyg.' },
      ],
    },
    gamma: {
      currentState: 'Leveranstiderna varierar kraftigt och vi får klagomål från kunder. Intern kommunikation mellan lager och transport är bristfällig.',
      desiredState: 'Pålitliga leveranser inom 48h med full spårbarhet. Nöjda kunder som rekommenderar oss vidare.',
      teamworkRules: '1. Daglig statusrapport kl 08:00\n2. Avvikelser rapporteras omedelbart\n3. Vi hjälper varandra vid toppar',
      reflections: [
        { id:'r6', date:'2026-02-12', text:'Bra möte, alla engagerade i förbättringsarbetet.' },
        { id:'r7', date:'2026-01-15', text:'Kickoff gick bra, tydliga mål uppsatta.' },
      ],
    },
    utv: {
      currentState: 'Legacy-system på flera ställen. Deployprocessen är manuell och felbenägen.',
      desiredState: 'Modern teknikstack med automatiserad CI/CD. Alla utvecklare kan deploya tryggt.',
      teamworkRules: '1. Pull requests krävs\n2. Inga direkta pushes till main\n3. Dokumentera alla arkitekturbeslut',
      reflections: [
        { id:'r8', date:'2026-02-14', text:'Bra sprint review. Första mikrotjänsten i produktion!' },
        { id:'r9', date:'2026-01-28', text:'Planering av migreringsordning klar.' },
      ],
    },
    support: {
      currentState: 'Svarstider för support-ärenden ligger på 24h+ i snitt. Många repetitiva frågor.',
      desiredState: 'Svarstid under 4h. FAQ och självbetjäning minskar volymen med 30%.',
      teamworkRules: '1. Ärenden prioriteras enligt allvarlighetsgrad\n2. Eskalera efter 2h utan lösning\n3. Dokumentera alla lösningar',
      reflections: [
        { id:'r10', date:'2026-02-07', text:'Veckomötet visade positiv trend i svarstider.' },
        { id:'r11', date:'2026-01-25', text:'FAQ-sidan har minskat repetitiva ärenden med 15%.' },
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
    { id:'tc1', teamId:'alpha', bcId:'bc1', title:'Kundnöjdhet (NPS)', targetValue:80, currentValue:62, unit:'poäng', measurements:[
      { date:'2025-10-01', value:45 },{ date:'2025-11-01', value:50 },{ date:'2025-12-01', value:55 },{ date:'2026-01-01', value:58 },{ date:'2026-02-01', value:62 }
    ]},
    { id:'tc2', teamId:'alpha', bcId:'bc1', title:'E-postsvarstid (h)', targetValue:4, currentValue:8, unit:'timmar', measurements:[
      { date:'2025-10-01', value:24 },{ date:'2025-11-01', value:18 },{ date:'2025-12-01', value:14 },{ date:'2026-01-01', value:10 },{ date:'2026-02-01', value:8 }
    ]},
    { id:'tc3', teamId:'alpha', bcId:'bc2', title:'Automatiserade rapporter', targetValue:10, currentValue:6, unit:'st', measurements:[
      { date:'2025-11-01', value:0 },{ date:'2025-12-01', value:2 },{ date:'2026-01-01', value:4 },{ date:'2026-02-01', value:6 }
    ]},
    { id:'tc4', teamId:'alpha', bcId:'bc2', title:'Dokumenttäckning (%)', targetValue:100, currentValue:72, unit:'%', measurements:[
      { date:'2025-10-01', value:30 },{ date:'2025-11-01', value:45 },{ date:'2025-12-01', value:58 },{ date:'2026-01-01', value:65 },{ date:'2026-02-01', value:72 }
    ]},
    { id:'tc5', teamId:'alpha', bcId:'bc3', title:'Teamengagemang', targetValue:90, currentValue:78, unit:'%', measurements:[
      { date:'2025-12-01', value:60 },{ date:'2026-01-01', value:70 },{ date:'2026-02-01', value:78 }
    ]},
    { id:'tc6', teamId:'gamma', bcId:'bc5', title:'Leveranstid (timmar)', targetValue:48, currentValue:72, unit:'h', measurements:[
      { date:'2025-11-01', value:120 },{ date:'2025-12-01', value:96 },{ date:'2026-01-01', value:84 },{ date:'2026-02-01', value:72 }
    ]},
    { id:'tc7', teamId:'gamma', bcId:'bc6', title:'Kundnöjdhet (NPS)', targetValue:70, currentValue:52, unit:'poäng', measurements:[
      { date:'2025-11-01', value:35 },{ date:'2025-12-01', value:40 },{ date:'2026-01-01', value:45 },{ date:'2026-02-01', value:52 }
    ]},
    { id:'tc8', teamId:'utv', bcId:'bc7', title:'Deploy-frekvens (per vecka)', targetValue:5, currentValue:2, unit:'st', measurements:[
      { date:'2025-12-01', value:0.5 },{ date:'2026-01-01', value:1 },{ date:'2026-02-01', value:2 }
    ]},
    { id:'tc9', teamId:'support', bcId:'bc8', title:'Svarstid (timmar)', targetValue:4, currentValue:12, unit:'h', measurements:[
      { date:'2025-11-01', value:36 },{ date:'2025-12-01', value:24 },{ date:'2026-01-01', value:18 },{ date:'2026-02-01', value:12 }
    ]},
  ],
  pdca: [
    { bcId:'bc1', plan:100, do:75, check:50, act:25 },
    { bcId:'bc2', plan:100, do:100, check:80, act:40 },
    { bcId:'bc3', plan:100, do:60, check:30, act:10 },
    { bcId:'bc5', plan:100, do:50, check:20, act:0 },
    { bcId:'bc6', plan:100, do:70, check:40, act:15 },
    { bcId:'bc7', plan:100, do:40, check:10, act:0 },
    { bcId:'bc8', plan:100, do:80, check:60, act:30 },
  ],
  activityLog: [
    { date:'2026-02-17', type:'action', text:'Anna A. markerade "Dokumentera API:er" som klar' },
    { date:'2026-02-16', type:'idea', text:'Karl L. skapade idén "Dashboardförbättringar"' },
    { date:'2026-02-15', type:'meeting', text:'Möte registrerat: Sprint review + retrospektiv (5 av 6 närvarande)' },
    { date:'2026-02-15', type:'news', text:'Anna A. publicerade "Nytt mål för Q1"' },
    { date:'2026-02-14', type:'action', text:'Erik S. uppdaterade deadline för "Automatisera rapportgenerering"' },
  ],
};
