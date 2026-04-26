# Changes — Optimize Amino

This is the report of major changes made across the two sessions, grouped
by bucket so each is easy to audit.

## 1. LP model

**Supplements as always-on emergency variables.** Every amino acid got a
pseudo-food (`aa_his … aa_val`) plus a BCAA 2:1:1 blend, all attached as
decision variables in every solve. Their real retail cost is multiplied by
a tunable multiplier (default 10×, user-adjustable 1–50 via a slider) so
the LP only reaches for them when the pantry can't cover an AA. The LP is
now guaranteed feasible; shortfalls surface on the receipt as a red
"SHORTFALL · SUPPLEMENTS" block with dosage and dollar cost.
— `data.jsx:209–248`, `data.jsx:lpSolveMeal`

**Balanced vs. sufficed, actually implemented.** Previously the extra
constraint was a flag with no teeth. Rewrote as a minimax LP: introduce a
slack `t ≥ 0`, require `A_i·x − need_i·t ≤ need_i` alongside the usual
floor `A_i·x ≥ need_i`, minimize `t + ε·cost`. Result: every AA lands as
close to 100% as the pantry allows, cost as tiebreaker. No more 230%
leucine blowouts when this toggle is on.
— `data.jsx:450–475`

**Patterns expanded.** Added **NAM / IOM DRI 2005**, relabeled Nordic
(NNR) unambiguously so it's no longer confusable with NAM, and added
**Average (FAO + NAM + NNR)** — arithmetic mean of the three adult
authorities. The Average pattern is the site default (no single body is
treated as authoritative); the `DEFAULT_PATTERN` constant propagates
everywhere that used to hard-code `'fao'`.
— `data.jsx:30–64`, `v2-tool.jsx:325`, `v2-solver-page.jsx:10`

**Food-vs-supplement accounting exposed.** `lpSolveMeal` now returns
`foodAminoTotals` and `suppAminoTotals` separately so the UI can show the
two sources distinctly.

## 2. Design

**Readable hand-style font.** Swapped Caveat for Patrick Hand / Kalam
across all pages — still editorial, visibly more legible at the sizes the
essay uses. Updated Google Fonts imports in every HTML file.

**`InfoTip` / `InfoDot` tooltips.** A shared hover/focus tooltip component
with Escape-to-dismiss and click-outside handling. Attached to every
constraint chip, the protein target, and each individual amino acid in
`AminoBars` (tooltip text comes from the new `EAA[].blurb` field).
— `v2-ui.jsx:138–270`

**Dry/cooked toggle.** Always-visible `cooked ↔ dry` segmented control in
the pantry picker. The common-foods grid shows one chip per pair in the
preferred form; the full-list search returns both variants so the user
can pick the one matching how they'll actually prep. Toggle flips also
convert currently-selected pairs to the matching variant instead of
leaving stale state.
— `v2-tool.jsx:152–297`

*Bugfix (second session):* clicking a chip called `onToggle(f.id)` where
`f.id` was the currently-preferred variant, but the selected set could
hold the *paired* id — you could end up with both `rice` and `rice_dry`
selected, or clicks that failed to deselect after flipping the toggle.
Replaced with `togglePaired(id)` that removes both ids before adding, so
a click always ends in exactly one variant or none.
— `v2-tool.jsx:351–389`

**Bar overlay for supplement fill.** `AminoBars` now accepts `foodTotals`
and splits each bar into a food portion (normal color) and a plum segment
showing how much of the 100% was filled by the solver reaching for a
supplement. Small legend ("█ = filled by supplement") appears in the
receipt header only when supplements are non-zero.
— `v2-ui.jsx:143–196`, `v2-tool.jsx:727–745`

**LP example graph.** Rewrote the feasibility diagram with five real
constraints (x ≥ 0, y ≥ 0, Lys floor, Met floor, budget, palatability
ceiling) producing a pentagonal feasible region. Vertices are
pre-computed in closed form; the optimum sits at the Lys ∩ Met vertex
(not on a line edge as in the previous graph). Isocost lines are drawn
at three levels so the user can see cost sweeping across the polygon.
— `v2-graph.jsx`

