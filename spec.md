# AI Mystery Room — Single Source of Truth

**Document:** SPEC.md  
**Version:** 1.0.0  
**Status:** Approved baseline for implementation  
**Project type:** AI-powered interactive mystery investigation web application  
**Architecture:** MERN stack  
**AI provider:** Google Gemini  
**Primary implementation agent:** OpenAI Codex

---

## 1. Product Overview

### 1.1 Product Name

AI Mystery Room

### 1.2 Product Vision

AI Mystery Room is an interactive detective experience in which users submit a short story, scenario, or mystery premise. The application uses Google Gemini on the backend to generate a complete fictional investigation.

Every investigation contains:
- A mystery scenario and crime or incident.
- A set of fictional suspects with motives, backgrounds, and alibis.
- AI-generated investigative evidence.
- Fictional chat conversations resembling messaging-app interfaces.
- Images and visual clues.
- Simulated CCTV footage or camera-recording evidence.
- Witness statements, timelines, and investigation reports.
- One predetermined culprit.
- A final accusation screen where the user selects the culprit.
- A verdict and explanation showing whether the user solved the mystery.

The user must investigate the available evidence, identify contradictions, connect clues, and make a final accusation.

### 1.3 Core Product Principle

The experience must feel like a detective investigation rather than a standard chatbot.

The AI creates the investigation, but the user solves it by examining evidence.

All evidence must belong to the same fictional case and form a coherent, solvable mystery.

### 1.4 Target Audience

- Mystery and detective-story enthusiasts.
- Casual gamers.
- Students interested in logical reasoning.
- Users looking for interactive storytelling.
- Users who want to create and solve custom mysteries.

### 1.5 Product Goals

1. Allow users to create a mystery from a short text prompt.
2. Generate a complete investigation using Gemini.
3. Present evidence in realistic, interactive interfaces.
4. Ensure clues are logically consistent and support a unique solution.
5. Let users accuse a suspect and receive a reasoned verdict.
6. Allow users to replay cases or create new mysteries.
7. Provide a responsive, polished desktop and mobile experience.

### 1.6 Non-Goals for Version 1

The initial version will not include:
- Real police investigations or real-world criminal accusations.
- Real WhatsApp account access or messaging integrations.
- Real CCTV hardware or live surveillance.
- Real user-uploaded video analysis.
- Multiplayer investigations.
- Public case-sharing feeds.
- Voice-controlled interrogation.
- Payments or subscriptions.
- User-generated evidence editing tools.
- An unrestricted AI chat assistant.

These features may be considered in future versions.

---

## 2. Technology Stack

### 2.1 Frontend

- React
- Vite
- JavaScript
- React Router
- CSS Modules or organized plain CSS
- Axios or a centralized Fetch API client
- Lucide React for icons

Use reusable React components and a clear separation between pages, components, hooks, API clients, and styles.

### 2.2 Backend

- Node.js
- Express.js
- JavaScript with ES modules
- REST API
- Google Gemini SDK through the official supported JavaScript integration
- Zod for request and AI-output validation
- Centralized error handling
- Structured logging

### 2.3 Database

- MongoDB
- Mongoose ODM

MongoDB stores users, case metadata, generated case content, evidence, investigation progress, and final accusations.

### 2.4 AI

- Google Gemini API
- Official Google Gen AI JavaScript SDK
- Structured JSON output wherever supported by the selected model
- Server-side AI service abstraction

The exact Gemini model must be configurable through an environment variable. Use a currently supported Gemini model and verify its availability before deployment.

### 2.5 Development Tools

- Visual Studio Code
- Git and GitHub
- npm
- Postman or equivalent API testing tool
- ESLint
- Vitest and React Testing Library for frontend tests
- Node.js test runner or Vitest and Supertest for backend tests

### 2.6 Architecture

React frontend → Express REST API → Authentication and case services → Gemini AI service and MongoDB.

The browser must never call Gemini directly. The Gemini API key must remain on the server.

---

## 3. User Roles

### 3.1 Guest User

A guest can:
- Open the home page.
- Create a mystery.
- Play a generated investigation.
- Examine evidence.
- Submit a final accusation.
- View the verdict.

Guest progress must persist during the active session. If durable progress is supported without an account, use a secure server-issued session or an opaque session identifier.

### 3.2 Registered User — Optional for MVP

If authentication is implemented, registered users can additionally:
- View previous cases.
- Resume unfinished investigations.
- Review past verdicts.
- Delete their cases and account data.

Authentication is not a prerequisite for the core investigation flow. Do not allow optional account functionality to delay the playable MVP.

---

## 4. User Journey

