# Övriga sektioner — Kravspecifikation

Krav som rör delar av Integral Teamwork Toolkit utanför admin-sektionen. Identifierade genom granskning av `reqs/old/old-system/Web Toolkit Adminstrator Manual.docx`, `Web Toolkit User Manual.docx`, V1-prototyper samt `01-old-system-analysis.md` (2026-02-24).

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

Team Workspace innehåller 11 sidor som tillsammans täcker hela Integral Teamwork-agendan. Alla sidor bygger på samma V4-designsystem (Blaze Lynx-struktur + Sprint Falcon-stil).

### 4.2 Sidöversikt

| # | Filnamn | Svensk titel | Agendasektion | Sidtyp |
|---|---------|-------------|---------------|--------|
| 1 | `dashboard.html` | Dashboard | — | Startsida |
| 2 | `agenda.html` | Teamwork Agenda | — | Navigationsöversikt |
| 3 | `strategic.html` | Strategiskt Resonemang | 1. Vart är vi på väg? | Länkmodul |
| 4 | `newsflash.html` | Nyhetsflash | 1. Vart är vi på väg? | Nyhetsmodul |
| 5 | `desired-state.html` | Önskat Läge | 2. Vad siktar vi på? | Textmodul |
| 6 | `goals-metrics.html` | Mål & Mätetal | 2. Vad siktar vi på? | Mätningsmodul |
| 7 | `action-plan.html` | Handlingsplan | 3. Tar vi steg framåt? | Åtgärdsmodul |
| 8 | `documents.html` | Teamdokument | 3. Tar vi steg framåt? | Länkmodul |
| 9 | `ideas.html` | Idélogg | 3. Tar vi steg framåt? | Idémodul |
| 10 | `attendance.html` | Närvaro | 4. Lär vi oss? | Närvaromodul |
| 11 | `reflections.html` | Reflektioner & Spelregler | 4. Lär vi oss? | Textmodul |

### 4.3 Legacy-modul → Ny sida/komponent-mapping

| Legacy-modul (01-old-system-analysis.md) | Ny sida/komponent | Status |
|---|---|---|
| Dashboard (Home) | `dashboard.html` | Full paritet + utökat |
| Agenda (sidebar-navigation) | `agenda.html` + sidebar-komponent | Omdesignad (sidebar + översiktssida) |
| Strategic Reasoning (extern länk) | `strategic.html` | Full paritet |
| Progress with Strategic Focus (extern länk) | `strategic.html` (sektion 2) | Full paritet |
| Newsflash / Chat with NLT | `newsflash.html` | **Avvikelse:** chatdel utelämnad i prototyp, enbart nyhetsflöde |
| Our Current State (textmodul) | `desired-state.html` (sektion 1) | Full paritet |
| Our Desired State (textmodul) | `desired-state.html` (sektion 2) | Full paritet |
| Goals & Metrics / Targets & Measurements | `goals-metrics.html` | Full paritet |
| Action Plan (åtgärdsmodul) | `action-plan.html` | Full paritet |
| Team Documents (länkmodul) | `documents.html` | Full paritet |
| Log of Ideas (idémodul) | `ideas.html` | Full paritet |
| Completed Steps (arkiv) | `action-plan.html` (vikbar sektion) | **Avvikelse:** integrerad i handlingsplan, ej separat sida |
| Attendance (närvaromodul) | `attendance.html` | Full paritet |
| Our Teamwork Rules (textmodul) | `reflections.html` (sektion 1) | **Avvikelse:** kombinerad med Reflektioner |
| Reflections & Learnings (textmodul) | `reflections.html` (sektion 2) | **Avvikelse:** kombinerad med Spelregler |
| Best Contribution CRUD | `action-plan.html` + `goals-metrics.html` | Full paritet |
| Area of Improvement CRUD | `action-plan.html` (inline i bästa bidrag) | Full paritet |
| Floating Action Button | FAB-komponent (alla modulsidor + dashboard) | Full paritet |
| User Menu (language, help) | Toppnavigation | Full paritet |
| Admin (Company/Teams/Users) | `admin.html` (redan byggd) | Redan prototypad |

---

## 5. Navigationsarkitektur

### 5.1 Topnavigation (global, alla sidor)

```
┌───────────────────────────────────────────────────────────────────┐
│ ITT │ [Team Alpha ▾]  Dashboard  Agenda  Admin    [SV│EN]        │
└───────────────────────────────────────────────────────────────────┘
```

