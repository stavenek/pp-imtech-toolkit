# Övriga sektioner — Kravspecifikation

Krav som rör delar av Integral Teamwork Toolkit utanför admin-sektionen. Identifierade genom granskning av `reqs/old/old-system/Web Toolkit Adminstrator Manual.docx`, `Web Toolkit User Manual.docx`, V1-prototyper samt `01-old-system-analysis.md` (2026-02-24).

---

## 0. Källdokument och spårbarhet

### Inkorporerade kravdokument

| # | Fil | Status | Inkorp. datum | Beskrivning |
|---|-----|--------|---------------|-------------|
| 01 | `reqs/01-old-system-analysis.md` | Fullt inkorporerad | 2026-01 | Systemanalys av gamla Web Toolkit |
| 02 | `reqs/02-gui-gap-analysis.md` | Fullt inkorporerad | 2026-02 | UX-granskningar |
| 03 | `reqs/03-admin-feedback-lasse.md` | Fullt inkorporerad | 2026-02-17 | Lasses feedback: roller, terminologi, notifieringar |
| 04 | `reqs/04-admi-feedback-lasse-19-feb.md` | Fullt inkorporerad | 2026-02-21 | Lasses feedback: hybrid-struktur, mini-nav, språkväxling |
| 05 | `Feedback#3 Toolkit(LR).pptx` | Fullt inkorporerad | 2026-03-18 | Lasses feedback#3: mötesprogresslinje, sidebar-omstrukturering, Your/Our Dashboard-uppdelning, Locomotive Goals, Archive, mätetal-krav, inline-redigering, drag-and-drop |

---

## 1. Sign-up-flöde (användarens sida av inbjudan)

### 1.1 Bakgrund

Admin bjuder in en användare via e-post (se `admin-section-req.md` sektion 3.5). Denna sektion specificerar vad som händer när den inbjudna användaren klickar på länken i e-postmeddelandet.

### 1.2 Flöde

1. Användaren får e-post med en "Gå med i teamet"-knapp/länk
2. Länken öppnar sign-up-formuläret med förifyllda fält
3. Användaren fyller i personuppgifter och skapar lösenord
4. Efter registrering loggas användaren in automatiskt i det inbjudna teamet

### 1.3 Sign-up-formulär

| Fält | Typ | Förifyllt | Obligatoriskt | Beskrivning |
|---|---|---|---|---|
| Förnamn | Text input | Nej | Ja | |
| Efternamn | Text input | Nej | Ja | |
| Telefon | Text input | Nej | Nej | |
| E-post | Text (read-only) | Ja (från inbjudan) | Ja | Kan ej ändras |
| Lösenord | Password input | Nej | Ja | |
| Bekräfta lösenord | Password input | Nej | Ja | Måste matcha lösenord |
| Organisation | Text (read-only) | Ja (från inbjudan) | — | Informativ, ej redigerbar |
| Team | Text (read-only) | Ja (från inbjudan) | — | Informativ, ej redigerbart |

### 1.4 Affärsregler

- Användaren skapas med `registerStatus = registered`, `systemRole = null`, `teamRole = member`
- Om användaren bjudits in till flera team (bulk-import) skapas alla TeamMembership vid sign-up
- UserOrganization skapas automatiskt för relevanta organisationer
- Sign-up-länken bör ha en tidsbegränsning (t.ex. 7 dagar). Admin kan skicka om inbjudan.
- Super admins läggs till manuellt i databasen — de går inte igenom sign-up-flödet

### 1.5 Validering

- Lösenordskrav: minst 8 tecken (exakt policy TBD)
- E-postvalidering: redan utförd vid inbjudan
- Om länken har gått ut: felmeddelande med instruktion att kontakta admin

---

## 2. Lösenordshantering

### 2.1 Glömt lösenord

**Flöde:**

1. Användaren klickar "Glömt lösenord" på inloggningssidan
2. Formulär med e-postfält visas
3. Användaren anger sin e-post och klickar "Skicka återställningslänk"
4. Bekräftelsesida: "Kolla din e-post"
5. E-post med återställningslänk skickas (tidsbegränsad, t.ex. 1 timme)
6. Länken öppnar formulär med "Nytt lösenord" och "Bekräfta lösenord"
7. Bekräftelsesida: "Ditt lösenord har ändrats" med länk till inloggning

**Affärsregler:**
- Återställningslänken är engångs — den blir ogiltig efter användning
- Om e-posten inte finns i systemet visas **samma** bekräftelsesida (förhindrar enumeration)
- Enbart användare med `registerStatus = registered` kan återställa lösenord

### 2.2 Byt lösenord (inloggad)

> TBD — Specificeras vid behov. Kan placeras under användarprofil-sidan.

---

## 3. Inloggning och sessionhantering

### 3.1 Inloggningsflöde

1. Användaren navigerar till applikationen
2. Inloggningsformulär med e-post och lösenord visas
3. Vid lyckad inloggning dirigeras användaren till sin primära organisation (UserOrganization med `isPrimary = true`)

### 3.2 Teamval vid inloggning

En användare kan tillhöra flera team inom en organisation. Beteende vid inloggning:

- Användaren dirigeras till det **senast besökta teamet** (sparas i session/localStorage)
- Om inget senast besökt team finns: det första teamet (efter sorteringsordning)
- Teamväxling sker via en teamväljare i applikationens huvudnavigering

### 3.3 Multi-org-beteende

- Vid inloggning visas den primära organisationen (`isPrimary = true`)
- Användare med flera organisationer (typiskt admins) kan byta organisation via organisationsväljaren
- Sessionen bibehålls vid org-byte

### 3.4 Flerliksinloggning

> **Legacy-beteende:** I gamla systemet delades sessionen mellan alla flikar på samma domän. Användare som ville logga in i ett annat team behövde använda inkognito-fönster.

Nytt system bör utvärdera om detta beteende ska behållas eller om explicit multi-team-stöd implementeras via teamväljaren.

---