1. User opens the landing page.
2. User selects **Create a Mystery**.
3. User enters a short story, scenario, or mystery premise.
4. User optionally selects a difficulty level.
5. Frontend submits the request to the backend.
6. Backend validates the request and creates a case-generation job.
7. Gemini generates the case narrative, suspects, evidence, hidden solution, and scoring metadata.
8. Backend validates the generated JSON and checks the case for contradictions.
9. If validation fails, the backend retries a bounded number of times or marks the generation as failed.
10. The case becomes playable only after successful validation.
11. User enters the investigation room.
12. User reviews suspects and evidence.
13. User compares timestamps, statements, messages, and visual clues.
14. User selects the culprit and optionally submits a short explanation.
15. Backend checks the accusation against the predetermined solution.
16. Frontend displays the verdict, reasoning, and evidence-based explanation.
17. User can replay, return home, or create another mystery.

The hidden solution must be established before the user starts investigating and must not change in response to the user's guesses.

---

## 5. Functional Requirements

### FR-01: Landing Page

The landing page must include:
- Product name and branding.
- A clear headline describing the experience.
- A short explanation of how the game works.
- A primary "Create a Mystery" CTA.
- A secondary "How It Works" section.
- A preview of fictional evidence.
- Feature highlights.
- A footer with privacy and fictional-content disclaimers.

The page must not display fabricated user testimonials, fake usage statistics, or fake ratings.

### FR-02: Mystery Creation

Provide a form with:

- Story or scenario text: required.
- Minimum story length: 30 characters.
- Maximum story length: 2,000 characters.
- Difficulty: Easy, Medium, or Hard.
- Case generation action.
- Input validation and loading states.

Example input:

"A valuable diamond disappears during a private party. Four guests were present. Everyone claims they were somewhere else when the lights went out."

The user should not need to define the culprit, clues, suspects, or solution. Gemini creates these elements.

The UI must display validation errors next to the relevant field.

Disable duplicate submission while a request is being processed.

### FR-03: Case Generation

The backend must generate a complete case with:

- Case ID.
- Case title.
- Case summary.
- Incident description.
- Location and fictional date/time.
- Difficulty.
- Suspects.
- Suspect profiles and alibis.
- Motives and relationships.
- Evidence artifacts.
- Timeline.
- Hidden culprit.
- Correct solution explanation.
- Evidence-to-solution mapping.
- Scoring metadata.

Every case must contain exactly one culprit.

Every playable case must have enough evidence to distinguish the culprit from the innocent suspects.

### FR-04: Investigation Dashboard

The investigation page must contain:

1. Case header.
2. Case briefing.
3. Suspect list.
4. Evidence navigation.
5. Evidence viewer.
6. Investigation timeline.
7. Clue and contradiction indicators.
8. Evidence-inspected tracking.
9. Accusation action.
10. Optional progress indicator.

The UI must help users navigate evidence without revealing the correct suspect prematurely.

### FR-05: Suspect Profiles

Each suspect profile must show:

- Name.
- Fictional portrait or avatar.
- Role in the scenario.
- Relationship to the victim or incident.
- Publicly available background.
- Stated alibi.
- Known motive, if discovered.
- Relevant evidence references.

The frontend must not expose private solution fields from the backend API.

Do not show hidden culprit flags, internal reasoning, or answer mappings in suspect profiles.

### FR-06: Evidence System

Each evidence item must include:

- Evidence ID.
- Title.
- Evidence type.
- Description.
- Discovery source.
- Fictional timestamp, where relevant.
- Related suspects.
- Clue content.
- Inspection status.
- Optional unlock conditions.
- Optional asset URL.
- A safe, user-facing interpretation.

Supported evidence types:

1. CHAT_MESSAGE
2. IMAGE
3. CCTV
4. WITNESS_STATEMENT
5. DOCUMENT
6. TIMELINE_EVENT
7. FORENSIC_NOTE

Evidence must be represented using a type-specific schema.

The evidence viewer must adapt to the selected type.

#### Chat evidence

Display:
- Fictional participant names.
- Message timestamps.
- Left/right message bubbles.
- Conversation title.
- Relevant metadata.

The design may resemble a generic messaging application, but must not imply that the messages came from actual WhatsApp accounts.

#### Image evidence

Display:
- Image or generated illustration.
- Caption.
- Evidence number.
- Capture timestamp, if known.
- Investigation notes.

If an actual image-generation service is not configured, use a clearly labeled fictional illustration or designed visual placeholder. Do not invent a working image URL.

#### CCTV evidence

Display:
- A simulated surveillance-player interface.
- Fictional camera name.
- Fictional date and time.
- Scene image, storyboard, or short generated clip, if available.
- A timeline of relevant observations.

If no actual video asset is available, show a sequence of illustrated frames or a textual CCTV transcript. Do not present a still image as real video footage.

#### Documents and witness statements

Display:
- Document or witness title.
- Relevant text.
- Timestamp or author, when available.
- Associated clues.

### FR-07: Evidence Investigation

Users must be able to:
- Open and close evidence.
- Switch between evidence items.
- Mark evidence as inspected.
- Review suspect profiles.
- Compare evidence across the case.
- Revisit previously inspected evidence.
- View a chronological timeline.

