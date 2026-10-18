export type ScenarioContext =
  | "🏥 Medical Triage"
  | "🏦 Bank / Office"
  | "🚌 Public Transit"
  | "💬 General Chat";

export interface GestureDefinition {
  id: string;
  name: string; // MediaPipe category or custom rule ID
  tokenText: string;
  category: "GREETING" | "ACTION" | "SYMPTOM" | "QUANTITY" | "URGENCY" | "ANATOMICAL" | "CONTROL";
  emoji: string;
  description: string;
  isCustomRule?: boolean;
}

export const GESTURE_CATALOG: GestureDefinition[] = [
  {
    id: "open_palm",
    name: "Open_Palm",
    tokenText: "Hello / Excuse Me",
    category: "GREETING",
    emoji: "👋",
    description: "Open flat palm facing camera with fingers extended",
  },
  {
    id: "thumb_up",
    name: "Thumb_Up",
    tokenText: "Yes / I Agree",
    category: "ACTION",
    emoji: "👍",
    description: "Thumb pointed upward with other fingers curled",
  },
  {
    id: "thumb_down",
    name: "Thumb_Down",
    tokenText: "No / Experiencing Pain",
    category: "SYMPTOM",
    emoji: "👎",
    description: "Thumb pointed downward indicating discomfort or disagreement",
  },
  {
    id: "pointing_up",
    name: "Pointing_Up",
    tokenText: "I Have a Question / Need Attention",
    category: "ACTION",
    emoji: "☝️",
    description: "Index finger pointing upward to request attention or ask question",
  },
  {
    id: "victory",
    name: "Victory",
    tokenText: "Two / Urgent Check",
    category: "QUANTITY",
    emoji: "✌️",
    description: "Index and middle fingers extended forming V shape",
  },
  {
    id: "closed_fist",
    name: "Closed_Fist",
    tokenText: "Wait / Stop",
    category: "CONTROL",
    emoji: "✊",
    description: "All fingers curled tight into fist",
  },
  {
    id: "iloveyou",
    name: "ILoveYou",
    tokenText: "Please Help Me",
    category: "URGENCY",
    emoji: "🤟",
    description: "Thumb, index, and pinky extended (ASL ILY sign)",
  },
  {
    id: "headache_fever",
    name: "Headache_Fever",
    tokenText: "Headache / Fever",
    category: "SYMPTOM",
    emoji: "🤕",
    description: "Index fingertip held near forehead/temple area",
    isCustomRule: true,
  },
  {
    id: "chest_heart",
    name: "Chest_Heart",
    tokenText: "My Chest / Heart",
    category: "ANATOMICAL",
    emoji: "🫀",
    description: "Hand center positioned over lower-center sternum/chest",
    isCustomRule: true,
  },
];

