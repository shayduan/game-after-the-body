import type { Quadrant, QuadrantResult } from "./types";

export const SURVEY_QUESTIONS = [
  {
    id: "sq1",
    axis: "liberate",
    text: "The ExoGestation System is now available through your national healthcare system. You feel:",
    options: [
      { text: "Relief. This is what universal healthcare is for.", score: 2 },
      {
        text: "Cautiously optimistic — access matters, but I'd want to know the terms.",
        score: 1,
      },
      {
        text: "Wary. Healthcare systems have used reproductive technology to manage populations before.",
        score: -1,
      },
      {
        text: "The state now controls the infrastructure of human reproduction. That's not healthcare. That's leverage.",
        score: -2,
      },
    ],
  },
  {
    id: "sq2",
    axis: "liberate",
    text: "Which headline disturbs you more?",
    options: [
      {
        text: '"ExoGestation System priced out of reach for low-income families"',
        score: 2,
      },
      {
        text: '"Uneven access to ExoGestation System widens reproductive inequality"',
        score: 1,
      },
      {
        text: '"Employers found to informally pressure staff toward ExoGestation System"',
        score: -1,
      },
      {
        text: '"Government proposes mandatory ExoGestation enrollment for welfare recipients"',
        score: -2,
      },
    ],
  },
  {
    id: "sq3",
    axis: "liberate",
    text: "The technology has been available for ten years. You would call it a success if:",
    options: [
      {
        text: "Any person who wants to use it can, regardless of income or geography.",
        score: 2,
      },
      {
        text: "It has measurably reduced maternal mortality and pregnancy-related career penalties.",
        score: 1,
      },
      {
        text: "Its use is genuinely voluntary — no social, economic, or institutional pressure in either direction.",
        score: -1,
      },
      {
        text: "It has not been used to reduce abortion access, coerce any demographic, or concentrate reproductive power in fewer hands.",
        score: -2,
      },
    ],
  },
  {
    id: "sq4",
    axis: "individual",
    text: "A woman who worked as a surrogate for eight years has lost her income since the technology arrived. The problem is:",
    options: [
      {
        text: "She needs retraining support and financial assistance — practical help, quickly.",
        score: 2,
      },
      {
        text: "The industry she worked in disappeared without adequate transition planning.",
        score: 1,
      },
      {
        text: "Surrogacy was already a system where economic desperation shaped who did the work. This just made it visible.",
        score: -1,
      },
      {
        text: "She was always a symptom of a larger system that commodified reproductive labor. Her displacement revealed it.",
        score: -2,
      },
    ],
  },
  {
    id: "sq5",
    axis: "individual",
    text: "Someone tells you the technology has been transformative for women. You want to know:",
    options: [
      { text: "Whether the women using it feel more free.", score: 2 },
      {
        text: "Whether it has measurably improved outcomes — career, health, financial independence.",
        score: 1,
      },
      {
        text: "Which women, in which countries, at which income levels, under which governments.",
        score: -1,
      },
      {
        text: "Who owns the technology, who profits from it, and what happens when someone refuses.",
        score: -2,
      },
    ],
  },
  {
    id: "sq6",
    axis: "individual",
    text: "In 2055, a government uses the ExoGestation System to enforce population targets, mandating its use for certain groups. Who failed?",
    options: [
      {
        text: "That government. This is an abuse of a technology that is neutral in itself.",
        score: 2,
      },
      {
        text: "The regulatory frameworks that failed to anticipate and prevent this use.",
        score: 1,
      },
      {
        text: "The companies that built the infrastructure without asking who else might eventually control it.",
        score: -1,
      },
      {
        text: "Everyone who called it liberation without asking what liberation looks like when the state holds the machine.",
        score: -2,
      },
    ],
  },
];

export const SPEAKER_POSITIONS: Record<
  string,
  { individual: number; liberate: number }
> = {
  chen: { individual: 5, liberate: 4 },
  yolanda: { individual: -2, liberate: -1 },
  kessler: { individual: 1, liberate: -4 },
  river: { individual: 2, liberate: 2 },
  osei: { individual: -4, liberate: 3 },
  agnes: { individual: -2, liberate: 0 },
  claire: { individual: 4, liberate: -2 },
};

export const SPEAKER_SHORT_TITLES: Record<string, string> = {
  chen: "CEO",
  yolanda: "SURROGATE",
  kessler: "MINISTER",
  river: "BORN VIA",
  osei: "PROFESSOR",
  agnes: "GRANDMOTHER",
  claire: "OPS MGR",
};

export const SPEAKER_QUOTES: Record<string, string> = {
  chen: '"The biology was always just the delivery method."',
  yolanda:
    '"They finally admitted it was real work. Right when they stopped needing someone to do it."',
  kessler: '"The downstream projections are quite promising."',
  river: '"There was never really a choice. It was inevitable."',
  osei: '"I\'m genuinely uncertain whether we won or whether we were silenced."',
  agnes: '"I just kept waiting."',
  claire: '"Everything is much cleaner."',
};

