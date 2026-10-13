import { useEffect, useRef } from 'react';
import './WorldMap.css'; // Para estilos adicionales

const WorldMap = () => {
  const pinRefs = useRef([]);
  const mapRef = useRef(null);

  useEffect(() => {
    // IntersectionObserver para detectar cuando el mapa está en la vista
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            pinRefs.current.forEach((pin, index) => {
              const delay = index * 0.1; // Incremento de 0.1 segundos por pin
              pin.style.animationDelay = `${delay}s`;
              pin.classList.add('visible'); // Agrega clase visible para iniciar la animación
            });
            observer.unobserve(entry.target); // Deja de observar después de la animación
          }
        });
      },
      { threshold: 0.3 } // Inicia la animación cuando el 30% del mapa es visible
    );

    if (mapRef.current) {
      observer.observe(mapRef.current); // Observa el contenedor del mapa
    }

    // return () => {
    //   if (mapRef.current) {
    //     observer.disconnect();
    //   }
    // };
  }, []);

  const map_locations = [
    { city: 'New York City', country: 'USA', style: { top: '35%', left: '27%' } },
    { city: 'Mexico City', country: 'Mexico', style: { top: '45%', left: '17%' } },
    { city: 'Tokyo', country: 'Japan', style: { top: '37%', left: '90%' } },
    { city: 'London', country: 'U.K.', style: { top: '33%', left: '45%' } },
    { city: 'Melbourne', country: 'Australia', style: { top: '70%', left: '97%' } },
    { city: 'Cape Town', country: 'South Africa', style: { top: '59%', left: '55%' } },
    { city: 'Frankfurt', country: 'Germany', style: { top: '27%', left: '54%' } },
    { city: 'Madrid', country: 'Spain', style: { top: '27%', left: '48%' } },
    { city: 'Istanbul', country: 'Turkey', style: { top: '37%', left: '55%' } },
    { city: 'Tokyo', country: 'Japan', style: { top: '37%', left: '90%' } },
    { city: 'Delhi', country: 'India', style: { top: '35%', left: '72%' } },
    { city: 'Dubai', country: 'UAE', style: { top: '38%', left: '64%' } },
    { city: 'São Paulo', country: 'Brazil', style: { top: '57%', left: '32%' } },

    // Nuevas ubicaciones añadidas
    { city: 'Lagos', country: 'Nigeria', style: { top: '45%', left: '45%' } },
    // { city: 'Abuja', country: 'Nigeria', style: { top: '53%', left: '46%' } },
    { city: 'Mumbai', country: 'India', style: { top: '40%', left: '70%' } },
    { city: 'Kuala Lumpur', country: 'Malaysia', style: { top: '60%', left: '85%' } },
  ];

  return (
    <div className=''>
      <div className='justify-center mx-auto flex mb-4'>
        <div className='energy-container'>
          <img src='/assets/img/mt4_logo.png' alt='Image 1' className='image-left' />
          <div className='energy-light'></div>
          <img src='/logo_light.png' alt='Image 2' className='image-right' />
        </div>
      </div>

      <div className='map-container max-h-[calc(100vh-400px)]' ref={mapRef}>
        <img src='/assets/img/globe.png' alt='world map' className='map-image -mt-20' />

        {map_locations.map((location, index) => (
          <div
            key={index}
            className='pin'
            style={location.style}
            ref={el => (pinRefs.current[index] = el)}
          >
            <div className='pin-text text-emerald-200 text-center'>
              {location.city}
              <p className='text-xs'>{location.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldMap;
