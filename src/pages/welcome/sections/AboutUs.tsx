import EarthCanvas from '../../../canvas/Earth';
import { motion } from 'framer-motion';
import { slideIn } from '../../../canvas/motion';
// import Highlights from './Highlights';

export interface AboutUsProps {
  scrollDownRef: any;
}

export default function AboutUs({ scrollDownRef }: AboutUsProps) {
  return (
    <section id='about' className='choose-area-two choosex-bg px-8 md:px-32 overflow-hidden '>
      <div ref={scrollDownRef} style={{ overflow: 'visible' }} className='max-w-7xl mx-auto'>
        <div className='xl:grid xl:grid-cols-1 '>
          <div className='absolute right-10 rounded-full z-0 opacity-50'>
            <div
              className='wow fadeInLeft rounded min-w-[40vw] -z-50 overflow-hidden hidden md:block'
              data-wow-delay='.2s'
            >
              <motion.div variants={slideIn('right', 'tween', 0.2, 1)} className='w-full -z-30 '>
                <EarthCanvas />
              </motion.div>
            </div>
          </div>

          <div className='wow fadeInRight mt-2 -mb-20 z-10 max-w-4xl' data-wow-delay='.2s'>
            <div className='section-title mb-6'>
              <span className='sub-title'>Who we are</span>
              <h2 className='title' style={{fontSize:'2rem'}}>
                {/* The Leading Platform for <span>Forex Trading</span> Insights and Analytics */}
                Connect with the world’s elite traders and <span>Elevate your trading game.</span> Share and view verified performance results from top professionals across the globe


              </h2>
            </div>
            {/* <p className='font-poppins text-white antialiased'>
              At TradeTab, we provide traders with the tools and insights they need to make informed
              trading decisions. Our platform offers comprehensive analytics, performance tracking,
              and real-time market data to help you navigate the forex market with confidence.
            </p> */}
            <a href='/signup' className='btn w-full md:w-auto mt-4 hover:bg-slate-950'>
              Get Started
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
