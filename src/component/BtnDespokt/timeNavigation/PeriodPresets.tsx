import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  PERIOD_PRESETS,
  getActivePresetId,
  isPresetCovered,
  type PeriodPresetId,
} from './periodPresetUtils';

interface PeriodPresetsProps {
  dateStart: string | null;
  dateEnd: string | null;
  anchor: Date;
  dataStart: Date;
  dataEnd: Date;
  onRange: (start: string, end: string) => void;
  layoutId?: string;
  compact?: boolean;
}

export function PeriodPresets({
  dateStart,
  dateEnd,
  anchor,
  dataStart,
  dataEnd,
  onRange,
  layoutId = 'period-preset-active',
  compact = false,
}: PeriodPresetsProps) {
  const activeId = getActivePresetId(dateStart, dateEnd, anchor, dataStart, dataEnd);

  const visible = PERIOD_PRESETS.filter(p => isPresetCovered(p, anchor, dataStart, dataEnd));

  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${compact ? 'flex-nowrap' : ''}`}
      role='group'
      aria-label='Quick period presets'
    >
      {visible.map(preset => {
        const isActive = activeId === preset.id;
        return (
          <button
            key={preset.id}
            type='button'
            onClick={() => {
              const { start, end } = preset.calc(anchor, dataStart, dataEnd);
              onRange(start, end);
            }}
            className={cn(
              'relative shrink-0 rounded-full border font-semibold transition-colors',
              compact
                ? 'px-2 py-0.5 text-[10px]'
                : 'px-2.5 py-1 text-[11px] sm:px-3 sm:text-xs',
              isActive
                ? 'border-[var(--tt-brand)] bg-[var(--tt-brand-dim)] text-[var(--tt-fg-0)]'
                : 'border-[var(--tt-line-1)] bg-[oklch(1_0_0_/0.03)] text-[var(--tt-fg-2)] hover:border-[var(--tt-line-2)] hover:text-[var(--tt-fg-0)]'
            )}
            aria-pressed={isActive}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className='absolute inset-0 rounded-full border border-[var(--tt-brand)] bg-[var(--tt-brand-dim)]'
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className='relative z-[1]'>{preset.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export type { PeriodPresetId };
