// data.jsx — Shared data + content for Optimize Amino
// Plausible (not clinically validated) numbers for the mock.

// ─────────────────────────────────────────────────────────────
// The 9 essential amino acids + reference patterns
// Values are mg / g of protein (standard scoring pattern).
// ─────────────────────────────────────────────────────────────
const EAA = [
  { key: 'His', full: 'Histidine',  blurb: 'Precursor to histamine; supports red blood cell production and immune response.' },
  { key: 'Ile', full: 'Isoleucine', blurb: 'Branched-chain AA. Muscle metabolism, hemoglobin, and energy regulation.' },
  { key: 'Leu', full: 'Leucine',    blurb: 'Branched-chain AA and the strongest trigger for muscle-protein synthesis.' },
  { key: 'Lys', full: 'Lysine',     blurb: 'Collagen synthesis, calcium absorption. The limiting AA in grains.' },
  { key: 'Met', full: 'Met + Cys',  blurb: 'Sulfur-containing. Methyl donor and antioxidant precursor. Limiting in legumes.' },
  { key: 'Phe', full: 'Phe + Tyr',  blurb: 'Aromatic AAs. Precursors to tyrosine, dopamine, thyroid hormones.' },
  { key: 'Thr', full: 'Threonine',  blurb: 'Gut mucin, connective tissue, immune proteins.' },
  { key: 'Trp', full: 'Tryptophan', blurb: 'Rarest EAA. Precursor to serotonin, melatonin, niacin.' },
  { key: 'Val', full: 'Valine',     blurb: 'Branched-chain AA. Muscle coordination and tissue repair.' },
];

// Per-kg-body-weight daily EAA requirements (mg/kg/day).
// Source: FAO/WHO/UNU 2007 adult maintenance. Multiply by body weight.
const EAA_PER_KG = {
  His: 10, Ile: 20, Leu: 39, Lys: 30,
  Met: 15, Phe: 25, Thr: 15, Trp: 4, Val: 26,
};
const PROTEIN_PER_KG = 0.8;      // g/kg/day, RDA for adults

// Named reference patterns user can optimize against.
// Keyed by pattern id. Each value: mg per g protein.
// The three dietary-authority patterns (fao, nam, nan) are averaged
// into `avg`, which is the default — no single body's number is
// treated as authoritative.
const _FAO_V = { His: 15, Ile: 30, Leu: 59, Lys: 45, Met: 22, Phe: 38, Thr: 23, Trp: 6,  Val: 39 };
const _NAM_V = { His: 18, Ile: 25, Leu: 55, Lys: 51, Met: 25, Phe: 47, Thr: 27, Trp: 7,  Val: 32 };
const _NAN_V = { His: 14, Ile: 30, Leu: 60, Lys: 48, Met: 22, Phe: 40, Thr: 25, Trp: 6,  Val: 40 };
const _AVG_V = (() => {
  const out = {};
  Object.keys(_FAO_V).forEach(k => {
    out[k] = Math.round((_FAO_V[k] + _NAM_V[k] + _NAN_V[k]) / 3);
  });
  return out;
})();

// Macro recommendations per pattern (daily totals, ~65 kg adult). Used by
// the solver page when the user opts into macro constraints. Edit these
// when better source numbers are nailed down. Min/max are *per day*; the
// solver scales by `mealFraction` like the AA targets.
const _ADULT_MACROS = {
  kcalMin: 1800, kcalMax: 2400,
  fatMin: 50,   fatMax: 80,
  carbsMin: 225, carbsMax: 325,
  fiberMin: 25,
  proteinMax: 130,
};
const _ATHLETE_MACROS = {
  kcalMin: 2400, kcalMax: 3200,
  fatMin: 60,   fatMax: 110,
  carbsMin: 300, carbsMax: 450,
  fiberMin: 30,
  proteinMax: 200,
};
const _MILK_MACROS = {
  kcalMin: 1800, kcalMax: 2400,
  fatMin: 70,   fatMax: 100,
  carbsMin: 200, carbsMax: 300,
  fiberMin: 25,
  proteinMax: 130,
};

const PATTERNS = {
  avg:     { label: 'Average (FAO + NAM + NAN)', short: 'Average',
             note: 'Mean of the three adult-maintenance patterns — the site default.',
             v: _AVG_V, macros: _ADULT_MACROS },
  fao:     { label: 'FAO/WHO/UNU 2007',   short: 'FAO/WHO',
             note: 'Adult maintenance, the standard international scoring pattern.',
             v: _FAO_V, macros: _ADULT_MACROS },
  nam:     { label: 'NAM / IOM DRI 2005', short: 'NAM',
             note: 'U.S. National Academy of Medicine adult requirement.',
             v: _NAM_V, macros: _ADULT_MACROS },
  nan:     { label: 'Nordic (NNR) 2023',  short: 'Nordic',
             note: 'Nordic Nutrition Recommendations.',
             v: _NAN_V, macros: _ADULT_MACROS },
  milk:    { label: 'Breast milk',        short: 'Milk',
             note: 'Human milk AA composition.',
             v: { His: 26, Ile: 55, Leu: 96, Lys: 69, Met: 33, Phe: 90, Thr: 44, Trp: 17, Val: 55 },
             macros: _MILK_MACROS },
  egg:     { label: 'Whole egg',          short: 'Egg',
             note: 'Gold standard biological value.',
             v: { His: 24, Ile: 55, Leu: 86, Lys: 70, Met: 57, Phe: 97, Thr: 47, Trp: 15, Val: 69 },
             macros: _ADULT_MACROS },
  cow:     { label: 'Cow\u2019s milk',    short: 'Cow milk',
             note: 'Bovine milk AA composition.',
             v: { His: 27, Ile: 47, Leu: 95, Lys: 78, Met: 33, Phe: 102,Thr: 44, Trp: 14, Val: 64 },
             macros: _MILK_MACROS },
  muscle:  { label: 'Human muscle',       short: 'Muscle',
             note: 'Skeletal muscle composition (for athletes).',
             v: { His: 28, Ile: 45, Leu: 75, Lys: 82, Met: 38, Phe: 78, Thr: 42, Trp: 11, Val: 47 },
             macros: _ATHLETE_MACROS },
  soy:     { label: 'Soy protein',        short: 'Soy',
             note: 'Reference for soy-based diets.',
             v: { His: 26, Ile: 49, Leu: 82, Lys: 63, Met: 26, Phe: 95, Thr: 38, Trp: 13, Val: 50 },
             macros: _ADULT_MACROS },
};
const DEFAULT_PATTERN = 'avg';

