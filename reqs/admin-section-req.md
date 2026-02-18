# Admin-sektion — Komplett specifikation

Specifikation för administrationsdelen (nav Admin) i Integral Teamwork Toolkit. Omfattar domänmodell, behörigheter, navigering, UI-flöden och redigeringsmönster.

---

## 0. Källdokument och spårbarhet

### Inkorporerade kravdokument

| # | Fil | Status | Inkorp. datum | Beskrivning |
|---|-----|--------|---------------|-------------|
| 01 | `reqs/01-old-system-analysis.md` | Fullt inkorporerad | 2026-01 | Systemanalys av gamla Web Toolkit — domänmodell, roller, behörigheter, entiteter, affärsregler |
| 02 | `reqs/02-gui-gap-analysis.md` | Fullt inkorporerad | 2026-02 | Sammanställning av Codex/Gemini/UX-granskningar — ett-klick-flöde, laddningstillstånd, paginering, ARIA, avvikelsesektion |
| 03 | `reqs/03-admin-feedback-lasse.md` | Fullt inkorporerad | 2026-02-17 | Lasses feedback: 5 rollnivåer (inkl. Integ Customer Admin), anpassningsbar terminologi, abonnemangsstruktur, aktions-notifieringar, agenda-synlighet per möte |

### Originalkällor (i `reqs/old/`)

- `Kravspec In-house Toolkit.pptx` — Kravspecifikation v1
- `Kravspec In-house Toolkit(v2).pptx` — Kravspecifikation v2
- `Web Toolkit Intro Swe.pptx` — Produktintroduktion
- Skärmdumpar av befintligt system (3 st)
- `old-system/` — Äldre systemdokumentation

### Relaterade prototyper

| Version | Prototyp | Beskrivning |
|---------|----------|-------------|
| v1 | `prototypes/v1/site-{a..e}-*/admin.html` | 5 designvarianter (Precision, Warmth, Boldness, Sophistication, Drawer) |
| v2 | `prototypes/v2/claude-c-boldness/admin.html` | Claude-genererad — fullständig klickbar prototyp med slide-overs, filter, paginering |
| v2 | `prototypes/v2/codex-c-boldness/index.html` | Codex-genererad admin-prototyp |
| v2 | `prototypes/v2/gemini-admin/index.html` | Gemini-genererad admin — **vald som design-riktning** (ren, översiktlig, lättarbetad) |

**Design-beslut (från 03):** Geminis UI valdes som riktning för sin renhet och överskådlighet. Funktionalitet från Claude/Codex-prototyperna inkorporeras i Gemini-stilen.

---

## 1. Domänmodell

### 1.1 ER-diagram

```
Organisation 1───* Team
Organisation *───* User (via UserOrganization)
Team *───* User (via TeamMembership)
```

### 1.2 Entiteter

#### Organisation

| Attribut | Typ | Obligatoriskt | Redigerbar | Beskrivning |
|---|---|---|---|---|
| id | UUID/Int | Auto | Nej | Primärnyckel |
| title | String | Ja | Ja (Super Admin) | Organisationsnamn, sorterbart |
| details | Text | Nej | Ja (Super Admin) | Beskrivning av organisationen |
| subscriptionTier | Enum | Ja | Ja (Super Admin) | `basic`, `plus`, `pro` |

**Relationer:**
- Har många Team
- Har många User (via UserOrganization)

**Affärsregler:**
- Kan bara raderas om den har 0 team och 0 användare (UserOrganization)

#### Team

| Attribut | Typ | Obligatoriskt | Redigerbar | Beskrivning |
|---|---|---|---|---|
| id | UUID/Int | Auto | Nej | Primärnyckel |
| title | String | Ja | Ja | Teamnamn, sorterbart |
| organization | FK → Organisation | Ja | Nej (read-only efter skapande) | Teamet tillhör exakt en organisation |

**Relationer:**
- Tillhör exakt en Organisation
- Har många TeamMembership (→ User)
- Har en Agenda (auto-genererad vid skapande)

**Affärsregler:**
- Kan bara raderas om teamet har 0 medlemmar (inga TeamMembership)
- Vid skapande auto-genereras en default-agenda med sektioner och moduler

#### User

| Attribut | Typ | Obligatoriskt | Redigerbar av admin | Beskrivning |
|---|---|---|---|---|
| id | UUID/Int | Auto | Nej | Primärnyckel |
| firstName | String | Ja | Ja | Sätts av användaren vid signup |
| lastName | String | Ja | Ja | Sätts av användaren vid signup |
| email | String | Ja | Nej (read-only) | Globalt unik i hela systemet. Sätts vid inbjudan. |
| username | String | Nej | Ja | Valfritt alternativt visningsnamn/login-ID |
| phone | String | Nej | Ja | |
| description | Text | Nej | Ja | |
| systemRole | Enum | Nej | Ja (begränsat) | `super_admin`, `integ_admin`, `org_admin`, eller `null` |
| chatRole | Enum | Nej | Ja (begränsat) | `base`, `coach`, `boss`. Default: `base`. Synlig och redigerbar enbart för `integ_admin` och `super_admin`. |
| registerDate | Date | Auto | Nej | Sätts vid registrering |
| registerStatus | Enum | Auto | Nej | `registered`, `pending` |
| lastActive | Date | Auto | Nej | Senaste aktivitet |

**Relationer:**
- Tillhör en eller flera organisationer (via UserOrganization)

