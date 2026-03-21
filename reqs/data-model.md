# Datamodell — Integral Teamwork Toolkit

Aktuell förståelse av domänmodellen baserat på prototypernas mock-data (`prototypes/v8/mock-data.js`, `mock-data-workspace.js`), kravdokument (`admin-section-req.md`, `tools-sections-req.md`, `01-old-system-analysis.md`) och GUI-flöden.

---

## Entitetsöversikt

```
Organization ──→ Team ──→ Best Contribution ──→ Area of Improvement ──→ Action
     │              │              │
     │              │              └──→ Tracked Contribution ──→ Measurement
     │              │
     │              ├──→ Idea
     │              ├──→ Meeting (+ attendees)
     │              ├──→ Document Link
     │              ├──→ Newsflash
     │              ├──→ Text Module (spelregler, reflektioner)
     │              └──→ Strategic Link
     │
     ├──→ Locomotive Goal
     ├──→ Customization
     └──→ User (via UserOrganization + TeamMembership)
```

---

## 1. Organization

| Fält | Typ | Obligatoriskt | Beskrivning |
|------|-----|---------------|-------------|
| `id` | string | Ja | Unikt ID |
| `title` | string | Ja | Organisationsnamn |
| `details` | string | Nej | Beskrivning |
| `subscriptionTier` | enum: `basic`, `plus`, `pro` | Nej | Abonnemangsnivå |

**Relationer:** 1→N Team, 1→N Customization, 1→N Locomotive Goal, M→N User (via UserOrganization)

---

## 2. Team

| Fält | Typ | Obligatoriskt | Beskrivning |
|------|-----|---------------|-------------|
| `id` | string | Ja | Unikt ID |
| `title` | string | Ja | Teamnamn |
| `orgId` | string (FK) | Ja | Tillhörande organisation |

**Relationer:** N→1 Organization, M→N User (via TeamMembership), 1→N Best Contribution, 1→N Action, 1→N Idea, 1→N Meeting, 1→N Document Link, 1→N Newsflash, 1→1 Text Module, 1→N Tracked Contribution

---

## 3. User

| Fält | Typ | Obligatoriskt | Beskrivning |
|------|-----|---------------|-------------|
| `id` | string | Ja | Unikt ID |
| `firstName` | string | Ja | |
| `lastName` | string | Ja | |
| `email` | string | Ja | Unikt, ej ändringsbart efter registrering |
| `phone` | string | Nej | |
| `username` | string | Nej | Visningsnamn |
| `description` | string | Nej | Bio/rollbeskrivning |
| `registerDate` | date | Auto | Sätts vid sign-up |
| `registerStatus` | enum: `pending`, `registered`, `soft_deleted` | Ja | |
| `lastActive` | date | Nej | Senaste inloggning |
| `systemRole` | enum: `super_admin`, `integ_admin`, `org_admin`, `null` | Nej | Systemomfattande roll |
| `chatRole` | enum: `boss`, `coach`, `base` | Nej | Accessnivå |
| `orgs[]` | array | Ja | Organisationsmedlemskap |
| `orgs[].orgId` | string (FK) | Ja | |
| `orgs[].isPrimary` | boolean | Ja | Primär org (för inloggningsredirektion) |
| `memberships[]` | array | Ja | Teammedlemskap |
| `memberships[].teamId` | string (FK) | Ja | |
| `memberships[].teamRole` | enum: `team_leader`, `member` | Ja | Roll i teamet |
| `memberships[].joinedDate` | date | Ja | |

**Effektiv rollhierarki (högst → lägst):** super_admin > integ_admin > org_admin > team_leader > member

**Affärsregler:**
- Super admins skapas manuellt i databasen
- Soft-delete anonymiserar data (namn/e-post → `*****`)
- Kan inte ändra/radera användare med högre roll

---

## 4. Best Contribution (Bästa bidrag)

| Fält | Typ | Obligatoriskt | Beskrivning |
|------|-----|---------------|-------------|
| `id` | string | Ja | Unikt ID |
| `teamId` | string (FK) | Ja | Tillhörande team |
| `title` | string | Ja | Bidragsrubrik |
| `startingPointText` | string | Nej | Nuvarande läge (text) |
| `desiredStateText` | string | Nej | Önskat läge (text) |
| `completionPct` | number (0–100) | Ja | Genomförandeprocent |
| `archived` | boolean | Ja | Arkiveringsflagga |
| `archivedDate` | date | Nej | Arkiveringsdatum |
| `areaOfImprovement[]` | array | Ja | Tillhörande förbättringsområden |

