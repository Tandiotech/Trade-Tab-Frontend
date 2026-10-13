import { z } from 'zod';

// Enums and unions
const PredictionOutcomeSchema = z.enum(['up', 'down', 'flat']);
const VolatilityOutcomeSchema = z.enum(['high', 'low']);
const EventStatusSchema = z.enum(['upcoming', 'passed']);
const PredictionResultSchema = z.enum(['win', 'lose', 'partial']).nullable();
const LeaderboardPeriodSchema = z.enum(['weekly', 'monthly', 'alltime']);

export type PredictionOutcome = z.infer<typeof PredictionOutcomeSchema>;
export type VolatilityOutcome = z.infer<typeof VolatilityOutcomeSchema>;
type EventStatus = z.infer<typeof EventStatusSchema>;
export type PredictionResult = z.infer<typeof PredictionResultSchema>;
export type LeaderboardPeriod = z.infer<typeof LeaderboardPeriodSchema>;

// Vision Score Badge Types
export type VisionScoreTier = 'bronze' | 'silver' | 'gold' | 'diamond';

interface VisionScoreInfo {
  tier: VisionScoreTier;
  minScore: number;
  maxScore: number;
  color: string;
  bgColor: string;
}

export const VISION_SCORE_TIERS: Record<VisionScoreTier, VisionScoreInfo> = {
  bronze: { tier: 'bronze', minScore: 0, maxScore: 999, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  silver: { tier: 'silver', minScore: 1000, maxScore: 1099, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  gold: { tier: 'gold', minScore: 1100, maxScore: 1199, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  diamond: { tier: 'diamond', minScore: 1200, maxScore: Infinity, color: 'text-blue-600', bgColor: 'bg-blue-100' },
};

// API Request/Response Schemas
const PredictionOutcomesSchema = z.object({
  usd: PredictionOutcomeSchema,
  gold: PredictionOutcomeSchema,
  vol: VolatilityOutcomeSchema,
});

export const CreatePredictionRequestSchema = z.object({
  eventId: z.string(),
  prediction_outcomes: PredictionOutcomesSchema,
  mini_plan: z.string().optional(),
});

const PredictionSchema = z.object({
  id: z.string(),
  event_id: z.string(),
  user_id: z.string(),
  prediction_outcomes: PredictionOutcomesSchema,
  mini_plan: z.string().nullable(),
  result: PredictionResultSchema,
  created_at: z.string(),
  evaluated_at: z.string().nullable(),
});

const EventSchema = z.object({
  event_id: z.string(),
  title: z.string(),
  time_utc: z.string(),
  symbolHints: z.array(z.string()).optional(),
  status: EventStatusSchema,
});

export const PredictionResponseSchema = z.object({
  hasPrediction: z.boolean(),
  prediction: PredictionSchema.optional(),
});

const PredictionHistoryItemSchema = z.object({
  id: z.string(),
  event_id: z.string(),
  result: PredictionResultSchema,
  created_at: z.string(),
});

export const PredictionHistoryResponseSchema = z.object({
  items: z.array(PredictionHistoryItemSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});

const LeaderboardItemSchema = z.object({
  rank: z.number(),
  user_id: z.string(),
  username: z.string(),
  vision_score: z.number(),
  accuracy: z.number(),
  calls: z.number(),
  streak: z.number(),
});

export const LeaderboardResponseSchema = z.object({
  period: LeaderboardPeriodSchema,
  items: z.array(LeaderboardItemSchema),
});

export const VisionScoreResponseSchema = z.object({
  user_id: z.string(),
  score: z.number(),
  streak: z.number(),
  accuracy: z.number(),
  calls: z.number(),
});

export const AvailableEventsResponseSchema = z.object({
  items: z.array(EventSchema),
});

// Type exports
type PredictionOutcomes = z.infer<typeof PredictionOutcomesSchema>;
export type CreatePredictionRequest = z.infer<typeof CreatePredictionRequestSchema>;
type Prediction = z.infer<typeof PredictionSchema>;
export type Event = z.infer<typeof EventSchema>;
export type PredictionResponse = z.infer<typeof PredictionResponseSchema>;
export type PredictionHistoryItem = z.infer<typeof PredictionHistoryItemSchema>;
export type PredictionHistoryResponse = z.infer<typeof PredictionHistoryResponseSchema>;
type LeaderboardItem = z.infer<typeof LeaderboardItemSchema>;
export type LeaderboardResponse = z.infer<typeof LeaderboardResponseSchema>;
export type VisionScoreResponse = z.infer<typeof VisionScoreResponseSchema>;
export type AvailableEventsResponse = z.infer<typeof AvailableEventsResponseSchema>;

// API Error Types
interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export const API_ERROR_CODES = {
  PREDICTION_ALREADY_EXISTS: 'PREDICTION_ALREADY_EXISTS',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

// Helper functions
export function getVisionScoreTier(score: number): VisionScoreTier {
  if (score >= 1200) return 'diamond';
  if (score >= 1100) return 'gold';
  if (score >= 1000) return 'silver';
  return 'bronze';
}

export function formatAccuracy(accuracy: number): string {
  return `${accuracy.toFixed(1)}%`;
}

export function getResultColor(result: PredictionResult): string {
  switch (result) {
    case 'win':
      return 'text-green-600 bg-green-100';
    case 'lose':
      return 'text-red-600 bg-red-100';
    case 'partial':
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getResultText(result: PredictionResult): string {
  switch (result) {
    case 'win':
      return 'Win';
    case 'lose':
      return 'Lose';
    case 'partial':
      return 'Partial';
    default:
      return 'Pending';
  }
}

