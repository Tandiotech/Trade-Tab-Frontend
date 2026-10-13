export const analyzeInstitutionalTrading = (trades: any) => {
  let institutionalScore = 0;

  // Métricas generales para evaluar el trading institucional
  let winStreak = 0;
  let highVolumeTrades = 0;
  let quickTrades = 0;
  let longTrades = 0;
  let largeProfitTrades = 0;
  let differentMarkets = new Set();
  let consistentProfitTrades = 0;
  let quickRecovery = false;
  let highPipTrades = 0;

  trades?.forEach((trade: any, index: number) => {
    // Calcular patrones específicos
    if (trade.success === "won") winStreak++;
    else winStreak = 0;

    if (trade.volume > 20) highVolumeTrades++;
    if (trade.durationInMinutes < 60) quickTrades++;
    if (trade.durationInMinutes > 1440) longTrades++;
    if (trade.profit > 1000) largeProfitTrades++;
    if (trade.profit > 0) consistentProfitTrades++;
    if (trade.pips > 300) highPipTrades++;
    differentMarkets.add(trade.symbol);

    if (
      index > 0 &&
      trades[index - 1].success === "lost" &&
      trade.success === "won"
    ) {
      quickRecovery = true;
    }
  });

  // Calcular puntaje institucional basado en métricas clave
  institutionalScore += winStreak * 2; // Cada racha ganadora contribuye al puntaje
  institutionalScore += highVolumeTrades * 8; // Cada trade con alto volumen tiene un peso significativo
  institutionalScore += quickTrades * 5; // Cada trade rápido contribuye al puntaje
  institutionalScore += longTrades * 6; // Cada trade largo tiene un peso importante
  institutionalScore += largeProfitTrades * 10; // Las grandes ganancias tienen mayor peso
  institutionalScore += Array.from(differentMarkets).length * 4; // Diversificación de mercados contribuye al puntaje
  institutionalScore += consistentProfitTrades * 7; // Trades consistentes en ganancias tienen alta relevancia
  if (quickRecovery) institutionalScore += 10; // Recuperación rápida de pérdidas añade un bono
  institutionalScore += highPipTrades * 9; // Trades con alto número de pips tienen un peso relevante

  // Normalizar puntaje (máximo 100)
  institutionalScore = Math.min(institutionalScore, 100);

  // Determinar elegibilidad para CPA partnership
  const isEligibleForCPA = institutionalScore >= 70; // Umbral para elegibilidad

  return {
    institutionalScore,
    isEligibleForCPA,
    summary: {
      totalTrades: trades.length,
      metrics: {
        winStreak,
        highVolumeTrades,
        quickTrades,
        longTrades,
        largeProfitTrades,
        differentMarkets: Array.from(differentMarkets).length,
        consistentProfitTrades,
        quickRecovery,
        highPipTrades,
      },
    },
  };
};