type DailyGrowthItem = {
  lots?: number;
  pips?: number;
  drawdownProfit?: number;
  drawdownPercentage?: number;
  totalGains?: number;
};

type DG = DailyGrowthItem & {
  date: string;            // YYYY-MM-DD
  balance?: number;
  profit?: number;
  totalProfit?: number;
  gains?: number;
};

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

const toDateSafe = (d: Date | string): Date => {
  if (d instanceof Date) return isNaN(d.getTime()) ? new Date(NaN) : d;
  if (typeof d === "string" && ISO_DAY.test(d)) {
    const x = new Date(`${d}T00:00:00Z`); // UTC estable
    return isNaN(x.getTime()) ? new Date(NaN) : x;
  }
  const x = new Date(d as any);
  return isNaN(x.getTime()) ? new Date(NaN) : x;
};

const toUTCDateOnly = (d: Date | string) => {
  const x = toDateSafe(d);
  return new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate()));
};

const yyyymmdd = (d: Date) => {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

const addDaysUTC = (d: Date, n: number) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + n));

const isNum = (v: unknown): v is number => typeof v === "number" && !Number.isNaN(v);

/**
 * Rellena SOLO los días faltantes entre la primera y última fecha del dataset.
 * No agrega días en el futuro ni antes del primer dato.
 */
export function densifyWithCarryForward(
  rows: DG[],
  _start?: Date | string | null, // ignorado: se usa el dataset
  _end?: Date | string | null    // ignorado: se usa el dataset
): DG[] {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  // Normaliza y consolida por día (última fila para el mismo día gana)
  const normalized: DG[] = rows
    .map((r) => {
      const d = toUTCDateOnly(r?.date as any);
      return isNaN(d.getTime()) ? null : { ...r, date: yyyymmdd(d) };
    })
    .filter(Boolean) as DG[];

  if (normalized.length === 0) return [];

  const byDay = new Map<string, DG>();
  for (const r of normalized) {
    const prev = byDay.get(r.date) ?? ({} as DG);
    byDay.set(r.date, { ...prev, ...r, date: r.date }); // última aparición gana
  }

  // Rango EXACTO del dataset
  const sortedDays = Array.from(byDay.keys())
    .map((d) => toUTCDateOnly(d))
    .sort((a, b) => a.getTime() - b.getTime());

  const first = sortedDays[0];
  const last = sortedDays[sortedDays.length - 1];

  // Estado previo: arranca desde el primer día del dataset
  let prev = byDay.get(yyyymmdd(first)) ?? {
    date: yyyymmdd(first),
    balance: 0,
    profit: 0,
    totalProfit: 0,
    gains: 0,
    totalGains: 0,
    lots: 0,
    pips: 0,
    drawdownProfit: 0,
    drawdownPercentage: 0,
  };

  // Si la primera fila no tiene balance explícito, lo forzamos a 0 (o el propio si lo trae)
  prev = {
    ...prev,
    balance: isNum(prev.balance) ? prev.balance : 0,
    profit: isNum(prev.profit) ? prev.profit : 0,
    totalProfit: isNum(prev.totalProfit) ? prev.totalProfit : 0,
    gains: isNum(prev.gains) ? prev.gains : 0,
    totalGains: isNum(prev.totalGains) ? prev.totalGains : 0,
    lots: prev?.lots ?? 0,
    pips: prev?.pips ?? 0,
    drawdownProfit: prev?.drawdownProfit ?? 0,
    drawdownPercentage: prev?.drawdownPercentage ?? 0,
  };

  const out: DG[] = [];

  for (let d = first; d.getTime() <= last.getTime(); d = addDaysUTC(d, 1)) {
    const key = yyyymmdd(d);
    const exists = byDay.get(key);

    if (exists) {
      // Respetar exactamente lo que viene para ese día
      const row: DG = {
        date: key,
        balance: isNum(exists.balance) ? exists.balance : prev.balance,
        profit: isNum(exists.profit) ? exists.profit : 0,
        totalProfit: isNum(exists.totalProfit) ? exists.totalProfit : prev.totalProfit,
        gains: isNum(exists.gains) ? exists.gains : 0,
        totalGains: isNum(exists.totalGains) ? exists.totalGains : prev.totalGains,
        lots: exists?.lots ?? 0,
        pips: exists?.pips ?? 0,
        drawdownProfit: exists?.drawdownProfit ?? 0,
        drawdownPercentage: exists?.drawdownPercentage ?? 0,
      };
      out.push(row);
      prev = row; // avanza el estado
    } else {
      // Día vacío → repetir valores del día previo (SIN inventar trades)
      const row: DG = {
        date: key,
        balance: prev.balance ?? 0,
        profit: 0,
        totalProfit: prev.totalProfit ?? 0,
        gains: 0,
        totalGains: prev.totalGains ?? 0,
        lots: 0,
        pips: 0,
        drawdownProfit: 0,
        drawdownPercentage: 0,
      };
      out.push(row);
      prev = row;
    }
  }

  return out;
}
