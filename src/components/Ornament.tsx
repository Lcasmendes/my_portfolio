// Classical filigree ornaments — corner flourishes and a centered divider.
// Pure presentational SVG; colour comes from the surrounding `text-frost*`.

const CORNER_POSITIONS = [
  'left-0 top-0',
  'right-0 top-0 rotate-90',
  'right-0 bottom-0 rotate-180',
  'left-0 bottom-0 -rotate-90',
];

// Four refined corner pieces for a panel/frame.
export function Corners({ className = 'text-frost/45' }: { className?: string }) {
  return (
    <>
      {CORNER_POSITIONS.map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`pointer-events-none absolute ${pos} ${className}`}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M2.5 11 L2.5 2.5 L11 2.5"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M2.5 2.5 L8 8"
              stroke="currentColor"
              strokeWidth="0.7"
              opacity="0.5"
            />
            <circle cx="2.5" cy="2.5" r="1.2" fill="currentColor" />
          </svg>
        </span>
      ))}
    </>
  );
}

// Horizontal divider with a central diamond motif and tapering rules.
export function OrnamentDivider({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center gap-3 ${className}`}>
      <span
        className="h-px flex-1"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(174,188,205,0.4))',
        }}
      />
      <svg
        width="46"
        height="10"
        viewBox="0 0 46 10"
        fill="none"
        className="shrink-0 text-frost"
      >
        <path d="M2 5 H15" stroke="currentColor" strokeWidth="1" opacity="0.55" />
        <path
          d="M23 1 L27 5 L23 9 L19 5 Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="23" cy="5" r="1.3" fill="currentColor" />
        <path d="M31 5 H44" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      </svg>
      <span
        className="h-px flex-1"
        style={{
          background:
            'linear-gradient(90deg, rgba(174,188,205,0.4), transparent)',
        }}
      />
    </div>
  );
}

// Small left-aligned flourish used under section titles.
export function Flourish({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="120"
      height="12"
      viewBox="0 0 120 12"
      fill="none"
      className={`text-frost ${className}`}
    >
      <path d="M0 6 H40" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M48 2 L52 6 L48 10 L44 6 Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="48" cy="6" r="1.4" fill="currentColor" />
      <path d="M56 6 H110" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <circle cx="114" cy="6" r="1.2" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
