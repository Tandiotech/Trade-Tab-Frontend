// import BrokerResume from "../single/BrokerResume";
import GetMyCase from './getMyCase/GetMyCase';
// import NoBrokerAccountConnected from "./getMyCase/NoBrokerAccountConnected";
import WantToSaySomethingAboutBroker from './WantToSaySomethingAboutBroker';

const ContactBroker: React.FC = () => {
  return (
    <section id='contact' className='py-12 pt-7'>
      <div className='mx-auto '>
        {/* <div className="flex flex-wrap justify-center"> */}
        <div className='grid grid-cols-12 '>
          <WantToSaySomethingAboutBroker />
          <GetMyCase />
          {/* <NoBrokerAccountConnected/> */}
        </div>
      </div>
      {/* <BrokerResume/> */}
    </section>
  );
};

export default ContactBroker;
