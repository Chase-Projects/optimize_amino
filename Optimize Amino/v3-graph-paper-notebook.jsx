// v3-graph-paper-notebook.jsx — "Graph paper notebook" variation
// Leans into the LP/math heritage. Bolder grid, monospace for
// code/math, sans for prose. Engineering-notebook feel.

const V3 = {
  paper:   '#f5efdd',              // cream
  grid:    'rgba(90, 60, 30, 0.10)',
  gridMajor: 'rgba(90, 60, 30, 0.22)',
  ink:     '#1e1a12',
  mute:    '#6b5b47',
  rule:    '#b8a478',
  accent:  '#b94a2c',               // bold red
  cyan:    '#276b7a',
  sage:    '#5f7a42',
  cellBg:  '#fcf7e6',
  cellBg2: '#eee5ca',
  stampYellow: '#f4d76a',
  font:    '"Nunito", "Nunito Sans", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  mono:    '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
};

function V3Page() {
  const grains = evaluate(SCENARIOS.justGrains);
  return (
    <div style={{
      fontFamily: V3.font,
      color: V3.ink,
      background: V3.paper,
      backgroundImage: `
        linear-gradient(to right, ${V3.grid} 1px, transparent 1px),
        linear-gradient(to bottom, ${V3.grid} 1px, transparent 1px),
        linear-gradient(to right, ${V3.gridMajor} 1.5px, transparent 1.5px),
        linear-gradient(to bottom, ${V3.gridMajor} 1.5px, transparent 1.5px)
      `,
      backgroundSize: '20px 20px, 20px 20px, 100px 100px, 100px 100px',
      width: 820, minHeight: 1200,
      padding: '60px 60px 80px', lineHeight: 1.55, position: 'relative',
    }}>
      {/* ruled header (like a lab notebook) */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', marginBottom: 8,
        borderBottom: `2px solid ${V3.ink}`, paddingBottom: 6,
        fontFamily: V3.mono, fontSize: 12 }}>
        <span><strong>LAB NB</strong> · optimize-amino / essay_01.ipynb</span>
        <span style={{ color: V3.mute, fontVariantNumeric: 'tabular-nums' }}>
          rev 3 · 2026-04-17
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        marginBottom: 44, fontFamily: V3.mono, fontSize: 11,
        color: V3.mute, paddingTop: 4 }}>
        <span>author: c.dubé</span>
        <span>kernel: python 3.12 · scipy.optimize.linprog · HiGHS</span>
      </div>

      {/* title */}
      <h1 style={{
        fontSize: 50, fontWeight: 800, letterSpacing: -1.1,
        margin: '0 0 18px', lineHeight: 1.04, textWrap: 'balance',
      }}>
        Beans &amp; rice is a heuristic.<br/>
        <span style={{ color: V3.accent }}>Here is the program.</span>
      </h1>
      <div style={{ fontSize: 17, color: V3.mute, maxWidth: 600,
        marginBottom: 40 }}>
        A walk through complete-protein meal planning as a linear program.
        Nine constraints, a pantry of variables, a grocery bill to minimise.
      </div>

      {/* table of contents */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto',
        gap: '6px 18px', fontFamily: V3.mono, fontSize: 13,
        marginBottom: 56, padding: '18px 20px',
        background: V3.cellBg, border: `1px solid ${V3.rule}` }}>
        <span style={{ color: V3.mute }}>§1</span>
        <span>Nine essential amino acids</span>
        <span style={{ color: V3.mute, whiteSpace: 'nowrap' }}>cells 1–3</span>
        <span style={{ color: V3.mute }}>§2</span>
        <span>Scenario: grains alone</span>
        <span style={{ color: V3.mute, whiteSpace: 'nowrap' }}>cells 4–6</span>
        <span style={{ color: V3.mute }}>§3</span>
        <span>Scenario: legumes alone</span>
        <span style={{ color: V3.mute, whiteSpace: 'nowrap' }}>cells 7–9</span>
        <span style={{ color: V3.mute }}>§4</span>
        <span>The linear program in full</span>
        <span style={{ color: V3.mute, whiteSpace: 'nowrap' }}>cells 10–12</span>
        <span style={{ color: V3.mute }}>§5</span>
        <span>Bring your own pantry</span>
        <span style={{ color: V3.mute, whiteSpace: 'nowrap' }}>cells 13+</span>
      </div>

      {/* Section 1 */}
      <V3Section num="1" title="Nine essential amino acids.">
        <p>
          Your nutrition label treats protein as a lump. Your body doesn&rsquo;t.
          It tears what you eat down to twenty amino acids, nine of which it
          cannot synthesise. Every meal is nine questions, not one — and a meal
          is only as useful as its <em>scarcest</em> essential amino.
        </p>

        <V3CodeCell n={1} kind="py">
{`from scipy.optimize import linprog
import numpy as np

ESSENTIALS = ['His','Ile','Leu','Lys',
              'Met','Phe','Thr','Trp','Val']
# FAO/WHO/UNU 2007 scoring pattern, mg / g protein:
PATTERN = np.array([15, 30, 59, 45, 22, 38, 23, 6, 39])`}
        </V3CodeCell>

        <V3OutCell n={1}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '4px 20px', fontFamily: V3.mono, fontSize: 13 }}>
            {EAA.map(a => (
              <div key={a.key} style={{ display: 'flex',
                justifyContent: 'space-between',
                borderBottom: `1px dotted ${V3.rule}`, padding: '3px 0' }}>
                <span><span style={{ color: V3.accent, fontWeight: 700 }}>
                  {a.key}</span> <span style={{ color: V3.mute }}>
                  {a.full}</span></span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {a.req}
                </span>
              </div>
            ))}
          </div>
        </V3OutCell>
      </V3Section>

      {/* Section 2 */}
      <V3Section num="2" title="Scenario: grains alone.">
        <p>
          Let&rsquo;s start with a plate that dominates most of the world&rsquo;s
          calorie intake: 500 g rice, 100 g oats. It is cheap, filling, and — as
          it turns out — not enough.
        </p>

        <V3CodeCell n={4} kind="py">
{`meal = { 'rice': 500, 'oats': 100 }         # grams
totals = sum(grams * FOOD[f].amino
             for f, grams in meal.items())
coverage = totals / DAILY_TARGET
print(f"cost   = $${grains.cost.toFixed(2)}")
print(f"limit  = {limiting.key}  ({Math.round(grains.coverage[limiting.key] * 100)}% of target)")`
.replace('${grains.cost.toFixed(2)}', grains.cost.toFixed(2))
.replace('{limiting.key}', grains.limiting.key)
.replace('{Math.round(grains.coverage[limiting.key] * 100)}',
  Math.round(grains.coverage[grains.limiting.key] * 100))}
        </V3CodeCell>

        <V3OutCell n={4}>
          <div style={{ fontFamily: V3.mono, fontSize: 13, color: V3.mute,
            marginBottom: 14 }}>
            <span style={{ color: V3.ink }}>cost&nbsp;&nbsp;</span>
            = ${grains.cost.toFixed(2)}<br/>
            <span style={{ color: V3.ink }}>limit&nbsp;</span>
            = {grains.limiting.key}
            &nbsp;({Math.round(grains.coverage[grains.limiting.key] * 100)}% of target)
          </div>
          <V3Bars coverage={grains.coverage} limiting={grains.limiting} />
        </V3OutCell>

        <p>
          Grains are <strong>lysine-limited</strong>. The feasible region of the
          LP — the set of
          <span style={{ fontFamily: V3.mono }}> x </span>
          that satisfy every constraint — contains no pure-grain point.
          Eat a kilo of rice, you still fall short.
        </p>
      </V3Section>

      {/* Section 4 — the LP */}
      <V3Section num="4" title="The linear program, in full.">
        <p>
          With the nine constraints established, the full problem writes itself.
          Let
          <span style={{ fontFamily: V3.mono }}> x<sub>i</sub> </span>
          be grams of food <em>i</em>. Pick
          <span style={{ fontFamily: V3.mono }}> x </span>
          to minimise grocery cost subject to every amino acid being met and
          all servings being non-negative.
        </p>

        <V3MathCell n={10}>
          <div style={{ fontFamily: V3.mono, fontSize: 15, lineHeight: 2 }}>
            <div>
              <span style={{ color: V3.accent, fontWeight: 700 }}>min</span>
              <sub>x</sub> &nbsp;&nbsp;
              <span style={{ fontWeight: 700 }}>c</span><sup>⊤</sup>
              <span style={{ fontWeight: 700 }}>x</span>
            </div>
            <div style={{ marginTop: 4 }}>
              <span style={{ color: V3.accent, fontWeight: 700 }}>s.t.</span>
              &nbsp;&nbsp;
              <span style={{ fontWeight: 700 }}>A</span>
              <span style={{ fontWeight: 700 }}>x</span>
              &nbsp;≥&nbsp;
              <span style={{ fontWeight: 700 }}>b</span>
              &nbsp;&nbsp;<span style={{ color: V3.mute, fontSize: 13 }}>
                &nbsp;// 9 amino acid floors</span>
            </div>
            <div style={{ paddingLeft: 56 }}>
              <span style={{ fontWeight: 700 }}>x</span> &nbsp;≥&nbsp; 0
              &nbsp;&nbsp;<span style={{ color: V3.mute, fontSize: 13 }}>
                &nbsp;// non-negative servings</span>
            </div>
          </div>
          <div style={{ marginTop: 18, fontSize: 13, color: V3.mute,
            borderTop: `1px dashed ${V3.rule}`, paddingTop: 12 }}>
            <strong style={{ color: V3.ink }}>c</strong> ∈ ℝ<sup>n</sup> · unit costs &nbsp;&nbsp;
            <strong style={{ color: V3.ink }}>A</strong> ∈ ℝ<sup>9×n</sup> · amino density matrix &nbsp;&nbsp;
            <strong style={{ color: V3.ink }}>b</strong> ∈ ℝ<sup>9</sup> · daily targets
          </div>
        </V3MathCell>

        <p>
          Nine inequalities, one objective, as many variables as your pantry has
          shelves. HiGHS solves this in a few milliseconds; the real design work
          is choosing what belongs on the shelves.
        </p>
      </V3Section>

      {/* hand-off */}
      <div style={{ marginTop: 64, padding: '28px 30px',
        background: V3.ink, color: V3.paper,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: V3.mono, fontSize: 11,
            letterSpacing: 1.5, textTransform: 'uppercase',
            color: V3.stampYellow, fontWeight: 700, marginBottom: 6 }}>
            Cell 13 · next
          </div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>
            Bring your own pantry. Run the solver.
          </div>
        </div>
        <div style={{ fontFamily: V3.mono, fontSize: 28,
          color: V3.stampYellow }}>→</div>
      </div>
    </div>
  );
}