The MVP does not require a free-form drag-and-drop evidence board.

### FR-08: Final Accusation

The accusation page must:
- Display all eligible suspects.
- Allow exactly one suspect selection.
- Require an explicit confirmation before submission.
- Optionally accept an explanation of up to 500 characters.
- Submit the accusation to the backend.
- Prevent repeated final submissions for the same case.

The backend must compare the selected suspect ID with the stored culprit ID.

The browser must never determine the authoritative verdict.

### FR-09: Verdict

The verdict screen must display:
- Correct or incorrect result.
- Selected suspect.
- Actual culprit.
- Explanation of the culprit's motive and actions.
- Key evidence supporting the solution.
- Important contradictions in the suspect statements.
- Explanation of misleading clues.
- Final score.
- Replay or return-home action.

The complete solution is disclosed only after a final accusation has been submitted, or after another explicitly defined reveal action.

### FR-10: Case History

For the MVP, case history may be limited to the current active session.

If persistent history is implemented, it must:
- Store the case ID and progress.
- Store the final accusation and result.
- Allow unfinished cases to be resumed.
- Keep hidden solution data out of client-facing responses.
- Support deletion.

---

## 6. AI Mystery Generation Contract

### 6.1 Gemini Responsibilities

Gemini is responsible for generating fictional case content, not controlling application security or deciding authoritative outcomes at runtime.

It generates:
- Narrative.
- Suspects.
- Alibis.
- Motives.
- Evidence.
- Clue relationships.
- Contradictions.
- Timeline.
- Culprit and explanation.
- Difficulty-appropriate clue distribution.

The backend remains responsible for validation, persistence, access control, scoring, and verdict computation.

### 6.2 Required Generation Output

The AI service must return a JSON object matching the application's validated case-generation schema.

Conceptual output:

{
  "title": "The Midnight Diamond",
  "summary": "A diamond vanishes during a private party.",
  "difficulty": "MEDIUM",
  "suspects": [],
  "timeline": [],
  "evidence": [],
  "solution": {
    "culpritSuspectId": "suspect_2",
    "motive": "A fictional financial motive.",
    "method": "A coherent fictional sequence of events.",
    "explanation": "An explanation supported by the evidence.",
    "keyEvidenceIds": ["evidence_1", "evidence_4"],
    "redHerrings": []
  }
}

This is a conceptual schema example, not a complete playable case.

The actual schema must define every field, enum, validation rule, and relationship.

### 6.3 Generation Rules

Gemini must follow these rules:

1. Generate exactly one culprit.
2. Generate 3–5 suspects.
3. Generate 6–10 evidence items.
4. Include at least 3 meaningful clues.
5. Include at least 2 clues that independently or jointly support the culprit's identification.
6. Include at least one contradiction between evidence and a suspect's statement.
7. Include a coherent timeline.
8. Ensure the culprit's actions are possible within that timeline.
9. Ensure innocent suspects have plausible reasons for appearing suspicious.
10. Avoid making the culprit obvious from a single introductory paragraph.
11. Avoid contradictions that cannot be resolved through available evidence.
12. Ensure every key solution claim references actual evidence IDs.
13. Use the same suspect IDs and names consistently across the case.
14. Make the case solvable without external research.
15. Adapt clue complexity to the selected difficulty.
16. Never include real personal data or claim that generated evidence is authentic.
17. Never depend on the user having access to an external service or private account.
18. Never change the culprit because of the user's investigation behavior.

### 6.4 Difficulty

**Easy**
- 3 suspects.
- 6 evidence items.
- Direct, understandable clues.
- A relatively clear timeline.

**Medium**
- 4 suspects.
- 8 evidence items.
- Multiple connected clues.
- Some misleading but explainable information.

**Hard**
- 5 suspects.
- 10 evidence items.
- More indirect clues.
- Interconnected timelines and alibis.
- More subtle contradictions.

The backend must enforce these counts, even when Gemini returns a different number.

### 6.5 Case Validation

Before a case becomes playable, validate:

- JSON parses successfully.
- All required fields exist.
- Suspect IDs are unique.
- Evidence IDs are unique.
- Exactly one culprit exists.
- Culprit ID references a valid suspect.
- All evidence references point to valid suspects or evidence.
- Key evidence IDs exist.
- Timestamps are valid and ordered where required.
- The case meets the selected difficulty constraints.
- The solution explanation is supported by the evidence.
- The evidence contains enough information to distinguish the culprit.

Use deterministic validation first.

If validation fails, request a bounded AI repair or regeneration attempt. Limit retries, generation tokens, and request duration.

If the case still fails validation, return a safe error and do not expose the incomplete case.

A language model's self-assessment alone does not prove that a mystery is logically solvable. Include automated consistency checks and tests for known contradictions.

### 6.6 AI Service Separation

Implement the AI logic in a dedicated service, for example:

server/src/services/geminiService.js

