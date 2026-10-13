/**
 * @deprecated Use PeriodPresets from timeNavigation — kept for any legacy imports.
 */
import { PeriodPresets } from '@/component/BtnDespokt/timeNavigation/PeriodPresets';
import { getPeriodBoundsFromGrowth } from '@/component/BtnDespokt/timeNavigation/periodPresetUtils';
import { parseYMD } from './utils/metricsDateRange';

type Props = {
  dateStart: Date | string | null;
  dateEnd: Date | string | null;
  onRange: (start: Date, end: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
};

export default function DateRangeChips({
  dateStart,
  dateEnd,
  onRange,
  minDate,
  maxDate,
  className,
}: Props) {
  const startStr = typeof dateStart === 'string' ? dateStart : dateStart ? dateStart.toISOString().split('T')[0] : null;
  const endStr = typeof dateEnd === 'string' ? dateEnd : dateEnd ? dateEnd.toISOString().split('T')[0] : null;

  const anchor = maxDate ?? new Date();
  const dataStart = minDate ?? anchor;
  const dataEnd = maxDate ?? anchor;

  return (
    <PeriodPresets
      dateStart={startStr}
      dateEnd={endStr}
      anchor={anchor}
      dataStart={dataStart}
      dataEnd={dataEnd}
      onRange={(s, e) => onRange(parseYMD(s), parseYMD(e))}
      layoutId='legacy-period-preset'
    />
  );
}

export { getPeriodBoundsFromGrowth };
