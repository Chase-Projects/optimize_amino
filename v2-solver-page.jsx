// v2-solver-page.jsx — Standalone solver page (no essay).

function SolverPage() {
  // Optional pantry preload via ?pantry=id1,id2,... query param.
  const initial = (() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const raw = q.get('pantry');
      const pantry = raw ? raw.split(',').filter(Boolean) : null;
      const pattern = q.get('pattern') || DEFAULT_PATTERN;
      return pantry ? { id: 'url', pantry, pattern, fixed: [], constraints: [] } : null;
    } catch (e) {
      return null;
    }
  })();

  return (
    <div style={{ background: V2.paper, minHeight: '100vh',
      fontFamily: V2.font, color: V2.ink }}>
      <TopNav current="solve" />

      <GridBg width={900} style={{ margin: '0 auto', padding: '36px 64px 80px',
        minHeight: 1000, lineHeight: 1.55 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, letterSpacing: 2,
            textTransform: 'uppercase', color: V2.mute,
            fontWeight: 700, marginBottom: 10 }}>
            tool
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: -1.2,
            margin: '0 0 10px', lineHeight: 1.05 }}>
            Just solve it.
          </h1>
          <div style={{ fontSize: 17, color: V2.mute, maxWidth: 620 }}>
            Set your body weight, pick your pantry, press run. The solver
            returns the cheapest gram-amounts that cover every essential amino
            acid. Missing AAs surface as supplement lines on the receipt — a
            hint that your pantry is short on one of the nine.
          </div>
        </div>

        <MiniTool initial={initial}/>

        <div style={{ marginTop: 40, padding: '18px 22px',
          background: V2.stickerD, border: `1px dashed ${V2.ocean}`,
          borderRadius: 2 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5,
            textTransform: 'uppercase', color: V2.ocean,
            fontWeight: 700, marginBottom: 6 }}>reading the receipt</div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            Supplement lines (💊) show how much of an individual AA you'd need
            to buy if your pantry can't cover it. They're priced at
            retail × your multiplier, so unless the multiplier is low they
            signal a structural gap — swap in a high-{'{'}AA{'}'} whole food instead.
          </div>
        </div>
      </GridBg>
    </div>
  );
}

Object.assign(window, { SolverPage });
