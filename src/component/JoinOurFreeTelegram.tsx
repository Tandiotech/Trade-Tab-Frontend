import { OFFICIAL_TELEGRAM } from '@/utils/GlobalVars';
import { FaTelegram } from 'react-icons/fa';

type Props = {
  text?: string;
  className?: string;
  telegramLink?: string;
  preparedMessage?: string;
  /** Compact header chip: icon + short label, matches toolbar height */
  compact?: boolean;
};

export default function JoinOurFreeTelegram({
  text = 'Join our free telegram',
  className = 'w-full',
  telegramLink = OFFICIAL_TELEGRAM,
  preparedMessage = '',
  compact = false,
}: Props) {
  const telegramUrl = preparedMessage
    ? `${telegramLink}?text=${encodeURIComponent(preparedMessage)}`
    : telegramLink;

  if (compact) {
    return (
      <a
        className={`inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-sky-500/35 bg-sky-600/85 px-3 text-sm font-medium text-white transition hover:border-sky-400/50 hover:bg-sky-500 ${className}`}
        href={telegramUrl}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={text}
      >
        <FaTelegram className='h-[1.05rem] w-[1.05rem] shrink-0' aria-hidden />
        <span className='hidden lg:inline max-w-[9rem] truncate'>Community</span>
      </a>
    );
  }

  return (
    <a
      className={`${className} flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-sky-500/40 bg-sky-600/90 text-white font-medium transition hover:bg-sky-500 hover:border-sky-400/60`}
      href={telegramUrl}
      target='_blank'
      rel='noopener noreferrer'
      aria-label='Join TradeTab Telegram Community'
    >
      <FaTelegram size={16} className='shrink-0' aria-hidden />
      <span className='text-sm font-semibold hidden md:inline'>{text}</span>
    </a>
  );
}
