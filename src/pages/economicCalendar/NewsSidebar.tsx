import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegImage, FaExternalLinkAlt } from 'react-icons/fa';
import {
  IoTrendingUp,
  IoTrendingDown,
  IoRemove,
  IoFilter,
  IoTime,
  IoStatsChart,
  IoGlobe,
  IoStar,
  IoNewspaper,
  IoChevronDown,
} from 'react-icons/io5';

interface NewsTopic {
  topic: string;
  relevance_score: string;
}

interface NewsItem {
  _id: string;
  url: string;
  title: string;
  description: string;
  summary: string;
  publishedAt: string;
  time_published: string;
  banner_image: string;
  overall_sentiment_label: string;
  overall_sentiment_score: number;
  topics: NewsTopic[];
  authors: string[];
}

interface NewsSidebarProps {
  newsData?: NewsItem[];
  loading?: boolean;
  activeFilter?: string;
  setActiveFilter?: (filter: string) => void;
}

const NewsSidebar: React.FC<NewsSidebarProps> = ({
  newsData = [],
  loading = false,
  // activeFilter = 'today',
  // setActiveFilter,
}) => {
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');

  // Sentiment analysis helpers
  const getSentimentData = (sentiment: string, score: number) => {
    switch (sentiment) {
      case 'Bullish':
        return {
          color: 'text-green-400',
          bg: 'bg-green-500/20',
          border: 'border-green-500/30',
          icon: <IoTrendingUp className='text-green-400' />,
          label: 'Bullish',
          intensity: Math.abs(score) > 0.3 ? 'Strong' : 'Moderate',
        };
      case 'Somewhat-Bullish':
        return {
          color: 'text-green-300',
          bg: 'bg-green-500/10',
          border: 'border-green-500/20',
          icon: <IoTrendingUp className='text-green-300' />,
          label: 'Somewhat Bullish',
          intensity: 'Moderate',
        };
      case 'Bearish':
        return {
          color: 'text-red-400',
          bg: 'bg-red-500/20',
          border: 'border-red-500/30',
          icon: <IoTrendingDown className='text-red-400' />,
          label: 'Bearish',
          intensity: Math.abs(score) > 0.3 ? 'Strong' : 'Moderate',
        };
      case 'Somewhat-Bearish':
        return {
          color: 'text-red-300',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          icon: <IoTrendingDown className='text-red-300' />,
          label: 'Somewhat Bearish',
          intensity: 'Moderate',
        };
      default:
        return {
          color: 'text-gray-400',
          bg: 'bg-gray-500/20',
          border: 'border-gray-500/30',
          icon: <IoRemove className='text-gray-400' />,
          label: 'Neutral',
          intensity: 'Low',
        };
    }
  };

  // Get unique topics from all news
  const availableTopics = useMemo(() => {
    const topicSet = new Set<string>();
    newsData.forEach((news: any) => {
      news.topics?.forEach((topic: any) => {
        if (parseFloat(topic.relevance_score) > 0.3) {
          topicSet.add(topic.topic);
        }
      });
    });
    return Array.from(topicSet).sort();
  }, [newsData]);

  // Process and filter news data
  const processedNews = useMemo(() => {
    let filtered = newsData;

    // Filter by sentiment
    if (sentimentFilter !== 'all') {
      filtered = filtered.filter((news: any) => news.overall_sentiment_label === sentimentFilter);
    }

    // Filter by topic
    if (topicFilter !== 'all') {
      filtered = filtered.filter((news: any) =>
        news.topics?.some((topic: any) => topic.topic === topicFilter)
      );
    }

    // Sort news
    return filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'relevance':
          const aMaxRelevance = Math.max(
            ...(a.topics?.map((t: any) => parseFloat(t.relevance_score)) || [0])
          );
          const bMaxRelevance = Math.max(
            ...(b.topics?.map((t: any) => parseFloat(t.relevance_score)) || [0])
          );
          return bMaxRelevance - aMaxRelevance;
        case 'sentiment':
          return Math.abs(b.overall_sentiment_score) - Math.abs(a.overall_sentiment_score);
        case 'time':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        default:
          return 0;
      }
    });
  }, [newsData, sentimentFilter, topicFilter, sortBy]);

  // Calculate sentiment statistics
  const sentimentStats = useMemo(() => {
    const stats = {
      bullish: 0,
      bearish: 0,
      neutral: 0,
      total: newsData.length,
    };

    newsData.forEach((news: any) => {
      if (news.overall_sentiment_label?.includes('Bullish')) {
        stats.bullish++;
      } else if (news.overall_sentiment_label?.includes('Bearish')) {
        stats.bearish++;
      } else {
        stats.neutral++;
      }
    });

    return stats;
  }, [newsData]);

  // Professional Loading Skeleton - Mobile Optimized
  if (loading) {
    return (
      <div className='w-full max-w-full flex flex-col bg-gradient-to-br from-darkblack-700 to-darkblack-800 rounded-xl p-3 sm:p-6 border border-gray-700/50 shadow-xl'>
        <div className='mb-4 sm:mb-6'>
          <div className='flex items-center justify-between mb-3 sm:mb-5'>
            <div className='flex items-center gap-2 sm:gap-3'>
              <div className='p-2 sm:p-2.5 bg-gray-700/50 rounded-lg sm:rounded-xl animate-pulse w-12 h-12 sm:w-14 sm:h-14'></div>
              <div className='space-y-1.5 sm:space-y-2'>
                <div className='h-5 sm:h-6 bg-gray-700/50 rounded-lg w-24 sm:w-32 animate-pulse'></div>
                <div className='h-3 sm:h-4 bg-gray-700/50 rounded-lg w-32 sm:w-48 animate-pulse'></div>
              </div>
            </div>
          </div>
        </div>
        <div className='space-y-3 sm:space-y-4'>
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className='animate-pulse bg-gradient-to-br from-gray-800/40 to-gray-700/40 rounded-lg sm:rounded-xl p-3 sm:p-5 border-2 border-gray-700/40'
            >
              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
                <div className='w-full sm:w-32 h-40 sm:h-24 bg-gray-700/50 rounded-lg sm:rounded-xl'></div>
                <div className='flex-1 space-y-2 sm:space-y-3'>
                  <div className='h-4 sm:h-5 bg-gray-700/50 rounded w-3/4'></div>
                  <div className='h-3 sm:h-4 bg-gray-700/50 rounded w-full'></div>
                  <div className='h-3 sm:h-4 bg-gray-700/50 rounded w-2/3'></div>
                  <div className='flex gap-1.5 sm:gap-2'>
                    <div className='h-5 sm:h-6 bg-gray-700/50 rounded-lg w-16 sm:w-20'></div>
                    <div className='h-5 sm:h-6 bg-gray-700/50 rounded-lg w-16 sm:w-20'></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-full flex flex-col bg-gradient-to-br from-darkblack-700 to-darkblack-800 rounded-xl p-3 sm:p-6 border border-gray-700/50 shadow-xl'>
      {/* Professional Header - Mobile Optimized */}
      <div className='mb-4 sm:mb-6'>
        <div className='flex items-center justify-between mb-3 sm:mb-5'>
          <div className='flex items-center gap-2 sm:gap-3'>
            <div className='p-2 sm:p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl shadow-lg'>
              <IoNewspaper className='text-white text-lg sm:text-2xl' />
            </div>
            <div>
              <h3 className='text-white text-lg sm:text-2xl font-bold'>Market News</h3>
              <p className='text-gray-400 text-xs sm:text-base mt-0.5'>AI-powered sentiment analysis</p>
            </div>
          </div>
        </div>

        {/* Sentiment Stats - Mobile Friendly */}
        <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-0'>
          <div className='flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-500/10 border border-green-500/30 rounded-lg flex-1 sm:flex-initial'>
            <div className='w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full animate-pulse'></div>
            <span className='text-green-400 font-semibold text-xs sm:text-sm'>{sentimentStats.bullish}</span>
          </div>
          <div className='flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500/10 border border-red-500/30 rounded-lg flex-1 sm:flex-initial'>
            <div className='w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full animate-pulse'></div>
            <span className='text-red-400 font-semibold text-xs sm:text-sm'>{sentimentStats.bearish}</span>
          </div>
          <div className='flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-500/10 border border-gray-500/30 rounded-lg flex-1 sm:flex-initial'>
            <div className='w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gray-500 rounded-full'></div>
            <span className='text-gray-400 font-semibold text-xs sm:text-sm'>{sentimentStats.neutral}</span>
          </div>
        </div>

        {/* Professional Filter Controls - Mobile Optimized */}
        <div className='space-y-3 sm:space-y-4'>
          {/* Sentiment Filter - Mobile Compact */}
          <div>
            <div className='flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3'>
              <IoFilter className='text-gray-400 text-sm sm:text-base' />
              <span className='text-gray-300 text-xs sm:text-sm font-semibold'>Sentiment</span>
            </div>
            <div className='flex flex-wrap gap-1.5 sm:gap-2'>
              {['all', 'Bullish', 'Somewhat-Bullish', 'Neutral', 'Somewhat-Bearish', 'Bearish'].map(
                sentiment => {
                  const sentimentData = getSentimentData(sentiment === 'all' ? 'Neutral' : sentiment, 0);
                  const isActive = sentimentFilter === sentiment;
                  return (
                    <button
                      key={sentiment}
                      onClick={() => setSentimentFilter(sentiment)}
                      className={`flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? `${sentimentData.bg} ${sentimentData.border} border-2 text-white shadow-md`
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/30'
                      }`}
                    >
                      {sentiment !== 'all' && <span className='hidden sm:inline'>{sentimentData.icon}</span>}
                      <span className='whitespace-nowrap'>{sentiment === 'all' ? 'All' : sentiment.replace('-', ' ').split(' ')[0]}</span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Topic & Sort Row - Mobile Stack */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
            {/* Topic Filter */}
            <div>
              <div className='flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3'>
                <IoGlobe className='text-gray-400 text-sm sm:text-base' />
                <span className='text-gray-300 text-xs sm:text-sm font-semibold'>Topic</span>
              </div>
              <div className='relative'>
                <select
                  value={topicFilter}
                  onChange={e => setTopicFilter(e.target.value)}
                  className='w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm bg-gray-700/50 text-gray-300 border-2 border-gray-600/50 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none cursor-pointer'
                >
                  <option value='all'>All Topics</option>
                  {availableTopics.map(topic => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
                <IoChevronDown className='absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none' />
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <div className='flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3'>
                <IoStatsChart className='text-gray-400 text-sm sm:text-base' />
                <span className='text-gray-300 text-xs sm:text-sm font-semibold'>Sort</span>
              </div>
              <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                {[
                  { value: 'relevance', label: 'Relevance', icon: IoStar },
                  { value: 'sentiment', label: 'Sentiment', icon: IoTrendingUp },
                  { value: 'time', label: 'Time', icon: IoTime },
                ].map(option => {
                  const IconComponent = option.icon;
                  const isActive = sortBy === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-purple-500/20 border-2 border-purple-500/50 text-purple-300 shadow-md'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/30'
                      }`}
                    >
                      <IconComponent className='text-xs sm:text-sm' />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable News List - Mobile Optimized */}
      <div className='flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar2 pr-1 sm:pr-2 space-y-3 sm:space-y-4'>
        <AnimatePresence>
          {processedNews.length > 0 ? (
            processedNews.map((news: any, idx: number) => {
              const sentimentData = getSentimentData(
                news.overall_sentiment_label,
                news.overall_sentiment_score
              );
              const topTopics =
                news.topics
                  ?.filter((topic: any) => parseFloat(topic.relevance_score) > 0.3)
                  .sort(
                    (a: any, b: any) =>
                      parseFloat(b.relevance_score) - parseFloat(a.relevance_score)
                  )
                  .slice(0, 3) || [];

              return (
                <motion.a
                  key={news._id}
                  href={news.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={`Read news: ${news.title}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.03, duration: 0.3 }}
                  className='group relative block bg-gradient-to-br from-gray-800/40 to-gray-700/40 rounded-lg sm:rounded-xl p-3 sm:p-5 border-2 border-gray-700/40 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer'
                >
                  {/* Top Row - Sentiment Badge, Score, Date - Mobile Compact */}
                  <div className='flex items-start justify-between mb-3 sm:mb-4'>
                    <div className='flex items-center gap-2 sm:gap-3 flex-wrap'>
                      <div
                        className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg ${sentimentData.bg} ${sentimentData.border} border-2`}
                      >
                        <span className='hidden sm:inline'>{sentimentData.icon}</span>
                        <span className={`text-[10px] sm:text-xs font-semibold ${sentimentData.color}`}>
                          {sentimentData.label}
                        </span>
                      </div>
                      <div className='flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg'>
                        <IoStar className='text-yellow-400 text-xs sm:text-sm' />
                        <span className='text-yellow-300 text-[10px] sm:text-xs font-semibold'>
                          {Math.abs(news.overall_sentiment_score).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center gap-1 text-[10px] sm:text-xs text-gray-400'>
                      <IoTime className='text-xs sm:text-sm' />
                      <span className='font-medium hidden sm:inline'>
                        {new Date(news.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className='font-medium sm:hidden'>
                        {new Date(news.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Main Content - Mobile Stack Layout */}
                  <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
                    {/* Image - Full Width on Mobile */}
                    <div className='w-full sm:w-32 h-40 sm:h-24 rounded-lg sm:rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg border-2 border-gray-700/50 group-hover:border-orange-500/30 transition-all'>
                      {news.banner_image && !imageErrors[news._id] ? (
                        <img
                          src={news.banner_image}
                          alt={news.title}
                          onError={() => setImageErrors(prev => ({ ...prev, [news._id]: true }))}
                          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                        />
                      ) : (
                        <FaRegImage className='text-gray-500 text-xl sm:text-2xl' />
                      )}
                    </div>

                    {/* Text Content - Mobile Optimized */}
                    <div className='flex-1 min-w-0'>
                      <h4
                        title={news.title}
                        className='text-white text-sm sm:text-lg font-bold group-hover:text-orange-400 transition-colors line-clamp-2 sm:line-clamp-2 mb-2 sm:mb-2.5 leading-tight'
                      >
                        {news.title}
                      </h4>

                      {/* Summary or Description */}
                      <p className='text-gray-400 text-xs sm:text-base line-clamp-2 mb-2 sm:mb-3 leading-relaxed'>
                        {news.summary || news.description || 'No summary available'}
                      </p>

                      {/* Topics - Mobile Compact */}
                      {topTopics.length > 0 && (
                        <div className='flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3'>
                          {topTopics.map((topic: any, topicIdx: number) => (
                            <span
                              key={topicIdx}
                              className='px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-500/20 text-blue-300 text-[10px] sm:text-xs font-medium rounded-lg border border-blue-500/30'
                            >
                              {topic.topic}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer - Mobile Compact */}
                      <div className='flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-700/50'>
                        <div className='flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500'>
                          <IoTime className='text-xs sm:text-sm' />
                          <span>{new Date(news.publishedAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}</span>
                        </div>
                        <div className='flex items-center gap-1 text-orange-400 text-xs sm:text-sm font-semibold group-hover:text-orange-300 transition-colors'>
                          <span className='hidden sm:inline'>Read Article</span>
                          <span className='sm:hidden'>Read</span>
                          <FaExternalLinkAlt className='text-[10px] sm:text-xs' />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className='absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl pointer-events-none'></div>
                </motion.a>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-8 sm:py-16'
            >
              <div className='flex flex-col items-center gap-2 sm:gap-3'>
                <div className='p-3 sm:p-4 bg-gray-700/30 rounded-full'>
                  <IoFilter className='text-3xl sm:text-4xl text-gray-500' />
                </div>
                <p className='text-gray-300 text-base sm:text-lg font-semibold'>No news found</p>
                <p className='text-gray-400 text-xs sm:text-sm'>Try adjusting your filters</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NewsSidebar;
