import { useState, useMemo, useEffect } from 'react';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { useAccountState } from '@/context/accounts/useAccountState';
import { useProgressBar } from '@/context/ProgressBarContext';
import { useUser } from '@/context/UserContext';
import { maxAccountsUtils } from '@/utils/maxAccountsUtils';
import AccountSettingsModal from './AccountSettingsModal';
import HeaderSection from './HeaderSection';
import PrimaryAccountCard from './PrimaryAccountCard';
import EmptyState from './EmptyState';
import AccountGrid from './AccountGrid';
import { EnrichedAccount } from './types';
import { getRelativeTime } from './utils';

export default function AccountsSummary() {
  const { user } = useUser();
  const LIMIT = maxAccountsUtils.getMaxAccounts(user);
  const { accounts, deleteAccount, refreshAccounts } = useMTAccounts();
  const { setHandleActive } = useAccountState();
  const { showProgressBar } = useProgressBar();

  const [sortKey, setSortKey] = useState<'updatedAt' | 'balance' | 'name'>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [managingAccount, setManagingAccount] = useState<EnrichedAccount | null>(null);

  // ⏳ Sync accounts missing data
  useEffect(() => {
    // REMOVED: This loop caused infinite re-renders. Backend should provide complete data on JOB_DONE. Frontend must not auto-repair data.
  }, [accounts]);

  const enriched = useMemo<EnrichedAccount[]>(
    () =>
      accounts.map((a, i) => ({
        _id: a._id,
        external_id: a.external_id,
        name: a.name || `Account ${i + 1}`,
        mt: (a.platform?.toUpperCase() === 'MT5' ? 'MT5' : 'MT4') as 'MT4' | 'MT5',
        number: String(a.account_number),
        broker: a.broker || 'Unknown',
        currency: a.currency || 'USD',
        balance: a.balance || 0,
        platform: a.platform,
        updatedAt: a.updatedAt,
        lastUpdated: getRelativeTime(a.updatedAt),
        status: a.balance == null || isNaN(a.balance) || a.broker == null ? 'warning' : 'ok',
        isPrimary: i === 0,
      })),
    [accounts]
  );

  const sorted = useMemo(() => {
    const dir = sortDirection === 'asc' ? 1 : -1;
    return [...enriched].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      // always compare as string to avoid overload resolution issues
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [enriched, sortKey, sortDirection]);

  const primary = sorted[0];
  const rest = sorted.slice(1);

  return (
    <div className='space-y-6'>
      <HeaderSection
        limit={LIMIT}
        used={enriched.length}
        onAddAccount={() => setHandleActive(true)}
        atCap={enriched.length >= LIMIT}
        showProgress={showProgressBar}
      />
      {primary ? (
        <PrimaryAccountCard account={primary} onManage={setManagingAccount} />
      ) : (
        <EmptyState limit={LIMIT} onAddAccount={() => setHandleActive(true)} />
      )}
      {rest.length > 0 && (
        <AccountGrid
          accounts={rest}
          onManage={setManagingAccount}
          sortKey={sortKey}
          sortDirection={sortDirection}
          setSortKey={setSortKey}
          setSortDirection={setSortDirection}
        />
      )}
      {managingAccount && (
        <AccountSettingsModal
          account={managingAccount}
          isOpen={!!managingAccount}
          onClose={() => setManagingAccount(null)}
          onDelete={deleteAccount}
        />
      )}
    </div>
  );
}
