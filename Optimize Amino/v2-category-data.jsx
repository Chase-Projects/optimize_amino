// v2-category-data.jsx — Configuration for each category page.
// Consumed by CategoryPage; one entry per slug.

const CATEGORY_CONFIGS = {
  grains: {
    slug: 'grains', title: 'Grains', emoji: '🍚',
    tagline: 'Starchy, cheap, lysine-poor — the canvas the rest of the meal paints on.',
    highlight: 'Lys',
    foodIds: ['rice', 'brice', 'oats', 'quinoa', 'pasta', 'farro'],
    intro: (
      <>
        <p>Grains are the calorie floor of nearly every cuisine — rice in
        Asia, wheat in the Mediterranean, corn in the Americas, oats in
        northern Europe. They&rsquo;re cheap, filling, and full of
        carbohydrate. What they aren&rsquo;t is <em>balanced</em>.</p>
        <p>Every common cereal grain is <strong>lysine-limited</strong>:
        per gram of protein, it runs out of lysine before any other
        essential amino acid. That&rsquo;s why a diet of grains alone
        causes protein malnutrition even when total calories are plenty
        &mdash; and why every enduring food tradition pairs grains with a
        legume. Rice &amp; beans, dal &amp; chapati, tortilla &amp; frijoles,
        hummus &amp; pita &mdash; these aren&rsquo;t coincidence. They&rsquo;re
        the LP, solved empirically over millennia.</p>
        <p>The only grain that isn&rsquo;t lysine-limited is{' '}
        <strong>quinoa</strong>, a pseudo-cereal with a legume-like amino
        profile. Oats are the second-best. Everything else needs a
        partner.</p>
      </>
    ),
    notes: [
      { h: 'Dry vs cooked: a 3× density shift',
        b: '100 g of dry rice becomes ~300 g cooked, and its protein/AA density drops accordingly. When you\'re meal-prepping from dry, toggle the solver to dry mode so the gram amounts match what you actually weigh out.' },
      { h: 'Lysine, the 45-mg/g constraint',
        b: 'The FAO standard scoring pattern asks for 45 mg lysine per gram of protein. Wheat delivers ~18, rice ~38, quinoa ~58. Every grain-dominant meal hinges on this row of the LP.' },
      { h: 'Why grains still dominate cheap LPs',
        b: 'Even with the lysine hole, grains are so cheap per gram of carb and protein that most cost-minimizing solutions still put hundreds of grams of a grain at the base. The solver just adds a smaller legume or soy serving to patch the lysine.' },
      { h: 'Whole grain vs refined',
        b: 'Brown rice, whole-wheat pasta, and steel-cut oats carry slightly more lysine and thiamine than their refined counterparts — the trade-off is a longer cook and a little more cost. Not enough to break the LP, but visible in the receipt.' },
    ],
  },

  legumes: {
    slug: 'legumes', title: 'Legumes', emoji: '🫘',
    tagline: 'Lysine-rich, methionine-poor — the mirror image of grains.',
    highlight: 'Met',
    foodIds: ['beans', 'lentils', 'chickpea', 'kidney', 'pinto', 'peas'],
    intro: (
      <>
        <p>Legumes &mdash; beans, lentils, chickpeas, peas &mdash; sit on the
        opposite corner of the amino space from grains. They&rsquo;re
        dense in lysine but short on the <strong>sulfur amino acids</strong>
        (methionine + cysteine). Either alone leaves a hole; together
        they fill each other&rsquo;s.</p>
        <p>Legumes are also the most protein-dense carbohydrate you can
        buy. Dry lentils clock 25 g protein per 100 g &mdash; competitive with
        meat by weight and an order of magnitude cheaper. They&rsquo;re
        the pantry item that makes plant-based LPs feasible at all.</p>
        <p>One complication: legume protein comes with arginine, which
        some cardiologists argue should be balanced against lysine. The
        &ldquo;Lys:Arg ≥ 1.2&rdquo; toggle in the solver enforces this
        ratio if you want it.</p>
      </>
    ),
    notes: [
      { h: 'Methionine, the legume bottleneck',
        b: 'Black beans supply ~1.5 g methionine per 100 g of protein; eggs supply ~5.7 g. That\'s the full distance between "plant-first diet" and "animal-protein diet" as far as the Met row goes — the solver closes it with oats, Brazil nuts, or a thimble of L-methionine.' },
      { h: 'Soaking, digestibility, and PDCAAS',
        b: 'Raw legumes carry phytates and trypsin inhibitors that reduce AA bioavailability. Soaking + thorough cooking gets PDCAAS close to 0.7–0.9. The solver assumes cooked values throughout.' },
      { h: 'Lentils vs beans',
        b: 'Lentils cook faster (20 min, no soak) and have slightly more lysine per gram of protein. Beans hold a texture advantage and are cheaper per kg in bulk. Both appear in most optimal vegan LPs.' },
      { h: 'Peas — the sleeper',
        b: 'Green peas, yellow split peas, and pea-protein isolates are the fastest-rising legume on the label. Pea protein matches soy on lysine while dodging the estrogenic-phytoestrogen conversation. Expect it on every new plant-milk label.' },
    ],
  },

  'protein-powder': {
    slug: 'powder', title: 'Protein powder', emoji: '💪',
    tagline: 'The LP shortcut — high-density protein that collapses constraints.',
    highlight: 'Leu',
    foodIds: ['pea_protein', 'soy_protein', 'rice_protein', 'hemp_protein'],
    intro: (
      <>
        <p>Powdered proteins are concentrated isolates of the most
        protein-dense fraction of a whole food &mdash; peas, soybeans, rice,
        or hemp after the starch and fat have been separated out.
        Per gram, they&rsquo;re the single most efficient way to satisfy an
        AA constraint.</p>
        <p>Soy and pea isolates come closest to a complete profile.
        Rice isolate is{' '}
        <strong>lysine-limited</strong> (same as whole rice). Hemp is
        moderately complete but lower density (~50% protein by mass).
        For a plant-based PDCAAS of 1.0, blend pea + rice or soy alone.</p>
        <p>Powders are expensive per kg but cheap per gram of protein.
        The solver will reach for them first when the AA targets are
        aggressive (e.g. the athletic / muscle patterns).</p>
      </>
    ),
    notes: [
      { h: 'Why blends exist',
        b: 'Pea protein is rich in lysine but low in methionine; rice protein is the inverse. A 70/30 pea-rice blend matches whey on every AA and out-performs it on cost per complete-protein gram.' },
      { h: 'Leucine and the muscle-protein-synthesis trigger',
        b: '~3 g leucine in one meal maximally stimulates muscle-protein synthesis. Soy and pea isolates hit that threshold at 25–30 g powder. The "Muscle" pattern in the solver raises the Leu floor to reflect this.' },
      { h: 'What powders don\'t give you',
        b: 'Fiber, phytonutrients, and the satiety of a whole-food meal. Treat them as the supplement they are — plug a gap, don\'t build the meal around them.' },
      { h: 'The supplement-multiplier connection',
        b: 'Whole protein powders sit next to the individual AA supplements in the solver. Drop the multiplier toward 1× and the LP will happily substitute powder for whole foods — useful for bodybuilding protocols, less so for daily eating.' },
    ],
  },

  milk: {
    slug: 'milk', title: 'Plant milks', emoji: '🥛',
    tagline: 'Calorically light, sometimes nutritionally empty — read the label.',
    highlight: 'Lys',
    foodIds: ['soy_milk', 'oat_milk', 'almond_milk', 'pea_milk'],
    intro: (
      <>
        <p>Plant milks are the highest-volume plant-based item at the
        grocery store and the most variable in nutritional density. Soy
        and pea milks are the only ones with protein comparable to dairy
        (~3 g / cup). Oat milk is mostly starch + a little fat;
        almond milk is mostly water.</p>
        <p>For an AA-balanced diet, <strong>soy milk</strong> is the
        default. Pea milk is a close second and avoids soy isoflavones
        if that matters to you. Oat and almond milks contribute to
        calories and calcium fortification but not meaningfully to
        protein targets &mdash; the solver usually caps them at a fixed
        serving rather than scaling them.</p>
      </>
    ),
    notes: [
      { h: 'Fortification matters more than source',
        b: 'A fortified oat milk provides more calcium, B12, and vitamin D per cup than an unfortified organic soy milk. Always check the label for the nutrients you can\'t get from other plants.' },
      { h: 'Sweetened vs unsweetened',
        b: 'Sweetened versions add 8–10 g sugar per cup. The LP doesn\'t care, but your dentist does. Default to unsweetened and sweeten at home.' },
      { h: 'Barista blends and saturated fat',
        b: '"Barista" formulations stabilize foam with added oil — typically coconut or sunflower. That\'s fine as a fat source but pushes up saturated fat when used heavily.' },
      { h: 'When the solver picks almond milk',
        b: 'Almost never, outside of a fixed smoothie serving. Almond milk carries too little protein for its cost to be an efficient LP variable. If the solver recommends it, something is off in your constraints.' },
    ],
  },

  seitan: {
    slug: 'seitan', title: 'Seitan', emoji: '🟫',
    tagline: 'Wheat gluten — maximum protein density, minimum lysine.',
    highlight: 'Lys',
    foodIds: ['seitan', 'pasta', 'farro', 'oats'],
    intro: (
      <>
        <p>Seitan is vital wheat gluten, water, and whatever seasoning
        you add &mdash; washed or kneaded to isolate the protein from
        starch. At ~25 g protein per 100 g cooked, it&rsquo;s the most
        protein-dense plant food short of an isolate powder.</p>
        <p>The catch: seitan is wheat, and wheat is{' '}
        <strong>lysine-limited</strong>. Worse, the washing process
        concentrates every amino acid <em>except</em> lysine, making
        seitan <em>more</em> lysine-limited per gram of protein than
        the grain it came from. A diet built around seitan will get
        stuck at the Lys row of the LP unless you pair it with a legume,
        soy product, or L-lysine supplement.</p>
        <p>Best-use: meat-analog center of a meal, paired with a legume
        or soy side. Don&rsquo;t treat it as a stand-alone protein source.</p>
      </>
    ),
    notes: [
      { h: 'The PDCAAS value',
        b: 'Vital wheat gluten scores ~0.25 on PDCAAS — the lowest of any common protein. Blend with legumes and the blended PDCAAS rises to 0.9+.' },
      { h: 'Gluten sensitivity',
        b: 'Obvious: not for anyone with celiac or non-celiac gluten sensitivity. Obvious but worth saying.' },
      { h: 'Texture advantage',
        b: 'The single plant food that most convincingly stands in for roasted or braised meat. Worth its constraints for that reason alone.' },
      { h: 'Commercial vs homemade',
        b: 'Store-bought seitan often has added beans or soy to fix the lysine hole — read the ingredients. Homemade from vital wheat gluten is cheaper but more lysine-limited. The solver uses the homemade number by default.' },
    ],
  },
};

Object.assign(window, { CATEGORY_CONFIGS });
