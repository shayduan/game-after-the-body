import React from "react";
import { CROSSREFS } from "../data/crossrefs";
import { SPEAKERS } from "../data/speakers";
import { hexToRgba, dimColor } from "../utils";

export type XrefPanelState = {
  keyword: string;
  fromSpeakerId: string;
  fromQId: number;
  anchorY: number; // clientY of the click
} | null;

type Props = {
  panel: XrefPanelState;
  onClose: () => void;
  onJump: (speakerId: string, questionId: number) => void;
};

export default function XrefPanel({ panel, onClose, onJump }: Props) {
  if (!panel) return null;
  const xref = CROSSREFS[panel.keyword];
  if (!xref) return null;

  // Position just below the clicked word, but clamp so it doesn't overflow viewport
  const PANEL_HEIGHT = 180;
  const OFFSET = 20;
  const rawTop = panel.anchorY + OFFSET;
  const maxTop = window.innerHeight - PANEL_HEIGHT - 16;
  const top = Math.min(rawTop, maxTop);

  const base: React.CSSProperties = {
    position: "fixed",
    top,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: 760,
    background: "#080d08",
    borderTop: "1px solid #1a3a1a",
    border: "1px solid #1a3a1a",
    borderRadius: 2,
    padding: "14px 40px 18px",
    zIndex: 100,
    boxSizing: "border-box" as const,
    boxShadow: "0 4px 24px rgba(0,0,0,0.7)",
  };

  const header = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
      }}
    >
      <span style={{ color: "#4ade80", fontSize: 10, letterSpacing: 3 }}>
        ⟷ {panel.keyword.toUpperCase()}
        <span style={{ color: "#2a4a2a" }}>
          {" "}
          · {xref.refs.length} {xref.refs.length > 2 ? "VOICES" : "OF 2"}
        </span>
      </span>
      <span
        onClick={onClose}
        style={{ color: "#3a5a3a", fontSize: 14, cursor: "pointer" }}
      >
        ×
      </span>
    </div>
  );

  if (xref.type === "chain") {
    return (
      <div style={base}>
        {header}
        <div style={{ display: "flex", gap: 12 }}>
          {xref.refs.map((ref, i) => {
            const sp = SPEAKERS.find((s) => s.id === ref.speakerId)!;
            const isCurrent =
              ref.speakerId === panel.fromSpeakerId &&
              ref.questionId === panel.fromQId;
            return (
              <div
                key={i}
                onClick={
                  isCurrent
                    ? undefined
                    : () => onJump(ref.speakerId, ref.questionId)
                }
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  border: `1px solid ${isCurrent ? "#1a2a1a" : hexToRgba(sp.color, 0.22)}`,
                  borderRadius: 2,
                  cursor: isCurrent ? "default" : "pointer",
                  opacity: isCurrent ? 0.35 : 1,
                }}
              >
                <div
                  style={{
                    color: isCurrent ? "#3a5a3a" : sp.color,
                    fontSize: 10,
                    fontWeight: "bold",
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  {sp.name}
                </div>
                <div style={{ color: "#3a5a3a", fontSize: 9, marginBottom: 8 }}>
                  Q{ref.questionId}
                </div>
                <div
                  style={{
                    color: isCurrent ? "#2a3a2a" : dimColor(sp.color, 0.85),
                    fontSize: 11,
                    fontStyle: "italic",
                    lineHeight: 1.6,
                  }}
                >
                  "{ref.excerpt}"
                </div>
                {!isCurrent && (
                  <div style={{ color: "#2a4a2a", fontSize: 9, marginTop: 8 }}>
                    → jump
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div
          style={{
            color: "#1e2e1e",
            fontSize: 9,
            marginTop: 10,
            textAlign: "center",
          }}
        >
          ESC to close
        </div>
      </div>
    );
  }

  return (
    <div style={base}>
      {header}
      {xref.refs.map((ref, i) => {
        const sp = SPEAKERS.find((s) => s.id === ref.speakerId)!;
        const isCurrent =
          ref.speakerId === panel.fromSpeakerId &&
          ref.questionId === panel.fromQId;
        return (
          <div
            key={i}
            onClick={
              isCurrent
                ? undefined
                : () => onJump(ref.speakerId, ref.questionId)
            }
            onMouseEnter={(e) => {
              if (!isCurrent)
                (e.currentTarget as HTMLDivElement).style.background =
                  hexToRgba(sp.color, 0.05);
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background =
                "transparent";
            }}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "baseline",
              padding: "5px 8px",
              marginBottom: 1,
              cursor: isCurrent ? "default" : "pointer",
              borderRadius: 2,
              opacity: isCurrent ? 0.3 : 1,
            }}
          >
            <span
              style={{
                color: sp.color,
                fontSize: 10,
                fontWeight: "bold",
                minWidth: 150,
                letterSpacing: 0.5,
              }}
            >
              {sp.name}
            </span>
            <span style={{ color: "#2a4a2a", fontSize: 9, minWidth: 20 }}>
              Q{ref.questionId}
            </span>
            <span
              style={{
                color: dimColor(sp.color, 0.8),
                fontSize: 11,
                fontStyle: "italic",
              }}
            >
              "{ref.excerpt}"
            </span>
            {!isCurrent && (
              <span
                style={{ color: "#2a4a2a", fontSize: 9, marginLeft: "auto" }}
              >
                →
              </span>
            )}
          </div>
        );
      })}
      <div
        style={{
          color: "#1e2e1e",
          fontSize: 9,
          marginTop: 10,
          textAlign: "center",
        }}
      >
        ESC to close · click to jump
      </div>
    </div>
  );
}