// ─────────────────────────────────────────────────────────────
// Foods — USDA-backed. Amino values = mg per 100 g of food.
// protein/fat/carbs/fiber = g per 100 g.  kcal = per 100 g.
// cost = USD per 100 g. Sources: Costco/TJ bulk prices 2026-04-24; cooked
// prices derived from dry price ÷ expansion ratio. See foods_curated.csv
// price_source/price_date columns. Foods also in window.FOODS_USDA will be
// overridden by USDA data — only mock-only items (dry pairs, protein powders,
// plant milks, farro) rely on costs below.
// scalable: false = "fixed foods" (subtracted from targets, not LP vars).
//
// If foods-usda.js is loaded (window.FOODS_USDA), we use that. Otherwise
// fall back to the hand-mocked numbers below so the page still renders.
// ─────────────────────────────────────────────────────────────
const _MOCK_FOODS = [
  // Grains (cooked) — USDA wins for these; costs here are fallback only
  { id: 'rice',    cat: 'Grains', name: 'White rice',    emoji: '🍚', cost: 0.034, protein: 2.7, state: 'cooked', pairId: 'rice_dry',
    amino: { His: 65, Ile: 120, Leu: 220, Lys: 95,  Met: 60,  Phe: 145, Thr: 100, Trp: 35,  Val: 170 } },
  { id: 'brice',   cat: 'Grains', name: 'Brown rice',    emoji: '🌾', cost: 0.06,  protein: 2.6, state: 'cooked', pairId: 'brice_dry',
    amino: { His: 70, Ile: 115, Leu: 215, Lys: 100, Met: 62,  Phe: 140, Thr: 100, Trp: 32,  Val: 165 } },
  { id: 'oats',    cat: 'Grains', name: 'Oats (cooked)', emoji: '🥣', cost: 0.18,  protein: 13.0, state: 'cooked', pairId: 'oats_dry',
    amino: { His: 305,Ile: 495, Leu: 980, Lys: 545, Met: 225, Phe: 700, Thr: 440, Trp: 185, Val: 695 } },
  { id: 'quinoa',  cat: 'Grains', name: 'Quinoa',        emoji: '🌱', cost: 0.16,  protein: 4.4, state: 'cooked', pairId: 'quinoa_dry',
    amino: { His: 130,Ile: 165, Leu: 265, Lys: 255, Met: 95,  Phe: 235, Thr: 165, Trp: 55,  Val: 205 } },
  { id: 'pasta',   cat: 'Grains', name: 'Pasta',         emoji: '🍝', cost: 0.11,  protein: 5.8, state: 'cooked', pairId: 'pasta_dry',
    amino: { His: 130,Ile: 220, Leu: 410, Lys: 115, Met: 85,  Phe: 290, Thr: 170, Trp: 65,  Val: 240 } },
  // Farro: not in USDA picks; TJ's farro ~$1.99/17oz → $0.41/100g dry ÷ 3 ≈ $0.14 cooked. ⚠ manual check
  { id: 'farro',   cat: 'Grains', name: 'Farro',         emoji: '🌾', cost: 0.14,  protein: 6.0, state: 'cooked', pairId: 'farro_dry',
    amino: { His: 135,Ile: 215, Leu: 405, Lys: 170, Met: 100, Phe: 285, Thr: 185, Trp: 70,  Val: 260 } },

  // Grains (dry) — mock-only; USDA doesn't include dry pairs
  { id: 'rice_dry',  cat: 'Grains', name: 'White rice (dry)', emoji: '🍚', cost: 0.09,  protein: 7.5, state: 'dry', pairId: 'rice',
    amino: { His: 195,Ile: 360, Leu: 660, Lys: 285, Met: 180, Phe: 435, Thr: 300, Trp: 105, Val: 510 } },
  { id: 'brice_dry', cat: 'Grains', name: 'Brown rice (dry)', emoji: '🌾', cost: 0.17,  protein: 7.9, state: 'dry', pairId: 'brice',
    amino: { His: 210,Ile: 345, Leu: 645, Lys: 300, Met: 186, Phe: 420, Thr: 300, Trp: 96,  Val: 495 } },
  { id: 'oats_dry',  cat: 'Grains', name: 'Oats (dry)',       emoji: '🥣', cost: 0.18,  protein: 16.9, state: 'dry', pairId: 'oats',
    amino: { His: 400,Ile: 690, Leu: 1280,Lys: 700, Met: 310, Phe: 895, Thr: 575, Trp: 234, Val: 930 } },
  { id: 'quinoa_dry',cat: 'Grains', name: 'Quinoa (dry)',     emoji: '🌱', cost: 0.51,  protein: 14.1, state: 'dry', pairId: 'quinoa',
    amino: { His: 410,Ile: 500, Leu: 840, Lys: 770, Met: 310, Phe: 740, Thr: 420, Trp: 170, Val: 600 } },
  { id: 'pasta_dry', cat: 'Grains', name: 'Pasta (dry)',      emoji: '🍝', cost: 0.28,  protein: 13.0, state: 'dry', pairId: 'pasta',
    amino: { His: 295,Ile: 510, Leu: 930, Lys: 255, Met: 195, Phe: 655, Thr: 380, Trp: 145, Val: 545 } },
  // Farro dry: ~$0.41/100g (TJ's estimate). ⚠ manual check
  { id: 'farro_dry', cat: 'Grains', name: 'Farro (dry)',      emoji: '🌾', cost: 0.41,  protein: 15.0, state: 'dry', pairId: 'farro',
    amino: { His: 335,Ile: 530, Leu: 1005,Lys: 420, Met: 245, Phe: 705, Thr: 460, Trp: 170, Val: 645 } },

  // Legumes (cooked) — USDA wins; fallback costs updated
  { id: 'beans',   cat: 'Legumes',name: 'Black beans',   emoji: '🫘', cost: 0.05,  protein: 8.9, state: 'cooked', pairId: 'beans_dry',
    amino: { His: 245,Ile: 385, Leu: 705, Lys: 610, Met: 135, Phe: 485, Thr: 365, Trp: 105, Val: 460 } },
  { id: 'lentils', cat: 'Legumes',name: 'Lentils',       emoji: '🟤', cost: 0.12,  protein: 9.0, state: 'cooked', pairId: 'lentils_dry',
    amino: { His: 255,Ile: 400, Leu: 655, Lys: 625, Met: 80,  Phe: 465, Thr: 325, Trp: 85,  Val: 450 } },
  { id: 'chickpea',cat: 'Legumes',name: 'Chickpeas',     emoji: '🟠', cost: 0.07,  protein: 8.9, state: 'cooked', pairId: 'chickpea_dry',
    amino: { His: 230,Ile: 380, Leu: 630, Lys: 590, Met: 110, Phe: 470, Thr: 330, Trp: 80,  Val: 370 } },
  { id: 'kidney',  cat: 'Legumes',name: 'Kidney beans',  emoji: '🫘', cost: 0.21,  protein: 8.7, state: 'cooked', pairId: 'kidney_dry',
    amino: { His: 240,Ile: 380, Leu: 695, Lys: 595, Met: 130, Phe: 475, Thr: 360, Trp: 100, Val: 455 } },
  { id: 'pinto',   cat: 'Legumes',name: 'Pinto beans',   emoji: '🟫', cost: 0.04,  protein: 9.0, state: 'cooked', pairId: 'pinto_dry',
    amino: { His: 250,Ile: 390, Leu: 705, Lys: 605, Met: 135, Phe: 490, Thr: 370, Trp: 105, Val: 460 } },

  // Legumes (dry) — mock-only
  { id: 'beans_dry',   cat: 'Legumes', name: 'Black beans (dry)',  emoji: '🫘', cost: 0.13,  protein: 22.0, state: 'dry', pairId: 'beans',
    amino: { His: 605,Ile: 950, Leu: 1745,Lys: 1510,Met: 335, Phe: 1200,Thr: 905, Trp: 260, Val: 1140 } },
  { id: 'lentils_dry', cat: 'Legumes', name: 'Lentils (dry)',      emoji: '🟤', cost: 0.31,  protein: 24.6, state: 'dry', pairId: 'lentils',
    amino: { His: 700,Ile: 1100,Leu: 1790,Lys: 1710,Met: 220, Phe: 1270,Thr: 890, Trp: 235, Val: 1230 } },
  { id: 'chickpea_dry',cat: 'Legumes', name: 'Chickpeas (dry)',    emoji: '🟠', cost: 0.17,  protein: 19.3, state: 'dry', pairId: 'chickpea',
    amino: { His: 500,Ile: 825, Leu: 1365,Lys: 1280,Met: 240, Phe: 1020,Thr: 715, Trp: 175, Val: 800 } },
  { id: 'kidney_dry',  cat: 'Legumes', name: 'Kidney beans (dry)', emoji: '🫘', cost: 0.52,  protein: 23.6, state: 'dry', pairId: 'kidney',
    amino: { His: 650,Ile: 1030,Leu: 1880,Lys: 1615,Met: 350, Phe: 1290,Thr: 970, Trp: 280, Val: 1230 } },
  { id: 'pinto_dry',   cat: 'Legumes', name: 'Pinto beans (dry)',  emoji: '🟫', cost: 0.11,  protein: 21.4, state: 'dry', pairId: 'pinto',
    amino: { His: 595,Ile: 925, Leu: 1675,Lys: 1440,Met: 320, Phe: 1165,Thr: 880, Trp: 250, Val: 1095 } },

  // Soy & Wheat Gluten — USDA wins; fallback costs updated
  { id: 'tofu',    cat: 'Soy',    name: 'Firm tofu',     emoji: '⬜', cost: 0.32,  protein: 15.0,
    amino: { His: 395,Ile: 720, Leu: 1180,Lys: 965, Met: 200, Phe: 785, Thr: 620, Trp: 200, Val: 735 } },
  { id: 'tempeh',  cat: 'Soy',    name: 'Tempeh',        emoji: '🟨', cost: 1.10,  protein: 19.0,
    amino: { His: 510,Ile: 890, Leu: 1470,Lys: 900, Met: 265, Phe: 960, Thr: 790, Trp: 240, Val: 940 } },
  { id: 'edamame', cat: 'Soy',    name: 'Edamame',       emoji: '🟢', cost: 0.51,  protein: 11.0,
    amino: { His: 300,Ile: 510, Leu: 830, Lys: 720, Met: 140, Phe: 580, Thr: 430, Trp: 130, Val: 490 } },
  { id: 'seitan',  cat: 'Wheat Gluten', name: 'Seitan',  emoji: '🟫', cost: 1.50,  protein: 25.0,
    amino: { His: 470,Ile: 910, Leu: 1650,Lys: 390, Met: 400, Phe: 1640,Thr: 580, Trp: 210, Val: 970 } },

  // Protein Powders — mock-only; ⚠ prices need manual verification at Costco/TJ's
  { id: 'pea_protein',   cat: 'Protein Powder', name: 'Pea protein powder',   emoji: '🟢', cost: 2.00, protein: 80.0,
    amino: { His: 1900,Ile: 3800,Leu: 6800,Lys: 5800,Met: 1700,Phe: 7700,Thr: 3100,Trp: 800, Val: 4000 } },
  { id: 'soy_protein',   cat: 'Protein Powder', name: 'Soy protein isolate',  emoji: '🟡', cost: 1.76, protein: 85.0,
    amino: { His: 2200,Ile: 4200,Leu: 7000,Lys: 5400,Met: 2200,Phe: 8100,Thr: 3250,Trp: 1100,Val: 4300 } },
  { id: 'rice_protein',  cat: 'Protein Powder', name: 'Rice protein powder',  emoji: '🤎', cost: 2.50, protein: 80.0,
    amino: { His: 1850,Ile: 3500,Leu: 6700,Lys: 3050,Met: 1900,Phe: 7000,Thr: 3000,Trp: 950, Val: 4700 } },
  { id: 'hemp_protein',  cat: 'Protein Powder', name: 'Hemp protein powder',  emoji: '🌿', cost: 2.50, protein: 50.0,
    amino: { His: 1400,Ile: 2100,Leu: 3500,Lys: 2100,Met: 1300,Phe: 4500,Thr: 2100,Trp: 600, Val: 2650 } },

  // Milks (plant) — mock-only; ⚠ prices need manual verification
  { id: 'soy_milk',    cat: 'Milk', name: 'Soy milk',      emoji: '🥛', cost: 0.24, protein: 3.3,
    amino: { His: 90, Ile: 155, Leu: 265, Lys: 210, Met: 45,  Phe: 175, Thr: 135, Trp: 45,  Val: 165 } },
  { id: 'oat_milk',    cat: 'Milk', name: 'Oat milk',      emoji: '🥛', cost: 0.22, protein: 1.0,
    amino: { His: 25, Ile: 40,  Leu: 75,  Lys: 40,  Met: 17,  Phe: 55,  Thr: 35,  Trp: 15,  Val: 55 } },
  { id: 'almond_milk', cat: 'Milk', name: 'Almond milk',   emoji: '🥛', cost: 0.22, protein: 0.5,
    amino: { His: 14, Ile: 18,  Leu: 35,  Lys: 15,  Met: 4,   Phe: 28,  Thr: 15,  Trp: 5,   Val: 20 } },
  { id: 'pea_milk',    cat: 'Milk', name: 'Pea milk',      emoji: '🥛', cost: 0.42, protein: 3.3,
    amino: { His: 80, Ile: 155, Leu: 280, Lys: 235, Met: 70,  Phe: 315, Thr: 130, Trp: 32,  Val: 165 } },

  // Nuts & seeds (scalable) — USDA wins; fallback updated
  { id: 'almond',  cat: 'Nuts',   name: 'Almonds',       emoji: '🟤', cost: 0.92,  protein: 21.0,
    amino: { His: 540,Ile: 750, Leu: 1410,Lys: 580, Met: 150, Phe: 1120,Thr: 600, Trp: 210, Val: 820 } },
  { id: 'cashew',  cat: 'Nuts',   name: 'Cashews',       emoji: '🥜', cost: 1.23,  protein: 18.0,
    amino: { His: 440,Ile: 780, Leu: 1470,Lys: 930, Met: 360, Phe: 960, Thr: 690, Trp: 280, Val: 1090 } },
  { id: 'pumpkin', cat: 'Nuts',   name: 'Pumpkin seeds', emoji: '🎃', cost: 0.88,  protein: 30.0,
    amino: { His: 770,Ile: 1270,Leu: 2420,Lys: 1240,Met: 550, Phe: 2160,Thr: 990, Trp: 580, Val: 1580 } },

  // Fixed foods (not scalable — included at typical serving; subtracted from targets)
  { id: 'peanut',  cat: 'Fixed (spreads & extras)', name: 'Peanut butter', emoji: '🥜',
    cost: 0.55, protein: 25.0, scalable: false, serving: 32,
    amino: { His: 650,Ile: 910, Leu: 1670,Lys: 930, Met: 320, Phe: 1380,Thr: 880, Trp: 280, Val: 1100 } },
  { id: 'avocado', cat: 'Fixed (fruit & veg)', name: 'Avocado', emoji: '🥑',
    cost: 0.80, protein: 2.0, scalable: false, serving: 100,
    amino: { His: 55, Ile: 80, Leu: 145, Lys: 130, Met: 45,  Phe: 100, Thr: 75,  Trp: 25,  Val: 105 } },
  { id: 'peas',    cat: 'Fixed (fruit & veg)', name: 'Green peas', emoji: '🫛',
    cost: 0.35, protein: 5.4, scalable: false, serving: 120,
    amino: { His: 120,Ile: 195, Leu: 325, Lys: 320, Met: 80,  Phe: 245, Thr: 205, Trp: 40,  Val: 235 } },
  { id: 'spinach', cat: 'Fixed (fruit & veg)', name: 'Spinach', emoji: '🥬',
    cost: 0.40, protein: 2.9, scalable: false, serving: 80,
    amino: { His: 65, Ile: 145, Leu: 230, Lys: 175, Met: 55,  Phe: 215, Thr: 130, Trp: 45,  Val: 165 } },
  { id: 'blueberry',cat:'Fixed (fruit & veg)', name: 'Blueberries', emoji: '🫐',
    cost: 1.50, protein: 0.7, scalable: false, serving: 75,
    amino: { His: 12, Ile: 20, Leu: 35, Lys: 12,  Met: 6,   Phe: 22,  Thr: 18,  Trp: 6,   Val: 30 } },

  // Macro-pure foods — solver-page only. Used to make macro constraints
  // (kcal/fat/carbs/fiber) feasible without forcing weird AA solutions.
  // `tag: 'macro'` lets PantryPicker hide them on the simple/essay surface.
  { id: 'olive_oil', cat: 'Macro Pure', name: 'Olive oil', emoji: '🫒',
    cost: 0.43, protein: 0, fat: 100, carbs: 0, fiber: 0, kcal: 884, tag: 'macro',
    amino: { His: 0, Ile: 0, Leu: 0, Lys: 0, Met: 0, Phe: 0, Thr: 0, Trp: 0, Val: 0 } },
  { id: 'mct_powder', cat: 'Macro Pure', name: 'MCT powder', emoji: '🥥',
    cost: 2.00, protein: 0, fat: 70, carbs: 25, fiber: 0, kcal: 730, tag: 'macro',
    amino: { His: 0, Ile: 0, Leu: 0, Lys: 0, Met: 0, Phe: 0, Thr: 0, Trp: 0, Val: 0 } },
  { id: 'sugar', cat: 'Macro Pure', name: 'Sugar (granulated)', emoji: '🍬',
    cost: 0.10, protein: 0, fat: 0, carbs: 100, fiber: 0, kcal: 387, tag: 'macro',
    amino: { His: 0, Ile: 0, Leu: 0, Lys: 0, Met: 0, Phe: 0, Thr: 0, Trp: 0, Val: 0 } },
  { id: 'psyllium', cat: 'Macro Pure', name: 'Psyllium husk', emoji: '🌾',
    cost: 1.50, protein: 0, fat: 0, carbs: 8, fiber: 80, kcal: 200, tag: 'macro',
    amino: { His: 0, Ile: 0, Leu: 0, Lys: 0, Met: 0, Phe: 0, Thr: 0, Trp: 0, Val: 0 } },
];