**Affärsregler:**
- `email` är unikt över hela systemet
- En användare kan tillhöra flera organisationer (via UserOrganization). Primärt relevant för administratörer (`integ_admin`, `org_admin`) men modellerat som en generell regel för alla användare.
- Användare skapas via e-postinbjudan, inte direkt
- Super admins läggs till manuellt i databasen (ingen inbjudan)
- Nya användare startar alltid som vanlig användare (systemRole = null)
- `systemRole` är global — en `org_admin` har admin-behörighet i **alla** sina organisationer. Om en person enbart ska vara admin i en org, lägg bara till den org:en i deras UserOrganization.
- Soft delete anonymiserar persondata (ersätter med `*****`) men behåller systemreferenser
- Admins kan inte avaktivera sig själva
- Admins kan inte redigera/avaktivera användare med högre eller samma systemroll
- `chatRole` bestämmer användarens roll i chatten: `base` (standard), `coach`, eller `boss`. Fältet är enbart synligt och redigerbart för `integ_admin` och `super_admin`.
- Väntande användare (`registerStatus = pending`): admin kan ändra teamtillhörighet och teamroll, men personuppgifter (namn, telefon, beskrivning) fylls i av användaren vid signup och visas som tomma/read-only tills dess
- Väntande användare kan inte soft-deletas — admin kan istället återkalla inbjudan

#### UserOrganization (junction-tabell)

| Attribut | Typ | Obligatoriskt | Redigerbar | Beskrivning |
|---|---|---|---|---|
| user | FK → User | Ja | — | |
| organization | FK → Organisation | Ja | — | |
| isPrimary | Boolean | Ja | Ja | Default-org vid inloggning. Exakt en per user måste vara `true`. |

**Affärsregler:**
- En användare måste ha minst en UserOrganization
- Exakt en UserOrganization per användare ska ha `isPrimary = true`
- `isPrimary` avgör vilken organisation som visas som standard vid inloggning
- Unik kombination av (user, organization)

#### TeamMembership (junction-tabell med attribut)

| Attribut | Typ | Obligatoriskt | Redigerbar | Beskrivning |
|---|---|---|---|---|
| team | FK → Team | Ja | Ja (byta = ta bort + lägg till) | |
| user | FK → User | Ja | — | |
| teamRole | Enum | Ja | Ja | `team_leader`, `member` |
| joinedDate | Date | Auto | Nej | Sätts vid tillägg |

**Constraint:** `membership.team.organization` måste finnas bland användarens organisationer (UserOrganization). En användare kan bara vara med i team som tillhör en organisation som användaren är medlem i.

**Affärsregler:**
- En användare kan vara `team_leader` i flera team samtidigt
- En användare kan ha olika roller i olika team (leader i ett, member i ett annat)
- En användare måste ha minst ett team-medlemskap
- Unik kombination av (team, user) — en användare kan bara ha ett medlemskap per team

### 1.3 Rollmodell — två nivåer, fem steg

| Nivå | Attribut | Plats | Värden | Beskrivning |
|---|---|---|---|---|
| **Systemnivå** | `systemRole` | User | `super_admin`, `integ_admin`, `org_admin`, `null` | Global behörighet, oberoende av team |
| **Teamnivå** | `teamRole` | TeamMembership | `team_leader`, `member` | Per team-medlemskap |

#### Rollhierarki (5 nivåer, ref. krav 03)

```
1. super_admin   (Integ Super Admin)    — Hela systemet, alla organisationer
2. integ_admin   (Integ Customer Admin) — Sina organisationer (via UserOrganization)
3. org_admin     (Organisation Admin)   — Sina organisationer (via UserOrganization)
4. team_leader   (Team Leader)          — Specifika team där rollen är satt
5. member        (Medlem/User)          — Basmedlem i specifika team
```

**Rollmappning mot Lasses terminologi (03):**

| Lasses nivå | Tekniskt namn | Typisk person |
|---|---|---|
| (1) User | `member` | Teammedlem hos kund |
| (2) Team Leader | `team_leader` | Teamledare hos kund |
| (3) Organisation Admin | `org_admin` | Kundadministratör |
| (4) Integ Customer Admin | `integ_admin` | Integ-anställd med kundorganisationer |
| (5) Integ Super Admin | `super_admin` | Integ-systemadministratör |

#### Effektiv roll (beräknad)

```
effektivRoll(user, team) =
  userOrgs = user.organizations (via UserOrganization)
  if user.systemRole == 'super_admin'                          → super_admin
  if user.systemRole == 'integ_admin' && team.org ∈ userOrgs   → integ_admin
  if user.systemRole == 'org_admin' && team.org ∈ userOrgs     → org_admin
  membership = user.memberships.find(team)
  if membership?.teamRole == 'team_leader'                     → team_leader
  if membership?.teamRole == 'member'                          → member
  else                                                         → no_access
```

Systemrollen övertrumfar alltid teamrollen men kräver (utom för `super_admin`) att användaren har en UserOrganization-koppling till teamets organisation. En `org_admin` som är `member` i ett team har fortfarande full org_admin-behörighet i det teamet. En `integ_admin` eller `org_admin` utan UserOrganization-koppling till en organisation har `no_access` i den.

### 1.4 Status-enum

| Värde | Visningsnamn | Färg |
|---|---|---|
| `registered` | AKTIV | Grön (`--success`) |
| `pending` | VÄNTANDE | Orange (`--warning`) |
| `soft_deleted` | AVAKTIVERAD | Röd (`--error`) |

### 1.5 Abonnemangsnivåer

| Nivå | Alternativa namn | Pris | Innehåll |
|---|---|---|---|
| **basic** | Base / MVP1 | 19 SEK/anv/mån eller 190 SEK/team/mån | Tillgång till Web Toolkit, driftsupport |
| **plus** | Boss / MVP2 | 39 SEK/anv/mån eller 390 SEK/team/mån | Basic + skapande av org/team-strukturer, kom-igång-support (<8h), teamledarträning (1h), instruktionsvideor (Sve/Eng), användarsupport (<8h/mån) |
| **pro** | Coach / MVP3 | 49 SEK/anv/mån eller 490 SEK/team/mån | Plus + användaranalyser 1 gång/mån, AI-Coachstöd till ledare, instruktionsvideor (10 språk) |

> **Notering (från krav 03):** Mappningen basic↔Base/MVP1, plus↔Boss/MVP2, pro↔Coach/MVP3 är preliminär. Exakt namngivning och paketinnehåll justeras senare. Abonnemangshantering i admin-gränssnittet visas enbart för `integ_admin` och `super_admin`.

---

## 2. Navigering

### 2.1 Admin-knappen i huvudnavigeringen

