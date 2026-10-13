const VideoComponent: React.FC = () => {
  return (
    <div className='max-w-screen-xl relative   mx-auto '>
      <div className='lazy-video lazy-video-loaded left-1/6 absolute lg:-mt-96 md:-mt-52 -mt-36 mx-auto -z-1 '>
        <div className='mt-6'>
          <video
            autoPlay
            muted
            playsInline
            loop
            preload='auto'
            src='/assets/video/energy.mp4'
          ></video>
        </div>
      </div>
    </div>
  );
};

export default VideoComponent;
