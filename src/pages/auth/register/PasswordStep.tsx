import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import Loading2 from '../../../component/loader/Loading2/Loading2';

interface PasswordStepProps {
  setStep: any;
  setValue: any;
  register: any;
  errors: any;
  password: string;
  validatePasswordConfirm: (value: string) => string | boolean;
  isSubmitting: boolean;
  onSubmit: any;
}

const PasswordStep: React.FC<PasswordStepProps> = ({
  setStep,
  setValue,
  register,
  errors,
  password,
  validatePasswordConfirm,
  isSubmitting,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  // Efecto para limpiar los valores de los campos al montar el componente
  useEffect(() => {
    setValue('password', ''); // Limpia el campo 'password'
    setValue('passwordConfirmation', ''); // Limpia el campo 'passwordConfirmation'
    setConfirmPassword(''); // Limpia el estado local también
  }, [setValue]);

  // Effect to check if passwords match
  useEffect(() => {
    setPasswordMatch(password === confirmPassword && confirmPassword !== '');
  }, [password, confirmPassword]);

  return (
    <nav>
      {/* <button type='button' onClick={() => setStep(1)}>
        Back
      </button> */}
      <p className='mt-3 text-white text-xs'>Email</p>
      <input
        type='text'
        className='w-full xl:text-sm 2xl:text-base xl:h-8 2xl:h-[unset] border-teal-500 rounded-md pl-2 pr-10 text-black'
        {...register('email', { required: 'Email is required' })}
      />

      <div className='grid lg:grid-cols-2 grid-cols-1 gap-4'>
        <div>
          <p className='mt-3 text-white text-xs'>Password</p>
          <div className='relative'>
            <img
              src='/assets/img/icon/lock.svg'
              alt='Password icon'
              className='absolute xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 xl:bottom-[19%] 2xl:bottom-[13%] left-[3%]'
            />
            <input
              type={showPassword ? 'text' : 'password'}
              className='w-full xl:text-sm 2xl:text-base xl:h-8 2xl:h-[unset] rounded-md pl-10 pr-10 border-teal-500 text-black'
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-[50%] transform -translate-y-[50%] text-gray'
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className='mt-1 text-red-600'>{errors.password.message}</p>}
        </div>

        <div>
          <p className='mt-3 text-white text-xs'>Confirm Password</p>
          <div className='relative'>
            <img
              src='/assets/img/icon/lock.svg'
              alt='Password logo'
              className='absolute bottom-[16%] left-[2.5%] '
            />
            <input
              type={showPassword ? 'text' : 'password'}
              className={`w-full xl:text-sm 2xl:text-base xl:h-8 2xl:h-[unset] rounded-md pl-10 border-teal-500 text-black ${
                passwordMatch ? 'border-green-500' : 'border-red-500'
              }`}
              {...register('passwordConfirmation', {
                required: 'Confirm password is required',
                validate: validatePasswordConfirm,
              })}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-[50%] transform -translate-y-[50%] text-gray'
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.passwordConfirmation && (
            <p className='mt-1 text-red-600'>{errors.passwordConfirmation.message}</p>
          )}
          {!passwordMatch && confirmPassword && (
            <p className='mt-1 text-red-600'>Passwords do not match</p>
          )}
        </div>
      </div>

      <button
        className={`flex items-center gap-2 justify-center mt-5 ${
          passwordMatch ? 'bg-[#20DD8A]' : 'bg-gray-800/80  text-slate-300 cursor-not-allowed'
        } text-black md:text-base  w-full py-2 rounded-md font-poppins`}
        onClick={onSubmit}
        disabled={!passwordMatch || isSubmitting}
      >
        {isSubmitting ? <Loading2 className='!pt-0' /> : 'Register'}
      </button>
    </nav>
  );
};

export default PasswordStep;
