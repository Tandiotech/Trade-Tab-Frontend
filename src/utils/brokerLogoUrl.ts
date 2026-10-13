import { BACKEND_URL } from './GlobalVars';

/**
 * Many API responses store logos as paths relative to the API host
 * (e.g. "uploads/brokers/x.png"). Browsers resolve those against the
 * frontend origin and the image 404s. Prefix the backend base when needed.
 */
export function resolveDbLogoUrl(dbLogo?: string | null): string | null {
  if (!dbLogo || typeof dbLogo !== 'string') return null;
  const t = dbLogo.trim();
  if (!t) return null;
  if (/^(https?:)?\/\//i.test(t) || t.startsWith('data:')) return t;
  if (t.startsWith('blob:')) return t;
  if (t.startsWith('/')) return t;

  const base = BACKEND_URL?.replace(/\/+$/, '');
  if (!base) return null;
  const path = t.replace(/^\.?\//, '');
  return `${base}/${path}`;
}
