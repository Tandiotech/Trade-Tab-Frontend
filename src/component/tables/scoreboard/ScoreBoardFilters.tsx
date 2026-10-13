import { FaSearch, FaTimes } from 'react-icons/fa';

const ScoreBoardFilter = () => {
  return (
    <div className='flex flex-col w-full p-4 border-b border-gray-300'>
      <div className='flex flex-wrap items-center justify-between space-y-2'>
        <div className='flex items-center space-x-3 mb-2'>
          <FaSearch size={20} className='text-gray-600' />
          <span className='text-base font-semibold'>
            Custom Search <br /> 171 results
          </span>
        </div>

        {/* Filters */}
        <div className='flex flex-wrap gap-2 items-center justify-start'>
          <FilterButton label='Last 12M' />
          <FilterButton label='Full Name' />
          <FilterButton label='Verified' />
          <FilterButton label='Risk Score (1 - 7)' />
          <FilterButton label='Copied Traders' />
          <button className='text-blue-500 whitespace-nowrap'>See All</button>
        </div>
      </div>
    </div>
  );
};

const FilterButton = ({ label }: { label: string }) => (
  <div className='flex items-center bg-slate-300 bg-opacity-25 text-teal-500 px-3 py-1 rounded-full whitespace-nowrap'>
    <span>{label}</span>
    <FaTimes size={12} className='ml-1 cursor-pointer' />
  </div>
);

export default ScoreBoardFilter;
