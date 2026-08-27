/**
 * Inline line-art SVGs. No external assets, no font icons — every glyph is
 * tuned to the editorial paper aesthetic and stays crisp on retina screens.
 *
 * Stroke is `currentColor` so glyphs inherit text color and adapt to dark mode.
 */

type SvgProps = {
  className?: string
  size?: number
  strokeWidth?: number
}

const svgBase = ({ className, size = 64, strokeWidth = 1.4 }: SvgProps) => ({
  className,
  width: size,
  height: size,
  viewBox: '0 0 64 64',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  xmlns: 'http://www.w3.org/2000/svg',
})

export function ColumnGlyph(p: SvgProps) {
  // Feldherrnhalle pillar
  return (
    <svg {...svgBase(p)}>
      <path d="M16 14h32M14 18h36" />
      <path d="M22 18v32M30 18v32M38 18v32M46 18v32" />
      <path d="M14 50h36M16 54h32" />
    </svg>
  )
}

export function DomeGlyph(p: SvgProps) {
  // Theatinerkirche dome + flanking towers
  return (
    <svg {...svgBase(p)}>
      <path d="M32 8v6" />
      <path d="M22 30c0-7 4.5-12 10-12s10 5 10 12" />
      <path d="M14 32h36" />
      <path d="M14 32v22h36V32" />
      <path d="M14 22v10M50 22v10" />
      <path d="M14 18h-2v4h2M50 18h2v4h-2" />
      <path d="M28 54v-12h8v12" />
    </svg>
  )
}

export function PavilionGlyph(p: SvgProps) {
  // Diana-Tempel — circular pavilion with columns
  return (
    <svg {...svgBase(p)}>
      <path d="M32 10l-14 8h28z" />
      <path d="M16 18h32M18 22h28" />
      <path d="M22 22v22M30 22v22M38 22v22M46 22v22" />
      <path d="M14 44h36" />
      <path d="M14 50h36" />
      <circle cx="32" cy="14" r="1.6" />
    </svg>
  )
}

export function CrownGlyph(p: SvgProps) {
  return (
    <svg {...svgBase(p)}>
      <path d="M12 38l4-18 8 12 8-18 8 18 8-12 4 18z" />
      <path d="M12 38h40" />
      <path d="M16 44h32" />
      <circle cx="16" cy="20" r="1.6" />
      <circle cx="32" cy="14" r="1.6" />
      <circle cx="48" cy="20" r="1.6" />
    </svg>
  )
}

export function SteinGlyph(p: SvgProps) {
  // Beer stein with lid
  return (
    <svg {...svgBase(p)}>
      <path d="M18 18h22v32H18z" />
      <path d="M40 24h6a4 4 0 014 4v10a4 4 0 01-4 4h-6" />
      <path d="M18 14h22M18 14v4M40 14v4" />
      <path d="M22 26v18" />
      <path d="M22 22h14M22 30h14M22 38h14M22 46h14" />
    </svg>
  )
}

export function DiamondPatternGlyph(p: SvgProps) {
  // Bavarian blue-and-white diamond pattern
  return (
    <svg {...svgBase(p)}>
      <path d="M14 14h36v36h-36z" />
      <path d="M14 24l10-10M14 38l24-24M14 50l36-36M22 50l28-28M36 50l14-14M50 50V36" />
      <path d="M14 50V14M50 14v36" />
    </svg>
  )
}

export function LionGlyph(p: SvgProps) {
  // Stylized lion head — mane as radiating strokes, used on Marienplatz card
  // and Final crest. Reads as a lion at any size; loses the cartoonish eyes
  // an earlier draft had.
  return (
    <svg {...svgBase(p)}>
      <circle cx="32" cy="34" r="11" />
      {/* mane — 16 radial spikes */}
      <path d="M32 18v-6M32 56v-6M14 34h-6M50 34h6" />
      <path d="M20 22l-4-4M44 22l4-4M20 46l-4 4M44 46l4 4" />
      <path d="M27 17l-2-5M37 17l2-5M27 51l-2 5M37 51l2 5" />
      <path d="M16 28l-5-2M48 28l5-2M16 40l-5 2M48 40l5 2" />
      {/* eyes */}
      <path d="M27 33h0.01M37 33h0.01" strokeWidth="2.6" />
      {/* snout + nose */}
      <path d="M32 36v3" />
      <path d="M30 39h4" />
      <path d="M30 39c0 1.5 1 3 2 3s2-1.5 2-3" />
    </svg>
  )
}

