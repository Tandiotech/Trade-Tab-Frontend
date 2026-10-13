import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const HeaderSection = ({ limit, used, onAddAccount, atCap, showProgress }: any) => (
  <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
    <div>
      <h2 className='text-2xl font-semibold text-white'>Your Accounts</h2>
      <div className='flex items-center gap-3'>
        <Progress value={(used / limit) * 100} className='h-2' />
        <span className='text-sm text-slate-400'>
          {used} / {limit} used
        </span>
      </div>
    </div>
    <Button disabled={atCap || showProgress} onClick={onAddAccount} className='gap-2'>
      <Plus className='h-4 w-4' /> Add account
    </Button>
  </div>
);

export default HeaderSection;
