import { useEffect } from 'react';
import AccountsSummary from '../AccountsSummary/AccountsSummary';
import Loader1 from '../loader/Loader1';
import { useProgressBar } from '../../context/ProgressBarContext';
import { useMTAccounts } from '../../context/accounts/MTAccountsContext';
import ProgressBarAccount from '../ProgressBarAccount';

function ContainerAccounts({ accountsLoading, newAccountID }) {
  const {
    setShowProgressBar,
    accountIsBeenDeploying,
    setNewAccountID,
    accountIsFullySync,
    setAccountIsBeenDeploying,
  } = useProgressBar();
  const { accounts } = useMTAccounts();

  // Mostrar u ocultar el ProgressBar según si la cuenta está siendo desplegada
  useEffect(() => {
    if (accountIsBeenDeploying) {
      setShowProgressBar(true);
      setNewAccountID(newAccountID);
    }
  }, [accountIsBeenDeploying, newAccountID, setShowProgressBar, setNewAccountID]);

  return (
    <div className='w-full rounded-2xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border bg-gradient-to-br from-slate-900/95 via-slate-900 to-slate-950 border-slate-700/50 hover:border-slate-600/80 ease-in-out duration-300 relative flex flex-col shadow-xl backdrop-blur-sm'>
      <div className='flex flex-col relative'>
        {accountsLoading ? (
          <Loader1 />
        ) : (
          <>
            <ProgressBarAccount
              accountIsBeenDeploying={accountIsBeenDeploying}
              accountIsFullySync={accountIsFullySync}
              newAccountID={newAccountID}
              setAccountIsBeenDeploying={setAccountIsBeenDeploying}
            />
            <AccountsSummary />
          </>
        )}
      </div>
    </div>
  );
}

export default ContainerAccounts;
