// v1-quiet-paper.jsx — "Quiet paper" variation
// Off-white paper, subtle brown graph grid, rounded sans, editorial voice.
// Restrained. Cells are just indented blocks on the page, with a thin
// brown rule and a tiny run-label. The grid is the hero.

const V1 = {
  paper:   '#f4ede0',        // warm off-white
  grid:    'rgba(120, 85, 45, 0.10)',
  gridMajor:'rgba(120, 85, 45, 0.18)',
  ink:     '#2b241b',        // warm near-black
  mute:    '#6b5b47',
  rule:    '#c9b894',        // brown hairline
  accent:  '#8a5a2b',        // burnt sienna
  accent2: '#6a7d4a',        // herb green
  red:     '#b4432e',
  cellBg:  'rgba(255, 251, 240, 0.55)',
  font:    '"Nunito", "Nunito Sans", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  mono:    '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
};

function V1Page() {
  const grains = evaluate(SCENARIOS.justGrains);
  return (
    <div style={{
      fontFamily: V1.font,
      color: V1.ink,
      background: V1.paper,
      backgroundImage: `
        linear-gradient(to right, ${V1.grid} 1px, transparent 1px),
        linear-gradient(to bottom, ${V1.grid} 1px, transparent 1px),
        linear-gradient(to right, ${V1.gridMajor} 1px, transparent 1px),
        linear-gradient(to bottom, ${V1.gridMajor} 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px, 24px 24px, 120px 120px, 120px 120px',
      width: 820,
      minHeight: 1200,
      padding: '64px 72px 80px',
      lineHeight: 1.55,
    }}>
      {/* masthead */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', marginBottom: 48,
        borderBottom: `1px solid ${V1.rule}`, paddingBottom: 14 }}>
        <div style={{ fontSize: 13, letterSpacing: 2, textTransform: 'uppercase',
          fontWeight: 700, color: V1.accent }}>Optimize Amino</div>
        <div style={{ fontSize: 12, color: V1.mute, fontVariantNumeric: 'tabular-nums' }}>
          Essay № 01 · Vegan protein, by the numbers
        </div>
      </div>

      {/* title */}
      <h1 style={{
        fontSize: 52, fontWeight: 800, letterSpacing: -1.2,
        margin: '0 0 16px', lineHeight: 1.05, textWrap: 'balance',
      }}>
        Why beans and rice is a <em style={{ color: V1.accent, fontStyle: 'italic', fontWeight: 800 }}>good guess</em>,
        <br/>not a great answer.
      </h1>
      <div style={{ fontSize: 18, color: V1.mute, marginBottom: 10, maxWidth: 620 }}>
        A short essay, with a solver attached, about meeting all nine essential amino
        acids on a plant-based diet — at the lowest possible grocery bill.
      </div>
      <div style={{ fontSize: 13, color: V1.mute, marginBottom: 48,
        fontVariantNumeric: 'tabular-nums' }}>
        12 min read · runnable cells · updated Apr 2026
      </div>

      {/* Section 1 — Protein & amino acids */}
      <V1Section num="01" title="Protein is nine problems, not one.">
        <p>
          When nutrition labels say <em>protein: 52&nbsp;g</em>, they hide something
          important. Your body cannot use <em>protein</em> as a substance — it tears
          whatever you ate back down into <strong>amino acids</strong> and reassembles
          them into the proteins it actually needs. Of the twenty amino acids involved,
          nine are <em>essential</em>: you must eat them, because your body cannot
          synthesise them from anything else.
        </p>
        <p>
          So &ldquo;getting enough protein&rdquo; is really nine separate constraints,
          not one. A food is only as useful as its scarcest essential amino acid — the
          classical insight behind <em>Liebig&rsquo;s law of the minimum</em>, borrowed
          from agronomy.
        </p>

        <V1Cell label="the nine essentials · FAO/WHO/UNU 2007 pattern">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 36px' }}>
            {EAA.map(a => (
              <div key={a.key} style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'baseline', gap: 12,
                fontSize: 14, borderBottom: `1px dotted ${V1.rule}`, padding: '4px 0' }}>
                <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <strong style={{ fontFamily: V1.mono, color: V1.accent }}>{a.key}</strong>
                  &nbsp;<span style={{ color: V1.mute }}>{a.full}</span></span>
                <span style={{ fontFamily: V1.mono, color: V1.ink, whiteSpace: 'nowrap',
                  fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{a.req}&nbsp;<span
                  style={{ color: V1.mute }}>mg/g</span></span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: V1.mute, marginTop: 12,
            fontStyle: 'italic' }}>
            Per gram of protein consumed. For a 65 kg adult (~52 g protein/day),
            multiply each by 52 to get daily targets in mg.
          </div>
        </V1Cell>
      </V1Section>

      {/* Section 2 — the scenarios framing */}
      <V1Section num="02" title="A tour of four dinners.">
        <p>
          Let&rsquo;s walk through four day-long meal plans and ask the same question
          of each: <em>does this cover all nine?</em> We&rsquo;ll start with the two
          corner cases — grains alone, then legumes alone — to see the hole each one
          leaves. Then the famous pairing. Then the optimum.
        </p>
      </V1Section>

      {/* Scenario 1 — just grains */}
      <V1Section num="03" title="Scenario one — just grains.">
        <p>
          Six hundred grams of carbohydrate, mostly rice, with a little oatmeal for
          breakfast. Cheap, filling, and — historically — the thing that caused
          <em> kwashiorkor</em> in populations that relied on it almost exclusively.
        </p>

        <V1Cell label="meal">
          <div style={{ display: 'flex', gap: 20, fontSize: 15, flexWrap: 'wrap' }}>
            <span style={{ whiteSpace: 'nowrap' }}>🍚 White rice <span style={{ color: V1.mute }}>·&nbsp;500&nbsp;g</span></span>
            <span style={{ whiteSpace: 'nowrap' }}>🌾 Oats <span style={{ color: V1.mute }}>·&nbsp;100&nbsp;g</span></span>
            <span style={{ marginLeft: 'auto', color: V1.accent,
              fontFamily: V1.mono, fontVariantNumeric: 'tabular-nums' }}>
              ${grains.cost.toFixed(2)} · {grains.protein.toFixed(1)} g protein
            </span>
          </div>
        </V1Cell>

        <V1Cell label="amino coverage vs. daily target">
          <V1Bars coverage={grains.coverage} limiting={grains.limiting} />
          <div style={{ fontSize: 13, color: V1.mute, marginTop: 14 }}>
            Lysine covers only {Math.round(grains.coverage.Lys * 100)}% of the target.
            Every other amino acid is &ldquo;wasted&rdquo; — the body can only build
            proteins up to the limiting input, so the excess is oxidised for energy.
          </div>
        </V1Cell>

        <p>
          Grains are <strong>lysine-limited</strong>. You can eat a kilo of rice and
          still fall short. The feasible region of the LP — the set of meals that
          satisfy every constraint — does not contain any point on the &ldquo;rice
          axis&rdquo; alone.
        </p>
      </V1Section>

      {/* Section 4 — the LP formulation */}
      <V1Section num="04" title="The problem, written as a program.">
        <p>
          With the constraints made explicit, the full problem writes itself. Let
          <span style={{ fontFamily: V1.mono }}> x<sub>i</sub> </span>
          be grams of food <em>i</em>. The solver&rsquo;s job is to choose
          <span style={{ fontFamily: V1.mono }}> x </span> that minimises grocery
          cost while covering every amino acid and staying non-negative.
        </p>

        <V1Math />

        <p>
          That&rsquo;s it. Nine inequalities, one objective, as many variables as
          your pantry has shelves. The simplex method handles this in milliseconds;
          the interesting work is choosing what goes on the shelves.
        </p>
      </V1Section>

      {/* footer pointer to tool */}
      <div style={{ marginTop: 64, padding: '28px 32px',
        border: `1px solid ${V1.rule}`,
        background: V1.cellBg,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, letterSpacing: 1.5,
            textTransform: 'uppercase', color: V1.mute, fontWeight: 600,
            marginBottom: 6 }}>Next</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>
            Pick your pantry &mdash; run the solver on your own shelves.
          </div>
        </div>
        <div style={{ fontSize: 28, color: V1.accent }}>&rarr;</div>
      </div>
    </div>
  );
}

function V1Section({ num, title, children }) {
  return (
    <section style={{ marginBottom: 56 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16,
        marginBottom: 18 }}>
        <span style={{ fontFamily: V1.mono, fontSize: 13, color: V1.accent,
          fontWeight: 600, letterSpacing: 1 }}>§ {num}</span>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5,
          margin: 0, textWrap: 'balance' }}>{title}</h2>
      </div>
      <div style={{ fontSize: 16, maxWidth: 640 }}>{children}</div>
    </section>
  );
}

function V1Cell({ label, children }) {
  return (
    <div style={{ margin: '20px 0', position: 'relative',
      paddingLeft: 20, borderLeft: `2px solid ${V1.accent}` }}>
      <div style={{ fontSize: 11, letterSpacing: 1.2,
        textTransform: 'uppercase', color: V1.accent, fontWeight: 700,
        marginBottom: 10 }}>{label}</div>
      <div style={{ background: V1.cellBg, padding: '16px 20px',
        border: `1px solid ${V1.rule}` }}>
        {children}
      </div>
    </div>
  );
}

function V1Bars({ coverage, limiting }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {EAA.map(a => {
        const pct = coverage[a.key];
        const isLim = a.key === limiting.key;
        const w = Math.min(pct, 2.2);
        const over = pct >= 1;
        return (
          <div key={a.key} style={{ display: 'flex', alignItems: 'center',
            gap: 12, fontSize: 13 }}>
            <span style={{ width: 36, fontFamily: V1.mono, color: V1.ink,
              fontWeight: isLim ? 700 : 500 }}>{a.key}</span>
            <div style={{ flex: 1, height: 14, background: '#eae0c8',
              position: 'relative', border: `1px solid ${V1.rule}` }}>
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0,
                width: `${(w / 2.2) * 100}%`,
                background: isLim ? V1.red : (over ? V1.accent2 : V1.accent),
                transition: 'width .4s ease',
              }}/>
              {/* target line at 1.0 */}
              <div style={{ position: 'absolute', top: -2, bottom: -2,
                left: `${(1/2.2)*100}%`, width: 1,
                background: V1.ink, opacity: 0.5 }}/>
            </div>
            <span style={{ width: 58, textAlign: 'right',
              fontFamily: V1.mono, fontVariantNumeric: 'tabular-nums',
              color: isLim ? V1.red : V1.ink,
              fontWeight: isLim ? 700 : 500 }}>
              {Math.round(pct * 100)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function V1Math() {
  return (
    <V1Cell label="the linear program">
      <div style={{ fontFamily: V1.mono, fontSize: 14, lineHeight: 2 }}>
        <div>
          <span style={{ color: V1.accent, fontWeight: 700 }}>minimize</span>
          &nbsp;&nbsp;Σ<sub>i</sub> c<sub>i</sub> · x<sub>i</sub>
          &nbsp;&nbsp;<span style={{ color: V1.mute }}>
            // total grocery cost</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <span style={{ color: V1.accent, fontWeight: 700 }}>subject to</span>
        </div>
        <div style={{ paddingLeft: 100 }}>
          Σ<sub>i</sub> a<sub>ij</sub> · x<sub>i</sub> &nbsp;≥&nbsp; b<sub>j</sub>
          &nbsp;&nbsp;∀ j ∈ {'{'}His, Ile, Leu, Lys, Met, Phe, Thr, Trp, Val{'}'}
        </div>
        <div style={{ paddingLeft: 100 }}>
          x<sub>i</sub> &nbsp;≥&nbsp; 0 &nbsp;&nbsp;∀ i ∈ pantry
        </div>
        <div style={{ paddingLeft: 100, color: V1.mute }}>
          x<sub>i</sub> &nbsp;≤&nbsp; u<sub>i</sub>
          &nbsp;&nbsp;<span>// optional: palatability caps</span>
        </div>
      </div>
    </V1Cell>
  );
}

Object.assign(window, { V1Page });
