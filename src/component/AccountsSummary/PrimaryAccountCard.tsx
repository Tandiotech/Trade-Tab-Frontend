import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, AlertTriangle, Settings } from 'lucide-react';
import StatusDot from './StatusDot';
import Metric from './Metric';
import { EnrichedAccount } from './types';
import { fmtCurrency, fmtPct } from './utils';

const PrimaryAccountCard = ({
  account,
  onManage,
}: {
  account: EnrichedAccount;
  onManage: (a: EnrichedAccount) => void;
}) => {
  const pnlColor =
    account.realizedPnl && account.realizedPnl >= 0 ? 'text-emerald-500' : 'text-rose-500';
  const isWarning = account.status !== 'ok';

  return (
    <Card className='bg-slate-800 border-slate-700 hover:border-slate-600 transition relative overflow-hidden'>
      <CardContent className='p-6 md:p-8 grid gap-6'>
        <div className='flex justify-between items-center flex-wrap gap-3'>
          <div className='flex items-center gap-3'>
            <StatusDot status={account.status} />
            <div>
              <p className='text-sm text-slate-400 truncate'>
                {account.broker} · {account.mt} · #{account.number}
              </p>
              <h3 className='text-xl font-semibold text-white truncate'>{account.name}</h3>
            </div>
          </div>
          {isWarning && (
            <div className='flex items-center gap-2 text-amber-500 text-sm'>
              <AlertTriangle className='h-4 w-4' />
              <span>Review data</span>
            </div>
          )}
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
          <Metric label='Balance' value={`${account.currency} $${fmtCurrency(account.balance)}`} />
          {account.realizedPnl != null && (
            <Metric
              label='Realized PnL'
              value={`${account.realizedPnl >= 0 ? '+' : ''}$${fmtCurrency(account.realizedPnl)}`}
              color={pnlColor}
            />
          )}
          {account.trades != null && <Metric label='Trades' value={String(account.trades)} />}
          {account.winRate != null && <Metric label='Win Rate' value={fmtPct(account.winRate)} />}
          {account.maxDrawdown != null && (
            <Metric label='Drawdown' value={fmtPct(account.maxDrawdown)} />
          )}
        </div>

        <div className='flex justify-between items-center text-sm text-slate-400 flex-wrap gap-3'>
          <div className='flex items-center gap-2'>
            <CalendarClock className='h-4 w-4' />
            <span>Last 30 days{account.lastUpdated && ` · Updated ${account.lastUpdated}`}</span>
          </div>
          <Button variant='secondary' size='sm' className='gap-2' onClick={() => onManage(account)}>
            <Settings className='h-4 w-4' /> Manage
          </Button>
        </div>
      </CardContent>
      <div className='absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent pointer-events-none' />
    </Card>
  );
};

export default PrimaryAccountCard;
