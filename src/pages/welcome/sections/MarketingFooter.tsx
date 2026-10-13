import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

export default function MarketingFooter() {
  return (
    <footer id='company' className='tt-footer'>
      <div className='tt-footer-grid'>
        <div>
          <div className='flex items-center gap-2 font-semibold text-[var(--tt-fg-0)]'>
            <BarChart3 className='h-6 w-6 text-[var(--tt-profit)]' />
            TradeTab
          </div>
          <p className='mt-3 max-w-[260px] text-[13px] leading-relaxed text-[var(--tt-fg-3)]'>
            Real-time trading analytics built for serious traders. Track, analyze, improve.
          </p>
        </div>
        <div className='tt-footer-col'>
          <h5>Product</h5>
          <Link to='/metrics'>Metrics</Link>
          <Link to='/journal'>Journal</Link>
          <Link to='/brokers'>Brokers</Link>
          <Link to='/forexCalculator'>Calculators</Link>
        </div>
        <div className='tt-footer-col'>
          <h5>Learn</h5>
          <Link to='/university'>Free University</Link>
          <Link to='/careers'>Careers</Link>
        </div>
        <div className='tt-footer-col'>
          <h5>Support</h5>
          <Link to='/settings/faq'>Help center</Link>
          <Link to='/settings/termsAndconditions'>Terms</Link>
        </div>
        <div className='tt-footer-col'>
          <h5>Account</h5>
          <Link to='/login'>Sign in</Link>
          <Link to='/signup'>Create account</Link>
        </div>
      </div>
      <div className='tt-footer-bottom'>
        <div>
          © {new Date().getFullYear()} TradeTab. Trading involves risk — past performance is not
          indicative of future results.
        </div>
      </div>
    </footer>
  );
}
