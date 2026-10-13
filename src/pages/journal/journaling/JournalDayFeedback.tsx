import { useState, useEffect } from 'react';
import { RUTE_POST_EMOTIONAL } from '../../../utils/Rutes.js';
import { toast } from 'react-toastify';
import { useMTAccounts } from '../../../context/accounts/MTAccountsContext.tsx';
import { useJournalContext } from '../../../context/JournalProvider.js';
import { http } from '../../../utils/http_request.tsx';
import { FeedBackTrackerProps } from '../../../component/interfaces/intefaces.ts';
import EnergyLevel from './components/EnergyLevel.tsx';

const feelingOptions = [
  { id: 'confident', label: 'Confident', emoji: '😊' },
  { id: 'focused', label: 'Focused', emoji: '🎯' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'excited', label: 'Excited', emoji: '🚀' },
  { id: 'neutral', label: 'Neutral', emoji: '😐' },
  { id: 'frustrated', label: 'Frustrated', emoji: '😤' },
  { id: 'anxious', label: 'Anxious', emoji: '😰' },
  { id: 'other', label: 'Other', emoji: '💭' },
];

const tradingStyles = [
  { id: 'followed_plan', label: 'Followed my plan' },
  { id: 'overtraded', label: 'Overtraded' },
  { id: 'good_entry_poor_exit', label: 'Good entry, poor exit' },
];

const tradingFeedbackOptions = [
  { id: 'enterTooEarly', label: 'Entered too early' },
  { id: 'ignoringStrategy', label: 'Ignored strategy' },
  { id: 'lackOfDiscipline', label: 'Lack of discipline' },
  { id: 'overtrading', label: 'Overtrading' },
  { id: 'revengeTrading', label: 'Revenge trading' },
  { id: 'other', label: 'Other issues' },
];

const energyLevels = [
  { level: 1, emoji: '😞', label: 'Low' },
  { level: 2, emoji: '😐', label: 'Medium' },
  { level: 3, emoji: '😊', label: 'High' },
];

