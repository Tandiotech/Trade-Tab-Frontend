import { Card } from '@/components/ui/card';
import { BsInstagram, BsTelegram, BsTiktok, BsTwitter } from 'react-icons/bs';

export default function JobFormSocialMedia() {
  return (
    <>
      <div className='grid grid-cols-2 gap-4'>
        <Card className='p-4  transition-all border-slate-800 bg-[#090f1e]'>
          <div className=' mb-4 flex'>
            <BsInstagram className='w-6 h-6 mr-2 text-violet-500' />{' '}
            <h3 className='font-bold text-slate-100'>Instagram</h3>
          </div>
          <input
            name='instagram'
            placeholder='Instagram'
            className='w-full p-4 rounded-lg bg-[#0a1123] border border-slate-800 text-white focus:ring-2 focus:ring-green-700'
          />
          <p className='text-sm text-slate-500 mt-1'>Type your instagram url profile.</p>
        </Card>
        <Card className='p-4  transition-all border-slate-800 bg-[#090f1e]'>
          <div className=' mb-4 flex'>
            <BsTwitter className='w-6 h-6 mr-2 text-cyan-500' />{' '}
            <h3 className='font-bold text-slate-100'>Twitter</h3>
          </div>
          <input
            name='twitter'
            placeholder='Twitter'
            className='w-full p-4 rounded-lg bg-[#0a1123] border border-slate-800 text-white focus:ring-2 focus:ring-green-700'
          />
          <p className='text-sm text-slate-500 mt-1'>Type your twitter url profile.</p>
        </Card>
        <Card className='p-4  transition-all border-slate-800 bg-[#090f1e]'>
          <div className=' mb-4 flex'>
            <BsTiktok className='w-6 h-6 mr-2 text-blue-500' />{' '}
            <h3 className='font-bold text-slate-100'>TikTok</h3>
          </div>
          <input
            name='tiktok'
            placeholder='TikTok'
            className='w-full p-4 rounded-lg bg-[#0a1123] border border-slate-800 text-white focus:ring-2 focus:ring-green-700'
          />
          <p className='text-sm text-slate-500 mt-1'>Type your tiktok url profile.</p>
        </Card>
        <Card className='p-4  transition-all border-slate-800 bg-[#090f1e]'>
          <div className=' mb-4 flex'>
            <BsTelegram className='w-6 h-6 mr-2 text-cyan-500' />{' '}
            <h3 className='font-bold text-slate-100'>Telegram</h3>
          </div>
          <input
            name='telegram'
            placeholder='Telegram'
            className='w-full p-4 rounded-lg bg-[#0a1123] border border-slate-800 text-white focus:ring-2 focus:ring-green-700'
          />
          <p className='text-sm text-slate-500 mt-1'>Type your telegram url profile.</p>
        </Card>
      </div>
    </>
  );
}
