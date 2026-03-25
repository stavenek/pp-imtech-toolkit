# ITT — Komplett datamodell

Detaljerad datamodell för Integral Teamwork Toolkit, härledd ur kravspecifikationer (`admin-section-req.md`, `tools-sections-req.md`, `aaa-base-requirements.md`) och v8-prototypens mock-data (`mock-data.js`, `mock-data-workspace.js`).

---

## 1. ER-diagram (översikt)

```
Organization 1───* Team
Organization *───* User           (via UserOrganization)
Team         *───* User           (via TeamMembership)
Organization 1───* OrganizationCustomization
Organization 1───* LocomotiveGoal

Team 1───* BestContribution
BestContribution 1───* AreaOfImprovement
BestContribution 1───* TrackedContribution
BestContribution 1───1 PDCA

Team 1───* Action
Action *───1 BestContribution
Action *───0..1 AreaOfImprovement
Action *───0..1 User (responsible)
Action *───0..1 User (support)

Team 1───* Idea
Idea  *───1 User (createdBy)

Team 1───* Meeting
Meeting *───* User (attendees)

Team 1───* Document
Document *───1 User (createdBy)

Team 1───* Newsflash
Newsflash *───1 User (createdBy)

Team 1───1 TextModule
TextModule 1───* Reflection

Team 1───1 StrategicLinks

Team 1───* ActivityLogEntry
```

---

## 2. Entiteter — Admin-domänen

### 2.1 Organization

| Attribut | Typ | Obligatoriskt | Unik | Beskrivning |
|---|---|---|---|---|
| id | UUID/String | Ja (auto) | Ja | Primärnyckel |
| title | String | Ja | Nej | Organisationsnamn, sorterbart |
| details | Text | Nej | Nej | Beskrivning |
| subscriptionTier | Enum | Ja | Nej | `basic` \| `plus` \| `pro` |

**Relationer:**
- Har många Team
- Har många User (via UserOrganization)
- Har många OrganizationCustomization
- Har många LocomotiveGoal (1–3 st)

**Affärsregler:**
- Kan bara raderas om 0 team och 0 användare (UserOrganization)
- `subscriptionTier` styr feature-gating (se admin-section-req.md 2.3)
- Abonnemangsnivå redigerbar av `integ_admin` och `super_admin`, read-only för `org_admin`

---

### 2.2 Team

| Attribut | Typ | Obligatoriskt | Unik | Beskrivning |
|---|---|---|---|---|
| id | UUID/String | Ja (auto) | Ja | Primärnyckel |
| title | String | Ja | Nej | Teamnamn, sorterbart |
| orgId | FK → Organization | Ja | Nej | Read-only efter skapande |

**Relationer:**
- Tillhör exakt 1 Organization
- Har många TeamMembership (→ User)
- Har många BestContribution
- Har många Action
- Har många Idea
- Har många Meeting
- Har många Document
- Har många Newsflash
- Har 1 TextModule
- Har 1 StrategicLinks
- Har många TrackedContribution (via BestContribution)
- Har många ActivityLogEntry

**Affärsregler:**
- Kan bara raderas om 0 medlemmar
- Vid skapande auto-genereras default-data (TextModule, StrategicLinks)

---

### 2.3 User

| Attribut | Typ | Obligatoriskt | Unik | Beskrivning |
|---|---|---|---|---|
| id | UUID/String | Ja (auto) | Ja | Primärnyckel |
| firstName | String | Ja | Nej | Sätts av användaren vid signup |
| lastName | String | Ja | Nej | Sätts av användaren vid signup |
| email | String | Ja | Ja (globalt) | Sätts vid inbjudan, read-only därefter |
| username | String | Nej | Nej | Valfritt alternativt visningsnamn |
| phone | String | Nej | Nej | |
| description | Text | Nej | Nej | |
| systemRole | Enum \| null | Nej | Nej | `super_admin` \| `integ_admin` \| `org_admin` \| `null` |
| chatRole | Enum | Ja | Nej | `base` \| `coach` \| `boss`. Default: `base` |
| registerDate | Date | Ja (auto) | Nej | Sätts vid registrering/inbjudan |
| registerStatus | Enum | Ja (auto) | Nej | `registered` \| `pending` \| `soft_deleted` |
| lastActive | Date \| null | Nej | Nej | Senaste aktivitet, null om aldrig aktiv |

