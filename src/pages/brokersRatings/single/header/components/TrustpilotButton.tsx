export default function TrustpilotButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className='inline-flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2 lg:px-4 hover:bg-gray-50 transition-colors cursor-pointer'
    >
      <span className='font-semibold text-slate-800 lg:text-xl'>Excellent</span>
      <div className='flex'>
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className='w-5 h-5 text-[#00b67a]'
            viewBox='0 0 24 24'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z' />
          </svg>
        ))}
      </div>
      <div className='relative w-32 h-8'>
        <img src='/assets/img/trustpilot.png' alt='Trustpilot Rating' />
      </div>
    </button>
  );
}
