import { useState } from 'react';
import { formaterCamelCase } from '../../../../../utils/formaterCamelCase';
import { IShowListProps } from '../interface';
import { regulationsDescriptions } from '../regulationsDescriptions';

const ShowList: React.FC<IShowListProps> = ({ data, label, tooltip = false, truncate = true }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <li className='flex flex-col '>
      <span className='text-[#5EEAD4] text-base md:text-lg font-semibold whitespace-nowrap'>
        {formaterCamelCase(label)}:
      </span>

      <div className='flex flex-wrap  gap-2 text-white mt-2 md:mt-0'>
        {data?.split(/,|::/).map((item, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={index}
              onClick={() => truncate && setExpandedIndex(isExpanded ? null : index)}
              className={`relative bg-[#585858] h-fit bg-opacity-20 px-5 py-2 rounded-lg shadow-xl hover:text-slate-300 cursor-pointer group ${
                isExpanded ? 'max-w-none' : 'max-w-xs'
              }`}
            >
              <span
                className={`text-sm block whitespace-pre-wrap  ${!isExpanded && truncate ? 'truncate' : ''}`}
              >
                {item}
              </span>

              {tooltip && regulationsDescriptions[item] && (
                <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex w-max max-w-[250px] bg-black text-white text-xs p-2 rounded-md shadow-lg z-10'>
                  {regulationsDescriptions[item]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </li>
  );
};

export default ShowList;