**Relationer:**
- Tillhör 1+ Organization (via UserOrganization)
- Tillhör 1+ Team (via TeamMembership)
- Kan vara responsible/support i Action
- Kan vara createdBy i Idea, Document, Newsflash
- Kan vara attendee i Meeting

**Affärsregler:**
- `email` globalt unikt
- Skapas via e-postinbjudan (utom super_admin — manuellt)
- Nya användare startar med `systemRole = null`, `teamRole = member`
- `systemRole` är global — en `org_admin` har admin-behörighet i alla sina organisationer
- Soft delete anonymiserar persondata (ersätts med `*****`), behåller systemreferenser
- Admins kan inte avaktivera sig själva
- Admins kan inte redigera/avaktivera användare med högre eller samma systemroll
- `chatRole` synlig/redigerbar enbart för `integ_admin`+
- Pending användare: admin kan ändra teamtillhörighet och teamroll, personuppgifter fylls i vid signup
- Pending användare kan inte soft-deletas, admin kan återkalla inbjudan

---

### 2.4 UserOrganization (junction)

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| userId | FK → User | Ja | |
| orgId | FK → Organization | Ja | |
| isPrimary | Boolean | Ja | Default-org vid inloggning |

**Constraints:**
- Unik kombination (userId, orgId)
- Minst 1 UserOrganization per User
- Exakt 1 per User ska ha `isPrimary = true`

**Affärsregler:**
- `isPrimary` avgör vilken org som visas vid inloggning
- Om den primära org:en tas bort sätts en annan automatiskt som primär
- Sista UserOrganization kan inte tas bort

---

### 2.5 TeamMembership (junction med attribut)

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| teamId | FK → Team | Ja | |
| userId | FK → User | Ja | |
| teamRole | Enum | Ja | `team_leader` \| `member` |
| joinedDate | Date | Ja (auto) | Sätts vid tillägg |

**Constraints:**
- Unik kombination (teamId, userId)
- `membership.team.orgId` måste finnas bland användarens organisationer (UserOrganization)
- Minst 1 TeamMembership per User

**Affärsregler:**
- En användare kan vara `team_leader` i flera team
- En användare kan ha olika roller i olika team
- Sista medlemskapet kan inte tas bort

---

### 2.6 OrganizationCustomization

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| orgId | FK → Organization | Ja | |
| category | String | Ja | `agenda` \| `sections` \| `modules` \| `ui` \| `nav` |
| key | String | Ja | Identifierare, t.ex. `section.goals` |
| defaultLabel | String | Ja | Systemets standardetikett |
| customLabel | String | Nej | Kundens anpassade etikett (om tomt → defaultLabel) |

**Affärsregler:**
- Redigerbar av `integ_admin`+
- Om `customLabel` är tomt/null används `defaultLabel`

---

## 3. Entiteter — Workspace-domänen

### 3.1 BestContribution (Bästa bidrag)

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| id | UUID/String | Ja (auto) | Primärnyckel |
| teamId | FK → Team | Ja | |
| title | String | Ja | T.ex. "Förbättra kundkommunikation" |
| startingPointText | Text | Nej | Beskrivning av nuläge |
| desiredStateText | Text | Nej | Beskrivning av önskat läge |
| completionPct | Integer (0–100) | Ja | Kompletteringsgrad, drag-and-drop i UI |
| archived | Boolean | Ja | Default: false |
| archivedDate | Date \| null | Nej | Datum för arkivering |

**Relationer:**
- Tillhör exakt 1 Team
- Har många AreaOfImprovement (inbäddade)
- Har många Action (via bcId)
- Har många TrackedContribution (via bcId)
- Har 1 PDCA (via bcId)

**Affärsregler:**
- Alla användare kan redigera text (inline)
- `team_leader`+ kan hantera (skapa/arkivera) bästa bidrag
- Completion-stapeln kan ändras via drag-and-drop
- Arkivering flyttar till `archive.html` (read-only)
- Vid skapande skapas automatiskt "Inget förbättringsområde"

---

### 3.2 AreaOfImprovement (Förbättringsområde)

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| id | UUID/String | Ja (auto) | Primärnyckel |
| title | String | Ja | T.ex. "Digitala kanaler" |
| archived | Boolean | Ja | Default: false |

**Tillhörighet:** Inbäddad i BestContribution (array `areaOfImprovement[]`)

