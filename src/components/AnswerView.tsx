import React from "react";
import { SILENCE } from "../data/types";
import type {
  AnswerLine,
  AnswerLines,
  RedactedSegment,
  Speaker,
  Question,
} from "../data/types";
import { ANSWER_XREFS } from "../data/crossrefs";
import { NO_REPLY } from "../data/speakers";
import { hexToRgba, dimColor, splitText } from "../utils";

type XrefPanelState = {
  keyword: string;
  fromSpeakerId: string;
  fromQId: number;
} | null;

type Props = {
  mode: "single" | "all";
  speakers: Speaker[];
  selectedQ: Question;
  selectedS?: Speaker | null;
  revealed: Set<string>;
  onToggleReveal: (id: string) => void;
  onXrefClick: (keyword: string, speakerId: string, questionId: number) => void;
  onBack: () => void;
};

function RedactedBlock({
  seg,
  speakerColor,
  revealed,
  onToggle,
}: {
  seg: RedactedSegment;
  speakerColor: string;
  revealed: Set<string>;
  onToggle: (id: string) => void;
}) {
  const open = revealed.has(seg.id);
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onToggle(seg.id);
      }}
      style={{
        background: open ? "transparent" : hexToRgba(speakerColor, 0.15),
        color: open ? "inherit" : "transparent",
        borderBottom: `1px solid ${hexToRgba(speakerColor, 0.4)}`,
        cursor: "pointer",
        userSelect: "none",
        padding: "0 2px",
        transition: "all 0.2s",
      }}
    >
      {open ? seg.text : "█".repeat(Math.ceil(seg.text.length * 0.65))}
    </span>
  );
}

