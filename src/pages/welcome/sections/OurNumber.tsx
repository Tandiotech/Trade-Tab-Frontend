// import { ChartBarIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
import {
  // Calendar,
  // ChartArea,
  // ChartBarBig,
  // ChartColumnIcon,
  // ChartLine,
  CandlestickChart,
} from 'lucide-react';
import CountUp from 'react-countup';
import { BiUser } from 'react-icons/bi';
import { BsCheck } from 'react-icons/bs';

export default function OurNumber() {
  return (
    <>
      {/* <section className='counter-area relative  bg-[#050A1D] '> */}
      <section className='counter-area relative  bg-[#050A1D] '>
        {/* <div className='-mt-96 '> */}
        <div className='-mt-24'>
          <div className=' bg-gradient-to-t from-black  via-black to-transparent  relative h-full z-20  '>
            <div className='text-white w-full mx-auto pt-44 z-30 relative max-w-screen-xl md:-mt-96 -mt-36 '>
              {/* <p className='text-center md:text-5xl text-4xl max-w-sm md:max-w-4xl mx-auto pt-10 font-bold text-white mb-4'>
                And many more metrics...
              </p> */}
              {/* <div className='flex-wrap flex gap-3 justify-center '>
                <div className='flex border-2 rounded-full border-cyan-950 mx-3 items-center px-6 py-1'>
                  <ChartArea className='h-6 w-6 text-emerald-600 mr-3' />
                  <div className='w-fit md:text-xl text-xs font-semibold'>Dynamic Trader Chart</div>
                </div>
                <div className='flex border-2 rounded-full border-cyan-950 mx-3 items-center px-6 py-1'>
                  <ChartBarSquareIcon className='h-6 w-6 text-yellow-600 mr-3' />
                  <div className='w-fit md:text-xl text-xs font-semibold'>Estimation Calc </div>
                </div>
                <div className='flex border-2 rounded-full border-cyan-950 mx-3 items-center px-6 py-1'>
                  <Calendar className='h-6 w-6 text-amber-600 mr-3' />
                  <div className='w-fit md:text-xl text-xs font-semibold'>Custom Journal</div>
                </div>
                <div className='flex border-2 rounded-full border-cyan-950 mx-3 items-center px-6 py-1'>
                  <CandlestickChart className='h-6 w-6 text-cyan-600 mr-3' />
                  <div className='w-fit md:text-xl text-xs font-semibold'>Monthly Performance </div>
                </div>
                <div className='flex border-2 rounded-full border-cyan-950 mx-3 items-center px-6 py-1'>
                  <ChartBarIcon className='h-6 w-6 text-teal-600 mr-3' />
                  <div className='w-fit md:text-xl text-xs font-semibold'>Win/Loss </div>
                </div>
                <div className='flex border-2 rounded-full border-cyan-950 mx-3 items-center px-6 py-1'>
                  <ChartColumnIcon className='h-6 w-6 text-rose-600 mr-3' />
                  <div className='w-fit md:text-xl text-xs font-semibold'>Long/Short Chart </div>
                </div>
                <div className='flex border-2 rounded-full border-cyan-950 mx-3 items-center px-6 py-1'>
                  <ChartLine className='h-6 w-6 text-violet-600 mr-3' />
                  <div className='w-fit md:text-xl text-xs font-semibold'>Profit vs Loss </div>
                </div>
                <div className='flex border-2 rounded-full border-cyan-950 mx-3 items-center px-6 py-1'>
                  <ChartBarBig className='h-6 w-6 text-blue-600 mr-3' />
                  <div className='w-fit md:text-xl text-xs font-semibold'>Most Traded Assets </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <div className='bg-black w-full  lg:mx-auto relative z-20 px-10 py-8'>
        <div className='pt-5 pb-0 px-10 md:px-20 rounded-2xl border border-cyan-500  mx-auto max-w-6xl'>
          <div className='flex flex-col justify-center md:grid md:grid-cols-2 xl:grid-cols-3 '>
            <div className='md:flex md:justify-center lg:block'>
              <div className='counter-item'>
                <div className='counter-icon'>
                  <BiUser className='w-14 h-14 text-emerald-400' />
                </div>
                <div className='counter-content'>
                  <h2 className='count md:text-5xl text-3xl font-semibold'>
                    <CountUp end={6516} duration={3} />
                  </h2>
                  <p className='text-white'> Active Traders</p>
                </div>
              </div>
            </div>
            <div className='row-span-2 col-span-2 md:flex md:justify-center lg:block lg:col-span-1'>
              <div className='counter-item'>
                <div className='counter-icon'>
                  <CandlestickChart className='w-14 h-14 text-emerald-400' />
                </div>
                <div className='counter-content'>
                  <h2 className='count md:text-5xl text-3xl font-semibold'>
                    ${' '}
                    <CountUp
                      end={21175841}
                      duration={3}
                      formattingFn={(value: number) => (value / 1_000_000).toFixed(1) + 'M'}
                    />
                    +
                  </h2>

                  <p className='text-white'>Traded Daily</p>
                </div>
              </div>
            </div>
            <div className='row-start-1 md:flex md:justify-center lg:block'>
              <div className='counter-item'>
                <div className='counter-icon'>
                  <BsCheck className='w-14 h-14 text-emerald-400' />
                </div>
                <div className='counter-content'>
                  <h2 className='count md:text-5xl text-3xl font-semibold'>
                    <CountUp end={1200} duration={3} />+
                  </h2>
                  <p className='text-white'> Reviewed Brokers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
