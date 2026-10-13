import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { CHART_MAIN_COLOR_BACKGROUND } from '../../utils/GlobalVars';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

function LineChart({ option, dataSet, plugins, refer }) {
  const options = option || {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: true, // Cambiado a true para mostrar las etiquetas en el eje X si es necesario
        },
      },
      y: {
        grid: {
          display: true,
        },
        ticks: {
          display: true, // Cambiado a true para mostrar las etiquetas en el eje Y si es necesario
          color: 'white',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    elements: {
      line: {
        tension: 0.1, // Suaviza las líneas
      },
      point: {
        radius: 5, // Hace los puntos visibles
        hoverRadius: 7, // Aumenta el tamaño del punto al pasar el mouse
        backgroundColor: CHART_MAIN_COLOR_BACKGROUND, // Color de fondo de los puntos
        borderColor: 'white', // Borde de los puntos
        borderWidth: 2, // Ancho del borde de los puntos
      },
    },
  };

  const labels = [' ', ' ', ' ', ' ', ' ', ' ', ' '];

  const data = dataSet || {
    labels,
    datasets: [
      {
        data: [0, 10, 0, 65, 0, 25, 0, 35, 20, 70, 40, 75, 50, 85, 2000],
        label: 'Balance',
        borderColor: '#22C55E', // Color de la línea a verde
        backgroundColor: 'rgba(34, 197, 94, 0.2)', // Relleno verde claro y transparente
        pointRadius: 5, // Asegura que los puntos sean visibles
        borderWidth: 2, // Ancho de la línea
        fill: true, // Habilita el relleno bajo la línea
      },
    ],
  };

  return <Line options={options} data={data} plugins={plugins} ref={refer} />;
}

export default LineChart;