The service must:
- Read the API key from environment variables.
- Use a configurable model.
- Submit the generation prompt.
- Parse structured output.
- Handle API failures.
- Handle rate limits and timeouts.
- Avoid logging API keys or full sensitive request headers.
- Return validated data or a typed application error.

Keep prompt templates separate from HTTP route handlers.

---

## 7. AI-Generated Visual Assets

The initial MVP must support fictional visual evidence without requiring a separate image-generation provider.

### 7.1 Asset Strategy

Support three asset modes:

1. GENERATED_IMAGE: a real image asset created by a configured image-generation service.
2. GENERATED_VIDEO: a real short video asset created by a configured video-generation service.
3. SIMULATED_EVIDENCE: a frontend-rendered scene, fictional image placeholder, chat interface, or CCTV-style timeline.

Gemini text generation must not be assumed to produce a downloadable image or video asset.

### 7.2 Asset Requirements

Every asset must:
- Be associated with a case and evidence item.
- Have a validated type and storage reference.
- Be served from an approved asset location.
- Have a fallback if unavailable.
- Avoid exposing filesystem paths or private storage credentials.
- Be clearly fictional or simulated.

For the MVP, store asset metadata in MongoDB and use local static assets for fixed illustrations. If actual generated assets are added, use an appropriate file or object-storage service.

Do not embed large binary files directly in case documents.

### 7.3 Visual Consistency

When multiple generated images belong to the same case, use consistent character descriptions and scene details.

Do not treat an AI-generated visual as independent proof of a fact unless the case explicitly establishes what the image represents.

---

## 8. UI/UX Design Specification

### 8.1 Design Direction

Create a premium detective-investigation interface.

Visual qualities:
- Dark, cinematic, investigative atmosphere.
- Clear typography.
- Restrained accent colors.
- High-contrast evidence panels.
- Subtle borders and shadows.
- Minimal, purposeful animations.
- Strong information hierarchy.

Suggested design tokens:

- Background: #0B0D12
- Primary surface: #131722
- Secondary surface: #1A2030
- Primary text: #F5F7FA
- Secondary text: #9CA7B8
- Accent: #C8A45D
- Danger: #D9534F
- Success: #4CAF86
- Border: #2A3242

Use these as initial tokens. Maintain readable contrast and avoid using color alone to communicate a status.

### 8.2 Typography

Use a clean sans-serif font such as Inter for body text.

Use a restrained display font for case titles if appropriate.

Use a monospaced font for timestamps, camera metadata, and forensic reference IDs.

### 8.3 Required Pages

#### Page A: Home

Route: /

Sections:
- Navigation and logo.
- Hero section.
- Story prompt CTA.
- How it works.
- Evidence-type preview.
- Product feature highlights.
- Footer.

#### Page B: Create Case

Route: /create

Elements:
- Story input.
- Character counter.
- Difficulty selector.
- Generate button.
- Validation errors.
- Generation progress indicator.

#### Page C: Investigation Room

Route: /case/:caseId

Layout:
- Header with case title and status.
- Left sidebar with suspects and evidence.
- Main evidence viewer.
- Optional right panel with timeline and notes.
- Final accusation action.

On mobile, sidebars must become accessible drawers, tabs, or stacked sections.

#### Page D: Accusation

Route: /case/:caseId/accuse

Elements:
- Suspect selection cards.
- Optional explanation input.
- Confirmation action.
- Submission error state.

#### Page E: Verdict

Route: /case/:caseId/verdict

Elements:
- Verdict banner.
- Selected and actual suspect.
- Final score.
- Explanation.
- Key evidence.
- Contradiction analysis.
- Replay and home actions.

#### Page F: Not Found

Route: *

Display a clear message and a link to return home.

### 8.4 Reusable Components

Create reusable components for:
- Navbar.
- PrimaryButton.
- TextAreaField.
- DifficultySelector.
- LoadingIndicator.
- ErrorMessage.
- SuspectCard.
- SuspectProfile.
- EvidenceCard.
- EvidenceSidebar.
- EvidenceViewer.
- ChatEvidence.
- ImageEvidence.
- CctvEvidence.
- DocumentEvidence.
- Timeline.
- AccusationForm.
- VerdictPanel.
- Modal.
- Toast or notification.
- EmptyState.

### 8.5 Responsive Requirements

- Support mobile screens from approximately 360 px wide.
- Support tablet and desktop layouts.
- Prevent horizontal overflow.
- Keep controls touch-friendly.
- Preserve evidence readability on small screens.
- Ensure keyboard navigation and visible focus indicators.
- Respect reduced-motion preferences.

### 8.6 UI States

Every asynchronous feature must handle:
- Idle.
- Loading.
- Success.
- Empty.
- Validation error.
- Network error.
- Server error.
- Retry.
- Expired or unavailable case.

Do not leave the user on a permanently loading screen.

---

## 9. MongoDB Data Models

Use Mongoose schemas with timestamps and validation.

### 9.1 Case Model

