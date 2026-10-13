import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCreatePrediction } from '@/hook/usePredictionsDev';
import { CreatePredictionRequest, PredictionOutcome, VolatilityOutcome } from '@/types/predictions';
import GlobalModal from '../modal/GlobalModal';

interface MakeCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

const outcomeOptions: { value: PredictionOutcome; label: string; icon: string }[] = [
  { value: 'up', label: 'Up', icon: '📈' },
  { value: 'down', label: 'Down', icon: '📉' },
  { value: 'flat', label: 'Flat', icon: '➡️' },
];

const volatilityOptions: { value: VolatilityOutcome; label: string; icon: string }[] = [
  { value: 'high', label: 'High', icon: '🌪️' },
  { value: 'low', label: 'Low', icon: '😌' },
];

export default function MakeCallModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
}: MakeCallModalProps) {
  const [usdOutcome, setUsdOutcome] = useState<PredictionOutcome | null>(null);
  const [goldOutcome, setGoldOutcome] = useState<PredictionOutcome | null>(null);
  const [volatilityOutcome, setVolatilityOutcome] = useState<VolatilityOutcome | null>(null);
  const [miniPlan, setMiniPlan] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setUsdOutcome(null);
      setGoldOutcome(null);
      setVolatilityOutcome(null);
      setMiniPlan('');
    }
  }, [isOpen]);

  const createPrediction = useCreatePrediction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usdOutcome || !goldOutcome || !volatilityOutcome) {
      return;
    }

    const predictionData: CreatePredictionRequest = {
      eventId,
      prediction_outcomes: {
        usd: usdOutcome,
        gold: goldOutcome,
        vol: volatilityOutcome,
      },
      mini_plan: miniPlan.trim() || undefined,
    };

    try {
      await createPrediction.mutateAsync(predictionData);
      handleClose();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleClose = () => {
    setUsdOutcome(null);
    setGoldOutcome(null);
    setVolatilityOutcome(null);
    setMiniPlan('');
    onClose();
  };

  const isFormValid = usdOutcome && goldOutcome && volatilityOutcome;

  return (
    <GlobalModal
      isActive={isOpen}
      onClose={handleClose}
      width='w-full lg:w-2/3 max-w-2xl'
      height='h-fit max-h-[90vh]'
    >
      <div className='p-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-white'>Make a Call</h2>
            <p className='text-gray-400 mt-1'>{eventTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className='text-gray-400 hover:text-white transition-colors'
          >
            <XMarkIcon className='w-6 h-6' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* USD Prediction */}
          <div>
            <label className='block text-sm font-medium text-white mb-3'>USD Direction</label>
            <div className='grid grid-cols-3 gap-3'>
              {outcomeOptions.map(option => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => setUsdOutcome(option.value)}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-200
                    ${
                      usdOutcome === option.value
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                    }
                  `}
                >
                  <div className='text-2xl mb-1'>{option.icon}</div>
                  <div className='text-sm font-medium'>{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Gold Prediction */}
          <div>
            <label className='block text-sm font-medium text-white mb-3'>Gold Direction</label>
            <div className='grid grid-cols-3 gap-3'>
              {outcomeOptions.map(option => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => setGoldOutcome(option.value)}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-200
                    ${
                      goldOutcome === option.value
                        ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                    }
                  `}
                >
                  <div className='text-2xl mb-1'>{option.icon}</div>
                  <div className='text-sm font-medium'>{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Volatility Prediction */}
          <div>
            <label className='block text-sm font-medium text-white mb-3'>Volatility Level</label>
            <div className='grid grid-cols-2 gap-3'>
              {volatilityOptions.map(option => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => setVolatilityOutcome(option.value)}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-200
                    ${
                      volatilityOutcome === option.value
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                    }
                  `}
                >
                  <div className='text-2xl mb-1'>{option.icon}</div>
                  <div className='text-sm font-medium'>{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mini Plan */}
          <div>
            <label htmlFor='mini-plan' className='block text-sm font-medium text-white mb-2'>
              Mini Plan (Optional)
            </label>
            <textarea
              id='mini-plan'
              value={miniPlan}
              onChange={e => setMiniPlan(e.target.value)}
              placeholder='Share your reasoning or strategy...'
              className='w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none'
              rows={3}
              maxLength={500}
            />
            <div className='text-right text-xs text-gray-400 mt-1'>{miniPlan.length}/500</div>
          </div>

          {/* Submit Button */}
          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={handleClose}
              className='flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={!isFormValid || createPrediction.isPending}
              className={`
                flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200
                ${
                  isFormValid && !createPrediction.isPending
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {createPrediction.isPending ? 'Submitting...' : 'Submit Prediction'}
            </button>
          </div>
        </form>
      </div>
    </GlobalModal>
  );
}
