#!/usr/bin/env python3
"""Extract a curated FOODS array from the USDA Soy_Cube CSVs.

Picks clean SR-Legacy entries (raw/cooked, no brand junk), pulls the
9 essential amino acids per 100 g of food, and writes a JS module
that overrides FOODS in the design page.
"""
import csv
import json
import os
import sys

CSV_DIR = os.path.join(os.path.dirname(__file__), '..', 'USDA Data')
OUT     = os.path.join(os.path.dirname(__file__), 'foods-usda.js')

# USDA nutrient ids
N = {
    'Protein': 1003, 'Fat': 1004, 'Carbs': 1005, 'Fiber': 1079,
    'Kcal': 1008,           # Energy (kcal)
    'KcalAtwater': 2047,    # Energy (Atwater General Factors) — fallback
    'Trp': 1210, 'Thr': 1211, 'Ile': 1212, 'Leu': 1213, 'Lys': 1214,
    'Met': 1215, 'Cys': 1216, 'Phe': 1217, 'Tyr': 1218, 'Val': 1219,
    'His': 1221,
}

# Hand-picked fdc_id, display name, category, emoji, USD/100 g.
# fdc_ids verified against SR Legacy / Foundation Foods naming.
# (id, fdc_id, name, category, emoji, USD/100g, [serving_g if fixed])
# Cost values are rough placeholders (no scrape source — see README).
# id chosen to overlap original data.jsx so EXAMPLES/SCENARIOS keep working.
PICKS = [
    # Grains — costs from Costco/TJ's bulk, 2026-04-24; cooked costs derived from dry
    ('rice',      168878, 'White rice (cooked)',      'Grains',  '🍚', 0.034),  # Costco $0.09/100g dry ÷ 2.65
    ('brice',     169704, 'Brown rice (cooked)',      'Grains',  '🌾', 0.06),   # Costco $0.17/100g dry ÷ 2.75
    ('oats',      169705, 'Oats (rolled)',            'Grains',  '🥣', 0.18),   # Costco 10 lb
    ('quinoa',    168917, 'Quinoa (cooked)',          'Grains',  '🌱', 0.16),   # Costco $0.51/100g dry ÷ 3.2
    ('pasta',     168927, 'Pasta (cooked)',           'Grains',  '🍝', 0.11),   # Costco Barilla $0.28/100g dry ÷ 2.5
    ('buckwheat', 170685, 'Buckwheat groats',         'Grains',  '🟤', 1.63),   # Bob's Red Mill 16 oz
    ('bulgur',    170287, 'Bulgur (cooked)',          'Grains',  '🌾', 0.32),   # TJ $0.80/100g dry ÷ 2.5
    ('amaranth',  170682, 'Amaranth (dry)',           'Grains',  '🌾', 1.17),   # Bob's Red Mill 24 oz
    ('barley',    170285, 'Barley, pearled (cooked)', 'Grains',  '🌾', 0.18),   # BRM $0.53/100g dry ÷ 3
    # Legumes
    ('beans',     173735, 'Black beans (cooked)',     'Legumes', '🫘', 0.05),   # Costco 25 lb $0.13 dry ÷ 2.5
    ('lentils',   172421, 'Lentils (cooked)',         'Legumes', '🟤', 0.12),   # Costco 10 lb $0.31 dry ÷ 2.5
    ('chickpea',  173757, 'Chickpeas (cooked)',       'Legumes', '🟠', 0.07),   # Costco 25 lb $0.17 dry ÷ 2.5
    ('kidney',    173740, 'Kidney beans (cooked)',    'Legumes', '🔴', 0.21),   # Costco $0.52 dry ÷ 2.5
    ('pinto',     175200, 'Pinto beans (cooked)',     'Legumes', '🟫', 0.04),   # Costco 25 lb $0.11 dry ÷ 2.5
    ('navy',      173746, 'Navy beans (cooked)',      'Legumes', '⚪', 0.05),   # est $0.13 dry ÷ 2.5
    ('white_b',   175203, 'White beans (cooked)',     'Legumes', '⚪', 0.08),   # est
    ('mung',      174257, 'Mung beans (cooked)',      'Legumes', '🟢', 0.21),   # Costco $0.52 dry ÷ 2.5
    ('splitpea',  172429, 'Split peas (cooked)',      'Legumes', '🟢', 0.06),   # Costco $0.16 dry ÷ 2.5
    ('cowpea',    168402, 'Black-eyed peas (cooked)', 'Legumes', '⚫', 0.10),   # est
    # Soy
    ('tofu',      172448, 'Firm tofu',                'Soy',     '⬜', 0.32),   # Costco 4×16 oz
    ('tempeh',    174272, 'Tempeh',                   'Soy',     '🟨', 1.10),   # TJ 8 oz
    ('edamame',   168411, 'Edamame (cooked)',         'Soy',     '🟢', 0.51),   # Costco frozen shelled
    ('soybeans',  174299, 'Soybeans (mature, cooked)','Soy',     '🟡', 0.51),   # Costco edamame as proxy
    ('soy_iso',   174276, 'Soy protein isolate',      'Soy',     '🥄', 1.76),   # TJ Trader Darwin's
    # Nuts & seeds
    ('almond',    170567, 'Almonds (raw)',            'Nuts',    '🟤', 0.92),   # Costco 3 lb
    ('cashew',    170162, 'Cashews (raw)',            'Nuts',    '🥜', 1.23),   # Costco 2.5 lb
    ('walnut',    170187, 'Walnuts (English)',        'Nuts',    '🌰', 0.95),   # Costco 3 lb
    ('pistachio', 170184, 'Pistachios (raw)',         'Nuts',    '🟢', 2.00),   # Costco in-shell → shelled equiv
    ('pumpkin',   170556, 'Pumpkin seeds (kernels)',  'Nuts',    '🎃', 0.88),   # TJ raw pepitas 16 oz
    ('sunflower', 170154, 'Sunflower seeds',          'Nuts',    '🌻', 0.66),   # TJ raw 16 oz
    ('hemp',      170148, 'Hemp seeds (hulled)',      'Nuts',    '🌿', 1.21),   # Costco 2 lb
    ('chia',      170554, 'Chia seeds',               'Nuts',    '⚫', 0.68),   # Costco 3 lb
    ('sesame',    170150, 'Sesame seeds',             'Nuts',    '⚪', 1.08),   # Costco 18 oz
    ('tahini',    170189, 'Tahini',                   'Nuts',    '🥣', 1.23),   # TJ organic 10.6 oz
    # Fixed (per serving, in g)
    ('peanut',   174266, 'Peanut butter',     'Fixed (spreads & extras)', '🥜', 0.55, 32),   # Costco 2×28 oz
    ('avocado',  171705, 'Avocado',           'Fixed (fruit & veg)',      '🥑', 0.80, 100),  # est
    ('peas',     170016, 'Green peas (frozen)','Fixed (fruit & veg)',     '🫛', 0.35, 120),  # TJ
    ('spinach',  168463, 'Spinach (cooked)',  'Fixed (fruit & veg)',      '🥬', 0.83, 80),   # USDA ERS ~$0.77–0.88/100g
    ('blueberry',171711, 'Blueberries (raw)', 'Fixed (fruit & veg)',      '🫐', 1.50, 75),   # est
    ('broccoli', 168510, 'Broccoli (cooked)', 'Fixed (fruit & veg)',      '🥦', 0.35, 90),   # est
    ('kale',     169238, 'Kale (cooked)',     'Fixed (fruit & veg)',      '🥬', 0.40, 60),   # est
    ('sweetp',   168483, 'Sweet potato',      'Fixed (fruit & veg)',      '🍠', 0.20, 130),  # est
    ('spirulina',170495, 'Spirulina (dried)', 'Fixed (spreads & extras)', '🟢', 3.00, 7),    # est
]

