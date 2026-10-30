import { label } from "@/lib/format";

type Tone = "neutral" | "pending" | "positive" | "negative" | "muted";

const tones: Record<Tone, string> = {
  neutral: "border-rule-strong text-graphite",
  pending: "border-[#d9c9a3] bg-[#f7f0de] text-[#6b5520]",
  positive: "border-sage/60 bg-sage-soft text-forest",
  negative: "border-[#e2bfb6] bg-[#f6ebe6] text-[#7a2f24]",
  muted: "border-rule text-faint",
};

const toneFor: Record<string, Tone> = {
  DRAFT: "neutral",
  PENDING_TESTING: "pending",
  PENDING_REVIEW: "pending",
  SUPPLIER_DECLARED: "neutral",
  DOCUMENT_REVIEWED: "positive",
  INDEPENDENTLY_TESTED: "positive",
  VERIFIED: "positive",
  MERE_VERIFIED: "positive",
  REJECTED: "negative",
  ARCHIVED: "muted",
};

export function StatusBadge({ value }: { value: string }) {
  const tone = toneFor[value] ?? "neutral";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs whitespace-nowrap ${tones[tone]}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label(value)}
    </span>
  );
}

export function DemoTag() {
  return (
    <span
      title="Demonstration data"
      className="inline-flex items-center rounded-sm border border-ink/70 px-1.5 py-px font-mono text-[0.625rem] font-medium tracking-[0.12em] text-ink"
    >
      DEMO
    </span>
  );
}
