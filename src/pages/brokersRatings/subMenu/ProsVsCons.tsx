import { BiCheck } from 'react-icons/bi';
import { ImCross } from 'react-icons/im';
import AnimatedText from '../../../component/AnimateText';

export default function ProsVsCons({ data }: any) {
  return (
    <div className='w-full mx-auto  p-2 rounded-2xl shadow-xl mt-2 gradient-border bg-gradient-to-b from-transparent via-transparent to-cyan-700 border border-cyan-800 hover:border-cyan-500 ease-in-out duration-300'>
      <div className='flex flex-col items-center flex-wrap justify-center gap-4'>
        <div className='text-center my-5'>
          <div className='flex flex-col font-bold text-xl md:text-3xl lg:text-4xl leading-6 md:leading-8  text-teal-500 mb-5'>
            <h1>Broker Advantages and</h1>
            <h1 className='flex justify-center items-center'>
              Disadvantage <span className='font-bold text-2xl md:text-3xl lg:text-5xl'> 🛡️</span>
            </h1>
          </div>
          <p className='text-white text-base max-lg max-w-4xl text-center px-2  md:px-10'>
            Brokers help connect buyers and sellers, offering expert advice and saving time.
            However, using a broker also comes with fees and less control. Knowing the pros and cons
            helps in making smart decisions.
          </p>
        </div>
        <div className='div_entry_4 flex flex-col md:flex-row justify-center gap-5 w-full'>
          {/* PROS SECTION */}
          <div
            className='w-full md:w-1/2 lg:w-[30rem] rounded-md'
            style={{
              background: 'linear-gradient(to bottom, #033B35, #031F24)',
            }}
          >
            <div className='flex items-center justify-center bg-[#059669] rounded-t-xl'>
              <p className='inline-block py-3 md:py-4 text-lg font-semibold tracking-wider text-gray-100 uppercase'>
                PROS
              </p>
            </div>

            <div className='grid grid-cols-1 gap-4 p-5'>
              {data?.pros?.split('::').map((pro: string, index: number) => {
                const [, description] = pro.includes(';') ? pro.split(';') : ['Pro Title', pro];

                return (
                  <div
                    key={index}
                    className='div_entry relative w-full flex flex-col p-4 rounded-2xl bg-gray-800 shadow-2xl hover:scale-105 transform transition-transform duration-300 ease-in-out'
                  >
                    <div className='absolute inset-y-0 w-1 left-0 bg-gradient-to-b from-teal-400 to-green-400 rounded-l-xl' />
                    <div className='div_entry flex items-start'>
                      <div className='flex-shrink-0'>
                        <div className=' flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-10 md:h-10 lg:w-14 lg:h-14 rounded-full bg-gradient-to-r from-green-500 to-teal-500 shadow-lg hover:animate-pulse'>
                          <BiCheck className='text-white w-6 h-6 sm:w-8 sm:h-8 md:w-6 md:h-6 lg:w-10 lg:h-10' />
                        </div>
                      </div>
                      <div className='ml-3 md:ml-2 lg:ml-4 flex-1 flex items-center h-full '>
                        <div className='whitespace-pre-wrap break-words'>
                          <AnimatedText textSize='' value={description} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CONS SECTION */}
          <div
            className='w-full md:w-1/2 lg:w-[30rem] rounded-md'
            style={{
              background: 'linear-gradient(to bottom, #541019, #280D19)',
            }}
          >
            <div className='flex items-center justify-center bg-[#C94646] rounded-t-xl'>
              <p className='inline-block py-3 md:py-4 text-lg font-semibold tracking-wider text-gray-100 uppercase'>
                CONS
              </p>
            </div>

            <div className='grid grid-cols-1 gap-4 p-5'>
              {data?.cons?.split('::').map((con: string, index: number) => {
                const [, description] = con.includes(';') ? con.split(';') : ['Cons Title', con];

                return (
                  <div
                    key={index}
                    className='div_entry relative w-full flex flex-col p-4 rounded-2xl bg-gray-800 shadow-2xl hover:scale-105 transform transition-transform duration-300 ease-in-out'
                  >
                    <div className='absolute inset-y-0 w-1 left-0 bg-gradient-to-b from-red-400 to-pink-500 rounded-l-xl' />
                    <div className='flex items-start'>
                      <div className='flex-shrink-0'>
                        <div className='flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-10 md:h-10 lg:w-14 lg:h-14 rounded-full bg-gradient-to-r from-red-500 to-pink-500 shadow-lg hover:animate-pulse'>
                          <ImCross className='text-white w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5 lg:w-8 lg:h-8 p-1' />
                        </div>
                      </div>
                      <div className='ml-3 md:ml-2 lg:ml-4 flex-1 flex items-center h-full'>
                        <div className='whitespace-pre-wrap break-words'>
                          <AnimatedText
                            textSize=' '
                            fromColor='from-red-400'
                            toColor='to-red-300'
                            value={description}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