function PlainText({
  text,
  speakerColor,
  speakerId,
  questionId,
  activeKeywords,
  onXrefClick,
}: {
  text: string;
  speakerColor: string;
  speakerId: string;
  questionId: number;
  activeKeywords: string[];
  onXrefClick: (keyword: string, speakerId: string, questionId: number) => void;
}) {
  const parts = splitText(text, activeKeywords);
  return (
    <>
      {parts.map((p, i) =>
        p.keyword ? (
          <span
            key={i}
            onClick={() => onXrefClick(p.keyword!, speakerId, questionId)}
            title={`cross-reference: ${p.keyword}`}
            style={{
              borderBottom: `1px dotted ${hexToRgba(speakerColor, 0.6)}`,
              cursor: "pointer",
            }}
          >
            {p.text}
          </span>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

function RenderLine({
  line,
  speakerId,
  questionId,
  speakerColor,
  bodyColor,
  activeKeywords,
  revealed,
  onToggleReveal,
  onXrefClick,
}: {
  line: AnswerLine;
  speakerId: string;
  questionId: number;
  speakerColor: string;
  bodyColor: string;
  activeKeywords: string[];
  revealed: Set<string>;
  onToggleReveal: (id: string) => void;
  onXrefClick: (keyword: string, speakerId: string, questionId: number) => void;
}) {
  if (line === SILENCE)
    return (
      <div style={{ height: 18, color: "#555", textAlign: "left" }}>
        [ ... ]
      </div>
    );

  if (typeof line === "string")
    return (
      <div
        style={{
          marginBottom: 4,
          lineHeight: 1.8,
          color: bodyColor,
          textAlign: "left",
        }}
      >
        <PlainText
          text={line}
          speakerColor={speakerColor}
          speakerId={speakerId}
          questionId={questionId}
          activeKeywords={activeKeywords}
          onXrefClick={onXrefClick}
        />
      </div>
    );

  // Array = mixed redacted/plain
  if (Array.isArray(line))
    return (
      <div
        style={{
          marginBottom: 4,
          lineHeight: 1.8,
          color: bodyColor,
          textAlign: "left",
        }}
      >
        {(line as (string | RedactedSegment)[]).map((seg, j) =>
          typeof seg === "string" ? (
            <span key={j}>
              <PlainText
                text={seg}
                speakerColor={speakerColor}
                speakerId={speakerId}
                questionId={questionId}
                activeKeywords={activeKeywords}
                onXrefClick={onXrefClick}
              />
            </span>
          ) : (
            <RedactedBlock
              key={j}
              seg={seg}
              speakerColor={speakerColor}
              revealed={revealed}
              onToggle={onToggleReveal}
            />
          ),
        )}
      </div>
    );
  return null;
}

function SpeakerAnswerBlock({
  speaker,
  questionId,
  lines,
  revealed,
  onToggleReveal,
  onXrefClick,
}: {
  speaker: Speaker;
  questionId: number;
  lines: AnswerLines;
  revealed: Set<string>;
  onToggleReveal: (id: string) => void;
  onXrefClick: (keyword: string, speakerId: string, questionId: number) => void;
}) {
  const bodyColor = dimColor(speaker.color, 0.92);
  const activeKeywords = ANSWER_XREFS[speaker.id]?.[`q${questionId}`] || [];

  if (!lines)
    return (
      <div style={{ color: "#888", fontStyle: "italic", textAlign: "left" }}>
        {NO_REPLY[speaker.id]}
      </div>
    );
  return (
    <>
      {lines.map((line, i) => (
        <RenderLine
          key={i}
          line={line}
          speakerId={speaker.id}
          questionId={questionId}
          speakerColor={speaker.color}
          bodyColor={bodyColor}
          activeKeywords={activeKeywords}
          revealed={revealed}
          onToggleReveal={onToggleReveal}
          onXrefClick={onXrefClick}
        />
      ))}
    </>
  );
}

export default function AnswerView({
  mode,
  speakers,
  selectedQ,
  selectedS,
  revealed,
  onToggleReveal,
  onXrefClick,
}: Props) {
  const prompt =
    "ENTER / ESC ← BACK  ·  CLICK ██ TO REVEAL  ·  DOTTED WORDS → CROSS-REFERENCE";

  if (mode === "single" && selectedS) {
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
          {prompt}
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
            color: "#a8b898",
            fontSize: 13,
            marginBottom: 20,
            lineHeight: 1.6,
            textAlign: "left",
          }}
        >
          {selectedQ.full}
        </div>
        <div
          style={{
            color: selectedS.color,
            fontSize: 14,
            fontWeight: "bold",
            letterSpacing: 1,
            marginBottom: 2,
            textAlign: "left",
          }}
        >
          {selectedS.name}
        </div>
        <div
          style={{
            color: "#8a9880",
            fontSize: 11,
            marginBottom: 20,
            textAlign: "left",
          }}
        >
          {selectedS.title}
        </div>
        <div
          style={{
            borderLeft: `2px solid ${hexToRgba(selectedS.color, 0.3)}`,
            paddingLeft: 16,
            fontSize: 13,
          }}
        >
          <SpeakerAnswerBlock
            speaker={selectedS}
            questionId={selectedQ.id}
            lines={selectedQ.answers[selectedS.id]}
            revealed={revealed}
            onToggleReveal={onToggleReveal}
            onXrefClick={onXrefClick}
          />
        </div>
        <div
          style={{
            marginTop: 32,
            color: "#444",
            fontSize: 11,
            textAlign: "left",
          }}
        >
          ─────────────────
        </div>
        <div
          style={{
            color: "#8aaa8a",
            fontSize: 11,
            marginTop: 8,
            textAlign: "left",
          }}
        >
          [ENTER] BACK
        </div>
      </div>
    );
  }

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
        {prompt}
      </div>
      <div
        style={{
          color: "#7a8870",
          fontSize: 11,
          marginBottom: 4,
          textAlign: "left",
        }}
      >
        Q{selectedQ.id} · ALL RESPONSES
      </div>
      <div
        style={{
          color: "#d0e0a8",
          fontSize: 14,
          marginBottom: 24,
          lineHeight: 1.6,
          textAlign: "left",
        }}
      >
        {selectedQ.full}
      </div>
      {speakers.map((s) => (
        <div key={s.id} style={{ marginBottom: 28 }}>
          <div
            style={{
              color: s.color,
              fontSize: 13,
              fontWeight: "bold",
              letterSpacing: 1,
              marginBottom: 2,
              textAlign: "left",
            }}
          >
            {s.name}
          </div>
          <div
            style={{
              borderLeft: `2px solid ${hexToRgba(s.color, 0.25)}`,
              paddingLeft: 12,
              fontSize: 12,
            }}
          >
            <SpeakerAnswerBlock
              speaker={s}
              questionId={selectedQ.id}
              lines={selectedQ.answers[s.id]}
              revealed={revealed}
              onToggleReveal={onToggleReveal}
              onXrefClick={onXrefClick}
            />
          </div>
        </div>
      ))}
      <div
        style={{ color: "#444", fontSize: 11, marginTop: 8, textAlign: "left" }}
      >
        ─────────────────
      </div>
      <div
        style={{
          color: "#8a9880",
          fontSize: 11,
          marginTop: 8,
          marginBottom: 4,
          textAlign: "left",
        }}
      >
        DID NOT REPLY:
      </div>
      <div style={{ color: "#8a9880", fontSize: 11, textAlign: "left" }}>
        {speakers
          .filter((s) => !selectedQ.answers[s.id])
          .map((s) => s.name)
          .join("  ·  ") || "everyone responded"}
      </div>
      <div
        style={{
          marginTop: 20,
          color: "#8aaa8a",
          fontSize: 11,
          textAlign: "left",
        }}
      >
        [ENTER] BACK
      </div>
    </div>
  );
}
