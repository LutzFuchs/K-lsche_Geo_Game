/**
 * Per-station cartoon Munich scenes. Inline SVG so they ship in the same
 * bundle, weigh nothing extra, and stay crisp on retina screens.
 *
 * If you'd prefer real bitmap art (e.g. Midjourney / Imagen output), drop
 * a 1200×600 WebP at `/public/heroes/{station-id}.webp` and add a thin
 * <img> fallback layer over <SceneFor /> — see IMAGES.md.
 *
 * Each scene uses the same compositional rhythm so the seven feel like a
 * series, not a grab-bag:
 *   - sky band (gradient, station-themed)
 *   - sun or moon
 *   - 1–2 cloud blobs
 *   - signature landmark silhouette in fill
 *   - foreground accent (cobblestones / hedges / banner / market awning)
 */

import { useState } from 'react'

const USE_BITMAP_HEROES = true
const VB = '0 0 600 280'

// Station ids whose bitmap failed to load this session — fall back to the SVG.
const failedBitmaps = new Set<string>()

type SceneProps = { className?: string }

function frame(props: { id: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox={VB}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={props.id}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      {props.children}
    </svg>
  )
}

/* common bits */
const Cloud = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="0" rx="22" ry="11" fill="#fff" />
    <ellipse cx="18" cy="-2" rx="16" ry="9" fill="#fff" />
    <ellipse cx="-16" cy="2" rx="14" ry="7" fill="#fff" />
  </g>
)

const Sun = ({ x, y, fill = '#f6c84d', r = 28 }: { x: number; y: number; fill?: string; r?: number }) => (
  <circle cx={x} cy={y} r={r} fill={fill} />
)

/* ───────────────────── 1 · Odeonsplatz · Feldherrnhalle ───────────────────── */
function Odeonsplatz() {
  return frame({
    id: 'odeonsplatz',
    children: (
      <>
        <defs>
          <linearGradient id="o-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fde7c8" />
            <stop offset="100%" stopColor="#f6cba0" />
          </linearGradient>
        </defs>
        <rect width="600" height="280" fill="url(#o-sky)" />
        <Sun x={490} y={70} fill="#fff2cc" r={36} />
        <Sun x={490} y={70} fill="#f6c84d" r={26} />
        <Cloud x={120} y={60} s={1.1} />
        <Cloud x={350} y={40} s={0.9} />

        {/* Feldherrnhalle: triple-arched loggia, sand-stone */}
        <g>
          <rect x="80" y="120" width="440" height="140" fill="#d2a26a" />
          {/* base steps */}
          <rect x="60" y="240" width="480" height="20" fill="#b8895a" />
          <rect x="40" y="258" width="520" height="22" fill="#a37a4d" />
          {/* roof */}
          <polygon points="60,120 540,120 510,90 90,90" fill="#a8753e" />
          {/* arches */}
          {[140, 280, 420].map((cx) => (
            <g key={cx}>
              <path
                d={`M${cx - 40} 240 L${cx - 40} 180 Q${cx} 130 ${cx + 40} 180 L${cx + 40} 240 Z`}
                fill="#7c5230"
              />
              <path
                d={`M${cx - 30} 240 L${cx - 30} 185 Q${cx} 145 ${cx + 30} 185 L${cx + 30} 240 Z`}
                fill="#1f1208"
              />
            </g>
          ))}
          {/* columns between arches */}
          {[100, 180, 240, 320, 380, 460].map((x) => (
            <rect key={x} x={x} y="170" width="14" height="70" fill="#b8895a" />
          ))}
        </g>

        {/* lion statue (heraldic) on left base */}
        <g transform="translate(95 220)">
          <rect x="-12" y="10" width="24" height="20" fill="#7c5230" />
          <circle cx="0" cy="2" r="9" fill="#caa05f" />
          <circle cx="-3" cy="0" r="0.9" fill="#1f1208" />
          <circle cx="3" cy="0" r="0.9" fill="#1f1208" />
        </g>
      </>
    ),
  })
}