> **Scope-avgränsning:** Sektion 1–3 (Sign-up, Lösenord, Inloggning) specificerar autentiseringsflöden som utgör en separat epik. De ingår **inte** i workspace-prototyp-bygget nedan. Auth-prototypfiler (`login.html`, `signup.html`, `forgot-password.html`, `reset-password.html`) planeras och byggs separat.

---

## 4. Team Workspace — Översikt

### 4.1 Bakgrund

ITT-applikationen består av två huvuddelar:

1. **Admin** — redan prototypad i V4 (`admin.html`), 4 flikar: Användare, Team, Organisation, Anpassning
2. **Team Workspace** — det agendadrivna arbetsytan som specificeras nedan

Team Workspace använder en **mötesprogresslinje** med 4 stopp som speglar den ordning teamet arbetar igenom agendan under varje möte. Alla sidor bygger på samma V4-designsystem (Blaze Lynx-struktur + Sprint Falcon-stil).

### 4.2 Sidöversikt

| # | Filnamn | Svensk titel | Agendasektion | Sidtyp |
|---|---------|-------------|---------------|--------|
| 1 | `dashboard.html` | Your Dashboard | — | Personlig startsida |
| 2 | `strategic.html` | Strategiskt Resonemang | 1. Vart är vi på väg? | Länkmodul |
| 3 | `locomotive-goals.html` | Lokomotivmål | 1. Vart är vi på väg? | Länkmodul |
| 4 | `newsflash.html` | Nyhetsflash | 1. Vart är vi på väg? | Nyhetsmodul |
| 5 | `best-contribution.html` | Bästa bidrag | 2. Vår dashboard | Bidragsmodul |
| 6 | `goals-metrics.html` | Mål & Mätetal | 2. Vår dashboard | Mätningsmodul |
| 7 | `action-plan.html` | Handlingsplan | 3. Delprojekt & Handlingsplan | Åtgärdsmodul |
| 8 | `documents.html` | Teamdokument | 3. Delprojekt & Handlingsplan | Länkmodul |
| 9 | `ideas.html` | Idélogg | 3. Delprojekt & Handlingsplan | Idémodul |
| 10 | `reflections.html` | Reflektioner & Spelregler | 4. Reflektioner & Lärande | Textmodul |
| 11 | `attendance.html` | Närvaro | 4. Reflektioner & Lärande | Närvaromodul |
| 12 | `archive.html` | Arkiv | 4. Reflektioner & Lärande | Arkivmodul |

### 4.3 Legacy-modul → Ny sida/komponent-mapping

| Legacy-modul (01-old-system-analysis.md) | Ny sida/komponent | Status |
|---|---|---|
| Dashboard (Home) | `dashboard.html` (Your Dashboard) | Omdesignad som personlig landningssida |
| Agenda (sidebar-navigation) | Mötesprogresslinje + sidebar | Omdesignad (progresslinje ersätter separat agendasida) |
| Strategic Reasoning (extern länk) | `strategic.html` | Full paritet |
| Progress with Strategic Focus (extern länk) | `locomotive-goals.html` | **Ny sida:** Lokomotivmål (1–3 strategiska mål från ledningen) |
| Newsflash / Chat with NLT | `newsflash.html` | **Avvikelse:** chatdel utelämnad, enbart nyhetsflöde |
| Our Current State (textmodul) | `best-contribution.html` (Starting Point-sektion) | **Ändrad:** Absorberad i Bästa bidrag-sidan |
| Our Desired State (textmodul) | `best-contribution.html` (Objective & Desired State-sektion) | **Ändrad:** Absorberad i Bästa bidrag-sidan |
| Goals & Metrics / Targets & Measurements | `goals-metrics.html` | Full paritet + utökat |
| Action Plan (åtgärdsmodul) | `action-plan.html` | Full paritet + utökat |
| Team Documents (länkmodul) | `documents.html` | Full paritet |
| Log of Ideas (idémodul) | `ideas.html` | Full paritet |
| Completed Steps (arkiv) | `archive.html` | **Ändrad:** Egen sida (inte vikbar sektion) — bredare scope |
| Attendance (närvaromodul) | `attendance.html` | Full paritet |
| Our Teamwork Rules (textmodul) | `reflections.html` (sektion 1) | Kombinerad med Reflektioner (samma sida, två sidebar-ingångar) |
| Reflections & Learnings (textmodul) | `reflections.html` (sektion 2) | Kombinerad med Spelregler |
| Best Contribution CRUD | `best-contribution.html` + `goals-metrics.html` | Full paritet |
| Area of Improvement CRUD | `action-plan.html` (inline i bästa bidrag) | Full paritet |
| Floating Action Button | FAB-komponent (alla modulsidor + dashboard) | Full paritet |
| User Menu (language, help) | Toppnavigation | Full paritet |
| Admin (Company/Teams/Users) | `admin.html` (redan byggd) | Redan prototypad |

---

## 5. Navigationsarkitektur

### 5.1 Topnavigation (global, alla sidor)

```
┌───────────────────────────────────────────────────────────────────┐
│ ITT │ [Team Alpha ▾]  Dashboard  Admin    [SV│EN]                │
└───────────────────────────────────────────────────────────────────┘
```

| Länk | Synlighet | Mål |
|------|-----------|-----|
| ITT (logotyp) | Alla | `dashboard.html` |
| Team-väljare | Alla (dold om bara 1 team) | Byter team-kontext |
| Dashboard | Alla | `dashboard.html` |
| Admin | `data-min-role="team-leader"` | `admin.html` |
| SV/EN | `data-min-role="integ-admin"` | Språkväxling |

### 5.2 Mötesprogresslinje

Visas under toppnav på alla workspace-sidor (ej på Your Dashboard eller Admin). Representerar de 4 agendastegen som teamet arbetar igenom under varje möte. Ritad som en horisontell linje med cirkulära stopp.

```
         ●─────────────────◉─────────────────○─────────────────○
    Strategiskt        Vår Dashboard     Delprojekt &      Reflektioner
      Fokus                              Handlingsplan      & Lärande
```

**Stoppvisualisering:**
- **● (fylld cirkel)** = besökt stopp (redan passerat under mötet)
- **◉ (dubbel cirkel)** = aktuellt stopp (den sektion användaren befinner sig i nu)
- **○ (tom cirkel)** = kommande stopp (ej ännu besökt)

