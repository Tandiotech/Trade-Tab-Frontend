import { useState, useEffect, useRef } from 'react';
import { useMTAccounts } from '../../context/accounts/MTAccountsContext';
import AccountFilter from '../forms/AccountFilter';
import getUser from '../../utils/getUser.tsx';
import { ChevronDown } from 'lucide-react';
// import TrustPilotButton from '../TrustPilotButton.tsx';
import MainHeaderMenu from './MainHeaderMenu.tsx';
import { BACKEND_URL } from '@/utils/GlobalVars.ts';
import Avatar from '../Avatar/Avatar';

interface ProfilePictureProps {
  name: string;
}

export default function ProfilePicture({ name }: ProfilePictureProps) {
  const [openMenuProfile, setOpenMenuProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { accounts } = useMTAccounts();

  const LoginOut = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('accountsData');
    window.location.href = '/';
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuProfile(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setOpenMenuProfile(!openMenuProfile);

  return (
    <div className='relative' ref={menuRef}>
      {/* Desktop: account + profile only (Telegram lives in Navbar toolbar) */}
      <div className='hidden md:flex items-center gap-2'>
        <AccountFilter options={accounts?.map((account: any) => account)} />

        <div
          className='flex cursor-pointer items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 transition hover:border-white/10 hover:bg-white/[0.04]'
          onClick={toggleMenu}
        >
            <Avatar
              src={getUser?.selectedAvatar ? BACKEND_URL + getUser.selectedAvatar : null}
              name={name}
              size="sm"
              showOnlineIndicator={true}
            />

            <div className='flex flex-col'>
              <span className='text-white text-sm font-medium'>{name || 'User'}</span>
              <span className='text-gray-400 text-xs'>Online</span>
            </div>

            <ChevronDown
              className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200 ${openMenuProfile ? 'rotate-180' : ''}`}
            />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='md:hidden flex items-center'>
        <div onClick={toggleMenu} className="cursor-pointer p-0.5">
          <Avatar
            src={getUser?.selectedAvatar ? BACKEND_URL + getUser.selectedAvatar : null}
            name={name}
            size="sm"
            showOnlineIndicator={true}
          />
        </div>
      </div>

      {/* User Menu Dropdown */}
      {openMenuProfile && (
        <MainHeaderMenu
          name={name}
          accounts={accounts}
          openMenuProfile={openMenuProfile}
          setOpenMenuProfile={setOpenMenuProfile}
          toggleMenu={toggleMenu}
          LoginOut={LoginOut}
        />
      )}
    </div>
  );
}
