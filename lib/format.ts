const LABELS: Record<string, string> = {
  // material_stage
  RAW_FIBER: "Raw fiber",
  YARN: "Yarn",
  FABRIC: "Fabric",
  GARMENT: "Garment",
  // material_status
  DRAFT: "Draft",
  PENDING_TESTING: "Pending testing",
  PENDING_REVIEW: "Pending review",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
  ARCHIVED: "Archived",
  // verification_status
  SUPPLIER_DECLARED: "Supplier declared",
  DOCUMENT_REVIEWED: "Document reviewed",
  INDEPENDENTLY_TESTED: "Independently tested",
  MERE_VERIFIED: "MERE verified",
  // source_type
  SUPPLIER_DECLARATION: "Supplier declaration",
  LAB_REPORT: "Lab report",
  MERE_TEST: "MERE test",
  THIRD_PARTY_CERTIFICATE: "Third-party certificate",
  TRACEABILITY_PLATFORM: "Traceability platform",
  FORENSIC_VERIFICATION: "Forensic verification",
  MANUAL_ENTRY: "Manual entry",
  // material_type
  CASHMERE: "Cashmere",
  WOOL: "Wool",
  ALPACA: "Alpaca",
  SILK: "Silk",
  COTTON: "Cotton",
  OTHER: "Other",
  // roles
  ADMIN: "Admin",
  REVIEWER: "Reviewer",
  DATA_ENTRY: "Data entry",
};

export function label(value: string | null | undefined) {
  if (!value) return "—";
  return LABELS[value] ?? value.charAt(0) + value.slice(1).toLowerCase().replaceAll("_", " ");
}

/** Formats a Postgres `date` (YYYY-MM-DD) without timezone drift. */
export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const d = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
