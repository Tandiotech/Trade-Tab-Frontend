import { useState } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function UpvoteDownvote({ votes }: any) {
  const [currentVotes, setCurrentVotes] = useState(votes);

  const handleUpvote = () => setCurrentVotes(currentVotes + 1);
  const handleDownvote = () => setCurrentVotes(currentVotes - 1);

  return (
    <div className="flex flex-col items-center space-y-2">
      <FaArrowUp onClick={handleUpvote} className="cursor-pointer text-green-400" />
      <span className="text-white">{currentVotes}</span>
      <FaArrowDown onClick={handleDownvote} className="cursor-pointer text-red-400" />
    </div>
  );
}