| Roll | Ser Admin-knappen? |
|---|---|
| Super Admin | Ja |
| Integ Admin | Ja |
| Org Admin | Ja |
| Team Leader (i minst ett team) | Ja |
| Enbart Member (alla team) | **Nej** |

Admin-länken (kugghjulsikon + "Admin") renderas villkorligt. Teammedlemmar utan team_leader-roll i något team ser aldrig Admin-knappen.

### 2.2 Admin-sektionens undernavigering

Horisontella tabs direkt under sidrubriken "ADMINISTRATION":

```
┌────────────┐ ┌──────────┐ ┌──────────────┐ ┌─────────────┐
│ ANVÄNDARE  │ │  TEAM    │ │ ORGANISATION │ │ ANPASSNING  │
└────────────┘ └──────────┘ └──────────────┘ └─────────────┘
```

#### Synlighet per roll

| Flik | Super Admin | Integ Admin | Org Admin | Team Leader |
|---|---|---|---|---|
| **Användare** | Ja — alla i vald org | Ja — sina orgs | Ja — sina orgs | Ja — eget teams användare |
| **Team** | Ja — alla i vald org | Ja — sina orgs | Ja — team i sina orgs | Dold |
| **Organisation** | Ja — alla orgs, CRUD | Ja — sina orgs, CRUD | Ja — sina orgs, read-only | Dold |
| **Anpassning** | Ja | Ja | Dold | Dold |

#### Feature-gating baserat på abonnemang

| Funktion | Basic (Base) | Plus (Boss) | Pro (Coach) |
|---|---|---|---|
| Användare-flik | Ja | Ja | Ja |
| Bjud in användare | Ja | Ja | Ja |
| Redigera användare | Ja | Ja | Ja |
| Skapa/redigera team | Nej (görs av Integ) | Ja | Ja |
| Skapa/redigera org-struktur | Nej (görs av Integ) | Ja | Ja |
| Användaranalyser (framtida flik) | Nej | Nej | Ja |
| AI-Coachstöd | Nej | Nej | Ja |

> **Notering:** Abonnemangsnivå visas och kan ändras enbart av `integ_admin` och `super_admin`. `org_admin` ser nivån som read-only.

---

## 3. Användare-fliken

### 3.1 Organisationsväljare

Överst på sidan finns en dropdown som filtrerar användarlistan till en specifik organisation.

| Roll | Organisationer i dropdown |
|---|---|
| Super Admin | "Alla organisationer" (default) + alla organisationer i systemet |
| Integ Admin | Sina organisationer (via UserOrganization). Om fler än en: dropdown. Om bara en: dold. |
| Org Admin | Sina organisationer (via UserOrganization). Om fler än en: dropdown. Om bara en: dold. |
| Team Leader | Dold (ser bara sina team direkt) |

Vid "Alla organisationer" visas en extra kolumn "Organisation" i användartabellen. Om systemet har fler än 10 organisationer bör dropdownen vara sökbar (combobox-mönster).

Filtret: `users WHERE organization = vald org` (eller alla om "Alla organisationer" är valt)

### 3.2 Användarlistan (tabell)

#### Kolumner

| # | Kolumn | Sorterbar | Beskrivning |
|---|---|---|---|
| 1 | **Namn** | Ja (A-Ö) | Förnamn + Efternamn. Klickbar — öppnar slide-over. Leader-ikon visas vid namn om användaren är team_leader i minst ett team. |
| 2 | **Username** | Ja | Valfritt alternativt namn, kan vara tomt |
| 3 | **E-post** | Ja | Klickbar (mailto:) |
| 4 | **Registreringsstatus** | Ja | Badge: AKTIV / VÄNTANDE / AVAKTIVERAD |
| 5 | **Systemroll** | Ja | Badge: "Super admin" / "Integ admin" / "Org admin" / "User". **Kolumnen visas enbart för `integ_admin` och `super_admin`** (ref. krav 03). |
| 6 | **Chattroll** | Ja | Badge: "Base" / "Coach" / "Boss". **Kolumnen visas enbart för `integ_admin` och `super_admin`**. |

**Notera:** Team-tillhörighet och teamroll visas **inte** i tabellen — det visas i slide-over-panelen.

#### Filter-rad ovanför tabellen

```
┌───────────────────────────────────────────────────────────────┐
│ Sök namn eller e-post...    │ Systemroll: [Alla] [Super     │
│                              │ Admin] [Integ Admin] [Org      │
│                              │ Admin] [User]                  │
│                              │                                │
│ Status: [Alla] [Aktiv] [Väntande] [Avaktiverad]              │
└───────────────────────────────────────────────────────────────┘
```

- Sökfältet filtrerar på namn och e-post med realtidsfiltrering (debounce 300ms)
- Roll- och statusfilter implementeras som segmented controls (single-select). Bara ett värde kan vara aktivt per filtergrupp. Default: "Alla".
- **Systemroll-filtret visas enbart för `integ_admin` och `super_admin`** (samma villkor som systemroll-kolumnen).

#### Sortering

- Bara en kolumn kan sorteras åt gången
- Default: Namn stigande (A-Ö)
- Klick på kolumnrubrik togglar asc/desc

#### Åtgärder i tabellen

Inga inline-redigeringar. Tabellen är enbart för visning och navigation:

- **Klick på namn** → öppnar slide-over-panelen (redigering om behörighet, annars read-only)
- Inga separata detalj-modaler — slide-over-panelen fungerar som både detaljvy och redigeringsvy

#### Paginering

```
Visar 1–25 av 147 användare    [< Föregående]  1  2  3  ...  6  [Nästa >]
```

- Server-side paginering, 25 poster per sida
- Visar alltid totalt antal
- Filter och sökning återställer till sida 1

### 3.3 Slide-over-panel (detalj + redigering)

Öppnas via klick på användarnamn i tabellen. Panelen glider in från höger. Listan tonas/dimmas i bakgrunden.

Admins med behörighet ser redigerbara formulärfält. Användare utan redigeringsbehörighet (t.ex. Team Leader) ser samma panel men med alla fält som read-only text.

