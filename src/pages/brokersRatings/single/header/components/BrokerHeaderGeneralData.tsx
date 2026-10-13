
export default function BrokerHeaderGeneralData({broker}:any) {
  return (
    <div>
    <div className='flex xl:flex-wrap xl:gap-2 2xl:gap-0 2xl:space-x-4 text-white 2xl:flex-nowrap 2xl:whitespace-nowrap 2xl:overflow-scroll 2xl:custom-scrollbar'>
      
      <div
        className='flex bg-white hover:text-slate-300 bg-opacity-20  w-fit py-1  px-2 rounded'
        >
        {broker.entYears.replace(/[^0-9-]/g, '')} years
      </div>

      {broker.regulatoryList?.map((label: any, index: number) => (
        <>
        <div
          key={index}
          className='flex bg-white hover:text-slate-300 bg-opacity-20  w-fit py-1  px-2 rounded'
          >
            <img 
            className=" w-7"
            src={label.nationalFlag} alt="" srcSet="" />
        </div>

        <div
          key={index}
          className='flex bg-white hover:text-slate-300 bg-opacity-20  w-fit py-1  px-2 rounded'
          >
          {label.abb}
        </div>

        
        <div
          key={index}
          className='flex bg-white hover:text-slate-300 bg-opacity-20  w-fit py-1  px-2 rounded'
          >
          {label.investorAuthority}
        </div>

        <div
          key={index}
          className='flex bg-white hover:text-slate-300 bg-opacity-20  w-fit py-1  px-2 rounded'
          >
          {label.name}
        </div>

        <div
          key={index}
          className='flex bg-white hover:text-slate-300 bg-opacity-20  w-fit py-1  px-2 rounded'
          >
            <img 
            className=" w-7"
            src={label.logo} alt="" srcSet="" />
        </div>
        
        </>
      ))}



    </div> 
  </div>
  )
}
