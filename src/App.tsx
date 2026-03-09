import { useState, useEffect, useRef, useCallback } from "react";

const SILENCE = "__SILENCE__";
const R = (text, id) => ({ type: "redacted", text, id });

// ── Cross-reference data ─────────────────────────────────────────
const CROSSREFS = {
  body: {
    type: "panel",
    refs: [
      { speakerId: "yolanda", questionId: 2, excerpt: "My body knew what to do even when I didn't" },
      { speakerId: "river",   questionId: 4, excerpt: "the body that could have held me" },
      { speakerId: "osei",    questionId: 4, excerpt: "The pregnant body was an argument" },
      { speakerId: "yolanda", questionId: 6, excerpt: "The body is there. The body does the thing." },
    ]
  },
  mother: {
    type: "panel",
    refs: [
      { speakerId: "yolanda", questionId: 6, excerpt: "I am not their mother" },
      { speakerId: "river",   questionId: 6, excerpt: "The woman who raised me is my mother" },
      { speakerId: "osei",    questionId: 6, excerpt: "Legal mother. Genetic mother. Gestational mother." },
      { speakerId: "chen",    questionId: 7, excerpt: "free in a way their mothers were not" },
    ]
  },
  free: {
    type: "panel",
    refs: [
      { speakerId: "osei",    questionId: 3, excerpt: "freedom from the tyranny of reproductive biology" },
      { speakerId: "chen",    questionId: 7, excerpt: "the women who use it are free" },
      { speakerId: "yolanda", questionId: 7, excerpt: "It freed women from pregnancy. And from needing me." },
    ]
  },
  choice: {
    type: "chain",
    refs: [
      { speakerId: "chen",  questionId: 1, excerpt: "we gave people a choice they have never had before" },
      { speakerId: "river", questionId: 8, excerpt: "There was never really a choice." },
    ]
  },
  afraid: {
    type: "chain",
    refs: [
      { speakerId: "chen",  questionId: 8, excerpt: "I'm afraid of governments" },
      { speakerId: "agnes", questionId: 8, excerpt: "I'm afraid my granddaughter won't know" },
    ]
  },
  inevitable: {
    type: "chain",
    refs: [
      { speakerId: "river", questionId: 8, excerpt: "It was inevitable." },
      { speakerId: "osei",  questionId: 9, excerpt: "Whether any of this was inevitable" },
    ]
  },
};

// Build answer → active keywords lookup
const ANSWER_XREFS = {};
Object.entries(CROSSREFS).forEach(([keyword, { refs }]) => {
  refs.forEach(({ speakerId, questionId }) => {
    if (!ANSWER_XREFS[speakerId]) ANSWER_XREFS[speakerId] = {};
    const qk = `q${questionId}`;
    if (!ANSWER_XREFS[speakerId][qk]) ANSWER_XREFS[speakerId][qk] = [];
    if (!ANSWER_XREFS[speakerId][qk].includes(keyword)) ANSWER_XREFS[speakerId][qk].push(keyword);
  });
});

// Keyword regex patterns
const KEYWORD_PATTERNS = [
  { keyword: "body",       re: /\b(bod(?:y|ies))\b/gi },
  { keyword: "mother",     re: /\b(mothers?)\b/gi },
  { keyword: "free",       re: /\b(free(?:d|dom|ly)?)\b/gi },
  { keyword: "choice",     re: /\b(choices?)\b/gi },
  { keyword: "afraid",     re: /\b(afraid)\b/gi },
  { keyword: "inevitable", re: /\b(inevitable)\b/gi },
];

function splitText(text, activeKeywords) {
  if (!activeKeywords?.length) return [{ text, keyword: null }];
  const matches = [];
  KEYWORD_PATTERNS.filter(kp => activeKeywords.includes(kp.keyword)).forEach(({ keyword, re }) => {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null)
      matches.push({ index: m.index, end: m.index + m[0].length, text: m[0], keyword });
  });
  if (!matches.length) return [{ text, keyword: null }];
  matches.sort((a, b) => a.index - b.index);
  const deduped = [matches[0]];
  for (let i = 1; i < matches.length; i++)
    if (matches[i].index >= deduped[deduped.length - 1].end) deduped.push(matches[i]);
  const parts = [];
  let last = 0;
  deduped.forEach(m => {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), keyword: null });
    parts.push({ text: m.text, keyword: m.keyword });
    last = m.end;
  });
  if (last < text.length) parts.push({ text: text.slice(last), keyword: null });
  return parts;
}

// ── Speakers ─────────────────────────────────────────────────────
const SPEAKERS = [
  { id: "chen",    name: "DR. MARA CHEN",    title: "Co-founder & CEO, Genesis Biosciences",   color: "#4ade80" },
  { id: "yolanda", name: "YOLANDA",          title: "Former gestational surrogate",            color: "#facc15" },
  { id: "kessler", name: "MINISTER KESSLER", title: "Minister of Reproductive Health Policy",  color: "#60a5fa" },
  { id: "river",   name: "RIVER",            title: "Age 17. Born via replicator.",            color: "#f472b6" },
  { id: "osei",    name: "DR. FATIMA OSEI",  title: "Professor of Feminist Theory",            color: "#c084fc" },
  { id: "agnes",   name: "AGNES",            title: "Grandmother",                            color: "#fb923c" },
  { id: "claire",  name: "CLAIRE PARK",      title: "Senior Operations Manager",              color: "#2dd4bf" },
];