export interface DemoPreset {
  id: string;
  title: string;
  scenario: ScenarioContext;
  tokens: string[];
  description: string;
  expectedEnglish: string;
  defaultDoctorReply: string;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "preset-hospital",
    title: "Simulate: Hospital Pain Emergency",
    scenario: "🏥 Medical Triage",
    tokens: [
      "Hello / Excuse Me",
      "My Chest / Heart",
      "No / Experiencing Pain",
      "Two / Urgent Check",
      "Please Help Me",
    ],
    description: "Deaf patient at emergency triage signaling acute chest discomfort for two days.",
    expectedEnglish:
      "Hello, excuse me. I am experiencing severe chest and heart pain that has lasted for two days. Please help me urgently.",
    defaultDoctorReply:
      "Is the chest pain spreading to your left arm or jaw, and do you feel shortness of breath?",
  },
  {
    id: "preset-pharmacy",
    title: "Simulate: Pharmacy Medicine Request",
    scenario: "🏥 Medical Triage",
    tokens: [
      "Hello / Excuse Me",
      "Headache / Fever",
      "Please Help Me",
    ],
    description: "Customer at pharmacy asking for pain and fever relief medication.",
    expectedEnglish:
      "Hello, excuse me. I have a severe headache and high fever. Please help me with suitable medicine.",
    defaultDoctorReply:
      "Do you have any allergies to paracetamol or ibuprofen, and how many hours ago did the fever start?",
  },
  {
    id: "preset-bank",
    title: "Simulate: Bank Account Help",
    scenario: "🏦 Bank / Office",
    tokens: [
      "Hello / Excuse Me",
      "I Have a Question / Need Attention",
      "Yes / I Agree",
    ],
    description: "Customer at teller counter requesting account verification and transaction assistance.",
    expectedEnglish:
      "Hello, excuse me. I have an important question regarding my personal bank account and agree to proceed.",
    defaultDoctorReply:
      "Please provide your original CNIC or account passbook so I can verify your signature.",
  },
  {
    id: "preset-greeting",
    title: "Simulate: Greeting & Question",
    scenario: "💬 General Chat",
    tokens: [
      "Hello / Excuse Me",
      "I Have a Question / Need Attention",
    ],
    description: "General polite conversation opener to ask for guidance.",
    expectedEnglish:
      "Hello, excuse me. I have a question and would appreciate your kind attention.",
    defaultDoctorReply:
      "Hello! Yes, how can I assist you today? Please feel free to tell me.",
  },
];

/**
 * Smart Deterministic Grammar Synthesizer for Mode A (Free Instant Demo API)
 * Converts sequence of tokens into a natural, polite English sentence.
 */
export function synthesizeDeterministicEnglish(tokens: string[], scenario: ScenarioContext): string {
  if (tokens.length === 0) return "";

  const tokenString = tokens.join(" ").toLowerCase();

  // Medical Scenarios
  if (tokenString.includes("chest") && tokenString.includes("pain") && tokenString.includes("two")) {
    return "Hello, excuse me. I am experiencing severe chest and heart pain that has persisted for two days. Please help me urgently.";
  }
  if (tokenString.includes("chest") && tokenString.includes("pain")) {
    return "Hello, excuse me. I am suffering from acute pain in my chest. Please provide medical assistance.";
  }
  if (tokenString.includes("headache") || tokenString.includes("fever")) {
    return "Hello, excuse me. I am suffering from a severe headache and fever. Please help me with medicine.";
  }
  if (tokenString.includes("pain") && tokenString.includes("help")) {
    return "Hello, I am in serious pain and need urgent medical attention. Please help me.";
  }

  // Banking Scenarios
  if (scenario === "🏦 Bank / Office") {
    if (tokenString.includes("question") && tokenString.includes("agree")) {
      return "Hello, excuse me. I have a question regarding my bank account verification and agree to the required steps.";
    }
    if (tokenString.includes("question")) {
      return "Hello, excuse me. I need assistance with my account and have a question for the desk officer.";
    }
  }

  // Transit Scenarios
  if (scenario === "🚌 Public Transit") {
    if (tokenString.includes("two") || tokenString.includes("urgent")) {
      return "Hello, excuse me. I need urgent information about my departure platform and schedule.";
    }
  }

  // General fallback construction
  const parts: string[] = [];
  if (tokenString.includes("hello")) parts.push("Hello, excuse me.");
  if (tokenString.includes("chest")) parts.push("I have discomfort in my chest.");
  if (tokenString.includes("headache")) parts.push("I am experiencing a severe headache.");
  if (tokenString.includes("pain")) parts.push("I am in pain.");
  if (tokenString.includes("question")) parts.push("I have an important question.");
  if (tokenString.includes("two")) parts.push("This has been going on for two days.");
  if (tokenString.includes("agree")) parts.push("I agree to proceed.");
  if (tokenString.includes("help")) parts.push("Please provide your kind assistance.");

  if (parts.length > 0) {
    return parts.join(" ");
  }

  return `Hello, I am communicating through sign gestures: ${tokens.join(", ")}. Please assist me.`;
}
