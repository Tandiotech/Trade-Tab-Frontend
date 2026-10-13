import { useEffect, useState } from 'react';
import ColumnChart from '../../charts/columnChart';
// import { MetricData } from '../../../types/metrics';

export interface MostActiveMonthsProps {
  style: boolean;
  dataMode?: number;
  trades?: any;
  monthlyAnalytics?: any;
}

const MonthlyPerformance = (props: MostActiveMonthsProps) => {
  const { dataMode, trades, monthlyAnalytics = [], style } = props;

  const [chartData, setChartData] = useState<any[]>([]);

  const calculateMonthlyGain = () => {
    // Filtrar operaciones relevantes y ordenar cronológicamente
    const sortedTrades: any = trades.sort(
      (a: any, b: any) => new Date(a.closeTime).getTime() - new Date(b.closeTime).getTime()
    );

    // Obtener el depósito inicial
    const initialDepositTrade = sortedTrades.find(
      (trade: any) => trade.type === 'DEAL_TYPE_BALANCE' && trade.profit > 0
    );
    const initialDeposit = initialDepositTrade ? initialDepositTrade.profit : 0;

    // Crear un objeto para almacenar ganancias mensuales
    const monthlySummary: any = {};

    // Variable para rastrear el balance acumulado
    let currentBalance = 0;

    sortedTrades.forEach((trade: any) => {
      const tradeDate = new Date(trade.closeTime);
      const monthYear = `${tradeDate.getFullYear()}-${String(tradeDate.getMonth() + 1).padStart(2, '0')}`; // Ejemplo: "2024-12"

      // Inicializar el balance mensual si no existe
      if (!monthlySummary[monthYear]) {
        monthlySummary[monthYear] = {
          startingBalance: currentBalance,
          deposits: 0,
          withdrawals: 0,
          profit: 0,
          endingBalance: 0,
        };
      }

      // Clasificar depósitos y retiros
      if (trade.type === 'DEAL_TYPE_BALANCE') {
        if (trade.profit > 0) {
          monthlySummary[monthYear].deposits += trade.profit;
        } else {
          monthlySummary[monthYear].withdrawals += Math.abs(trade.profit);
        }
      } else {
        // Acumular ganancias o pérdidas en el mes
        monthlySummary[monthYear].profit += trade.profit;
      }

      // Actualizar el balance acumulado
      currentBalance += trade.profit;

      // Actualizar el balance de cierre mensual
      monthlySummary[monthYear].endingBalance = currentBalance;

      // Ajustar el balance inicial para el primer mes con el depósito inicial
      if (trade.type === 'DEAL_TYPE_BALANCE' && trade.profit > 0 && trade === initialDepositTrade) {
        currentBalance += initialDeposit;
        monthlySummary[monthYear].startingBalance += initialDeposit;
      }
    });

    // Calcular el porcentaje de cambio mensual
    const monthlyGain = Object.keys(monthlySummary).map((monthYear, index, months) => {
      const {
        // startingBalance,
        profit,
        deposits,
        withdrawals,
        // endingBalance
      } = monthlySummary[monthYear];

      // Para meses después del primero, restar el depósito inicial del startingBalance y endingBalance
      if (index > 0) {
        monthlySummary[monthYear].startingBalance -= initialDeposit;
        monthlySummary[monthYear].endingBalance -= initialDeposit;
      }

      const adjustedStartingBalance = monthlySummary[monthYear].startingBalance;
      const gainPercentage =
        adjustedStartingBalance > 0 ? (profit / adjustedStartingBalance) * 100 : 0;

      return {
        month: monthYear,
        startingBalance: adjustedStartingBalance.toFixed(2),
        deposits: deposits.toFixed(2),
        withdrawals: withdrawals.toFixed(2),
        profit: profit.toFixed(2),
        endingBalance: monthlySummary[monthYear].endingBalance.toFixed(2),
        gainPercentage: gainPercentage.toFixed(2),
      };
    });

    return monthlyGain;
  };

  const transformMonthlyGain = (monthlyGain: any[]): any[] => {
    return monthlyGain.map(entry => {
      const gain = parseFloat(entry.gainPercentage);
      return {
        date: entry.month,
        value: isFinite(gain) ? gain : 0, // Asegura que el valor sea válido
      };
    });
  };

  useEffect(() => {
    if (trades) {
      const monthlyGain = calculateMonthlyGain();
      const transformedData = transformMonthlyGain(monthlyGain);

      setChartData(transformedData);
    }
  }, [trades]);

  return (
    <div className='h-full col-span-1 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 bg-gradient-to-br from-slate-900/90 via-cyan-900/20 to-teal-900/30 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-500 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl hover:shadow-cyan-500/10 group relative overflow-hidden'>
      {/* Animated background overlay */}
      <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>

      {/* Header section with enhanced styling */}
      <div className='relative z-10'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-cyan-500/30 group-hover:border-cyan-400/50 transition-colors duration-500'>
          <div className='flex items-center gap-2 sm:gap-3'>
            {/* Icon with glow effect */}
            <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-400/40 transition-all duration-500 flex-shrink-0'>
              <svg
                className='w-4 h-4 sm:w-5 sm:h-5 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            </div>

            {/* Enhanced title */}
            <div className='min-w-0 flex-1'>
              <h2
                className={`${style ? 'text-lg sm:text-xl font-bold lg:text-2xl' : 'text-lg sm:text-xl md:text-2xl font-bold'} font-poppins text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-white to-teal-100 group-hover:from-cyan-200 group-hover:via-white group-hover:to-teal-200 transition-all duration-500 leading-tight`}
              >
                Monthly Performance
              </h2>
            </div>
          </div>

          {/* Performance indicator */}
        </div>
      </div>

      {/* Chart container with enhanced styling */}
      <div className='relative z-10 min-h-0 flex-1'>
        <ColumnChart monthlyAnalytics={monthlyAnalytics} dataMode={dataMode} />
      </div>

      {/* Bottom accent line */}
      <div className='absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-400 to-teal-500/0 opacity-60 group-hover:opacity-100 transition-opacity duration-500'></div>
    </div>
  );
};

export default MonthlyPerformance;
