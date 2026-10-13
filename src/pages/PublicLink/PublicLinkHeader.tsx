import { BiShareAlt } from 'react-icons/bi';
import SocialShareOptions from './SocialShareOptions';
import PublicLinkSocialMedia from './PublicLinkSocialMedia';
import { useEffect, useState } from 'react';
import formatNumber from '../../utils/UtilTools';
import AccountType from './header/AccountType';
import { BACKEND_URL } from '@/utils/GlobalVars';
import Avatar from '@/component/Avatar/Avatar';
import PublicLinkPanel from './components/PublicLinkPanel';

export default function PublicLinkHeader({
  shareUrl,
  dataMetrics,
  user,
}: {
  shareUrl: string;
  dataMetrics: any;
  user: any;
}) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [dataMode, setDataMode] = useState<number>(user?.profile?.dataMode);

  useEffect(() => {
    if (user) setDataMode(user?.profile?.dataMode);
  }, [user]);

  const locationLine =
    user?.country ||
    user?.profile?.country ||
    user?.profile?.location ||
    user?.profile?.city;

  return (
    <div className='mb-2 w-full'>
      <PublicLinkPanel className='relative'>
        <div className='mb-3 flex items-start justify-between gap-2'>
          <div className='min-w-0 flex-1'>
            <AccountType user={user} />
          </div>
          <button
            type='button'
            className='shrink-0 rounded-lg border border-[var(--tt-line-2)] bg-[var(--tt-bg-0)] p-2 text-[var(--tt-fg-0)] transition-colors hover:border-[var(--tt-line-3)] hover:bg-[oklch(1_0_0_/0.05)]'
            onClick={() => setIsShareModalOpen(true)}
            title='Share'
          >
            <BiShareAlt className='text-xl' />
          </button>
        </div>

        <div className='flex flex-col items-center'>
          <Avatar
            src={user.selectedAvatar ? BACKEND_URL + user.selectedAvatar : null}
            name={user?.userName || user?.firstName || user?.lastName}
            size='xl'
            className='ring-2 ring-[var(--tt-line-2)] ring-offset-2 ring-offset-[var(--tt-bg-1)]'
          />
          <h2 className='mt-4 text-center text-lg font-semibold text-[var(--tt-fg-0)]'>
            {user?.userName ?? 'Unknown User'}
          </h2>
          {locationLine ? (
            <p className='mt-1 text-center text-sm text-[var(--tt-fg-3)]'>{locationLine}</p>
          ) : null}
          <p className='mt-1 text-center text-sm text-[var(--tt-fg-3)]'>
            Trading using{' '}
            <span className='text-[var(--tt-brand)]'>{user.broker}</span>
          </p>
        </div>

        <div className='mt-4 flex justify-between gap-2 rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] p-4'>
          <div className='text-center'>
            <p className='text-xs text-[var(--tt-fg-3)]'>Total Trades</p>
            <p className='text-sm font-medium text-[var(--tt-fg-0)]'>{dataMetrics?.trades}</p>
          </div>
          <div className='text-center'>
            <p className='text-xs text-[var(--tt-fg-3)]'>
              {dataMode == 1 ? 'Monthly Gain' : 'Highest Balance'}
            </p>
            <p className='text-sm font-medium text-[var(--tt-profit)]'>
              {dataMode == 1
                ? `${formatNumber(dataMetrics?.monthlyGain)}%`
                : `$${formatNumber(dataMetrics?.highestBalance) ?? 0}`}
            </p>
          </div>
        </div>

        {user?.profile?.description ? (
          <p className='mx-auto mt-4 max-w-md border-b border-[var(--tt-line-1)] pb-2 text-center text-sm text-[var(--tt-fg-2)]'>
            {user?.profile?.description}
          </p>
        ) : null}

        <div className='mt-4 flex justify-center'>
          {user?.socialMedia ? <PublicLinkSocialMedia socialMedia={user.socialMedia} /> : null}
        </div>
      </PublicLinkPanel>

      <SocialShareOptions
        url={shareUrl}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
