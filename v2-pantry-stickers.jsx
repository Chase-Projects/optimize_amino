// v2-pantry-stickers.jsx — "Pantry stickers" variation
// Same essay bones, but runnable cells are styled as fridge stickers
// with masking tape, slight rotation, and illustrated food tags.
// Playful at the interactive moments, editorial for the prose.

const V2 = {
  paper:   '#f2ebdb',
  grid:    'rgba(120, 85, 45, 0.09)',
  gridMajor: 'rgba(120, 85, 45, 0.16)',
  ink:     '#241e17',
  mute:    '#6b5b47',
  rule:    '#c9b894',
  tomato:  '#c94b34',
  mustard: '#d9a441',
  sage:    '#6b8a5a',
  ocean:   '#3a6a7a',
  stickerA:'#fffdf5',
  stickerB:'#ffeed0',
  stickerC:'#e6f0d8',
  stickerD:'#d8e4ea',
  tape:    'rgba(220, 200, 140, 0.75)',
  font:    '"Nunito", "Nunito Sans", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  mono:    '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
  hand:    '"Caveat", "Marker Felt", "Bradley Hand", cursive',
};

function V2Page() {
  const grains = evaluate(SCENARIOS.justGrains);
  return (
    <div style={{
      fontFamily: V2.font,
      color: V2.ink,
      background: V2.paper,
      backgroundImage: `
        linear-gradient(to right, ${V2.grid} 1px, transparent 1px),
        linear-gradient(to bottom, ${V2.grid} 1px, transparent 1px),
        linear-gradient(to right, ${V2.gridMajor} 1px, transparent 1px),
        linear-gradient(to bottom, ${V2.gridMajor} 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px, 24px 24px, 120px 120px, 120px 120px',
      width: 820, minHeight: 1200,
      padding: '64px 72px 80px', lineHeight: 1.55, position: 'relative',
    }}>
      {/* masthead */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, background: V2.tomato,
            borderRadius: '50%', display: 'grid', placeItems: 'center',
            color: '#fff', fontSize: 15, fontWeight: 800 }}>A</div>
          <div style={{ fontSize: 14, letterSpacing: 1.5,
            textTransform: 'uppercase', fontWeight: 800 }}>
            Optimize Amino
          </div>
        </div>
        <div style={{ fontSize: 12, color: V2.mute,
          fontVariantNumeric: 'tabular-nums' }}>
          Essay № 01 · the pantry notebook
        </div>
      </div>

      {/* hero */}
      <div style={{ position: 'relative', marginBottom: 72 }}>
        <h1 style={{
          fontSize: 54, fontWeight: 800, letterSpacing: -1.3,
          margin: '0 0 16px', lineHeight: 1.03, textWrap: 'balance',
        }}>
          Nine acids,<br/>
          <span style={{ color: V2.tomato }}>one grocery list.</span>
        </h1>
        <div style={{ fontSize: 18, color: V2.mute, maxWidth: 560,
          marginBottom: 10 }}>
          Picking vegan meals that cover every essential amino acid, at the
          lowest price — solved as a linear program, told as a story.
        </div>

        {/* decorative stickers around the hero */}
        <div style={{ position: 'absolute', top: -6, right: 6,
          transform: 'rotate(5deg)' }}>
          <StickerTag emoji="🍚" label="rice" tint={V2.stickerB} />
        </div>
        <div style={{ position: 'absolute', top: 80, right: 80,
          transform: 'rotate(-7deg)' }}>
          <StickerTag emoji="🫘" label="beans" tint={V2.stickerC} />
        </div>
        <div style={{ position: 'absolute', top: 145, right: 10,
          transform: 'rotate(3deg)' }}>
          <StickerTag emoji="🥜" label="peanut" tint={V2.stickerD} />
        </div>
      </div>

      {/* Section 1 */}
      <V2Section num="01" title="Protein is nine problems, not one.">
        <p>
          Your nutrition label treats <em>protein</em> as a lump. Your body does not.
          It tears whatever you ate back down into twenty amino acids, nine of which
          it cannot make itself. A meal is only as useful as its scarcest essential
          amino — Liebig&rsquo;s law of the minimum, borrowed from agronomy.
        </p>
        <p>
          So &ldquo;did I get enough protein?&rdquo; is really nine questions stacked
          on top of each other. That&rsquo;s why the beans-and-rice heuristic works —
          and why it only <em>almost</em> works.
        </p>

        <StickerCell tint={V2.stickerA} rotate={-0.6}
          tape="top" label="the nine essentials">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px 24px' }}>
            {EAA.map(a => (
              <div key={a.key} style={{ display: 'flex',
                justifyContent: 'space-between', fontSize: 13,
                padding: '4px 0', borderBottom: `1px dotted ${V2.rule}` }}>
                <span>
                  <strong style={{ fontFamily: V2.mono, color: V2.tomato }}>
                    {a.key}
                  </strong>
                  &nbsp;<span style={{ color: V2.mute }}>{a.full}</span>
                </span>
                <span style={{ fontFamily: V2.mono,
                  fontVariantNumeric: 'tabular-nums' }}>
                  {a.req}<span style={{ color: V2.mute }}> mg/g</span>
                </span>
              </div>
            ))}
          </div>
        </StickerCell>
      </V2Section>

      {/* Section 2 */}
      <V2Section num="02" title="Scenario one — just grains.">
        <p>
          Here&rsquo;s 600 g of grain — mostly rice, a splash of oats — costing well
          under a dollar. A third of the world has eaten something close to this for
          centuries. What does the solver see?
        </p>

        <StickerCell tint={V2.stickerB} rotate={0.8} tape="left"
          label="today's plate">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap',
            alignItems: 'center' }}>
            <FoodChip emoji="🍚" name="rice" grams={500} />
            <FoodChip emoji="🌾" name="oats" grams={100} />
            <span style={{ marginLeft: 'auto', fontFamily: V2.mono,
              fontVariantNumeric: 'tabular-nums', color: V2.tomato,
              fontSize: 14, fontWeight: 700 }}>
              ${grains.cost.toFixed(2)} · {grains.protein.toFixed(1)} g protein
            </span>
          </div>
        </StickerCell>

        <StickerCell tint={V2.stickerC} rotate={-0.4} tape="right"
          label="amino coverage">
          <V2Bars coverage={grains.coverage} limiting={grains.limiting} />
          <div style={{ fontSize: 13, color: V2.mute, marginTop: 14,
            fontStyle: 'italic' }}>
            Lysine caps the whole meal at {Math.round(grains.coverage.Lys * 100)}%
            of daily need. Everything to the right of the dotted line is metabolic
            &ldquo;leftovers&rdquo; — burned for energy, not built into you.
          </div>
        </StickerCell>

        <div style={{ position: 'relative', padding: '4px 0 0' }}>
          <div style={{ position: 'absolute', right: -30, top: -10,
            transform: 'rotate(6deg)', fontFamily: V2.hand,
            fontSize: 18, color: V2.tomato, maxWidth: 140,
            lineHeight: 1.2 }}>
            ↖ the limiting<br/>amino acid!
          </div>
        </div>

        <p>
          Grains are <strong>lysine-limited</strong>. Eat a kilo; you still fall
          short. The feasible region of the LP — the meals that satisfy every
          inequality at once — contains no point on the grain-only axis.
        </p>
      </V2Section>

      {/* Section 3 */}
      <V2Section num="03" title="The problem, written as a program.">
        <p>
          With each constraint pinned to the fridge, the full problem writes itself.
          Let <span style={{ fontFamily: V2.mono }}>x<sub>i</sub></span> be grams of
          food <em>i</em>. The solver picks <span style={{ fontFamily: V2.mono }}>x</span>
          to minimise cost while covering every amino acid.
        </p>
        <StickerCell tint={V2.stickerD} rotate={-0.8} tape="top"
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
          </div>
        </StickerCell>
      </V2Section>

      {/* next pointer */}
      <div style={{ position: 'relative', marginTop: 64, padding: '30px 34px',
        background: '#fffaea', border: `1.5px dashed ${V2.mustard}`,
        borderRadius: 2, transform: 'rotate(-0.3deg)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: 1.5,
            textTransform: 'uppercase', color: V2.mustard,
            fontWeight: 700, marginBottom: 6 }}>Next</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: V2.ink }}>
            Pick your pantry. Run the solver on your shelves.
          </div>
        </div>
        <div style={{ fontSize: 28, color: V2.tomato }}>→</div>
      </div>
    </div>
  );
}

function V2Section({ num, title, children }) {
  return (
    <section style={{ marginBottom: 56 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14,
        marginBottom: 18 }}>
        <span style={{ fontFamily: V2.mono, fontSize: 13,
          color: V2.tomato, fontWeight: 700, letterSpacing: 1 }}>§ {num}</span>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5,
          margin: 0, textWrap: 'balance' }}>{title}</h2>
      </div>
      <div style={{ fontSize: 16, maxWidth: 640 }}>{children}</div>
    </section>
  );
}

function StickerCell({ tint, rotate = 0, tape = 'top', label, children }) {
  return (
    <div style={{ margin: '22px 0 26px', position: 'relative',
      transform: `rotate(${rotate}deg)` }}>
      {tape && (
        <div style={{
          position: 'absolute',
          top: tape === 'top' ? -11 : tape === 'bottom' ? 'unset' : 30,
          bottom: tape === 'bottom' ? -11 : 'unset',
          left: tape === 'left' ? -14 : tape === 'right' ? 'unset' : '50%',
          right: tape === 'right' ? -14 : 'unset',
          transform: tape === 'top' || tape === 'bottom'
            ? 'translateX(-50%) rotate(-2deg)' : 'rotate(-4deg)',
          width: tape === 'left' || tape === 'right' ? 28 : 96,
          height: tape === 'left' || tape === 'right' ? 64 : 24,
          background: V2.tape,
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
          backgroundImage: 'linear-gradient(135deg, transparent 48%, rgba(255,255,255,0.3) 50%, transparent 52%)',
          zIndex: 2,
        }} />
      )}
      <div style={{ background: tint, padding: '18px 22px 20px',
        boxShadow: '0 1px 1px rgba(0,0,0,0.04), 0 6px 16px rgba(60,40,20,0.08)',
        border: '1px solid rgba(0,0,0,0.05)',
      }}>
        {label && (
          <div style={{ fontSize: 11, letterSpacing: 1.3,
            textTransform: 'uppercase', color: V2.mute, fontWeight: 700,
            marginBottom: 12 }}>{label}</div>
        )}
        {children}
      </div>
    </div>
  );
}

function StickerTag({ emoji, label, tint }) {
  return (
    <div style={{ background: tint, padding: '8px 14px',
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 1px 1px rgba(0,0,0,0.04), 0 6px 12px rgba(60,40,20,0.08)',
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: V2.hand, fontSize: 16, color: V2.ink }}>
      <span style={{ fontSize: 18 }}>{emoji}</span>
      <span>{label}</span>
    </div>
  );
}

function FoodChip({ emoji, name, grams }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 12px', background: '#fff',
      border: `1px solid ${V2.rule}`, borderRadius: 999, fontSize: 14 }}>
      <span style={{ fontSize: 16 }}>{emoji}</span>
      <span style={{ fontWeight: 700 }}>{name}</span>
      <span style={{ color: V2.mute, fontFamily: V2.mono,
        fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>{grams} g</span>
    </div>
  );
}

function V2Bars({ coverage, limiting }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {EAA.map(a => {
        const pct = coverage[a.key];
        const isLim = a.key === limiting.key;
        const w = Math.min(pct, 2.2);
        const over = pct >= 1;
        return (
          <div key={a.key} style={{ display: 'flex', alignItems: 'center',
            gap: 12, fontSize: 13 }}>
            <span style={{ width: 36, fontFamily: V2.mono, color: V2.ink,
              fontWeight: isLim ? 700 : 500 }}>{a.key}</span>
            <div style={{ flex: 1, height: 14, background: 'rgba(0,0,0,0.05)',
              position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0,
                width: `${(w / 2.2) * 100}%`,
                background: isLim ? V2.tomato : (over ? V2.sage : V2.mustard),
                transition: 'width .4s ease',
              }}/>
              <div style={{ position: 'absolute', top: -3, bottom: -3,
                left: `${(1/2.2)*100}%`, width: 1,
                background: V2.ink, opacity: 0.4,
                borderLeft: `1px dashed ${V2.ink}` }}/>
            </div>
            <span style={{ width: 58, textAlign: 'right',
              fontFamily: V2.mono, fontVariantNumeric: 'tabular-nums',
              color: isLim ? V2.tomato : V2.ink,
              fontWeight: isLim ? 700 : 500 }}>
              {Math.round(pct * 100)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { V2Page });
