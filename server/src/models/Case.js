import mongoose from 'mongoose';

const { Schema } = mongoose;
const suspectSchema = new Schema({
  id: { type: String, required: true }, name: { type: String, required: true }, role: { type: String, required: true },
  profile: { type: String, required: true }, motiveSummary: { type: String, required: true }, alibi: { type: String, required: true },
  portraitAssetId: { type: String, default: null },
}, { _id: false });
const timelineSchema = new Schema({
  id: { type: String, required: true }, timestamp: { type: Date, required: true }, description: { type: String, required: true },
  relatedSuspectIds: [String], relatedEvidenceIds: [String],
}, { _id: false });
const evidenceSchema = new Schema({
  id: { type: String, required: true }, type: { type: String, required: true }, title: { type: String, required: true },
  description: { type: String, required: true }, discoveredAt: { type: Date, default: null }, occurredAt: { type: Date, default: null },
  relatedSuspectIds: [String], relatedEvidenceIds: [String], clueSummary: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: true }, assetId: { type: String, default: null },
}, { _id: false });
const solutionSchema = new Schema({
  culpritSuspectId: { type: String, required: true }, motive: { type: String, required: true }, method: { type: String, required: true },
  explanation: { type: String, required: true }, keyEvidenceIds: [String], redHerrings: [String],
  contradictions: [{ description: { type: String, required: true }, suspectId: { type: String, required: true }, evidenceIds: { type: [String], required: true } }],
}, { _id: false });

const caseSchema = new Schema({
  title: { type: String, required: true }, summary: { type: String, required: true }, storyPrompt: { type: String, required: true },
  difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], required: true }, status: { type: String, enum: ['GENERATING', 'READY', 'FAILED'], default: 'GENERATING', index: true },
  incident: { description: { type: String, required: true }, location: { type: String, required: true }, occurredAt: { type: Date, required: true } },
  suspects: { type: [suspectSchema], required: true }, timeline: { type: [timelineSchema], required: true }, evidence: { type: [evidenceSchema], required: true },
  solution: { type: solutionSchema, required: true, select: false }, assetManifest: { type: [Schema.Types.Mixed], default: [] },
  generationMetadata: { model: String, generatedAt: Date, attemptCount: Number }, ownerId: { type: Schema.Types.ObjectId, default: null },
  sessionIdHash: { type: String, required: true, index: true }, expiresAt: { type: Date, index: { expires: 0 } },
}, { timestamps: true, minimize: false });

caseSchema.index({ sessionIdHash: 1, createdAt: -1 });
export default mongoose.models.Case || mongoose.model('Case', caseSchema);
