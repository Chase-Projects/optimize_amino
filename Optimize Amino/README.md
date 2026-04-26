# Optimize Amino

A linear-programming ode to plant protein. The site frames daily nutrition as an
LP — *minimize cost, subject to the nine essential amino acids* — and then lets
you solve your own pantry against it.

## What's in the site

| Page                   | What it is                                                             |
| ---------------------- | ---------------------------------------------------------------------- |
| `index.html`           | The essay: the model, the graph, the receipt, the food table          |
| `solver.html`          | Just the solver — body-weight targets, pantry, LP receipt              |
| `grains.html`          | Grains in the AA-LP: lysine-poor, calorie-rich                          |
| `legumes.html`         | Legumes: lysine-rich, methionine-poor, the cheap protein engine        |
| `protein-powder.html`  | Isolates: when the solver reaches for them and when it doesn't         |
| `milk.html`            | Soy, oat, almond, pea — fortification and amino shape                  |
| `seitan.html`          | Wheat gluten: densest plant protein, but lysine-thin on its own        |

All pages share a sticky `TopNav` and link back to `solver.html?pantry=<ids>`
with the relevant foods pre-selected.

## How it works

No build step. React 18 + Babel standalone are loaded from unpkg; JSX is
transpiled in the browser. The LP is solved with a Big-M simplex written from
scratch in `data.jsx` (`lpSolveMeal`). Food records ship as a static JS file
(`foods-usda.js`) generated once from USDA FoodData Central.

### Scripts

```
foods-usda.js           # static USDA-sourced food table (generated)
data.jsx                # LP, targets, food data, amino supplements
v2-ui.jsx               # shared UI primitives (colors, chips, tooltips, bars)
v2-nav.jsx              # TopNav
v2-graph.jsx            # LP feasibility-polygon diagram
v2-tool.jsx             # MiniTool: body targets + pantry picker + receipt
v2-page.jsx             # V2Intro essay layout
v2-category.jsx         # Shared category-page template
v2-category-data.jsx    # CATEGORY_CONFIGS for the 5 food-group pages
v2-solver-page.jsx      # SolverPage wrapper used by solver.html
build_foods.py          # One-shot USDA fetcher (requires API key env var)
```

### Rebuilding the food table

```
export USDA_API_KEY=...                       # FoodData Central key
python3 build_foods.py > foods-usda.js
```

### Core vs. extended food data

The food table is split across two files so first paint stays small:

- **`foods-usda.js`** — eager, loaded on every page. Holds ~50 core foods that
  power the pantry chips, essay scenarios, and category-comparison tables. Each
  row has the 9 essential amino acids + macros + cost.
- **`foods-extended.json`** — lazy, fetched on demand. Holds the long tail of
  the USDA dataframe plus the full amino panel (essentials *and* non-essentials:
  Ala, Arg, Asp, Cys, Glu, Gly, Pro, Ser, Tyr) and any micronutrient columns
  (sodium, iron, calcium, …). Pulled the first time a user focuses the "Add
  from full list" search box, and again when they click "Download full
  receipt." A `<link rel="prefetch">` on `index.html` / `solver.html` warms it
  in the background after first paint.

**Extended schema** — each row is a plain object:

```json
{
  "id":      "rice_basmati",
  "cat":     "Grains",
  "name":    "Basmati rice (cooked)",
  "emoji":   "🍚",
  "cost":    0.24,
  "protein": 3.5, "fat": 0.6, "carbs": 25.2, "fiber": 0.5, "kcal": 121,
  "state":   "cooked", "pairId": "rice_basmati_dry",
  "amino":   { "His": 82, "Ile": 140, "Leu": 290, "Lys": 125,
               "Met": 80, "Phe": 180, "Thr": 126, "Trp": 40, "Val": 198,
               "Ala": 205, "Arg": 290, "Asp": 340, "Cys": 70,
               "Glu": 640, "Gly": 170, "Pro": 165, "Ser": 190, "Tyr": 160 },
  "sodium":  1, "iron": 0.4, "calcium": 10,
  "fdc":     "173279"
}
```

Any numeric key outside the reserved set
(`id, cat, name, emoji, amino, notes, fdc, state, pairId, supplement,
scalable, serving, aaKey, baseCost, key, source`) is treated as a
micronutrient and included in the downloadable CSV. Rows missing
`id`/`name`/`amino` are skipped by the loader. IDs that collide with
`foods-usda.js` lose — core data wins.

## Hosting

The site is fully static. Any static host will do:

```
# Local preview
python3 -m http.server 8000
# → http://localhost:8000/
```

For GitHub Pages / Netlify / Vercel, deploy the `Optimize Amino/` folder as the
site root. The entry point is `index.html`.

## The LP, in one paragraph

Variables are grams of each food in the pantry plus a pseudo-food for every
essential amino acid (and a BCAA blend). Constraints require each AA to clear
its FAO requirement scaled by body weight and meal fraction. The objective is
total cost. Supplements have their real retail cost multiplied by a tunable
factor (default 10×) so the solver only reaches for them when nothing in the
pantry can cover the shortfall — which keeps the LP always feasible, while
letting gaps stay visible on the receipt.
