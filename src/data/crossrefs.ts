import type { XrefEntry } from "./types";

export const CROSSREFS: Record<string, XrefEntry> = {
  body: {
    type: "panel",
    refs: [
      {
        speakerId: "yolanda",
        questionId: 2,
        excerpt: "My body knew what to do even when I didn't",
      },
      {
        speakerId: "river",
        questionId: 4,
        excerpt: "the body that could have held me",
      },
      {
        speakerId: "osei",
        questionId: 4,
        excerpt: "The pregnant body was an argument",
      },
      {
        speakerId: "yolanda",
        questionId: 6,
        excerpt: "The body is there. The body does the thing.",
      },
    ],
  },
  mother: {
    type: "panel",
    refs: [
      {
        speakerId: "yolanda",
        questionId: 6,
        excerpt: "I carried twelve children. I am not their mother.",
      },
      {
        speakerId: "river",
        questionId: 6,
        excerpt: "The woman who raised me is my mother.",
      },
      {
        speakerId: "osei",
        questionId: 6,
        excerpt: "Legal mother. Genetic mother. Gestational mother.",
      },
      {
        speakerId: "chen",
        questionId: 7,
        excerpt: "free in a way their mothers were not",
      },
    ],
  },
  free: {
    type: "panel",
    refs: [
      {
        speakerId: "osei",
        questionId: 3,
        excerpt: "freedom from the tyranny of reproductive biology",
      },
      {
        speakerId: "chen",
        questionId: 7,
        excerpt: "the women who use it are free",
      },
      {
        speakerId: "yolanda",
        questionId: 7,
        excerpt: "It freed women from needing me.",
      },
    ],
  },
  choice: {
    type: "chain",
    refs: [
      {
        speakerId: "chen",
        questionId: 1,
        excerpt: "we gave people a choice they have never had before",
      },
      {
        speakerId: "river",
        questionId: 8,
        excerpt: "There was never really a choice.",
      },
    ],
  },
  afraid: {
    type: "chain",
    refs: [
      {
        speakerId: "chen",
        questionId: 8,
        excerpt: "I'm afraid of governments.",
      },
      {
        speakerId: "agnes",
        questionId: 8,
        excerpt: "I'm afraid my granddaughter won't know",
      },
    ],
  },
  inevitable: {
    type: "chain",
    refs: [
      { speakerId: "river", questionId: 8, excerpt: "It was inevitable." },
      {
        speakerId: "osei",
        questionId: 9,
        excerpt: "Whether any of this was inevitable.",
      },
    ],
  },
};

// Map speakerId + questionId → active keywords
export const ANSWER_XREFS: Record<string, Record<string, string[]>> = {};
Object.entries(CROSSREFS).forEach(([keyword, { refs }]) => {
  refs.forEach(({ speakerId, questionId }) => {
    if (!ANSWER_XREFS[speakerId]) ANSWER_XREFS[speakerId] = {};
    const qk = `q${questionId}`;
    if (!ANSWER_XREFS[speakerId][qk]) ANSWER_XREFS[speakerId][qk] = [];
    if (!ANSWER_XREFS[speakerId][qk].includes(keyword))
      ANSWER_XREFS[speakerId][qk].push(keyword);
  });
});

export const KEYWORD_PATTERNS: { keyword: string; re: RegExp }[] = [
  { keyword: "body", re: /\b(bod(?:y|ies))\b/gi },
  { keyword: "mother", re: /\b(mothers?)\b/gi },
  { keyword: "free", re: /\b(free(?:d|dom|ly)?)\b/gi },
  { keyword: "choice", re: /\b(choices?)\b/gi },
  { keyword: "afraid", re: /\b(afraid)\b/gi },
  { keyword: "inevitable", re: /\b(inevitable)\b/gi },
];
