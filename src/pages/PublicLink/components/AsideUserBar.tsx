import PublicLinkCardData from '@/component/widget/PublicLinkCardData';
import PublicLinkHeader from '../PublicLinkHeader';
import formatNumber from '@/utils/UtilTools';
import { SeparadorDecimal } from '@/utils/SeparadorDecimal';
import MedalShowcase from '../medalShowCase/MedalShowcase';
import AdditionalMetrics from './AdditionalMetrics';
import PublicLinkPanel from './PublicLinkPanel';

export default function AsideUserBar({
  username,
  account,
  dataMetrics,
  user,
  publicAccount,
  trades,
}: {
  username?: string;
  account?: string;
  dataMetrics: any;
  user: any;
  publicAccount: any;
  trades: any[];
}) {
  return (
    <aside className='flex h-full w-full flex-col gap-3'>
      <PublicLinkHeader
        shareUrl={`${window.location.host}/${username}/${account}`}
        dataMetrics={dataMetrics}
        user={user}
      />

      <div className='flex flex-col gap-2'>
        <PublicLinkCardData
          value={`${dataMetrics[publicAccount?.timeFrame]}`}
          dataMetrics={dataMetrics}
          dataMode={user?.profile?.dataMode}
        />

        <div className='grid w-full grid-cols-1 gap-2 sm:grid-cols-2'>
          <PublicLinkPanel padding='sm' className='text-center'>
            <p className='text-xs text-[var(--tt-fg-3)] sm:text-sm'>
              {user?.profile?.dataMode == '1' ? 'Daily Gain' : 'Best Trade'}
            </p>
            <p className='mt-1 truncate text-sm font-semibold text-[var(--tt-profit)] sm:text-base'>
              {user?.profile?.dataMode == '1'
                ? `${formatNumber(dataMetrics?.dailyGain) ?? 0}%`
                : `$${formatNumber(dataMetrics?.bestTrade) ?? 0}`}
            </p>
          </PublicLinkPanel>

          <PublicLinkPanel padding='sm' className='text-center'>
            <p className='text-xs text-[var(--tt-fg-3)] sm:text-sm'>
              {user?.profile?.dataMode == '1' ? 'Days Since Trading Started' : 'Equity'}
            </p>
            <p className='mt-1 truncate text-sm font-semibold text-[var(--tt-profit)] sm:text-base'>
              {user?.profile?.dataMode == '1'
                ? dataMetrics?.daysSinceTradingStarted?.toFixed(0)
                : `$${SeparadorDecimal(dataMetrics?.equity?.toFixed(2))}`}
            </p>
          </PublicLinkPanel>
        </div>
      </div>

      {trades?.length > 0 && (
        <PublicLinkPanel className='px-3 py-2'>
          <MedalShowcase trades={trades} />
        </PublicLinkPanel>
      )}

      <AdditionalMetrics dataMetrics={dataMetrics} dataMode={user?.profile?.dataMode} trades={trades} />
    </aside>
  );
}