```
╔══════════════════════════════════╗
║  ANVÄNDARE: ANNA ANDERSSON       ║
║                                  ║
║  ── PERSONUPPGIFTER ──────────── ║
║  Förnamn:    [Anna             ] ║
║  Efternamn:  [Andersson        ] ║
║  E-post:     anna@foretag.se     ║
║              (read-only)         ║
║  Username:   [anna.a           ] ║
║  Telefon:    [070-123 45 67    ] ║
║  Beskrivning:[                 ] ║
║                                  ║
║  ── SYSTEMROLL ───────────────── ║
║  (●) Ingen systemroll            ║
║  ( ) Org Admin                   ║
║  ( ) Integ Admin                 ║
║  ( ) Super Admin                 ║
║                                  ║
║  ── TEAM-MEDLEMSKAP (2) ──────── ║
║                                  ║
║  ┌──────────┬──────────────┬───┐ ║
║  │ Team     │ Roll         │   │ ║
║  ├──────────┼──────────────┼───┤ ║
║  │ Alpha    │ [Team Leader▾] │ × │ ║
║  │ Beta     │ [Medlem     ▾] │ × │ ║
║  └──────────┴──────────────┴───┘ ║
║                                  ║
║  [+ LÄGG TILL I TEAM]           ║
║                                  ║
║  ── ORGANISATIONER (1) ───────── ║
║  Företag AB          (primär) [×]║
║  [+ LÄGG TILL I ORGANISATION]   ║
║                                  ║
║  ── INFORMATION ──────────────── ║
║  Registrerad:  2025-06-01        ║
║  Status:       AKTIV             ║
║  Senast aktiv: 2026-01-27        ║
║                                  ║
║  [SPARA ÄNDRINGAR]  [AVBRYT]    ║
║                                  ║
║  ── FARLIGA ÅTGÄRDER ────────── ║
║  [AVAKTIVERA KONTO]             ║
╚══════════════════════════════════╝
```

#### Fält i panelen

| Fält | Typ | Redigerbar | Visningsvillkor |
|---|---|---|---|
| Förnamn | Text input | Ja | Alltid |
| Efternamn | Text input | Ja | Alltid |
| E-post | Text (read-only) | Nej | Alltid |
| Username | Text input | Ja | Alltid |
| Telefon | Text input | Ja | Alltid |
| Beskrivning | Textarea | Ja | Alltid |
| Systemroll | Radio buttons | Ja (begränsat) | Alltid |
| Chattroll | Radio buttons | Ja (begränsat) | Enbart för `integ_admin` och `super_admin`. Värden: Base, Coach, Boss. |
| Team-medlemskap | Kompakt tabell med inline-dropdown | Ja (se nedan) | Alltid |
| Organisationer | Lista med primär-markering | Ja (se nedan) | Alltid |
| Registreringsdatum | Text (read-only) | Nej | Alltid |
| Registreringsstatus | Badge (read-only) | Nej | Alltid |
| Senast aktiv | Text (read-only) | Nej | Alltid |

#### Begränsningar vid systemrollredigering

| Inloggad som | Kan sätta systemroll till |
|---|---|
| Super Admin | `integ_admin`, `org_admin`, `null` (inte `super_admin`) |
| Integ Admin | `org_admin`, `null` (inom sina orgs, inte `integ_admin` eller högre) |
| Org Admin | Nej — kan inte ändra systemroller |
| Team Leader | Nej — ser panelen som read-only |

Vid systemrollförändring visas en bekräftelsedialog:
> "Är du säker på att du vill ändra [Namn]s systemroll till [Ny roll]? Detta påverkar vilka funktioner användaren har tillgång till i hela organisationen."

Om den sista `org_admin` i en organisation degraderas till `null` visas extra varning:
> "Det finns inga andra administratörer i denna organisation. Om du fortsätter kommer organisationen sakna administratör."

#### Team-medlemskap i panelen

Medlemskap visas som en kompakt tabell med en rad per team:
- Teamnamn (text, read-only)
- Teamroll (inline-dropdown: `Team Leader` / `Medlem`)
- Ta bort-knapp (×) — destruktiv, kräver bekräftelse

Bekräftelsedialog vid borttagning från team:
> "[Namn] förlorar tillgång till [Teamnamn] och dess data (åtgärder, idéer, mätningar). Vill du fortsätta?"
>
> [AVBRYT] [TA BORT ÄNDÅ]

**"+ Lägg till i team"** visar en dropdown med team i användarens organisationer (alla UserOrganization-kopplingar) som användaren inte redan är med i.

Begränsningar:
- Sista medlemskapet kan inte tas bort — felmeddelande: "Användaren måste tillhöra minst ett team."
- Dropdown vid "Lägg till i team" visar team inom alla organisationer användaren tillhör

#### Organisationsmedlemskap i panelen

Organisationer visas som en lista med en rad per organisation:
- Organisationsnamn (text)
- Primär-markering (badge "primär" på den som har `isPrimary = true`)
- Ta bort-knapp (×) — destruktiv, kräver bekräftelse

**"+ Lägg till i organisation"** visar en dropdown med organisationer användaren inte redan tillhör. Visas enbart för `integ_admin` och `super_admin`.

Begränsningar:
- Sista organisationsmedlemskapet kan inte tas bort — felmeddelande: "Användaren måste tillhöra minst en organisation."
- Om den primära organisationen tas bort sätts en annan automatiskt som primär
- `org_admin` och lägre kan enbart lägga till/ta bort organisationer inom sitt eget scope

#### Vem kan ändra teamroll?

| Inloggad som | Kan ändra teamroll? |
|---|---|
| Super Admin | Ja — alla team |
| Integ Admin | Ja — team i sina organisationer |
| Org Admin | Ja — team i sina orgsanisation |
| Team Leader | Nej |

#### Avaktivering (soft delete)

Knappen "AVAKTIVERA KONTO" placeras nederst under visuell separator. Röd färg.

