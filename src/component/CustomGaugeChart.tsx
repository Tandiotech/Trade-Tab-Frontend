import GaugeChart from 'react-gauge-chart';

// Función para obtener los colores dinámicos basados en el valor
const getGaugeColors = (value: any) => {
  if (isNaN(value)) {
    // Si el valor es NaN, retornar un color gris con baja opacidad
    return ['rgba(169, 169, 169, 0.3)', 'rgba(0, 0, 0, 0.1)']; // Gris claro
  }
  if (value < 40) {
    const opacity = value / 20; // Calcula la opacidad basada en el valor
    const circunferencia = value < 20 ? '-1.6' : '-1.4';
    return [`rgba(255, 95, 109, ${opacity})`, `rgba(0, 0, 0, ${circunferencia})`]; // Rojo con opacidad
  } else if (value >= 40 && value <= 70) {
    const opacity = (value - 3) / 30; // Calcula la opacidad basada en el valor
    const circunferencia = value < 50 ? '-1.2' : '-0.9';
    return [`rgba(255, 195, 113, ${opacity})`, `rgba(255, 190,112, ${circunferencia})`]; // Amarillo con opacidad
  } else {
    const opacity = (value - 7) / 30; // Calcula la opacidad basada en el valor
    const circunferencia = value > 90 ? '-0.05' : '-0.3';
    return [`rgba(0, 201, 167, ${opacity})`, `rgba(0, 200, 160, ${circunferencia})`]; // Verde con opacidad
  }
};

const CustomGaugeChart = ({ item, index, displayLabel = false, width='w-[90%]'}: any) => {
  const value = !isNaN(item.value) ? item.value : 0.1; // Aseguramos que esté entre 0 y 1

  return (
    // <div key={index} className='flex flex-col gap-4 w-[77%]'>
    <div key={index} className={`flex flex-col gap-4 ${width}`}>
      {displayLabel && <span className='break-words text-sm'>{item.label}</span>}
      <GaugeChart
        id={`gauge-chart-${index}`}
        // className='h-[200px]'
        nrOfLevels={20}
        percent={value}
        colors={getGaugeColors(item.value * 100)} // Asignar colores dinámicamente
        arcWidth={0.3}
        arcPadding={0.02}
        cornerRadius={2}
        needleColor='#345243'
        needleBaseColor='#345243'
        textColor='#fff'
        fontSize='15px'
        formatTextValue={(value: string) => `${!isNaN(parseFloat(value)) ? value : '1'}%`}
      />
    </div>
  );
};

export default CustomGaugeChart;
