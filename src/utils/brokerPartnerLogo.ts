import { logosBrokersAds } from '@/pages/brokersRatings/single/advertasingSpace/logosBrokersAds.js';

const PARTNER_BASE = '/assets/img/partners/';

function compact(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Filename (e.g. Pepperstone.png) -> lookup keys */
const fileByKey = new Map<string, string>();

for (const file of logosBrokersAds) {
  if (/^(\d|chart)\.png$/i.test(file)) continue;
  const stem = file.replace(/\.png$/i, '');
  fileByKey.set(compact(stem), file);
}

const ALIAS_TO_FILE: Record<string, string> = {
  ig: 'IGGroup.png',
  igmarkets: 'IGGroup.png',
  igcom: 'IGGroup.png',
  saxo: 'SAXOBANK.png',
  saxocapitalmarkets: 'SAXOBANK.png',
  vantage: 'VantageFX.png',
  vantagemarkets: 'VantageFX.png',
  vantageinternationalgroup: 'VantageFX.png',
  capital: 'capital-com.png',
  capitalcom: 'capital-com.png',
  capitaldotcom: 'capital-com.png',
  forexcom: 'forex-com.png',
  forexdotcom: 'forex-com.png',
  forex: 'forex-com.png',
  swissquotebank: 'Swissquote.png',
  swissquotefx: 'Swissquote.png',
  ibkr: 'InteractiveBrokers.png',
  interactivebrokersllc: 'InteractiveBrokers.png',
  etorocapital: 'etoro.png',
  plus500ltd: 'Plus500.png',
  pepperstonegroup: 'Pepperstone.png',
  fpmarketsltd: 'FPMarkets.png',
  thinkmarketsgroup: 'ThinkMarkets.png',
};

for (const [k, file] of Object.entries(ALIAS_TO_FILE)) {
  if (!fileByKey.has(k)) fileByKey.set(k, file);
}

/**
 * Static partner PNG under /public/assets/img/partners/ when the broker
 * name or slug matches a known file (covers missing DB logos / Logo.dev).
 */
export function getPartnerBrokerLogoUrl(...rawKeys: (string | null | undefined)[]): string | null {
  for (const raw of rawKeys) {
    if (!raw || typeof raw !== 'string') continue;
    const k = compact(raw);
    if (k.length < 2) continue;
    const file = fileByKey.get(k);
    if (file) return `${PARTNER_BASE}${file}`;
  }
  return null;
}
