import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from '@/utils/http_request';
import { useAvailableEvents, useCreatePrediction, usePrediction } from '../usePredictions';

// Mock the http client
vi.mock('@/utils/http_request', () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useAvailableEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches available events successfully', async () => {
    const mockResponse = {
      data: {
        items: [
          {
            event_id: 'event-1',
            title: 'Test Event',
            time_utc: '2024-01-01T12:00:00Z',
            status: 'upcoming',
          },
        ],
      },
    };

    (http.get as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAvailableEvents(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse.data);
    expect(http.get).toHaveBeenCalledWith('/predictions/available-events');
  });

  it('handles fetch error', async () => {
    const error = new Error('Network error');
    (http.get as any).mockRejectedValue(error);

    const { result } = renderHook(() => useAvailableEvents(), { wrapper });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 20000 }
    );

    expect(result.current.error).toBe(error);
  }, 25000);
});

describe('usePrediction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches prediction for specific event', async () => {
    const mockResponse = {
      data: {
        hasPrediction: true,
        prediction: {
          id: 'pred-1',
          event_id: 'event-1',
          user_id: 'user-1',
          prediction_outcomes: {
            usd: 'up',
            gold: 'down',
            vol: 'high',
          },
          mini_plan: 'Test plan',
          result: null,
          created_at: '2024-01-01T12:00:00Z',
          evaluated_at: null,
        },
      },
    };

    (http.get as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePrediction('event-1'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse.data);
    expect(http.get).toHaveBeenCalledWith('/predictions/event-1');
  });

  it('does not fetch when eventId is empty', () => {
    const { result } = renderHook(() => usePrediction(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(http.get).not.toHaveBeenCalled();
  });
});

describe('useCreatePrediction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates prediction successfully', async () => {
    const mockRequest = {
      eventId: 'event-1',
      prediction_outcomes: {
        usd: 'up',
        gold: 'down',
        vol: 'high',
      },
      mini_plan: 'Test plan',
    };

    (http.post as any).mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useCreatePrediction(), { wrapper });

    await waitFor(() => {
      result.current.mutate(mockRequest);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(http.post).toHaveBeenCalledWith('/predictions', mockRequest);
  });

  it('handles 409 error (prediction already exists)', async () => {
    const mockRequest = {
      eventId: 'event-1',
      prediction_outcomes: {
        usd: 'up',
        gold: 'down',
        vol: 'high',
      },
    };

    const error = {
      response: {
        status: 409,
        data: { message: 'Prediction already exists' },
      },
    };

    (http.post as any).mockRejectedValue(error);

    const { result } = renderHook(() => useCreatePrediction(), { wrapper });

    await waitFor(() => {
      result.current.mutate(mockRequest);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(error);
  });

  it('handles 400 error (validation error)', async () => {
    const mockRequest = {
      eventId: 'event-1',
      prediction_outcomes: {
        usd: 'up',
        gold: 'down',
        vol: 'high',
      },
    };

    const error = {
      response: {
        status: 400,
        data: { message: 'Validation error' },
      },
    };

    (http.post as any).mockRejectedValue(error);

    const { result } = renderHook(() => useCreatePrediction(), { wrapper });

    await waitFor(() => {
      result.current.mutate(mockRequest);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(error);
  });
});