**Stopp-mapping:**

| # | Stoppetikett | Sidebar-sektion | Landningssida (första undersidan) |
|---|---|---|---|
| 1 | Strategiskt Fokus | Vart är vi på väg och varför? | `strategic.html` |
| 2 | Vår Dashboard | Vår Dashboard | `best-contribution.html` |
| 3 | Delprojekt & Handlingsplan | Delprojekt & Handlingsplan | `action-plan.html` |
| 4 | Reflektioner & Lärande | Reflektioner & Lärande | `reflections.html` |

**Beteende:**
- Varje stopp är **klickbart** — navigerar till landningssidan för den sektionen
- Stoppet markeras som besökt (fylld cirkel) när teamet spenderat tid i den sektionen under mötet
- Besöksstatus sparas per team och mötestillfälle i `localStorage('itt-progress-${teamId}')`
- Progresslinjen visas **inte** på "Your Dashboard" (personlig sida utanför mötesagendan)

### 5.3 Sidebar (modulsidor)

Sidopanelen visas på alla modulsidor (sida 2–12) men **inte** på Your Dashboard eller Admin.

```
┌──────────────────┬──────────────────────────────────────┐
│  SIDEBAR         │  Huvudinnehåll                        │
│                  │                                       │
│  Your Dashboard  │                                       │
│                  │                                       │
│  VART ÄR VI PÅ  │                                       │
│  VÄG OCH VARFÖR?│                                       │
│   · Strategiskt  │                                       │
│     Resonemang   │                                       │
│   · Lokomotivmål │                                       │
│   · Nyhetsflash  │                                       │
│                  │                                       │
│  VÅR DASHBOARD   │                                       │
│   · Bästa bidrag │                                       │
│   · Mål &        │                                       │
│     Mätetal      │                                       │
│                  │                                       │
│  DELPROJEKT &    │                                       │
│  HANDLINGSPLAN   │                                [FAB+] │
│   · Handlingsplan│                                       │
│   · Teamdokument │                                       │
│   · Idélogg      │                                       │
│                  │                                       │
│  REFLEKTIONER &  │                                       │
│  LÄRANDE         │                                       │
│   · Reflektioner │                                       │
│   · Spelregler   │                                       │
│   · Närvaro      │                                       │
│   · Arkiv        │                                       │
└──────────────────┴──────────────────────────────────────┘
```

**Sidebar-struktur:**

| Element | Typ | Klickbar | Mål |
|---------|-----|----------|-----|
| **Your Dashboard** | Länk | Ja | `dashboard.html` |
| **Vart är vi på väg och varför?** | Sektionsrubrik | Nej | — |
| · Strategiskt Resonemang | Undersida | Ja | `strategic.html` |
| · Lokomotivmål | Undersida | Ja | `locomotive-goals.html` |
| · Nyhetsflash | Undersida | Ja | `newsflash.html` |
| **Vår Dashboard** | Sektionsrubrik | Nej | — |
| · Bästa bidrag | Undersida | Ja | `best-contribution.html` |
| · Mål & Mätetal | Undersida | Ja | `goals-metrics.html` |
| **Delprojekt & Handlingsplan** | Sektionsrubrik | Nej | — |
| · Handlingsplan | Undersida | Ja | `action-plan.html` |
| · Teamdokument | Undersida | Ja | `documents.html` |
| · Idélogg | Undersida | Ja | `ideas.html` |
| **Reflektioner & Lärande** | Sektionsrubrik | Nej | — |
| · Reflektioner | Undersida | Ja | `reflections.html` |
| · Spelregler | Undersida | Ja | `reflections.html#spelregler` |
| · Närvaro | Undersida | Ja | `attendance.html` |
| · Arkiv | Undersida | Ja | `archive.html` |

- Sektionsrubriker visas i **versaler**, fetstil, med avskiljande avstånd ovanför
- "Your Dashboard" visas som enskild toppnivå-länk (ej under en sektionsrubrik)
- Sidopanelen är sticky (`position: sticky; top: 52px`)
- Aktiv sida markeras med gul kantlinje till vänster
- Kugghjulsikon synlig för org-admin+ (visuell markering, ej funktionell i prototyp)

**Synlighetstoggle för agendapunkter (team-leader+):**
- Varje undersida har en ögon-ikon synlig för team-leader+ (`data-min-role="team-leader"`)
- Klick på ikonen togglar modulens synlighet (visuellt: genomstruken text + dämpad färg)
- Syftet: Team Leader kan dölja agendapunkter inför möten som ej är aktuella
- Status sparas per team i `localStorage('itt-agenda-visibility-${teamId}')`

### 5.4 Flytande åtgärdsknapp (FAB)

Visas på alla modulsidor **och på Your Dashboard**, men **inte** på Admin.

- Fast position nere till höger (ovanför rollväljaren)
- Klick expanderar meny: **+ Åtgärd**, **+ Idé**
- Alla roller kan använda FAB
- **+ Åtgärd** öppnar slide-over med åtgärdsformulär
- **+ Idé** öppnar slide-over med idéformulär

### 5.5 Brödsmulor

Alla sidor visar brödsmulor under mötesprogresslinjen:

```
Your Dashboard / Vår Dashboard / Bästa bidrag
```

### 5.6 Team-kontext och state-strategi

Team-kontexten (vilken team användaren tittar på) hanteras via:

- **localStorage-nyckel:** `itt-team` — innehåller aktuellt team-ID
- **URL-parameter:** `?teamId=xxx` — om angiven, överskriver localStorage
- **Fallback:** om varken localStorage eller URL-param finns, väljs första teamet i användarens lista
- **Vid team-byte:** Team-väljaren uppdaterar `itt-team` i localStorage och laddar om sidan
- **Persistens:** Alla workspace-sidor läser `itt-team` vid sidladdning för att filtrera mock-data

---

## 6. Detaljerade sidspecifikationer

### 6.1 Your Dashboard (`dashboard.html`)

