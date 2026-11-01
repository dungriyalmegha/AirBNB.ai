// Small hand-drawn boho ornaments. Decorative only, hidden from screen readers.

export function Sun({ className = 'h-16 w-16', color = 'currentColor' }: { className?: string; color?: string }) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30)
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
      <circle cx="50" cy="50" r="16" />
      <circle cx="50" cy="50" r="9" fill={color} stroke="none" opacity=".35" />
      {rays.map((a, i) => {
        const r1 = 24, r2 = i % 2 ? 34 : 40
        const rad = (a * Math.PI) / 180
        return <path key={a} d={`M${50 + r1 * Math.cos(rad)} ${50 + r1 * Math.sin(rad)} L${50 + r2 * Math.cos(rad)} ${50 + r2 * Math.sin(rad)}`} />
      })}
    </svg>
  )
}

/** Three nested arches: the classic boho rainbow, echoing the Thikana doorway. */
export function Rainbow({ className = 'h-24 w-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" className={className} aria-hidden="true" fill="none" strokeLinecap="round">
      <path d="M10 68a50 50 0 0 1 100 0" stroke="#c2603a" strokeWidth="9" />
      <path d="M24 68a36 36 0 0 1 72 0" stroke="#dca43c" strokeWidth="9" />
      <path d="M38 68a22 22 0 0 1 44 0" stroke="#7c8768" strokeWidth="9" />
    </svg>
  )
}

/** Eight-petal block-print flower. */
export function Flower({ className = 'h-4 w-4', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill={color}>
      {[0, 45, 90, 135].map((r) => <ellipse key={r} cx="12" cy="12" rx="2.6" ry="9" transform={`rotate(${r} 12 12)`} opacity=".85" />)}
      <circle cx="12" cy="12" r="2.6" fill="#f6efe4" />
    </svg>
  )
}

export function Sprig({ className = 'h-10 w-10', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M8 54C22 40 34 24 52 6" />
      {[[16, 44], [24, 35], [32, 26], [40, 17]].map(([x, y]) => (
        <g key={x}>
          <path d={`M${x} ${y}c-8-1-12-6-12-10c6 0 11 4 12 10z`} fill={color} opacity=".25" />
          <path d={`M${x} ${y}c1-8 6-12 10-12c0 6-4 11-10 12z`} fill={color} opacity=".25" />
        </g>
      ))}
    </svg>
  )
}

/** Soft wave used as a section edge. Fill it with the colour of the section it sits on. */
export function Wave({ className = '', fill = 'currentColor', flip }: { className?: string; fill?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className={`block h-6 w-full sm:h-10 ${flip ? 'rotate-180' : ''} ${className}`} aria-hidden="true">
      <path d="M0 48V24C120 6 240 6 360 22s240 26 360 8S960 2 1080 18s240 24 360 6v24Z" fill={fill} />
    </svg>
  )
}
