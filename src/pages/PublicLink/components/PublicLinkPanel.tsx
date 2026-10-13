import type { ReactNode } from 'react';

type PublicLinkPanelProps = {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md';
};

const pad = { sm: 'p-2.5', md: 'p-3' };

/**
 * Shared surface for public profile sidebar sections (matches tt-theme tokens).
 */
export default function PublicLinkPanel({
  children,
  className = '',
  padding = 'md',
}: PublicLinkPanelProps) {
  return (
    <div
      className={`rounded-[var(--tt-radius-lg)] border border-[var(--tt-line-1)] bg-[var(--tt-bg-1)] text-[var(--tt-fg-1)] shadow-sm transition-colors duration-200 hover:border-[var(--tt-line-2)] ${pad[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
