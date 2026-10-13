import React from 'react';
import { MdOutlinePendingActions } from 'react-icons/md';

const UnderReviewBadge: React.FC = () => {
  return (
    <div className="relative whitespace-nowrap flex ml-14 items-center space-x-2 text-white font-urbanist bg-blue-500 text-base rounded-sm px-1 py-2 font-semibold transform -rotate-3">
      <MdOutlinePendingActions />UNDER REVIEW
      <div className="absolute -top-3 -right-4 w-4 h-4 bg-[#2B2935] transform rotate-45 origin-top-left"></div>
    </div>
  );
};

export default UnderReviewBadge;
