import { env } from '../config/env.js';
import { generatedCaseSchema } from '../schemas/caseSchemas.js';
import { mysteryGenerationPrompt } from '../prompts/mysteryGenerationPrompt.js';
import { generateCaseContent } from './geminiService.js';
import { validateCase } from './caseValidationService.js';
import { AppError } from '../utils/AppError.js';

export async function generatePlayableCase({ storyPrompt, difficulty }) {
  let lastError;
  for (let attempt = 0; attempt <= env.MAX_CASE_GENERATION_RETRIES; attempt += 1) {
    try {
      const raw = await generateCaseContent(mysteryGenerationPrompt({ storyPrompt, difficulty }));
      return { caseData: validateCase(raw, difficulty), attemptCount: attempt + 1 };
    } catch (err) {
      lastError = err;
      if (err.status === 503 && err.code !== 'AI_INVALID_RESPONSE') throw err;
      console.warn(JSON.stringify({ level: 'warn', code: 'CASE_OUTPUT_INVALID', attempt: attempt + 1, message: err.message }));
    }
  }
  throw new AppError(502, 'INVALID_AI_OUTPUT', 'The generated mystery did not pass its consistency checks. Please try a different premise.', { cause: lastError });
}
