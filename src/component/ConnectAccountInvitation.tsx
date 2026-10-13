import { useAccountState } from '@/context/accounts/useAccountState';

export default function ConnectAccountInvitation({ handleActive }: any) {
  const { setHandleActive } = useAccountState(); // Cuentas y estado de carga de cuentas

  return (
    <div
      className={`relative hidden border-teal-200 border-2 mt-3 bg-darkblack-500 sm:p-8 text-left shadow-xl transform transition-transform duration-500 ease-in-out p-6 rounded-lg w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8 
            ${handleActive ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
            `}
    >
      <div>
        <h3 className='text-xl sm:text-2xl font-semibold text-white mb-4 text-center'>
          Connect Any Metatrader account for
          <strong className='pl-1 text-teal-500'>Free</strong>
        </h3>

        <div>
          <button
            onClick={() => {
              setHandleActive(true);
            }}
            className='bg-gradient-to-t shadow-xl from-teal-500 via-teal-500 to-green-400 px-2 py-1 rounded block mx-auto text-2xl'
          >
            Connect now!
          </button>
        </div>
      </div>
    </div>
  );
}