Collection: cases

Fields:

- _id: ObjectId
- title: String
- summary: String
- storyPrompt: String
- difficulty: EASY | MEDIUM | HARD
- status: GENERATING | READY | FAILED
- incident: Object
- suspects: Array
- timeline: Array
- evidence: Array
- solution: Object, private
- assetManifest: Array, optional
- generationMetadata: Object
- ownerId: ObjectId or null
- sessionIdHash: String or null
- createdAt: Date
- updatedAt: Date
- expiresAt: Date, optional

Incident object:
- description
- location
- occurredAt

Suspect object:
- id
- name
- role
- profile
- motiveSummary
- alibi
- portraitAssetId, optional

Timeline entry:
- id
- timestamp
- description
- relatedSuspectIds
- relatedEvidenceIds

Solution object:
- culpritSuspectId
- motive
- method
- explanation
- keyEvidenceIds
- redHerrings

The solution object must be treated as private server data. It must never be serialized as part of a public case response.

### 9.2 Evidence Model

For the MVP, evidence may be embedded in the Case document.

Every evidence item must contain:

- id: String
- type: Enum
- title: String
- description: String
- discoveredAt: Date or null
- occurredAt: Date or null
- relatedSuspectIds: String[]
- relatedEvidenceIds: String[]
- clueSummary: String
- content: Object
- assetId: String or null

Type-specific content examples:

CHAT_MESSAGE:
- conversationTitle
- participants
- messages: [{ senderId, text, timestamp }]

IMAGE:
- caption
- timestamp
- assetId
- visualDescription

CCTV:
- cameraName
- timestampStart
- timestampEnd
- observations
- transcript
- assetId

WITNESS_STATEMENT:
- witnessSuspectId or null
- statement
- recordedAt

DOCUMENT:
- documentType
- author
- documentText
- createdAt

TIMELINE_EVENT:
- eventDescription
- timestamp
- relatedSuspectIds

FORENSIC_NOTE:
- observation
- significance
- relatedEvidenceIds

Never execute content returned by Gemini as code or HTML.

### 9.3 Investigation Session Model

Collection: investigations

Fields:

- _id
- caseId
- sessionIdHash or userId
- inspectedEvidenceIds: String[]
- notes: Array, optional
- status: IN_PROGRESS | COMPLETED
- accusation: Object or null
- score: Number or null
- startedAt
- completedAt
- createdAt
- updatedAt

Accusation object:
- suspectId
- explanation
- isCorrect
- submittedAt

The server must enforce one final accusation per investigation.

Use indexes for caseId, session or user ownership, and expiration where needed.

### 9.4 Asset Metadata Model

Collection: assets, optional for MVP.

Fields:
- _id
- caseId
- evidenceId
- assetType
- storageKey
- mimeType
- sizeBytes
- createdAt
- expiresAt

Store actual files outside MongoDB. Validate MIME type and size.

### 9.5 Persistence Rules

- Persist a case only after successful generation and validation.
- Never return private solution fields in ordinary case responses.
- Never trust client-submitted case contents.
- Use server-controlled status transitions.
- Enforce case ownership or session authorization.
- Configure appropriate TTL indexes if temporary cases are used.

---

## 10. REST API Specification

Base path: /api/v1

All JSON endpoints must use consistent response formats.

Success:

{
  "success": true,
  "data": {}
}

Error:

{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The supplied request is invalid."
  }
}

The examples are response-shape illustrations. The actual schemas must be implemented and tested.

### 10.1 Health Check

GET /api/v1/health

Purpose:
- Check server availability.
- Report application status.

Must not expose secrets, environment variables, internal file paths, or sensitive infrastructure details.

### 10.2 Create Case

POST /api/v1/cases

Request:

{
  "storyPrompt": "A diamond disappears during a private party.",
  "difficulty": "MEDIUM"
}

Behavior:
- Validate request.
- Enforce size and rate limits.
- Start case generation.
- Return the created case ID and status.

For asynchronous generation, return HTTP 202 with:

{
  "success": true,
  "data": {
    "caseId": "case-id",
    "status": "GENERATING"
  }
}

For short synchronous generation, a validated ready case may be returned directly. Choose one consistent strategy and document it in the implementation.

### 10.3 Get Case Status

GET /api/v1/cases/:caseId/status

Returns:
- GENERATING
- READY
- FAILED

Include a safe, user-friendly error message for failures.

### 10.4 Get Playable Case

GET /api/v1/cases/:caseId

Returns:
- Public case metadata.
- Suspects.
- Timeline.
- Evidence.
- Asset metadata.
- Current investigation progress, if applicable.

Must exclude:
- Culprit ID.
- Solution explanation.
- Hidden motive details.
- Correct-answer flags.
- Private generation prompts.
- Internal validation results that reveal the solution.

### 10.5 Inspect Evidence

POST /api/v1/cases/:caseId/evidence/:evidenceId/inspect