# USDA Soy_Cube CSV is missing amino data for these — fall back to
# values from USDA SR Legacy (entered by hand from the public release).
FALLBACK = {
    'seitan': dict(
        id='seitan', fdc=None, name='Seitan (vital wheat gluten)',
        cat='Wheat Gluten', emoji='🟫', cost=0.80, protein=75.16,  # Anthony's 4 lb ~$14.59 (Amazon/Walmart)
        amino=dict(His=1530, Ile=2884, Leu=5095, Lys=1287,
                   Met=2160, Phe=6260, Thr=1981, Trp=830, Val=3079)),
    'soy_milk': dict(
        id='soy_milk', fdc=None, name='Soy milk (unsweetened)',
        cat='Fixed (spreads & extras)', emoji='🥛', cost=0.24,  # TJ 32 oz
        protein=3.27, scalable=False, serving=240,
        amino=dict(His=88, Ile=156, Leu=270, Lys=220,
                   Met=78, Phe=327, Thr=131, Trp=45, Val=158)),
    'nutyeast': dict(
        id='nutyeast', fdc=None, name='Nutritional yeast',
        cat='Fixed (spreads & extras)', emoji='🟡', cost=3.97,  # TJ 4 oz
        protein=45.0, scalable=False, serving=16,
        amino=dict(His=1240, Ile=2620, Leu=3890, Lys=4290,
                   Met=1800, Phe=4180, Thr=2780, Trp=560, Val=3050)),
}

