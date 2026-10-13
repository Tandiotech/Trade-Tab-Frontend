import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import getUser from '@/utils/getUser';
import { http } from '@/utils/http_request';

const BrokerLikeAndDislike = () => {
  const [upvotes, setUpvotes] = useState(23423);
  const [downvotes, setDownvotes] = useState(23423);
  const [userVote, setUserVote] = useState<null | 'up' | 'down'>(null);

  const userId = getUser?._id || '';

  // Extract brokerId from URL
  const brokerId = new URLSearchParams(window.location.search).get('id') || '';

  const sendReaction = async (action: 'like' | 'dislike' | 'neutral') => {
    try {
      const response = await http.post('/user/broker/reaction', {
        brokerId,
        userId,
        action,
      });

      if (response.data.success) {
        return true;
      }
    } catch (error) {
      console.error('Failed to send reaction:', error);
    }
    return false;
  };

  const handleUpvote = async () => {
    let success = false;

    if (userVote === 'up') {
      success = await sendReaction('neutral');
      if (success) {
        setUpvotes(upvotes - 1);
        setUserVote(null);
      }
    } else if (userVote === 'down') {
      success = await sendReaction('like');
      if (success) {
        setUpvotes(upvotes + 1);
        setDownvotes(downvotes - 1);
        setUserVote('up');
      }
    } else {
      success = await sendReaction('like');
      if (success) {
        setUpvotes(upvotes + 1);
        setUserVote('up');
      }
    }
  };

  const handleDownvote = async () => {
    let success = false;

    if (userVote === 'down') {
      success = await sendReaction('neutral');
      if (success) {
        setDownvotes(downvotes - 1);
        setUserVote(null);
      }
    } else if (userVote === 'up') {
      success = await sendReaction('dislike');
      if (success) {
        setDownvotes(downvotes + 1);
        setUpvotes(upvotes - 1);
        setUserVote('down');
      }
    } else {
      success = await sendReaction('dislike');
      if (success) {
        setDownvotes(downvotes + 1);
        setUserVote('down');
      }
    }
  };

  const total = upvotes + downvotes;
  const upPercentage = total > 0 ? (upvotes / total) * 100 : 50;

  return (
    <div className='flex justify-center md:justify-normal flex-col w-full h-full md:h-fit bg-[#0F172A] p-4 rounded-lg'>
      {' '}
      <div className='flex md:hidden w-full  justify-center'>
        <img className='h-16 w-12 lg:h-20 lg:w-14' src='/assets/like_dislike.png' alt='' />
      </div>
      <div className='flex justify-between items-end mb-2 gap-2'>
        <div
          className={`flex items-center ${userVote === 'up' ? 'text-green-300' : 'text-green-400'} font-bold cursor-pointer hover:opacity-80 transition-opacity`}
          onClick={handleUpvote}
        >
          <span className='text-sm lg:text-xl mr-2'>{upvotes}</span>
          <ThumbsUp
            className={`${userVote === 'up' ? 'fill-green-300 stroke-green-300' : 'fill-green-400 stroke-green-400'}`}
            size={17}
          />
        </div>
        <div className='hidden md:block'>
          <img className='h-16 w-12 lg:h-20 lg:w-14' src='/assets/like_dislike.png' alt='' />
        </div>
        <div
          className={`flex items-center ${userVote === 'down' ? 'text-red-400' : 'text-red-500'} font-bold cursor-pointer hover:opacity-80 transition-opacity`}
          onClick={handleDownvote}
        >
          <ThumbsDown
            className={`${userVote === 'down' ? 'fill-red-400 stroke-red-400' : 'fill-red-500 stroke-red-500'}`}
            size={17}
          />
          <span className='text-sm lg:text-xl ml-2'>{downvotes}</span>
        </div>
      </div>
      <div className='h-4 rounded-full overflow-hidden bg-gray-800'>
        <div className='flex h-full'>
          <div
            className='bg-green-400 transition-all duration-300'
            style={{ width: `${upPercentage}%` }}
          ></div>
          <div
            className='bg-red-500 transition-all duration-300'
            style={{ width: `${100 - upPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BrokerLikeAndDislike;
