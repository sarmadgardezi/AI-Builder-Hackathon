import type { SimulationPreset } from "./gesture-types";

// MediaPipe GestureRecognizer Category Name to Semantic Concept Token
export const GESTURE_TO_TOKEN_MAP: Record<string, { token: string; category: string; emoji: string }> = {
  Open_Palm: { token: "HELLO / WAIT", category: "GREETING", emoji: "👋" },
  Pointing_Up: { token: "QUESTION / ATTENTION", category: "ACTION", emoji: "☝️" },
  Thumb_Up: { token: "YES / GOOD", category: "ACTION", emoji: "👍" },
  Thumb_Down: { token: "PAIN / BAD / NO", category: "SYMPTOM", emoji: "👎" },
  Victory: { token: "TWO / DAYS", category: "QUANTITY", emoji: "✌️" },
  Closed_Fist: { token: "ME / MY CHEST", category: "SUBJECT", emoji: "✊" },
  ILoveYou: { token: "HELP / URGENT", category: "URGENCY", emoji: "🤟" },
};

export const SIMULATION_PRESETS: SimulationPreset[] = [
  {
    id: "preset-medical",
    title: "Simulate Medical Emergency Sequence",
    description: "Deaf patient at ER triage signaling acute chest pain lasting two days.",
    scenario: "Hospital Triage",
    tokens: [
      "HELLO / WAIT",
      "ME / MY CHEST",
      "PAIN / BAD / NO",
      "TWO / DAYS",
      "HELP / URGENT",
    ],
    expectedEnglish:
      "Hello, I am experiencing severe chest pain that has persisted for two days. Please help me urgently.",
    doctorReply:
      "Is the chest pain spreading to your left arm or jaw, and do you feel shortness of breath?",
  },
  {
    id: "preset-bank",
    title: "Simulate Bank Counter Inquiry",
    description: "Customer at teller counter requesting check clearance and balance verification.",
    scenario: "Bank Counter",
    tokens: [
      "HELLO / WAIT",
      "ME / MY CHEST",
      "QUESTION / ATTENTION",
      "YES / GOOD",
    ],
    expectedEnglish:
      "Hello, I need assistance with my personal bank account and verifying my latest transaction.",
    doctorReply:
      "Please provide your original CNIC and account number so I can pull up your transaction ledger.",
  },
  {
    id: "preset-transit",
    title: "Simulate Public Transit / Station Request",
    description: "Commuter at train/bus terminal asking for urgent schedule & platform guidance.",
    scenario: "Public Transit",
    tokens: [
      "HELLO / WAIT",
      "QUESTION / ATTENTION",
      "TWO / DAYS",
      "HELP / URGENT",
    ],
    expectedEnglish:
      "Hello, excuse me. I urgently need assistance finding the correct departure platform and schedule.",
    doctorReply:
      "The next express train departs from Platform 2 in 10 minutes. Follow the blue overhead signs.",
  },
];
