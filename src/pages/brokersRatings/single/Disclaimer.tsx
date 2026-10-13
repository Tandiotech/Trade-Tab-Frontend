export default function RiskDisclaimer() {
  return (
    <div className='w-full bg-slate-900 border-slate-700 border text-white p-6 rounded-lg shadow-lg'>
      <h3 className='text-lg font-bold text-red-500'>⚠ ESMA Risk Warning</h3>

      <p className='text-gray-200 mt-2 leading-relaxed font-bold px-2'>
        <strong>
          CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage.
          63% of retail investor accounts lose money when trading CFDs with this provider. You should consider
          whether you understand how CFDs work and whether you can afford to take the high risk of losing
          your money.
        </strong>
      </p>


      {/* <h3 className='text-lg font-bold text-teal-400 mt-4'>Conflict of Interest Disclaimer</h3>
      <p className='text-gray-300 mt-2 text-sm leading-relaxed'>
        Track Data is acting in a capacity of a{' '}
        <span className='text-teal-500 font-semibold'>marketing affiliate</span> of Stratos Europe
        Limited.
      </p> */}

      <div className='mt-4 text-center'>
        <strong className='text-yellow-400'>
          {' '}
          Always trade responsibly and make informed decisions.
        </strong>
      </div>
    </div>
  );
}
