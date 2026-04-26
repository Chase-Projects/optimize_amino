// v2-graph.jsx — Static 2D LP illustration.
// Axes: x = grams of GRAIN (rice), y = grams of LEGUME (beans).
// Five constraints → pentagonal feasible region, with optimum AT a vertex.
//
//   (i)   x ≥ 0                              [positivity]
//   (ii)  y ≥ 0                              [positivity]
//   (iii) 0.95 x + 6.10 y ≥ 1500             [Lysine floor,   mg]
//   (iv)  2.50 x + 1.35 y ≥  500             [Methionine floor, mg]
//   (v)   0.0018 x + 0.0035 y ≤ 1.50         [budget ceiling, $]
//   (vi)  y ≤ 400                            [palatability cap on beans, g]
//
// Objective: minimize c = 0.0018 x + 0.0035 y   (grocery cost).
//
// Feasible vertices (computed in closed form below):
//   A = (  0, 370)   Met ∩ x-axis
//   B = (  0, 400)   palatability ∩ x-axis
//   C = ( 56, 400)   palatability ∩ budget
//   D = (509, 167)   budget ∩ Lys
//   E = ( 73, 234)   Lys ∩ Met           ← min cost = $0.95  (OPTIMUM)
//
// The optimum sits at the vertex where the two tightest AA floors meet —
// exactly the pedagogical point: LP optima live at vertices.

