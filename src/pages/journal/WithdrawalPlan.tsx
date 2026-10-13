import { useState, useEffect } from 'react';
import { useJournalContext } from '@/context/JournalProvider';
import { http } from '@/utils/http_request';
import { toast } from 'react-toastify';
import { CalendarIcon, XMarkIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { SeparadorDecimal } from '@/utils/SeparadorDecimal';

interface WithdrawalPlanProps {
  currentAccount: any;
  onClose?: () => void;
}

export default function WithdrawalPlan({ currentAccount, onClose }: WithdrawalPlanProps) {
  const { withdrawalDate, setWithdrawalDate } = useJournalContext();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [existingWithdrawal, setExistingWithdrawal] = useState<any>(null);

  // Fetch existing withdrawal plan on component mount
  useEffect(() => {
    if (currentAccount?.external_id) {
      fetchExistingWithdrawal();
    }
  }, [currentAccount?.external_id]);

  const fetchExistingWithdrawal = async () => {
    try {
      const response = await http.get(`slt/withdrawal/${currentAccount?.external_id}`);
      if (response.data?.data) {
        setExistingWithdrawal(response.data.data);
        setSelectedDate(response.data.data.withdrawalDate);
        setAmount(response.data.data.amount || '');
      }
    } catch (error) {
      // No existing withdrawal plan
      setExistingWithdrawal(null);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    const numericalValue = parseFloat(rawValue) || '';
    setAmount(numericalValue);
  };

  const handleCreateWithdrawal = async () => {
    if (!selectedDate || !amount || amount <= 0) {
      toast.error('Please select a date and enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      const response = await http.post(`slt/withdrawal`, {
        account: currentAccount?.external_id,
        amount: parseFloat(amount.toString().replace(/,/g, '')),
        withdrawalDate: selectedDate,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success('Withdrawal plan created successfully! 🎯');
        setWithdrawalDate(new Date(selectedDate).getUTCDate());
        await fetchExistingWithdrawal();
      }
    } catch (error) {
      console.error('Error creating withdrawal plan:', error);
      toast.error('Failed to create withdrawal plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWithdrawal = async () => {
    if (!existingWithdrawal) return;

    setIsLoading(true);
    try {
      await http.delete(`slt/withdrawal/${currentAccount?.external_id}`);
      toast.success('Withdrawal plan removed successfully! ✅');
      setWithdrawalDate(null);
      setExistingWithdrawal(null);
      setSelectedDate('');
      setAmount('');
    } catch (error) {
      console.error('Error removing withdrawal plan:', error);
      toast.error('Failed to remove withdrawal plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-4'>
          <CalendarIcon className='h-8 w-8 text-white' />
        </div>
        <h2 className='text-2xl font-bold text-white mb-2'>Withdrawal Plan</h2>
        <p className='text-gray-400 text-sm'>Set a target date to withdraw your trading profits</p>
      </div>

      {/* Existing Withdrawal Display */}
      {existingWithdrawal && (
        <div className='bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-4'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-lg font-semibold text-green-400'>Active Withdrawal Plan</h3>
            <button
              onClick={handleDeleteWithdrawal}
              disabled={isLoading}
              className='p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-colors group'
              title='Delete withdrawal plan'
            >
              <TrashIcon className='h-4 w-4 text-red-400 group-hover:text-red-300' />
            </button>
          </div>

          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='text-gray-400'>Target Date:</span>
              <div className='text-white font-medium'>
                {formatDate(existingWithdrawal.withdrawalDate)}
              </div>
            </div>
            <div>
              <span className='text-gray-400'>Amount:</span>
              <div className='text-white font-medium'>
                ${SeparadorDecimal(existingWithdrawal.amount?.toFixed(2) || '0')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Withdrawal Plan */}
      {!existingWithdrawal && (
        <div className='space-y-4'>
          {/* Date Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>
              Select Withdrawal Date
            </label>
            <div className='relative'>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className='w-full flex items-center justify-between p-3 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-600/50 transition-colors'
              >
                <span className={selectedDate ? 'text-white' : 'text-gray-400'}>
                  {selectedDate ? formatDate(selectedDate) : 'Choose a date...'}
                </span>
                <CalendarIcon className='h-5 w-5 text-gray-400' />
              </button>

              {/* Date Picker Dropdown */}
              {showDatePicker && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto'>
                  <div className='p-3 border-b border-gray-600'>
                    <h4 className='text-sm font-medium text-gray-300 mb-2'>Next 30 Days</h4>
                  </div>
                  <div className='grid grid-cols-7 gap-1 p-3'>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className='text-xs text-gray-500 text-center py-1'>
                        {day}
                      </div>
                    ))}
                    {calendarDays.map((date, index) => {
                      const isToday = date.toDateString() === new Date().toDateString();
                      const isSelected = selectedDate === date.toISOString().split('T')[0];

                      return (
                        <button
                          key={index}
                          onClick={() => handleDateSelect(date.toISOString().split('T')[0])}
                          className={`p-2 text-xs rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-green-500 text-white'
                              : isToday
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'hover:bg-gray-600 text-gray-300'
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>
              Withdrawal Amount
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg'>
                $
              </span>
              <input
                type='text'
                placeholder='0.00'
                value={amount !== '' ? SeparadorDecimal(amount) : ''}
                onChange={handleAmountChange}
                className='w-full pl-8 pr-3 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
              />
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreateWithdrawal}
            disabled={isLoading || !selectedDate || !amount}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
              isLoading || !selectedDate || !amount
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-lg'
            }`}
          >
            {isLoading ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                Creating Plan...
              </div>
            ) : (
              <div className='flex items-center justify-center gap-2'>
                <PlusIcon className='h-5 w-5' />
                Create Withdrawal Plan
              </div>
            )}
          </button>
        </div>
      )}

      {/* Info Section */}
      <div className='bg-gray-700/30 rounded-lg p-4'>
        <h4 className='text-sm font-medium text-gray-300 mb-2'>💡 How it works</h4>
        <ul className='text-xs text-gray-400 space-y-1'>
          <li>• Set a target date for profit withdrawal</li>
          <li>• Track your progress towards your goal</li>
          <li>• Stay motivated with a clear financial target</li>
          <li>• Modify or cancel your plan anytime</li>
        </ul>
      </div>

      {/* Close Button */}
      {onClose && (
        <div className='text-center pt-4'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-400 hover:text-white transition-colors'
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
