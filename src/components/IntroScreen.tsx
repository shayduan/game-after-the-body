import React from "react";

const INTRO_LINES = [
  "AFTER THE BODY",
  "An Interview in Seven Voices",
  "",
  "─────────────────────────────────────────────",
  "",
  "The ExoGestation System has been commercially available",
  "for three years. The following individuals agreed to be",
  "interviewed on the condition of thematic anonymity.",
  "",
  "The questions were the same for everyone.",
  "Not everyone answered.",
  "",
  "─────────────────────────────────────────────",
];

type Props = {
  introLines: string[];
  introReady: boolean;
  introCursor: number;
  blink: boolean;
  setIntroCursor: (i: number) => void;
  onEnterArchive: () => void;
  onTakeSurvey: () => void;
};

export default function IntroScreen({
  introLines,
  introReady,
  introCursor,
  blink,
  setIntroCursor,
  onEnterArchive,
  onTakeSurvey,
}: Props) {
  const C: React.CSSProperties = { textAlign: "center" };
  return (
    <div>
      <div
        style={{
          color: "#6a8a6a",
          fontSize: 11,
          letterSpacing: 2,
          marginBottom: 24,
          ...C,
        }}
      >
        ARCHIVE // EXOGESTATION SYSTEM INTERVIEW TRANSCRIPT // 2056
      </div>
      {introLines.map((line, i) => (
        <div
          key={i}
          style={{
            color:
              i === 0
                ? "#4ade80"
                : i === 1
                  ? "#8aaa6a"
                  : line.startsWith("─")
                    ? "#333"
                    : "#b0c090",
            fontSize: i === 0 ? 22 : 13,
            fontWeight: i === 0 ? "bold" : "normal",
            letterSpacing: i === 0 ? 4 : i === 1 ? 1 : 0,
            lineHeight: 1.9,
            ...C,
          }}
        >
          {line || "\u00a0"}
        </div>
      ))}

      {!introReady && (
        <div style={C}>
          <span style={{ opacity: blink ? 1 : 0, color: "#4ade80" }}>█</span>
        </div>
      )}

      {introReady && (
        <div style={{ marginTop: 24 }}>
          {(["ENTER ARCHIVE", "TAKE THE SURVEY"] as const).map((opt, i) => (
            <div
              key={i}
              onClick={() => {
                setIntroCursor(i);
                i === 0 ? onEnterArchive() : onTakeSurvey();
              }}
              onMouseEnter={() => setIntroCursor(i)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "7px 12px",
                marginBottom: 4,
                cursor: "pointer",
                borderRadius: 2,
                background:
                  introCursor === i ? "rgba(74,222,128,0.07)" : "transparent",
                border:
                  introCursor === i
                    ? "1px solid rgba(74,222,128,0.2)"
                    : "1px solid transparent",
              }}
            >
              <span
                style={{
                  color: introCursor === i ? "#4ade80" : "#555",
                  fontSize: 12,
                  minWidth: 14,
                }}
              >
                {introCursor === i ? "▶" : ""}
              </span>
              <span
                style={{
                  color: introCursor === i ? "#c8e8a0" : "#8aaa8a",
                  fontSize: 13,
                  letterSpacing: 1,
                }}
              >
                {opt}
              </span>
            </div>
          ))}
          <div style={{ marginTop: 10, color: "#3a5a3a", fontSize: 10, ...C }}>
            ↑↓ NAVIGATE · ENTER SELECT
          </div>
          <div style={{ marginTop: 32, color: "#2a3a2a", fontSize: 10, ...C }}>
            Shay Duan · 03/2026
          </div>
        </div>
      )}
    </div>
  );
}
