import { z } from 'zod';

const date = z.string().datetime({ offset: true });
const participant = z.object({ id: z.string(), name: z.string() }).strict();
const message = z.object({ senderId: z.string(), senderName: z.string().optional(), text: z.string().min(1).max(1200), timestamp: date }).strict();
const contentByType = {
  CHAT_MESSAGE: z.object({ conversationTitle: z.string(), participants: z.array(participant).min(2), messages: z.array(message).min(2).max(30) }).strict(),
  IMAGE: z.object({ caption: z.string(), timestamp: date.nullable().optional(), assetId: z.string().nullable().optional(), visualDescription: z.string() }).strict(),
  CCTV: z.object({ cameraName: z.string(), timestampStart: date, timestampEnd: date, observations: z.array(z.string()).min(1), transcript: z.string().optional(), assetId: z.string().nullable().optional() }).strict(),
  WITNESS_STATEMENT: z.object({ witnessSuspectId: z.string().nullable(), statement: z.string(), recordedAt: date, author: z.string().optional() }).strict(),
  DOCUMENT: z.object({ documentType: z.string(), author: z.string().optional(), documentText: z.string(), createdAt: date }).strict(),
  TIMELINE_EVENT: z.object({ eventDescription: z.string(), timestamp: date, relatedSuspectIds: z.array(z.string()).default([]) }).strict(),
  FORENSIC_NOTE: z.object({ observation: z.string(), significance: z.string(), relatedEvidenceIds: z.array(z.string()).default([]) }).strict(),
};
const evidenceSchema = z.discriminatedUnion('type', Object.entries(contentByType).map(([type, content]) => z.object({
  id: z.string().min(1), type: z.literal(type), title: z.string().min(2).max(100), description: z.string().min(8).max(1200),
  discoveredAt: date.nullable().optional(), occurredAt: date.nullable().optional(), relatedSuspectIds: z.array(z.string()), relatedEvidenceIds: z.array(z.string()),
  clueSummary: z.string().min(8).max(500), content, assetId: z.string().nullable().optional(),
}).strict()));
const suspectSchema = z.object({ id: z.string().min(1), name: z.string().min(2).max(80), role: z.string().min(2).max(100), profile: z.string().min(15).max(900), motiveSummary: z.string().min(8).max(500), alibi: z.string().min(8).max(600), portraitAssetId: z.string().nullable().optional() }).strict();
const timelineSchema = z.object({ id: z.string().min(1), timestamp: date, description: z.string().min(8).max(500), relatedSuspectIds: z.array(z.string()), relatedEvidenceIds: z.array(z.string()) }).strict();
export const generatedCaseSchema = z.object({
  title: z.string().min(4).max(100), summary: z.string().min(20).max(700), difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  incident: z.object({ description: z.string().min(20).max(1200), location: z.string().min(2).max(120), occurredAt: date }).strict(),
  suspects: z.array(suspectSchema), timeline: z.array(timelineSchema).min(3).max(16), evidence: z.array(evidenceSchema),
  solution: z.object({ culpritSuspectId: z.string(), motive: z.string().min(10).max(700), method: z.string().min(10).max(700), explanation: z.string().min(40).max(1800), keyEvidenceIds: z.array(z.string()).min(2), redHerrings: z.array(z.string()).max(8), contradictions: z.array(z.object({ description: z.string().min(10), suspectId: z.string(), evidenceIds: z.array(z.string()).min(1) }).strict()).min(1).max(8) }).strict(),
}).strict();

export function validateGeneratedCase(raw, difficulty) {
  const parsed = generatedCaseSchema.parse(raw);
  const expected = { EASY: [3, 6], MEDIUM: [4, 8], HARD: [5, 10] }[difficulty];
  if (parsed.difficulty !== difficulty || parsed.suspects.length !== expected[0] || parsed.evidence.length !== expected[1]) {
    throw new Error(`Case must match ${difficulty} difficulty (${expected[0]} suspects and ${expected[1]} evidence items).`);
  }
  const unique = (values) => new Set(values).size === values.length;
  const suspectIds = parsed.suspects.map((x) => x.id); const evidenceIds = parsed.evidence.map((x) => x.id); const timelineIds = parsed.timeline.map((x) => x.id);
  if (!unique(suspectIds) || !unique(evidenceIds) || !unique(timelineIds)) throw new Error('Generated identifiers must be unique.');
  if (!suspectIds.includes(parsed.solution.culpritSuspectId)) throw new Error('The solution must refer to a listed suspect.');
  const knownEvidence = new Set(evidenceIds); const knownSuspects = new Set(suspectIds);
  if (parsed.solution.keyEvidenceIds.some((id) => !knownEvidence.has(id)) || !unique(parsed.solution.keyEvidenceIds)) throw new Error('Solution references invalid key evidence.');
  if (parsed.solution.contradictions.some((item) => !knownSuspects.has(item.suspectId) || item.evidenceIds.some((id) => !knownEvidence.has(id)))) throw new Error('Contradictions must reference a listed suspect and evidence.');
  if (parsed.solution.keyEvidenceIds.length < 2) throw new Error('The solution needs at least two supporting clues.');
  for (const item of parsed.evidence) {
    if (item.relatedSuspectIds.some((id) => !knownSuspects.has(id))) throw new Error(`Evidence ${item.id} references an unknown suspect.`);
    if (item.relatedEvidenceIds.some((id) => !knownEvidence.has(id) || id === item.id)) throw new Error(`Evidence ${item.id} references invalid evidence.`);
    if (item.type === 'WITNESS_STATEMENT' && item.content.witnessSuspectId && !knownSuspects.has(item.content.witnessSuspectId)) throw new Error(`Evidence ${item.id} references an unknown witness.`);
    if (item.type === 'CHAT_MESSAGE') {
      const participantIds = new Set(item.content.participants.map((person) => person.id));
      if (item.content.messages.some((message) => !participantIds.has(message.senderId))) throw new Error(`Evidence ${item.id} contains a message from an unlisted participant.`);
    }
  }
  for (const entry of parsed.timeline) {
    if (entry.relatedSuspectIds.some((id) => !knownSuspects.has(id)) || entry.relatedEvidenceIds.some((id) => !knownEvidence.has(id))) throw new Error(`Timeline entry ${entry.id} contains an invalid reference.`);
  }
  const times = parsed.timeline.map((entry) => Date.parse(entry.timestamp));
  if (times.some((time) => !Number.isFinite(time))) throw new Error('Timeline contains an invalid timestamp.');
  if (times.some((time, i) => i > 0 && time < times[i - 1])) throw new Error('Timeline entries must be in chronological order.');
  if (parsed.solution.keyEvidenceIds.filter((id) => parsed.evidence.find((item) => item.id === id)?.relatedSuspectIds.includes(parsed.solution.culpritSuspectId)).length < 1) {
    throw new Error('At least one key clue must be associated with the culprit.');
  }
  return parsed;
}
