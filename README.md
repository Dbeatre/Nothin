# StudyPulse AI

AI-powered study planner that analyzes your study material and generates summaries, mind maps, practice questions, and a 3-day schedule.

## Setup

1. Clone this repository.
2. Copy `.env.local.example` to `.env.local` and add your Gemini API key (optional – mock mode works without it).
3. Install dependencies: `npm install`
4. Run development server: `npm run dev`
5. Open `http://localhost:5173` on your mobile or desktop.

## Deployment

- Deploy to Vercel or Netlify via their dashboard (mobile-friendly).
- Add `VITE_GEMINI_API_KEY` as an environment variable in the dashboard.

## Features

- Upload images (camera/gallery) or PDFs (text extraction)
- Auto-detects subject and grade level
- Generates bullet-point summary and Mermaid mind map
- Practice suite with MCQs, short questions, and step-by-step numericals
- Context-aware chat with prompt chips
- 3-day study schedule with progress tracking
- Fully responsive with dedicated mobile and desktop shells
- Mock mode for testing without API key
