import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AccountStateContextProps {
  accountName: string;
  setAccountName: (name: string) => void;
  accountNumber: string;
  setAccountNumber: (number: string) => void;
  accountType: string;
  setAccountType: (type: string) => void;
  password: string;
  setPassword: (password: string) => void;
  viewPassword: boolean;
  setViewPassword: (view: boolean) => void;
  accountCreationLoading: boolean;
  setAccountCreationLoading: (loading: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedServer: string;
  setSelectedServer: (server: string) => void;
  handleActive: boolean;
  setHandleActive: (active: boolean) => void;
  closeModal: () => void;
  resetAccountState: () => void;
  formErrors: Record<string, string>;
  setFormErrors: any;
  errorModalMessage: string | null;
  setErrorModalMessage: (message: string | null) => void;
  fxeApiOnline: boolean | null;
  setFxeApiOnline: (v: boolean | null) => void;
  // New: Background connection support
  isCompactMode: boolean;
  setIsCompactMode: (compact: boolean) => void;
  quickSubmitAndClose: () => void;
}

const AccountStateContext = createContext<AccountStateContextProps | undefined>(undefined);

export const AccountStateProvider = ({ children }: { children: ReactNode }) => {
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('4'); // Default to MT4
  const [password, setPassword] = useState('');
  const [fxeApiOnline, setFxeApiOnline] = useState<boolean | null>(null);
  const [viewPassword, setViewPassword] = useState(false);
  const [accountCreationLoading, setAccountCreationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServer, setSelectedServer] = useState('');
  const [handleActive, setHandleActive] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [errorModalMessage, setErrorModalMessage] = useState<string | null>(null);
  const [isCompactMode, setIsCompactMode] = useState(false);

  // Reset account state
  const resetAccountState = () => {
    setAccountName('');
    setAccountNumber('');
    setAccountType('4');
    setPassword('');
    setSearchTerm('');
    setSelectedServer('');
  };

  // Close modal and clear state
  const closeModal = () => {
    setHandleActive(false);
    resetAccountState();
    setFormErrors({});
    setErrorModalMessage('');
  };

  // Quick submit for background connection (form validation done, just close)
  const quickSubmitAndClose = () => {
    setHandleActive(false);
    // Don't reset - let the background job handle it
  };

  // Listen for changes in errors
  useEffect(() => {
    if (errorModalMessage) {
      // alert(errorModalMessage); // Temporary: Replace with a better UI element
      // setErrorModalMessage(null);
    }
  }, [errorModalMessage]);

  // ✅ Volver a ocultar la contraseña después de 4 segundos
  useEffect(() => {
    if (viewPassword) {
      const timer = setTimeout(() => {
        setViewPassword(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [viewPassword]);

  return (
    <AccountStateContext.Provider
      value={{
        accountName,
        setAccountName,
        accountNumber,
        setAccountNumber,
        accountType,
        setAccountType,
        password,
        setPassword,
        viewPassword,
        setViewPassword,
        accountCreationLoading,
        setAccountCreationLoading,
        searchTerm,
        setSearchTerm,
        selectedServer,
        setSelectedServer,
        handleActive,
        setHandleActive,
        closeModal,
        resetAccountState,
        formErrors,
        setFormErrors,
        errorModalMessage,
        setErrorModalMessage,
        fxeApiOnline,
        setFxeApiOnline,
        isCompactMode,
        setIsCompactMode,
        quickSubmitAndClose,
      }}
    >
      {children}
    </AccountStateContext.Provider>
  );
};

// Custom hook to use the context
export const useAccountState = (): AccountStateContextProps => {
  const context = useContext(AccountStateContext);
  if (!context) {
    throw new Error('useAccountState must be used within AccountStateProvider');
  }
  return context;
};