export const QUADRANT_RESULTS: Record<Quadrant, QuadrantResult> = {
  IL: {
    label: "INDIVIDUAL · LIBERATES",
    description:
      "You locate this technology's meaning in the choices it opens for individuals — burdens removed, futures unlocked. This is the tradition of liberal bioethics and mainstream reproductive rights advocacy. The question your position leaves open: who owns the infrastructure of those choices, and what happens to people like Yolanda?",
    analyst: {
      name: "John Stuart Mill",
      thought:
        '"Over his own body and mind, the individual is sovereign." — On Liberty (1859). The philosophical foundation of reproductive autonomy as a right of self-ownership; the individual is the unit of analysis, and freedom is measured by what they can choose.',
    },
    practitioner: {
      name: "Ruth Bader Ginsburg",
      thought:
        "Framed reproductive rights as equal citizenship in practice — the right to control one's body as a prerequisite for equal participation in public life. Argued and won cases that made this framework law.",
    },
  },
  SL: {
    label: "STRUCTURAL · LIBERATES",
    description:
      "You want genuine liberation, which means changing who controls the technology, not just who can access it. Rights protect choices; justice asks whether the conditions for real choice exist. Firestone imagined this technology. She also said it only matters if women hold it.",
    analyst: {
      name: "Shulamith Firestone",
      thought:
        '"The seizure of the means of reproduction" — The Dialectic of Sex (1970). Argued that reproductive technology could end patriarchy, but only if women collectively held it. Analyzed the structure of reproductive oppression with precision; did not live to see whether her prescription held.',
    },
    practitioner: {
      name: "Loretta Ross",
      thought:
        "Co-founded the reproductive justice framework: the right to have children, not have children, and parent in safe environments. Moved the analysis from individual rights into structural organizing — built coalitions, changed policy, and insisted that justice required addressing the conditions that make choice real or fictional.",
    },
  },
  IC: {
    label: "INDIVIDUAL · CONTROLS",
    description:
      "You reason from outcomes — reduced friction, measurable gains, better numbers. By those measures, the technology has delivered. The question is whether individual-level improvements remain meaningful inside a system deploying the same infrastructure for other purposes elsewhere.",
    analyst: {
      name: "Frederick Winslow Taylor",
      thought:
        "Scientific management (1911): the body as a system to be optimized for productivity. Reproductive friction — leave, modified duties, informal accommodations — as an inefficiency to be engineered away. Taylor never wrote about reproduction. He didn't have to.",
    },
    practitioner: {
      name: "Sheryl Sandberg",
      thought:
        "Lean In (2013): women should adapt individually to existing structures; progress is measured in executive representation and personal advancement. Deployed this framework from inside one of the most powerful companies in the world, then watched it become policy in boardrooms globally.",
    },
  },
  SC: {
    label: "STRUCTURAL · CONTROLS",
    description:
      "You see power finding a new mechanism. The history of reproductive technology is the history of states managing populations. What Kessler calls 'enrollment incentives' has a long history under different names. The same analytical framework can be used to expose this — or to run it.",
    analyst: {
      name: "Michel Foucault",
      thought:
        "Biopolitics — The History of Sexuality (1976): the management of populations through the administration of life itself. The body as a site of state power, reproduction as a resource to be optimized. Foucault named the mechanism. He did not endorse it.",
    },
    practitioner: {
      name: "Viktor Orbán",
      thought:
        "Hungary's family policy offers cash incentives, tax exemptions, and subsidized loans for births — explicitly framed as a demographic strategy to avoid immigration. The state decides which reproduction to subsidize, and which populations to grow. The ExoGestation System is a more efficient version of the same instrument.",
    },
  },
  center: {
    label: "UNRESOLVED",
    description:
      "You sit near the center of every tension this technology surfaces. That is not a failure of conviction — it may be the most honest position available. The people at the edges of this grid are certain. Certainty, in this room, is its own kind of warning.",
    analyst: {
      name: "Hannah Arendt",
      thought:
        '"Judgment" in The Life of the Mind: the capacity to think in unprecedented situations without applying pre-existing rules. When there is no precedent, the hardest and most necessary thing is to think at all — without retreating into ideology.',
    },
    practitioner: {
      name: "(no clear alignment)",
      thought:
        "You resist easy political categorization. The speakers in this room who are most certain tend to have the most to gain from their certainty. You don't.",
    },
  },
};

export function getQuadrant(individual: number, liberate: number): Quadrant {
  if (Math.abs(individual) <= 1 && Math.abs(liberate) <= 1) return "center";
  if (individual >= 0 && liberate >= 0) return "IL";
  if (individual < 0 && liberate >= 0) return "SL";
  if (individual >= 0 && liberate < 0) return "IC";
  return "SC";
}

export function getClosestSpeakerId(
  individual: number,
  liberate: number,
): string {
  let closest = "chen";
  let minDist = Infinity;
  Object.entries(SPEAKER_POSITIONS).forEach(([id, pos]) => {
    const dist = Math.sqrt(
      (individual - pos.individual) ** 2 + (liberate - pos.liberate) ** 2,
    );
    if (dist < minDist) {
      minDist = dist;
      closest = id;
    }
  });
  return closest;
}
