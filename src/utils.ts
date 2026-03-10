import { SILENCE, type AnswerSegment } from "./data/types";
import { KEYWORD_PATTERNS } from "./data/crossrefs";

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function dimColor(hex: string, amount = 0.92): string {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * amount);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * amount);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * amount);
  return `rgb(${r},${g},${b})`;
}

export function isSilence(line: unknown): line is typeof SILENCE {
  return line === SILENCE;
}

export function splitText(
  text: string,
  activeKeywords: string[],
): { text: string; keyword: string | null }[] {
  if (!activeKeywords.length) return [{ text, keyword: null }];

  const matches: {
    index: number;
    end: number;
    text: string;
    keyword: string;
  }[] = [];
  KEYWORD_PATTERNS.filter((kp) => activeKeywords.includes(kp.keyword)).forEach(
    ({ keyword, re }) => {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null)
        matches.push({
          index: m.index,
          end: m.index + m[0].length,
          text: m[0],
          keyword,
        });
    },
  );

  if (!matches.length) return [{ text, keyword: null }];
  matches.sort((a, b) => a.index - b.index);

  const deduped = [matches[0]];
  for (let i = 1; i < matches.length; i++)
    if (matches[i].index >= deduped[deduped.length - 1].end)
      deduped.push(matches[i]);

  const parts: { text: string; keyword: string | null }[] = [];
  let last = 0;
  deduped.forEach((m) => {
    if (m.index > last)
      parts.push({ text: text.slice(last, m.index), keyword: null });
    parts.push({ text: m.text, keyword: m.keyword });
    last = m.end;
  });
  if (last < text.length) parts.push({ text: text.slice(last), keyword: null });
  return parts;
}
