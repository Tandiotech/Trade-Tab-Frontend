import { useEffect, useState, useRef } from 'react';

const AccountType = ({ user }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const tooltipText =
    user?.account_type === 'ACCOUNT_TRADE_MODE_REAL'
      ? 'This is a Real Account where you trade with actual money.'
      : 'This is a Demo Account used for practice trading without real money.';

  // Manejo del efecto al cambiar el hover
  useEffect(() => {
    if (isHovered && hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current); // Cancelar el timeout si vuelve a estar en hover
    }
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current); // Cancelar la desaparición si el mouse vuelve a entrar
    }
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsHovered(false); // Desaparecer después de 1 segundo
    }, 500);
  };

  return (
    <div
      className='relative inline-block cursor-pointer mx-auto'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className='font-sans text-sm font-semibold text-[var(--tt-fg-0)]'>
        {user?.account_type === 'ACCOUNT_TRADE_MODE_REAL' ? 'Real' : 'Demo'} account
      </span>

      {/* Tooltip */}
      {isHovered && (
        <div className='absolute left-0 z-20 w-48 rounded-md border border-[var(--tt-line-1)] bg-[var(--tt-bg-1)] p-2 text-sm text-[var(--tt-fg-1)] shadow-lg'>
          {tooltipText}
        </div>
      )}
    </div>
  );
};

export default AccountType;