**Body-target panel.** Weight input (lb default, kg switch), protein mode
selector (RDA 0.8 g/kg · Athletic 1.6 · Custom · FAO mg/kg/d), meal
fraction (day · ½ · ⅓ · ¼), supplement-cost multiplier slider. All of
these flow through `targetsFor(patternId, opts)`.
— `v2-tool.jsx:BodyTargetPanel`

## 3. Site / hosting

**Category pages.** Separate pages for Grains, Legumes, Protein powder,
Plant milks, and Seitan. Each uses a shared `CategoryPage` template:
hero sticker, multi-paragraph intro essay, comparison table (protein,
cost, protein/$, highlight AA), per-food `AminoBars`, topic notes grid,
and a CTA to `solver.html?pantry=<ids>` with that category's foods
pre-selected.
— `v2-category.jsx`, `v2-category-data.jsx`,
  `grains.html` / `legumes.html` / `milk.html` / `protein-powder.html` / `seitan.html`

**Shared nav.** Sticky `TopNav` wired to every page, with the current
page highlighted in tomato.
— `v2-nav.jsx`

**Solver page.** `solver.html` reads `?pantry=id1,id2&pattern=xxx` from
the query string and preloads the MiniTool with those foods. Linked from
every category CTA.
— `solver.html`, `v2-solver-page.jsx`

**Hosting entry point.** `index.html` is now a clean entry that renders
the essay with the TopNav on top. `favicon.svg` ships. The existing
"Optimize Amino - Introduction.html" is left intact for authored links.

## 4. Data loading

**Core / extended split.** `foods-usda.js` stays eager and small (~50
foods used everywhere). A new `foods-extended.json` is fetched on demand
the first time the user focuses the full-list search box. Results include
both sources; de-duped by id. The search header shows `+N extended` once
loaded, or `loading extended set…` while in flight. The extended file
holds the long-tail foods plus full amino panels (incl. non-essentials)
and micronutrients.
— `data.jsx:loadExtendedFoods`, `v2-tool.jsx:PantryPicker`

**Download full receipt · CSV.** New button on the receipt kicks off a
CSV export with one row per food + supplement used. Columns: id, name,
category, grams, scaled macros, full amino panel (essentials + any
non-essentials present), plus every numeric micronutrient column seen in
the extended data. Uses `URL.createObjectURL`, no server round-trip.
— `v2-tool.jsx:downloadReceiptCSV`

**Prefetch.** `<link rel="prefetch" href="foods-extended.json">` on
`index.html` and `solver.html` warms the extended file in the background
after first paint, so the first search-box keystroke feels instant
without blocking initial render.

**Schema documented.** README has the full schema, reserved-key list, and
collision rules. Loader is defensive: 404 yields an empty list, rows
missing `id`/`name`/`amino` are filtered out.

## 5. Files added / touched

New files:
- `index.html`, `solver.html`
- `grains.html`, `legumes.html`, `milk.html`, `protein-powder.html`, `seitan.html`
- `v2-nav.jsx`, `v2-category.jsx`, `v2-category-data.jsx`, `v2-solver-page.jsx`
- `favicon.svg`, `foods-extended.json` (stub)
- `README.md`, `CHANGES.md`

Significant rewrites:
- `data.jsx` — patterns, supplements, targetsFor, LP, lazy loader
- `v2-graph.jsx` — pentagon feasible region
- `v2-tool.jsx` — body panel, pantry picker, balanced-mode wiring, receipt CSV
- `v2-ui.jsx` — font change, InfoTip/InfoDot, stacked AminoBars
- `Optimize Amino - Introduction.html`, `Optimize Amino - Aesthetic Canvas.html` — font swap

## Known gaps / likely next

- `foods-extended.json` is an empty `[]` stub. Populate it from the
  dataframe with the full-column schema documented in README.
- `EXTRA_CONSTRAINTS.lysArg` and `.lnaa` are still declared but not
  enforced in the LP (they'd need arginine data + minor reformulation).
- The essay page (`v2-page.jsx`) still references `'fao'` when computing
  scenario comparisons — intentional, since those scenarios compare
  against one fixed authority. Only user-driven solves default to
  `'avg'`.
