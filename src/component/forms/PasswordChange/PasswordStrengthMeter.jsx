/**
 * Password strength meter component
 */
const PasswordStrengthMeter = ({ score, label, color }) => {
  return (
    <div className='mb-3'>
      <div className='flex justify-between items-center mb-1'>
        <span className='text-sm font-medium text-bgray-500 dark:text-darkblack-300'>
          Password Strength
        </span>
        <span className='text-sm font-medium' style={{ color }}>
          {label}
        </span>
      </div>
      <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
        <div
          className='h-2.5 rounded-full transition-all duration-300'
          style={{
            width: `${(score / 4) * 100}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
