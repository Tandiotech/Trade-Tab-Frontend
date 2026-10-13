import { FaExternalLinkAlt } from 'react-icons/fa';

interface EconomicEventProps {
  event: {
    source: { name: string };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    date: string;
    content: string;
  };
}

const importanceKeywords = {
  High: ['merger', 'acquisition', 'rate', 'approval', 'earnings', 'GDP', 'employment', 'inflation', 'CPI', 'FOMC'],
  Medium: ['quarterly', 'regulatory', 'financial', 'results', 'growth'],
};

const getImportance = (title: string, description: string) => {
  const lowerTitle = title?.toLowerCase();
  const lowerDescription = description?.toLowerCase();

  if (importanceKeywords.High.some(keyword => lowerTitle?.includes(keyword) || lowerDescription?.includes(keyword))) {
    return { label: 'High', color: 'bg-red-500' };
  }

  if (importanceKeywords.Medium.some(keyword => lowerTitle?.includes(keyword) || lowerDescription?.includes(keyword))) {
    return { label: 'Medium', color: 'bg-orange-500' };
  }

  return { label: 'Low', color: 'bg-blue-500' };
};

export default function SingleEconomicEvent({ event }: EconomicEventProps) {
  const { title, description, date, source, url, urlToImage } = event;

  const { label: importanceLabel, color: importanceColor } = getImportance(title, description);

  return (
    <div className='bg-darkblack-600 p-4 rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
      <div className='flex flex-col flex-1'>
        <span className='text-xs text-gray-400'>{new Date(date).toLocaleString()}</span>
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='text-base font-semibold text-teal-400 hover:underline flex gap-2 items-center'
        >
          {title}
          <FaExternalLinkAlt className='text-xs' />
        </a>
        <span className='text-sm text-gray-300 mt-1 line-clamp-2'>{description}</span>
        <span className='text-xs text-gray-500 italic mt-1'>Source: {source?.name}</span>
      </div>

      <div className='flex flex-col items-center md:items-end mt-2 md:mt-0'>
        <span className={`text-white text-xs px-3 py-1 rounded-full ${importanceColor}`}>
          {importanceLabel} Impact
        </span>
        <span className='text-xs text-gray-400 mt-1'>{new Date(date).toLocaleTimeString()}</span>
      </div>

      {urlToImage && (
        <img
          className='hidden md:block w-24 h-16 rounded-md object-cover'
          src={urlToImage}
          alt={title}
        />
      )}
    </div>
  );
}


// import { FaExternalLinkAlt } from 'react-icons/fa';

// interface EconomicEventProps {
//   event: {
//     source: { name: string };
//     author: string;
//     title: string;
//     description: string;
//     url: string;
//     urlToImage: string;
//     date: string;
//     content: string;
//   };
// }

// const importanceKeywords = {
//   High: ['merger', 'acquisition', 'rate', 'approval', 'earnings', 'GDP', 'employment', 'inflation', 'CPI', 'FOMC'],
//   Medium: ['quarterly', 'earnings', 'regulatory', 'financial', 'results', 'growth'],
// };

// const getImportanceLevel = (title: string, description: string) => {
//   const lowerTitle = title.toLowerCase();
//   const lowerDescription = description.toLowerCase();

//   if (importanceKeywords.High.some(keyword => lowerTitle.includes(keyword) || lowerDescription.includes(keyword))) {
//     return { label: 'High', color: 'bg-red-500' };
//   }
//   return { label: 'Moderate', color: 'bg-blue-500' };
// };

// export default function SingleEconomicEvent({ event }: EconomicEventProps) {
//   const { title, description, date, source, url, urlToImage, author } = event;

//   const importance = importanceKeywords ? importanceKeywords : 'Normal';
//   const importanceInfo = importanceKeywords ? importanceKeywords : 'Normal';

//   const { label: importanceLabel, color: importanceColor } = getImportance(event.title, event.description);

//   function getImportance(title: string, description: string) {
//     const lowerTitle = title.toLowerCase();
//     const lowerDescription = description.toLowerCase();

//     if (importanceKeywords.High.some(keyword => lowerTitle.includes(keyword) || lowerDescription.includes(keyword))) {
//       return { label: 'High', color: 'bg-red-500' };
//     } else {
//       return { label: 'Medium', color: 'bg-blue-500' };
//     }
//   }

//   return (
//     <div className='bg-darkblack-600 p-4 rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
      
//       <div className='flex flex-col'>
//         <span className='text-xs text-gray-400'>{new Date(event.date).toLocaleString()}</span>
//         <a href={url} target='_blank' rel='noopener noreferrer' className='text-base font-semibold text-teal-400 hover:underline flex gap-2 items-center'>
//           {event.title}
//           <span className='text-xs'>
//             <FaExternalLinkAlt />
//           </span>
//         </a>
//         <span className='text-sm text-gray-300 mt-1 line-clamp-2'>{event.description}</span>
//         <span className='text-xs text-gray-500 italic mt-1'>Source: {event.source.name}</span>
//       </div>

//       <div className='flex flex-col items-center md:items-end'>
//         <span className={`text-white text-xs px-3 py-1 rounded-full ${importanceColor}`}>
//           {importanceLabel} Impact
//         </span>
//         <span className='text-xs text-gray-400 mt-1'>{new Date(event.date).toLocaleTimeString()}</span>
//       </div>

//       {event.urlToImage && (
//         <img
//           className='hidden md:block w-24 h-16 rounded-md object-cover'
//           src={event.urlToImage}
//           alt={event.title}
//         />
//       )}
//     </div>
//   );
// };