**Affärsregler:**
- "Inget förbättringsområde" skapas automatiskt per BestContribution, kan inte raderas
- Vid radering av ett förbättringsområde flyttas dess åtgärder till "Inget förbättringsområde"
- Kan omordnas via drag-and-drop

---

### 3.3 Action (Åtgärd)

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| id | UUID/String | Ja (auto) | Primärnyckel |
| teamId | FK → Team | Ja | |
| bcId | FK → BestContribution | Ja | Kopplad till bästa bidrag |
| aiId | FK → AreaOfImprovement | Nej | Kopplad till förbättringsområde |
| title | String | Ja | |
| description | Text | Nej | |
| responsibleId | FK → User \| null | Nej | Ansvarig person |
| supportId | FK → User \| null | Nej | Stöd-person |
| deadline | Date \| null | Nej | |
| status | Enum | Ja | `not_started` \| `in_progress` \| `overdue` \| `done` |
| comment | Text | Nej | |
| emailReminder | Boolean | Ja | Default: false |

**Relationer:**
- Tillhör 1 Team
- Tillhör 1 BestContribution
- Tillhör 0..1 AreaOfImprovement
- Refererar 0..1 User som responsible
- Refererar 0..1 User som support

**Affärsregler:**
- Alla roller kan skapa/redigera åtgärder
- Redigering via slide-over
- Status-badge-färger: `not_started` = grå, `in_progress` = gul, `overdue` = röd, `done` = grön
- Mejlpåminnelse skickas X dagar innan deadline (konfigurerbart per team)
- Kan omordnas via drag-and-drop
- Kan skapas via FAB, slide-over, eller idékonvertering
- Dashboard visar åtgärder där användaren är ansvarig/stöd med deadline ≤14 dagar eller försenad

---

### 3.4 Idea (Idé)

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| id | UUID/String | Ja (auto) | Primärnyckel |
| teamId | FK → Team | Ja | |
| title | String | Ja | |
| description | Text | Nej | |
| createdBy | FK → User | Ja | Skapare |
| createdDate | Date | Ja (auto) | |

**Affärsregler:**
- Alla roller kan CRUD
- Kan konverteras till Action (idén tas bort, data kopieras till ny Action)
- Visas som post-it-kort i grid-layout (gul bakgrund, 2px svart ram)

---

### 3.5 Meeting (Möte)

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| id | UUID/String | Ja (auto) | Primärnyckel |
| teamId | FK → Team | Ja | |
| date | Date | Ja | Default: idag |
| note | Text | Nej | Anteckning |
| attendees | Array\<FK → User\> | Ja | Lista med närvarande user-ID:n |

**Affärsregler:**
- Alla roller kan CRUD
- Närvaro visas i rutnät (personer × datum)
- Närvaroprocent ≥75% markeras gult
- Radering kräver bekräftelse

---

### 3.6 Document (Teamdokument)

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| id | UUID/String | Ja (auto) | Primärnyckel |
| teamId | FK → Team | Ja | |
| title | String | Ja | |
| url | String (URL) | Ja | Extern URL |
| type | Enum | Ja | `pdf` \| `doc` \| `xls` \| `ppt` \| `csv` \| `other` |
| createdDate | Date | Ja (auto) | |
| createdBy | FK → User | Ja | |
| isPreRead | Boolean | Ja | Default: false — markerar "pre-read" inför möte |
| preReadDate | Date \| null | Nej | Datum för pre-read-mötet |

**Affärsregler:**
- Alla roller kan CRUD
- Typ auto-detekteras från URL-ändelse
- Pre-read-flagga: sidebar-rubriken byter färg/blinkar om det finns nya pre-reads
- Radering kräver bekräftelse

---

### 3.7 Newsflash (Nyhetsflash)

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| id | UUID/String | Ja (auto) | Primärnyckel |
| teamId | FK → Team | Ja | |
| date | Date | Ja | Default: idag |
| title | String | Ja | |
| content | Text | Nej | |
| createdBy | FK → User | Ja | |

**Affärsregler:**
- Alla kan läsa
- `team_leader`+ kan skapa/redigera/radera
- Visas i omvänd kronologisk ordning
- 1–2 inlägg per nyhetsflash
- Senaste nyhetsflash visas också på dashboard

---

