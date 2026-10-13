import { useState } from 'react';
import { RUTE_CREATE_WITHDRAWAL_PLAN } from '../../../utils/Rutes.js';
import { toast } from 'react-toastify';
import { useMTAccounts } from '../../../context/accounts/MTAccountsContext.tsx';
import { useJournalContext } from '../../../context/JournalProvider.tsx';
import { http } from '../../../utils/http_request.tsx';
import { SeparadorDecimal } from '../../../utils/SeparadorDecimal.tsx';

const formatDateElegantly = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const ConfirmWithdrawalModal = ({
  onClose,
  date_selected,
}: {
  onClose: () => void;
  date_selected: string;
}) => {
  const { currentAccount } = useMTAccounts();
  const [amount, setAmount] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const { setWithdrawalDate } = useJournalContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    const numericalValue = parseFloat(rawValue) || '';
    setAmount(numericalValue);
  };

  const handleWithdrawal = async () => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid withdrawal amount');
      return;
    }

    setIsLoading(true);
    try {
      const response = await http.post(`${RUTE_CREATE_WITHDRAWAL_PLAN}`, {
        account: currentAccount?.external_id,
        amount: parseFloat(amount.toString().replace(/,/g, '')),
        withdrawalDate: date_selected,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success(response.data.message);
        setWithdrawalDate(0);
        setAmount('');
        onClose();
      } else {
        toast.error('Failed to create withdrawal plan');
      }
    } catch (error) {
      console.error('Error creating withdrawal plan:', error);
      toast.error('An error occurred while trying to create the withdrawal plan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className='text-lg font-semibold text-[var(--tt-fg-0)]'>Plan withdrawal</h2>
      <p className='mt-1 text-sm text-[var(--tt-fg-2)]'>
        Confirm withdrawal for {formatDateElegantly(date_selected)}
      </p>

      <label className='mt-5 block text-xs font-semibold uppercase tracking-wide text-[var(--tt-fg-3)]'>
        Amount
      </label>
      <input
        type='text'
        inputMode='decimal'
        placeholder='0.00'
        value={amount !== '' ? SeparadorDecimal(amount) : ''}
        onChange={handleChange}
        className='mt-1.5 w-full rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] px-3 py-2.5 text-center tt-mono text-sm text-[var(--tt-fg-0)] placeholder:text-[var(--tt-fg-3)] focus:border-[var(--tt-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--tt-brand)]'
      />

      <div className='mt-6 flex gap-2'>
        <button
          type='button'
          className='tt-btn tt-btn-ghost flex-1 justify-center'
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type='button'
          className={`tt-btn tt-btn-primary flex-1 justify-center ${isLoading ? 'cursor-not-allowed opacity-60' : ''}`}
          onClick={handleWithdrawal}
          disabled={isLoading}
        >
          {isLoading ? 'Processing…' : 'Confirm'}
        </button>
      </div>
    </div>
  );
};

export default ConfirmWithdrawalModal;
