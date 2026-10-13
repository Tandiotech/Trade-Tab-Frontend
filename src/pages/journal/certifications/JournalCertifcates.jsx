import { useEffect, useState, useRef } from 'react';
import { detectPatterns } from './detectPatterns';
import SingleCertificate from './SingleCertificate';

export default function JournalCertificates({ trades }) {
  const [certificates, setCertificates] = useState([]);
  const scrollContainerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    if (trades && certificates.length === 0) {
      const generatedCertificates = detectPatterns(trades);
      setCertificates(generatedCertificates);
    }
  }, [trades, certificates]);

  const handleMouseDown = e => {
    isDragging.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = e => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1; // Velocidad de desplazamiento
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div id='certificates' className='my-4 md:my-8 px-4'>
      <p className='text-white font-semibold text-xl border w-fit mx-auto bg-slate-800 border-teal-500 px-8 mb-10 rounded-full text-center'>
        TradeTab Challenges
      </p>

      {/* Slider horizontal con arrastre en todas las pantallas */}
      <div
        className='flex gap-4 overflow-x-scroll no-scrollbar px-4'
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={e => handleMouseDown(e.touches[0])}
        onTouchEnd={handleMouseUp}
        onTouchMove={e => handleMouseMove(e.touches[0])}
      >
        {certificates.map((item, key) => (
          <div key={key + 145} className='flex-shrink-0 w-64'>
            <SingleCertificate {...item} />
          </div>
        ))}

        {/* Blur at the end */}
        <div
          style={{
            backgroundImage: "url('/assets/img/goals/certificate.png')",
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
          className='flex-shrink-0 w-64 blur group relative cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-lg'
        >
          <img src='/assets/img/goals/6.webp' className='h-14 mb-2' alt='future certificate' />
          <p className='text-base -mt-2 font-bold text-green-600'>1 MONTH IN A ROW</p>
          <p className='text-xs'>SUCCESS</p>
        </div>
      </div>
    </div>
  );
}
