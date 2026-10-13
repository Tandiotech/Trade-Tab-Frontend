import { useState } from 'react';

const BrokerSummary = ({ summary }: any) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 300; // Characters to show initially

  // If summary is undefined or null, return empty string
  if (!summary) return '';

  // Check if the summary is long enough to need truncating
  const needsTruncation = summary.length > maxLength;

  // Get the display text based on expanded state
  const displayText =
    expanded || !needsTruncation ? summary : `${summary.substring(0, maxLength)}...`;

  return (
    <div className='relative'>
      <div className='text-white'>{displayText}</div>

      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className='text-blue-400 text-right w-full impulse hover:text-blue-500  font-medium mt-2 transition-colors duration-300 focus:outline-none'
        >
          {expanded ? 'See Less' : 'See More'}
        </button>
      )}
    </div>
  );
};

export default BrokerSummary;
