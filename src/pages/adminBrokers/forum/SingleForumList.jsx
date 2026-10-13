import { CiCircleMore } from "react-icons/ci";
import { formatDate } from "../../../services/formatDate";
import { Link } from "react-router-dom";
// import { useFetchData } from "../../../hook/fetchData";

export default function SingleForumList({post}) {

  return (
    <li
      key={post._id}
      className='p-6 bg-darkblack-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1'
    >
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4'>
        <div>
        <span className='text-gray-400 text-sm'>{formatDate(post.createdAt)}</span>
          <h3 className='flex justify-between items-center text-xl font-semibold text-white'>
            <span>{post.title}</span>
          </h3>
          <p className='text-base text-gray-200 font-semibold'>
            {/* Broker: {post.brokerId} */}
            Broker: {post?.brokerId.generalInformation?.brokerName}
          </p>
        </div>
        <Link
          to={`/forum/${post._id}`}
          className='mt-2 md:mt-0 text-2xl text-[#02C686] hover:text-white font-semibold transition duration-300'
        >
          <CiCircleMore/>
        </Link>
      </div>
      <p className='text-gray-300 mb-3'>Content: {post.content}</p>

      {/* Comentarios */}
      {post.comments?.length > 0 && (
        <div className='mt-4'>
          <h4 className='font-bold text-[#02C686] mb-2'>Comments:</h4>
          <ul className='space-y-2'>
            {post.comments.map(comment => (
              <li key={comment._id} className='text-gray-400'>
                {comment.content}
                {/* - <span className='text-teal-500'>{comment.userId}</span> */}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Votos */}
      <p className='mt-4 text-sm text-gray-400'>
        Likes: {post.votes.filter(v => v.type === 'like').length} | Dislikes:{' '}
        {post.votes.filter(v => v.type === 'dislike').length}
      </p>
    </li>
  );
}
