import { useState, useCallback, createContext, useContext, useMemo } from 'react';
import { RUTE_CREATE_ACCOUNT, RUTE_CONNECT_ACCOUNT } from '../../utils/Rutes';
import { http } from '../../utils/http_request';

const AccountCreationContext = createContext<any>({} as any);

function useAccountCreation() {
  return useContext(AccountCreationContext);
}

const AccountCreationProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadingAccountCreation, setLoadingAccountCreation] = useState(false);
  const [successAccountCreated, setSuccessAccountCreated] = useState(false);

  const createAccount = useCallback(
    async (params: {
      _accountName: string;
      _accountNumber: string;
      _password: string;
      _accountType: string;
      _selectedServerId: string;
    }) => {
      setLoadingAccountCreation(true);

      try {
        const response = await http.post(RUTE_CREATE_ACCOUNT, {
          account_name: params._accountName,
          account_number: params._accountNumber,
          password: params._password,
          mt_version: parseInt(params._accountType),
          broker_server: params._selectedServerId,
        });

        const accountCreatedId = response.data.account;
        await connnectAccountToInstance(accountCreatedId);

        if (response.data.status === 200) {
          setSuccessAccountCreated(true);
          return true;
        }
        return false;
      } catch (error: any) {
        console.error('Error al crear cuenta: ', error.message);
        return false;
      } finally {
        setLoadingAccountCreation(false);
      }
    },
    []
  );

  const connnectAccountToInstance = useCallback(async (accountCreatedId: string) => {
    try {
      await http.post(RUTE_CONNECT_ACCOUNT, { account: accountCreatedId });
    } catch (error: any) {
      console.error('Error al conectar cuenta: ', error);
    }
  }, []);

  const value = useMemo(
    () => ({
      loadingAccountCreation,
      successAccountCreated,
      createAccount,
      connnectAccountToInstance,
    }),
    [loadingAccountCreation, successAccountCreated]
  );

  return (
    <AccountCreationContext.Provider value={value}>{children}</AccountCreationContext.Provider>
  );
};

export default AccountCreationProvider;
