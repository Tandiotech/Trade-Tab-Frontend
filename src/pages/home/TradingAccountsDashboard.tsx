import { useEffect, useState } from 'react';
import ContainerAccounts from '../../component/listTab/ContainerAccounts.jsx';
import { useMTAccounts } from '../../context/accounts/MTAccountsContext.tsx';
import { useProgressBar } from '../../context/ProgressBarContext.tsx';
import ConnectAccountInvitation from '@/component/ConnectAccountInvitation.tsx';

function TradingAccountsDashboard() {
  const { refreshAccounts, accounts, loadingAccounts } = useMTAccounts(); // Removed accountsLoading

  // Usar el contexto del progreso para los estados globales de sincronización y creación
  const {
    accountIsFullySync,
    newAccountID,
    // setNewAccountID,
    setAccountIsFullySync,
    setAccountIsBeenDeploying,
  } = useProgressBar();

  const [isModalOpenedOnce, setIsModalOpenedOnce] = useState(false); // Estado para saber si el modal ya fue abierto

  useEffect(() => {
    // REMOVED: Polling replaced by event-driven refresh via JOB_DONE → refreshAccounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, isModalOpenedOnce]);

  // Maneja el estado después de la creación exitosa de una cuenta
  useEffect(() => {
    if (accountIsFullySync) {
      setAccountIsBeenDeploying(false);
      setTimeout(() => {
        setAccountIsFullySync(false);
        refreshAccounts(); // Refrescar las cuentas cuando la cuenta esté completamente sincronizada
      }, 1500);
    }
  }, [accountIsFullySync, setAccountIsBeenDeploying, setAccountIsFullySync, refreshAccounts]);

  return (
    <main className='w-full px-2 pb-12 lg:pb-[4.3rem] pt-[10px] sm:pt-[1px] xl:px-3 min-h-screen relative'>
      {/* Accounts Table */}
      <div className='2xl:flex 2xl:space-x-[48px]'>
        <section className='mb-6 2xl:mb-0 2xl:flex-1'>
          <ContainerAccounts newAccountID={newAccountID} accountsLoading={loadingAccounts} />
        </section>
      </div>

      {/* Connect account invitation */}
      <ConnectAccountInvitation handleActive={accounts.length == 0} />
    </main>
  );
}

export default TradingAccountsDashboard;