Purpose:
- Record that evidence was inspected.
- Return the evidence item if not already included in the case response.

The backend must verify access to the case and evidence.

### 10.6 Submit Accusation

POST /api/v1/cases/:caseId/accusations

Request:

{
  "suspectId": "suspect_2",
  "explanation": "The timeline contradicts the suspect's alibi."
}

Behavior:
- Validate suspect ID.
- Validate explanation length.
- Verify investigation access.
- Reject duplicate final accusations.
- Compute correctness on the server.
- Calculate score.
- Store the completed investigation.
- Return the verdict and solution explanation.

Only reveal the solution after the accusation has been accepted.

### 10.7 Get Verdict

GET /api/v1/cases/:caseId/verdict

Returns the verdict only if the current authorized investigation has completed.

### 10.8 Optional Case History

GET /api/v1/investigations

List the current user's or authorized session's investigations.

GET /api/v1/investigations/:investigationId

Retrieve an authorized investigation.

DELETE /api/v1/cases/:caseId

Delete a case only if the requester has the required ownership or authorization.

### 10.9 HTTP Status Codes

Use:
- 200: Successful retrieval or update.
- 201: Successfully created resource.
- 202: Accepted asynchronous generation.
- 400: Invalid request.
- 401: Authentication required, when applicable.
- 403: Unauthorized access.
- 404: Case or evidence not found.
- 409: Invalid state transition or duplicate accusation.
- 413: Request too large.
- 429: Rate limit exceeded.
- 500: Unexpected server error.
- 502 or 503: Upstream AI service unavailable.

Do not expose stack traces to the client.

---

## 11. Investigation Scoring

Use deterministic scoring for the MVP.

Suggested scoring:
- Correct accusation: 70 points.
- Incorrect accusation: 0 points for the accusation component.
- Evidence coverage: up to 20 points.
- Explanation quality: up to 10 points.

Total maximum: 100 points.

Evidence coverage:

evidenceScore = round(20 × inspectedRelevantEvidence / totalRelevantEvidence)

Use unique evidence IDs and prevent duplicate counting.

Explanation quality should be scored with deterministic checks for whether the explanation references relevant evidence or known clue concepts. Do not claim semantic understanding from a simple keyword match.

For the initial MVP, a fixed explanation score based on evidence references is acceptable. An optional Gemini-based rubric may be added later, but it must be bounded, validated, and prevented from changing the correctness of the accusation.

Do not penalize a user for inspecting irrelevant evidence unless a future game mode explicitly requires time or resource constraints.

Display a clear breakdown of the final score.

---

## 12. Frontend State and Data Handling

Use React state and reusable hooks.

Suggested hooks:
- useCase
- useInvestigation
- useEvidence
- useAccusation

Maintain the following state:
- Current case.
- Case generation status.
- Selected evidence ID.
- Inspected evidence IDs.
- Selected suspect ID.
- Accusation submission status.
- Final verdict.

Requirements:
- Centralize API calls.
- Use a consistent error-handling layer.
- Cancel or ignore stale requests where appropriate.
- Avoid duplicating server-authoritative state unnecessarily.
- Do not place the Gemini API key or private solution in frontend code.
- Do not store the hidden solution in localStorage, sessionStorage, or client-side application state before the verdict is authorized.

The frontend may store non-sensitive UI preferences and temporary navigation state.

---

## 13. Security and Privacy

### 13.1 Secrets

Required server-side environment variables:

- PORT
- MONGODB_URI
- GEMINI_API_KEY
- GEMINI_MODEL
- CLIENT_ORIGIN
- NODE_ENV

Optional:
- SESSION_SECRET
- SESSION_COOKIE_NAME
- CASE_TTL_DAYS
- GEMINI_TIMEOUT_MS
- MAX_CASE_GENERATION_RETRIES

Create .env.example containing placeholders only.

Never commit .env.

### 13.2 API Security

Implement:
- CORS restricted to configured origins.
- Helmet security headers.
- Request body size limits.
- Input validation.
- Rate limiting for generation and accusation endpoints.
- Request timeouts.
- Centralized error handling.
- Secure session handling if sessions are implemented.
- Ownership checks for protected resources.

Use secure, HTTP-only cookies when cookie-based authentication is implemented.

If guest sessions are used, use unpredictable server-issued identifiers, hash them for storage where appropriate, and avoid accepting arbitrary client-selected identifiers as proof of ownership.

### 13.3 AI Security

Treat user prompts and AI-generated output as untrusted input.

- Do not execute generated JavaScript, HTML, shell commands, or database queries.
- Validate output against strict schemas.
- Render text as text.
- Sanitize any supported rich-text content.
- Never let user prompts override system-defined case rules.
- Never allow generated content to determine server authorization.
- Bound model output size, retries, and generation duration.
- Do not include secrets or private database information in prompts.

### 13.4 Fictional Content

All cases and evidence are fictional.

Use fictional names, organizations, addresses, account identifiers, and timestamps.

