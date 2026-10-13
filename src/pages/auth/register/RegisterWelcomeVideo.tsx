import { useState } from 'react';
import { BiPlay } from 'react-icons/bi';

export default function RegisterWelcomeVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className='absolute inset-0 flex min-h-[200px] w-full items-center justify-center md:min-h-[260px]'>
      {/* YouTube Video */}
      {isPlaying ? (
        <iframe
          width='100%'
          height='100%'
          src='https://www.youtube.com/embed/dJaYtf5kBg0?autoplay=1&controls=1'
          title='YouTube video player'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write;preload; encrypted-media; gyroscope; picture-in-picture; web-share'
          referrerPolicy='strict-origin-when-cross-origin'
          allowFullScreen
          className='rounded-2xl'
        ></iframe>
      ) : (
        <>
          {/* Video Placeholder */}
          <img
            id='videoPlayerPlaceholder'
            src='assets/video_ph3.png'
            alt='Video Placeholder'
            className='w-full h-full object-contain rounded-2xl'
          />

          {/* Play Button */}
          <button
            onClick={handlePlay}
            className='absolute flex justify-center items-center bg-black bg-opacity-70 p-4 rounded-full hover:bg-opacity-50 transition duration-300'
            style={{ fontSize: '2rem', width: '70px', height: '70px' }}
          >
            <BiPlay size={50} />
          </button>
        </>
      )}
    </div>
  );
}
