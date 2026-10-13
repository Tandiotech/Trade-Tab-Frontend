import GaugeChart from 'react-gauge-chart';

const GreedAndFearGauge = () => {
  // Value for the gauge (0 is Fear, 1 is Greed)
  const value = 0.28; // Adjust this value based on your data

  return (
    <div className='flex-col items-center w-1/2 block mx-auto'>
      {/* <h2 className="text-xl font-bold mb-4">Greed and Fear Index</h2> */}
      <div className='mt-4 flex space-x-4 text-sm w-full text-center justify-center'>
        <p className=''>0% -Distrust</p>
        <p className=''>100% -Trust</p>
      </div>

      <GaugeChart
        id='greed-fear-gauge'
        percent={value}
        nrOfLevels={20}
        colors={['#FF5F6D', '#FFC371', '#00C9A7']}
        arcWidth={0.3}
        arcPadding={0.02}
        cornerRadius={3}
        needleColor='#345243'
        needleBaseColor='#345243'
        textColor='#345243'
        formatTextValue={(value: string) => `${(+value * 1).toFixed(0)}%`}
      />
    </div>
  );
};

export default GreedAndFearGauge;
