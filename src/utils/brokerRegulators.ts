/**
 * Shared broker regulation + score helpers (catalog + detail pages).
 */

export function parseOverallReview(
  b: { scoreboard?: { overallReview?: unknown } } | null | undefined
): number | null {
  const raw = b?.scoreboard?.overallReview;
  if (raw == null || raw === '') return null;
  const n = typeof raw === 'number' ? raw : Number(String(raw).trim());
  if (!Number.isFinite(n)) return null;
  if (n < 0 || n > 100) return null;
  return n;
}

export function getBrokerRegulators(b: Record<string, unknown> | null | undefined): string[] {
  if (!b) return [];
  const gi = (b as { generalInformation?: { regulatedBy?: unknown } }).generalInformation?.regulatedBy;
  if (Array.isArray(gi) && gi.length) {
    const out: string[] = [];
    for (const r of gi) {
      if (r == null) continue;
      if (typeof r === 'string' && r.trim()) out.push(r.trim());
      else if (typeof r === 'object') {
        const o = r as { code?: string; name?: string };
        if (o.code?.trim()) out.push(o.code.trim());
        else if (o.name?.trim()) out.push(o.name.trim());
      }
    }
    if (out.length) return out;
  }
  const regs = (b as { regulations?: { regulations?: string } }).regulations?.regulations;
  if (typeof regs === 'string' && regs.trim()) {
    return regs.split(/,|::/).map(s => s.trim()).filter(Boolean);
  }
  const list = (b as { regulation?: { listOfRegulatoryAuthorities?: string } }).regulation
    ?.listOfRegulatoryAuthorities;
  if (typeof list === 'string' && list.trim()) {
    return list.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

export function brokerRegulatorMatches(
  b: Record<string, unknown> | null | undefined,
  needle: string
): boolean {
  const u = needle.toUpperCase();
  return getBrokerRegulators(b).some(t => t.toUpperCase().includes(u));
}