**Relationer:** N→1 Team, 1→N Area of Improvement, 1→N Tracked Contribution, 1→1 PDCA Record

**Affärsregler:**
- Vid skapande skapas automatiskt "Inget förbättringsområde"
- Radering kaskaderar till alla AoI och åtgärder
- Kan arkiveras (soft-delete), visas då i Arkiv-sidan
- `completionPct` på Our Dashboard beräknas som snitt av delprojektens procent

---

## 5. Area of Improvement (Förbättringsområde)

| Fält | Typ | Obligatoriskt | Beskrivning |
|------|-----|---------------|-------------|
| `id` | string | Ja | Unikt ID |
| `title` | string | Ja | Namn |
| `archived` | boolean | Nej | Arkiveringsflagga |

**Nästlad under:** Best Contribution (`bestContribution.areaOfImprovement[]`)

**Relationer:** N→1 Best Contribution, 1→N Action

**Affärsregler:**
- "Inget förbättringsområde" kan inte raderas
- Vid radering flyttas åtgärder till "Inget förbättringsområde"
- Kan arkiveras oberoende av sitt bästa bidrag
- I arkivsidan: arkiverad AoI vars BC inte är arkiverad visas under sin aktiva BC som kontext

---

## 6. Action (Åtgärd)

| Fält | Typ | Obligatoriskt | Beskrivning |
|------|-----|---------------|-------------|
| `id` | string | Ja | Unikt ID |
| `teamId` | string (FK) | Ja | |
| `bcId` | string (FK) | Ja | Tillhörande Best Contribution |
| `aiId` | string (FK) | Nej | Tillhörande Area of Improvement |
| `title` | string | Ja | Åtgärdsrubrik |
| `description` | string | Nej | Detaljbeskrivning |
| `responsibleId` | string (FK → User) | Nej | Ansvarig person |
| `supportId` | string (FK → User) | Nej | Stödperson |
| `deadline` | date | Nej | Slutdatum |
| `status` | enum: `not_started`, `in_progress`, `overdue`, `done` | Nej | |
| `comment` | string | Nej | Intern kommentar |
| `emailReminder` | boolean | Nej | E-postpåminnelse på/av |

**Relationer:** N→1 Team, N→1 Best Contribution, N→1 Area of Improvement, N→1 User (ansvarig), N→1 User (stöd)

**Affärsregler:**
- Kan skapas via FAB eller idékonvertering
- AoI-val filtreras per valt Best Contribution
- Dashboard visar åtgärder där användaren är ansvarig/stöd med deadline ≤14 dagar eller försenad
- Drag-and-drop-omordning inom och mellan hierarkinivåer

---

## 7. Idea (Idé)

| Fält | Typ | Obligatoriskt | Beskrivning |
|------|-----|---------------|-------------|
| `id` | string | Ja | |
| `teamId` | string (FK) | Ja | |
| `title` | string | Ja | |
| `description` | string | Nej | |
| `createdBy` | string (FK → User) | Ja | |
| `createdDate` | date | Ja | |

**Affärsregler:** Kan konverteras till åtgärd (tar bort idén, skapar åtgärd med förifyllda fält)

---

## 8. Meeting (Möte / Närvaro)

| Fält | Typ | Obligatoriskt | Beskrivning |
|------|-----|---------------|-------------|
| `id` | string | Ja | |
| `teamId` | string (FK) | Ja | |
| `date` | date | Ja | |
| `note` | string | Nej | Mötesanteckningar |
| `attendees` | array of string (FK → User) | Ja | Närvarande användare |

---

## 9. Document Link (Dokumentlänk)

| Fält | Typ | Obligatoriskt | Beskrivning |
|------|-----|---------------|-------------|
| `id` | string | Ja | |
| `teamId` | string (FK) | Ja | |
| `title` | string | Ja | |
| `url` | string | Ja | |
| `type` | enum: `pdf`, `doc`, `docx`, `xls`, `xlsx`, `ppt`, `pptx`, `csv`, `other` | Ja | Auto-detekteras från URL |
| `createdDate` | date | Ja | |
| `createdBy` | string (FK → User) | Nej | |
| `isPreRead` | boolean | Nej | Pre-read-flagga |
| `preReadDate` | date | Nej | Pre-read deadline |

**Affärsregler:** Pre-read-flagga gör att sidebar-länken "Teamdokument" blinkar/markeras

---

## 10. Newsflash (Nyhetsflash)

