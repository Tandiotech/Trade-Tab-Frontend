import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <section className='py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#050A1D] via-teal-900/10 to-[#050A1D]'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-gray-900/50 border border-teal-500/30 rounded-2xl p-8 md:p-12 backdrop-blur-sm'>
          <h2 className='text-3xl sm:text-4xl font-bold text-white mb-4 text-center'>
            Increase your Consistency Score this week.
          </h2>
          <p className='text-lg text-gray-400 mb-8 text-center max-w-2xl mx-auto'>
            Conecta tu cuenta, detecta tu leak #1 y aplica un guardrail. TradeTab te empuja a
            ejecución: habits simple + clear rules + weekly progress.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/signup'
              className='px-8 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors duration-200 text-center'
            >
              Register for Free
            </Link>
            <Link
              to='/login'
              className='px-8 py-3 text-white font-semibold rounded-lg border border-teal-500/30 hover:border-teal-500/50 hover:bg-teal-500/10 transition-colors duration-200 text-center'
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