// Merge USDA base with mock-only categories (protein powders, milks, dry
// variants, new legumes/grains). USDA wins on id collision so real data stays.
function mergeFoodSources(base, extras) {
  const ids = new Set(base.map(f => f.id));
  return [...base, ...extras.filter(f => !ids.has(f.id))];
}
const FOODS = (typeof window !== 'undefined' && window.FOODS_USDA)
  ? mergeFoodSources(window.FOODS_USDA, _MOCK_FOODS)
  : _MOCK_FOODS;

// ─────────────────────────────────────────────────────────────
// AA supplements — pseudo-foods guaranteeing LP feasibility.
// Each is ~99% pure AA; amino[key] = 99000 mg per 100 g.
// Base cost reflects consumer-grade retail ($ per 100 g);
// multiply by `supplementMultiplier` at solve time to discourage use.
// ─────────────────────────────────────────────────────────────
const AA_SUPPLEMENTS = [
  { id: 'aa_his', cat: 'Supplement', name: 'L-Histidine',     emoji: '💊', baseCost: 4.00, key: 'His', supplement: true },
  { id: 'aa_ile', cat: 'Supplement', name: 'L-Isoleucine',    emoji: '💊', baseCost: 5.00, key: 'Ile', supplement: true },
  { id: 'aa_leu', cat: 'Supplement', name: 'L-Leucine',       emoji: '💊', baseCost: 3.00, key: 'Leu', supplement: true },
  { id: 'aa_lys', cat: 'Supplement', name: 'L-Lysine HCl',    emoji: '💊', baseCost: 1.50, key: 'Lys', supplement: true },
  { id: 'aa_met', cat: 'Supplement', name: 'L-Methionine',    emoji: '💊', baseCost: 1.20, key: 'Met', supplement: true },
  { id: 'aa_phe', cat: 'Supplement', name: 'L-Phenylalanine', emoji: '💊', baseCost: 2.50, key: 'Phe', supplement: true },
  { id: 'aa_thr', cat: 'Supplement', name: 'L-Threonine',     emoji: '💊', baseCost: 1.50, key: 'Thr', supplement: true },
  { id: 'aa_trp', cat: 'Supplement', name: 'L-Tryptophan',    emoji: '💊', baseCost: 5.00, key: 'Trp', supplement: true },
  { id: 'aa_val', cat: 'Supplement', name: 'L-Valine',        emoji: '💊', baseCost: 4.00, key: 'Val', supplement: true },
];