| Länk | Synlighet | Mål |
|------|-----------|-----|
| ITT (logotyp) | Alla | `dashboard.html` |
| Team-väljare | Alla (dold om bara 1 team) | Byter team-kontext |
| Dashboard | Alla | `dashboard.html` |
| Agenda | Alla | `agenda.html` |
| Admin | `data-min-role="team-leader"` | `admin.html` |
| SV/EN | `data-min-role="integ-admin"` | Språkväxling |

### 5.2 Sidebar (modulsidor)

Sidopanelen visas på alla modulsidor (sida 3–11) men **inte** på Dashboard eller Agenda.

```
┌──────────────┬──────────────────────────────────────────┐
│  SIDEBAR     │  Huvudinnehåll                            │
│              │                                           │
│ 1 VART ÄR   │                                           │
│   VI PÅ VÄG?│                                           │
│   · Strategi │                                           │
│   · Nyheter  │                                           │
│              │                                           │
│ 2 VAD SIKTAR │                                           │
│   VI PÅ?    │                                           │
│   · Önskat   │                                           │
│   · Mål      │                                           │
│              │                                           │
│ 3 TAR VI     │                                           │
│   STEG?     │                                    [FAB+] │
│   · Plan     │                                           │
│   · Dokument │                                           │
│   · Idéer    │                                           │
│              │                                           │
│ 4 LÄR VI    │                                           │
│   OSS?      │                                           │
│   · Närvaro  │                                           │
│   · Reflek.  │                                           │
└──────────────┴──────────────────────────────────────────┘
```

**Sidebar-struktur (default-agenda):**

| Sektion | Moduler | Mål-fil |
|---------|---------|---------|
| 1. Vart är vi på väg och varför? | Strategiskt resonemang | `strategic.html` |
| | Nyhetsflash | `newsflash.html` |
| 2. Vad siktar vi på? | Vårt önskade läge | `desired-state.html` |
| | Mål & Mätetal | `goals-metrics.html` |
| 3. Tar vi steg framåt? | Handlingsplan | `action-plan.html` |
| | Teamdokument | `documents.html` |
| | Idélogg | `ideas.html` |
| 4. Lär vi oss och växer? | Närvaro | `attendance.html` |
| | Reflektioner & Spelregler | `reflections.html` |

- Sidopanelen är sticky (`position: sticky; top: 52px`)
- Aktiv sida markeras med gul kantlinje till vänster
- Kugghjulsikon synlig för org-admin+ (visuell markering, ej funktionell i prototyp)

### 5.3 Flytande åtgärdsknapp (FAB)

Visas på alla modulsidor (sida 3–11) **och på Dashboard**, men **inte** på Agenda eller Admin. (Legacy-beteende: "Always visible except in admin/agenda edit views")

- Fast position nere till höger (ovanför rollväljaren)
- Klick expanderar meny: **+ Åtgärd**, **+ Idé**
- Alla roller kan använda FAB
- **+ Åtgärd** öppnar slide-over med åtgärdsformulär
- **+ Idé** öppnar slide-over med idéformulär

### 5.4 Brödsmulor

Alla sidor visar brödsmulor under toppnav:

```
Dashboard / Agenda / Handlingsplan
```

### 5.5 Team-kontext och state-strategi

Team-kontexten (vilken team användaren tittar på) hanteras via:

- **localStorage-nyckel:** `itt-team` — innehåller aktuellt team-ID
- **URL-parameter:** `?teamId=xxx` — om angiven, överskriver localStorage
- **Fallback:** om varken localStorage eller URL-param finns, väljs första teamet i användarens lista
- **Vid team-byte:** Team-väljaren uppdaterar `itt-team` i localStorage och laddar om sidan
- **Persistens:** Alla workspace-sidor läser `itt-team` vid sidladdning för att filtrera mock-data

---

## 6. Detaljerade sidspecifikationer

### 6.1 Dashboard (`dashboard.html`)

**Layout:** Helbredd (ingen sidebar)
**Rollsynlighet:** Alla roller

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

4. **Önskat läge (preview)** — Kort sammanfattning av "Vårt nuvarande läge" och "Vårt önskade läge" med "Redigera →"-länk till `desired-state.html`. (Legacy-paritet: dashboard visade preview av current/desired state)

5. **Mål & Mätetal (mini-graf)** — Liten stapeldiagram-preview av spårade bästa bidrag med "Se alla mätetal →"-länk till `goals-metrics.html`. (Legacy-paritet: dashboard visade targets graph)

6. **Senaste aktivitet** — Tidslinje med 5 senaste händelser

7. **Snabblänkar** — Stora klickbara kort till: Handlingsplan, Mål & Mätetal, Teamdokument, Närvaro

**Interaktioner:**
- Statistikkort navigerar till relevant sida vid klick
- Åtgärdsrader öppnar slide-over vid klick
- Snabblänkar navigerar till modulsidor

