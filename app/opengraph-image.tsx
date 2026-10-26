import { ImageResponse } from "next/og";

export const alt = "MERE — Material claims deserve evidence.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#f6f3ec",
          color: "#17191a",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8.25" stroke="#2e4a3b" strokeWidth="1.5" />
            <path d="M4.5 12h15M4.5 9.5v5M19.5 9.5v5" stroke="#2e4a3b" strokeWidth="1.4" />
          </svg>
          <div style={{ fontSize: 34, letterSpacing: 8 }}>MERE</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, lineHeight: 1.02, letterSpacing: -2 }}>Material claims</div>
          <div style={{ display: "flex", fontSize: 92, lineHeight: 1.02, letterSpacing: -2 }}>
            deserve&nbsp;<span style={{ color: "#2e4a3b", fontStyle: "italic" }}>evidence.</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #cfc8b8",
            paddingTop: 24,
            fontSize: 22,
            color: "#6c6d68",
            fontFamily: "monospace",
            letterSpacing: 2,
          }}
        >
          <span>IN DEVELOPMENT · STARTING WITH CASHMERE</span>
          <span>mere.solutions</span>
        </div>
      </div>
    ),
    size,
  );
}
