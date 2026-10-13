import { FaInstagram } from 'react-icons/fa6';

export default function FooterNotConnected() {
  const onScrollTopClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer>
      <div className='footer-area-two bg-black border-t-2 border-teal-400'>
        <div className='container md:w-9/12 lg:w-full mx-auto px-4'>
          <div className='footer-top '>
            <div className='flex flex-wrap'>
              <div className='w-10/12 mx-auto md:mx-0 md:w-full'>
                <div className='footer-menu-two'>
                  <ul className='flex gap-2 lg:gap-5 space-x-4'>
                    <li>
                      <a href='/' className=' text-slate-400'>
                        Home
                      </a>
                    </li>
                    <li>
                      <a href='/metrics' className=' text-slate-400'>
                        Metrics
                      </a>
                    </li>
                    <li>
                      <a href='/journal' className=' text-slate-400'>
                        Journal
                      </a>
                    </li>
                    <li>
                      <a href='/search' className=' text-slate-400'>
                        Brokers
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className='w-11/12 mx-auto md:w-full pt-10 md:pt-0'>
                <div className='footer-social flex justify-center md:justify-end space-x-4'>
                  <ul className='flex gap-5 space-x-4'>
                    <li>
                      <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://www.instagram.com/tradetab/'
                      >
                        {/* <i className='fab fa-facebook-square'></i> */}
                        <FaInstagram className='text-teal-500' />
                      </a>
                    </li>
                    {/* <li>
                      <a href='#'>
                        <i className='fab fa-twitter'></i>
                      </a>
                    </li>
                    <li>
                      <a href='#'>
                        <i className='fab fa-vimeo-v'></i>
                      </a>
                    </li>
                    <li>
                      <a href='#'>
                        <i className='fab fa-youtube'></i>
                      </a>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className='footer-bottom py-4'>
            <div className='flex flex-wrap'>
              <div className='w-full lg:w-5/12'>
                <div className=' '>
                  <p className='text-slate-400'>
                    Copyright &copy; 2024. All Rights Reserved TradeTab
                  </p>
                </div>
              </div>
              <div
                onClick={onScrollTopClick}
                className='w-full hidden lg:w-2/12 lg:block text-center'
              >
                <div className='scroll-up'>
                  <button className='scroll-to-target' data-target='html'>
                    <i className='fas fa-arrow-up'></i>
                  </button>
                  <span className='text-teal-600'>scroll Top</span>
                </div>
              </div>
              <div className='w-full lg:w-5/12'>
                <div className='footer-bottom-menu'>
                  <ul className='flex justify-end space-x-4'>
                    <li>{/* <a href='#'>Terms of Service</a> */}</li>
                    <li>{/* <a href='#'>Privacy Policy</a> */}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
