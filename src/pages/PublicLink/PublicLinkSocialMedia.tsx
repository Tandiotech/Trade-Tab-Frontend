import { FaInstagram, FaTelegram, FaTiktok, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { FaDiscord, FaWhatsapp } from 'react-icons/fa';
export default function PublicLinkSocialMedia({ socialMedia, editMode, setSocialMedia, compact = false }: any) {
  const [localSocialMedia, setLocalSocialMedia] = useState(socialMedia);
  useEffect(() => {
    setLocalSocialMedia(socialMedia);
  }, [socialMedia]);
  // Lista de redes sociales con sus iconos y claves en el modelo
  const Links_social_media = [
    {
      icon: <FaXTwitter size={30} />,
      key: 'twitter.com',
      link: localSocialMedia?.twitter || '',
    },
    {
      icon: <FaInstagram size={30} />,
      key: 'instagram.com',
      link: localSocialMedia?.instagram || '',
    },
    {
      icon: <FaYoutube size={30} />,
      key: 'youtube.com',
      link: localSocialMedia?.youtube || '',
    },
    {
      icon: <FaTelegram size={30} />,
      key: 't.me',
      link: localSocialMedia?.telegram || '',
    },
    {
      icon: <FaTiktok size={30} />,
      key: 'tiktok.com',
      link: localSocialMedia?.tiktok || '',
    },
    {
      icon: <FaDiscord size={30} />,
      key: 'discord.gg',
      link: localSocialMedia?.discord || '',
    },
    {
      icon: <FaWhatsapp size={30} />,
      key: 'wa.me',
      link: localSocialMedia?.whatsapp || '',
    },
  ];
  // Manejo de cambio en los inputs de edición
  const handleInputChange = (key: string, value: string) => {
    const updatedSocialMedia = { ...localSocialMedia, [key]: value };
    setLocalSocialMedia(updatedSocialMedia);
    setSocialMedia(updatedSocialMedia);
  };
  // Mostrar todas las redes sociales en modo de edición; solo las activas en modo de visualización
  const displayedLinks = editMode
    ? Links_social_media
    : Links_social_media.filter(item => item.link);


    // Asegura que el link tenga el formato correcto y completo para abrir
const formatLink = (item: any) => {
  const raw = item.link.trim();

  if (!raw) return '#';

  // Ya tiene protocolo
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;

  // Normaliza según plataforma
  if (item.key.includes('twitter.com')) return `https://twitter.com/${raw.replace(/^@/, '')}`;
  if (item.key.includes('instagram.com')) return `https://instagram.com/${raw.replace(/^@/, '')}`;
  if (item.key.includes('youtube.com')) return `https://youtube.com/${raw}`;
  if (item.key.includes('t.me')) return `https://t.me/${raw.replace(/^@/, '')}`;
  if (item.key.includes('tiktok.com')) return `https://tiktok.com/@${raw.replace(/^@/, '')}`;
  if (item.key.includes('discord.gg')) return `https://discord.gg/${raw}`;
  if (item.key.includes('wa.me')) return `https://wa.me/${raw.replace(/[^0-9]/g, '')}`; // Solo números

  // Fallback
  return `https://${item.key}/${raw}`;
};

  // Modo compacto para el header
  if (compact) {
    // Crear versiones compactas de los iconos
    const compactIcons: any = {
      'twitter.com': <FaXTwitter size={16} />,
      'instagram.com': <FaInstagram size={16} />,
      'youtube.com': <FaYoutube size={16} />,
      't.me': <FaTelegram size={16} />,
      'tiktok.com': <FaTiktok size={16} />,
      'discord.gg': <FaDiscord size={16} />,
      'wa.me': <FaWhatsapp size={16} />,
    };
    
    return (
      <div className='flex gap-1.5'>
        {displayedLinks.map((item, index) => (
          <a
            key={index}
            target='_blank'
            rel='noopener noreferrer'
            href={formatLink(item)}
            className='text-white/80 hover:text-white hover:scale-110 transition-all duration-200'
            title={item.key}
          >
            {compactIcons[item.key]}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1'>
      {!editMode && <div className='col-span-2'></div>} {/* Dejar una columna vacía para margen */}
      <div className='col-span-6 w-full h-full mt-4 flex flex-col text-white'>
        {displayedLinks.map((item, index) => (
          <div key={index} className='grid grid-cols-[30px_1fr] my-1 gap-3 items-center'>
            {/* Columna fija para los íconos */}
            <div className='flex justify-center'>{item.icon}</div>
            {/* Columna flexible para el texto o input */}
            <div className='flex items-start'>
              {editMode ? (
                <input
                  type='text'
                  value={item.link}
                  onChange={e => handleInputChange(item.key, e.target.value)}
                  placeholder={`Enter your ${item.key} link`}
                  className='w-full p-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-teal-500 animate-glow'
                />
              ) : (
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  // href={`https://${item.key}/${item.key === 'instagram' ? item.link.replace(/^@/, '') : item.link}`}
                  // href={`${item.link}`}
                  href={formatLink(item)}
                  className='hover:text-teal-500'
                >
                  {item.link}
                  {/* {item.key} */}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
