import { AppError } from '../utils/AppError.js';

export function notFound(_req, _res, next) { next(new AppError(404, 'NOT_FOUND', 'This route could not be found.')); }
export function errorHandler(err, _req, res, _next) {
  const status = Number.isInteger(err.status) ? err.status : 500;
  const code = err.code || (status === 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR');
  const message = status === 500 ? 'Something went wrong on our side. Please try again.' : err.message;
  if (status >= 500) console.error(JSON.stringify({ level: 'error', code, name: err.name }));
  else console.warn(JSON.stringify({ level: 'warn', code, status, message: err.message }));
  res.status(status).json({ success: false, error: { code, message } });
}
