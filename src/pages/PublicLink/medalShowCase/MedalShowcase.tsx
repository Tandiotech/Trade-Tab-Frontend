import { useEffect, useState } from 'react';
import { detectPatterns } from '../../journal/certifications/detectPatterns';
import AnimatedText from '../../../component/AnimateText';

export default function MedalShowcase({ trades }: { trades: any[] }) {
  const [certificates, setCertificates] = useState<any>([]);

  useEffect(() => {
    if (trades) {
      const generatedCertificates: any = detectPatterns(trades);
      setCertificates(generatedCertificates);
    }
  }, [trades]);

  return (
    <div id='certificates' className='py-2'>
      <p className='text-white py-2 text-sm font-semibold text-center'>TradeTab Challengesd</p>

      <div className='grid grid-cols-2 sm:grid-cols-2 gap-2'>
        {certificates.slice(0, 4).map((item: any, key: number) => (
          <div
            key={key}
            className='group relative cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg w-full'
          >
            {/* Contenedor compacto para la medalla - Responsive */}
            <div className='flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg border border-cyan-600/30 hover:border-cyan-500/50 transition-all duration-200'>
              {/* Medalla más pequeña - Responsive */}
              <img src={item.medal} className='h-10 w-10 sm:h-12 sm:w-12 mb-1' alt='medal' />

              {/* Nombre del certificado - Compacto y responsive */}
              <AnimatedText
                textSize='text-[0.55rem] sm:text-[0.6rem] text-center font-bold text-cyan-300 w-16 sm:w-20 overflow-x-auto leading-tight'
                value={item.name}
              />
            </div>

            {/* Tooltip compacto */}
            <div className='absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'>
              <div className='absolute min-w-[120px] top-0 left-1 transform p-2 bg-gray-800 text-white rounded-lg text-xs shadow-xl  text-center border border-cyan-600/30'>
                <div className='font-semibold text-cyan-300 mb-1'>{item.name}</div>
                <div className='text-gray-300 text-[0.75rem] leading-tight'>{item.description}</div>
                <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800'></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicador de medallas adicionales si hay más de 4 */}
      {certificates.length > 4 && (
        <div className='text-center mt-2'>
          <span className='text-xs text-cyan-300 bg-cyan-800/30 px-2 py-1 rounded-full'>
            +{certificates.length - 4} más
          </span>
        </div>
      )}
    </div>
  );
}
