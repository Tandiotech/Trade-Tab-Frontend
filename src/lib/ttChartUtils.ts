/** Seeded PRNG + equity curve + smooth SVG path (from TradeTab-design-new prototype). */

export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function genEquityCurve(
  points = 120,
  start = 10000,
  vol = 0.018,
  drift = 0.003,
  seed = 42
): number[] {
  const rnd = seeded(seed);
  const out = [start];
  for (let i = 1; i < points; i++) {
    const r = (rnd() - 0.5) * 2 * vol + drift;
    out.push(Math.max(100, out[i - 1] * (1 + r)));
  }
  return out;
}

export function smoothPath(
  values: number[],
  w: number,
  h: number,
  padding = 4
): { d: string; pts: number[][]; min: number; max: number } {
  const n = values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = (w - padding * 2) / (n - 1);
  const pts = values.map((v, i) => [
    padding + i * stepX,
    padding + (h - padding * 2) * (1 - (v - min) / range),
  ]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }
  return { d, pts, min, max };
}