/* ───────────────────── 2 · Theatinerkirche ───────────────────── */
function Theatinerkirche() {
  return frame({
    id: 'theatinerkirche',
    children: (
      <>
        <defs>
          <linearGradient id="t-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#cfe6ff" />
            <stop offset="100%" stopColor="#9bc7f0" />
          </linearGradient>
        </defs>
        <rect width="600" height="280" fill="url(#t-sky)" />
        <Sun x={110} y={70} r={32} />
        <Cloud x={420} y={50} s={1.1} />
        <Cloud x={250} y={90} s={0.7} />

        {/* yellow facade */}
        <g>
          <rect x="120" y="150" width="360" height="120" fill="#f3c243" />
          <rect x="120" y="150" width="360" height="10" fill="#d99e1d" />
          {/* twin towers */}
          <rect x="100" y="80" width="60" height="190" fill="#f3c243" />
          <rect x="440" y="80" width="60" height="190" fill="#f3c243" />
          {/* tower caps (green copper domes) */}
          <ellipse cx="130" cy="80" rx="40" ry="22" fill="#5d8e6a" />
          <ellipse cx="470" cy="80" rx="40" ry="22" fill="#5d8e6a" />
          <rect x="127" y="56" width="6" height="20" fill="#3e6b4d" />
          <rect x="467" y="56" width="6" height="20" fill="#3e6b4d" />
          {/* central dome */}
          <ellipse cx="300" cy="100" rx="80" ry="46" fill="#5d8e6a" />
          <ellipse cx="300" cy="105" rx="60" ry="32" fill="#74a981" />
          {/* spire */}
          <polygon points="294,46 300,18 306,46" fill="#3e6b4d" />
          <circle cx="300" cy="14" r="3" fill="#d99e1d" />
          {/* doors + window */}
          <rect x="280" y="210" width="40" height="60" fill="#7c4a17" rx="20" />
          <rect x="180" y="180" width="30" height="60" fill="#fff7d6" rx="15" />
          <rect x="390" y="180" width="30" height="60" fill="#fff7d6" rx="15" />
        </g>
        {/* ground */}
        <rect x="0" y="270" width="600" height="10" fill="#c9b88a" />
      </>
    ),
  })
}

/* ───────────────────── 3 · Hofgarten ───────────────────── */
function Hofgarten() {
  return frame({
    id: 'hofgarten',
    children: (
      <>
        <defs>
          <linearGradient id="h-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#dff3d3" />
            <stop offset="100%" stopColor="#9ed085" />
          </linearGradient>
        </defs>
        <rect width="600" height="280" fill="url(#h-sky)" />
        <Sun x={510} y={60} r={26} />
        <Cloud x={140} y={45} s={1} />

        {/* trees */}
        {[80, 140, 470, 540].map((cx, i) => (
          <g key={cx} transform={`translate(${cx} ${i % 2 ? 200 : 195})`}>
            <rect x="-4" y="0" width="8" height="34" fill="#6b4323" />
            <circle cx="0" cy="-4" r="28" fill="#3f7a3a" />
            <circle cx="-12" cy="2" r="22" fill="#4f8e44" />
            <circle cx="12" cy="2" r="22" fill="#4f8e44" />
          </g>
        ))}

        {/* hedge ring */}
        <ellipse cx="300" cy="240" rx="220" ry="22" fill="#3a6a35" />
        <ellipse cx="300" cy="234" rx="190" ry="14" fill="#4d8042" />

        {/* Diana pavilion: octagonal columned rotunda */}
        <g>
          <rect x="220" y="200" width="160" height="14" fill="#dccfa6" />
          {/* columns */}
          {[235, 270, 305, 340, 375].map((x) => (
            <rect key={x} x={x} y="120" width="10" height="80" fill="#f1e6c4" />
          ))}
          {/* entablature */}
          <rect x="220" y="110" width="160" height="14" fill="#dccfa6" />
          {/* dome */}
          <ellipse cx="300" cy="110" rx="92" ry="44" fill="#c1b487" />
          <ellipse cx="300" cy="114" rx="78" ry="32" fill="#dccfa6" />
          {/* statue */}
          <circle cx="300" cy="68" r="8" fill="#a08756" />
          <rect x="296" y="74" width="8" height="18" fill="#a08756" />
        </g>

        {/* path */}
        <path d="M0 270 Q300 250 600 270 L600 280 L0 280 Z" fill="#caa46d" />
      </>
    ),
  })
}

