import { SeparadorDecimal } from '@/utils/SeparadorDecimal';
import {
  Building2,
  Users,
  DollarSign,
  MessageCircle,
  AlertCircle,
  TrendingUp,
  // Shield,
  Globe,
} from 'lucide-react';
import { useState } from 'react';

export default function BrokersOfTheAccount({ accounts }: any) {
  const [contactModal, setContactModal] = useState<string | null>(null);
  const [contactReason, setContactReason] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Group accounts by broker
  const brokerSummary = accounts.reduce(
    (acc: any, account: any) => {
      const brokerName = account.broker || 'Unknown Broker';

      if (!acc[brokerName]) {
        acc[brokerName] = {
          totalBalance: 0,
          numberOfAccounts: 0,
          platforms: new Set<string>(),
          currencies: new Set<string>(),
          accountTypes: new Set<string>(),
          accounts: [], // Store actual accounts for reference
        };
      }

      acc[brokerName].totalBalance += account.balance;
      acc[brokerName].numberOfAccounts += 1;
      acc[brokerName].platforms.add(account.platform);
      acc[brokerName].currencies.add(account.currency);
      acc[brokerName].accountTypes.add(account.type);
      acc[brokerName].accounts.push(account);

      return acc;
    },
    {} as Record<
      string,
      {
        totalBalance: number;
        numberOfAccounts: number;
        platforms: Set<string>;
        currencies: Set<string>;
        accountTypes: Set<string>;
        accounts: any[];
      }
    >
  );

  const handleContactBroker = (brokerName: string) => {
    setContactModal(brokerName);
  };

  const handleSubmitContact = async () => {
    try {
      // Here you would implement the actual contact logic

      // Reset form
      setContactModal(null);
      setContactReason('');
      setContactMessage('');

      // Show success message
      alert("Your request has been sent! We'll contact the broker on your behalf.");
    } catch (error) {
      console.error('Error contacting broker:', error);
    }
  };

  const SingleAccountBroker = ({ broker, data }: { broker: string; data: any }) => {
    const isRealAccount = [...data.accountTypes].some(type => type === 'ACCOUNT_TRADE_MODE_REAL');
    const totalAccounts = data.numberOfAccounts;
    const totalBalance = data.totalBalance;

    return (
      <div className='relative group'>
        <div className='bg-gradient-to-br from-darkblack-600 to-darkblack-700 rounded-2xl border border-gray-700/50 p-6 hover:border-teal-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10'>
          {/* Header */}
          <div className='flex items-start justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg'>
                <Building2 className='w-5 h-5 text-white' />
              </div>
              <div>
                <h3 className='text-lg font-bold text-white'>{broker}</h3>
                <div className='flex items-center gap-2 mt-1'>
                  <Users className='w-4 h-4 text-gray-400' />
                  <span className='text-sm text-gray-400'>
                    {totalAccounts} account{totalAccounts > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Type Badge */}
            <div className='flex gap-1'>
              {[...data.accountTypes].map((type, idx) => (
                <span
                  key={`${type}-${broker}-${idx}`}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    type === 'ACCOUNT_TRADE_MODE_REAL'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {type === 'ACCOUNT_TRADE_MODE_REAL' ? 'Real' : 'Demo'}
                </span>
              ))}
            </div>
          </div>

          {/* Balance Section */}
          <div className='mb-6'>
            <div className='flex items-center gap-2 mb-2'>
              <DollarSign className='w-4 h-4 text-teal-400' />
              <span className='text-sm text-gray-400'>Total Balance</span>
            </div>
            <div className='text-2xl font-bold text-white'>
              {SeparadorDecimal(totalBalance.toFixed(2))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-2 gap-4 mb-6'>
            {/* Currencies */}
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Globe className='w-4 h-4 text-yellow-400' />
                <span className='text-sm text-gray-400'>Currencies</span>
              </div>
              <div className='flex flex-wrap gap-1'>
                {[...data.currencies].map((currency, idx) => (
                  <span
                    key={idx}
                    className='px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-md border border-yellow-500/30'
                  >
                    {currency}
                  </span>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <TrendingUp className='w-4 h-4 text-blue-400' />
                <span className='text-sm text-gray-400'>Platforms</span>
              </div>
              <div className='flex flex-wrap gap-1'>
                {[...data.platforms].map(platform => (
                  <span
                    key={platform}
                    className='px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md border border-blue-500/30'
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-2'>
            <button
              onClick={() => handleContactBroker(broker)}
              className='flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-300 text-sm'
            >
              <MessageCircle className='w-4 h-4' />
              Contact Broker
            </button>

            <button className='flex items-center justify-center gap-2 py-2 px-3 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded-lg transition-all duration-300 text-sm'>
              <AlertCircle className='w-4 h-4' />
              Report Issue
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-6'>
        <div className='p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl'>
          <Building2 className='w-6 h-6 text-white' />
        </div>
        <div>
          <h2 className='text-2xl font-bold text-white'>Broker Summary</h2>
          <p className='text-gray-400 text-sm'>Overview of your connected brokers</p>
        </div>
      </div>

      {/* Brokers Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Object.keys(brokerSummary).length > 0 ? (
          Object.entries(brokerSummary).map(([broker, data]) => (
            <SingleAccountBroker key={broker} broker={broker} data={data} />
          ))
        ) : (
          <div className='col-span-full text-center py-12'>
            <div className='p-4 bg-darkblack-600 rounded-2xl border border-gray-700/50'>
              <Building2 className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-white mb-2'>No Brokers Connected</h3>
              <p className='text-gray-400 text-sm'>
                Connect your trading accounts to see broker summaries here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {contactModal && (
        <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-gradient-to-br from-darkblack-600 to-darkblack-700 rounded-2xl border border-gray-700/50 p-8 max-w-md w-full'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg'>
                <MessageCircle className='w-5 h-5 text-white' />
              </div>
              <h3 className='text-xl font-bold text-white'>Contact {contactModal}</h3>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Reason for Contact
                </label>
                <select
                  value={contactReason}
                  onChange={e => setContactReason(e.target.value)}
                  className='w-full px-4 py-3 bg-darkblack-500 border border-gray-600 rounded-lg text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none'
                >
                  <option value=''>Select a reason</option>
                  <option value='account_issue'>Account Issue</option>
                  <option value='withdrawal_problem'>Withdrawal Problem</option>
                  <option value='deposit_issue'>Deposit Issue</option>
                  <option value='technical_support'>Technical Support</option>
                  <option value='general_inquiry'>General Inquiry</option>
                  <option value='complaint'>Complaint</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>Message</label>
                <textarea
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  placeholder='Describe your issue or inquiry...'
                  rows={4}
                  className='w-full px-4 py-3 bg-darkblack-500 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none'
                />
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  onClick={() => setContactModal(null)}
                  className='flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-all duration-300'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitContact}
                  disabled={!contactReason || !contactMessage}
                  className='flex-1 py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
