import { FaPencilAlt } from 'react-icons/fa';
import { useState } from 'react';

const profileImages = [
  'assets/img/profile_1.webp',
  'assets/img/avatar.jpg',
  'assets/img/avatar.jpg',
  'assets/img/avatar.jpg',
];

function UpdateProfile() {
  const [selectedImage, setSelectedImage] = useState('assets/img/profile_1.webp');
  const [showImageOptions, setShowImageOptions] = useState(false);

  const handleImageSelect = image => {
    setSelectedImage(image);
    setShowImageOptions(false); // Hide the image options after selecting
  };

  return (
    <div className='xl:w-2/3 space-y-2 w-full text-center'>
      <h3 className='text-white capitalize font-bold text-xl'>Update Profile</h3>
      <p className='text-bgray-600'>
        Profile of at least Size <span className='text-bgray-700'>300 x 300. </span>
      </p>

      <div>
        <div className='w-full justify-center h-44 relative'>
          <img className='rounded-full w-1/3 mx-auto' src={selectedImage} alt='profile' />

          <span
            className='p-3 rounded-full bg-green-600 text-white w-fit h-fit absolute xl:right-12 bottom-[-20px] xl:bottom-[-12px] hover:bg-success-400 duration-300 cursor-pointer'
            onClick={() => setShowImageOptions(!showImageOptions)}
          >
            <FaPencilAlt />
          </span>
        </div>
      </div>

      {/* Image selection dropdown */}
      {showImageOptions && (
        <div className='mt-4 flex justify-center space-x-4'>
          {profileImages.map((image, index) => (
            <div
              key={index}
              className='cursor-pointer hover:opacity-80 transition duration-300'
              onClick={() => handleImageSelect(image)}
            >
              <img
                className='w-16 h-16 rounded-full border-2 border-gray-400'
                src={image}
                alt={`profile option ${index + 1}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UpdateProfile;
