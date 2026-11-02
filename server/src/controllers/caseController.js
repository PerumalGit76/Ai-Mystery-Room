import crypto from 'node:crypto';
import Case from '../models/Case.js';
import Investigation from '../models/Investigation.js';
import { createCaseRequestSchema, accusationRequestSchema } from '../schemas/requestSchemas.js';
import { generatePlayableCase } from '../services/caseGenerationService.js';
import { calculateScore } from '../services/scoringService.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';
import mongoose from 'mongoose';

export const sessionHash = (req) => crypto.createHash('sha256').update(req.sessionID).digest('hex');

function publicCase(doc, investigation) {
  const value = doc.toObject ? doc.toObject() : doc;
  delete value.solution; delete value.sessionIdHash; delete value.generationMetadata;
  return { ...value, investigation: { inspectedEvidenceIds: investigation?.inspectedEvidenceIds || [], status: investigation?.status || 'IN_PROGRESS' } };
}
async function getOwnedCase(req, { includeSolution = false } = {}) {
  if (!mongoose.Types.ObjectId.isValid(req.params.caseId)) throw new AppError(404, 'CASE_NOT_FOUND', 'This case could not be found in your session.');
  const query = Case.findOne({ _id: req.params.caseId, sessionIdHash: sessionHash(req) });
  if (includeSolution) query.select('+solution');
  const doc = await query;
  if (!doc) throw new AppError(404, 'CASE_NOT_FOUND', 'This case could not be found in your session.');
  if (doc.status !== 'READY') throw new AppError(409, 'CASE_NOT_READY', 'This case is not ready to investigate yet.');
  return doc;
}

export async function createCase(req, res) {
  const input = createCaseRequestSchema.safeParse(req.body);
  if (!input.success) throw new AppError(400, 'VALIDATION_ERROR', input.error.issues[0]?.message || 'Please check the case details.');
  const { caseData, attemptCount } = await generatePlayableCase(input.data);
  const doc = await Case.create({
    ...caseData, storyPrompt: input.data.storyPrompt, difficulty: input.data.difficulty, status: 'READY',
    sessionIdHash: sessionHash(req), expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * env.CASE_TTL_DAYS),
    generationMetadata: { generatedAt: new Date(), attemptCount },
    assetManifest: caseData.evidence.filter((item) => ['IMAGE', 'CCTV'].includes(item.type)).map((item) => ({ evidenceId: item.id, assetType: 'SIMULATED_EVIDENCE' })),
  });
  const investigation = await Investigation.create({ caseId: doc._id, sessionIdHash: sessionHash(req) });
  const caseId = String(doc._id);
  req.session.activeCaseId = caseId;
  await new Promise((resolve, reject) => req.session.save((error) => error ? reject(error) : resolve()));
  res.status(201).json({ success: true, data: { caseId, status: 'READY', case: publicCase(doc, investigation) } });
}

export async function getCaseStatus(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.caseId)) throw new AppError(404, 'CASE_NOT_FOUND', 'This case could not be found in your session.');
  const doc = await Case.findOne({ _id: req.params.caseId, sessionIdHash: sessionHash(req) }).select('status');
  if (!doc) throw new AppError(404, 'CASE_NOT_FOUND', 'This case could not be found in your session.');
  res.json({ success: true, data: { caseId: String(doc._id), status: doc.status, message: doc.status === 'FAILED' ? 'This case could not be generated.' : undefined } });
}

export async function getCase(req, res) {
  const doc = await getOwnedCase(req);
  const investigation = await Investigation.findOne({ caseId: doc._id, sessionIdHash: sessionHash(req) }).lean();
  res.json({ success: true, data: publicCase(doc, investigation) });
}

