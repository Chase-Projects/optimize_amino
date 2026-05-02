// v2-ui.jsx — Shared V2 visual primitives: theme, stickers, tape,
// food chips, amino bars. Used by sections and the tool.

const V2 = {
  paper:   '#f2ebdb',
  grid:    'rgba(120, 85, 45, 0.09)',
  gridMajor: 'rgba(120, 85, 45, 0.16)',
  ink:     '#241e17',
  mute:    '#6b5b47',
  mute2:   '#9a8a72',
  rule:    '#c9b894',
  tomato:  '#c94b34',
  mustard: '#d9a441',
  sage:    '#6b8a5a',
  ocean:   '#3a6a7a',
  plum:    '#7a4a5a',
  stickerA:'#fffdf5',
  stickerB:'#ffeed0',
  stickerC:'#e6f0d8',
  stickerD:'#d8e4ea',
  stickerE:'#f2dbd5',
  stickerF:'#ece4d0',
  tape:    'rgba(220, 200, 140, 0.75)',
  tapeBlue:'rgba(155, 180, 195, 0.70)',
  font:    '"Nunito", "Nunito Sans", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  mono:    '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
  // hand: cursive removed — use rounded sans (Nunito) for the same role.
  hand:    '"Nunito", "Nunito Sans", -apple-system, system-ui, sans-serif',
};

