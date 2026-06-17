// Small glacial chip used for tech/skill labels.
export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-frost/20 bg-frost/5 px-2.5 py-1 text-xs tracking-wide text-frost-soft transition-colors hover:border-accent/50 hover:bg-accent/10 hover:text-accent-bright">
      {children}
    </span>
  );
}