// Build AA-supplement "food" records from the skeleton.
function makeSupplementFoods() {
  return AA_SUPPLEMENTS.map(s => {
    const amino = {};
    EAA.forEach(a => { amino[a.key] = 0; });
    amino[s.key] = 99000;  // 99% purity → 99 g of pure AA per 100 g
    return {
      id: s.id, cat: s.cat, name: s.name, emoji: s.emoji,
      cost: s.baseCost, protein: 99,  // dry AA counts as ~all protein
      amino, supplement: true, aaKey: s.key,
    };
  });
}

// BCAA 2:1:1 blend (leucine / isoleucine / valine).
const BCAA_BLEND = {
  id: 'aa_bcaa', cat: 'Supplement', name: 'BCAA 2:1:1 blend', emoji: '💊',
  cost: 1.80, protein: 99, supplement: true, aaKey: 'BCAA',
  amino: (() => {
    const a = {}; EAA.forEach(x => { a[x.key] = 0; });
    a.Leu = 49500;           // 50% of 99%
    a.Ile = 24750;           // 25%
    a.Val = 24750;           // 25%
    return a;
  })(),
};

const ALL_SUPPLEMENTS = [...makeSupplementFoods(), BCAA_BLEND];

// Per-AA degradation factors when food is cooked (heat damage). The AA
// target is scaled by 1/(1 - loss) so the LP buys enough to compensate.
// Values are PLACEHOLDERS — replace with literature numbers once nailed.
// See FAO/WHO/UNU 2007 + Friedman, "Nutritional Value of Proteins from
// Different Food Sources" for source data.
const COOKED_AA_LOSS = {
  His: 0.05,
  Ile: 0.05,
  Leu: 0.05,
  Lys: 0.25,   // Maillard reactions hit lysine hardest
  Met: 0.10,
  Phe: 0.05,
  Thr: 0.15,
  Trp: 0.10,
  Val: 0.05,
};

