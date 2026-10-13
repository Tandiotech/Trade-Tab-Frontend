import TabBtn from '../buttons/TabBtn';
import {
  // FaNetworkWired,
  FaRegUser,
  FaWpforms,
} from 'react-icons/fa';
import { IoHelpSharp } from 'react-icons/io5';
import { MdOutlineSecurity } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import { PiFolderSimple } from 'react-icons/pi';
import { CiViewTable } from 'react-icons/ci';

export default function AccountSettingsSidebar() {
  const _size = 25;
  const { pathname: location } = useLocation();
  const pathParts = location.split('/');

  return (
    <aside className='col-span-3 px-4 xl:dark:border-darkblack-400 '>
      {/* Sidebar Tabs */}

      <div
        className='<div className="px-4 py-6 sticky top-32 z-50">
 '
      >
        <TabBtn
          link={`${pathParts.includes('settings') ? '' : ''}`}
          title={` ${pathParts.includes('settings') ? 'Personal Information' : 'Account Profile'} `} //personalData
          text={` ${pathParts.includes('settings') ? 'Update your personal data' : 'Update account data'} `} //personalData
        >
          <FaRegUser size={_size} />
        </TabBtn>

        {pathParts.includes('settings') ? (
          <>
            <TabBtn link='security' title='Security' text='Security your personal data'>
              <MdOutlineSecurity size={_size} />
            </TabBtn>

            <TabBtn link='faq' title='FAQs' text='Here are some FAQs  '>
              <IoHelpSharp size={_size} />
            </TabBtn>
            <TabBtn
              link='termsAndconditions'
              title='terms & conditions'
              text='Here are the Terms and Conditions. '
            >
              <FaWpforms size={_size} />
            </TabBtn>
          </>
        ) : (
          <>
            <TabBtn link='disableSymbols' title='Disable Symbols' text='Folder Account Settings'>
              <PiFolderSimple size={_size} />
            </TabBtn>

            <TabBtn
              link='SymbolSpeficitations'
              title='Symbols Specifications'
              text='Symbols data table'
            >
              <CiViewTable />
            </TabBtn>
          </>
        )}
      </div>
    </aside>
  );
}
