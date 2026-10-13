import { useState } from 'react';
import AnimatedText from '../../../component/AnimateText';

export default function SingleCertificate({ medal, name, description }) {
  // Estado para controlar si se muestra la versión ampliada del certificado
  const [isExpanded, setIsExpanded] = useState(false);

  // Función para abrir/cerrar el modal
  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <>
      <div
        style={{
          backgroundImage: "url('/assets/img/goals/certificate.png')",
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '210px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          position: 'relative', // For tooltip positioning
        }}
        className='group relative cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-lg'
      >
        {/* Display the corresponding medal */}
        <img src={medal} className='h-14 mb-2' alt='medal' />

        {/* Certificate Name */}
        <p className='text-base -mt-2 font-bold text-green-600'>{name}</p>

        {/* Tooltip Trigger Area */}
        <div className='absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          {/* Tooltip */}
          <div
            className='absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-[-70%] z-10 p-2 bg-gray-700 text-white rounded-md text-sm shadow-lg w-52 text-center'
            onClick={toggleExpand} // Click para expandir
          >
            <AnimatedText textSize='text-sm font-semibold' value={name} />
            <p className='text-gray-200'>{description}</p>
          </div>
        </div>
      </div>

      {/* Modal Fullscreen */}
      {isExpanded && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex items-center justify-center p-5'>
          <div className='relative bg-slate-800 p-5 rounded-lg shadow-lg max-w-3xl w-full'>
            {/* Botón para cerrar */}
            <button
              className='absolute top-4 right-4 text-red-500 hover:text-red-700 text-2xl font-bold'
              onClick={toggleExpand}
            >
              &times;
            </button>

            {/* Contenido del certificado ampliado */}
            <div className='flex flex-col items-center'>
              <img src={medal} className='h-24 mb-4' alt='medal' />
              <AnimatedText textSize='text-2xl font-bold' value={name} />
              <p className='mt-2 text-teal-500 text-lg text-center'>{description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
