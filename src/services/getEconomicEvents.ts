import { holderEconomicCalendarNews } from '@/data/economic-calendar-data-holder';
import axios from 'axios';
import { BACKEND_URL } from '@/utils/GlobalVars';

interface EconomicEvent {
  date: string;
  event: string;
  importance: string;
  data?: {
    description: string;
    urlToImage: string;
    url: string;
    author: string;
    publishedAt: string;
  };
}

interface ApiResponse {
  source: string;
  data: EconomicEvent[];
  error?: string;
}

export async function getEconomicEvents(): Promise<EconomicEvent[]> {
  try {
    // Use BACKEND_URL instead of hardcoded localhost
    const response = await axios.get(`${BACKEND_URL}slack/economic-events`);
    const apiResponse: ApiResponse = response.data;

    if (!apiResponse || !apiResponse.data || !Array.isArray(apiResponse.data)) {

      return holderEconomicCalendarNews;
    }

    // The data is already formatted correctly from the backend
    // Just need to validate and return it
    const events = apiResponse.data.map(event => ({
      date: event.date || new Date().toISOString().split('T')[0],
      event: event.event || '',
      importance: event.importance || '🟡',
      data: {
        description: event.data?.description || '',
        urlToImage: event.data?.urlToImage || '',
        url: event.data?.url || '',
        author: event.data?.author || '',
        publishedAt: event.data?.publishedAt || new Date().toISOString(),
      }
    }));

    return events.length > 0 ? events : holderEconomicCalendarNews;

  } catch (error) {
    console.error('Error fetching economic events:', error);
    return holderEconomicCalendarNews;
  }
}