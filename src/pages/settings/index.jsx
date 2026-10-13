import AccountSettingsSidebar from '../../component/settings/AccountSettingsSidebar';
import { Outlet } from 'react-router-dom';

export default function AccountSettings() {
  return (
    <main className='div_entry w-full px-6 pb-10 pt-5 min-h-screen'>
      <div className='grid  grid-cols-1 xl:grid-cols-12 bg-slate-900 border-2 rounded-2xl bg-gradient-to-t from-cyan-700 via-transparent to-transparent md:border border-cyan-800 hover:border-cyan-500 ease-in-out duration-300'>
        <AccountSettingsSidebar />
        <div className='md:py-5 lg:py-8 md:px-5 lg:px-10 col-span-9 tab-content'>
          <Outlet /> {/* El `Outlet` permitirá renderizar las rutas hijas */}
        </div>
      </div>
    </main>
  );
}
