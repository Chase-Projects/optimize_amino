// v2-tool.jsx — Inline "mini tool" cell. Preset picker, pantry,
// extra constraints, fixed foods, solve button, receipt output.

// ─────────────────────────────────────────────────────────────
// Body target controls — weight (kg/lb), protein override,
// meals/day fraction, per-meal vs daily toggle, supplement
// price multiplier. Emits an `opts` object consumed by the LP.
// ─────────────────────────────────────────────────────────────
function BodyTargetPanel({ value, onChange }) {
  const { weightUnit, weightLb, weightKg, mealsPerDay, mealFraction,
          proteinOverrideMode, proteinG, usePerKg, multiplier } = value;

  const set = patch => onChange({ ...value, ...patch });

  // Derive one from the other so switching units never loses precision.
  const setLb = v => set({ weightLb: v, weightKg: +(v / 2.2046).toFixed(1) });
  const setKg = v => set({ weightKg: v, weightLb: +(v * 2.2046).toFixed(1) });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: 14, marginBottom: 18, padding: '14px 16px',
      background: '#fff', border: `1.5px solid ${V2.rule}`, borderRadius: 3 }}>
      {/* Weight */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6,
          display: 'flex', alignItems: 'center', gap: 4 }}>
          Body weight
          <InfoDot tip="Your body weight drives the daily amino-acid requirement in mg/kg/day (FAO/WHO/UNU 2007)." />
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="number" min={20} max={250} step={1}
            value={weightUnit === 'lb' ? weightLb : weightKg}
            onChange={e => {
              const n = parseFloat(e.target.value) || 0;
              weightUnit === 'lb' ? setLb(n) : setKg(n);
            }}
            style={{ width: 70, padding: '6px 8px', fontFamily: V2.mono,
              fontSize: 13, border: `1.5px solid ${V2.rule}`, borderRadius: 3,
              background: V2.stickerA }}/>
          <div style={{ display: 'inline-flex', border: `1.5px solid ${V2.rule}`,
            borderRadius: 3, overflow: 'hidden' }}>
            {['lb', 'kg'].map(u => (
              <button key={u} onClick={() => set({ weightUnit: u })}
                style={{ padding: '6px 10px',
                  background: weightUnit === u ? V2.ink : '#fff',
                  color: weightUnit === u ? V2.paper : V2.ink,
                  border: 'none', fontFamily: V2.mono, fontSize: 12,
                  fontWeight: 700, cursor: 'pointer' }}>
                {u}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 11, color: V2.mute, fontFamily: V2.mono }}>
            = {weightKg} kg
          </span>
        </div>
      </div>

      {/* Protein mode */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6,
          display: 'flex', alignItems: 'center', gap: 4 }}>
          Protein target
          <InfoDot tip="Default uses 0.8 g/kg/day (RDA). Override to match an athletic (1.6 g/kg) or custom plan." />
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center',
          flexWrap: 'wrap' }}>
          <select value={proteinOverrideMode}
            onChange={e => set({ proteinOverrideMode: e.target.value })}
            style={{ padding: '6px 8px', fontFamily: V2.font, fontSize: 12,
              border: `1.5px solid ${V2.rule}`, borderRadius: 3,
              background: V2.stickerA }}>
            <option value="rda">RDA (0.8 g/kg)</option>
            <option value="athletic">Athletic (1.6 g/kg)</option>
            <option value="custom">Custom g/day</option>
            <option value="perkg">FAO mg/kg/d (ignore pattern)</option>
          </select>
          {proteinOverrideMode === 'custom' && (
            <input type="number" min={10} max={300} step={1}
              value={proteinG}
              onChange={e => set({ proteinG: parseFloat(e.target.value) || 0 })}
              style={{ width: 60, padding: '6px 8px', fontFamily: V2.mono,
                fontSize: 13, border: `1.5px solid ${V2.rule}`,
                borderRadius: 3 }}/>
          )}
        </div>
      </div>

      {/* Meal fraction */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6,
          display: 'flex', alignItems: 'center', gap: 4 }}>
          Targets shown for
          <InfoDot tip="Solve for a whole day, or a fraction (e.g. one of three meals)." />
        </div>
        <div style={{ display: 'inline-flex', border: `1.5px solid ${V2.rule}`,
          borderRadius: 3, overflow: 'hidden' }}>
          {[
            { id: 1,    label: 'day' },
            { id: 1/2,  label: '½ day' },
            { id: 1/3,  label: '⅓ day' },
            { id: 1/4,  label: '¼ day' },
          ].map(o => {
            const on = Math.abs(mealFraction - o.id) < 1e-3;
            return (
              <button key={o.label} onClick={() => set({ mealFraction: o.id })}
                style={{ padding: '6px 10px',
                  background: on ? V2.ink : '#fff',
                  color: on ? V2.paper : V2.ink,
                  border: 'none', borderLeft: `1px solid ${V2.rule}`,
                  fontFamily: V2.font, fontSize: 12, fontWeight: 700,
                  cursor: 'pointer' }}>
                {o.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Supplement multiplier */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6,
          display: 'flex', alignItems: 'center', gap: 4 }}>
          Supplement cost × {multiplier}
          <InfoDot tip="Individual amino-acid supplements are always available to guarantee feasibility. A higher multiplier keeps them out of the solution unless your pantry genuinely can't cover an AA. 1× = real retail price." />
        </div>
        <input type="range" min={1} max={50} step={1} value={multiplier}
          onChange={e => set({ multiplier: parseInt(e.target.value, 10) })}
          style={{ width: '100%', accentColor: V2.mustard }}/>
        <div style={{ fontSize: 10, color: V2.mute, fontFamily: V2.mono,
          display: 'flex', justifyContent: 'space-between' }}>
          <span>1× (real)</span><span>default 10×</span><span>50× (emergency only)</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PantryPicker — grouped chips (common) + dry/cooked toggle +
// searchable dropdown for less-common foods.
// ─────────────────────────────────────────────────────────────
const COMMON_FOODS = new Set([
  'rice', 'brice', 'oats', 'quinoa', 'pasta',
  'beans', 'lentils', 'chickpea',
  'tofu', 'tempeh', 'seitan',
  'soy_milk', 'almond', 'peanut',
  'spinach', 'blueberry',
  'pea_protein', 'soy_protein',
]);

function PantryPicker({ selected, onToggle, preferDry, onPreferDryChange }) {
  const [query, setQuery] = React.useState('');
  const [extTick, setExtTick] = React.useState(0);   // bumps on lazy-load

  // Lazy-load the extended food list the first time the user engages
  // the search box. Re-render when it resolves so results pick it up.
  const [extLoading, setExtLoading] = React.useState(false);
  const ensureExtended = React.useCallback(() => {
    if (window.FOODS_EXTENDED || extLoading) return;
    setExtLoading(true);
    loadExtendedFoods().then(() => { setExtLoading(false); setExtTick(t => t + 1); });
  }, [extLoading]);

  React.useEffect(() => {
    const onLoaded = () => setExtTick(t => t + 1);
    window.addEventListener('amino:extended-loaded', onLoaded);
    return () => window.removeEventListener('amino:extended-loaded', onLoaded);
  }, []);

  const byCat = {};
  FOODS.forEach(f => {
    if (f.supplement) return;
    if (!byCat[f.cat]) byCat[f.cat] = [];
    byCat[f.cat].push(f);
  });

  // For a chip, pick cooked/dry variant based on toggle when a pair exists.
  const preferredVariant = f => {
    if (!f.pairId) return f;
    if (preferDry && f.state !== 'dry') {
      return FOODS.find(x => x.id === f.pairId && x.state === 'dry') || f;
    }
    if (!preferDry && f.state === 'dry') {
      return FOODS.find(x => x.id === f.pairId && x.state !== 'dry') || f;
    }
    return f;
  };

  // Common food set, de-duped by pair (show one per pair — the preferred form).
  const commonChips = (() => {
    const seenPairs = new Set();
    const out = [];
    FOODS.forEach(raw => {
      if (raw.supplement) return;
      if (!COMMON_FOODS.has(raw.id) && !(raw.pairId && COMMON_FOODS.has(raw.pairId))) return;
      const pairKey = raw.pairId
        ? [raw.id, raw.pairId].sort().join('|')
        : raw.id;
      if (seenPairs.has(pairKey)) return;
      seenPairs.add(pairKey);
      out.push(preferredVariant(raw));
    });
    return out;
  })();

  const commonByCat = {};
  commonChips.forEach(f => {
    if (!commonByCat[f.cat]) commonByCat[f.cat] = [];
    commonByCat[f.cat].push(f);
  });

  // Search results: core FOODS + lazily-loaded extended rows.
  // De-duped by id so extended can't shadow core entries.
  const q = query.trim().toLowerCase();
  const coreHits = q ? FOODS.filter(f =>
    !f.supplement && f.scalable !== false &&
    (f.name.toLowerCase().includes(q) || f.cat.toLowerCase().includes(q))
  ) : [];
  const ext = window.FOODS_EXTENDED || [];
  const seenIds = new Set(coreHits.map(f => f.id));
  const extHits = q ? ext.filter(f =>
    !seenIds.has(f.id) && f.supplement !== true && f.scalable !== false &&
    ((f.name || '').toLowerCase().includes(q) ||
     (f.cat  || '').toLowerCase().includes(q))
  ) : [];
  const results = [...coreHits, ...extHits].slice(0, 20);

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', marginBottom: 10, gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 700,
          display: 'inline-flex', alignItems: 'center' }}>
          Pantry
          <span style={{ color: V2.mute, fontWeight: 500, fontSize: 12,
            marginLeft: 6 }}>
            (scalable variables of the LP)
          </span>
          <InfoDot tip="Foods the solver is free to scale. Each pantry item becomes a decision variable xᵢ in the LP." />
        </span>

        {/* Dry / cooked toggle */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: V2.mute, fontFamily: V2.mono }}>
            grain &amp; legume form
          </span>
          <div style={{ display: 'inline-flex',
            border: `1.5px solid ${V2.rule}`, borderRadius: 3,
            overflow: 'hidden' }}>
            {[
              { id: false, label: 'cooked' },
              { id: true,  label: 'dry'    },
            ].map(o => (
              <button key={o.label}
                onClick={() => onPreferDryChange(o.id)}
                style={{ padding: '5px 10px',
                  background: preferDry === o.id ? V2.ink : '#fff',
                  color: preferDry === o.id ? V2.paper : V2.ink,
                  border: 'none', fontFamily: V2.mono, fontSize: 11,
                  fontWeight: 700, cursor: 'pointer' }}>
                {o.label}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 11, color: V2.mute, fontFamily: V2.mono }}>
            · {selected.size} selected
          </span>
        </div>
      </div>

      {/* Common chips */}
      {CATEGORIES.filter(c => !c.startsWith('Fixed') && c !== 'Supplement')
        .map(cat => {
          const list = commonByCat[cat] || [];
          if (!list.length) return null;
          return (
            <div key={cat} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, letterSpacing: 1.2,
                textTransform: 'uppercase', color: V2.mute2,
                fontWeight: 700, marginBottom: 6 }}>
                {cat}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {list.map(f => (
                  <FoodChip key={f.id} food={f}
                    selected={selected.has(f.id) || selected.has(f.pairId)}
                    onClick={() => onToggle(f.id)} />
                ))}
              </div>
            </div>
          );
        })}

      {/* Searchable dropdown — less-common foods */}
      <div style={{ marginTop: 14, padding: '10px 12px',
        background: V2.stickerA, border: `1px dashed ${V2.rule}`,
        borderRadius: 3 }}>
        <div style={{ fontSize: 11, letterSpacing: 1.2,
          textTransform: 'uppercase', color: V2.mute2, fontWeight: 700,
          marginBottom: 6, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            Add from full list
            <InfoDot tip="Searches the core 50-food set plus the extended USDA dataframe, which is fetched the first time you open this search box." />
          </span>
          {extLoading && (
            <span style={{ fontFamily: V2.mono, fontSize: 10,
              color: V2.mute, textTransform: 'none', letterSpacing: 0 }}>
              loading extended set…
            </span>
          )}
          {!extLoading && window.FOODS_EXTENDED && (
            <span style={{ fontFamily: V2.mono, fontSize: 10,
              color: V2.mute, textTransform: 'none', letterSpacing: 0 }}>
              +{window.FOODS_EXTENDED.length} extended
            </span>
          )}
        </div>
        <input type="search" placeholder="search foods…"
          value={query}
          onFocus={ensureExtended}
          onChange={e => { ensureExtended(); setQuery(e.target.value); }}
          style={{ width: '100%', padding: '7px 10px', fontFamily: V2.font,
            fontSize: 13, border: `1.5px solid ${V2.rule}`, borderRadius: 3,
            background: '#fff', boxSizing: 'border-box' }}/>
        {results.length > 0 && (
          <div style={{ marginTop: 8, maxHeight: 180, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 4 }}>
            {results.map(f => (
              <button key={f.id} onClick={() => onToggle(f.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 10,
                  padding: '6px 10px', background: selected.has(f.id)
                    ? V2.stickerC : '#fff',
                  border: `1px solid ${V2.rule}`, borderRadius: 3,
                  fontFamily: V2.font, fontSize: 13, cursor: 'pointer',
                  textAlign: 'left' }}>
                <span style={{ fontSize: 16 }}>{f.emoji}</span>
                <span style={{ fontWeight: 600, flex: 1 }}>{f.name}</span>
                <span style={{ fontFamily: V2.mono, fontSize: 11,
                  color: V2.mute }}>
                  {f.cat}{f.state ? ` · ${f.state}` : ''}
                </span>
                <span style={{ fontFamily: V2.mono, fontSize: 11,
                  color: V2.mute }}>
                  ${f.cost.toFixed(2)}/100g
                </span>
                {selected.has(f.id) && (
                  <span style={{ color: V2.sage, fontWeight: 700 }}>✓</span>
                )}
              </button>
            ))}
          </div>
        )}
        {query && !results.length && (
          <div style={{ fontSize: 12, color: V2.mute, marginTop: 8,
            fontStyle: 'italic' }}>
            no matches.
          </div>
        )}
      </div>
    </div>
  );
}

