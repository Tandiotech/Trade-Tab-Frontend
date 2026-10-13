import { useJournalContext } from '@/context/JournalProvider';
import SLTSetupWizard from './SLTSetupWizard';
import SLTProgressCard from './SLTProgressCard';

export interface ProjectionForm {
  target: number;
  tradesPerDay: number;
  targetType: 'percentage' | 'dollar';
  lifeTime: number;
  weekends: boolean;
}

type SLTFormProps = {
  monthPnl?: number;
  tradingDaysThisMonth?: number;
};

const SLTForm = ({ monthPnl = 0, tradingDaysThisMonth = 0 }: SLTFormProps) => {
  const { stlPlan } = useJournalContext();

  if (!stlPlan) {
    return <SLTSetupWizard />;
  }

  return (
    <SLTProgressCard
      stlPlan={stlPlan}
      monthPnl={monthPnl}
      tradingDaysThisMonth={tradingDaysThisMonth}
    />
  );
};

export default SLTForm;
