import session from 'express-session';
import MongoStore from 'connect-mongo';
import { env } from '../config/env.js';

export const sessionMiddleware = session({
  name: env.SESSION_COOKIE_NAME,
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: MongoStore.create({ mongoUrl: env.MONGODB_URI, collectionName: 'sessions', ttl: 60 * 60 * 24 * env.CASE_TTL_DAYS }),
  cookie: { httpOnly: true, sameSite: 'lax', secure: env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 * env.CASE_TTL_DAYS },
});

export function ensureGuestSession(req, _res, next) {
  if (!req.session.guestCreatedAt) req.session.guestCreatedAt = new Date().toISOString();
  next();
}