### 3.8 TextModule (Textmodul — per team)

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| (teamId) | — | — | Nyckel i map (1:1 med Team) |
| currentState | Text | Nej | Nuvarande tillstånd |
| desiredState | Text | Nej | Önskat tillstånd |
| teamworkRules | Text | Nej | Spelregler (radbrytning = ny regel) |
| reflections | Array\<Reflection\> | Ja | Lista med reflektioner |

**Inbäddad entitet: Reflection**

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| id | UUID/String | Ja (auto) | |
| date | Date | Ja | |
| text | Text | Ja | Reflektionstext |

**Affärsregler:**
- Alla roller kan redigera
- Reflektioner i kronologisk ordning
- Spelregler och Reflektioner är två sidebar-ingångar till samma sida (`reflections.html`)

**Not:** `currentState` och `desiredState` i TextModule är team-nivå-text, skild från BestContribution-nivåns `startingPointText`/`desiredStateText`.

---

### 3.9 StrategicLinks (Strategilänkar — per team)

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| (teamId) | — | — | Nyckel i map (1:1 med Team) |
| strategic.url | String (URL) | Nej | URL till strategiskt resonemang |
| strategic.updatedDate | Date | Nej | Senast uppdaterad |
| progress.url | String (URL) | Nej | URL till framsteg med strategiskt fokus |
| progress.updatedDate | Date | Nej | Senast uppdaterad |

**Affärsregler:**
- Alla kan läsa
- `org_admin`+ kan redigera (inline-redigering av URL)
- Strategiskt resonemang uppdateras halvårsvis
- Framsteg uppdateras månadsvis

---

### 3.10 TrackedContribution (Spårat mätetal)

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| id | UUID/String | Ja (auto) | Primärnyckel |
| teamId | FK → Team | Ja | |
| bcId | FK → BestContribution | Ja | Kopplat till bästa bidrag |
| title | String | Ja | T.ex. "Kundnöjdhet (NPS)" |
| targetValue | Number | Ja | Slutmål |
| currentValue | Number | Ja | Nuvarande värde |
| unit | String | Ja | T.ex. "poäng", "timmar", "%", "st", "min", "h" |
| targetLine | Number | Ja | Målnivå för diagram |
| criticalLine | Number | Ja | Kritisk linje för diagram |
| chartType | Enum | Ja | `line` \| `bar` |
| measurements | Array\<Measurement\> | Ja | Historiska mätdatapunkter |

**Inbäddad entitet: Measurement**

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| date | Date | Ja | Mätdatum |
| value | Number | Ja | Mätvärde |

**Affärsregler:**
- Alla kan CRUD mätningar (lägga till mätvärden)
- `team_leader`+ kan hantera spårade bidrag (skapa/ta bort)
- Max 2 separata mätetal visas i diagram samtidigt
- Fritt val mellan stapel- och kurvdiagram
- Tidsaxel konfigurerbar: varje vecka, var 14:e dag, månadsvis
- Målnivå + kritisk linje synlig i diagram
- Arkiverade mätetal bevaras i arkivet

---

### 3.11 PDCA (Plan-Do-Check-Act — per BestContribution)

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| bcId | FK → BestContribution | Ja | |
| plan | Integer (0–100) | Ja | Plan-procent |
| do | Integer (0–100) | Ja | Do-procent |
| check | Integer (0–100) | Ja | Check-procent |
| act | Integer (0–100) | Ja | Act-procent |

**Affärsregler:**
- Visas som progress-bars i PDCA-tabell på goals-metrics.html
- Totalt beräknas som snitt av de fyra faserna

---

### 3.12 LocomotiveGoal (Lokomotivmål)

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| id | UUID/String | Ja (auto) | Primärnyckel |
| orgId | FK → Organization | Ja | Per organisation |
| title | String | Ja | |
| description | Text | Nej | Sammanhang |
| url | String (URL) | Nej | Extern länk |
| updatedDate | Date | Nej | Senast uppdaterad |

**Affärsregler:**
- 1–3 per organisation
- Alla kan läsa
- `org_admin`+ kan redigera
- Uppdateras i relevant frekvens (vanligtvis månatligt)

---

### 3.13 ActivityLogEntry (Aktivitetslogg)

| Attribut | Typ | Obligatoriskt | Beskrivning |
|---|---|---|---|
| date | Date | Ja | Händelsedatum |
| type | Enum | Ja | `meeting` \| `action` \| `idea` \| `news` |
| text | String | Ja | Beskrivning av händelsen |

