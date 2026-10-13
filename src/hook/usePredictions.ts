import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/utils/http_request';
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
  API_ERROR_CODES,
} from '@/types/predictions';

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
      const response = await http.get('/predictions/available-events');
      return AvailableEventsResponseSchema.parse(response.data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

// Prediction for specific event Hook
export function usePrediction(eventId: string) {
  return useQuery({
    queryKey: predictionKeys.prediction(eventId),
    queryFn: async (): Promise<PredictionResponse> => {
      const response = await http.get(`/predictions/${eventId}`);
      return PredictionResponseSchema.parse(response.data);
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
      await http.post('/predictions', validatedData);
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
      
      if (error.response?.status === 409) {
        toast.error('You have already made a prediction for this event');
      } else if (error.response?.status === 400) {
        toast.error('Invalid prediction data. Please check your inputs.');
      } else {
        toast.error('Failed to submit prediction. Please try again.');
      }
    },
  });
}

// Prediction History Hook
function usePredictionHistory(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: predictionKeys.history(page, pageSize),
    queryFn: async (): Promise<PredictionHistoryResponse> => {
      const response = await http.get('/predictions/history', {
        params: { page, pageSize },
      });
      return PredictionHistoryResponseSchema.parse(response.data);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
  });
}

// Leaderboard Hook
function useLeaderboard(period: LeaderboardPeriod) {
  return useQuery({
    queryKey: predictionKeys.leaderboard(period),
    queryFn: async (): Promise<LeaderboardResponse> => {
      const response = await http.get('/leaderboard', {
        params: { period },
      });
      return LeaderboardResponseSchema.parse(response.data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Vision Score Hook
function useVisionScore() {
  return useQuery({
    queryKey: predictionKeys.visionScore(),
    queryFn: async (): Promise<VisionScoreResponse> => {
      const response = await http.get('/vision-score');
      return VisionScoreResponseSchema.parse(response.data);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Utility hook for checking if user has prediction for an event
function useHasPrediction(eventId: string) {
  const { data, isLoading } = usePrediction(eventId);
  return {
    hasPrediction: data?.hasPrediction ?? false,
    prediction: data?.prediction,
    isLoading,
  };
}