export async function inspectEvidence(req, res) {
  const doc = await getOwnedCase(req);
  const item = doc.evidence.find((entry) => entry.id === req.params.evidenceId);
  if (!item) throw new AppError(404, 'EVIDENCE_NOT_FOUND', 'That evidence item could not be found.');
  const investigation = await Investigation.findOneAndUpdate(
    { caseId: doc._id, sessionIdHash: sessionHash(req), status: 'IN_PROGRESS' },
    { $addToSet: { inspectedEvidenceIds: item.id } }, { new: true },
  );
  if (!investigation) throw new AppError(409, 'INVESTIGATION_CLOSED', 'The final accusation has already been recorded.');
  res.json({ success: true, data: { evidence: item, inspectedEvidenceIds: investigation.inspectedEvidenceIds } });
}

export async function submitAccusation(req, res) {
  const input = accusationRequestSchema.safeParse(req.body);
  if (!input.success) throw new AppError(400, 'VALIDATION_ERROR', input.error.issues[0]?.message || 'Please check your accusation.');
  const doc = await getOwnedCase(req, { includeSolution: true });
  const suspect = doc.suspects.find((entry) => entry.id === input.data.suspectId);
  if (!suspect) throw new AppError(400, 'INVALID_SUSPECT', 'Choose one of the listed suspects.');
  const investigation = await Investigation.findOne({ caseId: doc._id, sessionIdHash: sessionHash(req) });
  if (!investigation) throw new AppError(404, 'INVESTIGATION_NOT_FOUND', 'Investigation progress could not be found.');
  if (investigation.status === 'COMPLETED' || investigation.accusation) throw new AppError(409, 'DUPLICATE_ACCUSATION', 'A final accusation has already been submitted for this case.');
  const isCorrect = input.data.suspectId === doc.solution.culpritSuspectId;
  const score = calculateScore({
    isCorrect, inspectedEvidenceIds: investigation.inspectedEvidenceIds, keyEvidenceIds: doc.solution.keyEvidenceIds,
    explanation: input.data.explanation, keyEvidence: doc.evidence.filter((item) => doc.solution.keyEvidenceIds.includes(item.id)),
  });
  const completed = await Investigation.findOneAndUpdate(
    { _id: investigation._id, status: 'IN_PROGRESS', accusation: null },
    { $set: { status: 'COMPLETED', accusation: { suspectId: input.data.suspectId, explanation: input.data.explanation, isCorrect, submittedAt: new Date() }, score, completedAt: new Date() } },
    { new: true },
  );
  if (!completed) throw new AppError(409, 'DUPLICATE_ACCUSATION', 'A final accusation has already been submitted for this case.');
  res.status(201).json({ success: true, data: buildVerdict(doc, completed) });
}

function buildVerdict(doc, investigation) {
  const solution = doc.solution.toObject ? doc.solution.toObject() : doc.solution;
  const accusedSuspect = doc.suspects.find((s) => s.id === investigation.accusation.suspectId);
  const actualCulprit = doc.suspects.find((s) => s.id === solution.culpritSuspectId);
  return {
    caseId: String(doc._id), title: doc.title, isCorrect: investigation.accusation.isCorrect,
    accusedSuspect: { id: accusedSuspect.id, name: accusedSuspect.name, role: accusedSuspect.role },
    actualCulprit: { id: actualCulprit.id, name: actualCulprit.name, role: actualCulprit.role },
    accusation: { suspectId: investigation.accusation.suspectId, explanation: investigation.accusation.explanation },
    solution: { motive: solution.motive, method: solution.method, explanation: solution.explanation, redHerrings: solution.redHerrings },
    keyEvidence: doc.evidence.filter((item) => solution.keyEvidenceIds.includes(item.id)).map((item) => ({ id: item.id, title: item.title, description: item.description, clueSummary: item.clueSummary })),
    contradictions: solution.contradictions, score: investigation.score,
  };
}

export async function getVerdict(req, res) {
  const doc = await getOwnedCase(req, { includeSolution: true });
  const investigation = await Investigation.findOne({ caseId: doc._id, sessionIdHash: sessionHash(req) });
  if (!investigation || investigation.status !== 'COMPLETED' || !investigation.accusation) throw new AppError(409, 'VERDICT_NOT_READY', 'Submit your final accusation to reveal the solution.');
  res.json({ success: true, data: buildVerdict(doc, investigation) });
}