/* ───────────────────── 4 · Residenz / Max-Joseph-Platz ───────────────────── */
function Residenz() {
  return frame({
    id: 'residenz',
    children: (
      <>
        <defs>
          <linearGradient id="r-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1d2a5c" />
            <stop offset="60%" stopColor="#5a4ea5" />
            <stop offset="100%" stopColor="#e08a59" />
          </linearGradient>
        </defs>
        <rect width="600" height="280" fill="url(#r-sky)" />
        <Sun x={300} y={210} fill="#f6c84d" r={42} />
        {/* stars */}
        {[
          [80, 50], [150, 90], [490, 40], [540, 110], [60, 130],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="#fff8d8" />
        ))}

        {/* palace silhouette */}
        <g fill="#1a1a2e">
          <rect x="40" y="170" width="520" height="100" />
          <rect x="80" y="140" width="80" height="40" />
          <rect x="440" y="140" width="80" height="40" />
          {/* central pediment */}
          <polygon points="240,170 360,170 300,120" />
          <rect x="240" y="170" width="120" height="20" />
          {/* arched gate */}
          <path d="M270 270 L270 210 Q300 170 330 210 L330 270 Z" fill="#0d0d1a" />
          {/* windows */}
          {[100, 180, 260, 380, 460].map((x) => (
            <rect key={x} x={x} y="190" width="20" height="30" fill="#f6c84d" />
          ))}
        </g>

        {/* crown floating above */}
        <g transform="translate(300 70)">
          <path d="M-32 18 L-22 -6 L-10 14 L0 -10 L10 14 L22 -6 L32 18 Z" fill="#f4d36d" stroke="#7e5b14" strokeWidth="2" strokeLinejoin="round" />
          <rect x="-32" y="18" width="64" height="6" fill="#f4d36d" stroke="#7e5b14" strokeWidth="1.5" />
          <circle cx="-22" cy="-6" r="2.6" fill="#e04127" />
          <circle cx="0" cy="-10" r="2.6" fill="#e04127" />
          <circle cx="22" cy="-6" r="2.6" fill="#e04127" />
        </g>
      </>
    ),
  })
}

/* ───────────────────── 5 · Platzl / Hofbräuhaus ───────────────────── */
function Platzl() {
  return frame({
    id: 'platzl',
    children: (
      <>
        <defs>
          <linearGradient id="p-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fcebcd" />
            <stop offset="100%" stopColor="#f3c995" />
          </linearGradient>
        </defs>
        <rect width="600" height="280" fill="url(#p-sky)" />
        <Sun x={130} y={60} r={28} />
        <Cloud x={420} y={45} s={1} />
        <Cloud x={500} y={90} s={0.7} />

        {/* HB facade — warm tan with red roof */}
        <g>
          <rect x="80" y="140" width="440" height="120" fill="#e8c79a" />
          <polygon points="80,140 520,140 480,90 120,90" fill="#a73a2c" />
          {/* white timber accents */}
          <rect x="80" y="140" width="440" height="6" fill="#fff8e6" />
          {/* HB sign */}
          <circle cx="300" cy="120" r="22" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
          <text
            x="300"
            y="128"
            textAnchor="middle"
            fontFamily="Fraunces, Georgia, serif"
            fontWeight="900"
            fontSize="22"
            fill="#1a1a1a"
          >
            HB
          </text>
          {/* arched windows */}
          {[140, 220, 380, 460].map((cx) => (
            <path key={cx}
              d={`M${cx - 18} 240 L${cx - 18} 190 Q${cx} 170 ${cx + 18} 190 L${cx + 18} 240 Z`}
              fill="#d4a162" />
          ))}
          {/* central door */}
          <rect x="282" y="200" width="36" height="60" fill="#5b3a1c" rx="18" />
        </g>

        {/* foreground beer stein */}
        <g transform="translate(60 220)">
          <rect x="0" y="0" width="40" height="50" fill="#dcd5c0" stroke="#5b3a1c" strokeWidth="2" />
          <path d="M40 12 Q56 12 56 28 Q56 44 40 44" fill="none" stroke="#5b3a1c" strokeWidth="3" />
          <rect x="0" y="0" width="40" height="14" fill="#fff" />
          <rect x="0" y="-8" width="40" height="10" fill="#cdb88c" stroke="#5b3a1c" strokeWidth="2" />
        </g>

        {/* cobble */}
        <rect x="0" y="260" width="600" height="20" fill="#a98256" />
      </>
    ),
  })
}

