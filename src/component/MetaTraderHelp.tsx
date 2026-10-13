import { generateWhatsAppLink } from '@/services/generateWhatsAppLink';

interface MetaTraderHelpProps {
  value: string;
  mt_version: number;
  onClose: () => void;
}

export default function MetaTraderHelp({
  value,
  mt_version,
  onClose,
}: MetaTraderHelpProps) {

  const handleRequestBroker = () => {
    const message = `Hi! I need to connect my MetaTrader ${mt_version} account but the broker server "${value}" is not available in your database. Could you please add it?`;
    
    const phoneSupport = import.meta.env.VITE_PHONE_SUPPORT;
    if (!phoneSupport) {
      console.error('[MetaTraderHelp] VITE_PHONE_SUPPORT is not set. WhatsApp link cannot be generated.');
      return;
    }
    const whatsappLink = generateWhatsAppLink(phoneSupport, message);
    
    window.open(whatsappLink, '_blank');
    onClose();
  };

  return (
    <div className='absolute top-0 left-0 w-full bg-darkblack-600 p-4 rounded-lg shadow-lg z-20'>
      <h3 className='text-white mb-3'>Broker Not Found</h3>
      <p className='text-gray-300 mb-2'>
        We couldn't find <strong>{value}</strong> in our database. 
      </p>
      <p className='text-gray-300 mb-2'>
        Contact our support team via WhatsApp to request this broker. 
        We usually add new brokers immediately, but it may take up to 24 hours.
      </p>

      <div className='flex gap-2 mt-4'>
        <button
          onClick={handleRequestBroker}
          className='bg-teal-500 hover:bg-teal-400 text-darkblack-700 px-4 py-2 rounded transition'
        >
          Contact Support
        </button>
        <button
          onClick={onClose}
          className='bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded transition'
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