def main():
    print(f'reading {CSV_DIR}/food_nutrient.csv ...', file=sys.stderr)
    wanted = {p[1] for p in PICKS}
    nut = {fid: {} for fid in wanted}
    with open(os.path.join(CSV_DIR, 'food_nutrient.csv')) as f:
        r = csv.DictReader(f)
        for row in r:
            try:
                fid = int(row['fdc_id'])
            except ValueError:
                continue
            if fid not in wanted:
                continue
            try:
                nid = int(row['nutrient_id'])
                amt = float(row['amount'])
            except ValueError:
                continue
            if nid in N.values():
                nut[fid][nid] = amt

    out_foods = []
    for pick in PICKS:
        sid, fid, name, cat, emoji, cost = pick[:6]
        serving = pick[6] if len(pick) > 6 else None
        n = nut.get(fid, {})
        if not n or N['Protein'] not in n:
            print(f'  skip {fid} {name}: no protein data', file=sys.stderr)
            continue
        protein = n[N['Protein']]   # g per 100 g
        fat   = n.get(N['Fat'],   0)
        carbs = n.get(N['Carbs'], 0)
        fiber = n.get(N['Fiber'], 0)
        kcal  = n.get(N['Kcal']) or n.get(N['KcalAtwater']) or \
                round(protein*4 + carbs*4 + fat*9)
        # mg/100g for the 9 EAA buckets
        amino = {
            'His': round(n.get(N['His'], 0) * 1000),
            'Ile': round(n.get(N['Ile'], 0) * 1000),
            'Leu': round(n.get(N['Leu'], 0) * 1000),
            'Lys': round(n.get(N['Lys'], 0) * 1000),
            'Met': round((n.get(N['Met'], 0) + n.get(N['Cys'], 0)) * 1000),
            'Phe': round((n.get(N['Phe'], 0) + n.get(N['Tyr'], 0)) * 1000),
            'Thr': round(n.get(N['Thr'], 0) * 1000),
            'Trp': round(n.get(N['Trp'], 0) * 1000),
            'Val': round(n.get(N['Val'], 0) * 1000),
        }
        if sum(amino.values()) == 0:
            print(f'  skip {fid} {name}: no amino data', file=sys.stderr)
            continue
        food = {
            'id': sid, 'cat': cat, 'name': name, 'emoji': emoji,
            'cost': cost, 'protein': round(protein, 2),
            'fat': round(fat, 2), 'carbs': round(carbs, 2),
            'fiber': round(fiber, 2), 'kcal': round(kcal),
            'fdc': fid, 'amino': amino,
        }
        if serving is not None:
            food['scalable'] = False
            food['serving'] = serving
        out_foods.append(food)

    # Append fallbacks for items with no amino rows in the CSV.
    out_foods.extend(FALLBACK.values())

    print(f'\n{len(out_foods)} foods total', file=sys.stderr)
    with open(OUT, 'w') as f:
        f.write('// AUTO-GENERATED by build_foods.py from USDA Soy_Cube CSVs.\n')
        f.write('// Amino acids: mg per 100 g of food. Protein: g per 100 g.\n')
        f.write('window.FOODS_USDA = ')
        json.dump(out_foods, f, indent=2)
        f.write(';\n')
    print(f'wrote {OUT}', file=sys.stderr)

if __name__ == '__main__':
    main()
