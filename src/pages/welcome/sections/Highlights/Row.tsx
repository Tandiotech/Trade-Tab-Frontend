import { useRef } from 'react';

import LineChart from '../../../../component/chart/LineChart';

import Broker from './Broker';
import { DailyGrowth } from '../../../../types/metrics';

export interface RowProps {
  profit: number;
  firstName: string;
  lastName: string;
  dailyGrowth: DailyGrowth[];
  averageWin:number;
}

const Row = (props: RowProps) => {
  const { profit, firstName, lastName, dailyGrowth, averageWin } = props;

  const ref = useRef<HTMLCanvasElement>(null);
  const plugins = {};

  const data = {
    labels: ['', '', '', '', ''],
    datasets: [
      {
        data: [
          dailyGrowth[0].balance,
          ...dailyGrowth.slice(1, 5).map(({ totalProfit }: any) => totalProfit),
        ],
        label: 'Balance',
        borderColor: '#22C55E', // Color de la línea a verde
        backgroundColor: 'rgba(34, 197, 94, 0.2)', // Relleno verde claro y transparente
        pointRadius: 5, // Asegura que los puntos sean visibles
        borderWidth: 2, // Ancho de la línea
        fill: true, // Habilita el relleno bajo la línea
      },
    ],
  };

  const toNumberWithCommas = (number: number) => {
    const number_string = number?.toFixed(2).toString();
    const regex_pattern = /\B(?=(\d{3})+(?!\d))/g;
    const formatted_number = number_string.replace(regex_pattern, ',');
    return formatted_number;
  };

  return (
    <>
      <Broker firstName={firstName} lastName={lastName} />
      <p className='self-center font-poppins antialiased text-[#00aa38]'>
        ${toNumberWithCommas(profit)}
      </p>
      <p className='self-center font-poppins antialiased text-[#00aa38]'>{averageWin?.toFixed(3)}</p>
      <div className='highlight-canvas-container'>
        {/* @ts-ignore */}
        <LineChart dataSet={data} refer={ref} plugins={plugins} />
      </div>
    </>
  );
};

export default Row;
