import React from "react";
import type { Question } from "../data/types";

type Props = {
  questions: Question[];
  qCursor: number;
  noteVisible: boolean;
  setQCursor: (i: number) => void;
  onSelect: (q: Question) => void;
  onBack: () => void;
};

export default function QuestionsScreen({
  questions,
  qCursor,
  noteVisible,
  setQCursor,
  onSelect,
}: Props) {
  return (
    <div>
      <div
        style={{
          color: "#8aaa8a",
          fontSize: 11,
          letterSpacing: 2,
          marginBottom: 24,
          textAlign: "left",
        }}
      >
        SELECT A QUESTION · ↑↓ NAVIGATE · ENTER SELECT · ESC ← INTRO
      </div>
      {questions.map((q, i) => (
        <div
          key={q.id}
          onClick={() => {
            setQCursor(i);
            onSelect(q);
          }}
          onMouseEnter={() => setQCursor(i)}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: "8px 12px",
            marginBottom: 2,
            cursor: "pointer",
            borderRadius: 2,
            background: qCursor === i ? "rgba(74,222,128,0.07)" : "transparent",
            border:
              qCursor === i
                ? "1px solid rgba(74,222,128,0.2)"
                : "1px solid transparent",
          }}
        >
          <span style={{ color: "#6a8a6a", minWidth: 24, fontSize: 12 }}>
            Q{q.id}
          </span>
          <span
            style={{
              color: qCursor === i ? "#d4e8b0" : "#b0c090",
              fontSize: 13,
              lineHeight: 1.5,
              textAlign: "left",
            }}
          >
            {qCursor === i ? "▶ " : "  "}
            {q.short}
          </span>
        </div>
      ))}
      <div
        style={{
          color: "#3a5a3a",
          fontSize: 11,
          marginTop: 16,
          textAlign: "left",
        }}
      >
        ─────────────────────────────
      </div>
      <div
        style={{
          color: "#6a8a6a",
          fontSize: 11,
          marginTop: 8,
          textAlign: "left",
        }}
      >
        9 QUESTIONS · 7 VOICES · NOT EVERYONE ANSWERED
      </div>
      {noteVisible && (
        <div
          style={{
            color: "#3a4a3a",
            fontSize: 11,
            fontStyle: "italic",
            marginTop: 20,
            textAlign: "left",
            animation: "fadeIn 2s ease",
          }}
        >
          I conducted these interviews over four days in March 2056. I have not
          been able to reach Yolanda since.
        </div>
      )}
    </div>
  );
}
