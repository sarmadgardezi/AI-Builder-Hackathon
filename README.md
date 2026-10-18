# IsharaAI Studio — Real-Time Hand Gesture-to-Voice & Text AI Bridge

> Built for the **Google AI Builder Cup (Sustainability & Social Impact Track)**  
> Engineered and verified using **Google Antigravity**, **Gemini 2.5 Flash** (`@google/genai`), **MediaPipe Vision Tasks** (`@mediapipe/tasks-vision`), **Next.js 16 (App Router)**, and **Cloud Run / Firebase App Hosting**.

---

## 🌍 Executive Summary

Over **430 million individuals worldwide** live with disabling hearing loss or non-speaking conditions, facing critical communication barriers in hospital emergency triage, bank teller counters, pharmacy consultations, and public transit.

**IsharaAI Studio** is a flagship single-screen real-time accessibility studio that transforms live camera sign language and hand gestures into spoken **English** and **Urdu** in real time:
1. **Client-Side Vision Studio:** 30 FPS MediaPipe WASM hand skeleton overlay (neon-cyan & emerald) with a 600ms hold-to-lock gesture debounce.
2. **Dual-Mode AI Engine:**
   - **Mode A (Free Instant Demo API - Active by Default):** Smart deterministic grammar engine + live internet **MyMemory REST API** translation to Urdu (`https://api.mymemory.translated.net/get?q=...&langpair=en|ur`) with instant cached dictionary fallback.
   - **Mode B (Gemini 2.5 Flash Agentic Mode):** 3-agent reasoning pipeline via `@google/genai` executing *Visual Intent Parsing*, *Contextual Bilingual Synthesis*, and *Two-Way Reply Prediction*.
3. **Voice Output & Audio Equalizer:** Real-time Web Speech TTS audio accompanied by a live animated **24-Bar Soundwave Equalizer**.
4. **Two-Way Bridge:** "Hearing Partner Reply" box with speech recognition (`webkitSpeechRecognition`) converting verbal replies into big visual **Sign-Gloss Flashcards** (e.g., `[YOU] -> [FEVER] -> [HOW LONG?]`) and 1-tap quick replies for the Deaf communicator.

---

## ⚡ The 4-Stage Core Workflow

```
┌────────────────────────────────────────────────────────────────────────┐
│ Stage 1: Live Vision Studio (30 FPS)                                   │
│ MediaPipe 21 3D landmarks + Neon-cyan/emerald skeleton overlay         │
│ Custom landmark rules: landmark[8] at forehead & landmark[9] at chest  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Stage 2: Real-Time Gesture Hold & Token Stream                         │
│ 600ms hold-to-lock timer with radial ring + Sentence Builder Bar       │
│ 4 One-Click Demo Simulation Buttons (Hospital, Pharmacy, Bank, Chat)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Stage 3: Dual-Mode AI Engine Switcher                                  │
│ Mode A: Free Internet MyMemory REST API (Zero-Key Demo)                │
│ Mode B: Gemini 2.5 Flash 3-Agent Pipeline (/api/gemini-interpret)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Stage 4: Live Audio Synthesis, Waveform & Two-Way Reply                │
│ Web Speech TTS + 24-Bar Animated Equalizer + Spoken Urdu & English     │
│ Hearing partner STT -> Visual Sign-Gloss Cards + 1-Tap Quick Replies   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🤟 Supported Gestures & Custom Geometry

| Gesture / Rule | Semantic Token | Category | Description |
|---|---|---|---|
| `Open_Palm` | `Hello / Excuse Me` | GREETING | Open flat palm facing camera |
| `Thumb_Up` | `Yes / I Agree` | ACTION | Thumb pointed upward |
| `Thumb_Down` | `No / Experiencing Pain` | SYMPTOM | Thumb pointed downward |
| `Pointing_Up` | `I Have a Question / Need Attention` | ACTION | Index finger pointing upward |
| `Victory` | `Two / Urgent Check` | QUANTITY | Index and middle fingers in V-shape |
| `Closed_Fist` | `Wait / Stop` | CONTROL | All fingers curled into tight fist |
| `ILoveYou` | `Please Help Me` | URGENCY | Thumb, index, and pinky extended |
| **Custom Rule 1** | `Headache / Fever` | SYMPTOM | Index tip (`landmark[8]`) near forehead/temple |
| **Custom Rule 2** | `My Chest / Heart` | ANATOMICAL | Hand center (`landmark[9]`) near lower-center chest |

---

## 🎯 4 One-Click Demo Simulations (Zero-Webcam Demo)

1. **Hospital Pain Emergency (`🏥 Medical Triage`):**
   - Tokens: `[Hello]` + `[My Chest / Heart]` + `[No / Experiencing Pain]` + `[Two / Urgent Check]` + `[Please Help Me]`
   - Output: *"Hello, excuse me. I am experiencing severe chest and heart pain that has persisted for two days. Please help me urgently."*
   - Urdu: *"ہیلو، معاف کیجیئے گا۔ مجھے سینے میں شدید درد ہو رہا ہے جو دو دن سے جاری ہے۔ براہ کرم فوری مدد کریں۔"*
2. **Pharmacy Medicine Request (`🏥 Medical Triage`):**
   - Tokens: `[Hello]` + `[Headache / Fever]` + `[Please Help Me]`
   - Output: *"Hello, excuse me. I have a severe headache and high fever. Please help me with suitable medicine."*
3. **Bank Account Help (`🏦 Bank / Office`):**
   - Tokens: `[Hello]` + `[I Have a Question]` + `[Yes / I Agree]`
   - Output: *"Hello, excuse me. I have an important question regarding my personal bank account and agree to proceed."*
4. **Greeting & Question (`💬 General Chat`):**
   - Tokens: `[Hello]` + `[I Have a Question]`

---

## 🛠️ Tech Stack & Google Technologies

- **Agentic Orchestration:** Google Antigravity
- **AI Backend:** Gemini 2.5 Flash via official `@google/genai` SDK
- **Computer Vision:** `@mediapipe/tasks-vision` (WASM 0.10.14 & GPU delegate)
- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, dark glassmorphic Bento Grid dashboard
- **Speech & Audio:** Web Speech API (`SpeechSynthesis` & `webkitSpeechRecognition`), animated 24-bar audio equalizer
- **Deployment:** Firebase App Hosting (`apphosting.yaml`) and Google Cloud Run (`Dockerfile`)

---

## 🚀 Running Locally

```bash
yarn install
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

- Mode A (Free Internet API) is **active by default** with zero setup required.
- To test Mode B (Gemini 2.5 Flash), click the key icon in the navbar to enter your key or set `GEMINI_API_KEY` in `.env.local`.

---

## 📄 Submission Statement for Google AI Builder Cup

- **Track:** Sustainability & Social Impact
- **Project:** IsharaAI Studio — Real-Time Camera Hand Gesture-to-Voice & Text AI Bridge
- **Statement:** Orchestrated and verified using Google Antigravity, Gemini 2.5 Flash, MediaPipe Vision Tasks, and Cloud Run / Firebase App Hosting.
