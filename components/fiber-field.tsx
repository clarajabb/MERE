/**
 * Abstract, generative illustration of fiber strands with a measurement
 * annotation. Deterministic (seeded) so server and client markup match.
 * It is decorative and intentionally carries no real-world values.
 */

type Pt = { x: number; y: number };
type Strand = { p: [Pt, Pt, Pt, Pt]; width: number; opacity: number; delay: number };

const W = 560;
const H = 640;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function bezier([a, b, c, d]: Strand["p"], t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
  };
}

function tangent([a, b, c, d]: Strand["p"], t: number): Pt {
  const u = 1 - t;
  const x = 3 * u * u * (b.x - a.x) + 6 * u * t * (c.x - b.x) + 3 * t * t * (d.x - c.x);
  const y = 3 * u * u * (b.y - a.y) + 6 * u * t * (c.y - b.y) + 3 * t * t * (d.y - c.y);
  const len = Math.hypot(x, y);
  return { x: x / len, y: y / len };
}

const r = (n: number) => Math.round(n * 10) / 10;
const toPath = ({ p: [a, b, c, d] }: Strand) =>
  `M${r(a.x)} ${r(a.y)}C${r(b.x)} ${r(b.y)} ${r(c.x)} ${r(c.y)} ${r(d.x)} ${r(d.y)}`;

function buildStrands(): Strand[] {
  const rand = mulberry32(26);
  const strands: Strand[] = [];
  const count = 34;
  for (let i = 0; i < count; i++) {
    const y0 = 40 + (i / count) * 620 + (rand() - 0.5) * 40;
    const drift = -260 + (rand() - 0.5) * 120;
    strands.push({
      p: [
        { x: -30, y: y0 },
        { x: 150 + rand() * 60, y: y0 + (rand() - 0.5) * 140 },
        { x: 360 + rand() * 60, y: y0 + drift + (rand() - 0.5) * 140 },
        { x: W + 30, y: y0 + drift },
      ],
      width: 0.5 + rand() * 0.9,
      opacity: 0.18 + rand() * 0.4,
      delay: rand() * 0.9,
    });
  }
  return strands;
}

const strands = buildStrands();

const focus: Strand = {
  p: [
    { x: -30, y: 470 },
    { x: 170, y: 420 },
    { x: 330, y: 250 },
    { x: W + 30, y: 205 },
  ],
  width: 2.2,
  opacity: 1,
  delay: 0.4,
};

const T = 0.52;
const at = bezier(focus.p, T);
const dir = tangent(focus.p, T);
const normal = { x: -dir.y, y: dir.x };
const half = 9;
const tickA = { x: at.x + normal.x * half, y: at.y + normal.y * half };
const tickB = { x: at.x - normal.x * half, y: at.y - normal.y * half };
const ext = 26;
const label = { x: at.x + 64, y: at.y - 108 };

export function FiberField() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full"
      role="img"
      aria-label="Abstract illustration of fiber strands with a diameter measurement annotation"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="var(--color-rule)" strokeWidth="0.6" />
        </pattern>
      </defs>

      <rect width={W} height={H} fill="url(#grid)" />

      <g fill="none" stroke="var(--color-ink)" strokeLinecap="round">
        {strands.map((s, i) => (
          <path
            key={i}
            d={toPath(s)}
            pathLength={1}
            strokeWidth={s.width}
            strokeOpacity={s.opacity}
            className="fibre-path"
            style={{ animationDelay: `${s.delay}s` }}
          />
        ))}
      </g>

      <path
        d={toPath(focus)}
        pathLength={1}
        fill="none"
        stroke="var(--color-forest)"
        strokeWidth={focus.width}
        strokeLinecap="round"
        className="fibre-path"
        style={{ animationDelay: `${focus.delay}s` }}
      />

      <g className="fade-in-late" fill="none" stroke="var(--color-forest)">
        {/* dimension lines perpendicular to the strand */}
        <line
          x1={tickA.x - dir.x * ext}
          y1={tickA.y - dir.y * ext}
          x2={tickA.x + dir.x * ext}
          y2={tickA.y + dir.y * ext}
          strokeWidth="0.9"
        />
        <line
          x1={tickB.x - dir.x * ext}
          y1={tickB.y - dir.y * ext}
          x2={tickB.x + dir.x * ext}
          y2={tickB.y + dir.y * ext}
          strokeWidth="0.9"
        />
        <circle cx={at.x} cy={at.y} r="34" strokeWidth="0.8" strokeDasharray="2 4" />
        <path
          d={`M${r(at.x + 24)} ${r(at.y - 24)} L${r(label.x - 6)} ${r(label.y + 8)} H${r(label.x + 120)}`}
          strokeWidth="0.8"
        />
        <text
          x={label.x}
          y={label.y}
          fill="var(--color-forest)"
          stroke="none"
          fontFamily="var(--font-mono)"
          fontSize="11"
          letterSpacing="1.4"
        >
          Ø FIBER DIAMETER
        </text>
      </g>

      {/* scale ticks — indicative, no units */}
      <g className="fade-in-late" stroke="var(--color-graphite)" strokeWidth="0.8">
        <line x1="32" y1={H - 36} x2="192" y2={H - 36} />
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={i}
            x1={32 + i * 20}
            x2={32 + i * 20}
            y1={H - 36}
            y2={H - 36 - (i % 4 === 0 ? 10 : 5)}
          />
        ))}
      </g>
    </svg>
  );
}
