import { useAccountState } from '@/context/accounts/useAccountState';
import { useNotifications } from '@/context/NotificationContext';
import useCreateAccountMetaApi, { type ConnectToMetaApiOptions } from './useCreateAccountMetaApi';

// Type for account data passed directly
type AccountData = {
  accountNumber: string;
  accountName: string;
  accountType: string;
  selectedServer: string;
  password: string;
};

export default function useCreateAccount() {
  
  const accountState = useAccountState();
  const { setHandleActive, setViewPassword } = accountState;

  const isBcryptPassword = (pwd: string) => /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(pwd);

  const { connectToMetaApi } = useCreateAccountMetaApi();
  const { addNotification } = useNotifications();

  /** 🌐 Conexión manual - accepts account data directly as parameter */
  const onSubmitManual = async (password: string, accountData?: AccountData) => {
    // Use passed data if available, otherwise fall back to context
    const data = accountData || accountState;
    const { accountNumber, accountName, accountType, selectedServer } = data;

    if (isBcryptPassword(password)) {
      console.warn('⚠️ Detected bcrypt password — opening connection modal.');
      setHandleActive(true);
      setViewPassword(false);
      return;
    }
    await executeConnection(accountData);
  };

  /** 📤 Envío principal desde el formulario */
  const onSubmit = async (
    e: Event,
    connectOpts?: ConnectToMetaApiOptions
  ): Promise<string | undefined> => {
    e.preventDefault();

    return await executeConnection(undefined, connectOpts);
  };

  /** ⚙️ Lógica principal de conexión */
  const executeConnection = async (
    accountData?: AccountData,
    connectOpts?: ConnectToMetaApiOptions
  ): Promise<string | undefined> => {
    try {
      return await connectToMetaApi(accountData, connectOpts);
    } catch (error: any) {
      console.error('Connection error:', error);
      // Use passed data if available, otherwise fall back to context
      const data = accountData || accountState;
      const { accountName, accountNumber, accountType, selectedServer } = data;
      
      const errorMessage = error?.response?.data?.message || error?.message || 'Connection failed. Please check your credentials and try again.';
      
      addNotification({
        type: 'error',
        title: '❌ Connection Failed',
        message: errorMessage,
        status: 'error',
        progress: 100,
        accountName,
        accountNumber,
        accountType,
        server: selectedServer,
        error: errorMessage,
        autoClose: false,
      });
      return undefined;
    }
  };

  return { onSubmit, onSubmitManual };
}
