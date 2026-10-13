export default function GlobalModal({
  children,
  isActive,
  onClose,
  bg_color = 'bg-slate-950/90',
  width = 'lg:w-1/3',
  height = 'h-[90vh]',
  variant = 'legacy',
}) {
  const isTt = variant === 'tt';

  return (
    <div
      className={`modal fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 ${
        isTt ? 'bg-[oklch(0.06_0.012_250/0.72)] backdrop-blur-sm' : 'bg-transparent backdrop-blur-lg'
      } ${isActive ? '' : 'hidden'}`}
      id='multi-step-modal'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
    >
      <div
        className={
          isTt
            ? `entry_modal relative z-50 flex w-full max-w-5xl flex-col overflow-hidden rounded-[var(--tt-radius-xl)] border border-[var(--tt-line-1)] bg-[var(--tt-bg-1)] text-left shadow-[0_24px_80px_oklch(0_0_0/0.5)] transition-all ${height} ${width}`
            : `entry_modal relative z-50 mx-1 transform overflow-y-auto rounded-lg border border-teal-500 md:mx-5 md:w-full lg:mx-0 ${height} ${width} ${bg_color} text-left transition-all`
        }
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