| Fält | Typ | Obligatoriskt | Beskrivning |
|------|-----|---------------|-------------|
| `id` | string | Ja | |
| `teamId` | string (FK) | Ja | |
| `date` | date | Ja | |
| `title` | string | Ja | |
| `content` | string | Ja | |
| `createdBy` | string (FK → User) | Ja | |

**Synlighet:** Alla kan läsa, team-leader+ kan skapa/redigera/radera

---

## 11. Text Module (Textmodul)

Nycklad per team. Innehåller:

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| `teamworkRules` | string | Spelregler för teamwork |
| `reflections[]` | array | Kronologiska reflektioner |
| `reflections[].id` | string | |
| `reflections[].date` | date | |
| `reflections[].text` | string | |
| `teamFocus` | string | Teamets fokusbeskrivning (visas på handlingsplan) |

**Not:** `currentState` och `desiredState` har flyttats till Best Contribution-entiteten (V8).

---

## 12. Tracked Contribution (Spårad mätning)

| Fält | Typ | Obligatoriskt | Beskrivning |
|------|-----|---------------|-------------|
| `id` | string | Ja | |
| `teamId` | string (FK) | Ja | |
| `bcId` | string (FK) | Ja | Kopplat Best Contribution |
| `title` | string | Ja | T.ex. "Kundnöjdhet (NPS)" |
| `targetValue` | number | Ja | Slutmål |
| `currentValue` | number | Ja | Senaste mätvärde |
| `unit` | string | Nej | Enhet (poäng, h, %, st) |
| `targetLine` | number | Nej | Målnivå i diagram |
| `criticalLine` | number | Nej | Kritisk nivå i diagram |
| `chartType` | enum: `bar`, `line` | Nej | Diagramtyp |
| `measurements[]` | array | Ja | Historiska mätpunkter |
| `measurements[].date` | date | Ja | |
| `measurements[].value` | number | Ja | |

---

## 13. PDCA Record

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| `bcId` | string (FK) | Best Contribution |
| `plan` | number (0–100) | Plan-fas |
| `do` | number (0–100) | Do-fas |
| `check` | number (0–100) | Check-fas |
| `act` | number (0–100) | Act-fas |

---

## 14. Locomotive Goal (Lokomotivmål)

| Fält | Typ | Obligatoriskt | Beskrivning |
|------|-----|---------------|-------------|
| `id` | string | Ja | |
| `orgId` | string (FK) | Ja | Organisationsnivå |
| `title` | string | Ja | Målrubrik |
| `description` | string | Nej | |
| `url` | string | Nej | Länk till material |
| `updatedDate` | date | Ja | Senast uppdaterad |

**Affärsregler:** 1–3 per organisation, uppdateras veckovis/månadsvis av ledningen

---

## 15. Strategic Link (Strategisk länk)

Per team:

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| `strategic.url` | string | Länk till strategiskt resonemang |
| `strategic.updatedDate` | date | |
| `progress.url` | string | Länk till strategisk uppföljning |
| `progress.updatedDate` | date | |

---

## 16. Customization (Anpassning)

| Fält | Typ | Obligatoriskt | Beskrivning |
|------|-----|---------------|-------------|
| `orgId` | string (FK) | Ja | Per organisation |
| `category` | string | Ja | `agenda`, `sections`, `modules`, `ui` |
| `key` | string | Ja | T.ex. `module.ideas` |
| `defaultLabel` | string | Ja | Standardetikett |
| `customLabel` | string | Nej | Organisationens egen etikett |

---

## Rollmatris

| Roll | Scope | Kan hantera |
|------|-------|-------------|
| `super_admin` | Alla org | Allt |
| `integ_admin` | Sina org | Org + team + användare + anpassning |
| `org_admin` | Sin org | Team + användare inom sin org |
| `team_leader` | Sina team | Användare-flik, bästa bidrag, nyhetsflash |
| `member` | Sitt team | Åtgärder, idéer, mätningar, dokument, reflektioner |

---

## Arkiveringsmodell

Arkivering är en **vy-filter**, inte en separat datalagring:

- Best Contribution och Area of Improvement har `archived: boolean`
- Arkivsidan (`archive.html`) visar objekt med `archived === true`
- Handlingsplanen (`action-plan.html`) visar objekt med `archived !== true`
- Återställning (un-archive) sätter `archived = false`
- Arkiverade AoI vars BC inte är arkiverad visas i arkivet under sin aktiva BC som kontext
- Bekräftelsedialog krävs för både arkivering och återställning
