import { useState } from 'react';
// import { CiShare2 } from 'react-icons/ci';
import PublicConnectionsModal from '../listTab/Cuentas/LineAccountComp/ModalSettings/PublicConnectionsModal';
import { CiShare2 } from 'react-icons/ci';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
// import RequestAccountSyncButton from './RequestAccountSyncButton';


interface OptionsButtonsProps {
  ACCOUNT_ID: string;
}
interface Account {
  _id?: string;
}

export default function OptionsButtons({ ACCOUNT_ID }: OptionsButtonsProps) {
  const [isPublicModalOpen, setIsPublicModalOpen] = useState<boolean>(false); // Modal para mostrar el public link
  const { currentAccount }: { currentAccount?: Account } = useMTAccounts();
  const handlePublicModalOpen = () => {
    setIsPublicModalOpen(true);
  };

  const handlePublicModalClose = () => {
    setIsPublicModalOpen(false);
  };

  return (
    <div className=''>
      <div className='flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 w-fit'>
        {/* Public link button */}
        <div
          className={`flex ${
            !ACCOUNT_ID ? 'cursor-not-allowed text-gray-600' : 'cursor-pointer text-white'
          } items-center space-x-2 border-2 text-sm md:text-base h-10 px-4 border-success-300 hover:bg-darkblack-500 duration-300 rounded-full`}
          onClick={ACCOUNT_ID ? handlePublicModalOpen : () => {}}
        >
          <span className='whitespace-nowrap'>Public link</span>
          <CiShare2 className='text-xl' />
        </div>
        
      </div>

      {/* Renderizar el modal de public link */}
      <div>
        {isPublicModalOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-slate-900 border border-teal-500 rounded-lg shadow-lg p-6 relative z-50 max-w-lg w-full'>
              <PublicConnectionsModal accountId={ACCOUNT_ID} closeModal={handlePublicModalClose} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
