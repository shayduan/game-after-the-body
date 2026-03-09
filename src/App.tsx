import { useState, useEffect, useRef, useCallback } from 'react';

const SPEAKERS = [
  {
    id: 'chen',
    name: 'DR. MARA CHEN',
    title: 'Co-founder & CEO, Genesis Biosciences',
    color: '#4ade80',
  },
  {
    id: 'yolanda',
    name: 'YOLANDA',
    title: 'Former gestational surrogate',
    color: '#facc15',
  },
  {
    id: 'kessler',
    name: 'MINISTER KESSLER',
    title: 'Minister of Reproductive Health Policy',
    color: '#60a5fa',
  },
  {
    id: 'river',
    name: 'RIVER',
    title: 'Age 17. Born via replicator.',
    color: '#f472b6',
  },
  {
    id: 'osei',
    name: 'DR. FATIMA OSEI',
    title: 'Professor of Feminist Theory',
    color: '#c084fc',
  },
  { id: 'agnes', name: 'AGNES', title: 'Grandmother', color: '#fb923c' },
  {
    id: 'claire',
    name: 'CLAIRE PARK',
    title: 'Senior Operations Manager',
    color: '#2dd4bf',
  },
];

const SILENCE = '__SILENCE__';

const QUESTIONS = [
  {
    id: 1,
    short: 'What does this technology do?',
    full: 'Q1.  Can you describe what this technology does — in your own words?',
    answers: {
      chen: [
        'It completes a pregnancy outside the human body. Safely, reliably, without risk to the gestational parent.',
        'We created a biological environment that supports fetal development from implantation to birth.',
        "But I'd put it more simply: we gave people a choice they have never had before.",
      ],
      yolanda: ['It does what I used to do.'],
      kessler: [
        "The ExoGestation System — that's the clinical designation — provides a regulated, medically supervised alternative to in-vivo gestation.",
        'It has significant implications for public health, workforce participation, and reproductive equity.',
        'We are still developing the full policy architecture.',
      ],
      river: [
        'It made me.',
        SILENCE,
        "I'm assuming that's what you're asking.",
      ],
      osei: null,
      agnes: null,
      claire: [
        'From an organizational standpoint, it eliminates a significant variable in workforce planning.',
        "Employees who choose to use it don't require modified duties, extended leave, or — and this is important — the informal accommodations that were never officially tracked but everyone knows happened.",
      ],
    },
  },
  {
    id: 2,
    short: 'What does pregnancy mean to you?',
    full: 'Q2.  What does pregnancy mean to you?',
    answers: {
      chen: [
        "I've had two. One was beautiful. One put me in the hospital for six weeks.",
        'I nearly lost my company and my life at the same time.',
        SILENCE,
        "When people ask why I built this — that's the answer. I wanted my daughter to never have to choose.",
      ],
      yolanda: [
        "It was the one thing I was completely certain of. My body knew what to do even when I didn't.",
        "I've been pregnant seven times — three of mine, four for other families — and every time, there was a moment around week nine when I felt completely calm.",
        'Like I was exactly where I was supposed to be.',
        SILENCE,
        "I haven't felt that since.",
      ],
      kessler: null,
      river: [
        "I've read about it. I've watched videos. I've asked my mom — my mother, the one who raised me — and she tries to explain it.",
        "She says it's like being a house for someone.",
        'I keep thinking about that. Being a house.',
        "And then the house doesn't exist and you're still you.",
      ],
      osei: [
        "I wrote my dissertation arguing that pregnancy was the primary site of women's oppression.",
        'That until gestation was externalized, no liberation was complete.',
        'I still believe that.',
        'I think.',
        SILENCE,
        'My sister is pregnant right now. Voluntarily. No medical reason not to use the replicator. She just wanted to.',
        "I've been trying very hard not to have an opinion about that.",
      ],
      agnes: [
        'The second time — with my daughter — I felt her move at seventeen weeks.',
        'It was a Tuesday. I was doing the dishes and I just stood there.',
        SILENCE,
        "I don't know how to explain that to someone.",
      ],
      claire: null,
    },
  },
  {
    id: 3,
    short: 'Who does this technology free, and from what?',
    full: 'Q3.  Who does this technology free, and from what?',
    answers: {
      chen: [
        'Women. From the biological penalty of ambition.',
        'From the impossible arithmetic of timing a career and a body.',
        'We are the only mammals expected to do both simultaneously, at peak performance.',
        "And we are the first company in history to say: you don't have to.",
      ],
      yolanda: [SILENCE, 'Not me.'],
      kessler: [
        'It offers reproductive parity we have never seen before. Male and female partners experience parenthood without the physical asymmetry that has historically — and economically — disadvantaged women.',
        'The downstream effects on labour participation, the gender pay gap, pension contributions — the projections are quite promising.',
      ],
      river: null,
      osei: [
        'Firestone said it in 1970. She said liberation required freedom from the tyranny of reproductive biology.',
        'She was right.',
        'And then I watched what happened when the technology actually arrived.',
        SILENCE,
        'Who controls the machine that replaced the body?',
        'Have we answered that?',
        "I haven't seen the answer.",
      ],
      agnes: null,
      claire: [
        'My last hire — brilliant, 31 — came in and asked about her equity package.',
        'Not her maternity policy. Her equity package.',
        SILENCE,
        "That's new.",
      ],
    },
  },
  {
    id: 4,
    short: 'Who disappears when the pregnant body is no longer necessary?',
    full: 'Q4.  Who disappears when the pregnant body is no longer necessary?',
    answers: {
      chen: null,
      yolanda: [
        'I had a name for what I did. A profession.',
        "People called it 'just carrying' — like it was a footnote.",
        'Just. Like it was nothing.',
        "And then the machine arrived and suddenly everyone had to explain why they didn't need me anymore, and they all got very quiet and used words like 'transition' and 'retraining.'",
        'Like I was a coal miner.',
        SILENCE,
        'What I keep coming back to is: they finally admitted it was real work.',
        'Right when they stopped needing someone to do it.',
      ],
      kessler: [
        'The surrogacy sector has experienced significant disruption.',
        'We are working with affected workers on retraining pathways.',
        'It is a genuine challenge.',
      ],
      river: [
        "I think — when people ask me this — they're trying to figure out if I'm sad about it.",
        'If I feel something missing.',
        "And I don't know how to answer because I can't miss something I never had.",
        SILENCE,
        'But I do sometimes think about the body that could have held me.',
        "And didn't.",
        'And I wonder about that body.',
        'Whether she thinks about me.',
      ],
      osei: [
        'The pregnant body was an argument. Visible, undeniable, inconvenient.',
        'It had to be accommodated and legislated and resented and celebrated.',
        'It occupied space in a way that could not be ignored.',
        'And now that argument has been removed from the room.',
        SILENCE,
        "I'm genuinely uncertain whether we won or whether we were silenced.",
      ],
      agnes: [
        "My daughter didn't gain weight. She didn't buy new clothes. She didn't have to stop running.",
        'I kept waiting for her to look different and she never did.',
        SILENCE,
        'I love my grandchild more than anything. I want to be clear about that.',
        'I just kept waiting.',
      ],
      claire: [
        "Complexity disappears. Scheduling conflicts. The informal favours, the covered shifts, the things that don't appear in an HR report but everyone knows happened.",
        "The resentment, too, sometimes — I'm not proud to say it, but there was resentment.",
        "That's gone now.",
        'Everything is much cleaner.',
      ],
    },
  },
  {
    id: 5,
    short: 'Can this technology be owned? Should it?',
    full: 'Q5.  Can this technology be owned? Should it?',
    answers: {
      chen: [
        'The technology, absolutely — we hold forty-seven patents.',
        'The outcome? Never. We are very explicit about that in our service agreements.',
        'The child born from a Genesis unit belongs to their parents. Full stop.',
        SILENCE,
        'Though I will admit our legal team spent three years writing that sentence.',
      ],
      yolanda: null,
      kessler: [
        'Ownership is complex, and actively under legislation. What I can say is that the state has a clear interest in ensuring access is equitable — that this technology does not create new hierarchies of reproduction.',
        'Whether it becomes a public utility — that conversation is ongoing.',
      ],
      river: null,
      osei: [
        'We had this argument about IVF and answered it badly.',
        'Embryos are sitting in legal limbo in clinics around the world — frozen, disputed, orphaned — because we never resolved the question of what they were.',
        "This is that problem, raised to an order of magnitude we haven't calculated.",
        SILENCE,
        "The answer we give to 'can it be owned' will determine the answer to almost every other question.",
        'And we are nowhere close.',
      ],
      agnes: null,
      claire: null,
    },
  },
  {
    id: 6,
    short: 'What makes someone a mother?',
    full: 'Q6.  What makes someone a mother?',
    answers: {
      chen: [
        'Intention.',
        'You chose this child. You planned this child. You will love this child.',
        'That is everything.',
        'The biology was always just the delivery method.',
      ],
      yolanda: [
        SILENCE,
        'I thought I knew. I thought it was the body.',
        "I thought that was the one answer that couldn't be argued with.",
        'The body is there. The body does the thing. The body knows.',
        SILENCE,
        'I carried twelve children. I am not their mother.',
        "So the body isn't the answer either.",
        SILENCE,
        "I genuinely don't know anymore.",
        'I used to think not knowing was frightening.',
        'Now I think the people who are certain are the frightening ones.',
      ],
      kessler: null,
      river: [
        "The woman who raised me is my mother. That's not complicated.",
        SILENCE,
        'But I have a donor somewhere. An egg donor.',
        "And sometimes — when I'm sick, or when I did something I'm really proud of — I think: does she think about me?",
        "She probably doesn't.",
        "That's fine.",
        'I just think about it.',
      ],
      osei: [
        'Legal mother. Genetic mother. Gestational mother. Intentional mother. Social mother.',
        'We have spent fifty years adding categories and removing none of the old ones.',
        "The replicator just added a new one while leaving everyone else's claim intact.",
        'We have never done the subtraction.',
        'We have only ever added.',
      ],
      agnes: [
        'My daughter told me she knew before the test came back.',
        'She just knew.',
        'I believed her.',
        'I had the same thing.',
        SILENCE,
        "Whether that means anything, I couldn't tell you.",
      ],
      claire: null,
    },
  },
  {
    id: 7,
    short: 'Is this technology feminist?',
    full: 'Q7.  Is this technology feminist?',
    answers: {
      chen: [
        'Yes. Without question.',
        'We designed it for women, it benefits women, and the women who use it are free in a way their mothers were not.',
        'The data is very clear.',
      ],
      yolanda: [
        'It freed women from pregnancy.',
        'It also freed women from needing me.',
        SILENCE,
        "I'll let you decide what that means.",
      ],
      kessler: null,
      river: null,
      osei: [
        'I published a paper in 2019 arguing this technology would be the final liberation.',
        "I've been trying to retract it for three years.",
        'Not because I was wrong about what the technology could do — but because I was naive about who would control it, who would access it, and which governments would make it mandatory to increase birth rates by 2031.',
        SILENCE,
        "Firestone didn't account for the state.",
        'Neither did I.',
      ],
      agnes: null,
      claire: [
        "I'm a woman and I think it's been transformative for women in the workplace.",
        SILENCE,
        'Does that count as feminist?',
        SILENCE,
        "I'm genuinely asking.",
      ],
    },
  },
  {
    id: 8,
    short: 'What are you afraid this technology will be used for?',
    full: 'Q8.  What are you afraid this technology will be used for?',
    answers: {
      chen: [
        'Honestly? Governments.',
        "The moment a state gets full control of this infrastructure — who gets access, on what terms, for what purposes — we've handed over something we cannot take back.",
        SILENCE,
        'We are already integrated into seventeen national healthcare systems.',
        'I think about that.',
      ],
      yolanda: null,
      kessler: [
        'Misuse by private interests is our primary concern.',
        'Commodification. The creation of reproductive tiers based on income.',
        'We are building regulatory frameworks to prevent that.',
      ],
      river: [
        "I think it's already being used for exactly what it was always going to be used for.",
      ],
      osei: [
        "Eugenics doesn't need a new name to be eugenics.",
        'It just needs better branding and a government subsidy.',
      ],
      agnes: [
        "I'm afraid my granddaughter won't know what I know.",
        "And I'm afraid I can't explain what that is, because I don't have the words for it.",
        SILENCE,
        'I just have the feeling.',
      ],
      claire: [
        "I've seen the memos. Not at my company — I want to be clear.",
        "But I have friends at other organizations, and I've seen the memos.",
        'There are companies building informal expectations around this.',
        'Nothing written down. Nothing that could be cited in a tribunal.',
        'Just expectations.',
        SILENCE,
        "That's what I'm afraid of. Not the technology. The memos.",
      ],
    },
  },
  {
    id: 9,
    short: 'What question do you wish I had asked you?',
    full: 'Q9.  What question do you wish I had asked you?',
    answers: {
      chen: null,
      yolanda: ['Whether I miss it.'],
      kessler: null,
      river: [
        "Whether I'm okay.",
        SILENCE,
        'I am, by the way.',
        'I just thought you might want to know.',
        'Nobody asks.',
      ],
      osei: [
        'Whether any of this was inevitable.',
        "Whether we chose this, or whether we were so busy arguing about whether it was feminist that we simply let it become infrastructure before we'd decided if it was good.",
        SILENCE,
        "I think that's the question I'm trying to answer now.",
        'In my work. In my life.',
        "I haven't gotten there.",
      ],
      agnes: [
        'I would have liked you to ask me what it felt like.',
        'When she moved.',
        'Nobody asks that anymore.',
        SILENCE,
        'Seventeen weeks. A Tuesday. The dishes.',
      ],
      claire: null,
    },
  },
];

