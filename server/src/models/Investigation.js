import mongoose from 'mongoose';
const { Schema } = mongoose;
const investigationSchema = new Schema({
  caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true }, sessionIdHash: { type: String, required: true, index: true },
  inspectedEvidenceIds: { type: [String], default: [] }, notes: { type: [String], default: [] }, status: { type: String, enum: ['IN_PROGRESS', 'COMPLETED'], default: 'IN_PROGRESS' },
  accusation: { suspectId: String, explanation: String, isCorrect: Boolean, submittedAt: Date }, score: { total: Number, accuracy: Number, evidenceCoverage: Number, explanation: Number },
  startedAt: { type: Date, default: Date.now }, completedAt: Date,
}, { timestamps: true });
investigationSchema.index({ caseId: 1, sessionIdHash: 1 }, { unique: true });
export default mongoose.models.Investigation || mongoose.model('Investigation', investigationSchema);
