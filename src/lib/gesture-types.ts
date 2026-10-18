export type Scenario =
  | "Hospital Triage"
  | "Bank Counter"
  | "Public Transit"
  | "Daily Conversation";

export interface GestureToken {
  id: string;
  name: string; // e.g. "HELLO / WAIT"
  category: "GREETING" | "SUBJECT" | "SYMPTOM" | "QUANTITY" | "URGENCY" | "ACTION";
  iconName: string;
  timestamp: string;
}

export interface AgentStepTrace {
  agentId: "agent1_gloss" | "agent2_bilingual" | "agent3_reverse";
  agentName: string;
  agentRole: string;
  badgeColor: "cyan" | "emerald" | "purple";
  timestamp: string;
  confidenceScore: number; // 0 to 100
  summary: string;
  detailedAnalysis: string;
  keyOutputs: {
    label: string;
    value: string;
    highlight?: boolean;
  }[];
  rawJson?: Record<string, unknown>;
}

export interface SignGlossCard {
  id: string;
  glossText: string; // e.g. "[YOU]"
  meaning: string; // e.g. "Person addressed"
  emoji: string; // e.g. "🫵"
  spatialCues?: string; // e.g. "Point forward at conversational partner"
}

export interface TranslationResult {
  signGlossSequence: string; // e.g. "[HELLO] -> [ME / CHEST] -> [PAIN] -> [TWO DAYS] -> [HELP]"
  urgencyLevel: "Low" | "Medium" | "High" | "Critical";
  englishTranslation: string;
  urduScript: string;
  romanUrdu: string;
  doctorFollowUpQuestions: string[];
  reverseSignGlossCards: SignGlossCard[];
  quickReplies: string[];
  steps: AgentStepTrace[];
  scenarioUsed: Scenario;
  isSimulatedFallback: boolean;
  modelUsed: string;
}

export interface SimulationPreset {
  id: string;
  title: string;
  description: string;
  scenario: Scenario;
  tokens: string[];
  expectedEnglish: string;
  doctorReply: string;
}

export interface ConversationTurn {
  id: string;
  sender: "SIGNER" | "HEARING_PARTNER";
  englishText: string;
  urduScript?: string;
  romanUrdu?: string;
  signGlossSequence?: string;
  reverseCards?: SignGlossCard[];
  timestamp: string;
}
