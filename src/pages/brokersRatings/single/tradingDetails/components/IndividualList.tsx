export default function IndividualList({ data, title, style }: any) {
  return (
    <li
      className={`flex 
      ${style === 'column' ? 'flex-col' : style === 'column2' ? 'items-start ' : 'items-center'} 
      ${style ? (style === 'column2' ? 'flex-col' : 'justify-between ') : 'space-x-2'}`}
    >
      <span
        className={`text-[#5EEAD4] text-base md:text-lg font-semibold ${style === 'column2' ? '' : 'whitespace-nowrap'}`}
      >
        {title}
      </span>
      {style === true ? <hr className='h-[0.1] w-full mx-2 opacity-30' /> : ''}
      <span className={`text-white  ${style === 'column' ? 'w-full' : ''}`}>
        <div
          className={`flex space-x-1 px-5 py-2  ${style === 'column' ? 'w-full flex justify-center' : ''} bg-[#585858] hover:text-slate-300 bg-opacity-20 w-fit p-1 px-5 rounded-lg shadow-xl group`}
        >
          {data}
        </div>
      </span>
    </li>
  );
}