Bekräftelsedialog:
> "Är du säker på att du vill avaktivera [Namn]? Användarens personuppgifter anonymiseras. Denna åtgärd kan inte ångras."
>
> [AVBRYT] [AVAKTIVERA ÄNDÅ]

Regler:
- Admins kan inte avaktivera sig själva
- Admins kan inte avaktivera användare med högre eller samma systemroll
- Anonymiserar data (ersätter med `*****`) men behåller systemreferenser

### 3.5 Bjud in användare

Knappen "BJUD IN ANVÄNDARE" visas ovanför tabellen. Öppnar en slide-over panel med två tabbar: **Enskild** och **Bulk-import**.

```
╔══════════════════════════════════╗
║  BJUD IN ANVÄNDARE               ║
║                                  ║
║  [ENSKILD]   [BULK-IMPORT]      ║
║  ─────────────────────────────── ║
║                                  ║
║  (Innehåll baserat på vald flik) ║
╚══════════════════════════════════╝
```

**Flik: Enskild**

```
║  E-postadress: [               ] ║
║                                  ║
║  Välj team:                      ║
║  ☑ Team Alpha                    ║
║  ☐ Team Beta                     ║
║  ☐ Team Gamma                    ║
║                                  ║
║  (Användaren får rollen "Medlem" ║
║   i alla valda team. Befordran   ║
║   görs efter registrering.)      ║
║                                  ║
║  [SKICKA INBJUDAN]              ║
```

**Flik: Bulk-import (CSV)**

Stegbaserat flöde:

1. **Ladda upp** — Välj CSV-fil (en e-postadress per rad) + välj team (checkboxar)
2. **Granska** — Validerade e-poster visas i lista. Fel markeras i rött (ogiltigt format, dubbletter, redan registrerade). Användaren kan ta bort rader.
3. **Bekräfta** — "Skicka [X] inbjudningar ([Y] överhoppade)"
4. **Resultat** — "[X] skickade, [Y] misslyckades" med möjlighet att ladda ner fellista

#### Synlighet av team i inbjudan

| Inloggad som | Synliga team i formuläret |
|---|---|
| Super Admin | Alla team i vald organisation |
| Integ Admin | Alla team i sina organisationer |
| Org Admin | Alla team i sina organisationer |
| Team Leader | Bara team där man själv är team_leader |

#### Affärsregler vid inbjudan

- Nya användare får alltid `systemRole = null` och `teamRole = member`
- Organisationsmedlemskap (UserOrganization) skapas automatiskt för den/de organisationer som de valda teamen tillhör
- Minst ett team måste väljas
- Om e-postadressen redan finns i systemet: användaren läggs till i de valda teamen (och organisationerna om de inte redan är med). Inget nytt konto skapas.
- CSV-import: en e-postadress per rad, validering av format, dubbletter markeras

---

## 4. Team-fliken

### 4.1 Synlighet

| Roll | Ser team-fliken? | Scope |
|---|---|---|
| Super Admin | Ja | Alla team i vald organisation |
| Integ Admin | Ja | Alla team i sina organisationer |
| Org Admin | Ja | Alla team i sina organisationer |
| Team Leader | Nej | — |

### 4.2 Team-listan

```
┌─────────┬──────────┬──────────────┬───────┐
│ TITEL   │ MEDLEMMAR│ TEAM LEADER  │ ÅTGÄRD│
├─────────┼──────────┼──────────────┼───────┤
│ Alpha   │ 8        │ Anna A.      │ ✏️ 🗑  │
│ Beta    │ 5        │ Erik S.      │ ✏️ 🗑  │
│ Gamma   │ 3        │ (ingen)      │ ✏️ 🗑  │
└─────────┴──────────┴──────────────┴───────┘
```

Kolumner:

| # | Kolumn | Sorterbar | Beskrivning |
|---|---|---|---|
| 1 | **Titel** | Ja | Teamnamn |
| 2 | **Medlemmar** | Ja | Antal TeamMembership |
| 3 | **Team Leader** | Nej | Namn på användare med teamRole=team_leader (kan vara flera) |
| 4 | **Åtgärder** | Nej | Redigera / Radera |

### 4.3 Skapa team

Knappen "+ SKAPA TEAM" ovanför listan. Öppnar slide-over.

| Fält | Typ | Beskrivning |
|---|---|---|
| Titel | Text input, obligatoriskt | Teamnamn |
| Organisation | Dropdown (Super Admin/Integ Admin med flera orgs) / Förifylld read-only (Org Admin) | Sätts vid skapande, read-only därefter |

Vid skapande: default-agenda med sektioner och moduler auto-genereras.

### 4.4 Redigera team (slide-over)

```
╔══════════════════════════════════╗
║  REDIGERA TEAM                   ║
║                                  ║
║  Titel: [Team Alpha            ] ║
║  Organisation: Företag AB        ║
║              (read-only)         ║
║                                  ║
║  ── MEDLEMMAR (8) ─────────────  ║
║                                  ║
║  Anna Andersson    [TEAM LEADER] ║
║  Erik Svensson     [MEDLEM]  [×] ║
║  Maria Johansson   [MEDLEM]  [×] ║
║  Lars Nilsson      [MEDLEM]  [×] ║
║  ...                             ║
║                                  ║
║  [+ LÄGG TILL MEDLEM]           ║
║                                  ║
║  [SPARA]  [AVBRYT]              ║
║                                  ║
║  ── FARLIGA ÅTGÄRDER ────────── ║
║  [RADERA TEAM]                   ║
╚══════════════════════════════════╝
```

Från team-redigering kan man:
- Ändra teamnamn
- Se alla medlemmar med deras teamroll
- Klicka på roll-badge för att toggla team_leader/member
- Ta bort medlem från teamet (×-knapp)
- Lägga till befintlig användare (från samma org) via dropdown
- Klicka på medlemsnamn → öppnar redigera-användare-panelen

### 4.5 Radera team

Kan bara raderas om teamet har 0 medlemmar.

Om medlemmar finns: "Teamet kan inte raderas eftersom det har [X] aktiva medlemmar. Ta bort alla medlemmar först."

