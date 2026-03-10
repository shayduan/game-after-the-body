import React from "react";
import { SURVEY_QUESTIONS } from "../data/survey";

type Props = {
  surveyStep: number;
  surveyOptionCursor: number;
  setSurveyOptionCursor: (i: number) => void;
  onConfirm: () => void;
};

export default function SurveyScreen({
  surveyStep,
  surveyOptionCursor,
  setSurveyOptionCursor,
  onConfirm,
}: Props) {
  const q = SURVEY_QUESTIONS[surveyStep];
  return (
    <div>
      <div
        style={{
          color: "#6a8a6a",
          fontSize: 11,
          letterSpacing: 2,
          marginBottom: 8,
          textAlign: "left",
        }}
      >
        STANDPOINT SURVEY · {surveyStep + 1} / {SURVEY_QUESTIONS.length}
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
        {SURVEY_QUESTIONS.map((_, i) => (
          <div
            key={i}
            style={{
              height: 2,
              flex: 1,
              background: i <= surveyStep ? "#4ade80" : "#1a2a1a",
              borderRadius: 1,
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <div
        style={{
          color: "#d0e0a8",
          fontSize: 14,
          lineHeight: 1.7,
          marginBottom: 28,
          textAlign: "left",
        }}
      >
        {q.text}
      </div>
      {q.options.map((opt, i) => (
        <div
          key={i}
          onClick={() => setSurveyOptionCursor(i)}
          onMouseEnter={() => setSurveyOptionCursor(i)}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: "10px 14px",
            marginBottom: 6,
            cursor: "pointer",
            borderRadius: 2,
            background:
              surveyOptionCursor === i
                ? "rgba(74,222,128,0.07)"
                : "transparent",
            border:
              surveyOptionCursor === i
                ? "1px solid rgba(74,222,128,0.25)"
                : "1px solid #1a2a1a",
          }}
        >
          <span
            style={{
              color: surveyOptionCursor === i ? "#4ade80" : "#666",
              fontSize: 11,
              marginTop: 2,
              minWidth: 14,
            }}
          >
            {surveyOptionCursor === i ? "▶" : String.fromCharCode(65 + i)}
          </span>
          <span
            style={{
              color: surveyOptionCursor === i ? "#c8e0a0" : "#a0b488",
              fontSize: 13,
              lineHeight: 1.6,
              textAlign: "left",
            }}
          >
            {opt.text}
          </span>
        </div>
      ))}
      <div style={{ marginTop: 8, textAlign: "left" }}>
        <span
          onClick={onConfirm}
          style={{
            color: "#4a6a4a",
            fontSize: 11,
            cursor: "pointer",
            letterSpacing: 1,
          }}
        >
          [ CONFIRM → ]
        </span>
      </div>
      <div
        style={{
          marginTop: 12,
          color: "#4a6a4a",
          fontSize: 10,
          textAlign: "left",
        }}
      >
        ↑↓ NAVIGATE · ENTER SELECT · ESC CANCEL
      </div>
    </div>
  );
}