function MiniTool({ initial }) {
  const [pattern, setPattern] = React.useState(initial?.pattern || DEFAULT_PATTERN);
  const [selected, setSelected] = React.useState(
    new Set(initial?.pantry || ['rice', 'beans', 'tofu', 'oats']));
  const [fixed, setFixed] = React.useState(
    new Set(initial?.fixed || ['spinach']));
  const [extras, setExtras] = React.useState(
    new Set(initial?.constraints || []));
  const [preferDry, setPreferDryRaw] = React.useState(false);
  const [body, setBody] = React.useState({
    weightUnit: 'lb', weightLb: 143, weightKg: 65,
    mealsPerDay: 3, mealFraction: 1,
    proteinOverrideMode: 'rda', proteinG: 52,
    multiplier: 10,
  });
  const [result, setResult] = React.useState(null);
  const [solving, setSolving] = React.useState(false);

  React.useEffect(() => {
    if (!initial) return;
    setPattern(initial.pattern || DEFAULT_PATTERN);
    setSelected(new Set(initial.pantry || []));
    setFixed(new Set(initial.fixed || []));
    setExtras(new Set(initial.constraints || []));
    setResult(null);
  }, [initial?.id]);

  const toggle = (set, setter) => id => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id); else next.add(id);
    setter(next);
  };

  // Pair-aware toggle: selecting a dry variant replaces the cooked pair
  // (and vice versa) rather than stacking both.
  const togglePaired = (set, setter) => id => {
    const f = foodById(id);
    const pair = f?.pairId;
    const next = new Set(set);
    const wasSelected = next.has(id) || (pair && next.has(pair));
    next.delete(id);
    if (pair) next.delete(pair);
    if (!wasSelected) next.add(id);
    setter(next);
  };

  // When the user flips the dry/cooked toggle, swap any currently-selected
  // paired items to the matching variant. Prevents stale selections.
  const setPreferDry = v => {
    setPreferDryRaw(v);
    setSelected(prev => {
      const next = new Set();
      prev.forEach(id => {
        const f = foodById(id);
        if (!f || !f.pairId) { next.add(id); return; }
        const isDry = f.state === 'dry';
        if (isDry === v) { next.add(id); return; }
        const mate = FOODS.find(x => x.id === f.pairId);
        next.add(mate ? mate.id : id);
      });
      return next;
    });
  };

  // Build opts for targetsFor / lpSolveMeal.
  const buildOpts = () => {
    const kg = body.weightKg;
    const opts = { weightKg: kg, mealFraction: body.mealFraction };
    if (body.proteinOverrideMode === 'perkg') {
      opts.usePerKg = true;
    } else if (body.proteinOverrideMode === 'athletic') {
      opts.proteinG = kg * 1.6;
    } else if (body.proteinOverrideMode === 'custom') {
      opts.proteinG = body.proteinG;
    } // else RDA: default in targetsFor uses kg × 0.8.
    return opts;
  };

  const onSolve = () => {
    setSolving(true);
    setResult(null);
    setTimeout(() => {
      const r = mockSolve({
        pantryIds: [...selected],
        fixedIds: [...fixed],
        pattern,
        extras: [...extras],
        supplementMultiplier: body.multiplier,
        opts: buildOpts(),
      });
      setResult(r);
      setSolving(false);
    }, 400);
  };

  const byCat = {};
  FOODS.forEach(f => {
    if (!byCat[f.cat]) byCat[f.cat] = [];
    byCat[f.cat].push(f);
  });

  return (
    <div style={{ position: 'relative', margin: '32px 0' }}>
      <Sticker tint={V2.stickerA} rotate={-0.3} tape="top" tapeColor="blue"
        label="runnable cell · mini-tool"
        kicker={`preset: ${PATTERNS[pattern].label}`}>

        {/* Body target controls */}
        <BodyTargetPanel value={body} onChange={setBody} />

        {/* pattern picker */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8,
            color: V2.ink, display: 'inline-flex', alignItems: 'center' }}>
            Amino acid target
            <InfoDot tip="Named scoring patterns (mg of each AA per gram of protein). 'FAO/WHO/UNU 2007' is the adult maintenance standard; others target athletic, infant, or animal-protein biological values." />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(PATTERNS).map(([id, p]) => (
              <button key={id} onClick={() => setPattern(id)}
                style={{ padding: '6px 12px',
                  background: pattern === id ? V2.ink : '#fff',
                  color: pattern === id ? V2.paper : V2.ink,
                  border: `1.5px solid ${pattern === id ? V2.ink : V2.rule}`,
                  borderRadius: 999, cursor: 'pointer',
                  fontFamily: V2.font, fontSize: 12, fontWeight: 700,
                  letterSpacing: 0.2 }}>
                {p.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: V2.mute, marginTop: 8,
            fontStyle: 'italic' }}>
            {PATTERNS[pattern].note}
          </div>
        </div>

        {/* Pantry picker (common chips + dry/cooked toggle + search) */}
        <PantryPicker selected={selected}
          onToggle={togglePaired(selected, setSelected)}
          preferDry={preferDry} onPreferDryChange={setPreferDry}/>

        {/* fixed foods */}
        <div style={{ marginBottom: 18, padding: '12px 14px',
          background: 'rgba(122, 74, 90, 0.06)',
          border: `1px dashed ${V2.plum}`, borderRadius: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: V2.plum,
              display: 'inline-flex', alignItems: 'center' }}>
              Fixed for today
              <span style={{ color: V2.mute, fontWeight: 500, fontSize: 12,
                marginLeft: 6 }}>
                (subtracted from targets, not variables)
              </span>
              <InfoDot tip="Items you know you'll eat at a fixed serving — e.g. today's fruit or condiments. Their AA contribution is subtracted from the daily targets before the LP runs." />
            </span>
            <span style={{ fontSize: 11, color: V2.mute,
              fontFamily: V2.mono }}>
              {fixed.size} added
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CATEGORIES.filter(c => c.startsWith('Fixed')).flatMap(cat =>
              (byCat[cat] || []).map(f => (
                <FoodChip key={f.id} food={f}
                  grams={fixed.has(f.id) ? f.serving : null}
                  selected={fixed.has(f.id)}
                  onClick={() => toggle(fixed, setFixed)(f.id)} />
              )))}
          </div>
        </div>

        {/* extra constraints */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8,
            display: 'inline-flex', alignItems: 'center' }}>
            Extra constraints
            <span style={{ color: V2.mute, fontWeight: 500, fontSize: 12,
              marginLeft: 6 }}>(optional)</span>
            <InfoDot tip="Extra linear constraints layered on top of the nine AA floors. Most shift the feasible region; a couple change the objective (e.g. 'balanced' min-maxes surplus instead of min-cost)." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 8 }}>
            {EXTRA_CONSTRAINTS.map(c => {
              const on = extras.has(c.id);
              return (
                <button key={c.id}
                  onClick={() => toggle(extras, setExtras)(c.id)}
                  style={{ display: 'flex', alignItems: 'flex-start',
                    gap: 10, padding: '10px 12px', textAlign: 'left',
                    background: on ? V2.stickerC : '#fff',
                    border: `1.5px solid ${on ? V2.sage : V2.rule}`,
                    borderRadius: 4, cursor: 'pointer',
                    fontFamily: V2.font, color: V2.ink }}>
                  <div style={{ width: 18, height: 18, marginTop: 2,
                    border: `1.5px solid ${on ? V2.sage : V2.mute}`,
                    background: on ? V2.sage : 'transparent',
                    borderRadius: 3, display: 'grid', placeItems: 'center',
                    color: '#fff', fontSize: 13, fontWeight: 900,
                    flexShrink: 0 }}>
                    {on ? '✓' : ''}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>
                      {c.label}
                    </div>
                    <div style={{ fontSize: 11, color: V2.mute,
                      marginTop: 2 }}>
                      {c.hint}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* solve button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14,
          flexWrap: 'wrap' }}>
          <button onClick={onSolve}
            disabled={solving || selected.size === 0}
            style={{ padding: '10px 22px', background: V2.tomato,
              color: '#fff', border: 'none', borderRadius: 2,
              fontFamily: V2.font, fontSize: 14, fontWeight: 800,
              letterSpacing: 0.3, cursor: solving ? 'wait' : 'pointer',
              boxShadow: '0 2px 0 #8a2e1b, 0 4px 10px rgba(201,75,52,0.3)',
              opacity: selected.size === 0 ? 0.4 : 1,
              transform: solving ? 'translateY(2px)' : 'none',
              transition: 'transform .1s' }}>
            {solving ? 'solving…' : '▶ run solver'}
          </button>
          <span style={{ fontSize: 12, color: V2.mute, fontFamily: V2.mono }}>
            min cᵀx  s.t.  Ax ≥ b,  x ≥ 0
          </span>
        </div>
      </Sticker>

      {/* receipt output */}
      {result && <Receipt result={result} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Receipt — prints once after solve, with a tear-in animation
// ─────────────────────────────────────────────────────────────
// Build a CSV receipt covering every food in the meal. Columns include
// all macro fields + the full amino acid panel (essentials plus any
// non-essentials present in the extended data) + micros. Rows pulled
// lazily from FOODS_EXTENDED where available so core visitors never
// paid for the extra bytes.
async function downloadReceiptCSV(result) {
  const ext = await loadExtendedFoods();
  const resolve = id =>
    (ext && ext.find(f => f.id === id)) || foodById(id);

  const items = [
    ...Object.entries(result.meal || {})
      .map(([id, g]) => ({ id, grams: g, source: 'food' })),
    ...Object.entries(result.supplements || {})
      .map(([id, g]) => ({ id, grams: g, source: 'supplement' })),
  ].filter(it => it.grams > 0);

  // Collect every numeric column seen across resolved foods.
  const macroKeys = new Set(['cost','protein','fat','carbs','fiber','kcal']);
  const aminoKeys = new Set();
  const microKeys = new Set();
  items.forEach(it => {
    const f = resolve(it.id); if (!f) return;
    Object.keys(f).forEach(k => {
      if (['id','cat','name','emoji','amino','source','notes','fdc',
           'state','pairId','supplement','scalable','serving','aaKey',
           'baseCost','key'].includes(k)) return;
      if (typeof f[k] === 'number') {
        if (macroKeys.has(k)) return;
        microKeys.add(k);
      }
    });
    if (f.amino) Object.keys(f.amino).forEach(k => aminoKeys.add(k));
  });
  const orderedAmino = [
    ...EAA.map(a => a.key).filter(k => aminoKeys.has(k)),
    ...[...aminoKeys].filter(k => !EAA.some(a => a.key === k)).sort(),
  ];
  const orderedMicro = [...microKeys].sort();

  const header = ['source','id','name','cat','grams',
    ...[...macroKeys], ...orderedAmino.map(k => `aa_${k}`),
    ...orderedMicro];
  const escape = v => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = [header.join(',')];
  items.forEach(it => {
    const f = resolve(it.id);
    if (!f) { rows.push([it.source, it.id, '', '', it.grams].join(',')); return; }
    const s = it.grams / 100;
    const cells = [it.source, f.id, escape(f.name || ''), escape(f.cat || ''),
      it.grams];
    [...macroKeys].forEach(k => {
      const v = f[k];
      cells.push(v == null ? '' : (v * s).toFixed(3));
    });
    orderedAmino.forEach(k => {
      const v = f.amino && f.amino[k];
      cells.push(v == null ? '' : (v * s).toFixed(2));
    });
    orderedMicro.forEach(k => {
      const v = f[k];
      cells.push(v == null ? '' : (v * s).toFixed(3));
    });
    rows.push(cells.join(','));
  });

  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `amino-receipt-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Receipt({ result }) {
  const [printed, setPrinted] = React.useState(0);
  const [csvBusy, setCsvBusy] = React.useState(false);
  React.useEffect(() => {
    setPrinted(0);
    const id = setInterval(() => {
      setPrinted(p => p >= 1 ? 1 : Math.min(1, p + 0.06));
    }, 40);
    return () => clearInterval(id);
  }, [result]);

  const onDownload = async () => {
    if (csvBusy) return;
    setCsvBusy(true);
    try { await downloadReceiptCSV(result); }
    finally { setCsvBusy(false); }
  };

  const items = Object.entries(result.meal)
    .map(([id, g]) => ({ food: foodById(id), grams: g }))
    .filter(it => it.food && it.grams > 0)
    .sort((a, b) => b.grams - a.grams);

  const suppItems = Object.entries(result.supplements || {})
    .map(([id, g]) => ({ food: foodById(id), grams: g }))
    .filter(it => it.food && it.grams > 0.05)
    .sort((a, b) => b.grams - a.grams);

  const h = printed * (780 + suppItems.length * 16);
  return (
    <div style={{ position: 'relative', marginTop: 24,
      display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: -4, left: '50%',
        transform: 'translateX(-50%)',
        width: 340, height: 10, background: V2.ink,
        borderRadius: 2, zIndex: 3,
        boxShadow: '0 2px 6px rgba(0,0,0,0.15) inset' }}/>
      <div style={{ width: 340, overflow: 'hidden',
        maxHeight: h, transition: 'max-height .06s linear',
        background: '#fffdf5',
        boxShadow: '0 2px 2px rgba(0,0,0,0.06), 0 8px 22px rgba(60,40,20,0.18)',
        fontFamily: V2.mono, fontSize: 11, color: V2.ink,
        padding: '20px 22px 0',
        position: 'relative' }}>
        <div style={{ textAlign: 'center', borderBottom: `1px dashed ${V2.rule}`,
          paddingBottom: 10, marginBottom: 12 }}>
          <div style={{ fontFamily: V2.font, fontWeight: 800, fontSize: 15,
            letterSpacing: 1 }}>
            OPTIMIZE AMINO
          </div>
          <div style={{ color: V2.mute }}>solver receipt · {new Date().toLocaleDateString()}</div>
          <div style={{ color: V2.mute }}>pattern: {PATTERNS[result.pattern].label}</div>
        </div>

        {items.map(it => (
          <div key={it.food.id} style={{ display: 'flex',
            justifyContent: 'space-between', padding: '2px 0' }}>
            <span>{it.food.emoji}&nbsp;{it.food.name.toUpperCase()}</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
              {it.grams} g  &nbsp; ${((it.food.cost * it.grams) / 100).toFixed(2)}
            </span>
          </div>
        ))}

        {/* Supplements block — only when LP had to reach for them */}
        {suppItems.length > 0 && (
          <>
            <div style={{ borderTop: `1px dashed ${V2.rule}`,
              margin: '8px 0 4px', paddingTop: 6, fontSize: 10,
              color: V2.tomato, letterSpacing: 1 }}>
              SHORTFALL · SUPPLEMENTS
            </div>
            {suppItems.map(it => (
              <div key={it.food.id} style={{ display: 'flex',
                justifyContent: 'space-between', padding: '2px 0',
                color: V2.tomato }}>
                <span>{it.food.emoji}&nbsp;{it.food.name.toUpperCase()}</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {it.grams.toFixed(1)} g  &nbsp; ${((it.food.cost *
                    (result.supplementMultiplier || 1) * it.grams) / 100).toFixed(2)}
                </span>
              </div>
            ))}
            <div style={{ fontSize: 9, color: V2.mute, marginTop: 2,
              fontStyle: 'italic' }}>
              pantry couldn't cover these AAs; add a high-{suppItems[0].food.aaKey}
              {' '}food to replace.
            </div>
          </>
        )}

        <div style={{ borderTop: `1px dashed ${V2.rule}`, margin: '10px 0',
          paddingTop: 8, display: 'flex', justifyContent: 'space-between',
          fontWeight: 700 }}>
          <span>TOTAL</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            ${result.cost.toFixed(2)}
          </span>
        </div>
        <div style={{ borderTop: `1px dashed ${V2.rule}`, margin: '8px 0 6px',
          paddingTop: 6, fontSize: 10, color: V2.mute, letterSpacing: 1 }}>
          MACROS
        </div>
        <MacroLine label="energy"  value={`${Math.round(result.kcal || 0)} kcal`} />
        <MacroLine label="protein" value={`${(result.protein||0).toFixed(1)} g`} />
        <MacroLine label="carbs"   value={`${(result.carbs  ||0).toFixed(1)} g`} />
        <MacroLine label="fiber"   value={`${(result.fiber  ||0).toFixed(1)} g`} />
        <MacroLine label="fat"     value={`${(result.fat    ||0).toFixed(1)} g`} />
        <MacroLine label="mass"    value={`${Math.round(result.mass || 0)} g`} />
        <div style={{ display: 'flex', justifyContent: 'space-between',
          color: V2.mute, padding: '2px 0' }}>
          <span>limiting AA</span>
          <span>{result.limiting.key} · {Math.round(result.coverage[result.limiting.key]*100)}%</span>
        </div>
        {result.status && result.status !== 'optimal' && (
          <div style={{ color: V2.tomato, fontSize: 10, marginTop: 4,
            textTransform: 'uppercase', letterSpacing: 1 }}>
            solver: {result.status}
          </div>
        )}

        <div style={{ borderTop: `1px dashed ${V2.rule}`, margin: '10px 0',
          paddingTop: 10 }}>
          <div style={{ fontSize: 10, color: V2.mute, letterSpacing: 1,
            marginBottom: 6, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 10 }}>
            <span>AMINO COVERAGE</span>
            {Object.keys(result.supplements || {}).length > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center',
                gap: 6, textTransform: 'none', letterSpacing: 0 }}>
                <span style={{ width: 10, height: 10, background: V2.plum,
                  opacity: 0.85, display: 'inline-block' }}/>
                <span style={{ color: V2.mute, fontFamily: V2.mono,
                  fontSize: 10 }}>= filled by supplement</span>
              </span>
            )}
          </div>
          <AminoBars coverage={result.coverage} limiting={result.limiting}
            targets={result.targets} totals={result.aminoTotals}
            foodTotals={result.foodAminoTotals} compact/>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center',
          margin: '10px 0 6px' }}>
          <button onClick={onDownload} disabled={csvBusy}
            style={{ padding: '7px 14px', background: '#fff',
              border: `1.5px solid ${V2.ink}`, borderRadius: 3,
              fontFamily: V2.mono, fontSize: 11, fontWeight: 700,
              letterSpacing: 1, color: V2.ink, cursor: csvBusy ? 'wait' : 'pointer',
              textTransform: 'uppercase' }}>
            {csvBusy ? 'building…' : '↓ download full receipt · csv'}
          </button>
        </div>
        <div style={{ textAlign: 'center', fontSize: 9, color: V2.mute,
          fontStyle: 'italic', marginBottom: 4 }}>
          full AA panel + micros from the extended dataset
        </div>

        <div style={{ height: 12, marginTop: 14,
          background: `linear-gradient(135deg, transparent 48%, #fffdf5 50%) bottom/8px 12px repeat-x,
                       linear-gradient(-135deg, transparent 48%, #fffdf5 50%) bottom/8px 12px repeat-x` }}/>
        <div style={{ marginTop: -12, height: 12,
          backgroundImage: 'linear-gradient(135deg, #fffdf5 48%, transparent 52%), linear-gradient(225deg, #fffdf5 48%, transparent 52%)',
          backgroundSize: '16px 12px',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: '0 0, 8px 0',
        }}/>
        <div style={{ textAlign: 'center', fontFamily: V2.hand,
          color: V2.mute, fontSize: 16, padding: '4px 0 16px' }}>
          thanks for optimizing ✂︎
        </div>
      </div>
    </div>
  );
}

function MacroLine({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between',
      color: V2.mute, padding: '1px 0', fontVariantNumeric: 'tabular-nums' }}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

Object.assign(window, { MiniTool, Receipt, MacroLine, BodyTargetPanel, PantryPicker });
