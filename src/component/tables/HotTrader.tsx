import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const HotTrader = ({ broker }: any) => {
  const isPositive = broker.successRate >= 0; // Determina si es positivo o negativo
  const mainColor = isPositive ? 'rgba(0, 220, 105, 1)' : 'rgba(220, 50, 50, 1)'; // Verde o Rojo
  const backgroundColor = isPositive ? 'rgba(0, 220, 105, 0.2)' : 'rgba(220, 50, 50, 0.2)'; // Colores para el fondo

  const data = {
    labels: broker.performanceData.map((_: any, i: number) => i), // Asume que son puntos numéricos
    datasets: [
      {
        label: 'Performance',
        data: broker.performanceData,
        fill: true,
        borderColor: mainColor,
        backgroundColor: backgroundColor,
        tension: 0.2,
      },
    ],
  };

  const options = {
    scales: {
      y: { display: false }, // Oculta el eje Y
      x: { display: false }, // Oculta el eje X
    },
    plugins: {
      legend: { display: false },
    },
    elements: {
      line: { tension: 0.4 },
    },
  };

  const getFlagUrl = (country: string) => {
    const countryCodes: Record<string, string> = {
      UK: 'gb', // Reino Unido (United Kingdom)
      USA: 'us', // Estados Unidos (United States of America)
      Denmark: 'dk', // Dinamarca
      Cyprus: 'cy', // Chipre
      Israel: 'il', // Israel
      Australia: 'au', // Australia
      Poland: 'pl', // Polonia
      Estonia: 'ee', // Estonia
      Russia: 'ru', // Rusia
      Ireland: 'ie', // Irlanda
      Switzerland: 'ch', // Suiza
      Belize: 'bz', // Belice
    };

    // Retorna el enlace de la bandera si el país está en el mapa, si no, retorna un string vacío.
    return countryCodes[country] ? `https://flagcdn.com/w40/${countryCodes[country]}.png` : '';
  };

  //   ${
  //   isPositive
  //     ? 'bg-gradient-to-r from-green-900 to-green-700 border-green-700'
  //     : 'bg-gradient-to-r from-red-900 to-red-700 border-red-700'
  // }
  return (
    <div key={broker.name} className={`relative flex-shrink-0 p-4 `}>
      {/* Icono y nombre */}
      <div className='flex items-center gap-2'>
        <span className='text-lg text-white font-bold'>{broker.name}</span>
        <img
          src={getFlagUrl(broker.country)} // Imagen de la bandera
          alt={broker.country}
          className='w-5 h-5 rounded-full'
        />
      </div>
      {/* Porcentaje de éxito */}
      <div
        className={`text-lg font-bold flex items-center gap-7 ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}
      >
        {isPositive ? <FaArrowAltCircleUp size={25} /> : <FaArrowAltCircleDown size={25} />}
        {isPositive ? `+${broker.successRate}%` : `${broker.successRate}%`}
      </div>

      {/* Gráfica */}
      <div className='absolute bottom-0 right-0 w-1/3 opacity-40 pointer-events-none'>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default HotTrader;

// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

// const HotTrader = ({ broker }: any) => {
//   const data = {
//     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//     datasets: [
//       {
//         label: 'Performance',
//         data: broker.performanceData,
//         fill: true,
//         borderColor: 'rgba(0, 220, 105, 0.8)',
//         backgroundColor: 'rgba(0, 220, 105, 0)', // Softer green for the gradient
//         tension: 0.4,
//       },
//     ],
//   };

//   const options = {
//     scales: {
//       y: { display: false },
//       x: { display: false },
//     },
//     plugins: {
//       legend: { display: false },
//     },
//     elements: {
//       line: { tension: 0.4 },
//     },
//   };

//   return (
//     <div key={broker.name}
//     className='relative flex-shrink-0 bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 rounded-lg shadow-lg'>
//       <div className='text-lg font-bold z-10'>{broker.name}</div>
//       <div className='text-green-500 z-10'>Success Rate: {broker.successRate}</div>
//       <div className='text-gray-400 text-center z-10'>{broker.country}</div>

//       <div className="absolute inset-0 opacity-20">
//         <Line data={data} options={options} />
//       </div>
//     </div>
//   );
// };

// export default HotTrader;
