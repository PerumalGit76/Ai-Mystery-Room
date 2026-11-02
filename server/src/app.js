import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import { sessionMiddleware, ensureGuestSession } from './middleware/sessionMiddleware.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import healthRoutes from './routes/healthRoutes.js';
import caseRoutes from './routes/caseRoutes.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '16kb' }));
app.use(sessionMiddleware);
app.use(ensureGuestSession);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/cases', caseRoutes);

// In production, serve the Vite build from the same origin as the API. This
// keeps guest session cookies first-party and avoids a separate API URL.
if (env.NODE_ENV === 'production') {
  const clientBuildPath = fileURLToPath(new URL('../../client/dist/', import.meta.url));
  app.use(express.static(clientBuildPath, { index: false }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientBuildPath, 'index.html'), (error) => {
      if (error) next(error);
    });
  });
}

app.use('/api/v1', notFound);
app.use(errorHandler);

export default app;
