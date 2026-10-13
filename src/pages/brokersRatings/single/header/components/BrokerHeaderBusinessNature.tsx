import BrokerHeaderSocialMedia from './BrokerHeaderSocialMedia';
import ShowList from '../../tradingDetails/components/ShowList';
import IndividualList from '../../tradingDetails/components/IndividualList';
import AddressOfTheBroker from './AddressOfTheBroker';
// import TrustpilotModal from './TrustpilotModal';
// import TrustpilotButton from './TrustpilotButton';

interface BrokerHeaderBusinessNatureProps {
  broker: any;
}

export default function BrokerHeaderBusinessNature({
  broker = {},
}: BrokerHeaderBusinessNatureProps) {
  return (
    <div className='w-full px-5 md:px-0 md:pl-5'>
      <ul className='space-y-4 '>
        {/* <TrustpilotButton onClick={handleOpenModal} />

        {isModalOpen && <TrustpilotModal onClose={handleCloseModal} />} */}
        <hr className='h-[2px] opacity-30 bg-[#5EEAD4]  ' />
        <IndividualList
          style={true}
          data={broker?.generalInformation?.founded ?? '?'}
          title={'Established Since'}
          tooltip={true}
        />
        <hr className='h-[1.5px] opacity-30 bg-[#5EEAD4]' />
        <ShowList data={broker?.regulations?.regulations} label={'regulations'} tooltip={true} />
        <hr className='h-[2px] opacity-30 bg-[#5EEAD4]' />
        <AddressOfTheBroker
          style={true}
          address={broker?.generalInformation?.officeHq ?? 'No address available'}
        />
        <hr className='h-[2px] opacity-30 bg-[#5EEAD4]' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start'>
          {/* No. of Offices */}
          <div>
            <p className='text-[#5EEAD4] text-base md:text-lg font-semibold whitespace-nowrap'>
              No. of Offices:
            </p>
            <div className='flex justify-center space-x-1 px-5 py-2 bg-[#585858] w-full  hover:text-slate-300 bg-opacity-20 p-1  rounded-lg shadow-xl text-white'>
              {broker?.generalInformation?.numberOfOffices ?? 'N/A'}
            </div>
          </div>
          <hr className='h-[2px] opacity-30 bg-[#5EEAD4] md:hidden' />
          {/* Customer Support Availability */}
          <div>
            <IndividualList
              style='column'
              data={broker?.customerSupport?.customerSupportAvailability}
              title='Customer Support: '
            />
          </div>
        </div>

        <hr className='h-[2px] opacity-30 bg-[#5EEAD4]' />
        <ShowList data={broker?.customerSupport?.channels} label='Contact Channels' />
        <hr className='h-[2px] opacity-30 bg-[#5EEAD4]' />
        <BrokerHeaderSocialMedia data={broker?.socialMedia} />
        <hr className='h-[2px] opacity-30 bg-[#5EEAD4]' />
      </ul>
    </div>
  );
}
