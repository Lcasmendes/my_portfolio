// Shown via Suspense while a route's data/server component is loading.
// Generic skeleton matching the common page shape (heading + panels).
export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* heading */}
      <div className="mb-8">
        <div className="mb-3 h-3 w-32 rounded-sm bg-frost/10" />
        <div className="h-9 w-56 rounded-sm bg-frost/15" />
        <div className="mt-4 h-px w-40 bg-frost/15" />
      </div>

      {/* primary panel */}
      <div className="hud-panel p-6">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="h-72 w-full rounded-sm bg-frost/10 sm:w-2/5" />
          <div className="flex-1 space-y-3 self-center">
            <div className="h-3 w-24 rounded-sm bg-frost/10" />
            <div className="h-4 w-full rounded-sm bg-frost/10" />
            <div className="h-4 w-5/6 rounded-sm bg-frost/10" />
            <div className="h-4 w-2/3 rounded-sm bg-frost/10" />
            <div className="h-4 w-3/4 rounded-sm bg-frost/10" />
          </div>
        </div>
      </div>

      {/* secondary panel */}
      <div className="hud-panel mt-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-sm bg-frost/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
