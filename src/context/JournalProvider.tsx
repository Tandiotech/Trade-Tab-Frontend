import { http } from '@/utils/http_request';
import { RUTE_GET_SLT_PLAN } from '@/utils/Rutes';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import { useMTAccounts } from './accounts/MTAccountsContext';
import { getEconomicEvents } from '@/services/getEconomicEvents';

const backupEvents = [
  {
    date: '2025-03-24',
    data: {
      date: '2025-03-24',
      event: 'My Time in the Reagan Administration',
      importance: '🔴',
      author: 'John W. Whitehead',
      description:
        'Former economics professor John W. Whitehead shares his experiences working in the Reagan administration and how it shaped his perspective on economic policy.',
      url: 'https://www.lewrockwell.com/2025/03/paul-craig-roberts/my-time-in-the-reagan-administration/',
      urlToImage: 'https://lrc-cdn.s3.amazonaws.com/assets/2021/02/LRC-share.jpg',
    },
  },
  {
    date: '2025-03-24',
    data: {
      date: '2025-03-24',
      event: "Vodafone Idea shares in focus after co's appeal to DoT to allow equity conversion",
      importance: '🔴',
      author: 'Nishtha Awasthi',
      description:
        'Vodafone Idea requests the Department of Telecommunications to allow equity conversion due to its current financial situation.',
      url: 'https://economictimes.indiatimes.com/markets/stocks/news/vodafone-idea-shares-in-focus-after-cos-appeal-to-dot-to-allow-equity-conversion/articleshow/119404912.cms',
      urlToImage:
        'https://img.etimg.com/thumb/msid-119404872,width-1200,height-630,imgsize-1901676,overlay-etmarkets/articleshow.jpg',
    },
  },
  {
    date: '2025-03-24',
    data: {
      date: '2025-03-24',
      event:
        'Share Market Highlights: Sensex jumps 1.4%, Nifty gains 1.32% as foreign buying lifts markets',
      importance: '🔴',
      author: 'KS Badri Narayanan, Team BL',
      description:
        'Sensex surges by 1.4% and Nifty gains 1.32% as foreign investors drive market growth, with banking and IT sectors leading the rally.',
      url: 'https://www.thehindubusinessline.com/markets/stock-market-highlights-24-march-2025/article69365394.ece',
      urlToImage:
        'https://bl-i.thgim.com/public/incoming/rwbyao/article69356471.ece/alternates/LANDSCAPE_1200/IMG_Businessman_using_la_2_1_L6DBU8AR.jpg',
    },
  },
  {
    date: '2025-03-21',
    data: {
      date: '2025-03-21',
      event: 'The Fed’s Backdoor QE',
      importance: '🔴',
      author: 'James Rickards',
      description:
        'This post The Fed’s Backdoor QE appeared first on Daily Reckoning.\nJim Rickards explores the Fed’s difficult predicament and latest moves.',
      url: 'https://dailyreckoning.com/the-feds-backdoor-qe/',
      urlToImage: 'https://dailyreckoning.com/wp-content/uploads/2025/03/dr-hero-img-03-21-25.jpeg',
    },
  },
  {
    date: '2025-03-21',
    data: {
      date: '2025-03-21',
      event: 'These 10 Movies Will Completely Change The Way You Look At Life',
      importance: '🔴',
      author: 'Stephen Holland',
      description:
        'A great movie can inspire viewers and make them rethink everything they thought they knew about life and the way the world is constructed.',
      url: 'https://screenrant.com/movies-completely-change-way-look-at-life-list/',
      urlToImage:
        'https://static1.srcdn.com/wordpress/wp-content/uploads/2025/03/these-10-movies-will-completely-change-the-way-you-look-at-life.jpg',
    },
  },
];

interface EmotionalState {
  [key: string]: any;
}

