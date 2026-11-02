import { z } from 'zod';

export const createCaseRequestSchema = z.object({
  storyPrompt: z.string().trim().min(30, 'Please enter at least 30 characters.').max(2000, 'Keep your story under 2,000 characters.'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
}).strict();
export const accusationRequestSchema = z.object({
  suspectId: z.string().min(1).max(64), explanation: z.string().max(500).optional().default(''),
}).strict();
