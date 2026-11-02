import { validateGeneratedCase } from '../schemas/caseSchemas.js';

export function validateCase(raw, difficulty) { return validateGeneratedCase(raw, difficulty); }
