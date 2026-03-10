import React from "react";

const HEADER = "ARCHIVE // EXOGESTATION SYSTEM INTERVIEW TRANSCRIPT // 2056";
const TITLE = "AFTER THE BODY";
const SUB = "An Interview in Seven Voices";
const AUTHOR = "Shay Duan  ·  03/2026";

const SPLASH_LINES = [
  "Uterine replication technology matured in laboratory conditions two decades ago.",
  "Three years ago, a commercial product called the ExoGestation System received regulatory approval. It is now part of seventeen national healthcare systems.",
];

export const INTRO_LINES_ANIMATED = [
  "─────────────────────────────────────────────",
  "",
  "I interviewed seven people three years after it went commercial — different jobs, different circumstances, different positions in the system.",
  "",
  "Each got the same nine questions. Each had the right not to answer.",
  "",
  "This interview script was banned and never published.",
  "What you see here is the archive.",
  "",
  "─────────────────────────────────────────────",
];

type Props = {
  introLines: string[];
  introReady: boolean;
  introCursor: number;
  blink: boolean;
  skipAnimation: boolean;
  setIntroCursor: (i: number) => void;
  onEnterArchive: () => void;
  onTakeSurvey: () => void;
};

export default function IntroScreen({
  introLines,
  introReady,
  introCursor,
  blink,
  skipAnimation,
  setIntroCursor,
  onEnterArchive,
  onTakeSurvey,
}: Props) {
  const C: React.CSSProperties = { textAlign: "center" };

  const renderMenu = () => (
    <div style={{ marginTop: 24 }}>
      {(["ENTER ARCHIVE", "RUN YOUR STANDPOINT TEST"] as const).map(
        (opt, i) => (
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
        ),
      )}
      <div style={{ marginTop: 10, color: "#3a5a3a", fontSize: 10, ...C }}>
        ↑↓ NAVIGATE · ENTER SELECT
      </div>
      <div style={{ marginTop: 32, color: "#2a3a2a", fontSize: 10, ...C }}>
        {AUTHOR}
      </div>
    </div>
  );

  // — Skip animation: returning user, show everything at once —
  if (skipAnimation) {
    const allLines = [
      { text: "", dim: false },
      { text: "─────────────────────────────────────────────", dim: false },
      ...SPLASH_LINES.map((l) => ({ text: l, dim: true })),
      { text: "", dim: false },
      {
        text: "I interviewed seven people three years after it went commercial — different jobs, different circumstances, different positions in the system.",
        dim: false,
      },
      { text: "", dim: false },
      {
        text: "Each got the same nine questions. Each had the right not to answer.",
        dim: false,
      },
      { text: "", dim: false },
      {
        text: "This interview script was banned and never published.",
        dim: false,
      },
      { text: "What you see here is the archive.", dim: false },
      { text: "", dim: false },
      { text: "─────────────────────────────────────────────", dim: false },
    ];
    return (
      <div>
        <div
          style={{
            color: "#6a8a6a",
            fontSize: 11,
            letterSpacing: 2,
            marginBottom: 32,
            ...C,
          }}
        >
          {HEADER}
        </div>
        <div
          style={{
            color: "#4ade80",
            fontSize: 22,
            fontWeight: "bold",
            letterSpacing: 4,
            lineHeight: 1.4,
            ...C,
          }}
        >
          {TITLE}
        </div>
        <div
          style={{
            color: "#8aaa6a",
            fontSize: 13,
            letterSpacing: 1,
            lineHeight: 1.9,
            marginBottom: 28,
            ...C,
          }}
        >
          {SUB}
        </div>
        {allLines.map((line, i) => (
          <div
            key={i}
            style={{
              color: line.text.startsWith("─")
                ? "#333"
                : line.dim
                  ? "#4a6a4a"
                  : "#b0c090",
              fontSize: line.dim ? 11 : 13,
              lineHeight: 1.9,
              maxWidth: 560,
              margin: "0 auto",
              ...C,
            }}
          >
            {line.text || "\u00a0"}
          </div>
        ))}
        {renderMenu()}
      </div>
    );
  }

  // — Animated intro (first time) —
  return (
    <div>
      <div
        style={{
          color: "#6a8a6a",
          fontSize: 11,
          letterSpacing: 2,
          marginBottom: 32,
          ...C,
        }}
      >
        {HEADER}
      </div>
      <div
        style={{
          color: "#4ade80",
          fontSize: 22,
          fontWeight: "bold",
          letterSpacing: 4,
          lineHeight: 1.4,
          ...C,
        }}
      >
        {TITLE}
      </div>
      <div
        style={{
          color: "#8aaa6a",
          fontSize: 13,
          letterSpacing: 1,
          lineHeight: 1.9,
          marginBottom: 28,
          ...C,
        }}
      >
        {SUB}
      </div>

      {introLines.map((line, i) => {
        const isDivider = line.startsWith("─");
        const isEmpty = line === "";
        return (
          <div
            key={i}
            style={{
              color: isDivider ? "#333" : "#b0c090",
              fontSize: 13,
              lineHeight: 1.9,
              maxWidth: 560,
              margin: "0 auto",
              ...C,
            }}
          >
            {isEmpty ? "\u00a0" : line}
          </div>
        );
      })}

      {!introReady && (
        <div style={{ ...C, marginTop: 4 }}>
          <span style={{ opacity: blink ? 1 : 0, color: "#4ade80" }}>█</span>
        </div>
      )}

      {introReady && renderMenu()}
    </div>
  );
}
