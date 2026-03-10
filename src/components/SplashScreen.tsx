import React from "react";

type Props = {
  page: 1 | 2;
  onNext: () => void;
};

const HEADER = "ARCHIVE // EXOGESTATION SYSTEM INTERVIEW TRANSCRIPT // 2056";
const TITLE = "AFTER THE BODY";
const SUB = "An Interview in Seven Voices";
const AUTHOR = "Shay Duan  ·  03/2026";

const TEXT: Record<1 | 2, string> = {
  1: "Uterine replication technology matured in laboratory conditions about two decades ago.",
  2: "3 years ago, a commercial product called the ExoGestation System received regulatory approval. It is now part of 17 national healthcare systems.",
};

export default function SplashScreen({ page, onNext }: Props) {
  const C: React.CSSProperties = { textAlign: "center" };
  return (
    <div onClick={onNext} style={{ cursor: "default" }}>
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
          marginBottom: 48,
          ...C,
        }}
      >
        {SUB}
      </div>

      <div
        style={{
          color: "#b0c090",
          fontSize: 13,
          lineHeight: 2,
          maxWidth: 480,
          margin: "0 auto 56px auto",
          ...C,
        }}
      >
        {TEXT[page]}
      </div>

      <div
        style={{
          color: "#3a5a3a",
          fontSize: 10,
          letterSpacing: 2,
          marginBottom: 16,
          ...C,
        }}
      >
        PRESS ENTER TO CONTINUE
      </div>

      <div style={{ color: "#2a3a2a", fontSize: 10, ...C }}>{AUTHOR}</div>
    </div>
  );
}
