// v2-footer.jsx — Shared site footer rendered on every page.
// Mirrors TopNav's link list, plus a repo link and a small colophon.

const FOOTER_SECTIONS = [
  {
    title: 'Tools',
    links: [
      { href: 'index.html',  label: 'Essay (intro)',          short: 'essay' },
      { href: 'solver.html', label: 'Solver — all options',   short: 'solve' },
      { href: 'simple.html', label: 'Simple solver — accessible', short: 'simple' },
    ],
  },
  {
    title: 'Pantry guides',
    links: [
      { href: 'grains.html',         label: 'Grains',         short: 'grains' },
      { href: 'legumes.html',        label: 'Legumes',        short: 'legumes' },
      { href: 'protein-powder.html', label: 'Protein powder', short: 'powder' },
      { href: 'milk.html',           label: 'Plant milks',    short: 'milk' },
      { href: 'seitan.html',         label: 'Seitan',         short: 'seitan' },
    ],
  },
  {
    title: 'Project',
    links: [
      { href: 'https://github.com/Chase-Projects/optimize_amino',
        label: 'Source on GitHub', external: true },
      { href: 'https://github.com/Chase-Projects/optimize_amino/issues',
        label: 'Issues / requests', external: true },
    ],
  },
];

function SiteFooter({ current }) {
  return (
    <footer style={{ background: V2.ink, color: V2.paper,
      fontFamily: V2.font, padding: '40px 32px 28px', marginTop: 60 }}
      role="contentinfo" aria-label="Site footer">
      <div style={{ maxWidth: 1000, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 28 }}>
        {FOOTER_SECTIONS.map(sec => (
          <div key={sec.title}>
            <div style={{ fontSize: 11, letterSpacing: 1.6,
              textTransform: 'uppercase', color: V2.mustard,
              fontWeight: 800, marginBottom: 12 }}>
              {sec.title}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0,
              display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sec.links.map(l => {
                const on = current && l.short === current;
                return (
                  <li key={l.href}>
                    <a href={l.href}
                      {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      aria-current={on ? 'page' : undefined}
                      style={{ color: on ? V2.mustard : V2.paper,
                        textDecoration: on ? 'underline' : 'none',
                        fontSize: 14, fontWeight: on ? 700 : 500,
                        borderBottom: on ? `1px solid ${V2.mustard}` : '1px solid transparent',
                        paddingBottom: 1 }}>
                      {l.label}
                      {l.external && (
                        <span aria-hidden="true" style={{ marginLeft: 4,
                          fontSize: 11, color: V2.mute2 }}>↗</span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1000, margin: '28px auto 0',
        paddingTop: 18, borderTop: `1px solid ${V2.mute}`,
        display: 'flex', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
        fontSize: 12, color: V2.mute2 }}>
        <div>
          <strong style={{ color: V2.paper }}>Optimize Amino</strong>
          {' · '}a linear-programming sketch of vegan protein.
        </div>
        <div style={{ fontFamily: V2.mono }}>
          static · React + Babel from CDN · MIT
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { SiteFooter, FOOTER_SECTIONS });