/* ───────────────────── 6 · Viktualienmarkt ───────────────────── */
function Viktualienmarkt() {
  return frame({
    id: 'viktualienmarkt',
    children: (
      <>
        <defs>
          <linearGradient id="v-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#cfe6ff" />
            <stop offset="100%" stopColor="#a3cdec" />
          </linearGradient>
        </defs>
        <rect width="600" height="280" fill="url(#v-sky)" />
        <Sun x={510} y={60} r={28} />
        <Cloud x={120} y={50} s={1.1} />

        {/* Maibaum (maypole) */}
        <g transform="translate(300 0)">
          <rect x="-4" y="40" width="8" height="220" fill="#6b4323" />
          {/* blue/white spirals */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={i} x="-12" y={50 + i * 30} width="24" height="14" fill={i % 2 ? '#1e40af' : '#fff'} />
          ))}
          {/* wreath */}
          <ellipse cx="0" cy="40" rx="30" ry="10" fill="#3f7a3a" />
          {/* crown ornament */}
          <polygon points="-12,30 0,16 12,30" fill="#f6c84d" stroke="#7e5b14" strokeWidth="1.5" />
        </g>

        {/* market stalls — striped awnings (left + right) */}
        <g>
          {/* left stall */}
          <rect x="40" y="170" width="180" height="100" fill="#caa46d" />
          <polygon points="36,170 224,170 220,150 40,150" fill="#1e40af" />
          {[40, 64, 88, 112, 136, 160, 184].map((x, i) => (
            <rect key={x} x={x} y="150" width="24" height="20" fill={i % 2 ? '#fff' : '#1e40af'} />
          ))}
          {/* produce */}
          <circle cx="80" cy="200" r="10" fill="#e04127" />
          <circle cx="100" cy="205" r="9" fill="#f6c84d" />
          <circle cx="125" cy="200" r="11" fill="#3f7a3a" />
          <circle cx="155" cy="208" r="10" fill="#a73a2c" />
          <circle cx="185" cy="200" r="10" fill="#7c4a17" />

          {/* right stall */}
          <rect x="380" y="180" width="180" height="100" fill="#caa46d" />
          <polygon points="376,180 564,180 560,160 380,160" fill="#1e40af" />
          {[380, 404, 428, 452, 476, 500, 524].map((x, i) => (
            <rect key={x} x={x} y="160" width="24" height="20" fill={i % 2 ? '#fff' : '#1e40af'} />
          ))}
          <circle cx="420" cy="220" r="11" fill="#fff" stroke="#1a1a1a" strokeWidth="1.5" />
          <circle cx="445" cy="218" r="9" fill="#f6c84d" />
          <circle cx="470" cy="222" r="10" fill="#e04127" />
          <circle cx="500" cy="220" r="10" fill="#3f7a3a" />
        </g>
      </>
    ),
  })
}

/* ───────────────────── 7 · Marienplatz · Neues Rathaus ───────────────────── */
function Marienplatz() {
  return frame({
    id: 'marienplatz',
    children: (
      <>
        <defs>
          <linearGradient id="m-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fde2c0" />
            <stop offset="60%" stopColor="#f4a772" />
            <stop offset="100%" stopColor="#c44b3a" />
          </linearGradient>
        </defs>
        <rect width="600" height="280" fill="url(#m-sky)" />
        <Sun x={520} y={200} fill="#ffd97a" r={50} />
        {[
          [100, 60], [180, 30], [320, 50], [430, 30],
        ].map(([x, y]) => (
          <circle key={`s-${x}`} cx={x} cy={y} r="2" fill="#fff8d8" />
        ))}

        {/* Neues Rathaus silhouette — clock tower + facade */}
        <g fill="#3b2a40">
          <rect x="40" y="180" width="520" height="90" />
          {/* main facade */}
          <rect x="80" y="120" width="120" height="60" />
          <rect x="380" y="120" width="120" height="60" />
          {/* clock tower */}
          <rect x="270" y="60" width="60" height="120" />
          <polygon points="270,60 330,60 330,30 270,30" />
          <polygon points="260,30 340,30 300,0" />
          {/* spires */}
          <polygon points="80,120 200,120 140,90" />
          <polygon points="380,120 500,120 440,90" />
          {/* windows */}
          {[110, 150, 410, 450].map((x) => (
            <rect key={x} x={x} y="140" width="14" height="22" fill="#f6c84d" />
          ))}
          {/* clock face */}
          <circle cx="300" cy="90" r="14" fill="#fff" />
          <circle cx="300" cy="90" r="14" fill="none" stroke="#3b2a40" strokeWidth="1.5" />
          <line x1="300" y1="90" x2="300" y2="80" stroke="#3b2a40" strokeWidth="2" />
          <line x1="300" y1="90" x2="306" y2="90" stroke="#3b2a40" strokeWidth="2" />
        </g>

        {/* Mariensäule with golden lion at base on left */}
        <g transform="translate(120 180)">
          <rect x="-3" y="-60" width="6" height="60" fill="#caa46d" />
          <rect x="-12" y="-72" width="24" height="14" fill="#caa46d" />
          {/* Mary on top */}
          <circle cx="0" cy="-82" r="6" fill="#dccfa6" />
          {/* base */}
          <rect x="-20" y="-2" width="40" height="14" fill="#caa46d" />
        </g>

        {/* heraldic gold lion silhouette in foreground right */}
        <g transform="translate(490 240) scale(0.55)">
          <path
            d="M-30 0 C-30 -22 -10 -32 0 -22 C8 -34 30 -28 30 0 C20 6 22 18 18 24 L-18 24 C-22 18 -20 6 -30 0 Z"
            fill="#f4d36d"
            stroke="#7e5b14"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M-18 24 L-22 36 M18 24 L22 36" stroke="#7e5b14" strokeWidth="3" strokeLinecap="round" />
          <circle cx="-8" cy="-12" r="1.4" fill="#1a1a1a" />
          <circle cx="6" cy="-12" r="1.4" fill="#1a1a1a" />
        </g>
      </>
    ),
  })
}