Om 0 medlemmar, bekräftelsedialog:
> "Är du säker på att du vill radera teamet [Namn]? Teamets agenda och all kopplad data (åtgärder, idéer, mätningar) raderas permanent."
>
> [AVBRYT] [RADERA ÄNDÅ]

---

## 5. Organisation-fliken

### 5.1 Synlighet

| Roll | Ser fliken? | Scope |
|---|---|---|
| Super Admin | Ja — full CRUD | Alla organisationer |
| Integ Admin | Ja — full CRUD | Sina organisationer |
| Org Admin | Ja — read-only | Sina organisationer |
| Team Leader | Nej | — |

### 5.2 Super Admin / Integ Admin-vy: Organisationslista

> Integ Admin ser samma vy men filtrerad till sina sina organisationer.

```
┌──────────────┬──────────────┬──────┬───────────┬────────┐
│ ORGANISATION │ ABONNEMANG   │ TEAM │ ANVÄNDARE │ ÅTGÄRD │
├──────────────┼──────────────┼──────┼───────────┼────────┤
│ Företag AB   │ [PRO]        │ 3    │ 24        │ ✏️ 🗑   │
│ Bolaget HB   │ [BASIC]      │ 1    │ 6         │ ✏️ 🗑   │
│ Org Tre      │ [PLUS]       │ 2    │ 12        │ ✏️ 🗑   │
└──────────────┴──────────────┴──────┴───────────┴────────┘
```

Abonnemangsbadge-färger:

| Nivå | Badge-stil |
|---|---|
| `basic` | Grå bakgrund, grå text |
| `plus` | Svart bakgrund, vit text |
| `pro` | Gul bakgrund (`--highlight`), svart text |

Klick på antal team → navigerar till Team-fliken filtrerat på den organisationen.
Klick på antal användare → navigerar till Användare-fliken med den organisationen vald.

### 5.3 Redigera organisation (slide-over, Super Admin / Integ Admin)

```
╔══════════════════════════════════╗
║  REDIGERA ORGANISATION           ║
║                                  ║
║  Titel:       [Företag AB      ] ║
║  Detaljer:    [Vi är ett.....  ] ║
║  Abonnemang:  [Pro           ▾]  ║
║                                  ║
║  ── SAMMANFATTNING ────────────  ║
║  Team: 3 st                      ║
║  Användare: 24 st                ║
║                                  ║
║  [SPARA]  [AVBRYT]              ║
║                                  ║
║  ── FARLIGA ÅTGÄRDER ────────── ║
║  [RADERA ORGANISATION]          ║
╚══════════════════════════════════╝
```

Radering: Bara om 0 team och 0 användare. Annars: "Organisationen kan inte raderas eftersom den har [X] team och [Y] användare."

### 5.4 Org Admin-vy: Detaljkort (read-only)

Org Admin med en organisation ser ett enda informationskort. Med flera organisationer ser de en lista liknande 5.2 men read-only.

```
╔══════════════════════════════════════╗
║  ORGANISATION: FÖRETAG AB            ║
║                                      ║
║  Detaljer: "Vi är ett..."            ║
║  Abonnemang: [PRO]                   ║
║  Team: 3 st                          ║
║  Användare: 24 st                    ║
║                                      ║
║  (Inga redigeringsåtgärder)          ║
╚══════════════════════════════════════╝
```

---

## 6. Komplett behörighetsmatris

### 6.1 Admin-synlighet

| Del | Super Admin | Integ Admin | Org Admin | Team Leader | Member |
|---|---|---|---|---|---|
| Admin i huvudnav | Ja | Ja | Ja | Ja | Nej |
| Flik: Användare | Ja (alla orgs via dropdown) | Ja (sina orgs) | Ja (sina orgs) | Ja (egna teams användare) | — |
| Flik: Team | Ja (alla orgs) | Ja (sina orgs) | Ja (sina orgs) | Dold | — |
| Flik: Organisation | Ja (alla, CRUD) | Ja (sina, CRUD) | Ja (egen, read-only) | Dold | — |
| Flik: Anpassning | Ja | Ja | Dold | Dold | — |

### 6.2 Användarhantering

| Åtgärd | Super Admin | Integ Admin | Org Admin | Team Leader | Member |
|---|---|---|---|---|---|
| Se användarlista | Alla i vald org | Sina orgs | Alla i sina orgs | Egna team-medlemmar | — |
| Se slide-over (detalj) | Ja | Ja (sina orgs) | Ja (sina orgs) | Ja (egna team, read-only) | — |
| Redigera personuppgifter | Ja (lägre systemroll) | Ja (lägre systemroll i sina orgs) | Ja (lägre systemroll i sina orgs) | Nej | — |
| Ändra systemroll | Ja (under sin egen) | Ja (under sin egen, i sina orgs) | Nej | Nej | — |
| Ändra chattroll | Ja | Ja (sina orgs) | Nej | Nej | — |
| Ändra teamroll | Ja (alla team) | Ja (team i sina orgs) | Ja (team i sina orgs) | Nej | — |
| Lägga till i team | Ja (alla team i sina orgs) | Ja (team i sina orgs) | Ja (team i sina orgs) | Nej | — |
| Ta bort från team | Ja | Ja (sina orgs) | Ja (team i sina orgs) | Nej | — |
| Avaktivera användare | Ja (lägre systemroll) | Ja (lägre systemroll, sina orgs) | Ja (lägre systemroll i sina orgs) | Nej | — |
| Bjud in användare | Ja (välj org + team) | Ja (sina orgs + team) | Ja (välj team i sina orgs) | Ja (team där man är TL) | — |

### 6.3 Team-hantering

| Åtgärd | Super Admin | Integ Admin | Org Admin | Team Leader | Member |
|---|---|---|---|---|---|
| Se team-lista | Ja (alla orgs) | Ja (sina orgs) | Ja (sina orgs) | — | — |
| Skapa team | Ja | Ja (sina orgs) | Ja (i sina orgs) | Nej | — |
| Redigera team | Ja | Ja (sina orgs) | Ja (sina orgs) | Nej | — |
| Radera team | Ja (om 0 medlemmar) | Ja (om 0 medl., sina orgs) | Ja (om 0 medlemmar) | Nej | — |