function V3Section({ num, title, children }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14,
        marginBottom: 18, paddingBottom: 8,
        borderBottom: `1px solid ${V3.rule}` }}>
        <span style={{ fontFamily: V3.mono, fontSize: 13,
          background: V3.accent, color: '#fff', padding: '2px 10px',
          fontWeight: 700 }}>§{num}</span>
        <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.4,
          margin: 0, textWrap: 'balance' }}>{title}</h2>
      </div>
      <div style={{ fontSize: 16, maxWidth: 640 }}>{children}</div>
    </section>
  );
}

function V3CodeCell({ n, kind = 'py', children }) {
  return (
    <div style={{ margin: '18px 0', display: 'flex', gap: 14,
      alignItems: 'flex-start' }}>
      <div style={{ fontFamily: V3.mono, fontSize: 11, color: V3.mute,
        width: 48, paddingTop: 14, textAlign: 'right',
        fontVariantNumeric: 'tabular-nums' }}>
        In&nbsp;[{n}]:
      </div>
      <pre style={{ flex: 1, margin: 0, padding: '14px 18px',
        background: V3.cellBg, border: `1px solid ${V3.rule}`,
        borderLeft: `3px solid ${V3.cyan}`,
        fontFamily: V3.mono, fontSize: 13, lineHeight: 1.55,
        whiteSpace: 'pre-wrap', color: V3.ink }}>
        {children}
      </pre>
    </div>
  );
}

