import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface DynamicLayoutProps {
  asideContent: ReactNode;
  mainContent: ReactNode;
  defaultExpanded?: boolean;
  compactHeader?: ReactNode;
  isExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  /** Shown left of the collapse chevron when the sidebar is expanded (e.g. nav toggle for logged-in viewers). */
  expandedLeadingActions?: ReactNode;
}

export default function DynamicLayout({
  asideContent,
  mainContent,
  defaultExpanded = true,
  compactHeader,
  isExpanded: controlledExpanded,
  onToggle,
  expandedLeadingActions,
}: DynamicLayoutProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const [isMobile, setIsMobile] = useState(false);

  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  const collapseSidebar = useCallback(() => {
    if (isControlled) {
      onToggle?.(false);
    } else {
      setInternalExpanded(false);
    }
  }, [isControlled, onToggle]);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && isExpanded) {
        collapseSidebar();
      }
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isExpanded, collapseSidebar]);

  const toggleExpanded = () => {
    const newValue = !isExpanded;
    if (onToggle) {
      onToggle(newValue);
    } else {
      setInternalExpanded(newValue);
    }
  };

  return (
    <div className='flex h-full min-h-screen min-w-0'>
      {compactHeader && !isExpanded && compactHeader}

      {isMobile && isExpanded && (
        <div
          className='fixed inset-0 z-30 bg-black/70 md:hidden'
          onClick={collapseSidebar}
          aria-hidden
        />
      )}

      <aside
        className={`
        shrink-0 transition-all duration-300 ease-in-out bg-[var(--tt-bg-0)]
        ${
          isExpanded
            ? 'fixed z-40 h-full w-80 max-w-[min(100vw,20rem)] md:relative md:max-w-none md:w-96'
            : 'w-0 md:w-16'
        }
        ${isMobile && !isExpanded ? 'hidden' : ''}
        overflow-hidden
      `}
        aria-expanded={isExpanded}
      >
        <div className='flex h-full flex-col border-r border-[var(--tt-line-1)] md:border-r-0'>
          <div className='flex items-center justify-between gap-2 p-2'>
            <div className='flex min-w-0 flex-1 items-center justify-start gap-2'>
              {isExpanded ? expandedLeadingActions : null}
            </div>
            <button
              type='button'
              onClick={toggleExpanded}
              className='shrink-0 rounded-lg border border-[var(--tt-line-2)] bg-[var(--tt-bg-1)] p-2 text-[var(--tt-fg-0)] transition-colors hover:bg-[oklch(1_0_0_/0.04)]'
              title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isExpanded ? (
                <ChevronLeftIcon className='h-5 w-5' />
              ) : (
                <ChevronRightIcon className='h-5 w-5' />
              )}
            </button>
          </div>

          {isExpanded && (
            <div className='flex-1 overflow-y-auto px-2 pb-4'>
              {asideContent}
            </div>
          )}
        </div>
      </aside>

      <div className={`min-w-0 flex-1 overflow-x-hidden ${!isExpanded ? 'pt-16' : ''}`}>
        <div className='h-full min-w-0 max-w-full'>{mainContent}</div>
      </div>
    </div>
  );
}