// Extra constraints (toggleable)
const EXTRA_CONSTRAINTS = [
  { id: 'lysArg', label: 'Lys:Arg ≥ 1.2',
    hint: 'Heart-health ratio; penalizes diets over-weighted toward arginine-rich legumes.' },
  { id: 'lnaa',   label: 'LNAA balance',
    hint: 'Keeps branched/aromatic amino ratio in range (mood/neurotransmitter stability).' },
  { id: 'balanced', label: 'Balanced vs. sufficed',
    hint: 'Minimize max-surplus instead of min-cost. "Just enough" of each, not "much more".' },
  { id: 'bcaa',   label: 'High BCAA',
    hint: 'Forces Leu+Ile+Val above athletic target (~20% of total AA).' },
  { id: 'cooked', label: 'Cooked (heat losses)',
    hint: 'Compensates for cooking damage — scales each AA target up by its degradation factor (lysine hit hardest). Placeholder values; tune later.' },
];

// Named examples (load both pantry subset + constraints)
const EXAMPLES = [
  { id: 'grains',  name: 'Grains only', emoji: '🍚', pattern: 'fao',
    pantry: ['rice','oats','pasta','brice'], constraints: [] },
  { id: 'trail',   name: 'Trail mix',   emoji: '🥜', pattern: 'fao',
    pantry: ['almond','cashew','pumpkin','oats'], constraints: [] },
  { id: 'smoothie',name: 'Protein smoothie', emoji: '🥤', pattern: 'muscle',
    pantry: ['tofu','oats','peanut','soy_milk'], constraints: ['bcaa'] },
  { id: 'seitan',  name: 'Seitan dinner', emoji: '🟫', pattern: 'fao',
    pantry: ['seitan','lentils','rice','spinach'], constraints: [] },
  { id: 'milk',    name: 'Cow-milk target', emoji: '🥛', pattern: 'cow',
    pantry: ['tofu','oats','almond','lentils'], constraints: [] },
  { id: 'powder',  name: 'Protein powder blend', emoji: '💪', pattern: 'muscle',
    pantry: ['pea_protein','soy_protein','rice_protein','hemp_protein'], constraints: ['bcaa'] },
];