**Layout:** Helbredd (ingen sidebar, ingen mötesprogresslinje)
**Rollsynlighet:** Alla roller
**Beskrivning:** Det första som möter användaren vid inloggning — personlig översikt.

**Innehåll:**

1. **Hjältesektion** — "Välkommen tillbaka, [Namn]" + rollbadge

2. **Statistikkort** (4 st i rad):
   | Kort | Värde | Ikon |
   |------|-------|------|
   | Möten närvarade | 12 | Kalender |
   | Åtgärder slutförda | 8 | Bock |
   | Teamframsteg | 74% | Graf (gul bakgrund) |
   | Pågående åtgärder | 3 | Pil |

3. **Mina åtgärder** — Tabell med max 5 rader. Visar åtgärder där aktuell användare är ansvarig eller stöd, med deadline inom 14 dagar eller försenad.
   - Kolumner: Åtgärd, Deadline, Status, Bästa bidrag
   - Länk: "Visa alla i handlingsplanen →"

4. **Bästa bidrag (preview)** — Kort sammanfattning av aktuellt bästa bidrag med Starting Point / Desired State. Länk "Redigera →" till `best-contribution.html`.

5. **Mål & Mätetal (mini-graf)** — Liten stapeldiagram-preview av spårade mätetal med "Se alla mätetal →"-länk till `goals-metrics.html`.

6. **Senaste aktivitet** — Tidslinje med 5 senaste händelser

7. **Nyhetsflash** — Senaste nyhetsflash-inlägget. Hanteras av Team & Team Leader. Uppdateringar av sådant som har relevans för teamet.

**Interaktioner:**
- Statistikkort navigerar till relevant sida vid klick
- Åtgärdsrader öppnar slide-over vid klick

---

### 6.2 Bästa bidrag (`best-contribution.html`)

**Layout:** Sidebar + mötesprogresslinje + huvudinnehåll
**Rollsynlighet:** Alla roller
**Agendasektion:** Vår Dashboard (landningssida för stopp 2)
**Beskrivning:** Teamets gemensamma dashboard — översikt av bästa bidrag, framsteg och mätetal.

**Innehåll:**

1. **Our Best Contribution** — Redigerbart textblock:
   - **Starting Point** — Textfält (redigerbart inline, spara-knapp)
   - **Objective & Desired State** — Textfält (redigerbart inline, spara-knapp)
   - **Why is this Our Best Contribution?** — Textfält (redigerbart inline, spara-knapp)

2. **Completion of Best Contribution** — Procentstapel:
   - Visar aktuell procent (t.ex. 35%)
   - **Drag-and-drop** för att ändra värdet — dra i den färgade stapeln
   - Completion-stapeln och texterna Starting Point / Desired State ska vara stora och tydligt synliga

3. **Mål & Mätetal (preview)** — Stapeldiagram-preview av spårade mätetal
   - Klickbart — navigerar till `goals-metrics.html` för att administrera mätetal

4. **Our Subprojects** — Expanderbar lista med bästa bidragets delprojekt:
   - Varje delprojekt som en expanderbar rad (t.ex. "FÖRBÄTTRA KUNDKOMMUNIKATION", "ÖKA PROCESSEFFEKTIVITET")
   - Klick navigerar till `action-plan.html` med fokus på det delprojektet

5. **"+ Nytt bästa bidrag"** knapp (team-leader+)

**Affärsregler:**
- Man ska kunna skriva direkt i Best Contribution-fönstret och spara
- Man ska kunna klicka på mätetalet och komma till mätadmin-fönstret

---

### 6.3 Handlingsplan (`action-plan.html`)

**Layout:** Sidebar + mötesprogresslinje + huvudinnehåll
**Rollsynlighet:** Alla roller (alla kan skapa/redigera åtgärder)
**Agendasektion:** Delprojekt & Handlingsplan (landningssida för stopp 3)
**Beskrivning:** Teamets primära arbetsyta — 50–70% av mötestiden spenderas här.

**Innehåll:**

1. **Verktygsfält:**
   - Personfilter (dropdown: "Alla", teammedlemmar)
   - Statusfilter (segmented control: Alla | Ej startad | Pågående | Försenad | Klar)
   - Sökfält

2. **Starting Point / Desired State (kompakt)** — Visa överst, komprimerad version från `best-contribution.html`. Kan göras större med lämplig färg så att de syns bra.

3. **Team Focus** — Sammanfattande text om teamets fokus (redigerbar)

4. **Bästa bidrag / Delprojekt** — Vikbara sektioner per bidrag:
   ```
   ▾ FÖRBÄTTRA KUNDKOMMUNIKATION                    Completion: 0%
     Our Starting Point: —
     Our Desired State: —
     ┌────────┬────────────┬──────────┬──────────┬──────────┬───────────┬──────────┐
     │ Åtgärd │ Ansvarig   │ Stöd av  │ Deadline  │ Kommentar │ Påminnelse│ Status   │
     ├────────┼────────────┼──────────┼──────────┼──────────┼───────────┼──────────┤
     │ Uppd.  │ Anna A.    │ Erik S.  │ 2026-03  │ ...       │ ✉         │ PÅGÅENDE │
     └────────┴────────────┴──────────┴──────────┴──────────┴───────────┴──────────┘
   ```
   - **"Zooma ut"**: Ej diskuterade delprojekt kan minimeras/kollapsas så att nästan hela fönstret kan användas för fokus på aktuell handlingsplan
   - Handlingsplanen kan spänna över hela sidans bredd

5. **Förbättringsområden (Area of Improvement)** — Inline i varje bästa bidrag:
   - **Skapa:** "+ Nytt förbättringsområde"-länk under bästa bidrag → inline textfält
   - **Radera:** ✗-ikon bredvid förbättringsområdets rubrik → bekräftelsedialog:
     "Förbättringsområdet '[Namn]' raderas. Dess åtgärder flyttas till 'Inget förbättringsområde'."
   - **Affärsregel:** Vid radering flyttas alla kopplade åtgärder till det automatiska "Inget förbättringsområde"-området
   - **Affärsregel:** "Inget förbättringsområde" kan inte raderas

