import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

/**
 * Reusable password input component with visibility toggle
 */
const PasswordInput = ({
  id,
  value,
  onChange,
  label,
  placeholder,
  error,
  errorMessage,
  className = '',
}) => {
  const [revealPassword, setRevealPassword] = useState(false);

  const toggleRevealPassword = () => {
    setRevealPassword(!revealPassword);
  };

  return (
    <div className={`relative flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className='text-sm md:text-base block mb-3 font-medium text-bgray-500 dark:text-darkblack-300'
        >
          {label}
        </label>
      )}
      <div className='flex items-center'>
        <div className='relative w-full'>
          <input
            id={id}
            type={revealPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            className={`bg-bgray-50 dark:bg-darkblack-500 rounded-lg w-full h-14 px-4 py-5 border-0 focus:border ${
              error ? 'border-red-500 focus:border-red-500' : 'focus:border-success-300'
            } focus:ring-0`}
            placeholder={placeholder}
          />
          <style jsx>{`
            input::-ms-reveal,
            input::-ms-clear {
              display: none;
            }
          `}</style>
        </div>
        <button
          aria-label='Toggle Password Visibility'
          className='text-bgray-700 h-14 px-4 ml-4 rounded-lg bg-[#2B2933] flex-shrink-0'
          onClick={toggleRevealPassword}
          type='button'
        >
          {revealPassword ? (
            <FaRegEyeSlash className='w-6 h-6 sm:w-8 sm:h-8 opacity-40' />
          ) : (
            <FaRegEye className='w-6 h-6 sm:w-8 sm:h-8 opacity-40' />
          )}
        </button>
      </div>
      {error && errorMessage && <p className='text-red-500 text-sm mt-1'>{errorMessage}</p>}
    </div>
  );
};

export default PasswordInput;
