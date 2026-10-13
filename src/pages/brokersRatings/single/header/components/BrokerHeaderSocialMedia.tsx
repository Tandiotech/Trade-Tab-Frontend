import type { ReactNode } from 'react';
import { FaFacebook, FaLinkedinIn } from 'react-icons/fa';
import { FaInstagram, FaTelegram, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { socialMediaIcons } from '../../../../../assets/data/socialMediaIcons';

function normalizePlatformKey(key: string): string {
  return key.trim().toLowerCase().replace(/\s+/g, '');
}

/** Prefer inline icons (reliable); Wikipedia / CDN img URLs often fail as hotlinked <img> src. */
function iconForPlatform(key: string): ReactNode | null {
  const k = normalizePlatformKey(key);
  if (k === 'x' || k === 'twitter') {
    return <FaXTwitter className='text-white' size={28} aria-hidden />;
  }
  if (k === 'instagram') return <FaInstagram className='text-white' size={28} aria-hidden />;
  if (k === 'youtube') return <FaYoutube className='text-white' size={28} aria-hidden />;
  if (k === 'telegram') return <FaTelegram className='text-white' size={28} aria-hidden />;
  if (k === 'facebook') return <FaFacebook className='text-white' size={28} aria-hidden />;
  if (k === 'linkedin') {
    return <FaLinkedinIn className='text-white' size={28} aria-hidden />;
  }
  return null;
}

export default function BrokerHeaderSocialMedia({ data }: any) {
  return (
    <li className='tracking-widest flex flex-col'>
      <span className='text-[#5EEAD4] text-lg font-semibold whitespace-nowrap'>Social Media:</span>
      <div className='flex flex-wrap'>
        {data
          ? Object.entries(data).map(([key, value]: [string, any]) => {
              if (value == 'N/A' || !value) return null;
              const icon = iconForPlatform(key);
              const raw = socialMediaIcons as Record<string, string>;
              const nk = normalizePlatformKey(key);
              const imgSrc =
                raw[nk] ?? raw[key] ?? (nk === 'linkedin' ? raw.linkedIn : undefined);
              return (
                <div
                  key={key}
                  className='mr-2 flex w-fit items-center rounded-lg bg-white bg-opacity-10 p-2 shadow-xl hover:bg-opacity-20'
                >
                  <a href={value} target='_blank' rel='noopener noreferrer' className='flex items-center justify-center'>
                    {icon ?? (
                      <img
                        className='h-[30px] w-[30px] object-contain'
                        src={typeof imgSrc === 'string' ? imgSrc : undefined}
                        alt=''
                      />
                    )}
                  </a>
                </div>
              );
            })
          : null}
      </div>
    </li>
  );
}
