import { useState, useEffect } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { http } from '@/utils/http_request';

interface UsernameStepProps {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  onNext: () => void;
  setIsUsernameValid: (isValid: boolean) => void;
}

const UsernameStep: React.FC<UsernameStepProps> = ({
  setValue,
  watch,
  onNext,
  setIsUsernameValid,
}) => {
  const [username, setUsername] = useState(watch('userName') || '');

  const [status, setStatus] = useState<'checking' | 'valid' | 'taken' | 'invalid' | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateUsernameFormat = (username: string): boolean => {
    const noSpaces = /^\S*$/;
    const validChars = /^[a-zA-Z][a-zA-Z0-9_]{2,14}$/;

    if (!noSpaces.test(username)) {
      setValidationError('Username cannot contain spaces');
      return false;
    }
    if (!validChars.test(username)) {
      setValidationError('Only letters, numbers, and underscores are allowed');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const checkUsernameAvailability = async (username: string) => {
    setStatus('checking');
    try {
      const response = await http.post(`auth/check-username`, { username });
      if (response.data.isTaken) {
        setStatus('taken');

        setIsUsernameValid(false);
      } else {
        setStatus('valid');
        setIsUsernameValid(true);
      }
    } catch (error) {
      console.error('Error checking username:', error);
      setStatus('invalid');
      setIsUsernameValid(false);
    }
  };

  useEffect(() => {
    if (username && username.length >= 3) {
      if (validateUsernameFormat(username)) {
        const timeoutId = setTimeout(() => {
          checkUsernameAvailability(username);
        }, 1000);
        return () => clearTimeout(timeoutId);
      } else {
        setStatus('invalid');
        setIsUsernameValid(false);
      }
    } else if (username && username.length > 0) {
      setValidationError('Username must be at least 3 characters long');
      setStatus('invalid');
      setIsUsernameValid(false);
    } else {
      setStatus(null);
      setValidationError(null);
      setIsUsernameValid(false);
    }
  }, [username]);

  const handleNext = () => {
    setValue('userName', username);
    onNext();
  };

  return (
    <div>
      <div className='step-head'>
        <div className='step-tag'>Step 01 · Identity</div>
        <h2 className='step-title'>Choose a username</h2>
        <p className='step-sub'>This will be your display name across the platform</p>
      </div>

      <div className='field'>
        <label className='field-label'>
          <span>Username</span>
          <span className='field-hint'>{username.length}/15</span>
        </label>
        <div className='input-wrap'>
          <span className='lead'>@</span>
          <input
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder='e.g. alpha_trader'
          />
          {status === 'valid' && (
            <span className='trail' style={{ color: 'var(--positive)' }}>
              available
            </span>
          )}
        </div>
      </div>

      {validationError && (
        <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 4 }}>{validationError}</p>
      )}

      {status === 'checking' && (
        <p style={{ color: 'var(--accent-2)', fontSize: 13, marginTop: 4 }}>Checking availability…</p>
      )}
      {status === 'taken' && (
        <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 4 }}>Username already exists.</p>
      )}

      <div className='btn-row'>
        <button
          type='button'
          disabled={status !== 'valid'}
          onClick={handleNext}
          className='btn btn-primary btn-flex'
          aria-disabled={status !== 'valid'}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default UsernameStep;
