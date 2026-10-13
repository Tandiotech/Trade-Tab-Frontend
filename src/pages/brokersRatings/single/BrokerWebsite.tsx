import { useState, useRef } from 'react';
import { TiArrowBack } from 'react-icons/ti';
import TradingDetailsBoker from './tradingDetails/TradingDetailsBoker';
import BrokerHeader from './header/BrokerHeader';
import BrokerReviews from '../BrokerReviews';
import ContactBroker from '../contact/ContactBroker';
import ProsVsCons from '../subMenu/ProsVsCons';
import UpdateBroker from '../../brokers/update/UpdateBroker';
import BrokerMenu from './menu/BrokerMenu';
import SheetsDataAboutBroker from './SheetsDataAboutBroker';
import getUser from '../../../utils/getUser';
import handleSaveBroker from '../../../services/handleSaveBroker';
import Affiliate from '../../affiliate/Affiliate';
import { useBrokerEdit } from '../../../context/accounts/BrokerEditContext.tsx';

const BrokerWebsite = ({
  broker,
  setSelectedBroker,
  goBack = () => setSelectedBroker(null),
}: any) => {
  // Context values for broker editing by admin
  const { setBrokerEditSection, brokerEditSection, brokerEditMode, setBrokerEditMode } =
    useBrokerEdit();

  const sectionRef = useRef(null); // Crear una referencia para la sección

  const [successMessage, setSuccessMessage] = useState(''); //

  const [select, setSelect] = useState('TRADING DETAILS');

  const handleSave = async (updatedBroker: any) => {
    updatedBroker.userName = getUser?.userName;

    try {
      const res: any = await handleSaveBroker(broker._id, updatedBroker);
      setSelectedBroker(res.data.broker);
      setBrokerEditMode(false);
      setBrokerEditSection('generalInformation');
      setSuccessMessage('Broker updated successfully!');
      setTimeout(() => {
        setSuccessMessage(''); // Oculta el mensaje de éxito después de 3 segundos
      }, 3000);
    } catch (error) {
      console.error('Error saving broker:', error);
    }
  };

  // if (!broker) {
  //   return <div>Broker not found</div>;
  // }

  return (
    <div className='div_entry_5 grid grid-cols-8 gap-0'>
      <div className={`${broker && brokerEditMode ? 'col-span-6' : 'col-span-8'} `}>
        <div className='space-x-14 flex'>
          <button
            onClick={goBack}
            className='flex items-center mx-5 py-4 text-2xl text-[#59C28B] hover:text-[#45946b] duration-300 space-x-2'
          >
            <TiArrowBack />
            <span>Go Back</span>
          </button>
        </div>

        <BrokerHeader
          broker={broker}
          brokerEditMode={brokerEditMode}
          setBrokerEditMode={setBrokerEditMode}
          setBrokerEditSection={setBrokerEditSection}
          isAdmin={getUser.profile.typeProfile > 2 ? true : false}
          setSelect={setSelect}
          sectionRef={sectionRef}
        />

        <div
          ref={sectionRef}
          className='my-5 bg-slate-900 border-slate-700 border p-10 rounded-lg flex items-center relative flex-col'
        >
          <BrokerMenu
            brokerEditMode={brokerEditMode}
            setBrokerEditSection={setBrokerEditSection}
            select={select}
            setSelect={setSelect}
          />

          {successMessage && (
            <div className='absolute top-4 right-4 p-4 bg-green-500 text-white rounded shadow-lg'>
              {successMessage}
            </div>
          )}
          {select == 'TRADING DETAILS' ? (
            <TradingDetailsBoker pending={false} broker={broker} />
          ) : select == 'SERVICES' ? (
            <ContactBroker />
          ) : select == 'PARTNERSHIP_SCORE' ? (
            <Affiliate />
          ) : select == 'PROSVSCONS' ? (
            <ProsVsCons data={broker?.prosAndCons} />
          ) : select == 'REVIEWS' ? (
            <BrokerReviews broker={broker._id} />
          ) : null}
        </div>
      </div>

      {getUser.profile.typeProfile > 2 && brokerEditMode && (
        <SheetsDataAboutBroker brokerName={broker?.generalInformation.brokerName} />
      )}

      {/* Edit mode for admis */}
      {broker && brokerEditMode && (
        <div className='p-1 col-span-2 py-16'>
          <UpdateBroker broker={broker} onSave={handleSave} brokerEditSection={brokerEditSection} />
        </div>
      )}
    </div>
  );
};

export default BrokerWebsite;
