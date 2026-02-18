# Baskrav för prototyper

Dessa krav gäller **alla** HTML-prototyper och ska alltid uppfyllas. Kontrollera efter varje kravuppdatering att dessa regler fortfarande följs.

---

## 1. Rollväljare i alla prototyper

Alla prototyper som visar rollberoende innehåll **måste** inkludera en synlig rollväljare ("debug bar") som låter testaren byta perspektiv utan att navigera bort från sidan.

### Implementation

En fast bar längst ner med segmented control:

```
┌──────────────────────────────────────────────────────────────┐
│ Visa som: [Super Admin] [Integ Admin] [Org Admin] [TL] [User] │
└──────────────────────────────────────────────────────────────┘
```

### Teknisk lösning

Enkel CSS-klass-baserad toggling:

1. `<body>` får en klass som speglar vald roll, t.ex. `class="role-super-admin"`
2. Element som är begränsade till en viss roll märks med `data-min-role`:
   - `data-min-role="super-admin"` — enbart Super Admin
   - `data-min-role="integ-admin"` — Integ Admin+
   - `data-min-role="org-admin"` — Org Admin+
   - `data-min-role="team-leader"` — Team Leader+
3. CSS döljer element som inte matchar vald roll:
   ```css
   .role-user [data-min-role="team-leader"],
   .role-user [data-min-role="org-admin"],
   .role-user [data-min-role="integ-admin"],
   .role-user [data-min-role="super-admin"] { display: none; }

   .role-team-leader [data-min-role="org-admin"],
   .role-team-leader [data-min-role="integ-admin"],
   .role-team-leader [data-min-role="super-admin"] { display: none; }

   .role-org-admin [data-min-role="integ-admin"],
   .role-org-admin [data-min-role="super-admin"] { display: none; }

   .role-integ-admin [data-min-role="super-admin"] { display: none; }
   ```
4. JavaScript byter klassen på `<body>` vid klick på rollväljaren

### Krav

- Rollväljaren ska vara **alltid synlig** och inte kunna döljas av scroll
- Default-roll vid sidladdning: `super-admin` (visar allt)
- Vald roll ska sparas i `localStorage` så den behålls vid sidbyte
- Rollväljaren ska vara visuellt distinkt (t.ex. mörkare bakgrund, monospace-font) så att den tydligt skiljer sig från prototypens egentliga UI

---

## 2. Språk

Allt användargränssnitt ska vara på **svenska**. Undantag: tekniska termer som saknar etablerad svensk översättning.

---

## 3. Självständiga filer

Varje HTML-prototyp ska vara en **fristående fil** med inline CSS och JS. Inga externa beroenden förutom Google Fonts (om tillämpligt).

# Baskrav för systemet

## Interaktivitet
- Navigering och interaktivitet ska vara konsekvent, t.ex. hur man raderar eller redigerar olika objekt.
- **Tabellrader är klickbara** — klick på en rad i en listtabell (användare, team, organisationer) öppnar alltid redigerings-slide-over för det objektet. Knappar/länkar i raden hanteras separat (klick på knapp/länk triggar inte rad-klick).
- **Destruktiva åtgärder kräver bekräftelse** — alla operationer som tar bort, avaktiverar eller på annat sätt permanent ändrar data ska visa en bekräftelsedialog innan de genomförs (t.ex. radera team, ta bort medlem från team, ta bort användare från organisation).