function LPGraph2D({ width = 700, height = 500 }) {
  const xMax = 600, yMax = 500;
  const pad = { l: 60, r: 32, t: 28, b: 52 };
  const w = width, h = height;
  const px = g => pad.l + (g / xMax) * (w - pad.l - pad.r);
  const py = g => h - pad.b - (g / yMax) * (h - pad.t - pad.b);

  // Constraint lines (solve each for y given x).
  const lysY = r => (1500 - 0.95 * r) / 6.10;
  const metY = r => (500  - 2.50 * r) / 1.35;
  const budY = r => (1.50 - 0.0018 * r) / 0.0035;
  const palY = _ => 400;

  // Pentagon vertices (pre-computed, ordered counter-clockwise).
  const V = {
    A: { x:   0, y: 370.4, tag: 'Met ∩ axis',   cost: 1.30 },
    B: { x:   0, y: 400,   tag: 'palate ∩ axis', cost: 1.40 },
    C: { x:  55.6, y: 400, tag: 'palate ∩ $',   cost: 1.50 },
    D: { x: 509.3, y: 166.6, tag: '$ ∩ Lys',     cost: 1.50 },
    E: { x:  73.4, y: 234.4, tag: 'Lys ∩ Met',   cost: 0.952 },
  };
  const polyOrder = ['A','B','C','D','E'];
  const polyD = polyOrder.map(k => `${px(V[k].x)},${py(V[k].y)}`).join(' ');

  // Isocost lines: cost = k, so y = (k - 0.0018·x)/0.0035.
  const isocostKs = [0.95, 1.50, 2.50];

  // Axis ticks — 100g grid.
  const xticks = [0, 100, 200, 300, 400, 500, 600];
  const yticks = [0, 100, 200, 300, 400, 500];

  // Clip segment of a line to the plot box [0, xMax] × [0, yMax]
  // so every line draws as a well-behaved line segment.
  const clipLine = fnY => {
    // Sample endpoints at x=0 and x=xMax, clamp y.
    const p1 = { x: 0,    y: fnY(0) };
    const p2 = { x: xMax, y: fnY(xMax) };
    const pts = [p1, p2]
      .map(p => ({ ...p, y: Math.max(-50, Math.min(yMax + 50, p.y)) }));
    return pts;
  };
  const lys = clipLine(lysY);
  const met = clipLine(metY);
  const bud = clipLine(budY);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%"
      style={{ display: 'block', fontFamily: V2.mono, fontSize: 10 }}>
      {/* plot background */}
      <rect x={pad.l} y={pad.t} width={w-pad.l-pad.r} height={h-pad.t-pad.b}
        fill="rgba(255,255,255,0.55)" stroke={V2.rule} strokeWidth="1" />

      {/* internal grid (100g cells) */}
      {xticks.slice(1,-1).map(t => (
        <line key={'vg'+t} x1={px(t)} x2={px(t)} y1={pad.t} y2={h-pad.b}
          stroke={V2.gridMajor} strokeWidth="1" />
      ))}
      {yticks.slice(1,-1).map(t => (
        <line key={'hg'+t} y1={py(t)} y2={py(t)} x1={pad.l} x2={w-pad.r}
          stroke={V2.gridMajor} strokeWidth="1" />
      ))}

      {/* feasible polygon */}
      <polygon points={polyD}
        fill={V2.sage} fillOpacity="0.20"
        stroke={V2.sage} strokeOpacity="0.70" strokeWidth="1.2" />

      {/* isocost lines (parallel, dashed) */}
      {isocostKs.map(k => {
        const y0 = k / 0.0035;
        const yX = (k - 0.0018 * xMax) / 0.0035;
        return (
          <line key={k} x1={px(0)} y1={py(y0)}
            x2={px(xMax)} y2={py(yX)}
            stroke={V2.mute} strokeOpacity="0.40"
            strokeDasharray="2 4" strokeWidth="1"/>
        );
      })}
      {isocostKs.map(k => {
        const y0 = k / 0.0035;
        const clampedY = Math.min(y0, yMax - 8);
        return (
          <text key={'lab'+k} fill={V2.mute} fontSize="9"
            x={px(0) + 6} y={py(clampedY) - 3}>
            ${k.toFixed(2)}
          </text>
        );
      })}

      {/* constraint lines */}
      <line x1={px(lys[0].x)} y1={py(lys[0].y)}
            x2={px(lys[1].x)} y2={py(lys[1].y)}
            stroke={V2.tomato} strokeWidth="2" />
      <line x1={px(met[0].x)} y1={py(met[0].y)}
            x2={px(met[1].x)} y2={py(met[1].y)}
            stroke={V2.ocean} strokeWidth="2" />
      <line x1={px(bud[0].x)} y1={py(bud[0].y)}
            x2={px(bud[1].x)} y2={py(bud[1].y)}
            stroke={V2.mustard} strokeWidth="2" strokeDasharray="5 3"/>
      <line x1={px(0)} y1={py(400)} x2={px(xMax)} y2={py(400)}
            stroke={V2.plum} strokeWidth="2" strokeDasharray="5 3"/>

      {/* axes */}
      <line x1={pad.l} x2={pad.l} y1={pad.t} y2={h-pad.b}
        stroke={V2.ink} strokeWidth="1.5" />
      <line x1={pad.l} x2={w-pad.r} y1={h-pad.b} y2={h-pad.b}
        stroke={V2.ink} strokeWidth="1.5" />

      {/* ticks + labels */}
      {xticks.map(t => (
        <g key={'xt'+t}>
          <line x1={px(t)} x2={px(t)} y1={h-pad.b} y2={h-pad.b+4}
            stroke={V2.ink}/>
          <text x={px(t)} y={h-pad.b+16} textAnchor="middle" fill={V2.ink}>
            {t}
          </text>
        </g>
      ))}
      {yticks.map(t => (
        <g key={'yt'+t}>
          <line x1={pad.l-4} x2={pad.l} y1={py(t)} y2={py(t)} stroke={V2.ink}/>
          <text x={pad.l-8} y={py(t)+3} textAnchor="end" fill={V2.ink}>
            {t}
          </text>
        </g>
      ))}

      {/* axis labels */}
      <text x={(w)/2} y={h-10} textAnchor="middle" fill={V2.ink}
        fontSize="12" fontFamily={V2.font} fontWeight="700">
        grams of grain (rice) →
      </text>
      <text x={18} y={(h)/2} textAnchor="middle" fill={V2.ink}
        fontSize="12" fontFamily={V2.font} fontWeight="700"
        transform={`rotate(-90, 18, ${h/2})`}>
        grams of legume (beans) →
      </text>

      {/* non-optimal vertices (small dots) */}
      {['A','B','C','D'].map(k => (
        <circle key={k} cx={px(V[k].x)} cy={py(V[k].y)} r="3.5"
          fill={V2.ink} fillOpacity="0.55" stroke={V2.paper} strokeWidth="1.5"/>
      ))}

      {/* optimum vertex */}
      <circle cx={px(V.E.x)} cy={py(V.E.y)} r="6"
        fill={V2.tomato} stroke={V2.paper} strokeWidth="2"/>
      <circle cx={px(V.E.x)} cy={py(V.E.y)} r="11"
        fill="none" stroke={V2.tomato} strokeWidth="1" strokeDasharray="2 2"/>

      {/* optimum label */}
      <g transform={`translate(${px(V.E.x)+14}, ${py(V.E.y)-22})`}>
        <rect x="0" y="-14" width="158" height="34" fill={V2.stickerA}
          stroke={V2.rule}/>
        <text x="8" y="-2" fontSize="10" fontFamily={V2.mono} fill={V2.ink}
          fontWeight="700">
          x* = ({Math.round(V.E.x)}, {Math.round(V.E.y)}) g
        </text>
        <text x="8" y="12" fontSize="10" fontFamily={V2.mono} fill={V2.tomato}
          fontWeight="700">
          min cost = ${V.E.cost.toFixed(2)}
        </text>
      </g>

      {/* constraint tags along the lines */}
      <g fontFamily={V2.mono} fontSize="10" fontWeight="700">
        <rect x={px(320)-4} y={py(lysY(320))-26} width="86" height="16"
          fill={V2.stickerE} stroke={V2.tomato}/>
        <text x={px(320)+2} y={py(lysY(320))-14} fill={V2.tomato}>
          Lys ≥ 1500
        </text>

        <rect x={px(170)-4} y={py(metY(170))-26} width="86" height="16"
          fill={V2.stickerD} stroke={V2.ocean}/>
        <text x={px(170)+2} y={py(metY(170))-14} fill={V2.ocean}>
          Met ≥ 500
        </text>

        <rect x={px(260)-4} y={py(budY(260))-26} width="88" height="16"
          fill={V2.stickerB} stroke={V2.mustard}/>
        <text x={px(260)+2} y={py(budY(260))-14} fill={V2.mustard}>
          $ ≤ 1.50
        </text>

        <rect x={px(310)-4} y={py(400)-22} width="96" height="16"
          fill={V2.stickerF} stroke={V2.plum}/>
        <text x={px(310)+2} y={py(400)-10} fill={V2.plum}>
          beans ≤ 400g
        </text>
      </g>

      {/* feasible label */}
      <text x={px(200)} y={py(330)} fill={V2.sage} fontFamily={V2.font}
        fontSize="20" fontStyle="italic" textAnchor="middle" fontWeight="700">
        feasible
      </text>

      {/* small legend for isocost */}
      <g transform={`translate(${pad.l+8}, ${pad.t+10})`}>
        <rect x="-4" y="-2" width="150" height="42" fill="#fff"
          stroke={V2.rule} opacity="0.88"/>
        <line x1="4" x2="28" y1="10" y2="10" stroke={V2.mute}
          strokeDasharray="2 4" strokeWidth="1"/>
        <text x="32" y="13" fontSize="10" fill={V2.mute}>
          isocost lines
        </text>
        <circle cx="16" cy="30" r="4" fill={V2.tomato}
          stroke={V2.paper} strokeWidth="1.5"/>
        <text x="32" y="33" fontSize="10" fill={V2.ink} fontWeight="700">
          optimum vertex
        </text>
      </g>
    </svg>
  );
}

Object.assign(window, { LPGraph2D });
