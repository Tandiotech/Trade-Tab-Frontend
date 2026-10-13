import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MakeCallModal from '../MakeCallModal';
import { useCreatePrediction } from '@/hook/usePredictionsDev';

// Mock the hooks (MakeCallModal imports usePredictionsDev)
vi.mock('@/hook/usePredictionsDev', () => ({
  useCreatePrediction: vi.fn(),
}));

// Mock the modal component (real GlobalModal uses isActive; inner content stops propagation)
vi.mock('../../modal/GlobalModal', () => ({
  default: ({ children, isActive }: any) =>
    isActive ? <div data-testid='modal'>{children}</div> : null,
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('MakeCallModal', () => {
  const mockMutateAsync = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCreatePrediction as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    eventId: 'test-event-123',
    eventTitle: 'Test Economic Event',
  };

  it('renders modal when open', () => {
    render(
      <TestWrapper>
        <MakeCallModal {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Make a Call')).toBeInTheDocument();
    expect(screen.getByText('Test Economic Event')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <TestWrapper>
        <MakeCallModal {...defaultProps} isOpen={false} />
      </TestWrapper>
    );

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('shows all required outcome selectors', () => {
    render(
      <TestWrapper>
        <MakeCallModal {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('USD Direction')).toBeInTheDocument();
    expect(screen.getByText('Gold Direction')).toBeInTheDocument();
    expect(screen.getByText('Volatility Level')).toBeInTheDocument();
  });

  it('shows outcome options with correct labels', () => {
    render(
      <TestWrapper>
        <MakeCallModal {...defaultProps} />
      </TestWrapper>
    );

    // USD + Gold each repeat Up / Down / Flat
    expect(screen.getAllByText('Up')).toHaveLength(2);
    expect(screen.getAllByText('Down')).toHaveLength(2);
    expect(screen.getAllByText('Flat')).toHaveLength(2);

    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('allows selecting outcomes', () => {
    render(
      <TestWrapper>
        <MakeCallModal {...defaultProps} />
      </TestWrapper>
    );

    const usdUp = screen.getAllByText('Up')[0].closest('button');
    expect(usdUp).toBeTruthy();
    fireEvent.click(usdUp!);

    expect(usdUp).toHaveClass('border-cyan-500');
  });

  it('shows mini plan textarea', () => {
    render(
      <TestWrapper>
        <MakeCallModal {...defaultProps} />
      </TestWrapper>
    );

    const textarea = screen.getByPlaceholderText('Share your reasoning or strategy...');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('maxLength', '500');
  });

  it('updates mini plan text', () => {
    render(
      <TestWrapper>
        <MakeCallModal {...defaultProps} />
      </TestWrapper>
    );

    const textarea = screen.getByPlaceholderText('Share your reasoning or strategy...');
    fireEvent.change(textarea, { target: { value: 'Test plan' } });

    expect(textarea).toHaveValue('Test plan');
  });

  it('shows character count', () => {
    render(
      <TestWrapper>
        <MakeCallModal {...defaultProps} />
      </TestWrapper>
    );

    const textarea = screen.getByPlaceholderText('Share your reasoning or strategy...');
    fireEvent.change(textarea, { target: { value: 'Test' } });

    expect(screen.getByText('4/500')).toBeInTheDocument();
  });

  it('submit button is disabled when form is invalid', () => {
    render(
      <TestWrapper>
        <MakeCallModal {...defaultProps} />
      </TestWrapper>
    );

    const submitButton = screen.getByText('Submit Prediction');
    expect(submitButton).toBeDisabled();
  });

  it('submit button is enabled when all required fields are filled', () => {
    render(
      <TestWrapper>
        <MakeCallModal {...defaultProps} />
      </TestWrapper>
    );

    const usdUp = screen.getAllByText('Up')[0].closest('button');
    const goldUp = screen.getAllByText('Up')[1].closest('button');
    const volHigh = screen.getByText('High').closest('button');

    fireEvent.click(usdUp!);
    fireEvent.click(goldUp!);
    fireEvent.click(volHigh!);

    const submitButton = screen.getByText('Submit Prediction');
    expect(submitButton).not.toBeDisabled();
  });

  it('calls mutation with correct data on submit', async () => {
    mockMutateAsync.mockResolvedValue(undefined);

    render(
      <TestWrapper>
        <MakeCallModal {...defaultProps} />
      </TestWrapper>
    );

    const usdUp = screen.getAllByText('Up')[0].closest('button');
    const goldDown = screen.getAllByText('Down')[1].closest('button');
    const volHigh = screen.getByText('High').closest('button');
    const textarea = screen.getByPlaceholderText('Share your reasoning or strategy...');

    fireEvent.click(usdUp!);
    fireEvent.click(goldDown!);
    fireEvent.click(volHigh!);
    fireEvent.change(textarea, { target: { value: 'Test plan' } });

    // Submit
    const submitButton = screen.getByText('Submit Prediction');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        eventId: 'test-event-123',
        prediction_outcomes: {
          usd: 'up',
          gold: 'down',
          vol: 'high',
        },
        mini_plan: 'Test plan',
      });
    });
  });

  it('calls onClose after successful submission', async () => {
    mockMutateAsync.mockResolvedValue(undefined);

    render(
      <TestWrapper>
        <MakeCallModal {...defaultProps} />
      </TestWrapper>
    );

    const usdUp = screen.getAllByText('Up')[0].closest('button');
    const goldUp = screen.getAllByText('Up')[1].closest('button');
    const volHigh = screen.getByText('High').closest('button');

    fireEvent.click(usdUp!);
    fireEvent.click(goldUp!);
    fireEvent.click(volHigh!);

    const submitButton = screen.getByText('Submit Prediction');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('shows loading state during submission', () => {
    (useCreatePrediction as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    });

    render(
      <TestWrapper>
        <MakeCallModal {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Submitting...')).toBeInTheDocument();
  });

  it('resets form when modal closes', () => {
    const { rerender } = render(
      <TestWrapper>
        <MakeCallModal {...defaultProps} />
      </TestWrapper>
    );

    const usdUp = screen.getAllByText('Up')[0].closest('button');
    const textarea = screen.getByPlaceholderText('Share your reasoning or strategy...');

    fireEvent.click(usdUp!);
    fireEvent.change(textarea, { target: { value: 'Test' } });

    rerender(
      <TestWrapper>
        <MakeCallModal {...defaultProps} isOpen={false} />
      </TestWrapper>
    );

    rerender(
      <TestWrapper>
        <MakeCallModal {...defaultProps} isOpen={true} />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Share your reasoning or strategy...')).toHaveValue('');
    expect(screen.getAllByText('Up')[0].closest('button')).not.toHaveClass('border-cyan-500');
  });
});