const NO_REPLY = {
  chen: '(no response. DR. CHEN checked her phone.)',
  yolanda:
    "(Yolanda didn't answer. She looked out the window for a long time.)",
  kessler: '(The Minister declined to respond to this question.)',
  river: "(River shrugged. Didn't say anything.)",
  osei: '(DR. OSEI paused. Said she needed to think about it. Never came back to it.)',
  agnes: '(Agnes shook her head slowly. That was all.)',
  claire: '(No response recorded.)',
};

const INTRO_LINES = [
  'AFTER THE BODY',
  'An Interview in Seven Voices',
  '',
  '─────────────────────────────────────────────',
  '',
  'The ExoGestation System has been commercially available',
  'for three years. The following individuals agreed to be',
  'interviewed on the condition of thematic anonymity.',
  '',
  'The questions were the same for everyone.',
  'Not everyone answered.',
  '',
  '─────────────────────────────────────────────',
  '',
  '[ PRESS ANY KEY TO ENTER ]',
];

// Hex color to rgba helper
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Darken a hex color for body text (mix with black)
function dimColor(hex, amount = 0.65) {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * amount);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * amount);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * amount);
  return `rgb(${r},${g},${b})`;
}

export default function TerminalGame() {
  const [screen, setScreen] = useState('intro');
  const [introLines, setIntroLines] = useState([]);
  const [introReady, setIntroReady] = useState(false);
  const [selectedQ, setSelectedQ] = useState(null);
  const [selectedS, setSelectedS] = useState(null);
  const [qCursor, setQCursor] = useState(0);
  const [sCursor, setSCursor] = useState(0);
  const [blink, setBlink] = useState(true);
  const containerRef = useRef(null);
  const lineTimers = useRef([]);

  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (screen !== 'intro') return;
    setIntroLines([]);
    setIntroReady(false);
    lineTimers.current.forEach(clearTimeout);
    lineTimers.current = [];
    INTRO_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setIntroLines((prev) => [...prev, line]);
        if (i === INTRO_LINES.length - 1) setIntroReady(true);
      }, 120 * i + (i > 3 ? 200 : 0));
      lineTimers.current.push(t);
    });
    return () => lineTimers.current.forEach(clearTimeout);
  }, [screen]);

  const handleKey = useCallback(
    (e) => {
      if (screen === 'intro' && introReady) {
        setScreen('questions');
        return;
      }
      if (screen === 'questions') {
        if (e.key === 'ArrowUp') setQCursor((c) => Math.max(0, c - 1));
        else if (e.key === 'ArrowDown')
          setQCursor((c) => Math.min(QUESTIONS.length - 1, c + 1));
        else if (e.key === 'Enter') {
          setSelectedQ(QUESTIONS[qCursor]);
          setSCursor(0);
          setScreen('speakers');
        } else if (e.key === 'Escape' || e.key === 'Backspace')
          setScreen('intro');
      }
      if (screen === 'speakers') {
        const total = SPEAKERS.length + 1;
        if (e.key === 'ArrowUp') setSCursor((c) => Math.max(0, c - 1));
        else if (e.key === 'ArrowDown')
          setSCursor((c) => Math.min(total - 1, c + 1));
        else if (e.key === 'Enter') {
          if (sCursor === SPEAKERS.length) setScreen('all');
          else {
            setSelectedS(SPEAKERS[sCursor]);
            setScreen('answer');
          }
        } else if (e.key === 'Escape' || e.key === 'Backspace')
          setScreen('questions');
      }
      if (screen === 'answer' || screen === 'all') {
        if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'Enter')
          setScreen('speakers');
      }
    },
    [screen, introReady, qCursor, sCursor]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  useEffect(() => {
    if (containerRef.current) containerRef.current.focus();
  }, [screen]);

  const renderAnswerLines = (speakerId, lines) => {
    const sp = SPEAKERS.find((s) => s.id === speakerId);
    const bodyColor = sp ? dimColor(sp.color, 0.85) : '#b0c090';
    if (!lines)
      return (
        <div style={{ color: '#777', fontStyle: 'italic', textAlign: 'left' }}>
          {NO_REPLY[speakerId]}
        </div>
      );
    return lines.map((line, i) =>
      line === SILENCE ? (
        <div key={i} style={{ height: 18, color: '#555', textAlign: 'left' }}>
          [ ... ]
        </div>
      ) : (
        <div
          key={i}
          style={{
            marginBottom: 4,
            lineHeight: 1.8,
            color: bodyColor,
            textAlign: 'left',
          }}
        >
          {line}
        </div>
      )
    );
  };

  const promptStyle = {
    color: '#5a7a5a',
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 24,
    textAlign: 'left',
  };
  const tagStyle = {
    color: '#556655',
    fontSize: 11,
    marginBottom: 4,
    textAlign: 'left',
  };

  return (
    <div
      style={{
        background: '#0a0a0a',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Courier New', Courier, monospace",
        padding: 16,
      }}
    >
      <div
        ref={containerRef}
        tabIndex={0}
        style={{
          width: '100%',
          maxWidth: 760,
          background: '#0f0f0f',
          border: '1px solid #2a2a2a',
          borderRadius: 4,
          padding: '32px 40px',
          minHeight: 520,
          boxShadow:
            '0 0 60px rgba(74,222,128,0.04), inset 0 0 80px rgba(0,0,0,0.5)',
          outline: 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* scanlines */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />

        {/* INTRO */}
        {screen === 'intro' && (
          <div>
            <div
              style={{
                color: '#4a6a4a',
                fontSize: 11,
                letterSpacing: 2,
                marginBottom: 24,
                textAlign: 'left',
              }}
            >
              ARCHIVE // SPECULATIVE TRANSCRIPT // 203X
            </div>
            {introLines.map((line, i) => (
              <div
                key={i}
                style={{
                  color:
                    i === 0
                      ? '#4ade80'
                      : i === 1
                      ? '#7a9a6a'
                      : line.startsWith('─')
                      ? '#333'
                      : line.startsWith('[')
                      ? '#4ade80'
                      : '#9aaa8a',
                  fontSize: i === 0 ? 22 : 13,
                  fontWeight: i === 0 ? 'bold' : 'normal',
                  letterSpacing: i === 0 ? 4 : i === 1 ? 1 : 0,
                  lineHeight: 1.9,
                  textAlign: 'left',
                }}
              >
                {line || '\u00a0'}
              </div>
            ))}
            {introReady && (
              <span style={{ opacity: blink ? 1 : 0, color: '#4ade80' }}>
                █
              </span>
            )}
          </div>
        )}

        {/* QUESTIONS */}
        {screen === 'questions' && (
          <div>
            <div style={promptStyle}>
              SELECT A QUESTION · ↑↓ NAVIGATE · ENTER SELECT · ESC ← INTRO
            </div>
            {QUESTIONS.map((q, i) => (
              <div
                key={q.id}
                onClick={() => {
                  setQCursor(i);
                  setSelectedQ(q);
                  setSCursor(0);
                  setScreen('speakers');
                }}
                onMouseEnter={() => setQCursor(i)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '8px 12px',
                  marginBottom: 2,
                  cursor: 'pointer',
                  borderRadius: 2,
                  textAlign: 'left',
                  background:
                    qCursor === i ? 'rgba(74,222,128,0.07)' : 'transparent',
                  border:
                    qCursor === i
                      ? '1px solid rgba(74,222,128,0.2)'
                      : '1px solid transparent',
                }}
              >
                <span style={{ color: '#4a6a4a', minWidth: 24, fontSize: 12 }}>
                  Q{q.id}
                </span>
                <span
                  style={{
                    color: qCursor === i ? '#d4e8b0' : '#8a9a7a',
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {qCursor === i ? '▶ ' : '  '}
                  {q.short}
                </span>
              </div>
            ))}
            <div
              style={{
                color: '#333',
                fontSize: 11,
                marginTop: 16,
                textAlign: 'left',
              }}
            >
              ─────────────────────────────
            </div>
            <div
              style={{
                color: '#4a6a4a',
                fontSize: 11,
                marginTop: 8,
                textAlign: 'left',
              }}
            >
              9 QUESTIONS · 7 VOICES · NOT EVERYONE ANSWERED
            </div>
          </div>
        )}

        {/* SPEAKERS */}
        {screen === 'speakers' && selectedQ && (
          <div>
            <div style={promptStyle}>
              ESC ← QUESTIONS · ↑↓ NAVIGATE · ENTER SELECT
            </div>
            <div style={tagStyle}>Q{selectedQ.id}</div>
            <div
              style={{
                color: '#c8d8a0',
                fontSize: 15,
                marginBottom: 24,
                lineHeight: 1.6,
                textAlign: 'left',
              }}
            >
              {selectedQ.full}
            </div>
            {SPEAKERS.map((s, i) => {
              const hasAnswer = !!selectedQ.answers[s.id];
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setSCursor(i);
                    setSelectedS(s);
                    setScreen('answer');
                  }}
                  onMouseEnter={() => setSCursor(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '7px 12px',
                    marginBottom: 2,
                    cursor: 'pointer',
                    borderRadius: 2,
                    textAlign: 'left',
                    background:
                      sCursor === i ? hexToRgba(s.color, 0.07) : 'transparent',
                    border:
                      sCursor === i
                        ? `1px solid ${hexToRgba(s.color, 0.2)}`
                        : '1px solid transparent',
                  }}
                >
                  <span
                    style={{
                      color: sCursor === i ? s.color : '#444',
                      fontSize: 12,
                      minWidth: 16,
                    }}
                  >
                    {sCursor === i ? '▶' : '·'}
                  </span>
                  <span
                    style={{
                      color: hasAnswer
                        ? sCursor === i
                          ? s.color
                          : '#9aaa8a'
                        : '#444',
                      fontSize: 13,
                    }}
                  >
                    {s.name}
                  </span>
                  <span style={{ color: '#556655', fontSize: 11 }}>
                    {s.title}
                  </span>
                  {!hasAnswer && (
                    <span
                      style={{
                        color: '#444',
                        fontSize: 10,
                        marginLeft: 'auto',
                      }}
                    >
                      —
                    </span>
                  )}
                </div>
              );
            })}
            <div
              onClick={() => {
                setSCursor(SPEAKERS.length);
                setScreen('all');
              }}
              onMouseEnter={() => setSCursor(SPEAKERS.length)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '7px 12px',
                marginTop: 8,
                cursor: 'pointer',
                borderRadius: 2,
                textAlign: 'left',
                background:
                  sCursor === SPEAKERS.length
                    ? 'rgba(74,222,128,0.07)'
                    : 'transparent',
                border:
                  sCursor === SPEAKERS.length
                    ? '1px solid rgba(74,222,128,0.2)'
                    : '1px solid transparent',
              }}
            >
              <span
                style={{
                  color: sCursor === SPEAKERS.length ? '#4ade80' : '#444',
                  fontSize: 12,
                  minWidth: 16,
                }}
              >
                {sCursor === SPEAKERS.length ? '▶' : '·'}
              </span>
              <span
                style={{
                  color: sCursor === SPEAKERS.length ? '#4ade80' : '#5a7a5a',
                  fontSize: 13,
                }}
              >
                VIEW ALL RESPONSES
              </span>
            </div>
          </div>
        )}

        {/* SINGLE ANSWER */}
        {screen === 'answer' && selectedQ && selectedS && (
          <div>
            <div style={promptStyle}>ENTER / ESC ← BACK TO SPEAKERS</div>
            <div style={tagStyle}>Q{selectedQ.id}</div>
            <div
              style={{
                color: '#9aaa8a',
                fontSize: 13,
                marginBottom: 20,
                lineHeight: 1.6,
                textAlign: 'left',
              }}
            >
              {selectedQ.full}
            </div>
            <div
              style={{
                color: selectedS.color,
                fontSize: 14,
                fontWeight: 'bold',
                letterSpacing: 1,
                marginBottom: 2,
                textAlign: 'left',
              }}
            >
              {selectedS.name}
            </div>
            <div
              style={{
                color: '#6a7a6a',
                fontSize: 11,
                marginBottom: 20,
                textAlign: 'left',
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
              {renderAnswerLines(selectedS.id, selectedQ.answers[selectedS.id])}
            </div>
            <div
              style={{
                marginTop: 32,
                color: '#333',
                fontSize: 11,
                textAlign: 'left',
              }}
            >
              ─────────────────
            </div>
            <div
              style={{
                color: '#5a7a5a',
                fontSize: 11,
                marginTop: 8,
                textAlign: 'left',
              }}
            >
              [ENTER] BACK
            </div>
          </div>
        )}

        {/* ALL ANSWERS */}
        {screen === 'all' && selectedQ && (
          <div>
            <div style={promptStyle}>ENTER / ESC ← BACK TO SPEAKERS</div>
            <div style={tagStyle}>Q{selectedQ.id} · ALL RESPONSES</div>
            <div
              style={{
                color: '#c8d8a0',
                fontSize: 14,
                marginBottom: 24,
                lineHeight: 1.6,
                textAlign: 'left',
              }}
            >
              {selectedQ.full}
            </div>
            {SPEAKERS.map((s) => (
              <div key={s.id} style={{ marginBottom: 28 }}>
                <div
                  style={{
                    color: s.color,
                    fontSize: 13,
                    fontWeight: 'bold',
                    letterSpacing: 1,
                    marginBottom: 2,
                    textAlign: 'left',
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
                  {renderAnswerLines(s.id, selectedQ.answers[s.id])}
                </div>
              </div>
            ))}
            <div
              style={{
                color: '#333',
                fontSize: 11,
                marginTop: 8,
                textAlign: 'left',
              }}
            >
              ─────────────────
            </div>
            <div
              style={{
                color: '#7a8a7a',
                fontSize: 11,
                marginTop: 8,
                marginBottom: 4,
                textAlign: 'left',
              }}
            >
              DID NOT REPLY TO THIS QUESTION:
            </div>
            <div style={{ color: '#7a8a7a', fontSize: 11, textAlign: 'left' }}>
              {SPEAKERS.filter((s) => !selectedQ.answers[s.id])
                .map((s) => s.name)
                .join('  ·  ') || 'everyone responded'}
            </div>
            <div
              style={{
                marginTop: 20,
                color: '#5a7a5a',
                fontSize: 11,
                textAlign: 'left',
              }}
            >
              [ENTER] BACK
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(2px);} to {opacity:1; transform:none;}}`}</style>
    </div>
  );
}