### 6.4 Organisations-hantering

| Åtgärd | Super Admin | Integ Admin | Org Admin | Team Leader | Member |
|---|---|---|---|---|---|
| Se organisations-lista | Ja (alla) | Ja (sina) | — | — | — |
| Se sina organisationer | — | — | Ja (read-only) | — | — |
| Skapa organisation | Ja | Nej | Nej | Nej | — |
| Redigera organisation | Ja | Ja (sina) | Nej | Nej | — |
| Radera organisation | Ja (om 0 team/users) | Nej | Nej | Nej | — |
| Ändra abonnemangsnivå | Ja | Ja (sina) | Nej | Nej | — |
| Anpassa terminologi | Ja | Ja (sina) | Nej | Nej | — |

---

## 7. UX-mönster

### 7.1 Slide-over panel

Alla redigeringsformulär (användare, team, organisation, inbjudan) öppnas som en panel som glider in från höger. Listan i bakgrunden tonas/dimmas med en halvtransparent overlay.

Motivering:
- Behåller listkontext (användaren ser var de befinner sig)
- Mer utrymme än modal för komplexa formulär
- Etablerat mönster (action-redigering i systemet beskrivs som "slides in from right")

Beteende:
- `Escape` stänger panelen
- Klick på overlay stänger panelen (med varning om osparade ändringar)
- Focus-trap inuti panelen
- Under 1024px: panelen tar hela skärmbredden

### 7.2 Laddnings- och feltillstånd

Alla vyer och formulär hanterar följande tillstånd:

| Tillstånd | Mönster |
|---|---|
| **Laddar lista** | Skeleton-loader i tabellens body (inte spinner) |
| **Sparar** | Knappen "SPARA" → disabled + "SPARAR..." med spinner |
| **Sparat** | Toast-notifiering (se 7.4) |
| **Valideringsfel** | Inline-felmeddelande under fältet, röd border. Fokus flyttas till första felet. |
| **Serverfel** | Banner överst i slide-over: "Kunde inte spara. Försök igen." med retry-knapp |
| **Osparade ändringar** | Vid stängning av slide-over: "Du har osparade ändringar. Vill du stänga ändå?" |

### 7.3 Bekräftelsedialoger

Alla destruktiva åtgärder (radera, avaktivera, ta bort från team) följer samma mönster:

- Halvtransparent overlay
- Varningstext som förklarar konsekvensen
- Två knappar: `AVBRYT` (neutral) och `[ÅTGÄRD] ÄNDÅ` (röd/accent)
- Destruktiv knapp har fördröjd aktivering (1 sekund) för att förhindra oavsiktliga klick

### 7.4 Framgångsnotifieringar

Toast-meddelanden i övre högra hörnet, försvinner efter 4 sekunder:

- "Användaren har uppdaterats"
- "Inbjudan har skickats till [e-post]"
- "Teamet har skapats"
- "[X] inbjudningar skickade"

### 7.5 Tabeller

- Sorterbara kolumner med pil-ikoner (asc/desc)
- Bara en kolumn kan sorteras åt gången
- Hover på rad: subtil bakgrundsfärg (`--highlight-soft`)
- Alla kolumner har min-width för att undvika trång layout
- Overflow: horisontell scroll på smala skärmar

### 7.6 Responsivitet

| Breakpoint | Anpassning |
|---|---|
| < 1024px | Slide-over tar hela bredden |
| < 768px | Tabellkolumner "Username" och "Senast aktiv" döljs, tabell scrollbar |
| < 480px | Admin-flikarna (Användare/Team/Organisation) blir dropdown-meny |

### 7.7 Tom-tillstånd

**Filtrering utan träffar:**

```
┌─────────────────────────────────┐
│                                 │
│  Inga användare matchar din     │
│  sökning.                       │
│                                 │
│  [RENSA FILTER]                 │
│                                 │
└─────────────────────────────────┘
```

**Organisation utan team:**

```
┌─────────────────────────────────┐
│                                 │
│  Organisationen har inga team   │
│  ännu.                          │
│                                 │
│  [+ SKAPA DITT FÖRSTA TEAM]    │
│                                 │
└─────────────────────────────────┘
```

**Organisation utan användare:**

```
┌─────────────────────────────────┐
│                                 │
│  Inga användare i denna         │
│  organisation ännu.             │
│                                 │
│  [BJUD IN ANVÄNDARE]            │
│                                 │
└─────────────────────────────────┘
```

### 7.8 Keyboard-navigation

- `Tab` navigerar genom formulärfält och interaktiva element
- `Escape` stänger slide-over och dialog
- `Enter` på tabell-rad öppnar slide-over
- Focus-trap i alla overlay-element (slide-over, dialog)
- Vid stängning av slide-over återställs fokus till det element som öppnade den

### 7.9 Tillgänglighet (WCAG 2.2)

- Tabeller har `<caption class="sr-only">` som beskriver innehållet, t.ex. "Användarlista — visar X av Y"
- Sorterbara kolumner har `aria-sort` på `<th>`
- Ikonknappar har `aria-label`, t.ex. `aria-label="Redigera Anna Andersson"`
- Slide-over har `role="dialog"` och `aria-modal="true"`
- Vid filtrering annonseras resultat via `aria-live="polite"`: "Visar X av Y användare"
- Valideringsfel har `role="alert"` för skärmläsare
- Obligatoriska fält markeras visuellt och med `aria-required="true"`

---

## 8. URL-struktur

| Vy | URL |
|---|---|
| Admin: Användare | `/admin/users` |
| Admin: Användare (slide-over) | `/admin/users?user=123` |
| Admin: Team | `/admin/teams` |
| Admin: Team (redigera) | `/admin/teams?edit=456` |
| Admin: Organisation | `/admin/organizations` |
| Admin: Organisation (redigera) | `/admin/organizations?edit=789` |
| Admin: Anpassning | `/admin/customization` |