function V3OutCell({ n, children }) {
  return (
    <div style={{ margin: '8px 0 22px', display: 'flex', gap: 14,
      alignItems: 'flex-start' }}>
      <div style={{ fontFamily: V3.mono, fontSize: 11, color: V3.accent,
        width: 48, paddingTop: 14, textAlign: 'right',
        fontVariantNumeric: 'tabular-nums' }}>
        Out[{n}]:
      </div>
      <div style={{ flex: 1, padding: '16px 20px',
        background: V3.cellBg2, border: `1px solid ${V3.rule}`,
        borderLeft: `3px solid ${V3.accent}` }}>
        {children}
      </div>
    </div>
  );
}

function V3MathCell({ n, children }) {
  return (
    <div style={{ margin: '18px 0', display: 'flex', gap: 14,
      alignItems: 'flex-start' }}>
      <div style={{ fontFamily: V3.mono, fontSize: 11, color: V3.sage,
        width: 48, paddingTop: 14, textAlign: 'right',
        fontVariantNumeric: 'tabular-nums' }}>
        Math[{n}]:
      </div>
      <div style={{ flex: 1, padding: '20px 24px',
        background: V3.cellBg, border: `1px solid ${V3.rule}`,
        borderLeft: `3px solid ${V3.sage}` }}>
        {children}
      </div>
    </div>
  );
}

function V3Bars({ coverage, limiting }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {EAA.map(a => {
        const pct = coverage[a.key];
        const isLim = a.key === limiting.key;
        const w = Math.min(pct, 2.2);
        const over = pct >= 1;
        return (
          <div key={a.key} style={{ display: 'flex', alignItems: 'center',
            gap: 10, fontSize: 12, fontFamily: V3.mono }}>
            <span style={{ width: 32, color: V3.ink,
              fontWeight: isLim ? 700 : 500 }}>{a.key}</span>
            <div style={{ flex: 1, height: 12, background: '#e4dbc0',
              position: 'relative', border: `1px solid ${V3.rule}` }}>
              <div style={{ position: 'absolute', inset: 0,
                width: `${(w / 2.2) * 100}%`,
                background: isLim ? V3.accent : (over ? V3.sage : V3.cyan),
              }}/>
              <div style={{ position: 'absolute', top: -2, bottom: -2,
                left: `${(1/2.2)*100}%`, width: 1,
                background: V3.ink, opacity: 0.5 }}/>
            </div>
            <span style={{ width: 50, textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
              color: isLim ? V3.accent : V3.ink,
              fontWeight: isLim ? 700 : 500 }}>
              {Math.round(pct * 100)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { V3Page });
