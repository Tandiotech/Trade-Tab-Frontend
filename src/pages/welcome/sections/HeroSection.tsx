import { Link } from 'react-router-dom';
import { OFFICIAL_TELEGRAM } from '@/utils/GlobalVars';
import { FaTelegram } from 'react-icons/fa';
import { Heart, Star, Shield, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className='relative min-h-[90vh] flex items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto w-full'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          {/* Left Content */}
          <div className='space-y-8'>
            {/* Breadcrumb */}
            <div className='flex items-center gap-2 text-sm text-gray-400'>
              <span>MT4/MT5</span>
              <span className='w-1.5 h-1.5 bg-teal-500 rounded-full'></span>
              <span>Consistency Engine</span>
              <span className='text-gray-600'>→</span>
              <span>Habits</span>
              <span className='text-gray-600'>→</span>
              <span>Rules</span>
              <span className='text-gray-600'>→</span>
              <span>Results</span>
            </div>

            {/* Main Heading */}
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight'>
              Build <span className='text-teal-400'>Consistency</span> like a system.
            </h1>

            {/* Description */}
            <p className='text-lg text-gray-300 leading-relaxed max-w-2xl'>
              TradeTab converts your history into a system of habits and guardrails: less impulses,
              more execution. Your goal is not to look at charts... it is to maintain a process.
            </p>

            {/* CTA Buttons */}
            <div className='flex flex-wrap gap-4'>
              <Link
                to='/signup'
                className='px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors duration-200'
              >
                Get your Consistency Score
              </Link>
              <Link
                to='#score'
                className='px-6 py-3 text-white font-semibold rounded-lg border border-teal-500/30 hover:border-teal-500/50 hover:bg-teal-500/10 transition-colors duration-200'
              >
                See how it works
              </Link>
              <a
                href={OFFICIAL_TELEGRAM}
                target='_blank'
                rel='noopener noreferrer'
                className='px-6 py-3 text-white font-semibold rounded-lg border border-teal-500/30 hover:border-teal-500/50 hover:bg-teal-500/10 transition-colors duration-200 flex items-center gap-2'
              >
                <span className='w-2 h-2 bg-teal-500 rounded-full'></span>
                Community & Support
              </a>
            </div>

            {/* Feature Tags */}
            <div className='flex flex-wrap gap-3 pt-4'>
              <div className='flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-full text-sm text-gray-300'>
                <Heart className='w-4 h-4 text-pink-400' />
                <span>Anti-tilt guardrails</span>
              </div>
              <div className='flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-full text-sm text-gray-300'>
                <Star className='w-4 h-4 text-yellow-400' />
                <span>Weekly habit plan</span>
              </div>
              <div className='flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-full text-sm text-gray-300'>
                <Shield className='w-4 h-4 text-gray-400' />
                <span>Risk rules</span>
              </div>
              <div className='flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-full text-sm text-gray-300'>
                <Zap className='w-4 h-4 text-yellow-400' />
                <span>Lightweight UI</span>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Card */}
          <div className='lg:block hidden'>
            <div className='bg-gray-900/50 border border-teal-500/30 rounded-xl p-6 backdrop-blur-sm'>
              {/* Top Metrics */}
              <div className='grid grid-cols-3 gap-4 mb-6'>
                <div>
                  <div className='text-sm text-gray-400 mb-1'>Consistency</div>
                  <div className='text-2xl font-bold text-white'>81</div>
                </div>
                <div>
                  <div className='text-sm text-gray-400 mb-1'>Discipline</div>
                  <div className='text-2xl font-bold text-teal-400'>+12</div>
                </div>
                <div>
                  <div className='text-sm text-gray-400 mb-1'>Tilt</div>
                  <div className='text-2xl font-bold text-red-400'>-18%</div>
                </div>
              </div>

              <div className='flex items-center gap-2 mb-4'>
                <span className='w-2 h-2 bg-teal-500 rounded-full'></span>
                <span className='text-sm text-teal-400'>Live sync</span>
              </div>

              {/* Weekly Rhythm Chart */}
              <div className='mb-6'>
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='text-white font-semibold'>Weekly Rhythm</h3>
                  <span className='text-xs px-2 py-1 bg-gray-800/50 text-teal-400 rounded'>
                    Habit loop
                  </span>
                </div>
                {/* Simple SVG Line Chart */}
                <div className='h-24 bg-gray-800/30 rounded-lg p-2'>
                  <svg viewBox='0 0 200 60' className='w-full h-full'>
                    <defs>
                      <linearGradient id='lineGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                        <stop offset='0%' stopColor='#10B981' stopOpacity='0.8' />
                        <stop offset='100%' stopColor='#10B981' stopOpacity='1' />
                      </linearGradient>
                    </defs>
                    <polyline
                      points='5,50 20,45 35,40 50,35 65,30 80,25 95,20 110,18 125,15 140,12 155,10 170,8 185,5'
                      fill='none'
                      stroke='url(#lineGradient)'
                      strokeWidth='2'
                    />
                    <circle cx='185' cy='5' r='3' fill='#10B981' />
                  </svg>
                </div>
              </div>

              {/* Habit Loop Items */}
              <div className='space-y-2 mb-6'>
                <div className='flex items-center justify-between p-2 bg-gray-800/30 rounded'>
                  <span className='text-sm text-white'>Habit 1: Pre-trade checklist</span>
                  <span className='text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded'>Daily</span>
                </div>
                <div className='flex items-center justify-between p-2 bg-gray-800/30 rounded'>
                  <span className='text-sm text-white'>Rule: Stop after 2 losses</span>
                  <span className='text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded'>Hard</span>
                </div>
                <div className='flex items-center justify-between p-2 bg-gray-800/30 rounded'>
                  <span className='text-sm text-white'>Habit 2: Post-trade notes</span>
                  <span className='text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded'>Daily</span>
                </div>
              </div>

              {/* Bottom Metrics */}
              <div className='grid grid-cols-3 gap-4 pt-4 border-t border-gray-700/50'>
                <div>
                  <div className='text-xs text-gray-400 mb-1'>Best session</div>
                  <div className='text-sm font-semibold text-white'>London</div>
                  <div className='text-xs text-gray-500'>calm + execution</div>
                </div>
                <div>
                  <div className='text-xs text-gray-400 mb-1'>Risk drift</div>
                  <div className='text-sm font-semibold text-teal-400'>+0.4%</div>
                  <div className='text-xs text-gray-500'>normalize size</div>
                </div>
                <div>
                  <div className='text-xs text-gray-400 mb-1'>Trigger</div>
                  <div className='text-sm font-semibold text-red-400'>Revenge</div>
                  <div className='text-xs text-gray-500'>2 events detected</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
