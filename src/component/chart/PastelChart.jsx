import { useEffect, useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PastelChart = ({
  symbolData = [40, 60], // Default sample data
  symbolName = ['Won', 'Loss'], // Default labels
  backgroundColor = ['#165A9E', '#00C686', 'lime', '#FF9F40', 'red', 'white', 'blue'], // Colors
  centerText = 'Long/Short',
}) => {
  const chartRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation when component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate total and percentages
  const total = symbolData.reduce((acc, val) => acc + val, 0);
  const hasData = total > 0;

  // Prepare chart data
  const data = {
    labels: symbolName,
    datasets: [
      {
        data: hasData ? symbolData : [1], // Show a single segment if no data
        backgroundColor: hasData ? backgroundColor : ['#374151'],
        borderColor: ['rgba(15, 23, 42, 0.8)'],
        borderWidth: 3,
        hoverOffset: 8,
        hoverBorderWidth: 4,
        hoverBorderColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  // Chart options with modern styling
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%', // Creates the donut effect
    plugins: {
      legend: {
        display: false, // We'll create custom legend
      },
      tooltip: {
        enabled: hasData,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} (${percentage}%)`;
          },
        },
        titleFont: {
          size: 13,
          weight: '600',
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    interaction: {
      mode: 'nearest',
      intersect: true,
    },
  };


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='relative w-full h-full flex items-center justify-center'
    >
      <div className='relative w-full max-w-[400px] aspect-square mx-auto flex items-center justify-center'>
        {/* Glow effect for modern look */}
        <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl opacity-60 animate-pulse' />

        {/* Chart container - centered */}
        <div className='relative z-10 w-full flex items-center justify-center'>
          <Doughnut ref={chartRef} data={data} options={options} />
        </div>

        {/* No data overlay */}
        {!hasData && (
          <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
            <div className='text-center'>
              <p className='text-gray-400 text-sm font-medium'>No Data</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PastelChart;
