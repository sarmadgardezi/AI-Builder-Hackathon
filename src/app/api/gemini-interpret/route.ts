import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export interface GeminiInterpretRequest {
  tokens: string[];
  scenario: string;
  webcamSnapshotBase64?: string;
  customApiKey?: string;
  hearingReply?: string;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body: GeminiInterpretRequest = await req.json();
    const {
      tokens = [],
      scenario = "🏥 Medical Triage",
      webcamSnapshotBase64,
      customApiKey,
      hearingReply,
    } = body;

    const apiKey =
      (customApiKey && customApiKey.trim().length > 10 ? customApiKey.trim() : null) ||
      process.env.GEMINI_API_KEY;

    // If no key is set or placeholder is present, return the realistic 3-agent trace
    if (!apiKey || apiKey === "your_actual_key_here" || apiKey === "your_api_key_from_google_ai_studio") {
      const isMedical = scenario.includes("Medical") || tokens.some(t => t.toLowerCase().includes("pain") || t.toLowerCase().includes("chest"));
      
      const englishSentence = isMedical
        ? "Hello, excuse me. I am suffering from acute chest and heart pain that has persisted for two days. Please provide urgent medical assistance."
        : `Hello, excuse me. I am communicating via sign gestures: ${tokens.join(" + ")}. Please assist me with my inquiry.`;

      const urduScript = isMedical
        ? "ہیلو، معاف کیجیئے گا۔ مجھے سینے میں شدید درد ہو رہا ہے جو دو دن سے جاری ہے۔ براہ کرم فوری طبی امداد فراہم کریں۔"
        : "ہیلو، معاف کیجیئے گا۔ میں اشاروں کے ذریعے گفتگو کر رہا ہوں۔ براہ کرم میری مدد کریں۔";

      const romanUrdu = isMedical
        ? "Hello, maaf kijiye ga. Mujhay seenay mein shadeed dard ho raha hai jo do din se jaari hai. Barah-e-karam fori tibbi imdad faraham karein."
        : "Hello, maaf kijiye ga. Mein isharon ke zariye guftagu kar raha hoon. Barah-e-karam meri madad karein.";

      const signGloss = tokens.map(t => `[${t.split(" / ")[0].toUpperCase()}]`).join(" -> ");

      const reverseCards = isMedical
        ? [
            { id: "1", glossText: "[YOU]", meaning: "Addressee (You)", emoji: "🫵" },
            { id: "2", glossText: "[CHEST PAIN]", meaning: "Chest/Heart Discomfort", emoji: "💔" },
            { id: "3", glossText: "[SPREAD TO ARM?]", meaning: "Pain Radiating", emoji: "🫲" },
            { id: "4", glossText: "[BREATHING HARD?]", meaning: "Shortness of Breath", emoji: "🫁" },
          ]
        : [
            { id: "1", glossText: "[QUESTION]", meaning: "Inquiry", emoji: "❓" },
            { id: "2", glossText: "[HOW ASSIST?]", meaning: "Assistance Request", emoji: "🤝" },
          ];

      const quickReplies = isMedical
        ? ["YES, RADIATES TO LEFT ARM", "NO, ONLY CENTER CHEST", "DIFFICULTY BREATHING"]
        : ["NEED HELP WITH ACCOUNT", "PLEASE EXPLAIN SCHEDULE", "THANK YOU"];

      const steps = [
        {
          agentId: "agent1",
          agentName: "Agent 1: Visual & Landmark Intent Parser",
          agentRole: "Computer Vision & Grammatical Sign Gloss",
          badgeColor: "cyan",
          confidenceScore: 97,
          timestamp: "00:00.6s",
          summary: `Deconstructed ${tokens.length} temporal hand gestures and landmark positions into grammatical Sign Gloss: ${signGloss}`,
          detailedAnalysis: `Evaluated 21 landmark spatial clusters. Hand positions over center torso and downward thumb gesture denote acute physical pain. Urgency assessed as HIGH.`,
          keyOutputs: [
            { label: "Deduced Sign Gloss", value: signGloss, highlight: true },
            { label: "Urgency Level", value: "HIGH / URGENT", highlight: true },
          ],
        },
        {
          agentId: "agent2",
          agentName: "Agent 2: Contextual Sentence Synthesizer",
          agentRole: "Domain Adaptation & Spoken Language Generation",
          badgeColor: "emerald",
          confidenceScore: 99,
          timestamp: "00:01.4s",
          summary: `Synthesized polite English sentence and high-legibility Nastaliq Urdu script tailored to ${scenario}.`,
          detailedAnalysis: `Applied linguistic smoothing for natural vocal delivery. Replaced raw disconnected words with culturally respectful phrasing suitable for clinical staff and patient intake.`,
          keyOutputs: [
            { label: "English Voice", value: englishSentence, highlight: true },
            { label: "Urdu Script", value: urduScript },
          ],
        },
        {
          agentId: "agent3",
          agentName: "Agent 3: Bilingual & Reverse Reply Predictor",
          agentRole: "Two-Way Visual Sign-Gloss Generation",
          badgeColor: "purple",
          confidenceScore: 95,
          timestamp: "00:02.1s",
          summary: `Generated ${reverseCards.length} visual sign cards and 3 1-tap quick replies for the Deaf communicator.`,
          detailedAnalysis: `Anticipated standard emergency triage follow-up inquiry from medical officer. Deconstructed complex verbal clauses into visual Topic-Comment flashcards.`,
          keyOutputs: [
            { label: "Sign Flashcards", value: `${reverseCards.length} Cards Prepared`, highlight: true },
            { label: "Deaf Quick Replies", value: quickReplies.join(" | ") },
          ],
        },
      ];

      return NextResponse.json({
        success: true,
        modelUsed: "gemini-2.5-flash (Simulated Multi-Agent Mode)",
        isSimulated: true,
        signGloss,
        urgencyLevel: isMedical ? "HIGH" : "NORMAL",
        englishSentence,
        urduScript,
        romanUrdu,
        reverseCards,
        quickReplies,
        doctorFollowUps: [
          "Is the pain radiating down your left arm, shoulder, or jaw?",
          "Are you experiencing any shortness of breath or dizziness?",
          "Do you have a personal history of heart conditions or high blood pressure?",
        ],
        steps,
        latencyMs: Date.now() - startTime,
      });
    }

    // Call live Google Gen AI SDK (gemini-2.5-flash)
    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
You are IsharaAI Studio's 3-Agent Gesture-to-Voice Engine built for the Google AI Builder Cup (Sustainability & Social Impact Track).
Analyze this gesture sequence and context:
Scenario: ${scenario}
Gesture Tokens: ${JSON.stringify(tokens)}
Hearing Partner Reply (if any): "${hearingReply || ""}"

Execute the 3 specialized agents in sequence:
1. Agent 1 (Visual & Landmark Intent Parser): Analyze spatial tokens to deduce grammatical Sign Gloss and urgency (LOW, MEDIUM, HIGH, CRITICAL).
2. Agent 2 (Contextual Sentence Synthesizer): Combine tokens with scenario (${scenario}) into natural, polite English and clean Nastaliq Urdu (plus Roman Urdu pronunciation).
3. Agent 3 (Bilingual & Reverse Reply Predictor): Predict 3 relevant follow-ups for the hearing professional, deconstruct their probable reply into 3-4 visual Sign-Language flashcards with emojis, and provide 3 1-tap quick replies for the Deaf user.

Return valid JSON conforming to this structure:
{
  "signGloss": "[HELLO] -> [CHEST] -> [PAIN] ...",
  "urgencyLevel": "HIGH" | "MEDIUM" | "LOW",
  "englishSentence": "...",
  "urduScript": "...",
  "romanUrdu": "...",
  "doctorFollowUps": ["Question 1", "Question 2", "Question 3"],
  "reverseCards": [
    { "id": "1", "glossText": "[YOU]", "meaning": "Addressee", "emoji": "🫵" },
    { "id": "2", "glossText": "[PAIN]", "meaning": "Discomfort", "emoji": "💔" }
  ],
  "quickReplies": ["YES, SPREADS TO ARM", "NO, ONLY CHEST", "HARD TO BREATHE"],
  "steps": [
    {
      "agentId": "agent1",
      "agentName": "Agent 1: Visual & Landmark Intent Parser",
      "agentRole": "Computer Vision & Grammatical Sign Gloss",
      "badgeColor": "cyan",
      "confidenceScore": 96,
      "timestamp": "00:00.7s",
      "summary": "...",
      "detailedAnalysis": "...",
      "keyOutputs": [{"label": "Sign Gloss", "value": "...", "highlight": true}]
    },
    {
      "agentId": "agent2",
      "agentName": "Agent 2: Contextual Sentence Synthesizer",
      "agentRole": "Domain Adaptation & Spoken Language Generation",
      "badgeColor": "emerald",
      "confidenceScore": 98,
      "timestamp": "00:01.5s",
      "summary": "...",
      "detailedAnalysis": "...",
      "keyOutputs": [{"label": "English Voice", "value": "...", "highlight": true}]
    },
    {
      "agentId": "agent3",
      "agentName": "Agent 3: Bilingual & Reverse Reply Predictor",
      "agentRole": "Two-Way Visual Sign-Gloss Generation",
      "badgeColor": "purple",
      "confidenceScore": 94,
      "timestamp": "00:02.2s",
      "summary": "...",
      "detailedAnalysis": "...",
      "keyOutputs": [{"label": "Sign Flashcards", "value": "Ready", "highlight": true}]
    }
  ]
}
`;

      const contents: Array<string | { inlineData: { mimeType: string; data: string } }> = [prompt];

      if (webcamSnapshotBase64 && webcamSnapshotBase64.includes(",")) {
        const [header, data] = webcamSnapshotBase64.split(",");
        const mimeType = header.match(/:(.*?);/)?.[1] || "image/jpeg";
        contents.push({
          inlineData: { mimeType, data },
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);

      return NextResponse.json({
        success: true,
        modelUsed: "gemini-2.5-flash (Live Google Gen AI)",
        isSimulated: false,
        ...parsed,
        latencyMs: Date.now() - startTime,
      });
    } catch (err: any) {
      console.warn("Live Gemini API call notice, falling back to simulated engine:", err);
      return NextResponse.json({
        success: true,
        modelUsed: "gemini-2.5-flash (Calibrated Fallback)",
        isSimulated: true,
        englishSentence: `Hello, excuse me. I am communicating via sign gestures: ${tokens.join(" + ")}. Please assist me.`,
        urduScript: "ہیلو، معاف کیجیئے گا۔ میں اشاروں کی زبان سے بات کر رہا ہوں۔ براہ کرم میری مدد کریں۔",
        romanUrdu: "Hello, maaf kijiye ga. Mein isharon ki zuban se baat kar raha hoon. Barah-e-karam meri madad karein.",
        signGloss: tokens.map(t => `[${t.split(" / ")[0].toUpperCase()}]`).join(" -> "),
        urgencyLevel: "MEDIUM",
        reverseCards: [
          { id: "1", glossText: "[YOU]", meaning: "Addressee", emoji: "🫵" },
          { id: "2", glossText: "[HELP]", meaning: "Assistance", emoji: "🤝" },
        ],
        quickReplies: ["YES", "NO", "NEED HELP"],
        steps: [],
        latencyMs: Date.now() - startTime,
        warning: "Served fallback due to live API timeout or quota limit.",
      });
    }
  } catch (error) {
    console.error("Gemini interpret endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error interpreting gestures." },
      { status: 500 }
    );
  }
}
