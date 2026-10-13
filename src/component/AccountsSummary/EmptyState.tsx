import React from 'react';
import { Wallet, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyState = ({ limit, onAddAccount }: { limit: number; onAddAccount: () => void }) => (
  <div className='border-2 border-dashed border-slate-700 rounded-2xl p-10 text-center bg-slate-800/30'>
    <Wallet className='h-6 w-6 mx-auto text-slate-400 mb-3' />
    <h3 className='text-xl font-semibold text-white'>Add your first account</h3>
    <p className='text-sm text-slate-400 mb-4'>
      You can add up to <span className='text-white font-medium'>{limit}</span> accounts.
    </p>
    <Button className='gap-2' onClick={onAddAccount}>
      <Plus className='h-4 w-4' /> Connect account
    </Button>
  </div>
);

export default EmptyState;
