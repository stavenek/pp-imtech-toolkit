# Sammanfattning av analyser: admin-req.md

Sammanställning av tre oberoende granskningar av `docs/admin-req.md` mot originalkrav och UX-best practices.

Källdokument:
- `docs/tmp/admin/codex-admin-req-gap-analysis.md`
- `docs/tmp/admin/gemini-report.md`
- `docs/tmp/admin/ux-review.md`

---

## 1. Codex gap-analys

Jämför `admin-req.md` mot alla originalkrav. Slutsats: **delvis i linje** — dokumentet fungerar som en moderniserad målbild, inte en strikt spegling av legacy. Viktigaste avvikelserna:

- **Rollmodellen är omgjord** — `TeamMembership.teamRole` är en ny struktur, inte från originalet
- **Org-modellen är stramare** — en user per org, men skärmdumpar visar att det gamla systemet tillät tvärorganisatoriska kopplingar
- **Hårdare rollregler** — blockerar redigering av *samma* nivå, inte bara högre (skärpning)
- **Saknas:** agendaredigering, remove-from-team-flöde, regler för ej registrerade användare
- **Tillagt utan kravstöd:** Behörigheter-flik, URL-kontrakt, detaljerade UX-regler, subscriptionTier

## 2. Gemini-rapport

Positivare bedömning — ser `admin-req.md` som en **korrekt vidareutveckling**. Kärnfunktionalitet (roller, domänmodell, inbjudan, soft delete) stämmer väl. Noterar:

- **Ny:** Abonnemangsnivåer (Basic/Plus/Pro) — fanns inte i gamla systemet
- **Ny:** Detaljerade UX-mönster (slide-over, toast, deep linking)
- **Saknas:** Agendaredigering i admin-vyn (kan ligga i sidomenyn istället)
- **Namnbyte:** "Company" → "Organisation", "Team Administrator" → "Team Leader"

## 3. UX-granskning

Expertanalys av användarupplevelsen. Betyg: **7/10**. Tre huvudproblem:

1. **Tvåstegsflöde (modal → slide-over) = 3 klick** — föreslår 1-klick direkt till slide-over
2. **Saknar laddnings-/feltillstånd** — skeleton loaders, valideringsfel, concurrent edit
3. **Tillgänglighetsbrister** — saknar ARIA-attribut, `aria-sort`, `aria-live`, fokushantering

Ytterligare rekommendationer: paginering, separera enskild/bulk-inbjudan i tabbar, kompakt tabell för team-medlemskap, "Alla organisationer"-alternativ för SA, batch-åtgärder, aktivitetslogg, CSV-export.

---

## Gemensam bild

Alla tre ser `admin-req.md` som en solid grund men med medvetna avvikelser från legacy. Agendaredigering saknas genomgående. UX-granskningen ger mest konkreta förbättringsförslag.

### Saker som alla tre är överens om

- Kärnmodellen (Organisation → Team → User, roller, inbjudan, soft delete) stämmer
- Agendaredigering saknas i admin-specen
- Dokumentet är en modernisering, inte en 1:1-kopia av legacy

### Viktigaste åtgärder (prioriterat)

| # | Åtgärd | Källa |
|---|---|---|
| 1 | Förenkla till ett-klick-flöde (skippa detalj-modal) | UX-granskning |
| 2 | Lägg till laddnings-/fel-/spartillstånd | UX-granskning |
| 3 | Paginering i tabellen | UX-granskning |
| 4 | Klargör agendaredigering — var hanteras det? | Codex + Gemini |
| 5 | Märk dokumentet som målarkitektur med explicit avvikelsesektion | Codex |
| 6 | Komplettera ARIA/tillgänglighet | UX-granskning |
| 7 | Dela inbjudning enskild/bulk i tabbar | UX-granskning |
| 8 | Klargör org-modell: en user per org vs tvärorganisatoriskt | Codex |
