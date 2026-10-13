import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AnimatedText from '../../AnimateText';

function AddAccount_PasswordComp({
  setPassword,
  password,
  viewPassword,
  setViewPassword,
  errorBorder,
  isValid,
}) {
  return (

    <div className='mt-2'>
      <label className='text-[11px] font-medium text-gray-400 tracking-wider uppercase flex items-center gap-1.5 mb-2'>
        Password
        <span className="inline-flex items-center justify-center w-3 h-3 bg-gray-700/50 rounded-full text-[9px] cursor-default" title="Use your investor/read-only password for extra security">?</span>
      </label>

      <div className='relative'>
        <input
          type={viewPassword ? 'text' : 'password'}
          className={`border rounded-lg bg-darkblack-600 text-white p-3 w-full text-[13px] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 pr-10 transition-all duration-200 ${errorBorder ? 'border-red-500/50 focus:border-red-500' : isValid ? 'border-teal-500/50 focus:border-teal-500' : 'border-gray-700/50 focus:border-teal-500'}`}
          placeholder='Investor password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete='new-password'
          name='mt-password-field'
          data-form-type='other'
          data-lpignore='true'
          data-1p-ignore='true'
        />
        <button
          type='button'
          className='absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-teal-400 text-sm focus:outline-none transition-colors'
          onClick={() => setViewPassword(!viewPassword)}
        >
          {viewPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <div className='text-[11px] text-gray-500 mt-1.5 flex items-center gap-1'>
        <span className='text-teal-400 font-medium'>💡 Tip:</span> Use your Investor password for maximum security.
      </div>

      {errorBorder && (
        <div className='mt-1'>
          <AnimatedText
            value={errorBorder}
            fromColor='from-red-400'
            toColor='to-red-600'
            textSize='text-[11px]'
          />
        </div>
      )}
    </div>
  );
}

export default AddAccount_PasswordComp;