**Affärsregler:**
- Visas på dashboard som tidslinje (5 senaste)
- Genereras automatiskt vid CRUD-operationer
- Filtreras per team-kontext

---

## 4. Rollmodell

### 4.1 Två nivåer, fem steg

| Nivå | Attribut | Plats | Värden |
|---|---|---|---|
| **System** | systemRole | User | `super_admin`, `integ_admin`, `org_admin`, `null` |
| **Team** | teamRole | TeamMembership | `team_leader`, `member` |

### 4.2 Rollhierarki

```
1. super_admin  — Hela systemet, alla organisationer
2. integ_admin  — Sina organisationer (via UserOrganization)
3. org_admin    — Sina organisationer (via UserOrganization)
4. team_leader  — Specifika team (via TeamMembership.teamRole)
5. member       — Basmedlem i specifika team
```

### 4.3 Effektiv roll (beräknad)

```
effektivRoll(user, team) =
  if user.systemRole == 'super_admin'                        → super_admin
  if user.systemRole == 'integ_admin' && team.org ∈ userOrgs → integ_admin
  if user.systemRole == 'org_admin' && team.org ∈ userOrgs   → org_admin
  membership = user.memberships.find(team)
  if membership?.teamRole == 'team_leader'                   → team_leader
  if membership?.teamRole == 'member'                        → member
  else                                                       → no_access
```

Systemrollen övertrumfar alltid teamrollen men kräver (utom för `super_admin`) att användaren har en UserOrganization-koppling till teamets organisation.

---

## 5. Enums

### 5.1 registerStatus

| Värde | Visningsnamn | Färg |
|---|---|---|
| `registered` | AKTIV | Grön |
| `pending` | VÄNTANDE | Orange |
| `soft_deleted` | AVAKTIVERAD | Röd |

### 5.2 systemRole

| Värde | Visningsnamn |
|---|---|
| `super_admin` | Super Admin |
| `integ_admin` | Integ Admin |
| `org_admin` | Org Admin |
| `null` | User |

### 5.3 teamRole

| Värde | Visningsnamn |
|---|---|
| `team_leader` | Team Leader |
| `member` | Medlem |

### 5.4 chatRole (Accessnivå)

| Värde | Visningsnamn |
|---|---|
| `base` | Base |
| `coach` | Coach |
| `boss` | Boss |

### 5.5 subscriptionTier

| Värde | Visningsnamn | Badge-stil |
|---|---|---|
| `basic` | Basic | Grå bg, grå text |
| `plus` | Plus | Svart bg, vit text |
| `pro` | Pro | Gul bg, svart text |

### 5.6 actionStatus

