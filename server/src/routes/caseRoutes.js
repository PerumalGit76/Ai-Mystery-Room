import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createCase, getCase, getCaseStatus, getVerdict, inspectEvidence, submitAccusation } from '../controllers/caseController.js';

const router = Router();
const generationLimit = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many case requests. Please try again later.' } } });
const accusationLimit = rateLimit({
  windowMs: 60 * 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({ success: false, error: { code: 'RATE_LIMITED', message: 'Too many accusation requests. Please try again later.' } }),
});
router.post('/', generationLimit, asyncHandler(createCase));
router.get('/:caseId/status', asyncHandler(getCaseStatus));
router.get('/:caseId', asyncHandler(getCase));
router.post('/:caseId/evidence/:evidenceId/inspect', asyncHandler(inspectEvidence));
router.post('/:caseId/accusations', accusationLimit, asyncHandler(submitAccusation));
router.get('/:caseId/verdict', asyncHandler(getVerdict));
export default router;
