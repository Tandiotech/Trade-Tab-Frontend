import { useState } from 'react';
import ResolutionStats from './ResolutionStats';
import BrokerComplaintForm from './brokerComplaintForm/BrokerComplaintForm';
import HowToAvoidBeingScammed from './howtoAvoidBeingScammed/HowToAvoidBeingScammed';
import TeamChat from '../../component/teamChat/TeamChat';

interface Complaint {
  id: number;
  title: string;
  details: string;
  category: string;
  sentiment: 'positive' | 'negative';
  screenshotUrl?: string;
  date: string;
}

interface BrokerComplaintReportProps {
  brokerName: string;
  complaints: Complaint[];
}

const BrokerComplaintReport: React.FC<BrokerComplaintReportProps> = () => {
  const [liveChatMode, setliveChatMode] = useState(false);

  return (
    <div className='px-4 mt-3  mx-auto sm:max-w-xl md:max-w-7xl md:px-16 lg:px-8 min-h-screen'>
      <div className='grid gap-4 md:grid-cols-12'>
        <div className='grid md:col-span-5 div_entry_2'>
          <BrokerComplaintForm setliveChatMode={setliveChatMode} />
        </div>

        {/* This is normal/default */}
        {!liveChatMode && (
          <div className='grid md:col-span-7 h-fit gap-4 div_entry_2'>
            <div className='grid grid-cols-2  p-6 border bg-slate-900 border-cyan-800 hover:border-cyan-500 ease-in-out duration-300 rounded-2xl'>
              <h2 className='font-bold text-2xl md:text-4xl text-teal-300 mb-4'>
                Resolution Stats
              </h2>
              <ResolutionStats />
            </div>

            <HowToAvoidBeingScammed />
          </div>
        )}

        {/* This is when user selects Live-Chat option*/}
        {liveChatMode && (
          <div className='grid md:col-span-7 gap-4 h-full'>
            <div className='grid grid-cols-1 p-6 border bg-slate-900 border-cyan-800 hover:border-cyan-500 ease-in-out duration-300 rounded-2xl'>
              {/* <ResolutionStats /> */}
              <TeamChat />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrokerComplaintReport;
