import { useState, useEffect } from 'react';
import AnimatedText from '@/component/AnimateText';
import { isLikelyAccountNumber } from '@/utils/isLikelyAccountNumber';
import { http } from '@/utils/http_request';

interface AccountNumberInputProps {
  accountNumber: string;
  setAccountNumber: (val: string) => void;
  hasError?: boolean;
  formError?: string;
  setAccountExists?: (exists: boolean) => void;
  isCompactMode?: boolean;
}

export default function AccountNumberInput({
  accountNumber,
  setAccountNumber,
  hasError = false,
  formError,
  setAccountExists,
  isCompactMode = false,
}: AccountNumberInputProps) {
  const [checking, setChecking] = useState(false);
  const [exists, setExists] = useState<boolean | null>(null);
  const [ownerName, setOwnerName] = useState<string | null>(null);

  const isLikelyValid = isLikelyAccountNumber(accountNumber);

  /**
   * Limpia caracteres no numéricos
   */
  const onChangeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = event.target.value.replace(/\D/g, '');
    setAccountNumber(onlyDigits);
  };

  useEffect(() => {
    if (!accountNumber || accountNumber.length < 6) {
      setExists(null);
      setAccountExists?.(false);
      setOwnerName(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (isCompactMode) return;
      try {
        setChecking(true);
        const res = await http.get(`/account/check?accountNumber=${accountNumber}`, {
          signal: controller.signal,
        });

        const alreadyExists = res.data?.exists === true;
        setExists(alreadyExists);
        setAccountExists?.(alreadyExists);
        setOwnerName(res.data?.ownerName ?? null);
      } catch (error) {
        console.error('Error checking account:', error);
      } finally {
        setChecking(false);
      }
    }, 600); // debounce 600ms

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [accountNumber]);

  return (

    <div className='mt-2'>
      <label className='text-[11px] font-medium text-gray-400 tracking-wider uppercase flex items-center gap-1.5 mb-2'>
        Account Number
      </label>

      <input
        type='text'
        value={accountNumber}
        onChange={onChangeNumber}
        placeholder='e.g. 12345678'
        className={`border rounded-lg bg-darkblack-600 text-white p-3 w-full text-[13px] font-mono placeholder:text-gray-500 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 ${hasError ? 'border-red-500/50 focus:border-red-500' : isLikelyValid ? 'border-teal-500/50 focus:border-teal-500' : 'border-gray-700/50 focus:border-teal-500'}`}
        autoComplete='off'
        name='mt-account-number'
        data-form-type='other'
        data-lpignore='true'
        data-1p-ignore='true'
      />

      {/* Estado de checking */}
      {checking && <p className='text-[11px] text-gray-400 mt-1.5'>Checking account...</p>}

      {/* Advertencia de formato inválido */}
      {!checking && !exists && accountNumber.length > 0 && !isLikelyValid && (
        <p className='text-[11px] text-yellow-400 mt-1.5'>
          This account number may be invalid. Please check again.
        </p>
      )}

      {/* Error general del formulario */}
      {formError && (
        <div className='mt-1'>
          <AnimatedText
            value={formError}
            fromColor='from-red-400'
            toColor='to-red-600'
            textSize='text-[11px]'
          />
        </div>
      )}
    </div>
  );
}
