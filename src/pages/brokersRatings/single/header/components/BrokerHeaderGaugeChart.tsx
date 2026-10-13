import { formaterCamelCase } from '../../../../../utils/formaterCamelCase';
import CustomGaugeChart from '../../../../../component/CustomGaugeChart';
import ReinventedGaugeChart from '../../../../../component/chart/ReinventedGaugeChart';

export default function BrokerHeaderGaugeChart({ data }: any) {
  const renderContent = () => {
    if (!data || Object.keys(data).length === 0) {
      return <p className='text-center text-white text-xl'>No Data</p>;
    }

    const parsedData = Object.keys(data)
      .filter(key => key !== 'overallReview' && key !== 'stars') // Excluyendo 'stars'
      .map(key => ({
        label: key,
        value: parseFloat(data[key]) / 100,
      }));

    return (
      <div className='flex flex-col '>
        <div className='w-full flex items-center justify-center flex-col'>
          <div className='w-full md:py-2 relative'>
            <div>
              <p className='text-white text-center font-semibold w-full'>Overall Review</p>
            </div>
            <div className='flex justify-center h-28'> </div>
            <div className='absolute top-5 left-0 right-0 flex flex-col items-center justify-center'>
              <ReinventedGaugeChart
                value={!isNaN(parseFloat(data?.overallReview)) ? data?.overallReview : 50}
                maxValue={100}
                size={200}
              />
            </div>
          </div>
        </div>

        <div className='w-full text-white grid gap-1 grid-cols-12 text-center mb-2 mt-7 md:mb-0'>
          {parsedData.map((item: any, index: number) => (
            <div key={index} className='col-span-6 '>
              <CustomGaugeChart item={item} index={index} width='w-full' />
              <span className='break-words text-[0.87rem] font-semibold whitespace-nowrap text-start'>
                {formaterCamelCase(item.label)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className='flex items-center justify-center'>
      <div className='w-full h-full  rounded-xl '>
        <h3
          className={` flex justify-center items-center  text-center font-bold text-xl lg:text-3xl`}
        >
          <img src='/logo_1.png' className='w-8 md:w-14 mr-1 whitespace-nowrap' />
          Broker Performance
        </h3>
        {renderContent()}
      </div>
    </div>
  );
}
