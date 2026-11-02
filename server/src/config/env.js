import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

dotenv.config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)) });

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must contain at least 32 characters'),
  SESSION_COOKIE_NAME: z.string().default('amr.sid'),
  CASE_TTL_DAYS: z.coerce.number().positive().default(7),
  GEMINI_TIMEOUT_MS: z.coerce.number().int().min(120000).default(120000),
  MAX_CASE_GENERATION_RETRIES: z.coerce.number().int().min(0).max(2).default(1),
});

const result = envSchema.safeParse(process.env);
if (!result.success) {
  console.error('Invalid environment configuration:', result.error.issues.map(({ path, message }) => `${path.join('.')}: ${message}`).join('; '));
  process.exit(1);
}
export const env = result.data;
