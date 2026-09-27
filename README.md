# Emotional AI — Version 1

A learning project for building a conversational AI that simulates an emotional state while being transparent that this is computational state, not proof of subjective feelings.

## Features
- Conversational web UI
- Happiness, sadness, anger, fear, trust and energy state
- Event-driven emotion updates
- Short-term conversation memory
- Long-term user memory
- Configurable personality
- Response planning
- Safety and permission checks
- Local fallback conversation engine
- JSON API
- Debug state panel
- Persistent local JSON data
- Architecture prepared for voice and future robot adapters

## Run
1. Install Node.js 18+.
2. Run npm start.
3. Open http://localhost:3000.

No API key is required for the demo.

## Architecture
Browser -> HTTP API -> Conversation Orchestrator -> Safety + Memory + Emotion + Personality + Planner + Model Adapter