// Food categories (ordered for display)
const CATEGORIES = ['Grains','Legumes','Soy','Wheat Gluten','Protein Powder',
                    'Milk','Nuts',
                    'Fixed (fruit & veg)','Fixed (spreads & extras)',
                    'Macro Pure',
                    'Supplement'];

// Default daily protein target in g (for a 65 kg adult at 0.8 g/kg).
const PROTEIN_G = 52;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
// targetsFor(patternId, opts)
//   opts.weightKg      — if set, compute mg targets directly from mg/kg/day
//   opts.proteinG      — override total protein grams/day (otherwise from weight × 0.8)
//   opts.mealFraction  — 1.0 = daily, 0.5 = half, 0.333 = one of three meals
// Defaults: weightKg = 65, proteinG = 52, mealFraction = 1.
function targetsFor(patternId, opts = {}) {
  const weightKg     = opts.weightKg     ?? 65;
  const mealFraction = opts.mealFraction ?? 1;
  const usePerKg     = !!opts.usePerKg;                 // force mg/kg/day mode
  const proteinG     = opts.proteinG     ?? (weightKg * PROTEIN_PER_KG);

  const t = {};
  if (usePerKg) {
    // Pure per-kg/day (FAO) — pattern id ignored.
    EAA.forEach(a => { t[a.key] = Math.round(EAA_PER_KG[a.key] * weightKg * mealFraction); });
  } else {
    const p = PATTERNS[patternId] || PATTERNS[DEFAULT_PATTERN];
    EAA.forEach(a => { t[a.key] = Math.round(p.v[a.key] * proteinG * mealFraction); });
  }
  return t;
}

// Evaluate a meal {foodId: grams} against a pattern id.
function evaluate(meal, patternId = DEFAULT_PATTERN, opts) {
  const targets = targetsFor(patternId, opts);
  const aminoTotals = {};
  let cost = 0, protein = 0, kcal = 0, fat = 0, carbs = 0, fiber = 0, mass = 0;
  EAA.forEach(a => aminoTotals[a.key] = 0);
  const foodLookup = foodById;
  for (const [id, grams] of Object.entries(meal)) {
    const food = foodLookup(id);
    if (!food || !grams) continue;
    const s = grams / 100;
    cost    += (food.cost    || 0) * s;
    protein += (food.protein || 0) * s;
    kcal    += (food.kcal    || 0) * s;
    fat     += (food.fat     || 0) * s;
    carbs   += (food.carbs   || 0) * s;
    fiber   += (food.fiber   || 0) * s;
    mass    += grams;
    EAA.forEach(a => { aminoTotals[a.key] += (food.amino[a.key] || 0) * s; });
  }
  const coverage = {};
  EAA.forEach(a => { coverage[a.key] = aminoTotals[a.key] / targets[a.key]; });
  const limiting = EAA.reduce((lo, a) =>
    coverage[a.key] < coverage[lo.key] ? a : lo, EAA[0]);
  return { cost, protein, kcal, fat, carbs, fiber, mass,
    aminoTotals, coverage, limiting, targets };
}

// Unified food lookup: FOODS + supplements + lazily-loaded extended set.
function foodById(id) {
  return FOODS.find(f => f.id === id)
    || ALL_SUPPLEMENTS.find(f => f.id === id)
    || (window.FOODS_EXTENDED
        ? window.FOODS_EXTENDED.find(f => f.id === id)
        : null)
    || null;
}

// ─────────────────────────────────────────────────────────────
// Extended food set — lazy-loaded on first use.
//
// The eager `FOODS` array only holds the ~50 foods that power chips,
// essay scenarios, and category comparison tables. Everything else
// (the long tail of USDA rows, full amino panel incl. non-essentials,
// micronutrient columns used only in the "download full receipt" CSV)
// lives in `foods-extended.json` and is fetched on demand.
//
// Fire `amino:extended-loaded` on window after the fetch resolves so
// React components can re-render. `loadExtendedFoods()` is idempotent
// and returns the same promise on repeat calls.
// ─────────────────────────────────────────────────────────────
let _extendedPromise = null;
function loadExtendedFoods() {
  if (window.FOODS_EXTENDED) return Promise.resolve(window.FOODS_EXTENDED);
  if (_extendedPromise) return _extendedPromise;
  _extendedPromise = fetch('foods-extended.json')
    .then(r => r.ok ? r.json() : [])
    .catch(() => [])          // missing file is fine — just means no extras
    .then(rows => {
      const clean = Array.isArray(rows)
        ? rows.filter(f => f && f.id && f.name && f.amino)
        : [];
      window.FOODS_EXTENDED = clean;
      window.dispatchEvent(new CustomEvent('amino:extended-loaded',
        { detail: { count: clean.length } }));
      return clean;
    });
  return _extendedPromise;
}