Do not generate evidence that purports to be an authentic record from a real person or an actual messaging account.

Provide a disclaimer that AI-generated visual and written evidence is fictional and intended for entertainment.

---

## 14. Error Handling

Handle at least these scenarios:

1. Empty story prompt.
2. Story prompt below minimum length.
3. Story prompt above maximum length.
4. Unsupported difficulty.
5. Gemini timeout.
6. Gemini rate limit.
7. Gemini malformed JSON.
8. Invalid suspect references.
9. Duplicate evidence IDs.
10. Missing culprit.
11. More than one culprit.
12. Missing solution evidence.
13. MongoDB connection failure.
14. Case not found.
15. Unauthorized case access.
16. Evidence not found.
17. Duplicate accusation.
18. Invalid accusation suspect.
19. Expired case.
20. Missing image or video asset.

Each failure must have:
- A stable error code.
- A user-friendly message.
- Appropriate HTTP status.
- A useful server-side log entry without exposing secrets.

---

## 15. Performance and Reliability

Target behavior:
- Normal page navigation must feel immediate.
- Show a loading screen during case generation.
- Prefer asynchronous generation if the AI call is slow.
- Avoid blocking the Express event loop.
- Configure database connection pooling.
- Limit generated case sizes.
- Avoid unnecessary MongoDB reads.
- Cache only data that is safe to cache.
- Provide graceful recovery from failed AI requests.

Initial performance objectives:
- Ordinary API response: p95 under 500 ms when database and infrastructure conditions permit.
- Case generation: show progress immediately and aim for completion within 30 seconds under normal provider conditions.
- Frontend: no unnecessary large media downloads before they are needed.

These are engineering targets, not guarantees. AI generation latency depends on the provider, model, prompt, and network.

---

## 16. Recommended Project Structure

ai-mystery-room/
  SPEC.md
  README.md
  .gitignore
  client/
    package.json
    index.html
    src/
      main.jsx
      App.jsx
      routes/
      pages/
        HomePage.jsx
        CreateCasePage.jsx
        InvestigationPage.jsx
        AccusationPage.jsx
        VerdictPage.jsx
        NotFoundPage.jsx
      components/
        layout/
        evidence/
        suspects/
        investigation/
        common/
      hooks/
      services/
        api.js
      styles/
        tokens.css
        global.css
      utils/
  server/
    package.json
    src/
      server.js
      app.js
      config/
        env.js
        database.js
      models/
        Case.js
        Investigation.js
        Asset.js
      routes/
        healthRoutes.js
        caseRoutes.js
        investigationRoutes.js
      controllers/
        caseController.js
        investigationController.js
      services/
        geminiService.js
        caseGenerationService.js
        caseValidationService.js
        scoringService.js
      schemas/
        caseSchemas.js
        requestSchemas.js
      middleware/
        errorHandler.js
        rateLimiter.js
        sessionMiddleware.js
      prompts/
        mysteryGenerationPrompt.js
      utils/
        AppError.js
        asyncHandler.js
      tests/
        caseValidation.test.js
        caseRoutes.test.js
        scoring.test.js
  .env.example

Codex may reorganize the structure if there is a clear technical reason, but it must preserve the separation of concerns.

---

## 17. Testing Requirements

### 17.1 Frontend Tests

Test:
- Home page navigation.
- Story form validation.
- Difficulty selection.
- Loading and error states.
- Evidence navigation.
- Evidence inspection.
- Suspect selection.
- Accusation confirmation.
- Verdict rendering.
- Responsive layout behavior where practical.

### 17.2 Backend Unit Tests

Test:
- Case schema validation.
- Unique suspect IDs.
- Unique evidence IDs.
- Exactly one culprit.
- Valid culprit references.
- Valid key evidence references.
- Difficulty constraints.
- Timestamp consistency.
- Scoring calculations.
- Duplicate accusation prevention.
- Public/private response serialization.

### 17.3 API Integration Tests

Test:
- Successful case creation.
- Invalid creation requests.
- Generation failures.
- Polling case status.
- Retrieving a ready case.
- Hidden solution never appearing in public responses.
- Evidence inspection.
- Correct accusation.
- Incorrect accusation.
- Duplicate accusation.
- Unauthorized access.
- Missing cases and evidence.

Use mocked Gemini responses for deterministic tests. Automated tests must not depend on a paid Gemini request.

### 17.4 End-to-End Test

The following must work from beginning to end:

1. Open the website.
2. Submit a scenario.
3. Select a difficulty.
4. Generate a case.
5. Open the investigation room.
6. Review suspects.
7. Inspect chat evidence.
8. Inspect visual or simulated CCTV evidence.
9. Submit an accusation.
10. Receive the verdict.
11. View the correct solution and supporting clues.
12. Start a new case.

---

## 18. Acceptance Criteria

The MVP is complete only when all the following conditions are satisfied.

### Product

