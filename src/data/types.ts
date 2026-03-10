export const SILENCE = "__SILENCE__";

export type RedactedSegment = { type: "redacted"; text: string; id: string };
export type AnswerSegment = string | RedactedSegment;
export type AnswerLine = typeof SILENCE | string | AnswerSegment[];
export type AnswerLines = AnswerLine[] | null;

export type Speaker = {
  id: string;
  name: string;
  title: string;
  color: string;
};

export type Question = {
  id: number;
  short: string;
  full: string;
  answers: Record<string, AnswerLines>;
};

export type XrefRef = {
  speakerId: string;
  questionId: number;
  excerpt: string;
};
export type XrefEntry = { type: "panel" | "chain"; refs: XrefRef[] };

export type Screen =
  | "intro"
  | "questions"
  | "speakers"
  | "answer"
  | "all"
  | "survey"
  | "result";

export type SurveyResult = { individual: number; liberate: number };

export type Quadrant = "IL" | "SL" | "IC" | "SC" | "center";

export type QuadrantResult = {
  label: string;
  description: string;
  philosopher: { name: string; thought: string };
  politician: { name: string; thought: string };
};
