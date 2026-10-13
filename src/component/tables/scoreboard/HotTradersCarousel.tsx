import { useEffect, useRef } from 'react';
import HotTrader from '../HotTrader';

export const HotTradersCarousel = ({ hotTraders }: any) => {
  const carouselRef = useRef(null);
  const animationRef: any = useRef(null);

  useEffect(() => {
    const container: any = carouselRef.current;
    let start: any = null;

    // Crear una referencia para detectar el cambio de carrusel
    const step = (timestamp: any) => {
      if (!start) start = timestamp;

      const scrollSpeed = 1;

      if (container) {
        // Mueve el carrusel hacia la derecha
        container.scrollLeft += scrollSpeed;

        // Si el contenedor llega al final, reajusta su posición sin salto
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [hotTraders]);

  return (
    // <div className='overflow-hidden w-full bg-gray-900 py-2'>
    <div className='overflow-hidden w-full py-2 md:mt-2 mt-14 relative'>
      <div
        className='flex w-full items-center justify-start space-x-6 overflow-x-auto no-scrollbar relative z-0'
        ref={carouselRef}
        style={{ transition: 'scroll-left 0.5s ease-out' }}
      >
        {/* Duplicar el contenido del carrusel para hacerlo infinito */}
        {[...hotTraders, ...hotTraders].map((broker: any, index: number) => (
          <HotTrader broker={broker} key={index} />
        ))}
      </div>
    </div>
  );
};
