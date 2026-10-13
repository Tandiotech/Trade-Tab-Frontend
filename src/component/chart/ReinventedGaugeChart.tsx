import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface GaugeChartProps {
  value: number;
  maxValue: number;
  size?: number; // Puedes cambiar el tipo para que sea 'string' y usas 'auto' en el estilo.
  width?: string; // El ancho se define como un porcentaje o 'auto'.
}

const ReinventedGaugeChart: React.FC<GaugeChartProps> = ({
  value,
  maxValue,
  size = 400,
  width = '100%', // Cambiado a '100%' para ocupar todo el ancho del contenedor
}: any) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option = {
      backgroundColor: 'transparent', // Fondo transparente para encajar mejor en diseños oscuros
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: maxValue,
          radius: '90%',
          pointer: {
            show: true,
            length: '80%',
            width: 1,
            itemStyle: {
              color: '#50C878', // Verde del estilo TradeTab
            },
          },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            width: 7,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#14B8A6' }, // Verde agua (teal)
                { offset: 1, color: '#3B82F6' }, // Azul
              ]),
            },
          },
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 7,
              color: [[1, '#1E293B']], // Línea base más oscura para contraste
            },
          },
          splitLine: {
            distance: 1,
            length: 4,
            lineStyle: {
              color: '#1E293B',
              width: 1,
            },
          },
          axisTick: {
            distance: -11,
            length: 8,
            lineStyle: {
              color: '#374151', // Gris oscuro
              width: 1,
            },
          },
          axisLabel: {
            show: false,
            distance: 3,
            fontSize: 4,
            color: '#E5E7EB', // Texto claro
            formatter: (value: any) => `${value}`, // Formato de etiquetas
          },
          title: {
            show: true,
            offsetCenter: [0, '90%'],
            color: '#CBD5E1', // Gris claro
            fontSize: 14,
            fontWeight: 'bold',
            text: 'Performance', // Puedes personalizar el texto aquí
          },
          detail: {
            valueAnimation: true,
            offsetCenter: [0, '-30%'],
            formatter: '{value}%', // Valor con formato de porcentaje
            fontSize: 18,
            color: 'white', // Verde destacado
            fontWeight: 'bold',
          },
          data: [{ value }], // Valor dinámico
        },
      ],
    };

    chart.setOption(option);
    // Clean up on component unmount
    return () => chart.dispose();
  }, [value, maxValue]);

  return (
    <div
      className='mt-4 block mx-auto'
      ref={chartRef}
      style={{
        width: width,
        height: size,
        maxWidth: '100%', // Asegura que no exceda el contenedor
      }}
    />
  );
};

export default ReinventedGaugeChart;