---

### 6.2 Agenda (`agenda.html`)

**Layout:** Helbredd (ingen sidebar — sidan ÄR navigationsöversikten)
**Rollsynlighet:** Alla roller

**Innehåll:** 4 stora agendakort, ett per sektion:

```
┌───────┬──────────────────────────────────────────────┐
│       │  1. VART ÄR VI PÅ VÄG OCH VARFÖR?           │
│   1   │  Strategiska perspektiv och kommunikation     │
│       │                                               │
│       │  [Strategiskt resonemang]  [Nyhetsflash]      │
└───────┴──────────────────────────────────────────────┘
```

Varje kort har:
- Sektionsnummer i gul panel
- Sektionsrubrik (fetstil versaler)
- Beskrivning (dämpad text)
- Modullänkknappar (outline, offset-skugga vid hover)

**Synlighetstoggle för agendapunkter (team-leader+):**
- Varje modullänk har en ögon-ikon (👁) synlig för team-leader+ (`data-min-role="team-leader"`)
- Klick på ikonen togglar modulens synlighet (visuellt: genomstruken text + dämpad färg)
- Syftet: Team Leader kan dölja agendapunkter inför möten som ej är aktuella
- Dolda moduler försvinner även från sidebar på övriga sidor
- Status sparas per team i `localStorage('itt-agenda-visibility-${teamId}')`

---

### 6.3 Handlingsplan (`action-plan.html`)

**Layout:** Sidebar + huvudinnehåll
**Rollsynlighet:** Alla roller (alla kan skapa/redigera åtgärder)

**Innehåll:**

1. **Verktygsfält:**
   - Personfilter (dropdown: "Alla", teammedlemmar)
   - Statusfilter (segmented control: Alla | Ej startad | Pågående | Försenad | Klar)
   - Sökfält

2. **Bästa bidrag** — Vikbara sektioner per bidrag:
   ```
   ▾ FÖRBÄTTRA KUNDKOMMUNIKATION          [65%]  [Redigera] [Radera]
     Förbättringsområde: Digitala kanaler
     ┌────────┬─────────────┬──────────┬──────────┬──────────┐
     │ Åtgärd │ Ansvarig    │ Stöd av  │ Deadline  │ Status   │
     ├────────┼─────────────┼──────────┼──────────┼──────────┤
     │ Uppd.  │ Anna A.     │ Erik S.  │ 2026-03  │ PÅGÅENDE │
     └────────┴─────────────┴──────────┴──────────┴──────────┘
   ```

3. **Förbättringsområden (Area of Improvement)** — Inline i varje bästa bidrag:
   - **Skapa:** "+ Nytt förbättringsområde"-länk under bästa bidrag → inline textfält
   - **Radera:** ✗-ikon bredvid förbättringsområdets rubrik → bekräftelsedialog:
     "Förbättringsområdet '[Namn]' raderas. Dess åtgärder flyttas till 'Inget förbättringsområde'."
   - **Affärsregel:** Vid radering flyttas alla kopplade åtgärder till det automatiska "Inget förbättringsområde"-området (skapas automatiskt per bästa bidrag)
   - **Affärsregel:** "Inget förbättringsområde" kan inte raderas

4. **Avklarade steg** (vikbar, stängd som standard) — Arkiv med slutförda åtgärder

5. **"+ Nytt bästa bidrag"** knapp (team-leader+)

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

Botten: **Radera åtgärd** (röd, bekräftelsedialog)

