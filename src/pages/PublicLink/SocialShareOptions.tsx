import { useRef, useState } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaTelegram, FaLink } from 'react-icons/fa';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

const SocialShareOptions = ({
  url,
  isOpen,
  onClose,
}: {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const shareOptions = [
    {
      name: 'Facebook',
      icon: FaFacebook,
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'text-blue-500 hover:bg-blue-500/10',
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      shareUrl: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
      color: 'text-sky-400 hover:bg-sky-400/10',
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      shareUrl: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`,
      color: 'text-blue-400 hover:bg-blue-400/10',
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      shareUrl: `https://wa.me/?text=${encodeURIComponent(url)}`,
      color: 'text-green-400 hover:bg-green-400/10',
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      shareUrl: `https://t.me/share/url?url=${encodeURIComponent(url)}`,
      color: 'text-sky-500 hover:bg-sky-500/10',
    },
  ];

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('Failed to copy link');
    }
  };

  const handleClickOutside = (e: any) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className='relative bg-gradient-to-br from-darkblack-700 via-darkblack-800 to-black border border-gray-700/40 rounded-2xl shadow-2xl p-6 w-[90%] max-w-md transition-all duration-300 transform translate-y-2 hover:translate-y-0 scale-100'
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-400 hover:text-white transition-colors'
        >
          <X className='w-5 h-5' />
        </button>

        {/* Header */}
        <h2 className='text-xl font-semibold text-white mb-6 text-center'>Share this link</h2>

        {/* Share Buttons Grid */}
        <div className='grid grid-cols-3 gap-3 mb-6'>
          {shareOptions.map(option => (
            <button
              key={option.name}
              onClick={() => handleShare(option.shareUrl)}
              className={`flex flex-col items-center justify-center gap-2 bg-gray-800/50 border border-gray-700/40 rounded-xl py-4 transition-all duration-200 hover:scale-105 hover:border-gray-500 ${option.color}`}
            >
              <option.icon size={24} />
              <span className='text-sm font-medium text-gray-300'>{option.name}</span>
            </button>
          ))}
        </div>

        {/* Copy Link */}
        <div className='flex flex-col items-center'>
          <button
            onClick={handleCopy}
            className='flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-xl hover:scale-[1.02] transition-all duration-300'
          >
            <FaLink />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          {copied && (
            <span className='mt-2 text-sm text-teal-400 transition-opacity duration-300'>
              Link copied successfully!
            </span>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SocialShareOptions;
