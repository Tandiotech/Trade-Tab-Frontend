import { Icon_Total_Widget } from '../sidebar/icons';
import Loading2 from '../loader/Loading2/Loading2';
// import { formaterCamelCase } from '../../utils/formaterCamelCase';
import { SeparadorDecimal } from '../../utils/SeparadorDecimal';

export default function PublicLinkCardData({
  value = '',
  // title,
  showPercent = true,
  loadingData = false,
  dataMetrics,
  dataMode = 0, // 0 para absoluto, 1 para relativo
}) {
  const formatValue = val => {
    if (dataMode == 0) {
      // Modo absoluto
      return `$${parseFloat(val).toFixed(2)}`;
    } else {
      // Modo relativo
      return `${parseFloat(val).toFixed(2)}%`;
    }
  };

  return (
    <div className='relative overflow-hidden rounded-[var(--tt-radius-lg)] border border-[var(--tt-line-1)] bg-[var(--tt-bg-1)] px-5 py-6 text-[var(--tt-fg-1)] shadow-sm'>
      <div className='mb-5 flex h-fit items-center justify-between md:mb-8 lg:mb-5'>
        <div className='flex items-center'>
          <span className='whitespace-nowrap text-lg font-semibold text-[var(--tt-fg-0)] lg:text-xl'>
            {dataMode == 0 ? 'Balance' : 'Absolute Gain'}
          </span>
        </div>
      </div>

      <div className='flex h-fit items-end justify-between'>
        <div className='flex-1'>
          {typeof value === 'object' && value !== null ? (
            <>{value}</>
          ) : loadingData ? (
            <Loading2 />
          ) : (
            <p className='native-100 p-1 py-3 text-center text-lg font-bold leading-[48px] text-[var(--tt-fg-0)]'>
              {dataMode == 0
                ? SeparadorDecimal(formatValue(dataMetrics?.balance ?? 0))
                : SeparadorDecimal(formatValue(dataMetrics?.absoluteGain ?? 0))}
            </p>
          )}

          {showPercent && (
            <div className='flex items-center space-x-2'>
              <span>
                <Icon_Total_Widget />
              </span>
              <div className='flex flex-row items-start justify-end space-x-2 2xl:flex-row xl:flex-col xl:space-x-0 2xl:space-x-2'>
                <span className='text-sm font-medium text-[var(--tt-fg-3)]'>
                  This excludes all second deposits and withdrawls
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