// ── Questions ────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1, short: "What does this technology do?",
    full: "Q1.  Can you describe what this technology does — in your own words?",
    answers: {
      chen: [
        "It completes a pregnancy outside the human body. Safely, reliably, without risk to the gestational parent.",
        "We created a biological environment that supports fetal development from implantation to birth.",
        "But I'd put it more simply: we gave people a choice they have never had before.",
        [R("The independent review we commissioned", "chen-q1-r1"), " confirmed no long-term developmental variance. We chose not to publish the full methodology."],
      ],
      yolanda: ["It does what I used to do."],
      kessler: [
        "The ExoGestation System — that's the clinical designation — provides a regulated, medically supervised alternative to in-vivo gestation.",
        "It has significant implications for public health, workforce participation, and reproductive equity.",
        "We are still developing the full policy architecture.",
      ],
      river:  ["It made me.", SILENCE, "I'm assuming that's what you're asking."],
      osei:   null,
      agnes:  null,
      claire: [
        "From an organizational standpoint, it eliminates a significant variable in workforce planning.",
        "Employees who choose to use it don't require modified duties, extended leave, or — and this is important — the informal accommodations that were never officially tracked but everyone knows happened.",
      ],
    }
  },
  {
    id: 2, short: "What does pregnancy mean to you?",
    full: "Q2.  What does pregnancy mean to you?",
    answers: {
      chen: [
        "I've had two. One was beautiful. One put me in the hospital for six weeks.",
        "I nearly lost my company and my life at the same time.",
        SILENCE,
        "When people ask why I built this — that's the answer. I wanted my daughter to never have to choose.",
      ],
      yolanda: [
        "It was the one thing I was completely certain of. My body knew what to do even when I didn't.",
        "I've been pregnant seven times — three of mine, four for other families — and every time, there was a moment around week nine when I felt completely calm.",
        "Like I was exactly where I was supposed to be.",
        SILENCE,
        "I haven't felt that since.",
      ],
      kessler: null,
      river: [
        "I've read about it. I've watched videos. I've asked my mom — my mother, the one who raised me — and she tries to explain it.",
        "She says it's like being a house for someone.",
        "I keep thinking about that. Being a house.",
        "And then the house doesn't exist and you're still you.",
      ],
      osei: [
        "I wrote my dissertation arguing that pregnancy was the primary site of women's oppression.",
        "That until gestation was externalized, no liberation was complete.",
        "I still believe that.",
        "I think.",
        SILENCE,
        "My sister is pregnant right now. Voluntarily. No medical reason not to use the replicator. She just wanted to.",
        "I've been trying very hard not to have an opinion about that.",
      ],
      agnes: [
        "The second time — with my daughter — I felt her move at seventeen weeks.",
        "It was a Tuesday. I was doing the dishes and I just stood there.",
        SILENCE,
        "I don't know how to explain that to someone.",
      ],
      claire: null,
    }
  },
  {
    id: 3, short: "Who does this technology free, and from what?",
    full: "Q3.  Who does this technology free, and from what?",
    answers: {
      chen: [
        "Women. From the biological penalty of ambition.",
        "From the impossible arithmetic of timing a career and a body.",
        "We are the only mammals expected to do both simultaneously, at peak performance.",
        "And we are the first company in history to say: you don't have to.",
      ],
      yolanda: [SILENCE, "Not me."],
      kessler: [
        "It offers reproductive parity we have never seen before. Male and female partners experience parenthood without the physical asymmetry that has historically — and economically — disadvantaged women.",
        ["The downstream projections are quite promising. The ", R("classified cross-ministry impact assessment", "kessler-q3-r1"), " estimates a 34% increase in female workforce retention by 2061."],
        [R("We expect to introduce enrollment incentives for certain categories of civil servant within the next parliamentary term.", "kessler-q3-r2")],
      ],
      river:  null,
      osei: [
        "Firestone said it in 1970. She said liberation required freedom from the tyranny of reproductive biology.",
        "She was right.",
        "And then I watched what happened when the technology actually arrived.",
        SILENCE,
        "Who controls the machine that replaced the body?",
        "Have we answered that?",
        "I haven't seen the answer.",
      ],
      agnes:  null,
      claire: [
        "My last hire — brilliant, 31 — came in and asked about her equity package.",
        "Not her maternity policy. Her equity package.",
        SILENCE,
        "That's new.",
      ],
    }
  },
  {
    id: 4, short: "Who disappears when the pregnant body is no longer necessary?",
    full: "Q4.  Who disappears when the pregnant body is no longer necessary?",
    answers: {
      chen: null,
      yolanda: [
        "I had a name for what I did. A profession.",
        "People called it 'just carrying' — like it was a footnote. Just. Like it was nothing.",
        "And then the machine arrived and suddenly everyone had to explain why they didn't need me anymore, and they all got very quiet and used words like 'transition' and 'retraining.'",
        "Like I was a coal miner.",
        SILENCE,
        [R("They offered me compensation. I won't say how much because I signed something. But I will say it was less than what the machine costs to lease for one cycle.", "yolanda-q4-r1")],
        SILENCE,
        "What I keep coming back to is: they finally admitted it was real work.",
        "Right when they stopped needing someone to do it.",
      ],
      kessler: [
        "The surrogacy sector has experienced significant disruption.",
        "We are working with affected workers on retraining pathways.",
        "It is a genuine challenge.",
      ],
      river: [
        "I think — when people ask me this — they're trying to figure out if I'm sad about it.",
        "If I feel something missing.",
        "And I don't know how to answer because I can't miss something I never had.",
        SILENCE,
        "But I do sometimes think about the body that could have held me.",
        "And didn't.",
        "And I wonder about that body.",
        "Whether she thinks about me.",
      ],
      osei: [
        "The pregnant body was an argument. Visible, undeniable, inconvenient.",
        "It had to be accommodated and legislated and resented and celebrated.",
        "It occupied space in a way that could not be ignored.",
        "And now that argument has been removed from the room.",
        SILENCE,
        "I'm genuinely uncertain whether we won or whether we were silenced.",
      ],
      agnes: [
        "My daughter didn't gain weight. She didn't buy new clothes. She didn't have to stop running.",
        "I kept waiting for her to look different and she never did.",
        SILENCE,
        "I love my grandchild more than anything. I want to be clear about that.",
        "I just kept waiting.",
      ],
      claire: [
        "Complexity disappears. Scheduling conflicts. The informal favours, the covered shifts, the things that don't appear in an HR report but everyone knows happened.",
        "The resentment, too, sometimes — I'm not proud to say it, but there was resentment.",
        "That's gone now.",
        "Everything is much cleaner.",
      ],
    }
  },
  {
    id: 5, short: "Can this technology be owned? Should it?",
    full: "Q5.  Can this technology be owned? Should it?",
    answers: {
      chen: [
        "The technology, absolutely — we hold forty-seven patents.",
        "The outcome? Never. We are very explicit about that in our service agreements.",
        ["The child born from a Genesis unit belongs to ", R("the primary contractual party as designated at point of purchase", "chen-q5-r1"), ". Full stop."],
        "Though I will admit our legal team spent three years writing that sentence.",
      ],
      yolanda: null,
      kessler: [
        "Ownership is complex, and actively under legislation.",
        "What I can say is that the state has a clear interest in ensuring access is equitable — that this technology does not create new hierarchies of reproduction.",
        ["Whether it becomes a public utility — that conversation is ongoing. The ", R("draft framework circulated last quarter", "kessler-q5-r1"), " uses the word 'compulsory' in three places. We are reviewing the language."],
      ],
      river:  null,
      osei: [
        "We had this argument about IVF and answered it badly.",
        "Embryos are sitting in legal limbo in clinics around the world — frozen, disputed, orphaned — because we never resolved the question of what they were.",
        "This is that problem, raised to an order of magnitude we haven't calculated.",
        SILENCE,
        "The answer we give to 'can it be owned' will determine the answer to almost every other question.",
        "And we are nowhere close.",
      ],
      agnes:  null,
      claire: null,
    }
  },
  {
    id: 6, short: "What makes someone a mother?",
    full: "Q6.  What makes someone a mother?",
    answers: {
      chen: [
        "Intention.",
        "You chose this child. You planned this child. You will love this child.",
        "That is everything.",
        "The biology was always just the delivery method.",
      ],
      yolanda: [
        SILENCE,
        "I thought I knew. I thought it was the body.",
        "I thought that was the one answer that couldn't be argued with.",
        "The body is there. The body does the thing. The body knows.",
        SILENCE,
        "I carried twelve children. I am not their mother.",
        "So the body isn't the answer either.",
        SILENCE,
        "I genuinely don't know anymore.",
        "I used to think not knowing was frightening.",
        "Now I think the people who are certain are the frightening ones.",
      ],
      kessler: null,
      river: [
        "The woman who raised me is my mother. That's not complicated.",
        SILENCE,
        "But I have a donor somewhere. An egg donor.",
        "And sometimes — when I'm sick, or when I did something I'm really proud of — I think: does she think about me?",
        "She probably doesn't.",
        "That's fine.",
        "I just think about it.",
      ],
      osei: [
        "Legal mother. Genetic mother. Gestational mother. Intentional mother. Social mother.",
        "We have spent fifty years adding categories and removing none of the old ones.",
        "The replicator just added a new one while leaving everyone else's claim intact.",
        "We have never done the subtraction.",
        "We have only ever added.",
      ],
      agnes: [
        "My daughter told me she knew before the test came back.",
        "She just knew.",
        "I believed her.",
        "I had the same thing.",
        SILENCE,
        "Whether that means anything, I couldn't tell you.",
      ],
      claire: null,
    }
  },
  {
    id: 7, short: "Is this technology feminist?",
    full: "Q7.  Is this technology feminist?",
    answers: {
      chen: [
        "Yes. Without question.",
        "We designed it for women, it benefits women, and the women who use it are free in a way their mothers were not.",
        "The data is very clear.",
      ],
      yolanda: [
        "It freed women from pregnancy.",
        "It also freed women from needing me.",
        SILENCE,
        "I'll let you decide what that means.",
      ],
      kessler: null,
      river:   null,
      osei: [
        "I published a paper in 2019 arguing this technology would be the final liberation.",
        "I've been trying to retract it for three years.",
        "Not because I was wrong about what the technology could do — but because I was naive about who would control it, who would access it, and which governments would make it mandatory to increase birth rates by 2031.",
        SILENCE,
        "Firestone didn't account for the state.",
        "Neither did I.",
      ],
      agnes:  null,
      claire: [
        "I'm a woman and I think it's been transformative for women in the workplace.",
        SILENCE,
        "Does that count as feminist?",
        SILENCE,
        "I'm genuinely asking.",
      ],
    }
  },
  {
    id: 8, short: "What are you afraid this technology will be used for?",
    full: "Q8.  What are you afraid this technology will be used for?",
    answers: {
      chen: [
        "Honestly? I'm afraid of governments.",
        "The moment a state gets full control of this infrastructure — who gets access, on what terms, for what purposes — we've handed over something we cannot take back.",
        SILENCE,
        [R("Two member states have already proposed mandatory enrollment for women in specific income brackets.", "chen-q8-r1"), " We received the proposals directly. We have not yet responded."],
        "We are already integrated into seventeen national healthcare systems.",
        "I think about that.",
      ],
      yolanda: null,
      kessler: [
        "Misuse by private interests is our primary concern.",
        "Commodification. The creation of reproductive tiers based on income.",
        "We are building regulatory frameworks to prevent that.",
      ],
      river: [
        "I think it's already being used for exactly what it was always going to be used for.",
        "There was never really a choice.",
        "It was inevitable.",
      ],
      osei:  ["Eugenics doesn't need a new name to be eugenics.", "It just needs better branding and a government subsidy."],
      agnes: [
        "I'm afraid my granddaughter won't know what I know.",
        "And I'm afraid I can't explain what that is, because I don't have the words for it.",
        SILENCE,
        "I just have the feeling.",
      ],
      claire: [
        "I've seen the memos. Not at my company — I want to be clear.",
        "But I have friends at other organizations, and I've seen the memos.",
        "There are companies building informal expectations around this.",
        "Nothing written down. Nothing that could be cited in a tribunal.",
        "Just expectations.",
        SILENCE,
        ["The company is ", R("a name you would recognize", "claire-q8-r1"), ". The memo is dated ", R("six weeks before the public launch", "claire-q8-r2"), "."],
        "That's what I'm afraid of. Not the technology. The memos.",
      ],
    }
  },
  {
    id: 9, short: "What question do you wish I had asked you?",
    full: "Q9.  What question do you wish I had asked you?",
    answers: {
      chen:    null,
      yolanda: ["Whether I miss it."],
      kessler: null,
      river: [
        "Whether I'm okay.",
        SILENCE,
        "I am, by the way.",
        "I just thought you might want to know.",
        "Nobody asks.",
      ],
      osei: [
        "Whether any of this was inevitable.",
        "Whether we chose this, or whether we were so busy arguing about whether it was feminist that we simply let it become infrastructure before we'd decided if it was good.",
        SILENCE,
        "I think that's the question I'm trying to answer now.",
        "In my work. In my life.",
        "I haven't gotten there.",
      ],
      agnes: [
        "I would have liked you to ask me what it felt like.",
        "When she moved.",
        "Nobody asks that anymore.",
        SILENCE,
        "Seventeen weeks. A Tuesday. The dishes.",
      ],
      claire: null,
    }
  },
];

