import { useState, useEffect, useCallback } from 'react';
import { FaThumbsUp, FaThumbsDown, FaCommentAlt, FaShareAlt } from 'react-icons/fa';
import { http } from '../../utils/http_request';
import getUser from '../../utils/getUser';
import SubCommentForum from './SubCommentForum';

// Componente principal para renderizar un solo post
export default function SinglePost({ post }: any) {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes ?? 0);
  const [dislikes, setDislikes] = useState(post.dislikes ?? 0);
  const [comments, setComments] = useState(post.comments ?? []);
  const [likeStatus, setLikeStatus] = useState<'liked' | 'disliked' | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      const response = await http.get(`/posts/${post._id}/comments`);
      if (response.status === 200) {
        setComments(response.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [post._id]);

  useEffect(() => {
    if (showComments) fetchComments();
  }, [showComments, fetchComments]);

  const handleVote = async (type: 'like' | 'dislike') => {
    try {
      const response = await http.post(`/posts/${post._id}/vote`, { type, userId: getUser?._id });
      if (response.status === 200) {
        const mappedType = type === 'like' ? 'liked' : 'disliked';

        if (type === 'like') {
          setLikes((prev: any) => (likeStatus === 'liked' ? prev - 1 : prev + 1)); // Ajustar likes
          if (likeStatus === 'disliked') setDislikes((prev: any) => prev - 1); // Remover dislike previo
        } else {
          setDislikes((prev: any) => (likeStatus === 'disliked' ? prev - 1 : prev + 1)); // Ajustar dislikes
          if (likeStatus === 'liked') setLikes((prev: any) => prev - 1); // Remover like previo
        }

        setLikeStatus(likeStatus === mappedType ? null : mappedType); // Cambiar el estado de like/dislike
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className='p-4 bg-gray-800 rounded-lg shadow-md space-y-4'>
      <PostHeader title={post.title} />
      <PostBody content={post.content} />
      <PostActions
        likes={likes}
        dislikes={dislikes}
        likeStatus={likeStatus}
        onLike={() => handleVote('like')}
        onDislike={() => handleVote('dislike')}
        onCommentClick={() => setShowComments(prev => !prev)}
      />
      {showComments && (
        <CommentSection postId={post._id} comments={comments} setComments={setComments} />
      )}
    </div>
  );
}

// Componente para el encabezado del post
function PostHeader({ title }: { title: string }) {
  return (
    <div>
      <h2 className='text-xl font-semibold text-white '>{title}</h2>
    </div>
  );
}

// Componente para el cuerpo del post
function PostBody({ content }: { content: string }) {
  return <p className='text-gray-400'>{content}</p>;
}

// Componente para las interacciones del post
function PostActions({ likes, dislikes, likeStatus, onLike, onDislike, onCommentClick }: any) {
  return (
    <div className='flex space-x-4 text-gray-300'>
      <ActionButton
        onClick={onLike}
        isActive={likeStatus === 'liked'}
        icon={<FaThumbsUp />}
        label={likes}
        activeClass='text-green-500' // Likes en verde
      />
      <ActionButton
        onClick={onDislike}
        isActive={likeStatus === 'disliked'}
        icon={<FaThumbsDown />}
        label={dislikes}
        activeClass='text-red-500' // Dislikes en rojo
      />
      <ActionButton onClick={onCommentClick} icon={<FaCommentAlt />} />
      <ActionButton icon={<FaShareAlt />} />
    </div>
  );
}

// Componente reutilizable para botones de acción
function ActionButton({ onClick, isActive, icon, label, activeClass = 'text-gray-400' }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1 ${
        isActive ? activeClass : 'hover:text-gray-400'
      } transition-all`}
    >
      {icon}
      {typeof label === 'string' || typeof label === 'number' ? <span>{label}</span> : null}
    </button>
  );
}

// Componente para la sección de comentarios
function CommentSection({ postId, comments, setComments }: any) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCommentSubmit = async () => {
    if (!comment) return;

    setLoading(true);
    setError('');
    try {
      const response = await http.post(`/posts/${postId}/comment`, { content: comment });
      if (response.status === 201) {
        setComments((prev: any) => [...prev, response.data]);
        setComment('');
      }
    } catch (error) {
      setError('Failed to submit comment');
      console.error('Error submitting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-4'>
      {comments.map((comment: any, index: number) => (
        <SubCommentForum key={index} comment={comment} />
      ))}

      {/* Input area */}
      <textarea
        className='w-full bg-gray-700 p-2 rounded-md text-white'
        placeholder='Write your comment...'
        value={comment}
        onChange={e => setComment(e.target.value)}
        disabled={loading}
      />
      <button
        onClick={handleCommentSubmit}
        className='mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-500'
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Comment'}
      </button>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
}
