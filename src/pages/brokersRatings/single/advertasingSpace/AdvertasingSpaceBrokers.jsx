import { useEffect, useState } from 'react';
import { logosBrokersAds } from './logosBrokersAds';

// Definimos la ruta base para las imágenes
const basePath = '/assets/img/partners/';

// Función para mezclar los elementos sin repetición en la selección final
function shuffleUnique(array, num) {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return Array.from(new Set(shuffled)).slice(0, num);
}

// Función para obtener el número de imágenes basado en la altura de la pantalla
const getNumberOfImages = () => {
  const koa = 3;
  const initialNumber = 11;
  const height = window.innerHeight;
  return height > 1000
    ? initialNumber
    : height > 600
      ? initialNumber - koa
      : initialNumber - koa * 2;
};

export default function AdvertisingSpaceBrokers() {
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
  }, []); // No depende de cambios específicos, solo se configura una vez

  return (
    <aside
      className='sticky top-32 md:col-span-1  max-h-full border-0 bg-gradient-to-t shadow-xl rounded-2xl hidden lg:block'
      style={{ height: 'fit-content' }}
    >
      <p className='font-semibold text-2xl text-white text-center pt-2 -mb-2'>Know our</p>
      <p className='uppercase text-xs text-slate-400 leading-5 tracking-widest text-center'>
        partners
      </p>

      <div className='flex flex-col items-center justify-between space-y-4 overflow-hidden mt-10'>
        {visibleImages.map((fileName, index) => (
          <img
            key={index}
            className='smooth_entry transition-opacity duration-2000 opacity-80 rounded-md m-0 w-3/4 h-24 md:h-24 lg:h-fit'
            src={`${basePath}${fileName}`}
            alt={`Logo of ${fileName.split('.')[0]}`} // Descripción mejorada para accesibilidad
            loading='lazy' // Carga diferida para optimizar el rendimiento
          />
        ))}
      </div>

    </aside>
  );
}
