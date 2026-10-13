import { BiShareAlt } from 'react-icons/bi';
import { useState } from 'react';
import SocialShareOptions from '../SocialShareOptions';
import PublicLinkSocialMedia from '../PublicLinkSocialMedia';
import { BACKEND_URL } from '@/utils/GlobalVars';
import Avatar from '@/component/Avatar/Avatar';

interface CompactHeaderProps {
  user: any;
  shareUrl: string;
  onToggleSidebar: () => void;
  isSidebarExpanded: boolean;
  onToggleNavbar?: () => void;
  showNavbar?: boolean;
}

export default function CompactHeader({
  user,
  shareUrl,
  onToggleSidebar,
  isSidebarExpanded,
  onToggleNavbar,
  showNavbar,
}: CompactHeaderProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const accountLabel =
    user?.accountType === 'Demo'
      ? 'Demo'
      : user?.accountType === 'Funded'
        ? 'Funded'
        : 'Live';

  return (
    <div className='fixed left-0 right-0 top-0 z-50 border-b border-[var(--tt-line-1)] bg-[var(--tt-bg-0)]/95 backdrop-blur-md'>
      <div className='flex items-center justify-between gap-2 px-3 py-2.5 md:px-4'>
        <button
          type='button'
          onClick={onToggleSidebar}
          className='flex shrink-0 items-center gap-2 rounded-lg border border-transparent p-2 text-[var(--tt-fg-0)] transition-colors hover:border-[var(--tt-line-2)] hover:bg-[oklch(1_0_0_/0.04)]'
          title='Expand trader sidebar'
        >
          <svg
            className={`h-5 w-5 transition-transform duration-300 ${isSidebarExpanded ? 'rotate-90' : ''}`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            aria-hidden
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
          </svg>
        </button>

        <div className='flex min-w-0 flex-1 items-center justify-center gap-2 sm:gap-3'>
          <Avatar
            src={user.selectedAvatar ? BACKEND_URL + user.selectedAvatar : null}
            name={user?.userName || user?.firstName || user?.lastName}
            size='sm'
            className='shrink-0 ring-2 ring-[var(--tt-line-2)]'
          />
          <div className='min-w-0 text-center'>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              <h3 className='truncate text-sm font-semibold leading-tight text-[var(--tt-fg-0)] sm:text-base'>
                {user?.userName ?? 'Unknown User'}
              </h3>
              <span className='shrink-0 rounded-md border border-[var(--tt-line-2)] bg-[var(--tt-bg-1)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--tt-fg-3)]'>
                {accountLabel}
              </span>
            </div>
            {user?.socialMedia ? (
              <div className='mt-0.5 flex justify-center gap-1'>
                <PublicLinkSocialMedia socialMedia={user.socialMedia} compact />
              </div>
            ) : null}
          </div>
        </div>

        <div className='flex shrink-0 items-center gap-1.5'>
          <button
            type='button'
            className='rounded-full border border-[var(--tt-line-2)] bg-[var(--tt-bg-1)] p-2 text-[var(--tt-fg-0)] transition-colors hover:border-[var(--tt-line-3)] hover:bg-[oklch(1_0_0_/0.05)]'
            onClick={() => setIsShareModalOpen(true)}
            title='Share profile'
          >
            <BiShareAlt className='h-5 w-5' />
          </button>

          {onToggleNavbar ? (
            <button
              type='button'
              onClick={onToggleNavbar}
              className={`rounded-lg border p-2 transition-colors ${
                showNavbar
                  ? 'border-[var(--tt-brand)] bg-[oklch(0.72_0.14_195_/0.12)]'
                  : 'border-[var(--tt-line-2)] bg-[var(--tt-bg-1)] hover:border-[var(--tt-line-3)]'
              }`}
              title={showNavbar ? 'Hide navigation' : 'Show navigation'}
            >
              <img src='/logo.png' alt='' className='h-5 w-5 object-contain' />
            </button>
          ) : null}
        </div>

        <SocialShareOptions
          url={shareUrl}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      </div>
    </div>
  );
}
