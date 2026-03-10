import React from "react";
import { SPEAKERS } from "../data/speakers";
import { SPEAKER_POSITIONS, SPEAKER_SHORT_TITLES } from "../data/survey";
import type { SurveyResult } from "../data/types";

type Props = { result: SurveyResult };

export default function Compass({ result }: Props) {
  const SIZE = 240;
  const toX = (s: number) => ((s + 6) / 12) * SIZE;
  const toY = (s: number) => (1 - (s + 6) / 12) * SIZE;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        margin: "12px 0",
      }}
    >
      <div style={{ color: "#5a8a5a", fontSize: 10, letterSpacing: 2 }}>
        LIBERATES
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            color: "#5a8a5a",
            fontSize: 9,
            letterSpacing: 1,
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            userSelect: "none",
          }}
        >
          STRUCTURAL
        </div>
        <div
          style={{
            position: "relative",
            width: SIZE,
            height: SIZE,
            border: "1px solid #1e3a1e",
            background: "#090d09",
            flexShrink: 0,
          }}
        >
          {/* Axis lines */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 1,
              background: "#142214",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 1,
              background: "#142214",
            }}
          />
          {/* Quadrant labels */}
          <div
            style={{
              position: "absolute",
              top: 5,
              left: 5,
              color: "#1e3a1e",
              fontSize: 8,
              userSelect: "none",
            }}
          >
            SL
          </div>
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              color: "#1e3a1e",
              fontSize: 8,
              userSelect: "none",
            }}
          >
            IL
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 5,
              left: 5,
              color: "#1e3a1e",
              fontSize: 8,
              userSelect: "none",
            }}
          >
            SC
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 5,
              right: 5,
              color: "#1e3a1e",
              fontSize: 8,
              userSelect: "none",
            }}
          >
            IC
          </div>

          {/* Speaker dots + name + title */}
          {SPEAKERS.map((s) => {
            const pos = SPEAKER_POSITIONS[s.id];
            const x = toX(pos.individual);
            const y = toY(pos.liberate);
            const lastName = s.name.split(" ").slice(-1)[0];
            const shortTitle = SPEAKER_SHORT_TITLES[s.id];
            // nudge label left if near right edge
            const nearRight = x > SIZE * 0.72;
            return (
              <React.Fragment key={s.id}>
                <div
                  style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: s.color,
                    transform: "translate(-50%,-50%)",
                    opacity: 0.9,
                    zIndex: 1,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: nearRight ? x - 4 : x + 6,
                    top: y - 14,
                    transform: nearRight ? "translateX(-100%)" : undefined,
                    color: s.color,
                    fontSize: 7,
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                    opacity: 0.75,
                    pointerEvents: "none",
                    zIndex: 2,
                    textShadow: "0 0 6px #000, 0 0 3px #000",
                  }}
                >
                  <div>{lastName}</div>
                  <div style={{ opacity: 0.6 }}>{shortTitle}</div>
                </div>
              </React.Fragment>
            );
          })}

          {/* Player dot */}
          <div
            style={{
              position: "absolute",
              left: toX(result.individual),
              top: toY(result.liberate),
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#ffffff",
              boxShadow: "0 0 10px rgba(255,255,255,0.8)",
              transform: "translate(-50%,-50%)",
              zIndex: 3,
            }}
          />
          {/* YOU label */}
          <div
            style={{
              position: "absolute",
              left: toX(result.individual) + 8,
              top: toY(result.liberate) - 8,
              color: "#ffffff",
              fontSize: 7,
              opacity: 0.8,
              pointerEvents: "none",
              zIndex: 4,
              textShadow: "0 0 6px #000",
            }}
          >
            YOU
          </div>
        </div>
        <div
          style={{
            color: "#5a8a5a",
            fontSize: 9,
            letterSpacing: 1,
            writingMode: "vertical-rl",
            userSelect: "none",
          }}
        >
          INDIVIDUAL
        </div>
      </div>
      <div style={{ color: "#5a8a5a", fontSize: 10, letterSpacing: 2 }}>
        CONTROLS
      </div>
    </div>
  );
}