| Värde | Visningsnamn | Färg |
|---|---|---|
| `not_started` | Ej startad | Grå |
| `in_progress` | Pågående | Gul (#ffcc00) |
| `overdue` | Försenad | Röd |
| `done` | Klar | Grön |

### 5.7 documentType

| Värde | Badge-färg |
|---|---|
| `pdf` | Röd |
| `doc` | Blå |
| `xls` | Grön |
| `ppt` | Orange |
| `csv` | Grå |
| `other` | Mörkgrå |

### 5.8 chartType

| Värde | Beskrivning |
|---|---|
| `line` | Kurvdiagram |
| `bar` | Stapeldiagram |

### 5.9 activityType

| Värde | Beskrivning |
|---|---|
| `meeting` | Mötesregistrering |
| `action` | Åtgärdsförändring |
| `idea` | Idé skapad |
| `news` | Nyhetsflash publicerad |

### 5.10 customizationCategory

| Värde | Beskrivning (SV) |
|---|---|
| `agenda` | Agenda |
| `sections` | Sektioner |
| `modules` | Moduler |
| `ui` | UI-etiketter |
| `nav` | Navigering |

---

## 6. Client-side state (localStorage)

Följande data hanteras i klienten, inte i databasen:

| Nyckel | Typ | Beskrivning |
|---|---|---|
| `itt-lang` | `'sv'` \| `'en'` | Valt språk. Default: `sv` |
| `itt-team` | Team-ID | Aktuellt team-kontext |
| `itt-role` | Roll-string | Debug-rollväljare (prototyp) |
| `itt-progress-${teamId}` | JSON | Mötesprogresslinjens besökta stopp |
| `itt-agenda-visibility-${teamId}` | JSON | Vilka agenda-moduler som är synliga/dolda |
| `itt-notifications-${teamId}` | JSON | Notifieringsinställningar per team |

---

## 7. Relationssammanfattning

| Relation | Kardinalitet | Kommentar |
|---|---|---|
| Organization → Team | 1:N | Team tillhör exakt 1 org |
| Organization ↔ User | M:N via UserOrganization | Med isPrimary-flagga |
| Team ↔ User | M:N via TeamMembership | Med teamRole + joinedDate |
| Organization → OrganizationCustomization | 1:N | Per category+key |
| Organization → LocomotiveGoal | 1:N (1–3) | Strategiska mål från ledningen |
| Team → BestContribution | 1:N | Inkl. arkiverade |
| BestContribution → AreaOfImprovement | 1:N (inbäddad) | "Inget förbättringsområde" alltid närvarande |
| BestContribution → Action | 1:N (via bcId) | |
| AreaOfImprovement → Action | 1:N (via aiId) | Nullable |
| BestContribution → TrackedContribution | 1:N (via bcId) | |
| BestContribution → PDCA | 1:1 (via bcId) | |
| Team → Idea | 1:N | |
| Team → Meeting | 1:N | |
| Meeting → User (attendees) | M:N (array) | |
| Team → Document | 1:N | |
| Team → Newsflash | 1:N | |
| Team → TextModule | 1:1 | |
| TextModule → Reflection | 1:N (inbäddad) | |
| Team → StrategicLinks | 1:1 | |
| TrackedContribution → Measurement | 1:N (inbäddad) | |

---

## 8. Dataflöden mellan sidor

| Källa | Mål | Data | Interaktion |
|---|---|---|---|
| dashboard → action-plan | Action | Klick på åtgärdsrad |
| dashboard → best-contribution | BestContribution | Klick på preview |
| dashboard → goals-metrics | TrackedContribution | Klick på mini-graf |
| best-contribution → goals-metrics | TrackedContribution | Klick på mätetal-preview |
| best-contribution → action-plan | BestContribution (delprojekt) | Klick navigerar med fokus |
| ideas → action-plan | Idea → Action | Konvertering (idé raderas) |
| action-plan → archive | BestContribution (arkiverad) | Arkivering |
| goals-metrics → archive | TrackedContribution (arkiverad) | Arkivering |

---

## 9. Aggregerade / beräknade värden

Dessa visas i UI men lagras inte — de beräknas från underliggande data:

| Värde | Beräkning | Visas på |
|---|---|---|
| Teamframsteg (%) | Snitt av aktiva BestContribution.completionPct | Dashboard |
| Åtgärder slutförda | Count av Action WHERE status=done AND responsibleId=currentUser | Dashboard |
| Pågående åtgärder | Count av Action WHERE status IN (in_progress, not_started) AND responsibleId=currentUser | Dashboard |
| Möten närvarade | Count av Meeting WHERE currentUser IN attendees | Dashboard |
| Närvaroprocent per person | (möten närvarade / totalt antal möten) × 100 | Attendance |
| Närvaroprocent per möte | (antal närvarande / antal teammedlemmar) × 100 | Attendance |
| PDCA totalt | (plan + do + check + act) / 4 | Goals & Metrics |
| Antal medlemmar (team) | Count av TeamMembership WHERE teamId=X | Admin: Team-listan |
| Team Leaders (team) | Users WHERE TeamMembership.teamRole=team_leader | Admin: Team-listan |

---

## 10. Arkiveringsmodell

Arkivering är en **vy-filter**, inte en separat datalagring:

- BestContribution och AreaOfImprovement har `archived: boolean` + `archivedDate`
- Arkivsidan (`archive.html`) visar objekt med `archived === true`
- Handlingsplanen (`action-plan.html`) visar objekt med `archived !== true`
- Återställning (un-archive) sätter `archived = false`
- Arkiverade bästa bidrag visas med historisk Starting Point / Desired State
- Arkiverade delprojekt visas med sina slutförda åtgärder
- Arkiverade mätetal bevarar sina diagram
- Arkivering sker från respektive källsida (t.ex. "Arkivera bästa bidrag" på best-contribution.html)
- Arkivet är read-only — ingen redigering

---

## 11. Workspace-rollsynlighetsmatris

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
