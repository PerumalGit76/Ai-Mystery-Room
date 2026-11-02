import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

try {
  await connectDatabase();
  app.listen(env.PORT, () => console.info(`AI Mystery Room API listening on port ${env.PORT}`));
} catch (error) {
  const message = String(error.message || 'Unknown startup failure')
    .replaceAll(env.MONGODB_URI, '[REDACTED_MONGODB_URI]')
    .replace(/mongodb(?:\+srv)?:\/\/[^@\s]+@/gi, 'mongodb://[REDACTED]@')
    .slice(0, 500);
  console.error(JSON.stringify({ level: 'fatal', code: 'STARTUP_FAILED', name: error.name, cause: error.code, message }));
  process.exit(1);
}
