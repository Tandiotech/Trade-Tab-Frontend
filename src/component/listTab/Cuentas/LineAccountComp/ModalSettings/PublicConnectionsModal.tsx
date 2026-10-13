import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowAltCircleLeft,
  FaRegCopy,
  FaDownload,
  FaShareAlt,
  FaQrcode,
  FaLink,
  FaGlobe,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaSpinner,
  FaTimes,
} from 'react-icons/fa';
import { Switch } from '@headlessui/react';
import { http } from '../../../../../utils/http_request';
import { RUTE_GET_PUBLIC_LINK_SINGLE, RUTE_PUBLIC_LINK_ACTIVATE } from '@/utils/Rutes';
import * as QRCode from 'qrcode';
import html2canvas from 'html2canvas';

interface PublicConnectionsModalProps {
  closeModal: () => void;
  accountId: string;
}

function PublicConnectionsModal({ closeModal, accountId }: PublicConnectionsModalProps) {
  const [user, setUser] = useState(() => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const [publicIdentifier, setPublicIdentifier] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [stats, setStats] = useState({ views: 0, shares: 0, clicks: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Load info
  const loadPublicLinkInfo = async () => {
    try {
      setLoading(true);
      const response = await http.get(`${RUTE_GET_PUBLIC_LINK_SINGLE}${accountId}`, {
        validateStatus: () => true,
      });

      if (response.status === 200) {
        const { name, isPublic } = response.data;
        setPublicIdentifier(name);
        setIsPublic(isPublic);

        if (isPublic && user?.userName) {
          const link = `${window.location.origin}/${user?.userName}/${name}`;
          setGeneratedLink(link);
          generateQRCode(link);
          setShowQR(false);
        }
      } else if (response.status === 404) {
        setIsPublic(false);
        setGeneratedLink('');
        setPublicIdentifier('');
        setMessage({ text: 'No public link found. You can create one below.', type: 'info' });
      } else {
        setMessage({ text: 'Unexpected response. Please try again later.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Failed to load public link. Please try again.', type: 'error' });
      console.error('Load public link error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await http.get(`/api/stats/${accountId}`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const currentUser = JSON.parse(userString);
      if (currentUser?.userName !== user?.userName) setUser(currentUser);
    }
    loadPublicLinkInfo();
    loadStats();
  }, []);

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setMessage({ text: 'Link copied to clipboard!', type: 'success' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage({ text: 'Failed to copy link. Please try again.', type: 'error' });
    }
  };

  const shareLink = async () => {
    if (navigator.share && generatedLink) {
      try {
        setShareLoading(true);
        await navigator.share({
          title: 'Check out my TradeTab account!',
          text: "I'm sharing my trading performance with you.",
          url: generatedLink,
        });
        setMessage({ text: 'Link shared successfully!', type: 'success' });
      } catch {
        setMessage({ text: 'Sharing failed. Try again.', type: 'error' });
      } finally {
        setShareLoading(false);
      }
    } else {
      copyLinkToClipboard();
      setMessage({ text: 'Sharing not supported. Link copied to clipboard.', type: 'info' });
    }
  };

  const generateRandomIdentifier = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPublicIdentifier(result);
  };

  const togglePublicStatus = async () => {
    if (!publicIdentifier && !isPublic) {
      setMessage({ text: 'Please provide a public identifier before enabling.', type: 'error' });
      return;
    }
    try {
      setLoading(true);
      const newStatus = !isPublic;
      const response = await http.post(RUTE_PUBLIC_LINK_ACTIVATE, {
        accountId,
        isPublic: newStatus,
        publicIdentifier,
      });
      if (response.status === 200) {
        setIsPublic(newStatus);
        setMessage({
          text: newStatus ? 'Account is now public!' : 'Account is now private.',
          type: newStatus ? 'success' : 'info',
        });
        if (newStatus && user?.userName) {
          const link = `${window.location.origin}/${user?.userName}/${publicIdentifier}`;
          setGeneratedLink(link);
          generateQRCode(link);
        } else {
          setGeneratedLink('');
          setQrCodeDataUrl('');
          setShowQR(false);
        }
      }
    } catch {
      setMessage({ text: 'Failed to update public status. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (link: string) => {
    try {
      setIsGenerating(true);
      const qrDataUrl = await QRCode.toDataURL(link, {
        width: 300,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch {
      setMessage({ text: 'Failed to generate QR code.', type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRWithLogo = async () => {
    if (qrContainerRef.current) {
      try {
        const canvas = await html2canvas(qrContainerRef.current, { backgroundColor: null });
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'QR_Code_With_Logo.png';
        link.click();
        setMessage({ text: 'QR code downloaded successfully.', type: 'success' });
      } catch {
        setMessage({ text: 'Failed to download QR code.', type: 'error' });
      }
    }
  };

  const messageColors = {
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  };

  return (
    <motion.div
      ref={modalRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='connection-modal relative w-full rounded-xl text-center transition-all h-full space-y-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6'
    >
      {/* Header */}
      <motion.div className='flex justify-between items-center py-4 border-b border-gray-700/50'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg'>
            <FaGlobe className='h-5 w-5 text-white' />
          </div>
          <div className='text-left'>
            <h2 className='text-xl font-bold text-white'>Public Link Settings</h2>
            <p className='text-sm text-gray-300'>Share your trading performance</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 rounded-full p-2 sm:p-3'
          onClick={closeModal}
        >
          <FaArrowAltCircleLeft size={24} />
        </motion.button>
      </motion.div>

      {/* Message Display */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-lg p-3 border ${messageColors[message.type]}`}
          >
            <p className='text-sm font-medium'>{message.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input + Create Section */}
      <div className='space-y-3'>
        <label className='text-sm font-medium text-gray-300 text-left block'>
          Public Identifier
        </label>
        <div className='relative'>
          <input
            type='text'
            placeholder='Enter a custom identifier'
            className='w-full bg-gray-800/50 border border-gray-600 p-3 rounded-lg text-gray-300'
            value={publicIdentifier}
            disabled={isPublic}
            onChange={e => setPublicIdentifier(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ''))}
          />
          {!isPublic && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateRandomIdentifier}
              className='absolute flex items-center gap-1 right-2 top-1  bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded-md'
            >
              <FaLink />
              Auto generate
            </motion.button>
          )}
        </div>
        <p className='text-xs text-gray-400 text-left'>
          Only letters, numbers, dots, underscores, and hyphens allowed.
        </p>
      </div>

      {/* Create / Toggle Section */}
      <div className='flex items-center justify-between bg-gray-800/30 p-4 rounded-lg border border-gray-700/50'>
        <div className='text-left'>
          <p className='text-white font-semibold'>Make Account Public</p>
          <p className='text-sm text-gray-300'>Allow others to view your trading performance</p>
        </div>
        <Switch
          checked={isPublic}
          onChange={togglePublicStatus}
          className={`${isPublic ? 'bg-green-600' : 'bg-gray-600'} relative inline-flex h-full w-11 rounded-full transition`}
        >
          <span
            className={`${isPublic ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition`}
          />
        </Switch>
      </div>

      {/* Generated link */}
      {generatedLink && (
        <div className='space-y-3'>
          <label className='text-sm text-gray-300 text-left block'>Your Public Link</label>
          <div className='flex items-center gap-2'>
            <input
              readOnly
              value={generatedLink}
              className='w-full bg-gray-800/50 border border-gray-600 p-3 rounded-lg text-gray-300'
            />
            <motion.button
              onClick={copyLinkToClipboard}
              className='bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-gray-300'
            >
              {copied ? <FaCheck /> : <FaRegCopy />}
            </motion.button>
            <motion.a
              href={generatedLink}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-green-600 hover:bg-green-500 p-3 rounded-lg text-white'
            >
              <FaEye />
            </motion.a>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default PublicConnectionsModal;
