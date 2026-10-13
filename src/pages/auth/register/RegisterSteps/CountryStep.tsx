import { useState } from 'react';
import { FaGlobe } from 'react-icons/fa';
import { countries } from '../Countries/CountryNationality';
import { UseFormSetValue } from 'react-hook-form';

interface CountryStepProps {
  setValue: UseFormSetValue<any>;
  onNext: () => void;
  onBack: () => void;
}

const CountryStep: React.FC<CountryStepProps> = ({ setValue, onNext }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (country: string, flag: string, code: string) => {
    setSearchTerm(country);
    setIsFocused(false);
    setValue('country', country);
    setValue('countryFlag', flag);
    setValue('countryCode', code);
    onNext();
  };

  return (
    <div>
      <div className='step-head'>
        <div className='step-tag'>Step 02 · Region</div>
        <h2 className='step-title'>Where do you trade from?</h2>
        <p className='step-sub'>We’ll personalize your experience based on your location.</p>
      </div>

      <div className='field'>
        <label className='field-label'>
          <span>Country / region</span>
        </label>
        <div className='input-wrap'>
          <span className='lead'>
            <FaGlobe />
          </span>
          <input
            type='text'
            value={searchTerm}
            onFocus={() => setIsFocused(true)}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='Search countries…'
          />
        </div>

        {isFocused && (
          <div className='country-list' role='listbox'>
            {filteredCountries.map(c => (
              <button
                key={c.code}
                type='button'
                onClick={() => handleSelect(c.name, c.flag, c.countryCode)}
                className={`country-row ${searchTerm === c.name ? 'selected' : ''}`}
              >
                <span className='flag'>{c.flag}</span>
                <span>{c.name}</span>
                <span className='dial'>{c.countryCode}</span>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <div style={{ padding: '18px', color: 'var(--ink-3)', fontSize: 13, textAlign: 'center' }}>
                No matches.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryStep;