// Scenario meals for the narrative.
const SCENARIOS = {
  justGrains: { rice: 500, oats: 100 },
  justBeans:  { beans: 400, lentils: 200 },
  beansRice:  { rice: 350, beans: 300 },
  optimized:  { rice: 180, beans: 220, tofu: 140, oats: 80, peanut: 32, spinach: 80 },
};

// ─────────────────────────────────────────────────────────────
// Big-M simplex for:    minimize cᵀx   s.t.  A x ≥ b,  x ≥ 0
//
// Adds a surplus s ≥ 0 and an artificial a ≥ 0 per row:
//      A x − I s + I a = b
// Objective: cᵀx + M·Σ a, then row-reduce so artificials enter
// the basis with reduced cost 0.  Standard primal simplex from
// there.  No deps, ~80 LOC.
// ─────────────────────────────────────────────────────────────
function lpSolve({ c, A, b }) {
  const m = A.length;
  const n = c.length;
  if (!m) return { x: new Array(n).fill(0), status: 'optimal' };
  const M = 1e7, eps = 1e-9, maxIter = 4000;
  const total = n + 2 * m;            // x | surplus | artificial

  // Flip rows whose b is negative so the artificial basis stays feasible.
  const rows = [];
  for (let i = 0; i < m; i++) {
    const flip = b[i] < 0 ? -1 : 1;
    const row = new Array(total + 1).fill(0);
    for (let j = 0; j < n; j++) row[j] = flip * A[i][j];
    row[n + i] = -flip;               // surplus  (sign flips with row)
    row[n + m + i] = 1;               // artificial
    row[total] = flip * b[i];
    rows.push(row);
  }
  // Objective row.
  const obj = new Array(total + 1).fill(0);
  for (let j = 0; j < n; j++) obj[j] = c[j];
  for (let i = 0; i < m; i++) obj[n + m + i] = M;
  // Eliminate artificials from objective: subtract M·row_i.
  for (let i = 0; i < m; i++)
    for (let k = 0; k <= total; k++) obj[k] -= M * rows[i][k];
  rows.push(obj);

  const basis = [];
  for (let i = 0; i < m; i++) basis.push(n + m + i);

  for (let it = 0; it < maxIter; it++) {
    // Bland-ish entering: most negative reduced cost.
    let pivotCol = -1, mostNeg = -eps;
    for (let j = 0; j < total; j++) {
      if (obj[j] < mostNeg) { mostNeg = obj[j]; pivotCol = j; }
    }
    if (pivotCol === -1) break;        // optimal

    let pivotRow = -1, minRatio = Infinity;
    for (let i = 0; i < m; i++) {
      const a = rows[i][pivotCol];
      if (a > eps) {
        const ratio = rows[i][total] / a;
        if (ratio < minRatio - eps) { minRatio = ratio; pivotRow = i; }
      }
    }
    if (pivotRow === -1) return { x: null, status: 'unbounded' };

    const pv = rows[pivotRow][pivotCol];
    for (let k = 0; k <= total; k++) rows[pivotRow][k] /= pv;
    for (let i = 0; i <= m; i++) {
      if (i === pivotRow) continue;
      const f = rows[i][pivotCol];
      if (Math.abs(f) > eps)
        for (let k = 0; k <= total; k++) rows[i][k] -= f * rows[pivotRow][k];
    }
    basis[pivotRow] = pivotCol;
  }

  // Infeasible if any artificial remains basic with non-zero value.
  for (let i = 0; i < m; i++) {
    if (basis[i] >= n + m && rows[i][total] > 1e-4)
      return { x: null, status: 'infeasible' };
  }
  const x = new Array(n).fill(0);
  for (let i = 0; i < m; i++) if (basis[i] < n) x[basis[i]] = rows[i][total];
  return { x, status: 'optimal' };
}

