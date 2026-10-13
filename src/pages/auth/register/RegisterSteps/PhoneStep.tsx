import { useState } from 'react';

interface PhoneStepProps {
  setValue: any;
  watch: any;
  setIsPhoneValid: (valid: boolean) => void;
  setSkipPhone: (skip: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const PhoneStep = ({ setValue, watch, setIsPhoneValid }: PhoneStepProps) => {
  const [phone, setPhone] = useState('');

  const countryCode = watch('countryCode') || '+1';
  const flag = watch('countryFlag') || '🌎';

  const handlePhoneChange = (value: string) => {
    const clean = value.replace(/\D/g, '');
    setPhone(clean);
    setValue('phone', `${countryCode}${clean}`);
    setIsPhoneValid(clean.length >= 8);
  };

  return (
    <div>
      <div className='step-head'>
        <div className='step-tag'>Step 03 · Phone</div>
        <h2 className='step-title'>Add your number</h2>
        <p className='step-sub'>Enter your phone number to connect to TradeTab</p>
      </div>

      <div className='field'>
        <label className='field-label'>
          <span>Mobile</span>
          <span className='field-hint'>Include country prefix</span>
        </label>
        <div className='input-wrap'>
          <span className='lead mono' style={{
              paddingRight: 10,
              borderRight: '1px solid var(--line)',
              marginRight: 8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>{flag}</span>
            <span className='mono' style={{ fontSize: 13, color: 'var(--ink-1)' }}>
              {countryCode}
            </span>
          </span>
          <input
            type='tel'
            value={phone}
            onChange={e => handlePhoneChange(e.target.value)}
            placeholder='555 123 4567'
            minLength={8}
            maxLength={11}
          />
        </div>
      </div>
    </div>
  );
};

export default PhoneStep;
