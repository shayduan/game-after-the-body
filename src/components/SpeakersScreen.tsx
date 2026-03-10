import React from "react";
import type { Speaker, Question } from "../data/types";
import { hexToRgba } from "../utils";

type Props = {
  speakers: Speaker[];
  selectedQ: Question;
  sCursor: number;
  visited: Set<string>;
  setSCursor: (i: number) => void;
  onSelectSpeaker: (s: Speaker) => void;
  onViewAll: () => void;
  onBack: () => void;
};

export default function SpeakersScreen({
  speakers,
  selectedQ,
  sCursor,
  visited,
  setSCursor,
  onSelectSpeaker,
  onViewAll,
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
        ESC ← QUESTIONS · ↑↓ NAVIGATE · ENTER SELECT
      </div>
      <div
        style={{
          color: "#7a8870",
          fontSize: 11,
          marginBottom: 4,
          textAlign: "left",
        }}
      >
        Q{selectedQ.id}
      </div>
      <div
        style={{
          color: "#d0e0a8",
          fontSize: 15,
          marginBottom: 24,
          lineHeight: 1.6,
          textAlign: "left",
        }}
      >
        {selectedQ.full}
      </div>
      {speakers.map((s, i) => {
        const hasAnswer = !!selectedQ.answers[s.id];
        return (
          <div
            key={s.id}
            onClick={() => {
              setSCursor(i);
              onSelectSpeaker(s);
            }}
            onMouseEnter={() => setSCursor(i)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "7px 12px",
              marginBottom: 2,
              cursor: "pointer",
              borderRadius: 2,
              background:
                sCursor === i ? hexToRgba(s.color, 0.07) : "transparent",
              border:
                sCursor === i
                  ? `1px solid ${hexToRgba(s.color, 0.2)}`
                  : "1px solid transparent",
            }}
          >
            <span
              style={{
                color: sCursor === i ? s.color : "#555",
                fontSize: 12,
                minWidth: 16,
              }}
            >
              {sCursor === i ? "▶" : "·"}
            </span>
            <span
              style={{
                color: hasAnswer
                  ? sCursor === i
                    ? s.color
                    : "#b0c090"
                  : "#555",
                fontSize: 13,
              }}
            >
              {s.name}
            </span>
            <span style={{ color: "#7a8870", fontSize: 11 }}>{s.title}</span>
            {visited.has(s.id) && hasAnswer && (
              <span
                style={{ color: "#2a4a2a", fontSize: 9, marginLeft: "auto" }}
              >
                ●
              </span>
            )}
            {!hasAnswer && (
              <span style={{ color: "#555", fontSize: 10, marginLeft: "auto" }}>
                —
              </span>
            )}
          </div>
        );
      })}
      <div
        onClick={onViewAll}
        onMouseEnter={() => setSCursor(speakers.length)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "7px 12px",
          marginTop: 8,
          cursor: "pointer",
          borderRadius: 2,
          background:
            sCursor === speakers.length
              ? "rgba(74,222,128,0.07)"
              : "transparent",
          border:
            sCursor === speakers.length
              ? "1px solid rgba(74,222,128,0.2)"
              : "1px solid transparent",
        }}
      >
        <span
          style={{
            color: sCursor === speakers.length ? "#4ade80" : "#555",
            fontSize: 12,
            minWidth: 16,
          }}
        >
          {sCursor === speakers.length ? "▶" : "·"}
        </span>
        <span
          style={{
            color: sCursor === speakers.length ? "#4ade80" : "#6a8a6a",
            fontSize: 13,
          }}
        >
          VIEW ALL RESPONSES
        </span>
      </div>
    </div>
  );
}
