interface Props {
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  startDate: string;
  endDate: string;
}

const EditPublicLinkDateRange: React.FC<Props> = ({
  setStartDate,
  setEndDate,
  startDate,
  endDate,
}) => {
  const handleResetDates = () => {
    setStartDate('');
    setEndDate('');
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!endDate || new Date(value) <= new Date(endDate)) {
      setStartDate(value);
    } else {
      alert('Start date cannot be after the end date.');
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!startDate || new Date(value) >= new Date(startDate)) {
      setEndDate(value);
    } else {
      alert('End date cannot be before the start date.');
    }
  };

  return (
    <div className='rounded-lg shadow-md w-full bg-[#040E18] md:border md:p-4 border-cyan-800 hover:border-cyan-500 ease-in-out duration-300'>
      <label className='block text-gray-300 text-sm font-semibold mb-2'>Select Date Range</label>

      <div className='flex md:flex-col lg:flex-row gap-2 w-full'>
        <div className='flex-1 '>
          <label className='block text-gray-400 text-xs mb-1'>Start Date</label>
          <input
            type='date'
            className='w-full p-2 rounded-md bg-gray-700 text-gray-300 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500'
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div className='flex-1'>
          <label className='block text-gray-400 text-xs mb-1'>End Date</label>
          <input
            type='date'
            className='w-full p-2 rounded-md bg-gray-700 text-gray-300 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500'
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>

      <div className='mt-4 flex flex-wrap justify-between items-center'>
        <button
          onClick={handleResetDates}
          className='py-2 px-4 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-400'
        >
          Reset Dates
        </button>
        <div className='text-gray-400 text-xs  md:mt-5 lg:mt-0'>
          {startDate && endDate
            ? `Selected Range: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
            : 'No date range selected'}
        </div>
      </div>
    </div>
  );
};

export default EditPublicLinkDateRange;
