import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export async function generateCaseContent(prompt) {
  const startedAt = Date.now();
  const timeoutMs = env.GEMINI_TIMEOUT_MS;
  try {
    const response = await client.interactions.create({
      model: env.GEMINI_MODEL,
      input: prompt,
      store: false,
      generation_config: {
        thinking_level: 'low',
      },
      response_format: {
        type: 'text',
        mime_type: 'application/json',
      },
    }, { timeout_ms: timeoutMs });
    let text = response.output_text?.trim() || '';
    if (!text) throw new AppError(502, 'AI_INVALID_RESPONSE', 'The AI returned an empty case.');
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }
    try { return JSON.parse(text); }
    catch (parseError) { throw new AppError(502, 'AI_INVALID_RESPONSE', 'The AI response was not valid JSON.', { cause: parseError }); }
  } catch (err) {
    const cause = err.cause || err.response?.data?.error;
    const status = err.status || err.httpStatus || err.response?.status || cause?.status || cause?.httpStatus;
    if (err instanceof AppError && err.code === 'AI_INVALID_RESPONSE') throw err;
    const providerMessage = String(err.message || cause?.message || 'Unknown Gemini request failure')
      .replaceAll(env.GEMINI_API_KEY, '[REDACTED]')
      .replace(/(?:AIza|AQ\.)[A-Za-z0-9._-]{16,}/g, '[REDACTED]')
      .replace(/((?:api[_ -]?key|token|key)["'=:\s]+)[^&\s,"'}]+/gi, '$1[REDACTED]')
      .slice(0, 400);
    console.error(JSON.stringify({
      level: 'error',
      code: 'GEMINI_REQUEST_FAILED',
      model: env.GEMINI_MODEL,
      timeoutMs,
      elapsedMs: Date.now() - startedAt,
      status: Number.isInteger(status) ? status : undefined,
      providerCode: typeof (err.code || cause?.code) === 'string' ? (err.code || cause.code) : undefined,
      errorName: err.name,
      message: providerMessage,
    }));
    if (status === 429) throw new AppError(503, 'AI_RATE_LIMITED', 'Case generation is busy right now. Please try again shortly.', { cause: err });
    throw new AppError(503, 'AI_UNAVAILABLE', 'We could not generate this case right now. Please try again.', { cause: err });
  }
}