interface JournalContextType {
  emotional: EmotionalState;
  setEmotional: Dispatch<SetStateAction<EmotionalState>>;
  setWithdrawalDate: Dispatch<SetStateAction<any>>;
  withdrawalDate: any;
  relativeValues: boolean;
  setrelativeValues: Dispatch<SetStateAction<boolean>>;
  stlPlan: any;
  setStlPlan: any;
  sentiments: any;
  setSentiments: any;
  fetchSentiments: any;
  currentMonth: any;
  currentYear: any;
  setCurrentMonth: any;
  setCurrentYear: any;
  expandedJournalEntries: boolean;
  setExpandedJournalEntries: Dispatch<SetStateAction<boolean>>;
  highlightedDay: any;
  setHighlightedDay: any;
  sortedEvents: any;
}

interface JournalProviderProps {
  children: ReactNode;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export function useJournalContext(): JournalContextType {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournalContext must be used within a JournalProvider');
  }
  return context;
}
interface STLPlan {
  createdAt?: string;
  lifeTime?: number;
  includeWeekends?: boolean;
}

export const JournalProvider = ({ children }: JournalProviderProps) => {
  const [emotional, setEmotional] = useState<EmotionalState>({});
  const [withdrawalDate, setWithdrawalDate] = useState(null);
  const [relativeValues, setrelativeValues] = useState(false);
  const [stlPlan, setStlPlan] = useState<STLPlan>({});

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [expandedJournalEntries, setExpandedJournalEntries] = useState<boolean>(false);
  const [highlightedDay, setHighlightedDay] = useState<number | null>(null);

  interface Account {
    id?: string;
    _id?: string;
    balance?: number;
    currency?: string;
  }

  const { currentAccount }: { currentAccount?: Account } = useMTAccounts();
  const [sentiments, setSentiments] = useState(null);
  interface Event {
    date: string;
    data: {
      date: string;
      event: string;
      importance: string;
      author: string;
      description: string;
      url: string;
      urlToImage: string;
    };
  }

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEconomicEvents = async () => {
      try {
        const response = await getEconomicEvents();
        if (response?.length) {
          setEvents(
            response.map((article: any) => {
              if (article.date && article.data) {
                return article;
              }
              return {
                date: article.publishedAt
                  ? new Date(article.publishedAt).toISOString().split('T')[0]
                  : null,
                data: {
                  date: article.publishedAt
                    ? new Date(article.publishedAt).toISOString().split('T')[0]
                    : null,
                  event: article.title || '',
                  importance: '🔴',
                  author: article.author || '',
                  description: article.description || '',
                  url: article.url || '',
                  urlToImage: article.urlToImage || '',
                  content: article.content || '',
                  source: article.source || null,
                },
              };
            })
          );
        } else {
          setEvents(backupEvents);
        }
      } catch (error) {
        console.error('Error fetching economic events:', error);
        setEvents(backupEvents);
      }
    };
    fetchEconomicEvents();
  }, []);

  const fetchSentiments = async () => {
    try {
      const res = await http.get(`emotional?account=${currentAccount?._id}`);
      setSentiments(res.data.data);
    } catch (e) {
      console.error('Error fetching sentiments:', e);
    }
  };

  const sortedEvents = [...events].sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  useEffect(() => {
    if (!currentAccount?.external_id) return;

    const fetchSTL = async () => {
      try {
        const response = await http.get(`${RUTE_GET_SLT_PLAN}${currentAccount.external_id}`);
        const stl = response.data.data;
        setStlPlan(stl);
      } catch (error) {
        console.error('Error fetching SLT:', error);
        setStlPlan({});
      }
    };

    fetchSTL();
  }, [currentAccount]);

  useEffect(() => {
    if (currentAccount?._id) {
      fetchSentiments();
    }
  }, [currentAccount?._id, emotional]);

  return (
    <JournalContext.Provider
      value={{
        emotional,
        setEmotional,
        withdrawalDate,
        setWithdrawalDate,
        relativeValues,
        setrelativeValues,
        stlPlan,
        setStlPlan,
        sentiments,
        setSentiments,
        fetchSentiments,
        expandedJournalEntries,
        setExpandedJournalEntries,
        currentMonth,
        currentYear,
        setCurrentMonth,
        setCurrentYear,
        highlightedDay,
        setHighlightedDay,
        sortedEvents,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};