/* ───────────────────── 7 · Frauenkirche ───────────────────── */
function Frauenkirche() {
  return frame({
    id: 'frauenkirche',
    children: (
      <>
        <defs>
          <linearGradient id="fk-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#cfe6ff" />
            <stop offset="100%" stopColor="#9bc7f0" />
          </linearGradient>
        </defs>
        <rect width="600" height="280" fill="url(#fk-sky)" />
        <Sun x={110} y={64} r={30} />
        <Cloud x={430} y={48} s={1.1} />
        <Cloud x={250} y={86} s={0.7} />

        {/* twin brick towers */}
        <g>
          <rect x="210" y="74" width="68" height="196" fill="#b85c4a" />
          <rect x="322" y="74" width="68" height="196" fill="#b85c4a" />
          {/* nave between */}
          <rect x="278" y="150" width="44" height="120" fill="#9f4a3a" />
          {/* green onion domes (Welsche Hauben) */}
          <ellipse cx="244" cy="74" rx="40" ry="22" fill="#5d8e6a" />
          <ellipse cx="356" cy="74" rx="40" ry="22" fill="#5d8e6a" />
          <path d="M232 60 Q244 30 256 60 Z" fill="#5d8e6a" />
          <path d="M344 60 Q356 30 368 60 Z" fill="#5d8e6a" />
          <rect x="241" y="36" width="6" height="10" fill="#3e6b4d" />
          <rect x="353" y="36" width="6" height="10" fill="#3e6b4d" />
          <circle cx="244" cy="33" r="3" fill="#d99e1d" />
          <circle cx="356" cy="33" r="3" fill="#d99e1d" />
          {/* windows */}
          {[224, 352].map((x) => (
            <rect key={x} x={x} y="120" width="20" height="40" fill="#fff7d6" rx="10" />
          ))}
          <rect x="290" y="200" width="20" height="50" fill="#7c4a17" rx="10" />
        </g>
        <rect x="0" y="270" width="600" height="10" fill="#c9b88a" />
      </>
    ),
  })
}

/* ───────────────────── 8 · Karlsplatz · Stachus ───────────────────── */
function Karlsplatz() {
  return frame({
    id: 'karlsplatz',
    children: (
      <>
        <defs>
          <linearGradient id="ks-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fde7c8" />
            <stop offset="100%" stopColor="#a3cdec" />
          </linearGradient>
        </defs>
        <rect width="600" height="280" fill="url(#ks-sky)" />
        <Sun x={500} y={64} r={30} />
        <Cloud x={130} y={50} s={1.1} />

        {/* Karlstor — two round towers flanking an arch */}
        <g>
          <rect x="150" y="120" width="60" height="140" fill="#cdb48a" />
          <rect x="390" y="120" width="60" height="140" fill="#cdb48a" />
          <ellipse cx="180" cy="120" rx="30" ry="14" fill="#b8985f" />
          <ellipse cx="420" cy="120" rx="30" ry="14" fill="#b8985f" />
          {/* conical roofs */}
          <polygon points="150,120 210,120 180,86" fill="#9a5a3a" />
          <polygon points="390,120 450,120 420,86" fill="#9a5a3a" />
          {/* connecting wall + gate arch */}
          <rect x="210" y="150" width="180" height="110" fill="#d8c39a" />
          <path d="M270 260 L270 200 Q300 160 330 200 L330 260 Z" fill="#5b4a2c" />
          {/* flag finials */}
          <rect x="178" y="74" width="4" height="14" fill="#7c5230" />
          <rect x="418" y="74" width="4" height="14" fill="#7c5230" />
        </g>

        {/* fountain in the foreground */}
        <g>
          <ellipse cx="300" cy="266" rx="120" ry="16" fill="#7bb0d8" />
          <ellipse cx="300" cy="262" rx="90" ry="11" fill="#a3cdec" />
          <path d="M300 262 q-6 -18 0 -30 q6 12 0 30" fill="#cfeaff" />
          {[270, 330].map((x) => (
            <path key={x} d={`M${x} 260 q-4 -12 0 -20 q4 8 0 20`} fill="#cfeaff" />
          ))}
        </g>
      </>
    ),
  })
}