**Statusbadge-färger:**
- Ej startad: grå
- Pågående: gul (#ffcc00)
- Försenad: röd
- Klar: grön

---

### 6.4 Mål & Mätetal (`goals-metrics.html`)

**Layout:** Sidebar + huvudinnehåll
**Rollsynlighet:** Alla roller

**Innehåll:**

1. **PDCA-tabell** — Bästa bidrag med PDCA-faser:

   | Bästa bidrag | Plan | Do | Check | Act | Totalt |
   |---|---|---|---|---|---|
   | Kundkommunikation | 100% | 75% | 50% | 25% | 65% |
   | Processeffektivitet | 100% | 100% | 80% | 40% | 80% |

   Varje cell har en liten progress-bar.

2. **Spårade bidrag** — Kort per mätetal:
   - Slutmål, nuvarande värde, förändring
   - Progress-bar
   - Färgmarkering
   - "+ Lägg till bästa bidrag till mätningar"

3. **Stapeldiagram** — CSS-baserat diagram med mätvärden över tid
   - Kryssrutor för att visa/dölja bidrag
   - Y-axel: absoluta värden (enstaka) eller procent (flera)

4. **Mätningsinmatningar** — Vikbar lista med historik
   - "+ Ny mätning" öppnar inline-formulär (datum + numeriska värden)

---

### 6.5 Önskat Läge (`desired-state.html`)

**Layout:** Sidebar + huvudinnehåll
**Rollsynlighet:** Alla roller (alla kan redigera)

**Innehåll:**

1. **Vårt nuvarande läge** — Textblock med redigerbar textarea
   - Hjälptext: "Ange en beskrivning av hur ni upplever att situationen ser ut idag"
   - Sparknapp

2. **Vårt önskade läge** — Samma mönster
   - Hjälptext: "Ange en detaljerad beskrivning av er tänkta situation när ni nått ert mål"
   - Sparknapp

**Interaktioner:** Redigera text + spara → toast "Innehåll sparat"

---

### 6.6 Närvaro (`attendance.html`)

**Layout:** Sidebar + huvudinnehåll
**Rollsynlighet:** Alla roller

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

**Layout:** Sidebar + huvudinnehåll
**Rollsynlighet:** Alla roller

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

---

### 6.8 Idélogg (`ideas.html`)

**Layout:** Sidebar + huvudinnehåll
**Rollsynlighet:** Alla roller

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

**Layout:** Sidebar + huvudinnehåll
**Rollsynlighet:** Alla roller (alla kan redigera)

**Innehåll:**

1. **Våra spelregler för teamwork** — Textmodul:
   - Redigerbar textarea med teamets överenskomna regler
   - Sparknapp

2. **Reflektioner & Lärande** — Textmodul:
   - Hjälptext: "Dokumentera era lärdomar per möte i kronologisk ordning"
   - Redigerbar textarea med löpande text
   - Sparknapp

---

### 6.10 Strategiskt Resonemang (`strategic.html`)

**Layout:** Sidebar + huvudinnehåll
**Rollsynlighet:** Alla roller kan läsa. Org-admin+ kan redigera länkar.

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

---

### 6.11 Nyhetsflash (`newsflash.html`)

**Layout:** Sidebar + huvudinnehåll
**Rollsynlighet:** Alla kan läsa. Team-leader+ kan skapa/redigera/radera.

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

---

## 7. Rollsynlighetsmatris

| Sida | member | team_leader | org_admin | integ_admin | super_admin |
|------|--------|-------------|-----------|-------------|-------------|
| Dashboard | Läs | Läs | Läs | Läs | Läs |
| Agenda | Läs | Läs + synlighetstoggle | Läs + kugghjul | Läs + kugghjul | Läs + kugghjul |
| Handlingsplan | CRUD åtgärder | + hantera bästa bidrag | Allt | Allt | Allt |
| Mål & Mätetal | CRUD mätningar | + hantera spårade bidrag | Allt | Allt | Allt |
| Önskat Läge | Redigera | Redigera | Redigera | Redigera | Redigera |
| Närvaro | CRUD möten | CRUD möten | CRUD möten | CRUD möten | CRUD möten |
| Teamdokument | CRUD länkar | CRUD länkar | CRUD länkar | CRUD länkar | CRUD länkar |
| Idélogg | CRUD idéer | CRUD idéer | CRUD idéer | CRUD idéer | CRUD idéer |
| Reflektioner | Redigera | Redigera | Redigera | Redigera | Redigera |
| Strategiskt | Läs | Läs | Redigera länkar | Redigera | Redigera |
| Nyhetsflash | Läs | CRUD inlägg | CRUD inlägg | CRUD inlägg | CRUD inlägg |
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
- **Sidebar** — Agendadriven sidopanel (sticky, 260px bred, gul aktiv-markering)
- **FAB** — Flytande åtgärdsknapp (56×56px, gul, offset-skugga)
- **Statistikkort** — Dashboard-kort med ikon och värde
- **Hjältesektion** — Dashboard-hälsning
- **Aktivitetstidslinje** — Dashboard-händelselista
- **Agendakort** — Stora navigeringskort för agendasidan
- **Post-it-kort** — Gula idékort (grid-layout)
- **Innehållsblock** — Textmodulbehållare med rubrik och textarea
- **Progressbar** — Mätetal-visualisering
- **Stapeldiagram** — CSS-baserat för mål & mätetal
- **Närvarorutnät** — Tabell med ✓/✗
- **Nyhetskort** — Kronologiska nyhetsblock
- **Team-väljare** — Dropdown i toppnav

---

## 9. Filorganisation

```
prototypes/v4/
├── admin.html               (befintlig)
├── dashboard.html            (ny)
├── agenda.html               (ny)
├── action-plan.html          (ny)
├── goals-metrics.html        (ny)
├── desired-state.html        (ny)
├── attendance.html           (ny)
├── documents.html            (ny)
├── ideas.html                (ny)
├── reflections.html          (ny)
├── strategic.html            (ny)
├── newsflash.html            (ny)
├── mock-data.js              (befintlig — utökas)
├── mock-data-workspace.js    (ny — workspace-data)
├── i18n-sv.js                (befintlig — utökas)
└── i18n-en.js                (befintlig — utökas)
```

### Mock-data (`mock-data-workspace.js`)
- `bestContributions` — Bästa bidrag-objekt
- `areasOfImprovement` — Förbättringsområden
- `actions` — Åtgärder
- `ideas` — Idéer
- `meetings` — Mötesnärvaro
- `documents` — Dokumentlänkar
- `newsflashes` — Nyhetsflashar
- `textModules` — Textinnehåll (önskat läge, lärdomar, spelregler)
- `trackedContributions` — Spårade mätningar
- `measurementInputs` — Mätdatapunkter
- `strategicLinks` — Strategilänkar

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
| 0 | **Shared layout contract:** Definiera gemensam topnav, sidebar, breadcrumbs, FAB, role-switch persistence, team-context (localStorage), i18n-init som kopieras till alla filer. Bygg som referens-snippet. | — |
| 1 | `mock-data-workspace.js` + utöka i18n-filer | Fas 0 |
| 2 | `dashboard.html` + `agenda.html` | Fas 1 |
| 3 | `action-plan.html` + `goals-metrics.html` + `attendance.html` | Fas 2 |
| 4 | `documents.html` + `ideas.html` + `desired-state.html` + `reflections.html` + `strategic.html` + `newsflash.html` | Fas 2 |
| 5 | Uppdatera `admin.html` toppnav + rot `index.html` | Fas 3–4 |

---

## 14. Motsägelser och avvikelser med befintlig dokumentation

### ⚠️ Potentiella motsägelser

**13.1 Sidebar vs toppnavigation**
- V4 admin använder **horisontella flikar** för navigation
- Denna spec föreslår **sidebar** för workspace-sidor
- **Motivering:** Agendastrukturen är hierarkisk (4 sektioner × 2–3 moduler = 9 sidor) och passar inte i horisontella flikar. Sidebar följer också det gamla systemet (`01-old-system-analysis.md` sektion 4.1)
- **Risk:** Visuell inkonsistens mellan admin och workspace

**13.2 Närvaro-sektion: sektion 4 (denna spec) vs sektion 1 (gammal navigeringskarta)**
- `01-old-system-analysis.md` sektion 4.2 placerar Närvaro under "Where are we headed?" (sektion 1)
- Men default-agendan i sektion 3.4 av samma dokument placerar Närvaro under "Are we learning & growing?" (sektion 4)
- **Beslut:** Följer agendasektionen 4, som matchar v2-kravspec:s agendamodell

**13.3 Reflektioner + Spelregler som EN sida vs TVÅ separata moduler**
- `01-old-system-analysis.md` har "Our Teamwork Rules" och "Reflections & Learnings" som separata moduler
- V1-prototypen hade dem kombinerade på en sida
- **Beslut:** Kombineras till en sida för enkelhet. Båda är enkla textmoduler.

**13.4 Team-väljare i toppnav vs incognito-fönster (gammalt system)**
- Gamla systemet krävde incognito-fönster för att byta team
- **Beslut:** Modern approach — team-väljare som dropdown

**13.5 FAB på Dashboard — LÖST**
- `01-old-system-analysis.md` sektion 6.6: FAB "alltid synlig utom i admin/agendaredigering"
- **Beslut:** FAB visas även på Dashboard (enligt legacy-beteende)

**13.6 Avklarade steg som vikbar sektion vs separat sida**
- Gamla systemet nämner "Completed Steps" som separat agendapunkt under sektion 3
- **Beslut:** Implementeras som vikbar sektion längst ner på `action-plan.html`

**13.7 Anpassning-fliken vs statiska sidebar-namn**
- `admin-section-req.md` Anpassning-fliken låter integ-admin byta namn på agendamoduler per organisation
- Sidebar-etiketterna i denna spec använder standardnamn
- **Not:** Prototypen visar bara standardnamn. Implementationen bör stödja anpassade namn.

### ✅ Överensstämmelser bekräftade

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

_(Tidigare öppna frågor 1–3 är nu lösta — se sektion 5.3 (FAB), 12 (notifieringar) och 6.2 (agenda-synlighet))_

Inga kvarstående öppna frågor.