const JournalDayFeedback: React.FC<FeedBackTrackerProps> = ({ onClose, date_selected }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentAccount } = useMTAccounts();
  const [selectedFeeling, setSelectedFeeling] = useState('');
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [selectedTradingStyle, setSelectedTradingStyle] = useState('');
  const [customText, setCustomText] = useState('');
  const [showTextarea, setShowTextarea] = useState(false);
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const { emotional, setEmotional } = useJournalContext();

  const fetchEmotions = async () => {
    setSelectedFeeling('');
    setEnergyLevel(3);
    setSelectedTradingStyle('');
    setCustomText('');
    setAdditionalFeedback('');
    setShowTextarea(false);
    setEmotional({});
    try {
      const res = await http.get(`emotional/account/${currentAccount._id}`, {
        params: { date: new Date(date_selected)?.toISOString() },
      });
      if (res.data.data) {
        setEmotional(res.data.data);
        setSelectedFeeling(res?.data?.data?.selectedFeeling || '');
        setEnergyLevel(res?.data?.data?.energyLevel || 3);
        setSelectedTradingStyle(res?.data?.data?.selectedTradingStyle || '');
        setCustomText(res?.data?.data?.customText || '');
        setAdditionalFeedback(res?.data?.data?.additionalFeedback || '');
        setShowTextarea(!!res?.data?.data?.additionalFeedback);
      }
    } catch (e) {
      console.error('Error fetching emotions:', e);
    }
  };

  useEffect(() => {
    if (date_selected) {
      fetchEmotions();
    }
  }, [currentAccount?._id, date_selected]);

  const handleFeelingSelect = (feelingId: string) => {
    setSelectedFeeling(feelingId);
    if (feelingId === 'other') {
      setShowTextarea(true);
    } else {
      setShowTextarea(false);
      setAdditionalFeedback('');
    }
  };

  const handleTradingFeedbackChange = (optionId: string) => {
    setEmotional((prev: Record<string, boolean>) => ({
      ...prev,
      [optionId]: !prev[optionId],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('account', currentAccount._id);
    formData.append('date', new Date(date_selected).toISOString());
    formData.append('selectedFeeling', selectedFeeling);
    formData.append('energyLevel', energyLevel.toString());
    formData.append('selectedTradingStyle', selectedTradingStyle);
    formData.append('customText', customText);
    formData.append('additionalFeedback', showTextarea ? additionalFeedback : '');

    Object.keys(emotional).forEach(key => {
      if (emotional[key]) {
        formData.append(key, 'true');
      }
    });

    try {
      const res = await http.post(RUTE_POST_EMOTIONAL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res) {
        toast.success('Journal entry saved');
        fetchEmotions();
        onClose();
      }
    } catch (e) {
      console.error('Error saving journal entry: ', e);
      toast.error('Could not save your entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h3 className='text-sm font-semibold text-[var(--tt-fg-0)]'>Session journal</h3>
        <p className='mt-0.5 text-xs text-[var(--tt-fg-3)]'>Capture mindset and execution for this day</p>
      </div>

      <section>
        <h4 className='mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--tt-fg-3)]'>
          How did you feel?
        </h4>
        <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
          {feelingOptions.map(feeling => (
            <button
              key={feeling.id}
              type='button'
              onClick={() => handleFeelingSelect(feeling.id)}
              className={`tt-journal-feel-btn ${
                selectedFeeling === feeling.id ? 'tt-journal-feel-btn--active' : ''
              }`}
            >
              <span className='text-lg' aria-hidden>
                {feeling.emoji}
              </span>
              <span>{feeling.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h4 className='mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--tt-fg-3)]'>
          Energy level
        </h4>
        <EnergyLevel
          energyLevels={energyLevels}
          energyLevel={energyLevel}
          setEnergyLevel={setEnergyLevel}
        />
      </section>

      <section>
        <h4 className='mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--tt-fg-3)]'>
          How did you trade?
        </h4>
        <div className='space-y-2'>
          {tradingStyles.map(style => (
            <label
              key={style.id}
              className={`tt-journal-radio ${
                selectedTradingStyle === style.id ? 'tt-journal-radio--active' : ''
              }`}
            >
              <input
                type='radio'
                name='tradingStyle'
                checked={selectedTradingStyle === style.id}
                onChange={() => setSelectedTradingStyle(style.id)}
                className='h-4 w-4 border-[var(--tt-line-2)] text-[var(--tt-brand)] focus:ring-[var(--tt-brand)]'
              />
              <span className='text-sm text-[var(--tt-fg-1)]'>{style.label}</span>
            </label>
          ))}
        </div>
        <textarea
          className='mt-3 w-full resize-none rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] p-3 text-sm text-[var(--tt-fg-1)] placeholder:text-[var(--tt-fg-3)] focus:border-[var(--tt-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--tt-brand)]'
          placeholder='Notes about your session (optional)'
          rows={3}
          value={customText}
          onChange={e => setCustomText(e.target.value)}
        />
      </section>

      <section>
        <h4 className='mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--tt-fg-3)]'>
          What happened?
        </h4>
        <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
          {tradingFeedbackOptions.map(option => (
            <label
              key={option.id}
              className={`tt-journal-check ${emotional?.[option.id] ? 'tt-journal-check--active' : ''}`}
            >
              <input
                type='checkbox'
                checked={emotional?.[option.id] || false}
                onChange={() => handleTradingFeedbackChange(option.id)}
                className='h-4 w-4 rounded border-[var(--tt-line-2)] text-[var(--tt-profit)] focus:ring-[var(--tt-brand)]'
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      {showTextarea && (
        <section>
          <h4 className='mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--tt-fg-3)]'>
            Additional thoughts
          </h4>
          <textarea
            className='w-full resize-none rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] p-3 text-sm text-[var(--tt-fg-1)] placeholder:text-[var(--tt-fg-3)] focus:border-[var(--tt-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--tt-brand)]'
            placeholder='Share more context (optional)'
            rows={3}
            value={additionalFeedback}
            onChange={e => setAdditionalFeedback(e.target.value)}
          />
        </section>
      )}

      <div className='sticky bottom-0 border-t border-[var(--tt-line-1)] bg-[var(--tt-bg-1)] pt-4'>
        <button
          type='button'
          className={`tt-btn tt-btn-primary w-full justify-center ${
            isSubmitting ? 'cursor-not-allowed opacity-60' : ''
          }`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving…' : 'Save journal entry'}
        </button>
      </div>
    </div>
  );
};

export default JournalDayFeedback;
