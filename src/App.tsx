import { useState, useEffect, useRef, useCallback } from "react";

import type { Screen, Speaker, Question, SurveyResult } from "./data/types";
import { SPEAKERS } from "./data/speakers";
import { QUESTIONS } from "./data/questions";
import {
  SURVEY_QUESTIONS,
  getQuadrant,
  getClosestSpeakerId,
} from "./data/survey";
import { CROSSREFS } from "./data/crossrefs";

import IntroScreen from "./components/IntroScreen";
import QuestionsScreen from "./components/QuestionsScreen";
import SpeakersScreen from "./components/SpeakersScreen";
import AnswerView from "./components/AnswerView";
import XrefPanel, { type XrefPanelState } from "./components/XrefPanel";
import SurveyScreen from "./components/SurveyScreen";
import ResultScreen from "./components/ResultScreen";

const INTRO_LINE_COUNT = 14; // matches INTRO_LINES in IntroScreen

export default function App() {
  // ── Navigation ──────────────────────────────────────────────────
  const [screen, setScreen] = useState<Screen>("intro");
  const [qCursor, setQCursor] = useState(0);
  const [sCursor, setSCursor] = useState(0);
  const [introCursor, setIntroCursor] = useState(0);
  const [selectedQ, setSelectedQ] = useState<Question | null>(null);
  const [selectedS, setSelectedS] = useState<Speaker | null>(null);

  // ── Intro animation ──────────────────────────────────────────────
  const [introLines, setIntroLines] = useState<string[]>([]);
  const [introReady, setIntroReady] = useState(false);
  const [blink, setBlink] = useState(true);
  const lineTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

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

  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (screen !== "intro") return;
    setIntroLines([]);
    setIntroReady(false);
    lineTimers.current.forEach(clearTimeout);
    lineTimers.current = [];
    INTRO_LINES.forEach((line, i) => {
      const t = setTimeout(
        () => {
          setIntroLines((p) => [...p, line]);
          if (i === INTRO_LINES.length - 1) setIntroReady(true);
        },
        120 * i + (i > 3 ? 200 : 0),
      );
      lineTimers.current.push(t);
    });
    return () => lineTimers.current.forEach(clearTimeout);
  }, [screen]);

  // ── Archive state ────────────────────────────────────────────────
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [noteVisible, setNoteVisible] = useState(false);
  const [xrefPanel, setXrefPanel] = useState<XrefPanelState>(null);

  useEffect(() => {
    if (visited.size >= 7) setTimeout(() => setNoteVisible(true), 1200);
  }, [visited]);

  const markVisited = useCallback((ids: string[]) => {
    setVisited((p) => {
      const n = new Set(p);
      ids.forEach((id) => n.add(id));
      return n;
    });
  }, []);

  const toggleReveal = useCallback((id: string) => {
    setRevealed((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const handleXrefClick = useCallback(
    (keyword: string, speakerId: string, questionId: number) => {
      if (CROSSREFS[keyword])
        setXrefPanel({
          keyword,
          fromSpeakerId: speakerId,
          fromQId: questionId,
        });
    },
    [],
  );

  const jumpToAnswer = useCallback(
    (speakerId: string, questionId: number) => {
      const q = QUESTIONS.find((q) => q.id === questionId);
      const s = SPEAKERS.find((s) => s.id === speakerId);
      if (q && s) {
        setSelectedQ(q);
        setSelectedS(s);
        markVisited([speakerId]);
        setScreen("answer");
        setXrefPanel(null);
      }
    },
    [markVisited],
  );

  // ── Survey state ─────────────────────────────────────────────────
  const [surveyStep, setSurveyStep] = useState(0);
  const [surveyOptionCursor, setSurveyOptionCursor] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState<number[]>([]);
  const [surveyResult, setSurveyResult] = useState<SurveyResult | null>(null);
  const [resultSpeaker, setResultSpeaker] = useState<Speaker | null>(null);

  const startSurvey = useCallback(() => {
    setSurveyStep(0);
    setSurveyAnswers([]);
    setSurveyOptionCursor(0);
    setSurveyResult(null);
    setScreen("survey");
  }, []);

  const confirmSurveyOption = useCallback(() => {
    const score =
      SURVEY_QUESTIONS[surveyStep].options[surveyOptionCursor].score;
    const next = [...surveyAnswers, score];
    if (surveyStep < SURVEY_QUESTIONS.length - 1) {
      setSurveyAnswers(next);
      setSurveyStep(surveyStep + 1);
      setSurveyOptionCursor(0);
    } else {
      const lib = next.slice(0, 3).reduce((a, b) => a + b, 0);
      const ind = next.slice(3, 6).reduce((a, b) => a + b, 0);
      setSurveyResult({ individual: ind, liberate: lib });
      setResultSpeaker(
        SPEAKERS.find((s) => s.id === getClosestSpeakerId(ind, lib)) ?? null,
      );
      setScreen("result");
    }
  }, [surveyStep, surveyOptionCursor, surveyAnswers]);

  // ── Keyboard ──────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (xrefPanel) {
        if (e.key === "Escape") setXrefPanel(null);
        return;
      }

      if (screen === "intro" && introReady) {
        if (e.key === "ArrowUp") setIntroCursor((c) => (c - 1 + 2) % 2);
        else if (e.key === "ArrowDown") setIntroCursor((c) => (c + 1) % 2);
        else if (e.key === "Enter") {
          introCursor === 0 ? setScreen("questions") : startSurvey();
        }
        return;
      }
      if (screen === "questions") {
        if (e.key === "ArrowUp")
          setQCursor((c) => (c - 1 + QUESTIONS.length) % QUESTIONS.length);
        else if (e.key === "ArrowDown")
          setQCursor((c) => (c + 1) % QUESTIONS.length);
        else if (e.key === "Enter") {
          setSelectedQ(QUESTIONS[qCursor]);
          setSCursor(0);
          setScreen("speakers");
        } else if (e.key === "Escape") setScreen("intro");
        return;
      }
      if (screen === "speakers") {
        const total = SPEAKERS.length + 1;
        if (e.key === "ArrowUp") setSCursor((c) => (c - 1 + total) % total);
        else if (e.key === "ArrowDown") setSCursor((c) => (c + 1) % total);
        else if (e.key === "Enter") {
          if (sCursor === SPEAKERS.length) {
            markVisited(SPEAKERS.map((s) => s.id));
            setScreen("all");
          } else {
            setSelectedS(SPEAKERS[sCursor]);
            markVisited([SPEAKERS[sCursor].id]);
            setScreen("answer");
          }
        } else if (e.key === "Escape") setScreen("questions");
        return;
      }
      if (screen === "answer" || screen === "all") {
        if (e.key === "Escape" || e.key === "Enter") setScreen("speakers");
        return;
      }
      if (screen === "survey") {
        const n = SURVEY_QUESTIONS[surveyStep].options.length;
        if (e.key === "ArrowUp") setSurveyOptionCursor((c) => (c - 1 + n) % n);
        else if (e.key === "ArrowDown")
          setSurveyOptionCursor((c) => (c + 1) % n);
        else if (e.key === "Enter") confirmSurveyOption();
        else if (e.key === "Escape") setScreen("intro");
        return;
      }
      if (screen === "result") {
        if (e.key === "Escape") setScreen("intro");
        return;
      }
    },
    [
      screen,
      introReady,
      introCursor,
      qCursor,
      sCursor,
      surveyStep,
      surveyOptionCursor,
      xrefPanel,
      startSurvey,
      confirmSurveyOption,
      markVisited,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);
  useEffect(() => {
    containerRef.current?.focus();
  }, [screen]);

  // ── Render ────────────────────────────────────────────────────────
  const hasXref = screen === "answer" || screen === "all";

  return (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Courier New', Courier, monospace",
        padding: 16,
      }}
    >
      <div
        ref={containerRef}
        tabIndex={0}
        style={{
          width: "100%",
          maxWidth: 760,
          background: "#0f0f0f",
          border: "1px solid #2a2a2a",
          borderRadius: 4,
          padding: "32px 40px",
          minHeight: 520,
          boxShadow:
            "0 0 60px rgba(74,222,128,0.04), inset 0 0 80px rgba(0,0,0,0.5)",
          outline: "none",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* scanlines */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />

        {screen === "intro" && (
          <IntroScreen
            introLines={introLines}
            introReady={introReady}
            introCursor={introCursor}
            blink={blink}
            setIntroCursor={setIntroCursor}
            onEnterArchive={() => setScreen("questions")}
            onTakeSurvey={startSurvey}
          />
        )}

        {screen === "questions" && (
          <QuestionsScreen
            questions={QUESTIONS}
            qCursor={qCursor}
            noteVisible={noteVisible}
            setQCursor={setQCursor}
            onSelect={(q) => {
              setSelectedQ(q);
              setSCursor(0);
              setScreen("speakers");
            }}
            onBack={() => setScreen("intro")}
          />
        )}

        {screen === "speakers" && selectedQ && (
          <SpeakersScreen
            speakers={SPEAKERS}
            selectedQ={selectedQ}
            sCursor={sCursor}
            visited={visited}
            setSCursor={setSCursor}
            onSelectSpeaker={(s) => {
              setSelectedS(s);
              markVisited([s.id]);
              setScreen("answer");
            }}
            onViewAll={() => {
              markVisited(SPEAKERS.map((s) => s.id));
              setScreen("all");
            }}
            onBack={() => setScreen("questions")}
          />
        )}

        {(screen === "answer" || screen === "all") && selectedQ && (
          <div
            style={{
              paddingBottom: xrefPanel ? 160 : 0,
              transition: "padding-bottom 0.2s",
            }}
          >
            <AnswerView
              mode={screen === "answer" ? "single" : "all"}
              speakers={SPEAKERS}
              selectedQ={selectedQ}
              selectedS={selectedS}
              revealed={revealed}
              onToggleReveal={toggleReveal}
              onXrefClick={handleXrefClick}
              onBack={() => setScreen("speakers")}
            />
          </div>
        )}

        {screen === "survey" && (
          <SurveyScreen
            surveyStep={surveyStep}
            surveyOptionCursor={surveyOptionCursor}
            setSurveyOptionCursor={setSurveyOptionCursor}
            onConfirm={confirmSurveyOption}
          />
        )}

        {screen === "result" && surveyResult && (
          <ResultScreen
            surveyResult={surveyResult}
            resultSpeaker={resultSpeaker}
            onEnterArchive={(speakerId) => {
              const s = SPEAKERS.find((sp) => sp.id === speakerId);
              if (s) {
                setSelectedS(s);
                setSelectedQ(QUESTIONS[0]);
                setSCursor(SPEAKERS.findIndex((sp) => sp.id === speakerId));
                setScreen("speakers");
              }
            }}
            onRetake={startSurvey}
          />
        )}

        {hasXref && (
          <XrefPanel
            panel={xrefPanel}
            onClose={() => setXrefPanel(null)}
            onJump={jumpToAnswer}
          />
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`}</style>
    </div>
  );
}
