// v2-page.jsx — Full intro page in V2 "pantry stickers" style.
// Composes: hero → essay + scenarios → 2D LP graph → mini tool → examples.

function V2Intro() {
  const grains = evaluate(SCENARIOS.justGrains, 'fao');
  const beans  = evaluate(SCENARIOS.justBeans,  'fao');
  const combo  = evaluate(SCENARIOS.beansRice,  'fao');
  const opt    = evaluate(SCENARIOS.optimized,  'fao');
  const [exampleSeed, setExampleSeed] = React.useState(null);

  return (
    <React.Fragment>
    <GridBg width={900} style={{ margin: '0 auto', minHeight: 2400,
      padding: '52px 70px 80px',
      lineHeight: 1.55, position: 'relative' }}>
      {/* masthead */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: V2.tomato,
            borderRadius: '50%', display: 'grid', placeItems: 'center',
            color: '#fff', fontSize: 15, fontWeight: 800 }}>A</div>
          <div style={{ fontSize: 14, letterSpacing: 1.5,
            textTransform: 'uppercase', fontWeight: 800 }}>
            Optimize Amino
          </div>
        </div>
        <div style={{ fontSize: 12, color: V2.mute,
          fontFamily: V2.mono, fontVariantNumeric: 'tabular-nums' }}>
          Essay № 01 · the pantry notebook
        </div>
      </div>

      {/* HERO */}
      <div style={{ position: 'relative', marginBottom: 64 }}>
        <h1 style={{ fontSize: 60, fontWeight: 800, letterSpacing: -1.6,
          margin: '0 0 18px', lineHeight: 1.02, textWrap: 'balance' }}>
          Nine acids,<br/>
          <span style={{ color: V2.tomato }}>one grocery list.</span>
        </h1>
        <div style={{ fontSize: 18, color: V2.ink, maxWidth: 560,
          marginBottom: 12 }}>
          Picking vegan meals that cover every essential amino acid, at the
          lowest price — solved as a linear program, told as a story, with
          a solver you can run on your own pantry.
        </div>
        <div style={{ fontSize: 12, color: V2.mute,
          fontVariantNumeric: 'tabular-nums' }}>
          15 min read · runnable cells · receipts print at the end
        </div>

        {/* decorative stickers */}
        <div style={{ position: 'absolute', top: -4, right: 8 }}>
          <StickerTag emoji="🍚" label="rice" tint={V2.stickerB} rotate={5}/>
        </div>
        <div style={{ position: 'absolute', top: 70, right: 100 }}>
          <StickerTag emoji="🫘" label="beans" tint={V2.stickerC} rotate={-7}/>
        </div>
        <div style={{ position: 'absolute', top: 135, right: 14 }}>
          <StickerTag emoji="🥜" label="peanut" tint={V2.stickerE} rotate={3}/>
        </div>
      </div>

      {/* §1 */}
      <section style={{ marginBottom: 52 }}>
        <SectionHead num="01" title="Protein is nine problems, not one.">
          <p>Your nutrition label treats <em>protein</em> as a lump. Your body
          does not. It tears whatever you ate back down into twenty amino
          acids, nine of which it cannot make itself. A meal is only as useful
          as its <strong>scarcest essential amino acid</strong> — Liebig&rsquo;s
          law of the minimum, borrowed from agronomy.</p>
          <p>So &ldquo;did I get enough protein?&rdquo; is really nine questions
          stacked on top of each other. That&rsquo;s why beans-and-rice works —
          and why it only <em>almost</em> works.</p>
        </SectionHead>

        <Sticker tint={V2.stickerA} rotate={-0.4} tape="top"
          label="the nine essentials · mg per g of protein">
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px 28px' }}>
            {EAA.map(a => (
              <div key={a.key} style={{ display: 'flex',
                justifyContent: 'space-between', gap: 10,
                fontSize: 13, padding: '4px 0',
                borderBottom: `1px dotted ${V2.rule}` }}>
                <span style={{ whiteSpace: 'nowrap' }}>
                  <strong style={{ fontFamily: V2.mono, color: V2.tomato }}>
                    {a.key}</strong>
                  &nbsp;<span style={{ color: V2.mute }}>{a.full}</span>
                </span>
                <span style={{ fontFamily: V2.mono, whiteSpace: 'nowrap',
                  fontVariantNumeric: 'tabular-nums' }}>
                  {PATTERNS.fao.v[a.key]}
                </span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: V2.mute, marginTop: 12,
            fontStyle: 'italic' }}>
            FAO/WHO/UNU 2007 adult maintenance pattern. Multiply each by 52 g
            protein to get daily targets in mg.
          </div>
        </Sticker>
      </section>

      {/* §2 scenarios */}
      <section style={{ marginBottom: 52 }}>
        <SectionHead num="02" title="A tour of four dinners.">
          <p>Four day-long meal plans, one question asked of each: <em>does
          this cover all nine?</em> We start at the corners — grains alone,
          legumes alone — to see the hole each leaves. Then the famous pair.
          Then the optimum.</p>
        </SectionHead>

        {/* 2a — grains */}
        <ScenarioRow
          num="02a" title="Just grains." meal={SCENARIOS.justGrains}
          tint={V2.stickerB} tape="left"
          result={grains}
          note="Lysine is the bottleneck. The feasible region contains no point on the grain-only axis."
          takeaway={`Grains alone: lysine covers only ${Math.round(grains.coverage.Lys*100)}% of target.`}
        />

        {/* 2b — legumes */}
        <ScenarioRow
          num="02b" title="Just legumes." meal={SCENARIOS.justBeans}
          tint={V2.stickerC} tape="right"
          result={beans}
          note="Now methionine is scarce. The mirror image of the grains problem."
          takeaway={`Legumes alone: methionine+cys covers ${Math.round(beans.coverage.Met*100)}% of target.`}
        />

        {/* 2c — beans & rice */}
        <ScenarioRow
          num="02c" title="Beans & rice." meal={SCENARIOS.beansRice}
          tint={V2.stickerE} tape="top"
          result={combo}
          note="The lysine excess from legumes now compensates for the grain's shortfall — and vice versa. This is the heuristic that has fed half the world."
          takeaway={`Combined: limiting AA is ${combo.limiting.key} at ${Math.round(combo.coverage[combo.limiting.key]*100)}%.`}
        />

        {/* 2d — optimum */}
        <ScenarioRow
          num="02d" title="Optimum (a small pantry)." meal={SCENARIOS.optimized}
          tint={V2.stickerF} tape="left"
          result={opt}
          note="The solver picks a grain, a legume, a soy item, oats for methionine, a dab of peanut butter for calories — and beats beans-and-rice on both coverage and cost. This is the LP in action."
          takeaway={`Optimum: limiting AA is ${opt.limiting.key} at ${Math.round(opt.coverage[opt.limiting.key]*100)}%, total $${opt.cost.toFixed(2)}.`}
        />
      </section>

      {/* §3 — 2D LP graph */}
      <section style={{ marginBottom: 56 }}>
        <SectionHead num="03" title="A two-variable sketch.">
          <p>Dial the pantry down to two foods — just grain and legume, two
          amino acid floors (lysine, methionine+cys) and a budget ceiling —
          and the whole LP fits on a page. Every axis is a food. Every line
          is a constraint. The shaded wedge is the <em>feasible region</em>:
          meals that satisfy everything at once. The dotted point is the
          cheapest one.</p>
        </SectionHead>

        <Sticker tint={V2.stickerA} rotate={0.3} tape="top" tapeColor="blue"
          label="the 2-variable LP · feasible region">
          <div style={{ position: 'relative' }}>
            <LPGraph2D width={700} height={500}/>
            <HandNote style={{ position: 'absolute', top: 6, right: -32,
              width: 150 }} rotate={5} color={V2.tomato}>
              ← every meal<br/>is a point
            </HandNote>
            <HandNote style={{ position: 'absolute', bottom: 40, right: -30,
              width: 140 }} rotate={-4} color={V2.ink}>
              optimum:<br/>on the budget line
            </HandNote>
          </div>
          <div style={{ fontSize: 12, color: V2.mute, marginTop: 10,
            fontStyle: 'italic', maxWidth: 620 }}>
            Add a third food and this becomes a polyhedron in 3D. Add a fourth,
            and we can no longer draw it — but the solver still finds the
            vertex with minimum cost in milliseconds.
          </div>
        </Sticker>
      </section>

      {/* §4 — the LP written out */}
      <section style={{ marginBottom: 56 }}>
        <SectionHead num="04" title="The program, in full.">
          <p>Let <span style={{ fontFamily: V2.mono }}>x<sub>i</sub></span> be
          grams of food <em>i</em>. The solver picks{' '}
          <span style={{ fontFamily: V2.mono }}>x</span> to minimise grocery
          cost while covering every amino acid.</p>
        </SectionHead>

        <Sticker tint={V2.stickerD} rotate={-0.4} tape="top"
          label="the linear program">
          <div style={{ fontFamily: V2.mono, fontSize: 14, lineHeight: 1.95 }}>
            <div>
              <span style={{ color: V2.tomato, fontWeight: 700 }}>minimize</span>
              &nbsp;&nbsp;Σ<sub>i</sub> c<sub>i</sub> · x<sub>i</sub>
              &nbsp;&nbsp;<span style={{ color: V2.mute }}>// grocery cost</span>
            </div>
            <div style={{ marginTop: 8 }}>
              <span style={{ color: V2.tomato, fontWeight: 700 }}>subject to</span>
            </div>
            <div style={{ paddingLeft: 90 }}>
              Σ<sub>i</sub> a<sub>ij</sub> x<sub>i</sub> ≥ b<sub>j</sub>
              &nbsp;&nbsp;∀ j ∈ {'{'}His, Ile, Leu, Lys, Met, Phe, Thr, Trp, Val{'}'}
            </div>
            <div style={{ paddingLeft: 90 }}>
              x<sub>i</sub> ≥ 0 &nbsp;&nbsp;∀ i ∈ pantry
            </div>
            <div style={{ paddingLeft: 90, color: V2.mute }}>
              + optional ratio &amp; bound constraints (Lys:Arg, LNAA, BCAA…)
            </div>
          </div>
        </Sticker>
      </section>

      {/* §5 — mini tool */}
      <section style={{ marginBottom: 56 }}>
        <SectionHead num="05" title="Run the solver.">
          <p>Pick a reference pattern. Tick the pantry items you have on hand.
          Add any fixed foods (today&rsquo;s fruit, condiments, a smoothie).
          Press <strong>run</strong> — a receipt prints with the optimum.</p>
        </SectionHead>
        <MiniTool initial={exampleSeed}/>
      </section>

      {/* §6 — examples */}
      <section style={{ marginBottom: 56 }}>
        <SectionHead num="06" title="Things people have done with it.">
          <p>Six worked examples. Click one to load its pantry and constraints
          into the tool above, then press run to see what the solver does.</p>
        </SectionHead>

        <div style={{ display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {EXAMPLES.map((ex, i) => (
            <button key={ex.id}
              onClick={() => {
                setExampleSeed({ ...ex });
                // scroll mini tool into view
                const el = document.querySelector('[data-mini-anchor]');
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 40, behavior: 'smooth' });
              }}
              style={{ textAlign: 'left', cursor: 'pointer',
                background: [V2.stickerA, V2.stickerB, V2.stickerC,
                  V2.stickerD, V2.stickerE, V2.stickerF][i % 6],
                padding: '18px 18px 16px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 1px 1px rgba(0,0,0,0.04), 0 6px 14px rgba(60,40,20,0.08)',
                transform: `rotate(${[-0.6, 0.4, -0.3, 0.6, -0.5, 0.3][i]}deg)`,
                fontFamily: V2.font, color: V2.ink, position: 'relative' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{ex.emoji}</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{ex.name}</div>
              <div style={{ fontSize: 11, color: V2.mute, marginTop: 4,
                fontFamily: V2.mono }}>
                {PATTERNS[ex.pattern].label}
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 4,
                flexWrap: 'wrap' }}>
                {ex.pantry.slice(0, 4).map(pid => {
                  const f = FOODS.find(x => x.id === pid);
                  return f ? (
                    <span key={pid} style={{ fontSize: 14,
                      padding: '2px 6px', background: '#fff',
                      border: `1px solid ${V2.rule}`, borderRadius: 999 }}>
                      {f.emoji}
                    </span>
                  ) : null;
                })}
              </div>
              <div style={{ position: 'absolute', bottom: 10, right: 12,
                fontFamily: V2.hand, fontSize: 16, color: V2.tomato }}>
                load →
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* footer / link to tool page */}
      <div style={{ position: 'relative', marginTop: 56,
        padding: '30px 34px', background: '#fffaea',
        border: `1.5px dashed ${V2.mustard}`, borderRadius: 2,
        transform: 'rotate(-0.2deg)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: 1.5,
            textTransform: 'uppercase', color: V2.mustard,
            fontWeight: 700, marginBottom: 6 }}>Tool page</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: V2.ink }}>
            Skip the essay. Just solve.
          </div>
        </div>
        <div style={{ fontSize: 28, color: V2.tomato }}>→</div>
      </div>

      {/* anchor for the examples to scroll to */}
      <div data-mini-anchor style={{ position: 'absolute',
        top: 2000, left: 0, width: 1, height: 1 }}/>
    </GridBg>
    <SiteFooter current="essay"/>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// One scenario row: meal chips + amino bars + takeaway note
// ─────────────────────────────────────────────────────────────
function ScenarioRow({ num, title, meal, tint, tape, result, note, takeaway }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10,
        marginBottom: 10 }}>
        <span style={{ fontFamily: V2.mono, fontSize: 12, color: V2.tomato,
          fontWeight: 700, letterSpacing: 1 }}>§ {num}</span>
        <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{title}</h3>
        <span style={{ marginLeft: 'auto', fontFamily: V2.mono, fontSize: 12,
          color: V2.mute, fontVariantNumeric: 'tabular-nums' }}>
          ${result.cost.toFixed(2)} · {result.protein.toFixed(1)} g protein
        </span>
      </div>

      <Sticker tint={tint} rotate={(num.charCodeAt(num.length-1) % 2 === 0) ? -0.4 : 0.4}
        tape={tape}>
        <div style={{ display: 'grid',
          gridTemplateColumns: '1fr 1.2fr', gap: 22 }}>
          {/* left: meal chips + takeaway */}
          <div>
            <div style={{ fontSize: 10, letterSpacing: 1.2,
              textTransform: 'uppercase', color: V2.mute, fontWeight: 700,
              marginBottom: 8 }}>today's plate</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6,
              marginBottom: 14 }}>
              {Object.entries(meal).map(([id, g]) => {
                const f = FOODS.find(x => x.id === id);
                return f ? <FoodChip key={id} food={f} grams={g}
                  selected={true} /> : null;
              })}
            </div>
            <div style={{ fontSize: 13, color: V2.ink, marginBottom: 8 }}>
              {note}
            </div>
            <HandNote rotate={-1} color={V2.tomato} style={{ fontSize: 16,
              marginTop: 8 }}>
              {takeaway}
            </HandNote>
          </div>
          {/* right: amino bars */}
          <div>
            <div style={{ fontSize: 10, letterSpacing: 1.2,
              textTransform: 'uppercase', color: V2.mute, fontWeight: 700,
              marginBottom: 8 }}>amino coverage vs. target</div>
            <AminoBars coverage={result.coverage} limiting={result.limiting}
              targets={result.targets} totals={result.aminoTotals}/>
          </div>
        </div>
      </Sticker>
    </div>
  );
}

Object.assign(window, { V2Intro, ScenarioRow });
