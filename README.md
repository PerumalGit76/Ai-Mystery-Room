# AI Mystery Room

Create a fictional mystery, examine the evidence, and make the accusation yourself. Cases are generated on the server with Gemini; the hidden solution stays server-side until your final accusation.

## Requirements

- Node.js 22 LTS (the Google Gen AI SDK requires Node.js 20 or newer)
- MongoDB 6+
- A Google Gemini API key

## Run locally

1. Copy `.env.example` to `.env` and fill in `GEMINI_API_KEY` and a unique `SESSION_SECRET` (at least 32 characters).
2. Start MongoDB locally (or set `MONGODB_URI` to your MongoDB deployment).
3. Install all workspace dependencies from the repository root and start the app:

```sh
npm install
npm run dev
```

The Vite client runs at `http://localhost:5173` and proxies `/api` to Express at `http://localhost:4000`. For production, build with `npm run build`, set `CLIENT_ORIGIN` to the deployed client origin, and run `npm start` in an environment that serves the client build or behind a static web server.

## Environment

See `.env.example`. `GEMINI_MODEL` selects the Google Gen AI model. The default is `gemini-3.8-flash`; confirm model availability for your project and region before deployment. Keep all secrets server-side. Session cookies are HTTP-only and use MongoDB-backed session storage.

## API

Base path: `/api/v1`

- `GET /health`
- `POST /cases` — `{ "storyPrompt": "...", "difficulty": "MEDIUM" }`
- `GET /cases/:caseId/status`
- `GET /cases/:caseId`
- `POST /cases/:caseId/evidence/:evidenceId/inspect`
- `POST /cases/:caseId/accusations` — `{ "suspectId": "suspect_1", "explanation": "..." }`
- `GET /cases/:caseId/verdict`

Successful responses use `{ "success": true, "data": ... }`; errors use `{ "success": false, "error": { "code", "message" } }`.

## Case generation and privacy

Generation is synchronous for this MVP. A case is saved as playable only after schema, reference, difficulty-count, and timeline checks pass. If Gemini or MongoDB is unavailable, the API returns a safe error. No mock generation path is included. Public case responses omit the culprit and solution. One final accusation is accepted per session and the server computes its result.

All people, messages, documents, and visualizations are fictional. Image and CCTV evidence use clearly labeled simulated, text-based visualizations; no live surveillance or generated media provider is implied.

The score is deterministic: a correct accusation is worth 70 points, inspecting key evidence earns up to 20, and an explanation earns up to 10 when it repeats clue terms from relevant evidence. This last component is a literal keyword check, not an AI assessment of reasoning.

## Current scope

Guest sessions, case generation, investigation evidence, inspection tracking, accusations, deterministic scoring, and verdict reveal are included. Account registration, persistent cross-device case history, real image/video generation, and production deployment configuration are outside this MVP. Automated test suites are not included in this initial implementation.
