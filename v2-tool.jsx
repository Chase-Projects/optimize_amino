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

function PantryPicker({ selected, fixed, onToggle, onAddFixed, onRemoveFixed, preferDry, onPreferDryChange, mode }) {
  const isSolver = mode === 'solver';
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

  // Canonical pair key: pairs share a key regardless of which side carries
  // the `pairId` field. Cooked variants typically have no pairId; their dry
  // partner points at them. Resolve either side to the same key.
  const pairKeyOf = f => {
    if (f.pairId) return [f.id, f.pairId].sort().join('|');
    const partner = FOODS.find(x => x.pairId === f.id);
    return partner ? [f.id, partner.id].sort().join('|') : f.id;
  };

  // For a chip, pick cooked/dry variant based on toggle when a pair exists.
  const preferredVariant = f => {
    const partnerId = f.pairId || (FOODS.find(x => x.pairId === f.id) || {}).id;
    if (!partnerId) return f;
    const partner = FOODS.find(x => x.id === partnerId);
    if (!partner) return f;
    if (preferDry) return f.state === 'dry' ? f : (partner.state === 'dry' ? partner : f);
    return f.state === 'dry' ? partner : f;
  };

  // Common food set, de-duped by pair (show one per pair — the preferred form).
  const commonChips = (() => {
    const seenPairs = new Set();
    const out = [];
    FOODS.forEach(raw => {
      if (raw.supplement) return;
      if (!COMMON_FOODS.has(raw.id) && !(raw.pairId && COMMON_FOODS.has(raw.pairId))) return;
      const key = pairKeyOf(raw);
      if (seenPairs.has(key)) return;
      seenPairs.add(key);
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
  // Includes ALL non-supplement foods regardless of `scalable` — every food
  // can be added as a pantry (LP) variable or as a fixed per-serving entry.
  // De-duped by id so extended can't shadow core entries.
  const q = query.trim().toLowerCase();
  const matches = f => !!f && !f.supplement &&
    (isSolver || f.tag !== 'macro') &&
    (((f.name || '').toLowerCase().includes(q)) ||
     ((f.cat  || '').toLowerCase().includes(q)));
  const coreHits = q ? FOODS.filter(matches) : [];
  const ext = window.FOODS_EXTENDED || [];
  const seenIds = new Set(coreHits.map(f => f.id));
  const extHits = q ? ext.filter(f => !seenIds.has(f.id) && matches(f)) : [];
  const allHits = [...coreHits, ...extHits];

  // Group results by category, preserving CATEGORIES display order.
  // Unknown cats fall through to a trailing "Other" bucket.
  const resultsByCat = (() => {
    const byCat = {};
    allHits.forEach(f => { (byCat[f.cat] = byCat[f.cat] || []).push(f); });
    const ordered = CATEGORIES.filter(c => c !== 'Supplement' && byCat[c])
      .map(c => [c, byCat[c]]);
    const knownSet = new Set(CATEGORIES);
    Object.entries(byCat).forEach(([c, list]) => {
      if (!knownSet.has(c)) ordered.push([c, list]);
    });
    return ordered;
  })();
  const totalHits = allHits.length;

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
        {totalHits > 0 && (
          <div style={{ marginTop: 8, maxHeight: 280, overflowY: 'auto',
            background: '#fff', border: `1px solid ${V2.rule}`, borderRadius: 3,
            position: 'relative' }}>
            {resultsByCat.map(([cat, list]) => {
              const tone = (typeof CAT_TONE !== 'undefined' && CAT_TONE[cat]) || null;
              return (
                <div key={cat}>
                  <div style={{ position: 'sticky', top: 0, zIndex: 1,
                    padding: '4px 10px', fontFamily: V2.mono, fontSize: 10,
                    letterSpacing: 1.4, textTransform: 'uppercase',
                    color: tone ? tone.ink : V2.mute2,
                    background: tone ? tone.tint : V2.stickerA,
                    borderBottom: `1px solid ${V2.rule}`, fontWeight: 700 }}>
                    {cat}
                    <span style={{ marginLeft: 8, fontWeight: 500,
                      letterSpacing: 0, textTransform: 'none', opacity: 0.7 }}>
                      {list.length}
                    </span>
                  </div>
                  {list.map(f => {
                    const isPantry = selected.has(f.id);
                    const isFixed  = fixed && fixed.has(f.id);
                    const canScale = f.scalable !== false;
                    return (
                      <div key={f.id}
                        style={{ display: 'flex', alignItems: 'center', gap: 10,
                          padding: '6px 10px',
                          background: (isPantry || isFixed) ? V2.stickerA : '#fff',
                          borderBottom: `1px solid ${V2.rule}`,
                          fontFamily: V2.font, fontSize: 13 }}>
                        <span style={{ fontSize: 16 }}>{f.emoji}</span>
                        <span style={{ fontWeight: 600, flex: 1 }}>
                          {f.name}
                          {!canScale && (
                            <span style={{ marginLeft: 6, fontFamily: V2.mono,
                              fontSize: 9, letterSpacing: 0.6,
                              textTransform: 'uppercase', color: V2.plum,
                              border: `1px solid ${V2.plum}`, padding: '0 4px',
                              borderRadius: 2 }}>
                              per serving
                            </span>
                          )}
                        </span>
                        <span style={{ fontFamily: V2.mono, fontSize: 11,
                          color: V2.mute }}>
                          ${(f.cost || 0).toFixed(2)}/100g
                        </span>
                        <button onClick={() => onToggle(f.id)}
                          disabled={!canScale}
                          title={canScale ? 'Add to pantry (LP variable)' :
                            'This food is per-serving only'}
                          style={{ padding: '4px 8px', fontSize: 11,
                            fontFamily: V2.mono, fontWeight: 700,
                            background: isPantry ? V2.sage : '#fff',
                            color: isPantry ? '#fff' :
                              (canScale ? V2.ink : V2.mute),
                            border: `1px solid ${isPantry ? V2.sage : V2.rule}`,
                            borderRadius: 3, cursor: canScale ? 'pointer' : 'not-allowed',
                            opacity: canScale ? 1 : 0.45 }}>
                          {isPantry ? '✓ pantry' : '+ pantry'}
                        </button>
                        <button onClick={() => {
                          if (isFixed) onRemoveFixed && onRemoveFixed(f.id);
                          else onAddFixed && onAddFixed(f.id);
                        }}
                          title="Add as a fixed serving (subtracted from targets)"
                          style={{ padding: '4px 8px', fontSize: 11,
                            fontFamily: V2.mono, fontWeight: 700,
                            background: isFixed ? V2.plum : '#fff',
                            color: isFixed ? '#fff' : V2.ink,
                            border: `1px solid ${isFixed ? V2.plum : V2.rule}`,
                            borderRadius: 3, cursor: 'pointer' }}>
                          {isFixed ? '✓ fixed' : '+ fixed'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
        {query && !totalHits && (
          <div style={{ fontSize: 12, color: V2.mute, marginTop: 8,
            fontStyle: 'italic' }}>
            no matches.
          </div>
        )}
      </div>
    </div>
  );
}

// Macro constraints panel — solver-page only. Toggle adds kcal/fat/carbs
// /fiber/protein bounds to the LP; "Use pattern defaults" prefills from
// the active pattern's macros table. Empty fields are ignored.
function MacroConstraintsPanel({ on, setOn, macros, setMacros, pattern }) {
  const defaults = (PATTERNS[pattern] && PATTERNS[pattern].macros) || null;
  const fields = [
    { axis: 'Calories',  unit: 'kcal', minK: 'kcalMin',    maxK: 'kcalMax' },
    { axis: 'Fat',       unit: 'g',    minK: 'fatMin',     maxK: 'fatMax' },
    { axis: 'Carbs',     unit: 'g',    minK: 'carbsMin',   maxK: 'carbsMax' },
    { axis: 'Fiber',     unit: 'g',    minK: 'fiberMin',   maxK: null },
    { axis: 'Protein',   unit: 'g',    minK: null,         maxK: 'proteinMax' },
  ];
  const update = (k, v) => setMacros({ ...macros, [k]: v });
  const usePatternDefaults = () => {
    if (!defaults) return;
    setMacros(Object.fromEntries(Object.entries(defaults).map(([k, v]) => [k, String(v)])));
  };
  return (
    <div style={{ marginBottom: 18, padding: '12px 14px',
      background: 'rgba(74, 106, 130, 0.05)',
      border: `1px dashed ${V2.ocean}`, borderRadius: 2 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: on ? 10 : 0 }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: V2.ocean,
          display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" checked={on}
            onChange={e => setOn(e.target.checked)}
            style={{ marginRight: 8 }} />
          Macro constraints
          <span style={{ color: V2.mute, fontWeight: 500, fontSize: 12,
            marginLeft: 6 }}>(kcal · fat · carbs · fiber · protein cap)</span>
          <InfoDot tip="When on, the LP must hit the per-day macro bounds you specify in addition to the AA targets. Empty fields are ignored. Olive oil / MCT / sugar / psyllium husk are good feasibility-fillers." />
        </label>
        {on && (
          <button onClick={usePatternDefaults}
            disabled={!defaults}
            style={{ padding: '4px 10px', fontSize: 11, fontFamily: V2.mono,
              fontWeight: 700, background: '#fff',
              color: defaults ? V2.ocean : V2.mute,
              border: `1px solid ${defaults ? V2.ocean : V2.rule}`,
              borderRadius: 3, cursor: defaults ? 'pointer' : 'not-allowed' }}>
            use pattern defaults
          </button>
        )}
      </div>
      {on && (
        <div style={{ display: 'grid',
          gridTemplateColumns: '90px 1fr 1fr 50px',
          gap: '6px 12px', alignItems: 'center', fontSize: 12 }}>
          <div></div>
          <div style={{ fontFamily: V2.mono, fontSize: 10, color: V2.mute2,
            textTransform: 'uppercase', letterSpacing: 1 }}>min</div>
          <div style={{ fontFamily: V2.mono, fontSize: 10, color: V2.mute2,
            textTransform: 'uppercase', letterSpacing: 1 }}>max</div>
          <div></div>
          {fields.map(({ axis, unit, minK, maxK }) => (
            <React.Fragment key={axis}>
              <div style={{ fontWeight: 600 }}>{axis}</div>
              <input type="number" placeholder={minK ? '—' : 'n/a'}
                disabled={!minK}
                value={minK ? (macros[minK] ?? '') : ''}
                onChange={e => minK && update(minK, e.target.value)}
                style={{ padding: '5px 8px', fontFamily: V2.mono, fontSize: 12,
                  border: `1px solid ${V2.rule}`, borderRadius: 3,
                  background: minK ? '#fff' : 'rgba(0,0,0,0.04)' }}/>
              <input type="number" placeholder={maxK ? '—' : 'n/a'}
                disabled={!maxK}
                value={maxK ? (macros[maxK] ?? '') : ''}
                onChange={e => maxK && update(maxK, e.target.value)}
                style={{ padding: '5px 8px', fontFamily: V2.mono, fontSize: 12,
                  border: `1px solid ${V2.rule}`, borderRadius: 3,
                  background: maxK ? '#fff' : 'rgba(0,0,0,0.04)' }}/>
              <div style={{ fontFamily: V2.mono, fontSize: 11, color: V2.mute }}>
                {unit}
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

function MiniTool({ initial, mode }) {
  const isSolver = mode === 'solver';
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
  // Macro constraints — solver-only. Off by default; "Use pattern defaults"
  // pre-fills from the active pattern's `macros` table. Empty string = unset.
  const [macroOn, setMacroOn] = React.useState(false);
  const [macros, setMacros] = React.useState({});
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
      // Filter out empty/blank macro fields before passing to LP.
      const activeMacros = (isSolver && macroOn)
        ? Object.fromEntries(Object.entries(macros).filter(
            ([_, v]) => v !== '' && v != null && !Number.isNaN(+v)
          ).map(([k, v]) => [k, +v]))
        : null;
      const r = mockSolve({
        pantryIds: [...selected],
        fixedIds: [...fixed],
        pattern,
        extras: [...extras],
        supplementMultiplier: body.multiplier,
        opts: buildOpts(),
        macros: activeMacros,
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
        <PantryPicker
          mode={mode}
          selected={selected}
          fixed={fixed}
          onToggle={id => {
            // Adding to pantry should remove from fixed (mutually exclusive).
            if (fixed.has(id)) {
              const next = new Set(fixed); next.delete(id); setFixed(next);
            }
            togglePaired(selected, setSelected)(id);
          }}
          onAddFixed={id => {
            // Adding as fixed should remove from pantry (mutually exclusive).
            if (selected.has(id)) {
              const next = new Set(selected); next.delete(id); setSelected(next);
            }
            const next = new Set(fixed); next.add(id); setFixed(next);
          }}
          onRemoveFixed={id => {
            const next = new Set(fixed); next.delete(id); setFixed(next);
          }}
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
            {[...fixed].map(id => foodById(id)).filter(Boolean).map(f => (
              <FoodChip key={f.id} food={f}
                grams={f.serving}
                selected={true}
                onClick={() => toggle(fixed, setFixed)(f.id)} />
            ))}
            {fixed.size === 0 && (
              <span style={{ fontSize: 12, color: V2.mute, fontStyle: 'italic' }}>
                Add fixed servings via the search box above.
              </span>
            )}
          </div>
        </div>

        {/* macro constraints — solver page only */}
        {isSolver && (
          <MacroConstraintsPanel
            on={macroOn} setOn={setMacroOn}
            macros={macros} setMacros={setMacros}
            pattern={pattern}
          />
        )}

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

// Receipt — B2 (Nutrition-Label) design.
// Replaces the older thermal receipt. Same data, completely different chrome.
function Receipt({ result }) {
  const [csvBusy, setCsvBusy] = React.useState(false);

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

  const allItems = [
    ...items.map(it => ({ ...it, kind: 'food' })),
    ...suppItems.map(it => ({ ...it, kind: 'supp' })),
  ];

  const ink = '#000', mute = '#555';
  const greenOK = '#5e8a4a', tomato = '#c94b34', plum = '#7a4a5a';
  const dashRule = '1px dashed #b8b8b8';
  const blackRule = `4px solid ${ink}`;
  const totalMass = Math.round(result.mass || 0);
  const limKey = result.limiting.key;
  const catFor = (food) => food.supplement
    ? 'Supplement'
    : (food.scalable === false ? 'Fixed' : food.cat);

  return (
    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: 380, background: '#fff', color: ink,
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        padding: '14px 16px', border: `2px solid ${ink}`,
        boxShadow: '0 6px 22px rgba(0,0,0,0.10)' }}>

        <div style={{ fontWeight: 900, fontSize: 28, letterSpacing: -0.5,
          lineHeight: 1, borderBottom: `8px solid ${ink}`, paddingBottom: 4 }}>
          Solver Facts
        </div>

        {/* Pattern + total grams */}
        <div style={{ display: 'flex', justifyContent: 'space-between',
          fontSize: 11, padding: '4px 0', borderBottom: `1px solid ${ink}` }}>
          <span>pattern: <b>{PATTERNS[result.pattern].label}</b></span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            {totalMass}<b style={{ fontSize: 11, marginLeft: 2 }}>g</b>
          </span>
        </div>

        {/* Daily cost */}
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'baseline', padding: '8px 0', borderBottom: blackRule }}>
          <span style={{ fontWeight: 800, fontSize: 14 }}>Daily cost</span>
          <span style={{ fontWeight: 900, fontSize: 30, letterSpacing: -0.5,
            fontVariantNumeric: 'tabular-nums' }}>
            ${result.cost.toFixed(2)}
          </span>
        </div>

        {/* Ingredients */}
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'baseline', padding: '6px 0',
          borderBottom: `1px solid ${ink}` }}>
          <span style={{ fontWeight: 800, fontSize: 13 }}>Ingredients</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: mute,
            letterSpacing: 0.5 }}>cost</span>
        </div>
        {allItems.map((it, i) => {
          const isSupp = it.kind === 'supp';
          const dollars = isSupp
            ? (it.food.cost * (result.supplementMultiplier || 1) * it.grams) / 100
            : (it.food.cost * it.grams) / 100;
          const last = i === allItems.length - 1;
          const cat = catFor(it.food);
          const tone = (window.CAT_TONE && window.CAT_TONE[cat]) || { tint: '#eee', solid: '#999' };
          return (
            <div key={it.food.id} style={{ display: 'grid',
              gridTemplateColumns: '20px 1fr auto auto', gap: 8,
              padding: '5px 0',
              borderBottom: last ? 'none' : dashRule,
              alignItems: 'center', fontSize: 13,
              color: isSupp ? plum : ink }}>
              <span style={{ width: 16, height: 16, borderRadius: '50%',
                background: tone.tint,
                border: `1.5px solid ${tone.solid}`, display: 'inline-block' }}/>
              <span style={{ fontWeight: 700 }}>
                {it.food.name}{isSupp && it.food.aaKey ? ` · ${it.food.aaKey}` : ''}
              </span>
              <span style={{ fontVariantNumeric: 'tabular-nums',
                fontWeight: 500, color: isSupp ? plum : '#333' }}>
                {isSupp ? it.grams.toFixed(1) : it.grams}
                <b style={{ fontSize: 11, marginLeft: 2 }}>g</b>
              </span>
              <span style={{ fontVariantNumeric: 'tabular-nums',
                fontWeight: 800, minWidth: 48, textAlign: 'right' }}>
                {dollars.toFixed(2)}
              </span>
            </div>
          );
        })}

        {/* Macros */}
        <div style={{ borderTop: blackRule, marginTop: 6, paddingTop: 6 }}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>
            Macros
          </div>
          <NfMacroLine bold label="Calories" v={Math.round(result.kcal || 0)} u="kcal"/>
          <NfMacroLine bold label="Protein"  v={(result.protein || 0).toFixed(1)} u="g"/>
          <NfMacroLine      label="Carbs"    v={(result.carbs   || 0).toFixed(1)} u="g"/>
          <NfMacroLine      label="Fat"      v={(result.fat     || 0).toFixed(1)} u="g" last/>
        </div>

        {/* Amino acids */}
        <div style={{ borderTop: blackRule, marginTop: 8, paddingTop: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontWeight: 800, fontSize: 13 }}>Amino acids</span>
            <span style={{ fontSize: 11, color: mute }}>
              limiting · <b style={{ color: tomato }}>{limKey}</b>
            </span>
          </div>
          {EAA.map((a, i) => {
            const c  = result.coverage[a.key];
            const t  = result.targets ? result.targets[a.key] : 0;
            const ft = result.foodAminoTotals ? result.foodAminoTotals[a.key] : null;
            const fc = (t > 0 && ft != null) ? Math.min(ft / t, 1.6) : Math.min(c, 1.6);
            const isLim = a.key === limKey;
            const last = i === EAA.length - 1;
            return (
              <div key={a.key} style={{ display: 'grid',
                gridTemplateColumns: '90px 1fr 56px', gap: 8,
                padding: '4px 0',
                borderBottom: last ? 'none' : dashRule,
                alignItems: 'center', fontSize: 12 }}>
                <span style={{ fontWeight: 500,
                  color: isLim ? tomato : ink }}>{a.full}</span>
                <div style={{ height: 10, background: '#eee',
                  position: 'relative', overflow: 'visible' }}>
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0,
                    width: `${(fc / 1.6) * 100}%`,
                    background: isLim ? tomato : greenOK,
                    borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}/>
                  <div style={{ position: 'absolute', top: 0, bottom: 0,
                    left: `${(fc / 1.6) * 100}%`,
                    width: `${Math.max(0,(Math.min(c, 1.6) - fc) / 1.6) * 100}%`,
                    background: plum,
                    borderTopRightRadius: 5, borderBottomRightRadius: 5 }}/>
                  <div style={{ position: 'absolute', top: -3, bottom: -3,
                    left: `${(1/1.6)*100}%`,
                    borderLeft: `1px dashed ${ink}` }}/>
                </div>
                <span style={{ textAlign: 'right', fontWeight: 500,
                  fontVariantNumeric: 'tabular-nums',
                  color: isLim ? tomato : ink, fontSize: 13 }}>
                  {Math.round(c * 100)}%
                </span>
              </div>
            );
          })}
        </div>

        {result.status && result.status !== 'optimal' && (
          <div style={{ color: tomato, fontSize: 10, marginTop: 6,
            textTransform: 'uppercase', letterSpacing: 1 }}>
            solver: {result.status}
          </div>
        )}

        {/* Download */}
        <div style={{ display: 'flex', justifyContent: 'center',
          margin: '12px 0 2px' }}>
          <button onClick={onDownload} disabled={csvBusy}
            style={{ padding: '8px 16px', background: '#fff',
              border: `1.5px solid ${ink}`, borderRadius: 3,
              fontFamily: V2.mono, fontSize: 11, fontWeight: 700,
              letterSpacing: 1, color: ink,
              cursor: csvBusy ? 'wait' : 'pointer',
              textTransform: 'uppercase' }}>
            {csvBusy ? 'building…' : '↓ download full receipt · csv'}
          </button>
        </div>
      </div>
    </div>
  );
}

function NfMacroLine({ label, v, u, bold, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between',
      alignItems: 'baseline', padding: '3px 0',
      borderBottom: last ? 'none' : '1px dashed #b8b8b8' }}>
      <span style={{ fontWeight: bold ? 800 : 500, fontSize: 13 }}>
        {label}
      </span>
      <span>
        <span style={{ fontVariantNumeric: 'tabular-nums',
          fontWeight: 500, fontSize: 14 }}>{v}</span>
        <span style={{ fontWeight: 500, fontSize: 12,
          marginLeft: 2, color: '#222' }}>{u}</span>
      </span>
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
