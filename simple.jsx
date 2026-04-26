// simple.jsx — minimal, semantic, WCAG-AA-friendly solver.
// No stickers, no rotations, no decorative grid. Black text on white,
// native form controls, table results, aria-live for solver output.

const SIMPLE = {
  ink:    '#111111',
  mute:   '#4a4a4a',
  bg:     '#ffffff',
  rule:   '#777777',
  link:   '#0046b8',     // 7.4:1 contrast on white
  err:    '#9b1c1c',     // 7.0:1 on white
  ok:     '#155f2e',     // 6.0:1 on white
  warn:   '#7a4a00',     // 7.4:1 on white
  focus:  '#0046b8',
  font:   '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, sans-serif',
  mono:   'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
};

// Single-line stylesheet for native widgets — avoids browser low-contrast defaults.
const SIMPLE_CSS = `
  .simple-page * { box-sizing: border-box; }
  .simple-page { font-family: ${SIMPLE.font}; color: ${SIMPLE.ink};
    background: ${SIMPLE.bg}; line-height: 1.55; font-size: 17px; }
  .simple-page a { color: ${SIMPLE.link}; text-decoration: underline; }
  .simple-page a:focus-visible, .simple-page button:focus-visible,
  .simple-page input:focus-visible, .simple-page select:focus-visible,
  .simple-page summary:focus-visible {
    outline: 3px solid ${SIMPLE.focus}; outline-offset: 2px; }
  .simple-page button { font: inherit; padding: 10px 18px;
    border: 2px solid ${SIMPLE.ink}; background: ${SIMPLE.ink}; color: #fff;
    cursor: pointer; border-radius: 0; }
  .simple-page button[type="reset"], .simple-page button.secondary {
    background: #fff; color: ${SIMPLE.ink}; }
  .simple-page button:hover { filter: brightness(1.15); }
  .simple-page input, .simple-page select { font: inherit; padding: 8px 10px;
    border: 2px solid ${SIMPLE.ink}; background: #fff; color: ${SIMPLE.ink};
    border-radius: 0; min-height: 40px; }
  .simple-page fieldset { border: 1px solid ${SIMPLE.rule};
    padding: 16px 20px 20px; margin: 0 0 24px; }
  .simple-page legend { font-weight: 700; padding: 0 8px; font-size: 18px; }
  .simple-page label { font-weight: 500; }
  .simple-page table { border-collapse: collapse; width: 100%;
    margin: 8px 0 16px; }
  .simple-page th, .simple-page td { text-align: left; padding: 8px 10px;
    border-bottom: 1px solid ${SIMPLE.rule}; }
  .simple-page th { background: #f3f3f3; font-weight: 700; }
  .simple-page caption { caption-side: top; text-align: left;
    font-weight: 700; padding: 6px 0 8px; font-size: 16px; }
  .simple-page .num { font-family: ${SIMPLE.mono};
    font-variant-numeric: tabular-nums; text-align: right; }
  .simple-page .skiplink { position: absolute; left: -9999px; top: 0;
    background: ${SIMPLE.ink}; color: #fff; padding: 10px 14px;
    text-decoration: underline; z-index: 100; }
  .simple-page .skiplink:focus { left: 8px; top: 8px; }
  .simple-page .pantry-grid { display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 6px 18px; }
  .simple-page .pantry-grid label { display: flex; align-items: center;
    gap: 8px; padding: 4px 0; cursor: pointer; }
  .simple-page .pantry-grid input[type="checkbox"] {
    width: 18px; height: 18px; min-height: 18px; flex-shrink: 0;
    accent-color: ${SIMPLE.ink}; }
  .simple-page .help { color: ${SIMPLE.mute}; font-size: 14px; margin-top: 4px; }
  .simple-page .alert-warn { border-left: 4px solid ${SIMPLE.warn};
    background: #fff8e6; padding: 10px 14px; margin: 12px 0; }
  .simple-page .alert-ok { border-left: 4px solid ${SIMPLE.ok};
    background: #e9f6ee; padding: 10px 14px; margin: 12px 0; }
  .simple-page .topbar { border-bottom: 2px solid ${SIMPLE.ink};
    padding: 12px 24px; display: flex; align-items: center; gap: 18px;
    flex-wrap: wrap; background: #fff; }
  .simple-page .topbar nav ul { list-style: none; padding: 0; margin: 0;
    display: flex; gap: 14px; flex-wrap: wrap; }
  .simple-page .topbar a { font-weight: 600; }
  .simple-page .topbar a[aria-current="page"] { color: ${SIMPLE.ink};
    text-decoration: none; border-bottom: 3px solid ${SIMPLE.ink};
    padding-bottom: 2px; }
  @media (prefers-reduced-motion: reduce) {
    .simple-page * { transition: none !important; animation: none !important; }
  }
`;

const SIMPLE_NAV = [
  { href: 'index.html',  label: 'Essay' },
  { href: 'solver.html', label: 'Solver' },
];