6. **Drag-and-drop-omordning:** Användaren ska via drag-and-drop enkelt kunna byta plats mellan:
   - Delprojekt (Sub Projects)
   - Förbättringsområden (det grå fältet)
   - Åtgärder (Actions)

7. **Inline-redigering:** Allt ska kunna skrivas in och ändras utan att lämna denna vy.

**Slide-over: Redigera åtgärd**

| Fält | Typ | Obligatoriskt |
|------|-----|---------------|
| Titel | Text | Ja |
| Beskrivning | Textarea | Nej |
| Ansvarig | Dropdown (teammedlemmar) | Nej |
| Stöd av | Dropdown (teammedlemmar) | Nej |
| Deadline | Datumväljare | Nej |
| Status | Dropdown: Ej startad/Pågående/Försenad/Klar | Nej |
| Bästa bidrag | Dropdown | Ja |
| Förbättringsområde | Dropdown (filtrerad per bästa bidrag) | Nej |
| Kommentar | Textarea | Nej |
| Mejlpåminnelse | Toggle (på/av) | Nej |

Botten: **Radera åtgärd** (röd, bekräftelsedialog)

**Statusbadge-färger:**
- Ej startad: grå
- Pågående: gul (#ffcc00)
- Försenad: röd
- Klar: grön

---

### 6.4 Mål & Mätetal (`goals-metrics.html`)

**Layout:** Sidebar + mötesprogresslinje + huvudinnehåll
**Rollsynlighet:** Alla roller
**Agendasektion:** Vår Dashboard

**Innehåll:**

1. **PDCA-tabell** — Bästa bidrag med PDCA-faser:

   | Bästa bidrag | Plan | Do | Check | Act | Totalt |
   |---|---|---|---|---|---|
   | Kundkommunikation | 100% | 75% | 50% | 25% | 65% |

   Varje cell har en liten progress-bar.

2. **Spårade bidrag** — Kort per mätetal:
   - Slutmål, nuvarande värde, förändring
   - Progress-bar
   - Färgmarkering
   - **Målnivå + kritisk linje** ska enkelt kunna läggas in och bli mycket synliga
   - "+ Lägg till bästa bidrag till mätningar"

3. **Diagram** — Max 2 separata mätetal visas (skifta vy/klicka eller under varandra):
   - **Fritt val mellan stapel och kurva** för att visa mätvärden
   - **Tidsaxel** kan styras till: varje vecka, var 14:e dag (baserat på mötesfrekvens), eller månatliga uppdateringar
   - **Målnivå + kritisk linje** synlig i diagrammet
   - Kryssrutor för att visa/dölja bidrag
   - Y-axel: absoluta värden (enstaka) eller procent (flera)

4. **Mätningsinmatningar** — Vikbar lista med historik
   - "+ Ny mätning" öppnar inline-formulär (datum + numeriska värden)

**Interaktioner:**
- Klick på ett mätetal öppnar mätadmin-fönstret där man kan addera nya mätvärden, målnivåer, eller designa nytt mätetal

---

### 6.5 Lokomotivmål (`locomotive-goals.html`)

**Layout:** Sidebar + mötesprogresslinje + huvudinnehåll
**Rollsynlighet:** Alla roller kan läsa. Org-admin+ kan redigera.
**Agendasektion:** Vart är vi på väg och varför?
**Beskrivning:** 1–3 strategiskt fokuserade lokomotivmål från ledningen, uppdaterade i relevant frekvens (vanligtvis varje månad eller varje vecka).

**Innehåll:**

1. **Lokomotivmål** — 1–3 länkkort, varje med:
   - Titel (redigerbar för org-admin+)
   - Beskrivning/sammanhang (redigerbar för org-admin+)
   - URL till externt material (redigerbar för org-admin+)
   - Senast uppdaterad: datum

**Affärsregler:**
- Ständigt aktiv länk till 1–3 lokomotivmål
- Ledningen uppdaterar dessa i relevant frekvens
- Sidan ska vara lätt att editera för någon som sitter nära ledningen

---

### 6.6 Närvaro (`attendance.html`)

**Layout:** Sidebar + mötesprogresslinje + huvudinnehåll
**Rollsynlighet:** Alla roller
**Agendasektion:** Reflektioner & Lärande

**Innehåll:**

1. **Verktygsfält:** "+ Nytt möte"

2. **Närvarorutnät** (personer × datum):
   ```
   ┌────────────┬────────┬────────┬────────┬─────┐
   │            │ 15 feb │  1 feb │ 15 jan │  %  │
   ├────────────┼────────┼────────┼────────┼─────┤
   │ Anna A. TL │   ✓   │   ✓   │   ✓   │100% │
   │ Erik S.    │   ✓   │   ✗   │   ✓   │ 67% │
   │ Maria J.   │   ✗   │   ✓   │   ✓   │ 67% │
   ├────────────┼────────┼────────┼────────┼─────┤
   │ NÄRVARO    │  2/3   │  2/3   │  3/3   │ 78% │
   └────────────┴────────┴────────┴────────┴─────┘
   ```
   - Team leaders markeras med "TL"-ikon
   - ✓ grön, ✗ röd
   - Procent ≥75% markeras gult

3. **Möteslista** (vikbar, under rutnätet):
   - Datum, antal närvarande, anteckning
   - Expand visar deltagarlista

**Nytt möte (slide-over/inline):**
- Datumväljare (default: idag)
- Kryssrutor per teammedlem
- Anteckningsfält
- Radera möte kräver bekräftelse

---

### 6.7 Teamdokument (`documents.html`)

**Layout:** Sidebar + mötesprogresslinje + huvudinnehåll
**Rollsynlighet:** Alla roller
**Agendasektion:** Delprojekt & Handlingsplan

**Innehåll:**

1. **Verktygsfält:** Sökfält + typfilter

2. **Inline-skapande:**
   ```
   Titel: [          ]  URL: [             ]  Typ: [PDF ▾]  [SPARA LÄNK]
   ```

3. **Dokumenttabell:**

   | Titel | URL | Typ | Skapad | Åtgärd |
   |-------|-----|-----|--------|--------|
   | Strategidokument | company.com/... | PDF | 2026-01-15 | Öppna/Kopiera/Redigera/Radera |

   - Typbadge-färger: PDF (röd), DOC (blå), XLS (grön), PPT (orange), CSV (grå), Övrigt (mörkgrå)
   - Typ auto-detekteras från URL-ändelse
   - Kopiera URL → toast "URL kopierad"
   - Radera → bekräftelsedialog

**Pre-read-markering:** Rubriken "Teamdokument" i sidebaren ska byta färg/blinka om det finns nya dokument som bör läsas inför nästa möte. Teammedlemmar kan lägga in och läsa teamdokument som pre-reads inför möten.

---

### 6.8 Idélogg (`ideas.html`)

**Layout:** Sidebar + mötesprogresslinje + huvudinnehåll
**Rollsynlighet:** Alla roller
**Agendasektion:** Delprojekt & Handlingsplan

**Innehåll:**

1. **"+ Ny idé"** knapp

2. **Post-it-rutnät** — Idéer som gula kort i grid-layout:
   ```
   ┌───────────────────┐ ┌───────────────────┐
   │ AUTOMATIONSVERKTYG│ │ EXTERN FEEDBACK   │
   │ FÖR RAPPORTERING  │ │ FRÅN KUNDER       │
   │                   │ │                   │
   │ Vi borde se över  │ │ Skicka ut en      │
   │ möj. att autom... │ │ enkät till våra   │
   │                   │ │ största kunder    │
   │ [Redigera] [✗]   │ │ [Redigera] [✗]   │
   └───────────────────┘ └───────────────────┘
   ```
   Stil: gul bakgrund, 2px svart ram, offset-skugga vid hover

**Slide-over: Redigera idé — två flikar:**

| Flik | Innehåll |
|------|----------|
| **Behålles som idé** | Redigera titel + beskrivning |
| **Konvertera till åtgärd** | Åtgärdsformuläret (förifylt med idé-data). Konvertering tar bort idén och skapar en åtgärd. |

---

### 6.9 Reflektioner & Spelregler (`reflections.html`)

**Layout:** Sidebar + mötesprogresslinje + huvudinnehåll
**Rollsynlighet:** Alla roller (alla kan redigera)
**Agendasektion:** Reflektioner & Lärande (landningssida för stopp 4)
**Beskrivning:** Reflektioner och Spelregler är två rubriker/ingångar i sidebaren men leder till samma sida. De hänger ihop men man kan söka sig in båda vägarna beroende på vad som är mest intressant att reflektera över.

**Innehåll:**

1. **Våra spelregler för teamwork** (ankare: `#spelregler`) — Textmodul:
   - Redigerbar textarea med teamets överenskomna regler
   - Sparknapp

2. **Reflektioner & Lärande** — Textmodul:
   - Hjälptext: "Dokumentera era lärdomar per möte i kronologisk ordning"
   - Redigerbar textarea med löpande text
   - Sparknapp

**Sidebar-ingångar:**
- "Reflektioner" → `reflections.html` (scrollar till toppen)
- "Spelregler" → `reflections.html#spelregler` (scrollar till spelregler-sektionen)

---

### 6.10 Strategiskt Resonemang (`strategic.html`)

**Layout:** Sidebar + mötesprogresslinje + huvudinnehåll
**Rollsynlighet:** Alla roller kan läsa. Org-admin+ kan redigera länkar.
**Agendasektion:** Vart är vi på väg och varför? (landningssida för stopp 1)
**Beskrivning:** Strategiskt Resonemang är en summerande bild som vanligtvis bara ändras var 6:e månad. Det ska finnas en länk till det kompletta strategiska resonemanget som kan bestå av ett bildspel med ca 20–40 PPT med bakgrundsfakta.

**Innehåll:**

1. **Strategiskt resonemang** — Länkkort:
   - Beskrivning: "Uppdateras halvårsvis av organisationens strategiansvarig"
   - URL-fält (redigerbart för org-admin+)
   - Senast uppdaterad: datum

2. **Framsteg med strategiskt fokus** — Länkkort:
   - Beskrivning: "Uppdateras månadsvis"
   - URL-fält (redigerbart för org-admin+)
   - Senast uppdaterad: datum

**Interaktioner:** Länkar öppnas i ny flik. Redigering inline (org-admin+).

**Syfte:** Teamet lyfter blicken till ett strategiskt perspektiv, så att den strategiska medvetenheten och energin/sense of urgency ökar.

---

### 6.11 Nyhetsflash (`newsflash.html`)

**Layout:** Sidebar + mötesprogresslinje + huvudinnehåll
**Rollsynlighet:** Alla kan läsa. Team-leader+ kan skapa/redigera/radera.
**Agendasektion:** Vart är vi på väg och varför?
**Beskrivning:** Newsflash är vanligtvis en visuell PPT eller kanske en kort video — något som väcker intresse, reflektion och energi. Hanteras av Team & Team Leader.

**Innehåll:**

1. **"+ Ny nyhetsflash"** knapp (team-leader+)

2. **Nyhetsinlägg** i omvänd kronologisk ordning:
   ```
   ┌──────────────────────────────────────────────────┐
   │ 2026-02-15                                        │
   │ NYTT MÅL FÖR Q1                                  │
   │ Vi har justerat våra Q1-mål baserat på feedback   │
   │ från ledningsgruppen.                             │
   │                                     [Redigera] [✗]│
   └──────────────────────────────────────────────────┘
   ```

**Slide-over: Skapa/redigera nyhetsflash:**
- Datum (default: idag)
- Titel (obligatoriskt)
- Innehåll (textarea)

**Affärsregler:**
- Newsflash kan vara 1–2 "bilder"/inlägg
- Sidan ska vara lätt att editera och kunna anpassas av kunden efter sina behov

---

### 6.12 Arkiv (`archive.html`)

**Layout:** Sidebar + mötesprogresslinje + huvudinnehåll
**Rollsynlighet:** Alla roller
**Agendasektion:** Reflektioner & Lärande
**Beskrivning:** Dit ska teamet enkelt kunna flytta över sådant som inte längre ligger i fokus för det egna arbetet. Tar bort kognitiv vikt så att teamet kan fokusera framåt.

**Innehåll:**

1. **Arkiverade bästa bidrag** — Lista med äldre bästa bidrag som teamet arbetat sig igenom
   - Varje bidrag med sin historiska Starting Point / Desired State
   - Datum för arkivering

2. **Arkiverade delprojekt** — Delprojekt som man jobbat sig igenom och inte längre har som fokus
   - Med sina åtgärder (slutförda)

3. **Arkiverade mätetal & mål** — Graferna ska kunna sparas
   - Historiska mätdiagram bevaras i arkivet

**Syften:**
1. Det stärker teamets självförtroende att då och då titta tillbaka på vad man åstadkommit tillsammans
2. Man kan ibland behöva referera tillbaka till tidigare projekt

**Interaktioner:**
- Ingen redigering i arkivet — enbart läsning
- Arkivering sker från respektive källsida (t.ex. "Arkivera bästa bidrag" på `best-contribution.html`)

---

## 7. Rollsynlighetsmatris

| Sida | member | team_leader | org_admin | integ_admin | super_admin |
|------|--------|-------------|-----------|-------------|-------------|
| Your Dashboard | Läs | Läs | Läs | Läs | Läs |
| Bästa bidrag | Redigera text | + hantera bidrag | Allt | Allt | Allt |
| Mål & Mätetal | CRUD mätningar | + hantera spårade bidrag | Allt | Allt | Allt |
| Handlingsplan | CRUD åtgärder | + hantera bästa bidrag | Allt | Allt | Allt |
| Närvaro | CRUD möten | CRUD möten | CRUD möten | CRUD möten | CRUD möten |
| Teamdokument | CRUD länkar | CRUD länkar | CRUD länkar | CRUD länkar | CRUD länkar |
| Idélogg | CRUD idéer | CRUD idéer | CRUD idéer | CRUD idéer | CRUD idéer |
| Reflektioner | Redigera | Redigera | Redigera | Redigera | Redigera |
| Strategiskt | Läs | Läs | Redigera länkar | Redigera | Redigera |
| Lokomotivmål | Läs | Läs | Redigera | Redigera | Redigera |
| Nyhetsflash | Läs | CRUD inlägg | CRUD inlägg | CRUD inlägg | CRUD inlägg |
| Arkiv | Läs | Läs | Läs | Läs | Läs |
| Admin | Ej åtkomst | Användare-flik | Anv+Team+Org | Alla flikar | Alla flikar |

---

## 8. Delade komponenter

### Återanvänds från V4 admin:
- Toppnavigation, språkväxlare, brödsmulor
- Rollväljare (debug bar)
- Knappar, formulärelement, badges
- Datatabeller, slide-overs, bekräftelsedialoger
- Toast-notiser, segmented controls
- Tomma tillstånd, rollbaserad synlighet (`data-min-role`)
- CSS-variabler (`:root`-tema)

### Nya komponenter:
- **Mötesprogresslinje** — Horisontell linje med 4 cirkulära stopp (●/◉/○), klickbar, visar mötesframsteg
- **Sidebar** — Agendadriven sidopanel (sticky, 260px bred, gul aktiv-markering, sektionsrubriker ej klickbara)
- **FAB** — Flytande åtgärdsknapp (56×56px, gul, offset-skugga)
- **Statistikkort** — Dashboard-kort med ikon och värde
- **Hjältesektion** — Dashboard-hälsning
- **Aktivitetstidslinje** — Dashboard-händelselista
- **Post-it-kort** — Gula idékort (grid-layout)
- **Innehållsblock** — Textmodulbehållare med rubrik och textarea
- **Progressbar** — Mätetal-visualisering (drag-and-drop för completion)
- **Stapel-/kurvdiagram** — Konfigurerbart för mål & mätetal (stapel eller kurva, konfigurerbar tidsaxel)
- **Närvarorutnät** — Tabell med ✓/✗
- **Nyhetskort** — Kronologiska nyhetsblock
- **Team-väljare** — Dropdown i toppnav
- **Arkivkort** — Historiska bästa bidrag och mätdiagram (read-only)

---

## 9. Filorganisation

```
prototypes/v8/
├── admin.html               (befintlig, uppdaterad toppnav)
├── dashboard.html            (Your Dashboard — personlig startsida)
├── best-contribution.html    (Bästa bidrag — teamets gemensamma dashboard)
├── action-plan.html          (Delprojekt & Handlingsplan)
├── goals-metrics.html        (Mål & Mätetal)
├── attendance.html           (Närvaro)
├── documents.html            (Teamdokument)
├── ideas.html                (Idélogg)
├── reflections.html          (Reflektioner & Spelregler)
├── strategic.html            (Strategiskt Resonemang)
├── locomotive-goals.html     (Lokomotivmål)
├── newsflash.html            (Nyhetsflash)
├── archive.html              (Arkiv)
├── mock-data.js              (befintlig — utökas)
├── mock-data-workspace.js    (ny — workspace-data)
├── i18n-sv.js                (befintlig — utökas)
└── i18n-en.js                (befintlig — utökas)
```

### Mock-data (`mock-data-workspace.js`)
- `bestContributions` — Bästa bidrag-objekt (inkl. Starting Point, Desired State, Completion %)
- `areasOfImprovement` — Förbättringsområden
- `actions` — Åtgärder (inkl. mejlpåminnelse-toggle)
- `ideas` — Idéer
- `meetings` — Mötesnärvaro
- `documents` — Dokumentlänkar (inkl. pre-read-flagga)
- `newsflashes` — Nyhetsflashar
- `textModules` — Textinnehåll (spelregler, lärdomar)
- `trackedContributions` — Spårade mätningar
- `measurementInputs` — Mätdatapunkter
- `strategicLinks` — Strategilänkar
- `locomotiveGoals` — Lokomotivmål (1–3 per organisation)
- `archivedItems` — Arkiverade bästa bidrag, delprojekt, mätetal

Refererar användare/team/org från `mock-data.js` via ID.

---

## 10. Designriktlinjer

Alla sidor följer V4-designsystemet (Blaze Lynx-struktur + Sprint Falcon-stil):

- **Accent:** `#ffcc00` (gul)
- **Ram:** `2px solid` svart
- **Hörn:** `border-radius: 0` (skarpa)
- **Skugga vid hover:** `4px 4px 0`
- **Typsnitt:** Inter, versaler för etiketter
- **Toppnav:** Mörk med gul bottenlinje
- **Mötesprogresslinje:** Ljus bakgrund, horisontell linje med cirkulära stopp, under toppnav
- **Språk:** Svenska (SV) standard, engelska (EN) via växlare
- **Fristående:** Varje HTML-fil är komplett med inline CSS/JS
- **Rollväljare:** Alltid synlig längst ner

---

## 11. Responsivt beteende

| Breakpoint | Anpassning |
|-----------|------------|
| ≤ 1024px | Sidebar kollapsar till hamburger-meny |
| ≤ 768px | Kolumner markerade `.col-hide-sm` döljs i tabeller |
| ≤ 480px | Slide-overs helbredd, FAB behålls |

---

## 12. Notifieringsinställningar per team

Team Leader+ kan konfigurera automatiska åtgärdsnotifieringar per team. I prototypen visas detta som en inställningspanel:

- **Placering:** Infällbar panel på `action-plan.html`, synlig för team-leader+ (`data-min-role="team-leader"`)
- **Toggle:** "Automatiska åtgärdsnotifieringar" — på/av per team
- **Beskrivning:** "När aktiverat skickas påminnelser till ansvarig person X dagar innan deadline"
- **Fält:** Antal dagar innan deadline (dropdown: 1, 3, 7, 14)
- **Status sparas i:** `localStorage('itt-notifications-${teamId}')`
- **Visuell indikation:** Liten klocka-ikon i toppnav om notifieringar är aktiva

---

## 13. Byggordning

| Fas | Vad | Beroenden |
|-----|-----|-----------|
| 0 | **Shared layout contract:** Definiera gemensam topnav, mötesprogresslinje, sidebar, breadcrumbs, FAB, role-switch persistence, team-context (localStorage), i18n-init som kopieras till alla filer. Bygg som referens-snippet. | — |
| 1 | `mock-data-workspace.js` + utöka i18n-filer | Fas 0 |
| 2 | `dashboard.html` + `best-contribution.html` | Fas 1 |
| 3 | `action-plan.html` + `goals-metrics.html` + `attendance.html` | Fas 2 |
| 4 | `documents.html` + `ideas.html` + `reflections.html` + `strategic.html` + `locomotive-goals.html` + `newsflash.html` + `archive.html` | Fas 2 |
| 5 | Uppdatera `admin.html` toppnav + rot `index.html` | Fas 3–4 |

---

## 14. Motsägelser och avvikelser med befintlig dokumentation

### Potentiella motsägelser

**14.1 Sidebar vs toppnavigation**
- V4 admin använder **horisontella flikar** för navigation
- Denna spec föreslår **sidebar** för workspace-sidor
- **Motivering:** Agendastrukturen är hierarkisk (4 sektioner × 2–4 moduler = 12 sidor) och passar inte i horisontella flikar. Sidebar följer också det gamla systemet.
- **Risk:** Visuell inkonsistens mellan admin och workspace

**14.2 Separat agendasida (V1–V7) → mötesprogresslinje (V8)**
- Tidigare versioner hade en separat `agenda.html` med agendakort
- Feedback#3 ersätter detta med mötesprogresslinjen + sidebar-navigering
- **Beslut:** Agendasidan tas bort. Progresslinjen och sidebaren ger samma navigering mer integrerat.

**14.3 Önskat Läge som egen sida (V1–V7) → del av Bästa bidrag (V8)**
- Tidigare versioner hade `desired-state.html` som separat sida
- Feedback#3 placerar Starting Point / Desired State som redigerbara textfält direkt på `best-contribution.html`
- **Beslut:** Separat sida tas bort. Informationen lever nu inline på Bästa bidrag-sidan.

**14.4 Avklarade steg som vikbar sektion (V7) → Arkiv som egen sida (V8)**
- Tidigare: vikbar sektion längst ner på `action-plan.html`
- Feedback#3: egen sida `archive.html` med bredare scope (även mätetal, bästa bidrag)
- **Beslut:** Arkiv blir egen sida under Reflektioner & Lärande.

**14.5 Reflektioner + Spelregler: samma sida, två ingångar**
- Sidebar har två separata länkar ("Reflektioner" och "Spelregler") som båda leder till `reflections.html`
- De hänger ihop men man kan söka sig in båda vägarna
- **Beslut:** En sida med ankarlänkar

**14.6 Anpassning-fliken vs statiska sidebar-namn**
- `admin-section-req.md` Anpassning-fliken låter integ-admin byta namn på agendamoduler per organisation
- Sidebar-etiketterna i denna spec använder standardnamn
- **Not:** Prototypen visar bara standardnamn. Implementationen bör stödja anpassade namn.

### Överensstämmelser bekräftade

- 5-nivå rollhierarki: samma som `admin-section-req.md`
- Rollväljare (debug bar): enligt `aaa-base-requirements.md`
- Språkväxling SV/EN: enligt `04-admi-feedback-lasse-19-feb.md`
- V4 designstil (Sprint Falcon + Blaze Lynx): enligt `04-admi-feedback-lasse-19-feb.md`
- Domänobjekt matchar `01-old-system-analysis.md` sektion 3
- Bekräftelsedialoger för destruktiva åtgärder: enligt `aaa-base-requirements.md`
- Klickbara tabellrader: enligt `aaa-base-requirements.md`
- Svenskt gränssnittsspråk: enligt `aaa-base-requirements.md`

---

## 15. Öppna frågor

_(Tidigare öppna frågor 1–3 är nu lösta — se sektion 5.4 (FAB), 12 (notifieringar) och 5.3 (agenda-synlighet))_

Inga kvarstående öppna frågor.
