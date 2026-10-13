interface BrokerMenuProps {
  setSelect: (section: string) => void;
  select: string;
}

const menuItems = [
  { label: 'TRADING DETAILS', name: 'Trading Details', editSection: 'tradingDetails' },
  { label: 'PROSVSCONS', name: 'Pros Vs Cons', editSection: 'prosAndCons' },
  { label: 'REVIEWS', name: 'Reviews', editSection: null },
  // { label: 'FORUM', editSection: null, name: 'Forum' },
];

export default function BrokerMenu({ setSelect, select }: BrokerMenuProps) {
  return (
    <div className='space-x-1 border-b-[1px] border-teal-300/50 hover:border-teal-300 transition-all duration-300 w-full flex flex-col lg:flex-row py-1'>
      {menuItems.map(item => (
        <span
          key={item.label}
          className={`cursor-pointer text-base md:text-lg font-semibold text-teal-300 py-2 px-4 tracking-wide hover:text-white ${
            select === item.label ? 'active-span' : ''
          }`}
          onClick={() => {
            setSelect(item.label);
          }}
        >
          {item.name}
        </span>
      ))}
    </div>
  );
}