function GridBg({ children, width = 900, style = {} }) {
  return (
    <div style={{
      fontFamily: V2.font, color: V2.ink, background: V2.paper,
      backgroundImage: `
        linear-gradient(to right, ${V2.grid} 1px, transparent 1px),
        linear-gradient(to bottom, ${V2.grid} 1px, transparent 1px),
        linear-gradient(to right, ${V2.gridMajor} 1px, transparent 1px),
        linear-gradient(to bottom, ${V2.gridMajor} 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px, 24px 24px, 120px 120px, 120px 120px',
      width, ...style,
    }}>{children}</div>
  );
}

function Tape({ side = 'top', color = 'yellow', length = 96, offset = 0 }) {
  const isH = side === 'top' || side === 'bottom';
  const bg = color === 'blue' ? V2.tapeBlue : V2.tape;
  return (
    <div style={{
      position: 'absolute',
      top:    side === 'top'    ? -11 : side === 'bottom' ? 'unset' : `calc(50% + ${offset}px)`,
      bottom: side === 'bottom' ? -11 : 'unset',
      left:   side === 'left'   ? -14 : side === 'right'  ? 'unset' : `calc(50% + ${offset}px)`,
      right:  side === 'right'  ? -14 : 'unset',
      width:  isH ? length : 28,
      height: isH ? 24 : length,
      transform: isH ? 'translateX(-50%)' : 'translateY(-50%)',
      background: bg,
      backgroundImage: 'linear-gradient(135deg, transparent 48%, rgba(255,255,255,0.3) 50%, transparent 52%)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
      zIndex: 2,
      pointerEvents: 'none',
    }} />
  );
}

function Sticker({ tint = V2.stickerA, rotate = 0, tape, tapeColor, label, kicker, children, style = {} }) {
  // rotation removed — keep the prop for backwards-compat but ignore it.
  return (
    <div style={{ position: 'relative', ...style }}>
      {tape && <Tape side={tape} color={tapeColor} />}
      <div style={{ background: tint, padding: '18px 22px 20px',
        boxShadow: '0 1px 1px rgba(0,0,0,0.04), 0 6px 16px rgba(60,40,20,0.08)',
        border: '1px solid rgba(0,0,0,0.05)',
      }}>
        {(label || kicker) && (
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', marginBottom: 12, gap: 12 }}>
            {label && <div style={{ fontSize: 11, letterSpacing: 1.3,
              textTransform: 'uppercase', color: V2.mute, fontWeight: 700 }}>
              {label}</div>}
            {kicker && <div style={{ fontSize: 11, color: V2.mute2,
              fontFamily: V2.mono, fontVariantNumeric: 'tabular-nums' }}>
              {kicker}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function StickerTag({ emoji, label, tint = V2.stickerB, rotate = 0, size = 'md' }) {
  const pad = size === 'sm' ? '6px 10px' : '8px 14px';
  const fs  = size === 'sm' ? 15 : 17;
  return (
    <div style={{ background: tint, padding: pad,
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 1px 1px rgba(0,0,0,0.04), 0 6px 12px rgba(60,40,20,0.08)',
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: V2.hand, fontSize: fs, color: V2.ink, fontWeight: 700 }}>
      <span style={{ fontSize: fs + 2 }}>{emoji}</span>
      <span>{label}</span>
    </div>
  );
}

// Category → harmonized OKLCH-ish swatch tokens. One color per food
// group; `tint` is the unselected pastel, `solid` is the selected fill.
const CAT_TONE = {
  'Grains':         { tint: '#f3e6c2', solid: '#c89a3a', ink: '#3a2a08' },
  'Legumes':        { tint: '#e3ddc1', solid: '#7a6a3a', ink: '#2a2410' },
  'Soy':            { tint: '#e6efd7', solid: '#6b8a4a', ink: '#1f2c10' },
  'Wheat Gluten':   { tint: '#ead6c0', solid: '#a06a3a', ink: '#3a210c' },
  'Protein Powder': { tint: '#e0e8ee', solid: '#4a6a82', ink: '#10202a' },
  'Nuts/Seeds':     { tint: '#f0d8c8', solid: '#b06a4a', ink: '#3a1808' },
  'Veg':            { tint: '#d8e6d4', solid: '#5a8a5e', ink: '#0e2410' },
  'Fruit':          { tint: '#f4d6dc', solid: '#b85068', ink: '#3a0a18' },
  'Fixed':          { tint: '#ece4d0', solid: '#8a7a4a', ink: '#2a2008' },
  'Supplement':     { tint: '#e6dde6', solid: '#7a4a5a', ink: '#2a1018' },
};
function FoodChip({ food, grams, selected, onClick, variant = 'default' }) {
  const isFixed = food.scalable === false;
  const isSupp  = food.supplement === true;
  const key = isSupp ? 'Supplement' : isFixed ? 'Fixed' : (CAT_TONE[food.cat] ? food.cat : 'Grains');
  const tone = CAT_TONE[key];
  const bg = selected ? tone.solid : tone.tint;
  const fg = selected ? '#fff' : tone.ink;
  return (
    <button onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '7px 12px', background: bg,
        border: `1.5px solid ${selected ? tone.solid : 'rgba(0,0,0,0.06)'}`,
        borderRadius: 999, fontSize: 13,
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: V2.font, color: fg, fontWeight: 600,
        transition: 'background .15s, border-color .15s, color .15s',
        outline: 'none' }}>
      <span style={{ fontSize: 15 }}>{food.emoji}</span>
      <span>{food.name}</span>
      {grams != null && (
        <span style={{ color: selected ? 'rgba(255,255,255,0.85)' : tone.ink,
          fontFamily: V2.mono, fontSize: 11,
          fontVariantNumeric: 'tabular-nums', opacity: 0.8 }}>
          {grams} g
        </span>
      )}
    </button>
  );
}

// AminoBars
//   coverage    — overall %-of-target per AA (food + supplement)
//   foodTotals  — optional mg-from-food per AA; when supplied, the bar
//                 splits into a food portion and a supplement-filled
//                 portion (plum) so the user sees how 100% got hit.
function AminoBars({ coverage, limiting, targets, totals, foodTotals, compact }) {
  const maxScale = 2.2;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 4 : 6 }}>
      {EAA.map(a => {
        const pct = coverage[a.key];
        const isLim = a.key === limiting.key;
        const w = Math.min(pct, maxScale);
        const over = pct >= 1;

        // Supplement-filled fraction of the bar (plum segment).
        const foodPct = foodTotals && targets[a.key] > 0
          ? Math.min(foodTotals[a.key] / targets[a.key], w)
          : w;
        const suppPct = Math.max(0, w - foodPct);

        return (
          <div key={a.key} style={{ display: 'flex', alignItems: 'center',
            gap: 10, fontSize: compact ? 11 : 13 }}>
            <InfoTip tip={a.blurb} placement="right">
              <span style={{ width: 32, fontFamily: V2.mono, color: V2.ink,
                fontWeight: isLim ? 700 : 500, cursor: 'help',
                borderBottom: `1px dotted ${V2.mute2}` }}>{a.key}</span>
            </InfoTip>
            <div style={{ flex: 1, height: compact ? 10 : 14,
              background: 'rgba(0,0,0,0.06)', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0,
                width: `${(foodPct / maxScale) * 100}%`,
                background: isLim ? V2.tomato : (over ? V2.sage : V2.mustard),
                transition: 'width .4s ease',
              }}/>
              {suppPct > 0.005 && (
                <div style={{ position: 'absolute', top: 0, bottom: 0,
                  left: `${(foodPct / maxScale) * 100}%`,
                  width: `${(suppPct / maxScale) * 100}%`,
                  background: V2.plum, opacity: 0.85,
                  borderLeft: `1px solid ${V2.paper}`,
                  transition: 'width .4s ease',
                }}/>
              )}
              <div style={{ position: 'absolute', top: -3, bottom: -3,
                left: `${(1/maxScale)*100}%`, width: 1, opacity: 0.45,
                borderLeft: `1px dashed ${V2.ink}` }}/>
            </div>
            <span style={{ width: compact ? 40 : 52, textAlign: 'right',
              fontFamily: V2.mono, fontVariantNumeric: 'tabular-nums',
              color: isLim ? V2.tomato : V2.ink,
              fontWeight: isLim ? 700 : 500, fontSize: compact ? 11 : 12 }}>
              {Math.round(pct * 100)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function HandNote({ children, style = {}, rotate = -2, color }) {
  return (
    <div style={{ fontFamily: V2.hand, fontSize: 17, fontWeight: 700,
      color: color || V2.tomato, lineHeight: 1.3, ...style }}>
      {children}
    </div>
  );
}

function SectionHead({ num, title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14,
        marginBottom: 10 }}>
        <span style={{ fontFamily: V2.mono, fontSize: 13,
          color: V2.tomato, fontWeight: 700, letterSpacing: 1 }}>§ {num}</span>
        <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.5,
          margin: 0, textWrap: 'balance', lineHeight: 1.15 }}>{title}</h2>
      </div>
      {children && <div style={{ fontSize: 16, maxWidth: 680,
        color: V2.ink }}>{children}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// InfoTip — hover/click tooltip. Use inline or around the ⓘ icon.
// Accessible: keyboard-focusable, dismiss on Esc.
// ─────────────────────────────────────────────────────────────
function InfoTip({ tip, children, placement = 'top' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    const onClickAway = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClickAway);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClickAway);
    };
  }, [open]);

  const pos = placement === 'right'
    ? { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 }
    : placement === 'bottom'
      ? { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 }
      : { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 };

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      {children}
      {open && (
        <span role="tooltip"
          style={{ position: 'absolute', ...pos, zIndex: 30,
            background: V2.ink, color: V2.paper, fontFamily: V2.font,
            fontWeight: 500, fontSize: 12, lineHeight: 1.4,
            padding: '8px 10px', borderRadius: 4, width: 240,
            boxShadow: '0 8px 20px rgba(0,0,0,0.18)', whiteSpace: 'normal',
            pointerEvents: 'none' }}>
          {tip}
        </span>
      )}
    </span>
  );
}

// Small "i" icon with a tooltip — use after labels.
function InfoDot({ tip, placement = 'top' }) {
  return (
    <InfoTip tip={tip} placement={placement}>
      <span style={{ display: 'inline-grid', placeItems: 'center',
        width: 15, height: 15, borderRadius: '50%',
        border: `1.5px solid ${V2.mute2}`, color: V2.mute,
        fontFamily: V2.mono, fontSize: 10, fontWeight: 700,
        marginLeft: 4, cursor: 'help', userSelect: 'none' }}>
        i
      </span>
    </InfoTip>
  );
}

Object.assign(window, {
  V2, GridBg, Tape, Sticker, StickerTag, FoodChip, CAT_TONE,
  AminoBars, HandNote, SectionHead, InfoTip, InfoDot,
});