- [ ] A user can submit a custom story.
- [ ] A user can select a difficulty.
- [ ] Gemini generates a fictional mystery.
- [ ] Every ready case contains exactly one culprit.
- [ ] Every ready case contains valid suspects and evidence.
- [ ] Evidence is coherent and linked to the same case.
- [ ] The user can inspect multiple evidence types.
- [ ] The user can submit one final accusation.
- [ ] The backend computes the verdict.
- [ ] The user receives a solution explanation.
- [ ] The user can create another case.

### Security

- [ ] Gemini API key is never exposed to the browser.
- [ ] Hidden solution fields are excluded from public responses.
- [ ] Invalid AI output cannot become a playable case.
- [ ] Server-side validation is implemented.
- [ ] API endpoints enforce request limits.
- [ ] Case access and session ownership are checked.
- [ ] Generated content is rendered safely.

### UI/UX

- [ ] All required pages are implemented.
- [ ] The UI is responsive.
- [ ] Loading, empty, error, and success states exist.
- [ ] Evidence types have appropriate viewers.
- [ ] The application has a consistent design system.
- [ ] Keyboard navigation and accessible focus states work.

### Engineering

- [ ] Frontend and backend start with documented commands.
- [ ] MongoDB connection works.
- [ ] Environment configuration is documented.
- [ ] Tests cover core validation and scoring.
- [ ] Tests do not require live Gemini requests.
- [ ] README explains setup, environment variables, and API endpoints.
- [ ] No secrets are committed.
- [ ] No critical console errors or unhandled server exceptions remain.

---

## 19. Implementation Phases

### Phase 1 — Foundation

- Create the repository structure.
- Initialize React/Vite.
- Initialize Express.
- Configure MongoDB.
- Add environment validation.
- Add health check.
- Establish shared API response conventions.

### Phase 2 — UI Skeleton

- Implement the landing page.
- Implement case creation.
- Implement the investigation layout.
- Implement suspect cards and evidence viewers.
- Implement accusation and verdict pages.
- Add responsive styling.

Use deterministic mock case data initially.

### Phase 3 — Case Generation

- Integrate Gemini.
- Implement the generation prompt.
- Define strict Zod schemas.
- Implement validation and bounded retries.
- Persist valid cases.
- Implement generation status handling.

### Phase 4 — Investigation Logic

- Connect case retrieval.
- Track inspected evidence.
- Implement timeline and suspect navigation.
- Implement secure final accusation.
- Implement scoring and verdict generation.

### Phase 5 — Hardening

- Add security middleware.
- Add request limits.
- Add error handling.
- Test solution privacy.
- Test invalid AI output.
- Test the complete investigation flow.
- Document setup and deployment.

### Phase 6 — Optional Enhancements

Only after the core application works:
- Actual image-generation integration.
- Actual video-generation integration.
- Registered accounts.
- Saved case history.
- More advanced investigation notes.
- Case sharing.
- Additional game modes.

---

## 20. Definition of Done

The implementation is considered done when:

1. The application runs locally using documented commands.
2. MongoDB persistence is operational.
3. Gemini generates valid, playable fictional investigations.
4. The main investigation flow works end to end.
5. Users can inspect evidence and select a culprit.
6. The backend returns a trustworthy verdict based on the stored solution.
7. The solution remains private until authorized disclosure.
8. The UI is polished and responsive.
9. Critical tests pass.
10. The README and .env.example are complete.

Do not claim that an integration works unless it has been implemented and tested.

---

## 21. Codex Implementation Rules

This document is the authoritative product and technical specification for AI Mystery Room.

When implementing the project:

1. Read SPEC.md before writing or modifying application code.
2. Treat functional requirements, security requirements, data contracts, and acceptance criteria as binding.
3. Do not silently change product behavior, API contracts, schema fields, or the technology stack.
4. Prefer small, verifiable implementation steps.
5. Implement the smallest complete vertical slice first: create a case, investigate, accuse, and reveal the verdict.
6. Use mock data only where explicitly appropriate, and clearly separate mock mode from production integrations.
7. Never fake successful Gemini generation, image generation, video generation, or database persistence.
8. Keep the frontend and backend contracts consistent.
9. Add or update tests whenever behavior or schemas change.
10. Keep environment variables and secrets out of source control.
11. Do not expose private solution data in API responses or browser storage.
12. Update SPEC.md when a mutually agreed product or architectural decision changes.
13. Record unresolved decisions in a dedicated section rather than silently guessing.
14. Verify each implementation phase before proceeding to the next.
15. Run the available tests and report any failures honestly.
16. Never remove an acceptance criterion merely to make an implementation appear complete.

### Required final handoff

Provide:
- The implemented project structure.
- Exact local setup commands.
- Required environment variables.
- MongoDB setup instructions.
- Gemini API configuration instructions.
- Available API endpoints.
- Test commands and results.
- Known limitations.
- Any acceptance criteria that remain incomplete.

**End of specification.**