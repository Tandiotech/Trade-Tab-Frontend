import { useState } from 'react';
import { User, Settings, LogOut, Circle, Star, Briefcase } from 'lucide-react';
import AccountFilter from '../forms/AccountFilter';
import getUser from '../../utils/getUser.tsx';
import ForexCalculatorModal from '../modals/ForexCalculatorModal';
import { BACKEND_URL } from '@/utils/GlobalVars.ts';
import { GoReport } from 'react-icons/go';
import Avatar from '../Avatar/Avatar';

interface MainHeaderMenuProps {
  name: string;
  accounts: any[];
  openMenuProfile: boolean;
  setOpenMenuProfile: (openMenuProfile: boolean) => void;
  toggleMenu: () => void;
  LoginOut: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export default function MainHeaderMenu({
  name,
  accounts,
  setOpenMenuProfile,
  LoginOut,
}: MainHeaderMenuProps) {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showTrustPilotPrompt, setShowTrustPilotPrompt] = useState(false);

  const handleTrustPilotClick = () => {
    setShowTrustPilotPrompt(true);
  };

  const handleLeaveTrustPilotReview = () => {
    window.open('https://www.trustpilot.com/review/tradetab.com', '_blank', 'noopener,noreferrer');
    setShowTrustPilotPrompt(false);
    setOpenMenuProfile(false);
  };

  return (
    <>
      <div className='absolute right-0 top-full mt-2 w-72 bg-darkblack-700/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden'>
        {/* Mobile Account Filter */}
        <div className='md:hidden p-3 border-b border-gray-700/50'>
          <AccountFilter options={accounts} />
        </div>

        {/* User Info */}
        <div className='p-4 border-b border-gray-700/50 bg-gradient-to-r from-darkblack-600/30 to-transparent'>
          <div className='flex items-center gap-3'>
            <Avatar
              src={getUser?.selectedAvatar ? BACKEND_URL + getUser.selectedAvatar : null}
              name={name}
              size="lg"
              className="ring-2 ring-teal-500/30"
            />
            <div className='flex-1'>
              <p className='text-white font-semibold'>{name || 'User'}</p>
              <div className='flex items-center gap-1.5 mt-1'>
                <Circle className='w-2 h-2 text-green-500 fill-green-500 animate-pulse' />
                <span className='text-gray-400 text-xs'>Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className='p-2'>
          {getUser?.rol == 1 && (
            <a
              href='/Admin'
              className='flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-darkblack-600/70 rounded-lg transition-all duration-200 group'
              onClick={() => setOpenMenuProfile(false)}
            >
              Admin
            </a>
          )}
          <a
            href='/settings'
            className='flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-darkblack-600/70 rounded-lg transition-all duration-200 group'
            onClick={() => setOpenMenuProfile(false)}
          >
            <div className='p-1.5 bg-gray-700/30 rounded-md group-hover:bg-gray-600/50 transition-colors'>
              <Settings className='w-4 h-4' />
            </div>
            <span className='font-medium'>Settings</span>
          </a>

          <a
            href='/jobs'
            className='flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-darkblack-600/70 rounded-lg transition-all duration-200 group'
            onClick={() => setOpenMenuProfile(false)}
          >
            <div className='p-1.5 bg-purple-700/30 rounded-md group-hover:bg-purple-600/50 transition-colors'>
              <Briefcase className='w-4 h-4' />
            </div>
            <span className='font-medium'>Jobs</span>
          </a>

       

          <a
            href='/report'
            className='flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-darkblack-600/70 rounded-lg transition-all duration-200 group'
            onClick={() => setOpenMenuProfile(false)}
          >
            <div className='p-1.5 bg-orange-700/30 rounded-md group-hover:bg-purple-600/50 transition-colors'>
              <GoReport className='w-4 h-4' />
            </div>
            <span className='font-medium'>Report</span>
          </a>
        </div>

        {/* TrustPilot Section */}
        {!showTrustPilotPrompt ? (
          <div className='p-2 border-t border-gray-700/50'>
            <button
              onClick={handleTrustPilotClick}
              className='w-full flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-green-500/10 rounded-lg transition-all duration-200 group'
            >
              <div className='p-1.5 bg-green-700/30 rounded-md group-hover:bg-green-600/50 transition-colors'>
                <Star className='w-4 h-4 text-green-400' />
              </div>
              <span className='font-medium'>Enjoying TradeTab?</span>
            </button>
          </div>
        ) : (
          <div className='p-4 border-t border-gray-700/50 bg-gradient-to-br from-green-900/20 to-teal-900/20'>
            <div className='space-y-3'>
              <div className='flex items-start gap-2'>
                <Star className='w-5 h-5 text-green-400 flex-shrink-0 mt-0.5' />
                <div>
                  <p className='text-white font-semibold text-sm mb-1'>
                    Love TradeTab? Share your experience!
                  </p>
                  <p className='text-gray-400 text-xs leading-relaxed'>
                    Your review helps us improve and helps other traders discover TradeTab.
                  </p>
                </div>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={handleLeaveTrustPilotReview}
                  className='flex-1 px-3 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-green-500/20'
                >
                  Leave Review
                </button>
                <button
                  onClick={() => setShowTrustPilotPrompt(false)}
                  className='px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 text-sm rounded-lg transition-colors'
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className='p-2 border-t border-gray-700/50'>
          <button
            onClick={e => {
              LoginOut(e);
              setOpenMenuProfile(false);
            }}
            className='w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 group'
          >
            <div className='p-1.5 bg-red-700/30 rounded-md group-hover:bg-red-600/50 transition-colors'>
              <LogOut className='w-4 h-4' />
            </div>
            <span className='font-medium'>Log out</span>
          </button>
        </div>
      </div>

      {/* Forex Calculator Modal */}
      <ForexCalculatorModal isOpen={showCalculator} onClose={() => setShowCalculator(false)} />
    </>
  );
}
