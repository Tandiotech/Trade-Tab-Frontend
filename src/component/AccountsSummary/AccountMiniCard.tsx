import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';
import StatusDot from './StatusDot';
import { EnrichedAccount } from './types';
import { fmtCurrency } from './utils';

const AccountMiniCard = ({
  account,
  onManage,
}: {
  account: EnrichedAccount;
  onManage: (a: EnrichedAccount) => void;
}) => {
  const pnlColor =
    account.realizedPnl && account.realizedPnl >= 0 ? 'text-emerald-500' : 'text-rose-500';
  return (
    <Card className='min-w-[240px] max-w-[280px] bg-slate-800 border-slate-700 hover:border-slate-600 transition'>
      <CardContent className='p-4 grid gap-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <StatusDot status={account.status} />
            <span className='font-medium text-white truncate'>{account.name}</span>
          </div>
          <Badge
            variant='secondary'
            className='text-xs bg-slate-700 text-slate-200 border-slate-600'
          >
            {account.mt}
          </Badge>
        </div>

        <p className='text-sm text-slate-400 truncate'>
          {account.broker} · #{account.number}
        </p>

        <div className='flex justify-between text-sm'>
          <div>
            <div className='text-slate-500 text-xs'>Balance</div>
            <div className='text-white font-semibold'>
              {account.currency} ${fmtCurrency(account.balance)}
            </div>
          </div>
          {account.realizedPnl != null && (
            <div>
              <div className='text-slate-500 text-xs'>PnL</div>
              <div className={`${pnlColor} font-semibold`}>
                {account.realizedPnl >= 0 ? '+' : ''}${fmtCurrency(account.realizedPnl)}
              </div>
            </div>
          )}
        </div>

        <div className='flex justify-between items-center pt-2 border-t border-slate-700'>
          <span className='text-xs text-slate-500'>{account.lastUpdated || 'Recently'}</span>
          <Button
            variant='ghost'
            size='sm'
            className='h-7 px-2 text-xs text-slate-400 hover:text-white'
            onClick={() => onManage(account)}
          >
            <Settings className='h-3 w-3' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountMiniCard;
