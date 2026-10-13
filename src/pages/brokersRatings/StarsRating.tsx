import { FaStar } from 'react-icons/fa'; // Importamos el icono de estrella

const StarRating = ({ rating }: any) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  const _size = 15;
  if (!rating) {
    return <p className='text-center text-white text-xl'>No Rating Data</p>;
  }
  return (
    <div className='flex space-x-1 justify-center'>
      {/* Renderizamos las estrellas llenas */}
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={`full-${index}`} size={_size} className='text-yellow-500 cursor-pointer' />
      ))}

      {/* Renderizamos la estrella a la mitad si corresponde */}
      {halfStar === 1 && (
        <FaStar key='half-star' size={_size} className='text-yellow-500 cursor-pointer' />
      )}

      {/* Renderizamos las estrellas vacías */}
      {[...Array(emptyStars)].map((_, index) => (
        <FaStar key={`empty-${index}`} size={_size} className='text-gray-400 cursor-pointer' />
      ))}
    </div>
  );
};

export default StarRating;
