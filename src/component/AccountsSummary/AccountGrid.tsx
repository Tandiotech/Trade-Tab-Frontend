import React from 'react';
import { Button } from '@/components/ui/button';
import AccountMiniCard from './AccountMiniCard';
import { EnrichedAccount } from './types';

const AccountGrid = ({
  accounts,
  onManage,
  sortKey,
  sortDirection,
  setSortKey,
  setSortDirection,
}: any) => (
  <div className='grid gap-3'>
    <div className='flex justify-between items-center'>
      <h3 className='text-sm text-slate-400'>Other accounts</h3>
      <div className='flex gap-2'>
        {['name', 'balance', 'updatedAt'].map(k => (
          <Button
            key={k}
            variant={sortKey === k ? 'secondary' : 'ghost'}
            size='sm'
            className='text-xs'
            onClick={() => {
              if (sortKey === k) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
              else setSortKey(k);
            }}
          >
            {k} {sortKey === k && (sortDirection === 'asc' ? '↑' : '↓')}
          </Button>
        ))}
      </div>
    </div>
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {accounts.map((a: EnrichedAccount) => (
        <AccountMiniCard key={a.external_id} account={a} onManage={onManage} />
      ))}
    </div>
  </div>
);

export default AccountGrid;
