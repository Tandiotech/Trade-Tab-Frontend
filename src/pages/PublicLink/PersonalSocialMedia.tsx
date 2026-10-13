import { FaWhatsapp } from 'react-icons/fa';
import {
  FaDiscord,
  FaInstagram,
  FaTelegram,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';

const socialMediaFields = [
  { name: 'instagram', label: 'Instagram', icon: FaInstagram },
  { name: 'telegram', label: 'Telegram', icon: FaTelegram },
  { name: 'twitter', label: 'Twitter', icon: FaXTwitter },
  { name: 'tiktok', label: 'TikTok', icon: FaTiktok },
  { name: 'youtube', label: 'YouTube', icon: FaYoutube },
  { name: 'discord', label: 'Discord', icon: FaDiscord },
  { name: 'whatsapp', label: 'Whatsapp', icon: FaWhatsapp },
];

export default function PersonalSocialMedia({ newData, handleChange }: any) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
      {socialMediaFields.map(field => (
        <div key={field.name} className='flex flex-col gap-2'>
          <label
            htmlFor={field.name}
            className='text-base text-gray-300 font-medium flex justify-center items-center'
          >
            {field.label} <field.icon className='ml-2' />
          </label>
          <input
            type='text'
            name={field.name}
            value={newData[field.name] || ''}
            onChange={e => handleChange(field.name, e.target.value)}
            className='bg-gray-700 text-gray-200 p-4 rounded-lg h-11 border border-gray-600 focus:border focus:border-success-300 focus:ring-0'
          />
        </div>
      ))}
    </div>
  );
}
