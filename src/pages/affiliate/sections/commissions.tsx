import { useState } from 'react';

export const Commissions = () => {
  const countries = [
    { code: 'uk', name: 'United Kingdom', mainAmount: 1450, bonus: 350, cpaRate: 1100 },
    { code: 'us', name: 'United States', mainAmount: 1350, bonus: 300, cpaRate: 1050 },
    { code: 'ca', name: 'Canada', mainAmount: 1400, bonus: 350, cpaRate: 1050 },
    { code: 'mx', name: 'Mexico', mainAmount: 1250, bonus: 250, cpaRate: 1000 },
    { code: 'fr', name: 'France', mainAmount: 1300, bonus: 220, cpaRate: 1080 },
    { code: 'de', name: 'Germany', mainAmount: 1320, bonus: 315, cpaRate: 1005 },
    { code: 'jp', name: 'Japan', mainAmount: 1280, bonus: 220, cpaRate: 1060 },
    { code: 'au', name: 'Australia', mainAmount: 1370, bonus: 340, cpaRate: 1030 },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const handleCountryChange = (e: { target: { value: string } }) => {
    const selected = countries.find(country => country.code === e.target.value);
    if (selected) {
      setSelectedCountry(selected);
    }
  };

  return (
    <div
      id='rates'
      className='px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20 text-black'
    >
      <div className='flex flex-col lg:flex-row'>
        <div className='mb-6  lg:mb-0 lg:w-1/2 lg:pr-10'>
          <h2 className='font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none'>
            Check out our competition-beating commissions
          </h2>
          <p className='text-xl py-10  md:pr-10'>
            Our CPA commissions depend on your traders’ country of residence and the initial
            deposit. Check out how much you would get:
          </p>
          <a
            href='/'
            aria-label=''
            className='bg-teal-500 text-white px-4 py-2 font-semibold text-xl inline-flex items-center rounded-full transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800'
          >
            See All Countries
          </a>
        </div>
        <div className='lg:w-1/2 md:pr-10'>
          <p className='mb-4 text-lg text-gray-500'>Your trader’s country of residence</p>
          <div className='max-w-full'>
            <select
              id='country'
              name='country'
              className='mt-1 block w-full p-2 text-2xl font-bold border-none text-slate-700 bg-white rounded-md shadow-sm'
              onChange={handleCountryChange}
              value={selectedCountry.code}
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <p className='py-4 font-semibold text-2xl'>You get up to</p>
          <div className='grid grid-cols-5 gap-4 items-end'>
            <div className='col-span-3'>
              <p className='font-bold text-6xl md:text-7xl text-teal-600 font-orbitron'>
                ${selectedCountry.mainAmount}
              </p>
            </div>
            <div className='col-span-2'>
              <p className='font-semibold text-xl md:text-2xl leading-6'>
                For each qualified trader
              </p>
            </div>
          </div>

          <hr className='border-b my-4 border-teal-700' />

          <div className='grid grid-cols-6 gap-4 items-start'>
            <div className='col-span-3'>
              <p className='font-bold text-2xl text-teal-600 font-orbitron'>
                ${selectedCountry.cpaRate}
              </p>
              <p className='font-semibold text-base'>CPA rate for {selectedCountry.name}</p>
            </div>
            <div className='col-span-3'>
              <p className='font-bold text-2xl text-teal-600 font-orbitron'>
                ${selectedCountry.bonus}
              </p>
              <p className='font-semibold text-base'>Bonus for initial deposit over $5000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