export function FrauenkircheGlyph(p: SvgProps) {
  // Twin towers with the signature onion ("Welsche Haube") domes
  return (
    <svg {...svgBase(p)}>
      <path d="M20 52V28M28 52V28M36 52V28M44 52V28" />
      <path d="M20 28c0-7 4-10 4-10s4 3 4 10" />
      <path d="M36 28c0-7 4-10 4-10s4 3 4 10" />
      <path d="M24 18v-4M40 18v-4" />
      <path d="M16 52h32" />
      <path d="M28 52V38h8v14" />
    </svg>
  )
}

export function GateGlyph(p: SvgProps) {
  // Karlstor — central archway flanked by two round towers
  return (
    <svg {...svgBase(p)}>
      <path d="M14 54V28a6 6 0 0112 0v26" />
      <path d="M38 54V28a6 6 0 0112 0v26" />
      <path d="M14 26l6-8 6 8M38 26l6-8 6 8" />
      <path d="M26 54V40a6 6 0 0112 0v14" />
      <path d="M10 54h44" />
    </svg>
  )
}

export function CompassGlyph(p: SvgProps) {
  return (
    <svg {...svgBase(p)}>
      <circle cx="32" cy="32" r="22" />
      <circle cx="32" cy="32" r="2.2" fill="currentColor" />
      <path d="M32 8v6M32 50v6M8 32h6M50 32h6" />
      <path d="M32 14l4 18-4 4-4-4z" fill="currentColor" />
      <path d="M32 50l-4-18 4-4 4 4z" />
    </svg>
  )
}

export function PinGlyph(p: SvgProps) {
  return (
    <svg {...svgBase(p)}>
      <path d="M32 58S14 38 14 24a18 18 0 0136 0c0 14-18 34-18 34z" />
      <circle cx="32" cy="24" r="7" />
    </svg>
  )
}

export function StarMapGlyph(p: SvgProps) {
  // Welcome hero — abstract Munich constellation
  return (
    <svg {...{ ...svgBase(p), viewBox: '0 0 120 80' }}>
      <circle cx="20" cy="60" r="2.4" fill="currentColor" />
      <circle cx="34" cy="48" r="3" fill="currentColor" />
      <circle cx="48" cy="32" r="2" fill="currentColor" />
      <circle cx="60" cy="46" r="3.2" fill="currentColor" />
      <circle cx="74" cy="30" r="2" fill="currentColor" />
      <circle cx="90" cy="42" r="3" fill="currentColor" />
      <circle cx="104" cy="24" r="2.4" fill="currentColor" />
      <path d="M20 60l14-12 14-16 12 14 14-16 16 12 14-18" />
      <path d="M48 32l-4-10M74 30l4-12M90 42l-2 14" opacity="0.4" />
    </svg>
  )
}

const stationGlyphs: Record<string, (p: SvgProps) => React.ReactElement> = {
  odeonsplatz: ColumnGlyph,
  theatinerkirche: DomeGlyph,
  hofgarten: PavilionGlyph,
  residenz: CrownGlyph,
  platzl: SteinGlyph,
  viktualienmarkt: DiamondPatternGlyph,
  marienplatz: LionGlyph,
  frauenkirche: FrauenkircheGlyph,
  karlsplatz: GateGlyph,
}

export function StationGlyph({
  stationId,
  ...rest
}: { stationId: string } & SvgProps) {
  const Glyph = stationGlyphs[stationId] ?? CompassGlyph
  return <Glyph {...rest} />
}