const NO_REPLY = {
  chen:    "(no response. DR. CHEN checked her phone.)",
  yolanda: "(Yolanda didn't answer. She looked out the window for a long time.)",
  kessler: "(The Minister declined to respond to this question.)",
  river:   "(River shrugged. Didn't say anything.)",
  osei:    "(DR. OSEI paused. Said she needed to think about it. Never came back to it.)",
  agnes:   "(Agnes shook her head slowly. That was all.)",
  claire:  "(No response recorded.)",
};

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
  "",
  "[ PRESS ANY KEY TO ENTER ]",
];

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}
function dimColor(hex, a = 0.9) {
  return `rgb(${Math.round(parseInt(hex.slice(1,3),16)*a)},${Math.round(parseInt(hex.slice(3,5),16)*a)},${Math.round(parseInt(hex.slice(5,7),16)*a)})`;
}

export default function TerminalGame() {
  const [screen, setScreen]           = useState("intro");
  const [introLines, setIntroLines]   = useState([]);
  const [introReady, setIntroReady]   = useState(false);
  const [selectedQ, setSelectedQ]     = useState(null);
  const [selectedS, setSelectedS]     = useState(null);
  const [qCursor, setQCursor]         = useState(0);
  const [sCursor, setSCursor]         = useState(0);
  const [blink, setBlink]             = useState(true);
  const [revealed, setRevealed]       = useState(new Set());
  const [visited, setVisited]         = useState(new Set());
  const [noteVisible, setNoteVisible] = useState(false);
  const [xrefPanel, setXrefPanel]     = useState(null);
  const containerRef = useRef(null);
  const lineTimers   = useRef([]);

  useEffect(() => { const t = setInterval(() => setBlink(b => !b), 530); return () => clearInterval(t); }, []);

  useEffect(() => {
    if (screen !== "intro") return;
    setIntroLines([]); setIntroReady(false);
    lineTimers.current.forEach(clearTimeout); lineTimers.current = [];
    INTRO_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setIntroLines(p => [...p, line]);
        if (i === INTRO_LINES.length - 1) setIntroReady(true);
      }, 120 * i + (i > 3 ? 200 : 0));
      lineTimers.current.push(t);
    });
    return () => lineTimers.current.forEach(clearTimeout);
  }, [screen]);

  useEffect(() => { if (visited.size >= 7) setTimeout(() => setNoteVisible(true), 1200); }, [visited]);

  const markVisited = useCallback(ids => {
    setVisited(p => { const n = new Set(p); ids.forEach(id => n.add(id)); return n; });
  }, []);

  const jumpToAnswer = useCallback((speakerId, questionId) => {
    const q = QUESTIONS.find(q => q.id === questionId);
    const s = SPEAKERS.find(s => s.id === speakerId);
    if (q && s) { setSelectedQ(q); setSelectedS(s); markVisited([speakerId]); setScreen("answer"); setXrefPanel(null); }
  }, [markVisited]);

  const handleXrefClick = useCallback((keyword, fromSpeakerId, fromQId) => {
    const xref = CROSSREFS[keyword];
    if (!xref) return;
    setXrefPanel({ keyword, type: xref.type, refs: xref.refs, fromSpeakerId, fromQId });
  }, []);

  const handleKey = useCallback(e => {
    if (xrefPanel) { if (e.key === "Escape") setXrefPanel(null); return; }
    if (screen === "intro" && introReady) { setScreen("questions"); return; }
    if (screen === "questions") {
      if (e.key === "ArrowUp")        setQCursor(c => Math.max(0, c - 1));
      else if (e.key === "ArrowDown") setQCursor(c => Math.min(QUESTIONS.length - 1, c + 1));
      else if (e.key === "Enter")     { setSelectedQ(QUESTIONS[qCursor]); setSCursor(0); setScreen("speakers"); }
      else if (e.key === "Escape" || e.key === "Backspace") setScreen("intro");
    }
    if (screen === "speakers") {
      if (e.key === "ArrowUp")        setSCursor(c => Math.max(0, c - 1));
      else if (e.key === "ArrowDown") setSCursor(c => Math.min(SPEAKERS.length, c + 1));
      else if (e.key === "Enter") {
        if (sCursor === SPEAKERS.length) { markVisited(SPEAKERS.map(s => s.id)); setScreen("all"); }
        else { setSelectedS(SPEAKERS[sCursor]); markVisited([SPEAKERS[sCursor].id]); setScreen("answer"); }
      }
      else if (e.key === "Escape" || e.key === "Backspace") setScreen("questions");
    }
    if (screen === "answer" || screen === "all") {
      if (e.key === "Escape" || e.key === "Backspace" || e.key === "Enter") setScreen("speakers");
    }
  }, [screen, introReady, qCursor, sCursor, xrefPanel, markVisited]);

  useEffect(() => { window.addEventListener("keydown", handleKey); return () => window.removeEventListener("keydown", handleKey); }, [handleKey]);
  useEffect(() => { if (containerRef.current) containerRef.current.focus(); }, [screen]);

  const toggleReveal = id => setRevealed(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const renderSeg = (seg, speakerColor) => {
    const open = revealed.has(seg.id);
    return (
      <span key={seg.id} onClick={e => { e.stopPropagation(); toggleReveal(seg.id); }}
        style={{ background: open ? "transparent" : hexToRgba(speakerColor, 0.15), color: open ? "inherit" : "transparent", borderBottom: `1px solid ${hexToRgba(speakerColor, 0.4)}`, cursor: "pointer", userSelect: "none", padding: "0 2px", transition: "all 0.2s" }}
      >{open ? seg.text : "█".repeat(Math.ceil(seg.text.length * 0.65))}</span>
    );
  };

  const renderText = (text, activeKeywords, speakerId, questionId, bodyColor, speakerColor) => {
    const parts = splitText(text, activeKeywords);
    return parts.map((p, i) => {
      if (!p.keyword) return <span key={i} style={{ color: bodyColor }}>{p.text}</span>;
      return (
        <span key={i}
          onClick={() => handleXrefClick(p.keyword, speakerId, questionId)}
          title={`cross-reference: ${p.keyword}`}
          style={{ color: bodyColor, borderBottom: `1px dotted ${hexToRgba(speakerColor, 0.6)}`, cursor: "pointer" }}
        >{p.text}</span>
      );
    });
  };

  const renderLine = (line, i, speakerColor, bodyColor, activeKeywords, speakerId, questionId) => {
    if (line === SILENCE) return <div key={i} style={{ height: 18, color: "#555", textAlign: "left" }}>[ ... ]</div>;
    if (typeof line === "string") return (
      <div key={i} style={{ marginBottom: 4, lineHeight: 1.8, textAlign: "left" }}>
        {renderText(line, activeKeywords, speakerId, questionId, bodyColor, speakerColor)}
      </div>
    );
    if (Array.isArray(line)) return (
      <div key={i} style={{ marginBottom: 4, lineHeight: 1.8, textAlign: "left" }}>
        {line.map((seg, j) => typeof seg === "string"
          ? <span key={j}>{renderText(seg, activeKeywords, speakerId, questionId, bodyColor, speakerColor)}</span>
          : renderSeg(seg, speakerColor)
        )}
      </div>
    );
    return null;
  };

  const renderAnswerLines = (speakerId, questionId, lines) => {
    const sp = SPEAKERS.find(s => s.id === speakerId);
    const bodyColor = sp ? dimColor(sp.color, 0.9) : "#b0c090";
    const activeKeywords = ANSWER_XREFS[speakerId]?.[`q${questionId}`] || [];
    if (!lines) return <div style={{ color: "#777", fontStyle: "italic", textAlign: "left" }}>{NO_REPLY[speakerId]}</div>;
    return lines.map((line, i) => renderLine(line, i, sp?.color, bodyColor, activeKeywords, speakerId, questionId));
  };

  // ── XRef Panel ───────────────────────────────────────────────────
  const renderXrefPanel = () => {
    if (!xrefPanel) return null;
    const { keyword, type, refs, fromSpeakerId, fromQId } = xrefPanel;
    const panelBase: React.CSSProperties = {
      position: "absolute", bottom: 0, left: 0, right: 0,
      background: "#080d08",
      borderTop: "1px solid #1a3a1a",
      padding: "14px 40px 18px",
      zIndex: 20,
    };
    const header = (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ color: "#4ade80", fontSize: 10, letterSpacing: 3 }}>
          ⟷&nbsp;&nbsp;{keyword.toUpperCase()}&nbsp;&nbsp;
          <span style={{ color: "#2a4a2a" }}>{refs.length} {refs.length > 2 ? "VOICES" : "OF 2"}</span>
        </span>
        <span onClick={() => setXrefPanel(null)} style={{ color: "#3a5a3a", fontSize: 14, cursor: "pointer", lineHeight: 1 }}>×</span>
      </div>
    );

    if (type === "chain") {
      return (
        <div style={panelBase}>
          {header}
          <div style={{ display: "flex", gap: 12 }}>
            {refs.map((ref, i) => {
              const sp = SPEAKERS.find(s => s.id === ref.speakerId);
              const isCurrent = ref.speakerId === fromSpeakerId && ref.questionId === fromQId;
              return (
                <div key={i}
                  onClick={isCurrent ? undefined : () => jumpToAnswer(ref.speakerId, ref.questionId)}
                  style={{ flex: 1, padding: "10px 12px", border: `1px solid ${isCurrent ? "#1a2a1a" : hexToRgba(sp.color, 0.22)}`, borderRadius: 2, cursor: isCurrent ? "default" : "pointer", opacity: isCurrent ? 0.35 : 1, transition: "opacity 0.2s" }}
                >
                  <div style={{ color: isCurrent ? "#3a5a3a" : sp.color, fontSize: 10, fontWeight: "bold", letterSpacing: 1, marginBottom: 4 }}>{sp.name}</div>
                  <div style={{ color: "#3a5a3a", fontSize: 9, marginBottom: 8 }}>Q{ref.questionId}</div>
                  <div style={{ color: isCurrent ? "#2a3a2a" : dimColor(sp.color, 0.85), fontSize: 11, fontStyle: "italic", lineHeight: 1.6 }}>"{ref.excerpt}"</div>
                  {!isCurrent && <div style={{ color: "#2a4a2a", fontSize: 9, marginTop: 8 }}>→ jump</div>}
                </div>
              );
            })}
          </div>
          <div style={{ color: "#1e2e1e", fontSize: 9, marginTop: 10, textAlign: "center" }}>ESC to close</div>
        </div>
      );
    }

    // panel (3+)
    return (
      <div style={panelBase}>
        {header}
        {refs.map((ref, i) => {
          const sp = SPEAKERS.find(s => s.id === ref.speakerId);
          const isCurrent = ref.speakerId === fromSpeakerId && ref.questionId === fromQId;
          return (
            <div key={i}
              onClick={isCurrent ? undefined : () => jumpToAnswer(ref.speakerId, ref.questionId)}
              onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = hexToRgba(sp.color, 0.05); }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              style={{ display: "flex", gap: 12, alignItems: "baseline", padding: "5px 8px", marginBottom: 1, cursor: isCurrent ? "default" : "pointer", borderRadius: 2, opacity: isCurrent ? 0.3 : 1, transition: "all 0.1s" }}
            >
              <span style={{ color: sp.color, fontSize: 10, fontWeight: "bold", minWidth: 150, letterSpacing: 0.5 }}>{sp.name}</span>
              <span style={{ color: "#2a4a2a", fontSize: 9, minWidth: 20 }}>Q{ref.questionId}</span>
              <span style={{ color: dimColor(sp.color, 0.8), fontSize: 11, fontStyle: "italic" }}>"{ref.excerpt}"</span>
              {!isCurrent && <span style={{ color: "#2a4a2a", fontSize: 9, marginLeft: "auto", whiteSpace: "nowrap" }}>→</span>}
            </div>
          );
        })}
        <div style={{ color: "#1e2e1e", fontSize: 9, marginTop: 10, textAlign: "center" }}>ESC to close  ·  click to jump</div>
      </div>
    );
  };

  const C: React.CSSProperties = { textAlign: "center" };
  const L: React.CSSProperties = { textAlign: "left" };
  const promptStyle: React.CSSProperties = { color: "#5a7a5a", fontSize: 11, letterSpacing: 2, marginBottom: 24, ...C };
  const tagStyle: React.CSSProperties    = { color: "#556655", fontSize: 11, marginBottom: 4, ...L };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Courier New',Courier,monospace", padding: 16 }}>
      <div ref={containerRef} tabIndex={0}
        style={{ width: "100%", maxWidth: 760, background: "#0f0f0f", border: "1px solid #2a2a2a", borderRadius: 4, padding: "32px 40px", minHeight: 520, boxShadow: "0 0 60px rgba(74,222,128,0.04)", outline: "none", position: "relative", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px)", pointerEvents: "none", zIndex: 10 }}/>

        {/* INTRO */}
        {screen === "intro" && (
          <div>
            <div style={{ color: "#4a6a4a", fontSize: 11, letterSpacing: 2, marginBottom: 24, ...C }}>
              ARCHIVE // EXOGESTATION SYSTEM INTERVIEW TRANSCRIPT // 2056
            </div>
            {introLines.map((line, i) => (
              <div key={i} style={{ color: i===0?"#4ade80":i===1?"#7a9a6a":line.startsWith("─")?"#333":line.startsWith("[")?"#4ade80":"#9aaa8a", fontSize: i===0?22:13, fontWeight: i===0?"bold":"normal", letterSpacing: i===0?4:i===1?1:0, lineHeight: 1.9, ...C }}>
                {line || "\u00a0"}
              </div>
            ))}
            {introReady && <div style={C}><span style={{ opacity: blink?1:0, color: "#4ade80" }}>█</span></div>}
          </div>
        )}

        {/* QUESTIONS */}
        {screen === "questions" && (
          <div>
            <div style={promptStyle}>SELECT A QUESTION  ·  ↑↓ NAVIGATE  ·  ENTER SELECT  ·  ESC ← INTRO</div>
            {QUESTIONS.map((q, i) => (
              <div key={q.id}
                onClick={() => { setQCursor(i); setSelectedQ(q); setSCursor(0); setScreen("speakers"); }}
                onMouseEnter={() => setQCursor(i)}
                style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "8px 12px", marginBottom: 2, cursor: "pointer", borderRadius: 2, background: qCursor===i?"rgba(74,222,128,0.07)":"transparent", border: qCursor===i?"1px solid rgba(74,222,128,0.2)":"1px solid transparent" }}
              >
                <span style={{ color: "#4a6a4a", minWidth: 24, fontSize: 12 }}>Q{q.id}</span>
                <span style={{ color: qCursor===i?"#d4e8b0":"#8a9a7a", fontSize: 13, lineHeight: 1.5, ...L }}>{qCursor===i?"▶ ":"  "}{q.short}</span>
                {visited.size > 0 && SPEAKERS.some(s => q.answers[s.id] && visited.has(s.id)) && (
                  <span style={{ marginLeft: "auto", color: "#2a4a2a", fontSize: 10 }}>●</span>
                )}
              </div>
            ))}
            <div style={{ color: "#333", fontSize: 11, marginTop: 16, ...C }}>─────────────────────────────</div>
            <div style={{ color: "#4a6a4a", fontSize: 11, marginTop: 8, ...C }}>9 QUESTIONS  ·  7 VOICES  ·  NOT EVERYONE ANSWERED</div>
            {noteVisible && (
              <div style={{ color: "#3a4a3a", fontSize: 11, fontStyle: "italic", marginTop: 20, ...C, animation: "fadeIn 2s ease" }}>
                I conducted these interviews over four days in March 2056. I have not been able to reach Yolanda since.
              </div>
            )}
          </div>
        )}

        {/* SPEAKERS */}
        {screen === "speakers" && selectedQ && (
          <div>
            <div style={promptStyle}>ESC ← QUESTIONS  ·  ↑↓ NAVIGATE  ·  ENTER SELECT</div>
            <div style={tagStyle}>Q{selectedQ.id}</div>
            <div style={{ color: "#c8d8a0", fontSize: 15, marginBottom: 24, lineHeight: 1.6, ...L }}>{selectedQ.full}</div>
            {SPEAKERS.map((s, i) => {
              const hasAnswer = !!selectedQ.answers[s.id];
              return (
                <div key={s.id}
                  onClick={() => { setSCursor(i); setSelectedS(s); markVisited([s.id]); setScreen("answer"); }}
                  onMouseEnter={() => setSCursor(i)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "7px 12px", marginBottom: 2, cursor: "pointer", borderRadius: 2, background: sCursor===i?hexToRgba(s.color,0.07):"transparent", border: sCursor===i?`1px solid ${hexToRgba(s.color,0.2)}`:"1px solid transparent" }}
                >
                  <span style={{ color: sCursor===i?s.color:"#444", fontSize: 12, minWidth: 16 }}>{sCursor===i?"▶":"·"}</span>
                  <span style={{ color: hasAnswer?(sCursor===i?s.color:"#9aaa8a"):"#444", fontSize: 13 }}>{s.name}</span>
                  <span style={{ color: "#556655", fontSize: 11 }}>{s.title}</span>
                  {visited.has(s.id) && hasAnswer && <span style={{ color: "#2a4a2a", fontSize: 9, marginLeft: "auto" }}>●</span>}
                  {!hasAnswer && <span style={{ color: "#333", fontSize: 10, marginLeft: !visited.has(s.id) ? "auto" : 0 }}>—</span>}
                </div>
              );
            })}
            <div
              onClick={() => { setSCursor(SPEAKERS.length); markVisited(SPEAKERS.map(s=>s.id)); setScreen("all"); }}
              onMouseEnter={() => setSCursor(SPEAKERS.length)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "7px 12px", marginTop: 8, cursor: "pointer", borderRadius: 2, background: sCursor===SPEAKERS.length?"rgba(74,222,128,0.07)":"transparent", border: sCursor===SPEAKERS.length?"1px solid rgba(74,222,128,0.2)":"1px solid transparent" }}
            >
              <span style={{ color: sCursor===SPEAKERS.length?"#4ade80":"#444", fontSize: 12, minWidth: 16 }}>{sCursor===SPEAKERS.length?"▶":"·"}</span>
              <span style={{ color: sCursor===SPEAKERS.length?"#4ade80":"#5a7a5a", fontSize: 13 }}>VIEW ALL RESPONSES</span>
            </div>
          </div>
        )}

        {/* SINGLE ANSWER */}
        {screen === "answer" && selectedQ && selectedS && (
          <div style={{ paddingBottom: xrefPanel ? 140 : 0, transition: "padding-bottom 0.2s" }}>
            <div style={promptStyle}>ENTER / ESC ← BACK  ·  CLICK ██ TO REVEAL  ·  DOTTED WORDS ← CROSS-REFERENCE</div>
            <div style={tagStyle}>Q{selectedQ.id}</div>
            <div style={{ color: "#9aaa8a", fontSize: 13, marginBottom: 20, lineHeight: 1.6, ...L }}>{selectedQ.full}</div>
            <div style={{ color: selectedS.color, fontSize: 14, fontWeight: "bold", letterSpacing: 1, marginBottom: 2, ...L }}>{selectedS.name}</div>
            <div style={{ color: "#6a7a6a", fontSize: 11, marginBottom: 20, ...L }}>{selectedS.title}</div>
            <div style={{ borderLeft: `2px solid ${hexToRgba(selectedS.color,0.3)}`, paddingLeft: 16, fontSize: 13 }}>
              {renderAnswerLines(selectedS.id, selectedQ.id, selectedQ.answers[selectedS.id])}
            </div>
            <div style={{ marginTop: 32, color: "#333", fontSize: 11, ...C }}>─────────────────</div>
            <div style={{ color: "#5a7a5a", fontSize: 11, marginTop: 8, ...C }}>[ENTER] BACK</div>
          </div>
        )}

        {/* ALL ANSWERS */}
        {screen === "all" && selectedQ && (
          <div style={{ paddingBottom: xrefPanel ? 140 : 0, transition: "padding-bottom 0.2s" }}>
            <div style={promptStyle}>ENTER / ESC ← BACK  ·  CLICK ██ TO REVEAL  ·  DOTTED WORDS ← CROSS-REFERENCE</div>
            <div style={tagStyle}>Q{selectedQ.id}  ·  ALL RESPONSES</div>
            <div style={{ color: "#c8d8a0", fontSize: 14, marginBottom: 24, lineHeight: 1.6, ...L }}>{selectedQ.full}</div>
            {SPEAKERS.map(s => (
              <div key={s.id} style={{ marginBottom: 28 }}>
                <div style={{ color: s.color, fontSize: 13, fontWeight: "bold", letterSpacing: 1, marginBottom: 2, ...L }}>{s.name}</div>
                <div style={{ borderLeft: `2px solid ${hexToRgba(s.color,0.25)}`, paddingLeft: 12, fontSize: 12 }}>
                  {renderAnswerLines(s.id, selectedQ.id, selectedQ.answers[s.id])}
                </div>
              </div>
            ))}
            <div style={{ color: "#333", fontSize: 11, marginTop: 8, ...C }}>─────────────────</div>
            <div style={{ color: "#7a8a7a", fontSize: 11, marginTop: 8, marginBottom: 4, ...C }}>DID NOT REPLY TO THIS QUESTION:</div>
            <div style={{ color: "#7a8a7a", fontSize: 11, ...C }}>
              {SPEAKERS.filter(s => !selectedQ.answers[s.id]).map(s => s.name).join("  ·  ") || "everyone responded"}
            </div>
            <div style={{ marginTop: 20, color: "#5a7a5a", fontSize: 11, ...C }}>[ENTER] BACK</div>
          </div>
        )}

        {renderXrefPanel()}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}
