import useSocket from './useSocket';
import { http } from '../utils/http_request';
import { RUTE_CREATE_ACCOUNT, RUTE_GET_BROKER_BY_NAME } from '../utils/Rutes';
import getUser from '../utils/getUser';
import { useProgressBar } from '@/context/ProgressBarContext';
import { useAccountState } from '@/context/accounts/useAccountState';
import { useNotifications } from '@/context/NotificationContext';
import { toast } from 'react-toastify';

// Type for account data passed directly
type AccountData = {
  accountNumber: string;
  accountName: string;
  accountType: string;
  selectedServer: string;
  password: string;
};

export type ConnectToMetaApiOptions = {
  /**
   * Defer closing the modal until MetaApi account exists and deployment is about to start
   * (then same as default: modal closes + global deploy banner).
   */
  deferModalClose?: boolean;
};

export default function useCreateAccountMetaApi() {
  const accountState = useAccountState();
  const {
    setAccountCreationLoading,
    closeModal,
    setHandleActive,
    setFormErrors,
    setErrorModalMessage,
  } = accountState;

  const { addNotification, updateNotification } = useNotifications();

  const { emitSyncAccount } = useSocket();
  const { setAccountIsBeenDeploying, setNewAccountID, setProgress, setProgressMessage } =
    useProgressBar();

  const logError = async (
    errorMessage: string,
    error: any,
    errorType = 'UnknownError',
    selectedServer?: string
  ) => {
    const payload = {
      level: 'error',
      route: 'mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts',
      requestData: { selectedServer: selectedServer || accountState.selectedServer },
      accountId: getUser?._id || null,
      message: errorMessage,
      statusCode: 517,
      errorType,
      errorDetails: error.message || error.toString(),
    };

    try {
      await http.post('/admin/logs', payload);
    } catch (logErr) {
      console.error('Logging error:', logErr);
    }
  };

  const handleMetaApiError = async (error: any) => {
    // Detectar el formato del error (Axios o nativo MetaApi)
    const meta = error?.response?.data || error || {};
    const metaMessage = meta.message || error.message || 'Unknown MetaApi error';
    const metaCode = meta?.details?.code || null;

    // Definir mapa de errores conocidos
    const errorMap = [
      {
        phrase: 'password and server name are correct',
        response: 'Invalid login credentials. Please double-check your information.',
        code: 'wrongPassword',
      },
      {
        phrase: 'Invalid account',
        response: 'This account appears to be inactive or unavailable.',
        code: 'accountDisabled',
      },
      {
        phrase: 'TooManyRequestsError',
        response: 'Too many connection attempts. Please try again in a few minutes.',
        code: 'tooManyRequests',
      },
      {
        phrase: 'E_RESOURCE_SLOTS',
        response:
          'Your account could not be added at the moment. Please contact support for assistance.',
        code: 'E_RESOURCE_SLOTS',
      },
      {
        phrase: 'Account resource slots should be equal or above estimated',
        response:
          'Your account could not be added at the moment. Please contact support for assistance.',
        code: 'E_RESOURCE_SLOTS',
      },
    ];

    // Buscar coincidencia por texto o código
    const matchedError = errorMap.find(
      e => metaMessage?.includes(e.phrase) || metaCode === e.code || meta?.error === e.code
    );

    const userMessage = matchedError
      ? matchedError.response
      : 'Unknown error. Please check your credentials or contact support.';

    const errorCode = matchedError ? matchedError.code : 'unknownError';

    // 🔔 Mostrar toast visible siempre
    try {
      toast.error(userMessage, {
        autoClose: 8000,
        position: 'bottom-right',
        theme: 'colored',
      });
    } catch {
      console.error('❌ [TOAST FALLBACK]', userMessage);
    }

    // 🧩 Cerrar el modal **solo si es error de recursos**
    if (errorCode === 'E_RESOURCE_SLOTS') {
      setHandleActive(false);
    }

    // Registrar en backend
    await logError(userMessage, error, matchedError ? 'ValidationError' : 'UnknownError');

    // Marcar errores en formulario
    setFormErrors((prev: any) => ({
      ...prev,
      password:
        errorCode === 'wrongPassword' || errorCode === 'unknownError'
          ? 'Error: contraseña incorrecta o cuenta inválida.'
          : '',
      accountNumber:
        errorCode === 'tooManyRequests' || errorCode === 'unknownError'
          ? 'Error: cuenta incorrecta o bloqueada.'
          : '',
      selectedServer: errorCode === 'accountDisabled' ? 'Cuenta deshabilitada.' : '',
    }));

    setErrorModalMessage(userMessage);
  };

  // Account creation runs on the backend (it holds the MetaApi token); E_RESOURCE_SLOTS retry is handled there too.
  const createMTAccount = async (accountData: AccountData) => {
    const { accountType, accountNumber, password, selectedServer, accountName } = accountData;
    try {
      const res = await http.post('/account/metaapi/create', {
        accountNumber,
        accountType,
        password,
        selectedServer,
        accountName,
      });
      return res.data.account as { id: string; state: string };
    } catch (error: any) {
      setAccountIsBeenDeploying(false); // Detener la barra de progreso
      await handleMetaApiError(error);
      toast.error('Failed to create MetaTrader account via MetaApi.');
      return null;
    }
  };

  const backupAccountToBackend = async (
    metaAccountId: string,
    accountData: AccountData,
    notificationId?: string
  ): Promise<{ _id: string } | undefined> => {
    try {
      const { accountName, accountNumber, password, accountType, selectedServer } = accountData;
      const res = await http.post(RUTE_CREATE_ACCOUNT, {
        account_name: `${getUser.userName}${accountName}`,
        name: accountName,
        account_number: accountNumber.trim(),
        password: password.trim(),
        mt_version: parseInt(accountType),
        broker_server: selectedServer.trim(),
        // Backend createAccount expects mt_account_id (MetaApi account id)
        mt_account_id: metaAccountId,
        external_id: metaAccountId,
      });

      // Pass the notification ID to emitSyncAccount so it updates the same notification
      emitSyncAccount(res.data.account, notificationId);

      setNewAccountID(res.data.account);
      return res.data.account as { _id: string };
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'An error occurred while creating the account.';

      await logError(message, error, 'BackendCreationError', accountData.selectedServer);
      setErrorModalMessage(message);
      setAccountIsBeenDeploying(false); // Detener la barra de progreso

      // Update notification to error if backend creation fails
      if (notificationId) {
        updateNotification(notificationId, {
          type: 'error',
          status: 'error',
          title: '❌ Connection Failed',
          message: message,
          progress: 100,
        });
      }
      return undefined;
    }
  };

  // Main function
  const connectToMetaApi = async (
    accountData?: AccountData,
    opts?: ConnectToMetaApiOptions
  ): Promise<string | undefined> => {
    setAccountCreationLoading(true);
    setFormErrors({});
    setErrorModalMessage(null);
    setProgress(0);
    setProgressMessage('Initializing connection...');

    // Use passed data if available, otherwise fall back to context
    const data = accountData || {
      password: accountState.password,
      accountNumber: accountState.accountNumber,
      selectedServer: accountState.selectedServer,
      accountName: accountState.accountName,
      accountType: accountState.accountType,
    };

    const { password, accountNumber, selectedServer, accountName, accountType } = data;
    // const cleanedPassword = (password ?? '').trim();

    const validateInputs = () => {
      const errors: Record<string, string> = {};

      if (!password.trim()) errors.password = 'Password cannot be empty.';
      if (!/^\d+$/.test(accountNumber.trim()))
        errors.accountNumber = 'Account number must be numeric.';
      if (!selectedServer.trim()) errors.selectedServer = 'Server selection is required.';

      return errors;
    };

    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length) {
      setFormErrors(validationErrors);
      setAccountCreationLoading(false);
      return undefined;
    }

    // 🚀 INSTANT FEEDBACK: Close modal and show progress bar immediately (unless in-modal flow)
    if (!opts?.deferModalClose) {
      setHandleActive(false);
      setAccountIsBeenDeploying(true);
    }
    setProgress(3);
    setProgressMessage('Initializing connection...');

    // Create ONE notification that will track the entire connection process
    let notificationId: string | undefined;

    try {
      notificationId = addNotification({
        type: 'info',
        title: '🔄 Connecting Account',
        message: `Connecting ${accountName || accountNumber} to ${selectedServer}... This may take a few minutes.`,
        status: 'connecting',
        progress: 10,
        accountName,
        accountNumber,
        accountType,
        server: selectedServer,
        autoClose: false,
      });

      setProgress(8);
      setProgressMessage('Creating MetaTrader account...');
      const newAccount: any = await createMTAccount(data);
      if (!newAccount) {

        setProgress(0);
        setProgressMessage('Connection failed. Please try again.');
        // Update notification to error if account creation fails
        updateNotification(notificationId, {
          type: 'error',
          status: 'error',
          title: '❌ Connection Failed',
          message: 'Failed to create account. Please check your credentials and try again.',
          progress: 100,
        });
        setAccountIsBeenDeploying(false); // Stop progress bar
        return undefined;
      }

      setProgress(18);
      setProgressMessage('Account created successfully!');

      // Update notification progress
      updateNotification(notificationId, {
        progress: 30,
        message: `Deploying ${accountName || accountNumber}...`,
      });

      setProgress(22);
      setProgressMessage('Verifying broker information...');
      // await http.post(RUTE_GET_BROKER_BY_NAME, {
      //   name: newAccount._data.server,
      //   mt_version: newAccount._data.version,
      // });

      // setAccountIsBeenDeploying(true); // Already set
      // if (newAccount._data.state === 'DEPLOYING') {
      //   setHandleActive(false); // Already closed
      // }

      if (newAccount.state !== 'DEPLOYED') {
        if (opts?.deferModalClose) {
          setHandleActive(false);
          setAccountIsBeenDeploying(true);
        }
        setProgress(28);
        setProgressMessage('Deploying account to server...');
        // The backend deploys and waits until the account is deployed.
        await http.post(`/account/metaapi/${newAccount.id}/deploy`);
        setProgress(38);
        setProgressMessage('Waiting for deployment to complete...');
        setProgress(48);
        setProgressMessage('Deployment completed!');
      } else {
        if (opts?.deferModalClose) {
          setHandleActive(false);
          setAccountIsBeenDeploying(true);
        }
        setProgress(48);
        setProgressMessage('Account already deployed!');
      }

      // Update notification progress before sync
      updateNotification(notificationId, {
        progress: 50,
        message: `Syncing ${accountName || accountNumber}...`,
      });

      setProgress(54);
      setProgressMessage('Saving account to database...');
      const createdAccount = await backupAccountToBackend(newAccount.id, data, notificationId);

      setProgress(58);
      setProgressMessage('Synchronizing trading data...');
      return createdAccount?._id ? String(createdAccount._id) : undefined;
    } catch (error: any) {
      console.error('Account creation error:', error);
      setAccountIsBeenDeploying(false); // Stop progress bar on error
      setProgress(0);
      setProgressMessage('Connection failed. Please try again.');

      // Update notification to error if it was created
      if (notificationId) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Connection failed. Please check your credentials and try again.';
        updateNotification(notificationId, {
          type: 'error',
          status: 'error',
          title: '❌ Connection Failed',
          message: errorMessage,
          progress: 100,
        });
      }

      await handleMetaApiError(error);
      return undefined;
    } finally {
      setAccountCreationLoading(false);
    }
  };

  return {
    connectToMetaApi,
  };
}
