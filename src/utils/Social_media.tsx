import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTelegram,
  FaTiktok,
  FaWhatsapp,
} from 'react-icons/fa';
import { FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { generateWhatsAppLink } from '../services/generateWhatsAppLink';
import { OFFICIAL_TELEGRAM } from './GlobalVars';

export function social_media(_size = 35) {
  return [
    {
      name: 'WhatsApp',
      component: <FaWhatsapp className='text-[20px]' />,
      link: generateWhatsAppLink('+447494208836', 'I want to know more about TradeTab'),
    },
    {
      name: 'X',
      component: <FaXTwitter className='text-[20px]' />,
      link: 'https://x.com/Tradetabx',
    },
    {
      name: 'Telegram',
      component: <FaTelegram className='text-[20px]' />,
      link: OFFICIAL_TELEGRAM,
    },
    {
      name: 'Instagram',
      component: <FaInstagram className='text-[20px]' />,
      link: 'https://www.instagram.com/tradetab/',
    },
    {
      name: 'Facebook',
      component: <FaFacebook className='text-[20px]' />,
      link: 'https://www.facebook.com/profile.php?id=61564021491445',
    },
    {
      name: 'Facebook',
      component: <FaTiktok className='text-[20px]' />,
      link: 'https://www.tiktok.com/@tradetab?_t=8rxuktkPxVH&_r=1',
    },
    {
      name: 'LinkedIn',
      component: <FaLinkedinIn className='text-[20px]' />,
      link: 'https://www.linkedin.com/company/tradetabsoftware/about/',
    },
    {
      name: 'Youtube',
      component: <FaYoutube className='text-[20px]' />,
      link: 'https://www.youtube.com/@TradeTabchannel',
    },
  ];
}