/* ───────────────────── Welcome / lobby skyline ───────────────────── */
export function MunichSkyline(_props: SceneProps) {
  if (USE_BITMAP_HEROES) {
    return (
      <img
        src="/heroes/munich-skyline.png"
        alt=""
        loading="eager"
        decoding="async"
        className="h-full w-full object-cover"
      />
    )
  }
  return frame({
    id: 'munich-skyline',
    children: (
      <>
        <defs>
          <linearGradient id="w-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f8d8c2" />
            <stop offset="100%" stopColor="#a3cdec" />
          </linearGradient>
        </defs>
        <rect width="600" height="280" fill="url(#w-sky)" />
        <Sun x={500} y={70} r={40} />
        <Cloud x={120} y={50} s={1.2} />
        <Cloud x={350} y={80} s={0.8} />

        {/* layered Munich silhouette: Frauenkirche (twin onion towers) + Rathaus + Olympic */}
        <g fill="#5a4ea5" opacity="0.85">
          {/* far hills */}
          <path d="M0 220 Q120 180 260 210 Q420 235 600 195 L600 280 L0 280 Z" />
        </g>
        <g fill="#3b2a40">
          {/* Frauenkirche twin towers */}
          <g transform="translate(120 90)">
            <rect x="-10" y="0" width="20" height="170" />
            <rect x="50" y="0" width="20" height="170" />
            <ellipse cx="0" cy="0" rx="14" ry="14" />
            <ellipse cx="60" cy="0" rx="14" ry="14" />
            <polygon points="-3,-14 0,-26 3,-14" />
            <polygon points="57,-14 60,-26 63,-14" />
          </g>

          {/* Neues Rathaus clock tower */}
          <g transform="translate(300 70)">
            <rect x="-15" y="0" width="30" height="190" />
            <polygon points="-15,0 15,0 0,-22" />
            <rect x="-30" y="60" width="60" height="130" />
            <circle cx="0" cy="40" r="9" fill="#f6c84d" />
          </g>

          {/* Theatinerkirche silhouette */}
          <g transform="translate(450 110)">
            <rect x="-50" y="0" width="100" height="150" />
            <ellipse cx="0" cy="0" rx="40" ry="22" />
            <rect x="-3" y="-30" width="6" height="22" />
          </g>
        </g>
      </>
    ),
  })
}

/* ─────────────────────────── exports ─────────────────────────── */

const HEROES: Record<string, () => React.ReactElement> = {
  odeonsplatz: Odeonsplatz,
  theatinerkirche: Theatinerkirche,
  hofgarten: Hofgarten,
  residenz: Residenz,
  platzl: Platzl,
  viktualienmarkt: Viktualienmarkt,
  marienplatz: Marienplatz,
  frauenkirche: Frauenkirche,
  karlsplatz: Karlsplatz,
}

export function StationHero({ stationId }: { stationId: string }) {
  const Hero = HEROES[stationId] ?? Odeonsplatz
  const [, forceRender] = useState(0)

  // Prefer the bitmap, but fall back to the inline SVG if the PNG is missing
  // (e.g. a newly added station whose art hasn't been generated yet).
  if (USE_BITMAP_HEROES && !failedBitmaps.has(stationId)) {
    return (
      <img
        src={`/heroes/${stationId}.png`}
        alt=""
        loading="eager"
        decoding="async"
        className="h-full w-full object-cover"
        onError={() => {
          failedBitmaps.add(stationId)
          forceRender((n) => n + 1)
        }}
      />
    )
  }
  return <Hero />
}
