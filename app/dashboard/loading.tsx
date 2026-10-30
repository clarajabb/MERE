export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="animate-pulse">
      <div className="h-3 w-24 rounded bg-rule" />
      <div className="mt-5 h-10 w-64 rounded bg-rule" />
      <div className="mt-12 space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-12 rounded bg-rule/60" />
        ))}
      </div>
    </div>
  );
}
