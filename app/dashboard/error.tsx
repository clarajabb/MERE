"use client";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="py-20 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-4 font-serif text-3xl font-light text-ink">This page could not be loaded.</h1>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-full border border-rule-strong px-4 py-2 text-sm text-ink hover:border-ink"
      >
        Try again
      </button>
    </div>
  );
}
