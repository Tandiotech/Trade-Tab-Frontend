import { useEffect, useState } from 'react';
import { logosBrokersAds } from './logosBrokersAds';

// Define la ruta base para las imágenes
const basePath = '/assets/img/partners/';

// Función para mezclar los elementos sin repetición en la selección final
function shuffleUnique(array, num) {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return Array.from(new Set(shuffled)).slice(0, num);
}

// Función para obtener el número de imágenes basado en el ancho de la pantalla
const getNumberOfImages = () => {
  const koa = 3;
  const initialNumber = 5; // Ajustado para una versión horizontal
  const width = window.innerWidth;
  return width > 1200 ? initialNumber + koa : width > 768 ? initialNumber : initialNumber - koa;
};

export default function AdvertisingSpaceBrokersHorizontal({
  bgColor = 'bg-gradient-to-r from-teal-500 via-teal-600 to-sky-800',
  imageSize = 'h-24 md:h-28 lg:h-32 w-1/2',
}) {
  const [visibleImages, setVisibleImages] = useState([]);

  useEffect(() => {
    // Función para actualizar las imágenes mostradas
    const updateImages = () => {
      const shuffledImages = shuffleUnique(logosBrokersAds, getNumberOfImages());
      setVisibleImages(shuffledImages);
    };

    // Inicializa al cargar
    updateImages();

    // Escucha cambios en el tamaño de la ventana
    window.addEventListener('resize', updateImages);

    // Escucha cambios en el URL usando el evento popstate
    window.addEventListener('popstate', updateImages);

    // Limpia los eventos al desmontar el componente
    return () => {
      window.removeEventListener('resize', updateImages);
      window.removeEventListener('popstate', updateImages);
    };
  }, []);

  return (
    <div
      // className='w-full relative overflow-x-hidden bg-gradient-to-r from-teal-500 via-teal-600 to-sky-800 py-3 px-1 rounded-lg shadow-xl flex items-center space-x-4'
      className={`w-full relative overflow-x-hidden ${bgColor} py-3 px-1 rounded-lg shadow-xl flex items-center space-x-4`}
      style={{ height: 'fit-content' }}
    >
      {/* <p className='absolute bottom-0 left-0 font-semibold text-sm text-white whitespace-nowrap px-1'>
        Our Partners
      </p> */}
      <div className='flex items-center space-x-4'>
        {visibleImages.map((fileName, index) => (
          <img
            key={index}
            className={`transition-opacity duration-2000 opacity-80 rounded-md ${imageSize}`}
            src={`${basePath}${fileName}`}
            alt={`Logo of ${fileName.split('.')[0]}`}
            loading='lazy'
          />
        ))}
      </div>
    </div>
  );
}
