import type { Speaker } from "./types";

export const SPEAKERS: Speaker[] = [
  {
    id: "chen",
    name: "DR. MARA CHEN",
    title: "Co-founder & CEO, Genesis Biosciences",
    color: "#4ade80",
  },
  {
    id: "yolanda",
    name: "YOLANDA",
    title: "Former gestational surrogate",
    color: "#facc15",
  },
  {
    id: "kessler",
    name: "MINISTER KESSLER",
    title: "Minister of Reproductive Health Policy",
    color: "#60a5fa",
  },
  {
    id: "river",
    name: "RIVER",
    title: "Age 17. Born via replicator.",
    color: "#f472b6",
  },
  {
    id: "osei",
    name: "DR. FATIMA OSEI",
    title: "Professor of Feminist Theory",
    color: "#c084fc",
  },
  { id: "agnes", name: "AGNES", title: "Grandmother", color: "#fb923c" },
  {
    id: "claire",
    name: "CLAIRE PARK",
    title: "Senior Operations Manager",
    color: "#2dd4bf",
  },
];

export const NO_REPLY: Record<string, string> = {
  chen: "(no response. DR. CHEN checked her phone.)",
  yolanda:
    "(Yolanda didn't answer. She looked out the window for a long time.)",
  kessler: "(The Minister declined to respond to this question.)",
  river: "(River shrugged. Didn't say anything.)",
  osei: "(DR. OSEI paused. Said she needed to think about it. Never came back to it.)",
  agnes: "(Agnes shook her head slowly. That was all.)",
  claire: "(No response recorded.)",
};
