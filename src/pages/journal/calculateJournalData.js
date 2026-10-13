export function calculateJournalData(trades) {
  if (!trades || trades.length === 0) return [];

  // Reducir los trades para agrupar por fecha de cierre exclusivamente
  const journal = trades.reduce((acc, trade) => {
    if (trade.type === 'DEAL_TYPE_BALANCE') return acc;

    // Usar solo la fecha de cierre como clave principal
    const dateClose = trade.closeTime.split(' ')[0];

    // Inicializar el objeto de la fecha si no existe
    if (!acc[dateClose]) {
      acc[dateClose] = {
        date: dateClose,
        totalProfit: 0,
        totalTrades: 0,
        successfulTrades: 0,
        failedTrades: 0,
        trades: [],
      };
    }

    // Actualizar estadísticas de la fecha de cierre
    acc[dateClose].totalProfit += trade.profit;
    acc[dateClose].totalTrades += 1;
    if (trade.success === 'won') {
      acc[dateClose].successfulTrades += 1;
    } else {
      acc[dateClose].failedTrades += 1;
    }

    // Agregar el trade a la lista de operaciones del día
    acc[dateClose].trades.push(trade);

    return acc;
  }, {});

  // Devolver los resultados como un array de objetos
  return Object.values(journal);
}
