
export default function BrokerHeaderRegulations({ broker }: any) {
  const data = broker?.regulation?.listOfRegulatoryAuthorities.split(',');
  return (
    <li className='space-x-2 flex items-center'>
      <span
        className={`text-[#02C686] font-medium`}
      >
        Regulations:
      </span>
      <div className='flex space-x-2 items-center'>
        {data?.map((item: any, index: number) => (
          <div
            key={index}
            className='flex space-x-2 bg-white hover:text-slate-300 bg-opacity-20   w-fit py-1  px-2 rounded-xl shadow-xl items-center relative'
          >
            <div className='flex flex-col '>
              <span className=' text-white font-semibold'>{item}</span>
            </div>
          </div>
        ))}
      </div>
    </li>
  );
}
