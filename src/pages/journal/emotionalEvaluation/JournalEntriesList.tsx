import { useEffect, useState } from 'react';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { http } from '@/utils/http_request';
import { RUTE_GET_FEEDBACK_LIST } from '@/utils/Rutes';
import SentimentsResume from './SentimentsResume';
import { BiCollapseAlt, BiExpandAlt } from 'react-icons/bi';
import { useJournalContext } from '@/context/JournalProvider';
import { safeConsoleLog } from '@/utils/safeConsoleLog';

interface JournalEntry {
  _id: string;
  account: string;
  enterTooEarly: boolean;
  ignoringStrategy: boolean;
  lackOfDiscipline: boolean;
  overtrading: boolean;
  revengeTrading: boolean;
  other: boolean;
  additionalFeedback: string;
  date: string; // ISO string
}

export default function JournalEntriesList() {
  const { currentAccount } = useMTAccounts();
  const {
    setExpandedJournalEntries,
    expandedJournalEntries,
    // currentMonth,
    // currentYear,
    setCurrentMonth,
    setCurrentYear,
    setHighlightedDay,
    emotional,
  } = useJournalContext();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentAccount?._id) return;
    safeConsoleLog(`Entries::: ${entries}`);

    const fetchEntries = async () => {
      try {
        const response = await http.get(`${RUTE_GET_FEEDBACK_LIST}${currentAccount._id}`);
        setEntries(response.data);
      } catch (err) {
        console.error('Error fetching journal entries:', err);
        setError('Failed to load journal entries.');
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [currentAccount, emotional]);

  
  // Format date for display
  const formatDate = (isoDate: string): string => {
    return new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Function to navigate to the entry’s month & year
  const goToEntryDate = (isoDate: string) => {
    const entryDate = new Date(isoDate);
    const entryMonth = entryDate.getMonth() + 1; // JS months are 0-based
    const entryYear = entryDate.getFullYear();
    const entryDay = entryDate.getDate(); // Extract day

    setCurrentMonth(entryMonth);
    setCurrentYear(entryYear);
    setHighlightedDay(entryDay); // ✅ Highlight the clicked day
  };

  return (
    <div className='px-1 py-4 text-white h-full overflow-auto relative'>
      {/* Toggle Expanded View */}
      <button
        onClick={() => setExpandedJournalEntries(!expandedJournalEntries)}
        className={`sticky left-0 ${expandedJournalEntries ? 'top-1' : 'top-0'}`}
      >
        {expandedJournalEntries ? <BiCollapseAlt /> : <BiExpandAlt />}
      </button>

      {loading ? (
        <p className='text-gray-400'>Loading entries...</p>
      ) : error ? (
        <p className='text-red-400'>{error}</p>
      ) : entries.length > 0 ? (
        <ul className='space-y-1 h-full md:max-h-96'>
          {entries?.map((entry: any) => (
            <li
              key={entry._id}
              className='p-2 border-b border-gray-600 bg-black bg-opacity-70 rounded-sm cursor-pointer hover:bg-gray-900 transition duration-200'
              onClick={() => goToEntryDate(entry.date)}
            >
              <div className='flex flex-col items-center justify-start border-b-2'>
                <span className='text-teal-400 font-semibold whitespace-nowrap'>
                  {formatDate(entry.date)}
                </span>
              </div>
              <p className='mt-1 text-gray-200 overflow-hidden text-lg p-2 bg-gray-800 bg-opacity-50 rounded-sm'>
                {entry.customText || 'No additional notes.'}
              </p>
              <SentimentsResume sentiments={entry} hideZeros={true} asChecklist={true} />
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-gray-400'>No journal entries found.</p>
      )}
    </div>
  );
}
