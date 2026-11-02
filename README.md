# AI Mystery Room

Create a fictional mystery, examine the evidence, and make the accusation yourself. Cases are generated on the server with Gemini; the hidden solution stays server-side until your final accusation.

## Requirements

- Node.js 22 LTS (the Google Gen AI SDK requires Node.js 20 or newer)
- MongoDB 6+
- A Google Gemini API key

## Run locally

1. Copy `.env.example` to `.env` and set `GEMINI_API_KEY` and a unique `SESSION_SECRET` (at least 32 characters).
2. Start MongoDB locally (or set `MONGODB_URI` to your MongoDB deployment).
3. Install all workspace dependencies from the repository root and start the app:

```sh
npm install
npm run dev
```

The Vite client runs at `http://localhost:5173` and proxies `/api` to Express at `http://localhost:4000`.

## Deploy to Render

The included `render.yaml` deploys the client and API together as one Node web service. Express serves the Vite build in production, so the browser and API share an origin and guest session cookies work without a separate client deployment.

1. Push this repository to a GitHub repository.
2. Create a MongoDB database with a hosted MongoDB provider. Copy its connection URI and allow network access from Render (for MongoDB Atlas, configure Network Access accordingly). Keep the URI private.
3. In Google AI Studio, create an API key for Gemini. Keep it private; it is used only by the server.
4. In Render, choose **New → Blueprint**, connect the repository, and select the branch to deploy. Render reads `render.yaml` at the repository root.
5. When prompted, provide `MONGODB_URI` and `GEMINI_API_KEY`. Render generates `SESSION_SECRET` for you. The blueprint sets `NODE_ENV=production` and uses Node 22.
6. Create the Blueprint and wait for the first deploy. Render runs `npm ci && npm run build`, then `npm start`. The health check is `/api/v1/health`.
7. Open the service URL shown in Render. Try creating a case; this checks the Gemini key, database connection, API, and browser session together. The Blueprint uses Render's free web plan for a low-cost trial; free services sleep after 15 minutes idle and can take about a minute to wake. Choose a paid plan in Render if you need always-on service.

For subsequent updates, push to the connected branch and Render deploys the new commit. Set any additional server configuration in the Render service's Environment page. Do not add secrets to `render.yaml`, frontend variables, or Git. If you deploy the client and API on separate domains instead, set `CLIENT_ORIGIN` to the exact client origin and update the client's API base URL; the included setup intentionally keeps them together.

## Environment

See `.env.example`. `GEMINI_MODEL` selects the Google Gen AI model. The default is `gemini-2.5-flash`; confirm model availability for your project and region before deployment. Keep all secrets server-side. Session cookies are HTTP-only and use MongoDB-backed session storage.

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

Guest sessions, case generation, investigation evidence, inspection tracking, accusations, deterministic scoring, and verdict reveal are included. Account registration, persistent cross-device case history, and real image/video generation are outside this MVP. Automated test suites are not included in this initial implementation.
