// Small "available for work" pill with a live pulsing dot — a strong, quick
// signal for recruiters/clients. Server component (no interactivity).
export default function AvailabilityBadge({
  label,
  className = '',
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium tracking-wide text-frost-soft ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      {label}
    </span>
  );
}
