import React from "react";
import type { SurveyResult, Speaker } from "../data/types";
import { QUADRANT_RESULTS, SPEAKER_QUOTES, getQuadrant } from "../data/survey";
import { hexToRgba, dimColor } from "../utils";
import Compass from "./Compass";

type Props = {
  surveyResult: SurveyResult;
  resultSpeaker: Speaker | null;
  onEnterArchive: (speakerId: string) => void;
  onRetake: () => void;
};

export default function ResultScreen({
  surveyResult,
  resultSpeaker,
  onEnterArchive,
  onRetake,
}: Props) {
  const quadrant = getQuadrant(surveyResult.individual, surveyResult.liberate);
  const qr = QUADRANT_RESULTS[quadrant];
  const sp = resultSpeaker;
  const C: React.CSSProperties = { textAlign: "center" };

  return (
    <div>
      <div
        style={{
          color: "#6a8a6a",
          fontSize: 11,
          letterSpacing: 3,
          marginBottom: 16,
          ...C,
        }}
      >
        YOUR POSITION
      </div>

      {/* Position label — prominent but not overwhelming */}
      <div
        style={{
          color: "#4ade80",
          fontSize: 15,
          fontWeight: "bold",
          letterSpacing: 3,
          marginBottom: 20,
          ...C,
        }}
      >
        {qr.label}
      </div>

      {/* Compass — always shows voices with names */}
      <div style={{ ...C }}>
        <Compass result={surveyResult} />
      </div>

      {/* Description */}
      <div
        style={{
          color: "#a0b488",
          fontSize: 12,
          lineHeight: 1.85,
          maxWidth: 560,
          margin: "20px auto",
          ...C,
        }}
      >
        {qr.description}
      </div>

      {/* Philosopher + Politician */}
      <div
        style={{
          display: "flex",
          gap: 12,
          margin: "20px auto",
          maxWidth: 560,
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "CLOSEST PHILOSOPHER", data: qr.philosopher },
          { label: "CLOSEST POLITICIAN", data: qr.politician },
        ].map(({ label, data }) => (
          <div
            key={label}
            style={{
              flex: 1,
              minWidth: 200,
              border: "1px solid #1a2a1a",
              padding: "12px 14px",
              borderRadius: 2,
            }}
          >
            <div
              style={{
                color: "#4a6a4a",
                fontSize: 9,
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              {label}
            </div>
            <div
              style={{
                color: "#c8e0a0",
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 6,
              }}
            >
              {data.name}
            </div>
            <div
              style={{
                color: "#7a9068",
                fontSize: 11,
                lineHeight: 1.65,
                fontStyle: "italic",
              }}
            >
              {data.thought}
            </div>
          </div>
        ))}
      </div>

      {/* Closest voice */}
      {sp && (
        <div
          style={{
            borderTop: "1px solid #1a2a1a",
            paddingTop: 20,
            marginTop: 8,
          }}
        >
          <div
            style={{
              color: "#5a7a5a",
              fontSize: 9,
              letterSpacing: 2,
              marginBottom: 12,
              ...C,
            }}
          >
            CLOSEST VOICE IN THE ARCHIVE
          </div>
          <div
            style={{
              color: sp.color,
              fontSize: 14,
              fontWeight: "bold",
              letterSpacing: 1,
              marginBottom: 4,
              ...C,
            }}
          >
            {sp.name}
          </div>
          <div
            style={{ color: "#7a8870", fontSize: 11, marginBottom: 14, ...C }}
          >
            {sp.title}
          </div>
          <div
            style={{
              color: dimColor(sp.color, 0.85),
              fontSize: 12,
              fontStyle: "italic",
              lineHeight: 1.7,
              maxWidth: 460,
              margin: "0 auto 20px auto",
              ...C,
            }}
          >
            {SPEAKER_QUOTES[sp.id]}
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => onEnterArchive(sp.id)}
              style={{
                background: "transparent",
                border: `1px solid ${hexToRgba(sp.color, 0.4)}`,
                color: sp.color,
                fontSize: 11,
                letterSpacing: 2,
                padding: "7px 18px",
                cursor: "pointer",
                borderRadius: 2,
                fontFamily: "inherit",
              }}
            >
              ENTER ARCHIVE →
            </button>
            <button
              onClick={onRetake}
              style={{
                background: "transparent",
                border: "1px solid #2a3a2a",
                color: "#6a8a6a",
                fontSize: 11,
                letterSpacing: 2,
                padding: "7px 18px",
                cursor: "pointer",
                borderRadius: 2,
                fontFamily: "inherit",
              }}
            >
              RETAKE
            </button>
          </div>
        </div>
      )}

      <div style={{ color: "#3a5a3a", fontSize: 10, marginTop: 24, ...C }}>
        ESC ← INTRO
      </div>
    </div>
  );
}
