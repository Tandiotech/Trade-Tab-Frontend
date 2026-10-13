import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import VisionScoreBadge, { VisionScoreBadgeCompact } from '../VisionScoreBadge';

describe('VisionScoreBadge', () => {
  it('renders bronze tier correctly', () => {
    render(<VisionScoreBadge score={500} />);

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('bronze')).toBeInTheDocument();
    expect(screen.getByText('🥉')).toBeInTheDocument();
  });

  it('renders silver tier correctly', () => {
    render(<VisionScoreBadge score={1050} />);

    expect(screen.getByText('1,050')).toBeInTheDocument();
    expect(screen.getByText('silver')).toBeInTheDocument();
    expect(screen.getByText('🥈')).toBeInTheDocument();
  });

  it('renders gold tier correctly', () => {
    render(<VisionScoreBadge score={1150} />);

    expect(screen.getByText('1,150')).toBeInTheDocument();
    expect(screen.getByText('gold')).toBeInTheDocument();
    expect(screen.getByText('🥇')).toBeInTheDocument();
  });

  it('renders diamond tier correctly', () => {
    render(<VisionScoreBadge score={1250} />);

    expect(screen.getByText('1,250')).toBeInTheDocument();
    expect(screen.getByText('diamond')).toBeInTheDocument();
    expect(screen.getByText('💎')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<VisionScoreBadge score={1000} size='sm' />);
    expect(screen.getAllByText('1,000')[0].closest('div')).toHaveClass('px-2 py-1 text-xs');

    rerender(<VisionScoreBadge score={1000} size='md' />);
    expect(screen.getAllByText('1,000')[0].closest('div')).toHaveClass('px-3 py-1.5 text-sm');

    rerender(<VisionScoreBadge score={1000} size='lg' />);
    expect(screen.getAllByText('1,000')[0].closest('div')).toHaveClass('px-4 py-2 text-base');
  });

  it('hides score when showScore is false', () => {
    render(<VisionScoreBadge score={1000} showScore={false} />);

    expect(screen.queryByText('1,000')).not.toBeInTheDocument();
    expect(screen.getByText('silver')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<VisionScoreBadge score={1000} className='custom-class' />);

    expect(screen.getAllByText('1,000')[0].closest('div')).toHaveClass('custom-class');
  });
});

describe('VisionScoreBadgeCompact', () => {
  it('renders compact version correctly', () => {
    render(<VisionScoreBadgeCompact score={1000} />);

    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('🥈')).toBeInTheDocument();
  });

  it('has correct title attribute', () => {
    render(<VisionScoreBadgeCompact score={1000} />);

    const badge = screen.getByTitle('Vision Score: 1000 (silver)');
    expect(badge).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<VisionScoreBadgeCompact score={1000} className='custom-class' />);

    expect(screen.getByTitle('Vision Score: 1000 (silver)')).toHaveClass('custom-class');
  });
});
