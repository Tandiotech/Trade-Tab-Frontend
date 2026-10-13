import { useState } from 'react';
import UpvoteDownvote from './UpvoteDownvote';

export default function CommentSection({ postId }: any) {
  const [comments, setComments] = useState([
    { id: 1, text: "This is a great idea!", votes: 12 },
    { id: 2, text: "Looking forward to seeing this implemented.", votes: 8 },
  ]);

  return (
    <div className="mt-4 space-y-4">
      {comments.map(comment => (
        <div key={comment.id} className="bg-gray-800 p-3 rounded-lg">
          <p className="text-gray-300">{comment.text}</p>
          <UpvoteDownvote votes={comment.votes} />
        </div>
      ))}
      <form className="mt-4">
        <textarea
          className="w-full p-2 bg-gray-900 text-white rounded-md"
          placeholder="Add a comment..."
          rows={3}
        ></textarea>
        <button type="submit" className="bg-teal-500 px-4 py-2 rounded-md mt-2">
          Comment
        </button>
      </form>
    </div>
  );
}
