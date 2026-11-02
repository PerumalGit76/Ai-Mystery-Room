import mongoose from 'mongoose';
const assetSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, index: true }, evidenceId: { type: String, required: true },
  assetType: { type: String, enum: ['GENERATED_IMAGE', 'GENERATED_VIDEO', 'SIMULATED_EVIDENCE'], required: true },
  storageKey: { type: String, required: true }, mimeType: String, sizeBytes: Number, expiresAt: Date,
}, { timestamps: true });
export default mongoose.models.Asset || mongoose.model('Asset', assetSchema);
