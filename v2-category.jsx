// v2-category.jsx — Reusable category explainer page.
// Pass a config; get a uniform page: hero + essay + comparison
// table + per-food amino bars + CTA to solver.

// Config shape:
// {
//   slug: 'grains',
//   title: 'Grains',
//   tagline: 'Starchy, cheap, lysine-poor.',
//   emoji: '🍚',
//   intro: JSX,
//   foodIds: ['rice','brice','oats',...],      // which foods to showcase
//   highlight: 'Lys',                          // AA to spotlight in the table
//   notes: [{h: 'title', b: 'body text'}, ...],// topic sections
// }

function CategoryPage({ cfg }) {
  const foods = cfg.foodIds.map(id => foodById(id)).filter(Boolean);

  // Per-100g per-$ metrics for a quick comparison table.
  const rows = foods.map(f => {
    const proteinPerDollar = f.cost > 0
      ? (f.protein || 0) / f.cost : 0;
    const highlightAA = cfg.highlight && f.amino
      ? f.amino[cfg.highlight] : null;
    return { f, proteinPerDollar, highlightAA };
  });

  return (
    <div style={{ background: V2.paper, minHeight: '100vh',
      fontFamily: V2.font, color: V2.ink }}>
      <TopNav current={cfg.slug} />

      <GridBg width={900} style={{ margin: '0 auto', padding: '48px 64px 80px',
        minHeight: 1000, lineHeight: 1.55 }}>
        {/* hero */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 13, letterSpacing: 2,
            textTransform: 'uppercase', color: V2.mute,
            fontWeight: 700, marginBottom: 10 }}>
            the pantry · {cfg.slug}
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1.4,
            margin: '0 0 10px', lineHeight: 1.05 }}>
            <span style={{ marginRight: 10 }}>{cfg.emoji}</span>
            {cfg.title}
          </h1>
          <div style={{ fontSize: 19, color: V2.mute, maxWidth: 600 }}>
            {cfg.tagline}
          </div>
        </div>

        {/* intro prose */}
        <Sticker tint={V2.stickerA} rotate={-0.2} tape="top"
          label={`why ${cfg.slug} matter`}
          style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 16, lineHeight: 1.6 }}>{cfg.intro}</div>
        </Sticker>

        {/* comparison table */}
        <Sticker tint={V2.stickerC} rotate={0.2} tape="top"
          label="per-100g snapshot · values from USDA"
          style={{ marginBottom: 36 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%',
              fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${V2.rule}`,
                  textAlign: 'left', fontSize: 11, letterSpacing: 1,
                  textTransform: 'uppercase', color: V2.mute2 }}>
                  <th style={{ padding: '8px 10px 8px 0' }}>food</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>protein (g)</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>$/100g</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>g protein / $</th>
                  {cfg.highlight && (
                    <th style={{ padding: '8px', textAlign: 'right' }}>
                      {cfg.highlight} (mg)
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ f, proteinPerDollar, highlightAA }) => (
                  <tr key={f.id} style={{ borderBottom: `1px dotted ${V2.rule}` }}>
                    <td style={{ padding: '8px 10px 8px 0' }}>
                      <span style={{ fontSize: 16, marginRight: 6 }}>{f.emoji}</span>
                      <span style={{ fontWeight: 600 }}>{f.name}</span>
                      {f.state && (
                        <span style={{ color: V2.mute2, fontSize: 11,
                          marginLeft: 6, fontFamily: V2.mono }}>
                          {f.state}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right',
                      fontFamily: V2.mono, fontVariantNumeric: 'tabular-nums' }}>
                      {(f.protein || 0).toFixed(1)}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right',
                      fontFamily: V2.mono, fontVariantNumeric: 'tabular-nums' }}>
                      ${(f.cost || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right',
                      fontFamily: V2.mono, fontVariantNumeric: 'tabular-nums',
                      color: proteinPerDollar > 20 ? V2.sage : V2.ink,
                      fontWeight: proteinPerDollar > 20 ? 700 : 500 }}>
                      {proteinPerDollar.toFixed(1)}
                    </td>
                    {cfg.highlight && (
                      <td style={{ padding: '8px', textAlign: 'right',
                        fontFamily: V2.mono, fontVariantNumeric: 'tabular-nums' }}>
                        {highlightAA}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 11, color: V2.mute, marginTop: 8,
              fontStyle: 'italic' }}>
              Prices are placeholder estimates — override per your local grocery.
            </div>
          </div>
        </Sticker>

        {/* per-food amino bars */}
        <Sticker tint={V2.stickerB} rotate={-0.2} tape="top"
          label="amino profile · each food scored vs FAO pattern (per 100g food)"
          style={{ marginBottom: 36 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 18 }}>
            {foods.map(f => {
              const e = evaluate({ [f.id]: 100 }, 'fao', { weightKg: 65 });
              return (
                <div key={f.id} style={{ padding: '10px 12px',
                  background: '#fff', border: `1px solid ${V2.rule}` }}>
                  <div style={{ display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: 8,
                    marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>
                      {f.emoji} {f.name}
                    </span>
                    <span style={{ fontFamily: V2.mono, fontSize: 11,
                      color: V2.mute }}>
                      lim: {e.limiting.key} · {Math.round(e.coverage[e.limiting.key]*100)}%
                    </span>
                  </div>
                  <AminoBars coverage={e.coverage} limiting={e.limiting}
                    targets={e.targets} totals={e.aminoTotals} compact/>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: V2.mute, marginTop: 10,
            fontStyle: 'italic' }}>
            Bar length is "100g of food ÷ daily target for a 65kg adult." Red = limiting AA.
          </div>
        </Sticker>

        {/* topic notes */}
        {cfg.notes && cfg.notes.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 20, marginBottom: 36 }}>
            {cfg.notes.map((n, i) => (
              <Sticker key={i} tint={[V2.stickerD, V2.stickerE, V2.stickerF,
                V2.stickerB][i % 4]} rotate={i % 2 === 0 ? -0.3 : 0.3}>
                <div style={{ fontSize: 11, letterSpacing: 1.2,
                  textTransform: 'uppercase', color: V2.mute2,
                  fontWeight: 700, marginBottom: 6 }}>
                  {String(i+1).padStart(2,'0')} · note
                </div>
                <div style={{ fontSize: 17, fontWeight: 800,
                  marginBottom: 6, lineHeight: 1.2 }}>{n.h}</div>
                <div style={{ fontSize: 14, color: V2.ink,
                  lineHeight: 1.55 }}>{n.b}</div>
              </Sticker>
            ))}
          </div>
        )}

        {/* CTA to solver */}
        <a href={`solver.html?pantry=${cfg.foodIds.join(',')}`}
          style={{ display: 'block', textDecoration: 'none' }}>
          <div style={{ position: 'relative',
            padding: '24px 28px', background: V2.ink,
            borderRadius: 2, color: V2.paper,
            transform: 'rotate(-0.2deg)',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: 1.5,
                textTransform: 'uppercase', color: V2.mustard,
                fontWeight: 700, marginBottom: 6 }}>solver</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>
                Load these {cfg.slug} into the solver →
              </div>
            </div>
            <div style={{ fontSize: 28, color: V2.tomato }}>▶</div>
          </div>
        </a>
      </GridBg>
      <SiteFooter current={cfg.slug}/>
    </div>
  );
}

Object.assign(window, { CategoryPage });
