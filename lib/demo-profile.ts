/**
 * Hardcoded DEMONSTRATION data for the public landing page.
 *
 * These values are illustrative only. No laboratory testing or independent
 * verification was performed. This file is intentionally not connected to
 * Supabase or any other data source.
 */

export type DemoMeasurement = {
  parameter: string;
  value: string;
  unit: string;
};

export const demoProfile = {
  id: "MERE-CA-00000026",
  material: "DEMO — Mongolian Raw Cashmere Sample A",
  category: "Cashmere",
  stage: "Raw Fiber",
  status: "Draft / Pending Review",
  measurements: [
    { parameter: "Mean Fiber Diameter", value: "15.2", unit: "µm" },
    { parameter: "Mean Fiber Length", value: "38.5", unit: "mm" },
    { parameter: "Cashmere Content", value: "98.5", unit: "%" },
    { parameter: "Guard Hair Content", value: "1.2", unit: "%" },
    { parameter: "Fibers Over 30 Microns", value: "0.8", unit: "%" },
    { parameter: "Foreign Matter Content", value: "0.3", unit: "%" },
  ] satisfies DemoMeasurement[],
  evidence: [
    { item: "Testing method", state: "Not specified" },
    { item: "Laboratory report", state: "None attached" },
    { item: "Supporting documentation", state: "None attached" },
    { item: "Independent review", state: "Not started" },
  ],
} as const;

export const demoDisclaimer =
  "Illustrative demonstration data. No laboratory testing or independent verification was performed.";