function SimpleTopBar() {
  return (
    <header className="topbar" role="banner">
      <a href="index.html" style={{ fontWeight: 800, fontSize: 17,
        textDecoration: 'none', color: SIMPLE.ink }}>
        Optimize Amino
      </a>
      <nav aria-label="Primary">
        <ul>
          {SIMPLE_NAV.map(l => (
            <li key={l.href}>
              <a href={l.href}
                aria-current={l.current ? 'page' : undefined}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function SimplePage() {
  // Form state.
  const [weightLb, setWeightLb] = React.useState(150);
  const [pattern, setPattern]   = React.useState(DEFAULT_PATTERN);
  const [pantry, setPantry]     = React.useState(() => {
    const url = new URLSearchParams(window.location.search);
    const raw = url.get('pantry');
    if (raw) return new Set(raw.split(',').filter(Boolean));
    return new Set(['rice', 'beans', 'tofu', 'oats', 'pb']);
  });
  const [result, setResult]     = React.useState(null);
  const [solving, setSolving]   = React.useState(false);

  const togglePantry = (id) => {
    setPantry(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSolve = (e) => {
    e.preventDefault();
    setSolving(true);
    // Keep the spinner-free UX simple: synchronous solve, micro-defer for
    // the aria-live region to register the change.
    setTimeout(() => {
      const weightKg = weightLb * 0.45359237;
      const r = lpSolveMeal({
        pantryIds: Array.from(pantry),
        pattern,
        opts: { weightKg, mealFraction: 1 },
      });
      setResult(r);
      setSolving(false);
    }, 0);
  };

  const handleReset = () => {
    setResult(null);
    setPantry(new Set(['rice', 'beans', 'tofu', 'oats', 'pb']));
    setWeightLb(150);
    setPattern(DEFAULT_PATTERN);
  };

  // Group foods by category, dry foods preferred for the simple list.
  const groupedFoods = React.useMemo(() => {
    const groups = {};
    FOODS.forEach(f => {
      if (f.supplement) return;
      // Skip cooked variants when a dry pair exists (less clutter).
      if (f.state === 'cooked' && f.pairId
          && FOODS.some(x => x.id === f.pairId)) return;
      const cat = f.cat || 'Other';
      (groups[cat] = groups[cat] || []).push(f);
    });
    Object.values(groups).forEach(arr => arr.sort((a, b) =>
      a.name.localeCompare(b.name)));
    return groups;
  }, []);

  return (
    <div className="simple-page">
      <style>{SIMPLE_CSS}</style>
      <a href="#main" className="skiplink">Skip to main content</a>
      <SimpleTopBar />

      <main id="main" style={{ maxWidth: 820, margin: '0 auto',
        padding: '32px 24px 56px' }}>
        <h1 style={{ fontSize: 32, lineHeight: 1.2, margin: '0 0 8px' }}>
          Simple solver
        </h1>
        <p style={{ marginTop: 0, fontSize: 17, color: SIMPLE.mute }}>
          A plain-text version of the amino-acid LP. High contrast,
          keyboard navigable, screen-reader friendly. The solver itself
          is the same one used on{' '}
          <a href="solver.html">the full solver page</a>.
        </p>

        <form onSubmit={handleSolve} aria-describedby="solver-intro">
          <p id="solver-intro" className="help">
            Set your body weight, choose a reference pattern, and tick the
            foods on hand. Press <strong>Solve</strong> to find the cheapest
            gram-amounts that cover all nine essential amino acids.
          </p>

          {/* Body */}
          <fieldset>
            <legend>Your body</legend>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap',
              alignItems: 'flex-end' }}>
              <div>
                <label htmlFor="weight">Body weight (lb)</label><br/>
                <input id="weight" type="number" min="50" max="500"
                  step="1" value={weightLb}
                  onChange={e => setWeightLb(Number(e.target.value) || 0)}
                  style={{ width: 120 }}
                  aria-describedby="weight-help"/>
                <div id="weight-help" className="help">
                  Used to scale per-kg amino-acid targets.
                </div>
              </div>

              <div>
                <label htmlFor="pattern">Reference pattern</label><br/>
                <select id="pattern" value={pattern}
                  onChange={e => setPattern(e.target.value)}
                  aria-describedby="pattern-help">
                  {Object.entries(PATTERNS).map(([k, p]) => (
                    <option key={k} value={k}>{p.label}</option>
                  ))}
                </select>
                <div id="pattern-help" className="help">
                  The mg-per-g-protein floor each amino acid must clear.
                </div>
              </div>
            </div>
          </fieldset>

          {/* Pantry */}
          <fieldset>
            <legend>Your pantry</legend>
            <p className="help" style={{ marginTop: 0 }}>
              Tick everything you'd actually buy. The solver only picks
              from this list.
            </p>
            {Object.entries(groupedFoods).map(([cat, items]) => (
              <div key={cat} style={{ margin: '14px 0 6px' }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{cat}</div>
                <div className="pantry-grid">
                  {items.map(f => (
                    <label key={f.id}>
                      <input type="checkbox"
                        checked={pantry.has(f.id)}
                        onChange={() => togglePantry(f.id)}/>
                      <span>{f.name}</span>
                      <span style={{ color: SIMPLE.mute, fontSize: 13 }}>
                        (${(f.cost || 0).toFixed(2)}/100g)
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </fieldset>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="submit" disabled={pantry.size === 0 || solving}>
              {solving ? 'Solving…' : 'Solve'}
            </button>
            <button type="button" className="secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        {/* Results — aria-live so screen readers announce the new receipt. */}
        <section aria-live="polite" aria-busy={solving}
          style={{ marginTop: 32 }}>
          {result && <SimpleReceipt r={result} weightLb={weightLb}/>}
        </section>
      </main>

      <SiteFooter current="simple" theme="simple"/>
    </div>
  );
}

function SimpleReceipt({ r, weightLb }) {
  const limCov = r.coverage[r.limiting.key];
  const limOk  = limCov >= 0.999;
  const suppItems = Object.entries(r.supplements || {});
  const mealItems = Object.entries(r.meal || {})
    .map(([id, grams]) => ({ food: foodById(id), grams }))
    .filter(x => x.food)
    .sort((a, b) => b.grams - a.grams);

  return (
    <div>
      <h2 style={{ fontSize: 24, margin: '0 0 4px' }}>Result</h2>
      <p style={{ marginTop: 0, color: SIMPLE.mute }}>
        For a {weightLb} lb body, pattern{' '}
        <strong>{PATTERNS[r.pattern]?.label || r.pattern}</strong>.
      </p>

      {limOk ? (
        <div className="alert-ok" role="status">
          All nine essential amino acids meet target.
          Limiting AA: <strong>{r.limiting.full}</strong>{' '}
          at {Math.round(limCov * 100)}%. Total cost:{' '}
          <strong>${r.cost.toFixed(2)}/day</strong>.
        </div>
      ) : (
        <div className="alert-warn" role="status">
          Pantry is short on <strong>{r.limiting.full}</strong>{' '}
          ({Math.round(limCov * 100)}% of target). The solver added a
          supplement line below to make the LP feasible — consider adding a
          food rich in {r.limiting.key}.
        </div>
      )}

      <table>
        <caption>Foods (per day)</caption>
        <thead>
          <tr>
            <th scope="col">Food</th>
            <th scope="col" className="num">Grams</th>
            <th scope="col" className="num">Cost ($)</th>
          </tr>
        </thead>
        <tbody>
          {mealItems.length === 0 && (
            <tr><td colSpan="3"><em>(no foods selected)</em></td></tr>
          )}
          {mealItems.map(({ food, grams }) => (
            <tr key={food.id}>
              <td>{food.name}</td>
              <td className="num">{grams}</td>
              <td className="num">
                {(((food.cost || 0) * grams) / 100).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <td className="num">
              {mealItems.reduce((s, x) => s + x.grams, 0)}
            </td>
            <td className="num">
              {mealItems.reduce((s, { food, grams }) =>
                s + ((food.cost || 0) * grams) / 100, 0).toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>

      {suppItems.length > 0 && (
        <table>
          <caption>Supplement gap-fill (priced at {r.supplementMultiplier || 10}× retail)</caption>
          <thead>
            <tr>
              <th scope="col">Amino acid</th>
              <th scope="col" className="num">Grams</th>
            </tr>
          </thead>
          <tbody>
            {suppItems.map(([id, g]) => {
              const s = foodById(id);
              return (
                <tr key={id}>
                  <td>{s ? s.name : id}</td>
                  <td className="num">{g.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <table>
        <caption>Amino acid coverage vs. target</caption>
        <thead>
          <tr>
            <th scope="col">Amino acid</th>
            <th scope="col" className="num">From food (mg)</th>
            <th scope="col" className="num">From supplement (mg)</th>
            <th scope="col" className="num">Target (mg)</th>
            <th scope="col" className="num">Coverage</th>
          </tr>
        </thead>
        <tbody>
          {EAA.map(a => {
            const food = Math.round(r.foodAminoTotals?.[a.key] || 0);
            const supp = Math.round(r.suppAminoTotals?.[a.key] || 0);
            const tgt  = r.targets[a.key];
            const cov  = r.coverage[a.key];
            const isLim = a.key === r.limiting.key;
            return (
              <tr key={a.key}>
                <th scope="row">
                  {a.full} ({a.key})
                  {isLim && <span style={{ marginLeft: 6, color: SIMPLE.err,
                    fontWeight: 700 }}> · limiting</span>}
                </th>
                <td className="num">{food}</td>
                <td className="num">{supp || ''}</td>
                <td className="num">{tgt}</td>
                <td className="num"
                  style={{ color: cov < 1 ? SIMPLE.err
                    : (cov > 1.5 ? SIMPLE.warn : SIMPLE.ok), fontWeight: 700 }}>
                  {Math.round(cov * 100)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="help">
        Total daily cost (incl. supplement gap-fill): <strong>${r.cost.toFixed(2)}</strong>.
        Total mass: {Math.round(r.mass)} g · Protein: {r.protein.toFixed(1)} g.
      </p>
    </div>
  );
}

Object.assign(window, { SimplePage, SimpleReceipt });
