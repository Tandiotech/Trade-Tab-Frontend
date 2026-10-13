// export function calculateInstitutionalScore(metrics: any): number {
export function calculateInstitutionalScore(metrics: any): string {
    let score = 0;
  
    // Métricas enriquecidas con límites más estrictos y dificultad incrementada
    score += calculateConsistentProfitScore(metrics.consistentProfitTrades);
    score += calculateHighVolumeScore(metrics.highVolumeTrades);
    score += calculateMarketDiversityScore(metrics.differentMarkets);
    score += calculateWinStreakScore(metrics.winStreak);
    score += calculateHighPipScore(metrics.highPipTrades);
  
    // Bonificación combinada ajustada
    score += calculateCombinationBonus(metrics);
  
    // Escalado final para que sea más difícil alcanzar el 100%
    const scaledScore = scaleScore(score);
  
    return (Math.min(scaledScore, 100).toFixed(0)); // El puntaje no puede superar 100
  }
  
  /**
   * Escalado no lineal para reducir la probabilidad de alcanzar el 100%.
   */
  function scaleScore(score: number): number {
    // Escalado exponencial inverso: mientras más alto el score, más difícil sumar puntos
    return Math.pow(score / 100, 0.8) * 100; 
  }
  
  /**
   * Puntaje basado en trades consistentes con ganancias.
   * - 1-3 trades: 5 puntos cada uno
   * - 4-6 trades: 6 puntos cada uno
   * - 7-9 trades: 7 puntos cada uno
   * - 10+ trades: 8 puntos cada uno (máximo 40 puntos)
   */
  function calculateConsistentProfitScore(consistentProfitTrades: number): number {
    if (consistentProfitTrades <= 3) {
      return consistentProfitTrades * 5;
    } else if (consistentProfitTrades <= 6) {
      return 15 + (consistentProfitTrades - 3) * 6;
    } else if (consistentProfitTrades <= 9) {
      return 33 + (consistentProfitTrades - 6) * 7;
    } else {
      return Math.min(40, 54 + (consistentProfitTrades - 9) * 8);
    }
  }
  
  /**
   * Puntaje basado en trades con alto volumen.
   * - 1-3 trades: 4 puntos cada uno
   * - 4-6 trades: 6 puntos cada uno
   * - 7+ trades: 8 puntos cada uno (máximo 30 puntos)
   */
  function calculateHighVolumeScore(highVolumeTrades: number): number {
    if (highVolumeTrades <= 3) {
      return highVolumeTrades * 4;
    } else if (highVolumeTrades <= 6) {
      return 12 + (highVolumeTrades - 3) * 6;
    } else {
      return Math.min(30, 30 + (highVolumeTrades - 6) * 8);
    }
  }
  
  /**
   * Puntaje basado en la diversidad de mercados.
   * - 1-2 mercados: 4 puntos cada uno
   * - 3-4 mercados: 5 puntos cada uno
   * - 5+ mercados: 6 puntos cada uno (máximo 30 puntos)
   */
  function calculateMarketDiversityScore(differentMarkets: number): number {
    if (differentMarkets <= 2) {
      return differentMarkets * 4;
    } else if (differentMarkets <= 4) {
      return 8 + (differentMarkets - 2) * 5;
    } else {
      return Math.min(30, 18 + (differentMarkets - 4) * 6);
    }
  }
  
  /**
   * Puntaje basado en rachas ganadoras.
   * - 1-3 rachas: 2 puntos cada una
   * - 4-6 rachas: 3 puntos cada una
   * - 7+ rachas: 4 puntos cada una (máximo 15 puntos)
   */
  function calculateWinStreakScore(winStreak: number): number {
    if (winStreak <= 3) {
      return winStreak * 2;
    } else if (winStreak <= 6) {
      return 6 + (winStreak - 3) * 3;
    } else {
      return Math.min(15, 15 + (winStreak - 6) * 4);
    }
  }
  
  /**
   * Puntaje basado en trades con alto número de pips.
   * - 1-3 trades: 4 puntos cada uno
   * - 4-6 trades: 6 puntos cada uno
   * - 7+ trades: 8 puntos cada uno (máximo 30 puntos)
   */
  function calculateHighPipScore(highPipTrades: number): number {
    if (highPipTrades <= 3) {
      return highPipTrades * 4;
    } else if (highPipTrades <= 6) {
      return 12 + (highPipTrades - 3) * 6;
    } else {
      return Math.min(30, 30 + (highPipTrades - 6) * 8);
    }
  }
  
  /**
   * Bonificaciones basadas en combinaciones de métricas.
   * - Consistent Profit + High Volume: +5 puntos
   * - Consistent Profit + Market Diversity: +5 puntos
   * - High Volume + High Pips: +7 puntos
   */
  function calculateCombinationBonus(metrics: any): number {
    let bonus = 0;
  
    if (metrics.consistentProfitTrades >= 5 && metrics.highVolumeTrades >= 5) {
      bonus += 5;
    }
    if (metrics.consistentProfitTrades >= 5 && metrics.differentMarkets >= 4) {
      bonus += 5;
    }
    if (metrics.highVolumeTrades >= 5 && metrics.highPipTrades >= 5) {
      bonus += 7;
    }
  
    return bonus;
  }