export const CHART_MAIN_COLOR_BACKGROUND = 'rgba(218, 217, 214,0.1)';

export const BACKEND_URL = `${import.meta.env.VITE_TEST_MODE === '0' ? import.meta.env.VITE_SERVER_URL_TESTNET : import.meta.env.VITE_SERVER_URL_MAINNET}`;
export const OFFICIAL_TELEGRAM='https://t.me/tradetabofficial'



// Currency flags for all supported currencies and commodities
export const currencyFlags: Record<string, string> = {
  // Major currencies
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  CHF: '🇨🇭',
  CAD: '🇨🇦',
  AUD: '🇦🇺',
  NZD: '🇳🇿',

  // Asian currencies
  CNY: '🇨🇳',
  HKD: '🇭🇰',
  SGD: '🇸🇬',
  INR: '🇮🇳',
  KRW: '🇰🇷',
  TWD: '🇹🇼',
  THB: '🇹🇭',
  IDR: '🇮🇩',
  MYR: '🇲🇾',
  PHP: '🇵🇭',
  VND: '🇻🇳',
  BDT: '🇧🇩',
  LKR: '🇱🇰',

  // European currencies
  SEK: '🇸🇪',
  NOK: '🇳🇴',
  DKK: '🇩🇰',
  PLN: '🇵🇱',
  CZK: '🇨🇿',
  HUF: '🇭🇺',
  RON: '🇷🇴',
  BGN: '🇧🇬',
  HRK: '🇭🇷',
  ISK: '🇮🇸',
  UAH: '🇺🇦',

  // Middle Eastern currencies
  AED: '🇦🇪',
  SAR: '🇸🇦',
  QAR: '🇶🇦',
  KWD: '🇰🇼',
  ILS: '🇮🇱',
  EGP: '🇪🇬',

  // African currencies
  ZAR: '🇿🇦',
  NGN: '🇳🇬',
  KES: '🇰🇪',
  GHS: '🇬🇭',
  MAD: '🇲🇦',

  // Latin American currencies
  MXN: '🇲🇽',
  BRL: '🇧🇷',
  ARS: '🇦🇷',
  CLP: '🇨🇱',
  COP: '🇨🇴',
  PEN: '🇵🇪',

  // Other currencies
  TRY: '🇹🇷',
  RUB: '🇷🇺',
  PKR: '🇵🇰',

  // Commodities
  XAU: '🥇', // Gold
  XAG: '🥈', // Silver
  WTI: '🛢️', // Crude oil (WTI)
  BRENT: '🛢️', // Crude oil (Brent)
};
