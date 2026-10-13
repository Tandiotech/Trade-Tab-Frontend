import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import QuickLinks from './QuickLinks';

const WantToSaySomethingAboutThisBroker = () => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const maxCommentLength = 200;

  const handleCommentChange = (e:any) => {
    if (e.target.value.length <= maxCommentLength) {
      setComment(e.target.value);
      setError('');
    } else {
      setError(`Comment cannot exceed ${maxCommentLength} characters.`);
    }
  };

  const handleRatingChange = (ratingValue:number) => {
    setRating(ratingValue);
    setError('');
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();

    if (!comment || rating === 0) {
      setError('Please provide a rating and a comment.');
      return;
    }

    setSubmitted(true);
  };

  return (
    // <div className="w-full md:w-2/3 lg:w-1/2 px-4 mb-8 mx-auto ">
    <div className="w-full h-full md:w-2/3 lg:w-full px-4 mx-auto col-span-5">
      <div className="bg-darkblack-700 p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 text-white">Want to Say Something About This Broker?</h3>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-bold mb-2">Rating:</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={30}
                    className={`cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-500'}`}
                    onClick={() => handleRatingChange(star)}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="comment">
                Your Comment:
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={handleCommentChange}
                className="bg-gray-800 text-gray-300 p-2 rounded w-full h-32 border-black active:border-emerald-600"
                placeholder="Write your comment here..."
              />
              <div className="text-gray-500 text-sm mt-1">{comment.length}/{maxCommentLength} characters</div>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out transform hover:scale-105"
              >
                Submit
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center text-gray-300">
            <div className="mb-4">
              <FaStar size={40} className="text-yellow-500 mx-auto animate-bounce" />
            </div>
            <p className="text-xl">Thank you for your feedback!</p>
            <p className="mt-4">You rated this broker {rating} stars</p>
            <p>Your comment: <span className="italic">{comment}</span></p>
          </div>
        )}
      </div>


      <QuickLinks/>

    </div>
  );
};

export default WantToSaySomethingAboutThisBroker;
