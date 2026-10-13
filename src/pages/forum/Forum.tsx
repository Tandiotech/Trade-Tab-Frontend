import { useState, useEffect } from 'react';
import CreatePost from './CreatePost';
import ForumPostList from './ForumPostList';
import { http } from '../../utils/http_request';
import getUser from '../../utils/getUser';
import AuthUser from '../../hook/useAuthUser';
import { RUTE_GET_POSTS_PER_BROKER } from '@/utils/Rutes';

interface ForumProps {
  brokerId: string;
}

export default function Forum({ brokerId }: ForumProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuthUser();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await http.get(
          `${RUTE_GET_POSTS_PER_BROKER}${brokerId}${getUser._id ? `?a=${getUser._id}` : ''}`
        );
        setPosts(response.data.posts || []); // Asegura que siempre asigna un array
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [brokerId]);

  // Función para agregar un nuevo post a la lista
  const addPostToList = (newPost: any) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  if (loading) {
    return <p className='text-center text-gray-500 animate-pulse'>Loading forum...</p>;
  }

  return (
    <div className='container mx-auto px-4'>
      <h1 className='text-3xl font-bold text-center mt-8 mb-6 text-gray-200'>Forum</h1>
      {isLoggedIn() ? (
        <CreatePost addPost={addPostToList} brokerId={brokerId} />
      ) : (
        <h3 className='mb-6 bg-darkblack-700 p-6 rounded-lg shadow-lg space-y-'>
          You need to log in to create a post in the forum.
        </h3>
      )}

      <ForumPostList posts={posts} />
    </div>
  );
}
