import SinglePost from './SinglePost';

interface ForumPostListProps {
  posts: any[];
}

export default function ForumPostList({ posts }: ForumPostListProps) {
  return (
    <div className='space-y-4'>
      {posts.length > 0 ? (
        posts.map(post => <SinglePost key={post._id} post={post} />)
      ) : (
        <p className='text-center text-gray-400'>No posts found.</p>
      )}
    </div>
  );
}
