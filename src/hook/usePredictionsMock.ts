import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  CreatePredictionRequest,
  CreatePredictionRequestSchema,
  PredictionResponse,
  PredictionResponseSchema,
  PredictionHistoryResponse,
  PredictionHistoryResponseSchema,
  LeaderboardResponse,
  LeaderboardResponseSchema,
  VisionScoreResponse,
  VisionScoreResponseSchema,
  AvailableEventsResponse,
  AvailableEventsResponseSchema,
  LeaderboardPeriod,
} from '@/types/predictions';

// Mock data for development
const mockEvents: AvailableEventsResponse = {
  items: [
    {
      event_id: 'event-1',
      title: 'US Non-Farm Payrolls',
      time_utc: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      symbolHints: ['USD/JPY', 'EUR/USD', 'GBP/USD'],
      status: 'upcoming',
    },
    {
      event_id: 'event-2',
      title: 'Federal Reserve Interest Rate Decision',
      time_utc: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      symbolHints: ['USD/CHF', 'AUD/USD'],
      status: 'upcoming',
    },
    {
      event_id: 'event-3',
      title: 'UK Inflation Rate',
      time_utc: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      symbolHints: ['GBP/USD', 'EUR/GBP'],
      status: 'upcoming',
    },
    {
      event_id: 'event-4',
      title: 'ECB Monetary Policy Statement',
      time_utc: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      symbolHints: ['EUR/USD', 'EUR/GBP'],
      status: 'passed',
    },
    {
      event_id: 'event-5',
      title: 'Bank of Japan Policy Rate',
      time_utc: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      symbolHints: ['USD/JPY', 'EUR/JPY'],
      status: 'passed',
    },
  ],
};

const mockVisionScore: VisionScoreResponse = {
  user_id: 'user-123',
  score: 1150,
  streak: 3,
  accuracy: 78.5,
  calls: 25,
};

const mockLeaderboard: Record<LeaderboardPeriod, LeaderboardResponse> = {
  weekly: {
    period: 'weekly',
    items: [
      {
        rank: 1,
        user_id: 'user-456',
        username: 'TradingMaster',
        vision_score: 1250,
        accuracy: 85.2,
        calls: 12,
        streak: 8,
      },
      {
        rank: 2,
        user_id: 'user-789',
        username: 'ForexPro',
        vision_score: 1200,
        accuracy: 82.1,
        calls: 10,
        streak: 5,
      },
      {
        rank: 3,
        user_id: 'user-123',
        username: 'You',
        vision_score: 1150,
        accuracy: 78.5,
        calls: 8,
        streak: 3,
      },
    ],
  },
  monthly: {
    period: 'monthly',
    items: [
      {
        rank: 1,
        user_id: 'user-456',
        username: 'TradingMaster',
        vision_score: 1250,
        accuracy: 85.2,
        calls: 45,
        streak: 8,
      },
      {
        rank: 2,
        user_id: 'user-789',
        username: 'ForexPro',
        vision_score: 1200,
        accuracy: 82.1,
        calls: 38,
        streak: 5,
      },
      {
        rank: 3,
        user_id: 'user-123',
        username: 'You',
        vision_score: 1150,
        accuracy: 78.5,
        calls: 32,
        streak: 3,
      },
    ],
  },
  alltime: {
    period: 'alltime',
    items: [
      {
        rank: 1,
        user_id: 'user-456',
        username: 'TradingMaster',
        vision_score: 1250,
        accuracy: 85.2,
        calls: 156,
        streak: 8,
      },
      {
        rank: 2,
        user_id: 'user-789',
        username: 'ForexPro',
        vision_score: 1200,
        accuracy: 82.1,
        calls: 142,
        streak: 5,
      },
      {
        rank: 3,
        user_id: 'user-123',
        username: 'You',
        vision_score: 1150,
        accuracy: 78.5,
        calls: 128,
        streak: 3,
      },
    ],
  },
};

