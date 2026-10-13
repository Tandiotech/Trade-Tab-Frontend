/**
 * Password requirements component
 */
const PasswordRequirements = ({ requirements }) => {
  const requirementsList = [
    { key: 'length', label: 'At least 8 characters' },
    { key: 'numbers', label: 'Numbers' },
    { key: 'uppercase', label: 'Uppercase letters' },
    { key: 'special', label: 'Special characters' },
  ];

  return (
    <div className='mt-3'>
      <p className='text-sm md:text-base text-bgray-500 dark:text-darkblack-300 mb-2'>
        Password must contain:
      </p>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
        {requirementsList.map(({ key, label }) => (
          <div key={key} className='flex items-center'>
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${
                requirements[key] ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              {requirements[key] && <span className='text-white text-xs'>✓</span>}
            </div>
            <span className='text-sm text-bgray-500 dark:text-darkblack-300'>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordRequirements;
