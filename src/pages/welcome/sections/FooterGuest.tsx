import GlobalModal from '../../../component/modal/GlobalModal';
import TermsAndCondition from '../../settings/terms&condition';
import { useState } from 'react';
import { social_media } from '../../../utils/Social_media';
import { useNavigate } from 'react-router-dom';

export default function FooterGuest() {
  const [termsOpen, setTermsOpen] = useState(false);
  const navigate = useNavigate();

  // Función genérica para manejar el scroll a secciones
  const handleScrollToSection = (sectionId: string) => {
    navigate('/'); // Asegúrate de estar en la página principal
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // Pequeño retraso para asegurarte de que la página cargue primero
  };

  const onScrollTopClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className='bg-black text-white relative overflow-hidden'>
      <div className='glow-circle-right '></div>
      <GlobalModal
        isActive={termsOpen}
        onClose={() => setTermsOpen(false)}
        height='h-[92vh]'
        width='w-96 lg:w-2/3'
      >
        <TermsAndCondition />
      </GlobalModal>

      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
          <ul className='flex flex-wrap justify-center gap-4 '>
            {/* <li>
              <button onClick={() => handleScrollToSection('about')}>About us</button>
            </li> */}
            <li className='hidden lg:block'>
              <button onClick={() => handleScrollToSection('whychoose')}>Features</button>
            </li>
            <li>
              <a href='/journal'>Journal</a>
            </li>
            {/* <li>
              <button onClick={() => handleScrollToSection('faq')}>FAQs</button>
            </li> */}
            <li>
              <button onClick={() => setTermsOpen(true)}>Terms & Conditions</button>
            </li>
          </ul>

          <div className='flex gap-4'>
            {social_media(35).map((item, index) => (
              <a
                key={index}
                href={item.link}
                target='_blank'
                rel='noopener noreferrer'
                className='transition-colors'
              >
                {item.component}
              </a>
            ))}
          </div>
        </div>

        <div className='flex flex-col lg:my-10 md:flex-row items-center justify-between border-t border-gray-200 mt-6 pt-4'>
          <p className='text-sm text-center md:text-left'>© 2024 TradeTab. All Rights Reserved.</p>

          <button
            onClick={onScrollTopClick}
            className='hidden lg:flex items-center text-teal-600 hover:text-white transition-colors'
          >
            <i className='fas fa-arrow-up'></i>
            <span className='ml-2'>Scroll to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
