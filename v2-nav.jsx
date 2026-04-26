// v2-nav.jsx — Shared top navigation bar used across pages.

const NAV_LINKS = [
  { href: 'index.html',          label: 'Essay',          short: 'essay' },
  { href: 'solver.html',         label: 'Solver',         short: 'solve' },
  { href: 'grains.html',         label: 'Grains',         short: 'grains' },
  { href: 'legumes.html',        label: 'Legumes',        short: 'legumes' },
  { href: 'protein-powder.html', label: 'Protein powder', short: 'powder' },
  { href: 'milk.html',           label: 'Plant milks',    short: 'milk' },
  { href: 'seitan.html',         label: 'Seitan',         short: 'seitan' },
];

function TopNav({ current }) {
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 20,
      background: V2.paper, borderBottom: `1px solid ${V2.rule}`,
      padding: '12px 24px', display: 'flex', alignItems: 'center',
      gap: 18, flexWrap: 'wrap',
      fontFamily: V2.font }}>
      <a href="index.html" style={{ display: 'inline-flex', alignItems: 'center',
        gap: 8, textDecoration: 'none', color: V2.ink }}>
        <div style={{ width: 24, height: 24, background: V2.tomato,
          borderRadius: '50%', display: 'grid', placeItems: 'center',
          color: '#fff', fontSize: 13, fontWeight: 800 }}>A</div>
        <span style={{ fontSize: 13, letterSpacing: 1.5,
          textTransform: 'uppercase', fontWeight: 800 }}>
          Optimize Amino
        </span>
      </a>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap',
        marginLeft: 'auto' }}>
        {NAV_LINKS.map(l => {
          const on = current === l.short;
          return (
            <a key={l.short} href={l.href}
              style={{ color: on ? V2.tomato : V2.ink,
                fontWeight: on ? 800 : 600, textDecoration: 'none',
                fontSize: 13, letterSpacing: 0.2,
                borderBottom: on ? `2px solid ${V2.tomato}` : '2px solid transparent',
                paddingBottom: 2 }}>
              {l.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

Object.assign(window, { TopNav, NAV_LINKS });