const mockHistory: PredictionHistoryResponse = {
  items: [
    {
      id: 'pred-1',
      event_id: 'event-4',
      result: 'win',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pred-2',
      event_id: 'event-5',
      result: 'lose',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pred-3',
      event_id: 'event-6',
      result: 'partial',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  page: 1,
  pageSize: 10,
  total: 3,
};

// Query Keys
const predictionKeys = {
  all: ['predictions'] as const,
  availableEvents: () => [...predictionKeys.all, 'available-events'] as const,
  prediction: (eventId: string) => [...predictionKeys.all, 'prediction', eventId] as const,
  history: (page: number, pageSize: number) => [...predictionKeys.all, 'history', page, pageSize] as const,
  leaderboard: (period: LeaderboardPeriod) => [...predictionKeys.all, 'leaderboard', period] as const,
  visionScore: () => [...predictionKeys.all, 'vision-score'] as const,
};

// Available Events Hook
export function useAvailableEvents() {
  return useQuery({
    queryKey: predictionKeys.availableEvents(),
    queryFn: async (): Promise<AvailableEventsResponse> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return AvailableEventsResponseSchema.parse(mockEvents);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

// Prediction for specific event Hook
function usePrediction(eventId: string) {
  return useQuery({
    queryKey: predictionKeys.prediction(eventId),
    queryFn: async (): Promise<PredictionResponse> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock some events as having predictions
      const hasPrediction = ['event-1', 'event-4'].includes(eventId);
      
      if (hasPrediction) {
        return PredictionResponseSchema.parse({
          hasPrediction: true,
          prediction: {
            id: `pred-${eventId}`,
            event_id: eventId,
            user_id: 'user-123',
            prediction_outcomes: {
              usd: 'up',
              gold: 'down',
              vol: 'high',
            },
            mini_plan: 'Based on recent market trends and economic indicators.',
            result: eventId === 'event-4' ? 'win' : null,
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            evaluated_at: eventId === 'event-4' ? new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() : null,
          },
        });
      }
      
      return PredictionResponseSchema.parse({
        hasPrediction: false,
      });
    },
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Create Prediction Hook
export function useCreatePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePredictionRequest): Promise<void> => {
      const validatedData = CreatePredictionRequestSchema.parse(data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success

    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch prediction for this event
      queryClient.invalidateQueries({
        queryKey: predictionKeys.prediction(variables.eventId),
      });
      
      // Invalidate available events to update status
      queryClient.invalidateQueries({
        queryKey: predictionKeys.availableEvents(),
      });

      // Invalidate vision score and leaderboard
      queryClient.invalidateQueries({
        queryKey: predictionKeys.visionScore(),
      });
      queryClient.invalidateQueries({
        queryKey: predictionKeys.leaderboard('weekly'),
      });
      queryClient.invalidateQueries({
        queryKey: predictionKeys.leaderboard('monthly'),
      });
      queryClient.invalidateQueries({
        queryKey: predictionKeys.leaderboard('alltime'),
      });

      toast.success('Prediction submitted successfully!');
    },
    onError: (error: any) => {
      console.error('Error creating prediction:', error);
      toast.error('Failed to submit prediction. Please try again.');
    },
  });
}

// Prediction History Hook
export function usePredictionHistory(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: predictionKeys.history(page, pageSize),
    queryFn: async (): Promise<PredictionHistoryResponse> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return PredictionHistoryResponseSchema.parse(mockHistory);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
  });
}

// Leaderboard Hook
export function useLeaderboard(period: LeaderboardPeriod) {
  return useQuery({
    queryKey: predictionKeys.leaderboard(period),
    queryFn: async (): Promise<LeaderboardResponse> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      return LeaderboardResponseSchema.parse(mockLeaderboard[period]);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Vision Score Hook
export function useVisionScore() {
  return useQuery({
    queryKey: predictionKeys.visionScore(),
    queryFn: async (): Promise<VisionScoreResponse> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      return VisionScoreResponseSchema.parse(mockVisionScore);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Utility hook for checking if user has prediction for an event
export function useHasPrediction(eventId: string) {
  const { data, isLoading } = usePrediction(eventId);
  return {
    hasPrediction: data?.hasPrediction ?? false,
    prediction: data?.prediction,
    isLoading,
  };
}
