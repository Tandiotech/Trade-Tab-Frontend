import { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';

interface AccountStepProps {
  register: any;
  errors: any;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  validatePasswordConfirm: (value: string) => boolean | string;
}

const AccountStep: React.FC<AccountStepProps> = ({
  register,
  errors,
  isSubmitting,
  onSubmit,
  onBack,
  validatePasswordConfirm,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div>
      <div className='step-head'>
        <div className='step-tag'>Step 04 · Secure</div>
        <h2 className='step-title'>Create your account</h2>
        <p className='step-sub'>Email becomes your login. Use a strong, unique password.</p>
      </div>

      <form onSubmit={onSubmit} autoComplete='off'>
        <div className='field'>
          <label className='field-label'>
            <span>Email</span>
          </label>
          <div className='input-wrap'>
            <span className='lead'>
              <FaEnvelope />
            </span>
            <input
              type='email'
              autoComplete='off'
              placeholder='you@example.com'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
          </div>
          {errors.email && (
            <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 4 }}>{errors.email.message}</p>
          )}
        </div>

        <div className='field'>
          <label className='field-label'>
            <span>Password</span>
            <span className='field-hint'>8+ characters</span>
          </label>
          <div className='input-wrap'>
            <span className='lead'>
              <FaLock />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete='new-password'
              placeholder='••••••••'
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            <span className='trail'>
              <button type='button' className='ghost-btn' onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </span>
          </div>
          {errors.password && (
            <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 4 }}>{errors.password.message}</p>
          )}
        </div>

        <div className='field'>
          <label className='field-label'>
            <span>Confirm password</span>
          </label>
          <div className='input-wrap'>
            <span className='lead'>
              <FaLock />
            </span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete='new-password'
              placeholder='••••••••'
              {...register('passwordConfirmation', {
                required: 'Please confirm your password',
                validate: validatePasswordConfirm,
              })}
            />
            <span className='trail'>
              <button
                type='button'
                className='ghost-btn'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </span>
          </div>
          {errors.passwordConfirmation && (
            <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 4 }}>
              {errors.passwordConfirmation.message}
            </p>
          )}
        </div>

        <div className='btn-row'>
          <button type='button' onClick={onBack} className='btn btn-secondary'>
            Back
          </button>
          <button type='submit' disabled={isSubmitting} className='btn btn-primary btn-flex'>
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountStep;
