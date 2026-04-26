// v2-footer.jsx — Shared site footer rendered on every page.
// One simple row of page links. Two themes:
//   theme="v2"     (default) — paper/ink, matches the editorial site
//   theme="simple" — white/black, matches the accessible page

const FOOTER_LINKS = [
  { href: 'index.html',          label: 'Essay',          short: 'essay'   },
  { href: 'solver.html',         label: 'Solver',         short: 'solve'   },
  { href: 'simple.html',         label: 'Simple',         short: 'simple'  },
  { href: 'grains.html',         label: 'Grains',         short: 'grains'  },
  { href: 'legumes.html',        label: 'Legumes',        short: 'legumes' },
  { href: 'protein-powder.html', label: 'Protein powder', short: 'powder'  },
  { href: 'milk.html',           label: 'Plant milks',    short: 'milk'    },
  { href: 'seitan.html',         label: 'Seitan',         short: 'seitan'  },
];

function SiteFooter({ current, theme = 'v2' }) {
  const isSimple = theme === 'simple';
  const t = isSimple
    ? { bg: '#ffffff', ink: '#111111', mute: '#4a4a4a', accent: '#0046b8',
        rule: '#777777', font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }
    : { bg: V2.paper,  ink: V2.ink,    mute: V2.mute,   accent: V2.tomato,
        rule: V2.rule, font: V2.font };

  return (
    <footer role="contentinfo" aria-label="Site footer"
      style={{ background: t.bg, color: t.ink, fontFamily: t.font,
        borderTop: `${isSimple ? 2 : 1}px solid ${t.rule}`,
        marginTop: 60, padding: '20px 24px' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 auto',
        maxWidth: 1000, display: 'flex', flexWrap: 'wrap',
        gap: '8px 22px', justifyContent: 'center' }}>
        {FOOTER_LINKS.map(l => {
          const on = current && l.short === current;
          return (
            <li key={l.href}>
              <a href={l.href}
                aria-current={on ? 'page' : undefined}
                style={{ color: on ? t.accent : t.ink,
                  fontSize: 14, fontWeight: on ? 700 : 500,
                  textDecoration: on ? 'none' : 'underline',
                  textDecorationColor: t.rule, textUnderlineOffset: 3,
                  borderBottom: on ? `2px solid ${t.accent}` : '2px solid transparent',
                  paddingBottom: 1 }}>
                {l.label}
              </a>
            </li>
          );
        })}
      </ul>
    </footer>
  );
}

Object.assign(window, { SiteFooter, FOOTER_LINKS });