// ─────────────────────────────────────────────────────────────
// Solve the meal LP. Returns { meal, supplements, ...evaluate(meal), status }.
// extras: subset of EXTRA_CONSTRAINTS ids — added as ≥ rows.
// supplementMultiplier: cost multiplier for AA-supplement variables
//   (default 10). They are ALWAYS included so the LP is guaranteed
//   feasible — any shortfall appears on the receipt as a supplement line.
// opts: {weightKg, proteinG, mealFraction} forwarded to targetsFor.
// ─────────────────────────────────────────────────────────────
function lpSolveMeal({ pantryIds, fixedIds = [], pattern = DEFAULT_PATTERN,
                      extras = [], supplementMultiplier = 10, opts = {},
                      macros = null }) {
  const baseTargets = targetsFor(pattern, opts);
  const balanced = extras.includes('balanced');
  // Cooked-food adjustment: scale each AA up by 1/(1 - per-AA loss).
  const cooked = extras.includes('cooked');
  const targets = cooked
    ? Object.fromEntries(Object.entries(baseTargets).map(([k, v]) =>
        [k, v * (1 / Math.max(0.01, 1 - (COOKED_AA_LOSS[k] || 0)))]))
    : baseTargets;
  // Macros: scale by mealFraction the same way targetsFor scales AAs.
  const mfrac = (opts && opts.mealFraction) || 1;
  const scaledMacros = macros ? Object.fromEntries(
    Object.entries(macros).map(([k, v]) => [k, v == null ? null : v * mfrac])
  ) : null;

  // Fixed foods at their serving size — subtract from targets.
  const fixedMeal = {};
  fixedIds.forEach(id => {
    const f = foodById(id);
    if (f && f.scalable === false) fixedMeal[id] = f.serving;
  });
  const fixedEval = evaluate(fixedMeal, pattern, opts);

  const pantry = pantryIds
    .map(id => foodById(id))
    .filter(f => f && f.scalable !== false && !f.supplement);

  // Always append all AA supplements as emergency variables.
  const supplementVars = ALL_SUPPLEMENTS.map(s => ({
    ...s, cost: s.cost * supplementMultiplier,
  }));
  const variables = [...pantry, ...supplementVars];
  if (!variables.length) {
    return { meal: fixedMeal, supplements: {}, ...fixedEval,
      foodAminoTotals: { ...fixedEval.aminoTotals },
      suppAminoTotals: Object.fromEntries(EAA.map(a => [a.key, 0])),
      pattern, extras, fixedIds, status: 'no-pantry' };
  }

  const nVar = variables.length;
  const c0 = variables.map(f => (f.cost || 0) / 100);  // $/g
  let A, b, c;

  // Minimum-coverage rows (same for both modes): A_i · x ≥ need_i.
  const minRows = [], minRhs = [];
  EAA.forEach(a => {
    const need = Math.max(0, targets[a.key] - fixedEval.aminoTotals[a.key]);
    if (need === 0) return;
    minRows.push(variables.map(f => (f.amino[a.key] || 0) / 100));
    minRhs.push(need);
  });

  // Macro constraint rows. Each macro min/max becomes a ≥ inequality
  // (max constraints are negated). Fixed-food contribution is subtracted
  // from the bound so the LP only needs to "fill" the remainder.
  const macroRows = [], macroRhs = [];
  if (scaledMacros) {
    const macroAxes = [
      { key: 'kcal',    minK: 'kcalMin',    maxK: 'kcalMax',    eaten: fixedEval.kcal    },
      { key: 'fat',     minK: 'fatMin',     maxK: 'fatMax',     eaten: fixedEval.fat     },
      { key: 'carbs',   minK: 'carbsMin',   maxK: 'carbsMax',   eaten: fixedEval.carbs   },
      { key: 'fiber',   minK: 'fiberMin',   maxK: null,         eaten: fixedEval.fiber   },
      { key: 'protein', minK: null,         maxK: 'proteinMax', eaten: fixedEval.protein },
    ];
    macroAxes.forEach(({ key, minK, maxK, eaten }) => {
      const row = variables.map(f => (f[key] || 0) / 100);
      const ate = eaten || 0;
      if (minK && scaledMacros[minK] != null) {
        macroRows.push(row);
        macroRhs.push(Math.max(0, scaledMacros[minK] - ate));
      }
      if (maxK && scaledMacros[maxK] != null) {
        macroRows.push(row.map(v => -v));
        macroRhs.push(-(Math.max(0, scaledMacros[maxK] - ate)));
      }
    });
  }

  if (!balanced) {
    // Classic min-cost formulation.
    A = [...minRows, ...macroRows];
    b = [...minRhs, ...macroRhs];
    c = c0.slice();
  } else {
    // Balanced mode: add slack t ≥ 0 and require for each AA
    //   A_i · x − need_i · t ≤ need_i     (surplus capped at t × target)
    //   A_i · x           ≥ need_i         (still must meet minimum)
    // Objective: minimize t + ε · cost    (tiny cost tiebreak)
    // Convert ≤ rows to ≥ form by multiplying by −1; lpSolve handles
    // negative b by row-flip internally.
    const rows = [], rhs = [];
    EAA.forEach((a, i) => {
      const need = Math.max(0, targets[a.key] - fixedEval.aminoTotals[a.key]);
      if (need === 0) return;
      const row = variables.map(f => (f.amino[a.key] || 0) / 100);
      // min row (≥ need): extend with t-coefficient 0
      rows.push([...row, 0]);
      rhs.push(need);
      // surplus cap: −A_i·x + need·t ≥ −need
      rows.push([...row.map(v => -v), need]);
      rhs.push(-need);
    });
    // Macro rows in balanced mode: append a 0 t-coefficient.
    macroRows.forEach((row, i) => { rows.push([...row, 0]); rhs.push(macroRhs[i]); });
    A = rows;
    b = rhs;
    c = [...c0.map(v => v * 1e-4), 1];   // minimize t, tiny cost pressure
  }

  const { x: xFull, status } = lpSolve({ c, A, b });
  const x = xFull ? xFull.slice(0, nVar) : null;

  const meal = { ...fixedMeal };
  const supplements = {};   // gram amounts of supplement pseudo-foods
  if (x) {
    variables.forEach((f, j) => {
      const grams = Math.max(0, Math.round(x[j] / 0.1) * 0.1);  // 0.1 g resolution
      if (grams <= 0.05) return;
      if (f.supplement) {
        supplements[f.id] = (supplements[f.id] || 0) + grams;
      } else {
        const rounded = Math.round(grams / 5) * 5;
        if (rounded > 0) meal[f.id] = (meal[f.id] || 0) + rounded;
      }
    });
  }
  const final = evaluate(meal, pattern, opts);
  const foodAminoTotals = { ...final.aminoTotals };

  // Supplement contributions — tracked separately so UI can show the
  // "gap filled" portion of each bar in a different color.
  const suppAminoTotals = Object.fromEntries(EAA.map(a => [a.key, 0]));
  Object.entries(supplements).forEach(([id, grams]) => {
    const f = foodById(id); if (!f) return;
    const s = grams / 100;
    EAA.forEach(a => {
      const add = (f.amino[a.key] || 0) * s;
      suppAminoTotals[a.key] += add;
      final.aminoTotals[a.key] += add;
    });
    final.cost += (f.cost || 0) * s * supplementMultiplier;
  });
  EAA.forEach(a => { final.coverage[a.key] = final.aminoTotals[a.key] / final.targets[a.key]; });
  final.limiting = EAA.reduce((lo, a) =>
    final.coverage[a.key] < final.coverage[lo.key] ? a : lo, EAA[0]);

  return { meal, supplements, ...final,
    foodAminoTotals, suppAminoTotals,
    pattern, extras, fixedIds, supplementMultiplier, status };
}

// Back-compat wrapper used by Receipt + scenarios.
const mockSolve = lpSolveMeal;

Object.assign(window, {
  EAA, EAA_PER_KG, PROTEIN_PER_KG, PATTERNS, DEFAULT_PATTERN,
  FOODS, AA_SUPPLEMENTS, COOKED_AA_LOSS,
  BCAA_BLEND, ALL_SUPPLEMENTS, EXTRA_CONSTRAINTS, EXAMPLES, CATEGORIES,
  PROTEIN_G, SCENARIOS, foodById, loadExtendedFoods,
  targetsFor, evaluate, mockSolve, lpSolve, lpSolveMeal,
});