Query-parametrar för slide-overs gör att:
- Direktlänkar kan delas
- Webbläsarens back-knapp stänger panelen
- Bokmärken fungerar

---

## 9. Scope-avgränsning

### 9.1 Agendaredigering

Agendaredigering (sektioner, moduler, innehåll) hanteras **inte** i admin-panelen. Den administreras in-context via agendavyn/sidomenyn, precis som i det gamla systemet. Admin-panelen hanterar enbart organisationer, team, användare, behörigheter och anpassning.

**Agenda-synlighet per möte (ref. krav 03):** Team Leader ska kunna släcka eller visa enskilda agendapunkter (subrubriker) inför ett möte. Denna funktion hanteras i agendavyn, inte i admin-panelen.

### 9.2 Funktioner utanför v1

Följande har identifierats som värdefulla men ingår inte i den första versionen:

- **Batch-åtgärder** i användarlistan (markera flera → ändra roll/team)
- **Aktivitetslogg** (audit trail för admin-åtgärder)
- **Exportfunktion** (CSV-export av användarlista)
- **Användaranalyser** (Pro-flik, framtida tillägg)
- **MS Teams / Google-integration** — Toolkitet ska kunna placeras som app i MS Teams eller motsvarande kundmiljö (ref. krav 03). Separat specifikation.

---

## 10. Anpassning-fliken (ref. krav 03)

### 10.1 Synlighet

| Roll | Ser fliken? |
|---|---|
| Super Admin | Ja |
| Integ Admin | Ja (sina organisationer) |
| Org Admin | Nej |
| Team Leader | Nej |

### 10.2 Syfte

Hela Toolkitet ska vara redigerbart vad gäller namn och rubriker i de olika vyerna. Integ Customer Admin (eller Super Admin) anpassar terminologin i samråd med kundens Org Admin, vanligtvis innan Toolkitet släpps ut till alla användare i organisationen.

### 10.3 Anpassningsbara element

| Element | Beskrivning | Scope |
|---|---|---|
| **Agenda-rubrik** | Rubrik per agendasektion | Per organisation |
| **Modul-namn** | Visningsnamn för moduler (t.ex. "Handlingsplan" → "Åtgärdslista") | Per organisation |
| **Sektionsrubriker** | Rubriker i sidomenyn | Per organisation |
| **UI-etiketter** | Utvalda etiketter i gränssnittet | Per organisation |

> **Notering:** Vilka exakta etiketter som ska vara anpassningsbara specificeras i detalj under implementering. Modellen ska vara tillräckligt flexibel för att utökas.

### 10.4 Datamodell

```
OrganizationCustomization
| Attribut      | Typ           | Beskrivning                           |
|---------------|---------------|---------------------------------------|
| organization  | FK → Org      | Vilken organisation anpassningen gäller|
| key           | String        | Identifierare (t.ex. "agenda.section1")|
| customLabel   | String        | Kundens anpassade etikett              |
| defaultLabel  | String        | Systemets standardetikett              |
```

Om `customLabel` är tomt/null används `defaultLabel`.

---

## 11. Aktions-notifieringar (ref. krav 03)

Actions (åtgärder) ska kunna skickas ut automatiskt till teammedlemmar. Denna funktion kan aktiveras eller avaktiveras per team av Team Leader.

### 11.1 Inställning

| Inställning | Nivå | Ändras av |
|---|---|---|
| Automatiska aktions-notifieringar | Per team | Team Leader, Org Admin, Integ Admin, Super Admin |

### 11.2 Beteende

- När aktiverat: vid skapande eller tilldelning av en åtgärd skickas notifiering (e-post eller in-app) till ansvarig/support
- När avaktiverat: inga automatiska notifieringar
- Default: avaktiverat (Team Leader aktiverar vid behov)

> **Notering:** Exakt notifieringskanal (e-post, push, in-app) specificeras separat. Admin-panelen exponerar enbart on/off-inställningen per team.

---

## 12. Medvetna avvikelser från legacy-systemet

Denna specifikation är en **moderniserad målarkitektur**, inte en 1:1-kopia av det gamla systemet (Web Toolkit). Följande avvikelser är avsiktliga:

| Område | Legacy-beteende | Ny design | Motivering |
|---|---|---|---|
| **Rollmodell (system)** | 3 nivåer: Super Admin, Company Admin, Regular User | 5 nivåer: Super Admin, Integ Admin, Org Admin, Team Leader, Member | Separerar Integ-intern och kundadministration (ref. krav 03) |
| **Rollmodell (team)** | Boolean "Is Team Lead" per användare | `TeamMembership.teamRole` enum (`team_leader`/`member`) | Mer extensibel modell, stödjer olika roller i olika team |
| **Terminologi** | "Company", "Team Administrator", "Regular User" | "Organisation", "Team Leader", "Medlem" | Tydligare, modernare språk |
| **Org-modell** | Användare kunde ha team i flera organisationer (implicit) | Explicit multi-org via UserOrganization med primär-markering | Tydlig modell, stöder administratörer med flera org-åtaganden |
| **Admin-åtkomst** | Regular User kunde bjuda in | Bara Team Leader+ kan bjuda in | Förhindrar okontrollerad tillväxt |
| **Rollskydd** | Admin kunde inte redigera "högre" roller | Admin kan inte redigera "högre **eller samma**" roller | Förhindrar att org_admins avaktiverar varandra |
| **Teamradering UI** | Radera-ikon doldes om team hade medlemmar | Ikonen visas alltid, felmeddelande vid försök | Ger feedback istället för tyst döljning |
| **Navigationsflöde** | Separat detalj-modal + redigerings-formulär | En slide-over-panel som är både detalj- och redigeringsvy | Färre klick, snabbare arbetsflöde |
| **Anpassningsbar terminologi** | Inga anpassningsmöjligheter | Integ Admin kan anpassa etiketter per organisation | Kunder får terminologi som passar deras verksamhet (ref. krav 03) |
| **Aktions-notifieringar** | Inga automatiska notifieringar | Team Leader kan aktivera auto-notifieringar per team | Snabbare spridning av åtgärder (ref. krav 03) |
