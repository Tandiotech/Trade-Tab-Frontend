import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaPlay } from 'react-icons/fa';
import RegisterFormSteps from './RegisterFormSteps';
import RegisterWelcomeVideo from './RegisterWelcomeVideo';
import { handleWhatsAppClick } from '../../../utils/handleWhatsAppClick';
import './tradetabSignupShell.css';

const Register = () => {
  return (
    <div
      id='tt-signup-root'
      data-layout='split'
      data-accent='teal'
      data-density='comfortable'
      data-glow='true'
    >
      <Helmet prioritizeSeoTags>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap'
          rel='stylesheet'
        />
        <meta
          name='description'
          content='Join TradeTab - Start your trading journey today with our elite platform.'
        />
        <meta property='og:type' content='website' />
        <title>Join TradeTab - Start Trading Today</title>
      </Helmet>

      <div className='bg-stage' aria-hidden>
        <div className='bg-grid' />
        <div className='bg-noise' />
      </div>

      <nav className='topbar'>
        <Link to='/' className='logo'>
          <img src='/logo-lockup.png' alt='TradeTab' className='h-7' />
        </Link>
        <Link to='/login' className='nav-pill'>
          <span className='dot' />
          <span>Already have an account?</span>
          <strong style={{ color: 'var(--ink-0)', fontWeight: 500 }}>Sign in</strong>
          <span className='arrow'>→</span>
        </Link>
      </nav>

      <main className='stage'>
        <section className='hero'>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className='eyebrow'>
              <span className='live' />
              Live markets · Join in minutes
            </div>
            <h1>
              Trade with the
              <br />
              edge of <em>institutions</em>.
            </h1>
            <p className='lede'>
              Journaling, metrics, and broker tools built for serious retail traders. Create your
              profile in a few quick steps.
            </p>
          </div>

          <div className='data-card'>
            <div className='relative min-h-[220px] w-full md:min-h-[280px]'>
              <RegisterWelcomeVideo />
              <div
                className='pointer-events-none absolute inset-0'
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.55), transparent 55%, transparent)',
                }}
              />
              <div className='absolute bottom-4 left-4 right-4 flex items-end md:bottom-6 md:left-6 md:right-6'>
                <div className='flex items-center gap-3'>
                  <div
                    className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full'
                    style={{
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.12)',
                    }}
                  >
                    <FaPlay className='ml-0.5 text-white' style={{ width: 14, height: 14 }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--ink-0)', fontSize: 14 }}>
                      Welcome to TradeTab
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-2)' }}>
                      See the platform in action
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='stats'>
              <div className='stat'>
                <div className='k'>Community</div>
                <div className='v'>10K+</div>
              </div>
              <div className='stat'>
                <div className='k'>Focus</div>
                <div className='v'>Journal</div>
              </div>
              <div className='stat'>
                <div className='k'>Security</div>
                <div className='v'>TLS</div>
              </div>
            </div>
          </div>

          <div className='testimonial'>
            <div className='avatar' />
            <div>
              <p>
                &ldquo;Clean workflow for journaling and metrics. Finally one place for the trading
                stack.&rdquo;
              </p>
              <div className='who'>TradeTab trader · Verified</div>
            </div>
          </div>
        </section>

        <section className='form-col'>
          <RegisterFormSteps />

          <div className='promo'>
            <div className='promo-icon' aria-hidden>
              <FaWhatsapp size={18} />
            </div>
            <div>
              <p className='t'>New to trading?</p>
              <p className='s'>Get personalized guidance on WhatsApp — we reply fast.</p>
            </div>
            <button type='button' className='cta' onClick={handleWhatsAppClick}>
              Chat →
            </button>
          </div>

          <div className='trust'>
            <span>
              © {new Date().getFullYear()} TradeTab ·{' '}
              <Link to='/privacy' style={{ color: 'inherit' }}>
                Privacy
              </Link>{' '}
              ·{' '}
              <Link to='/terms' style={{ color: 'inherit' }}>
                Terms
              </Link>
            </span>
            <span className='badges'>
              <span>256-bit TLS</span>
              <span>Privacy-first</span>
            </span>
          </div>

          <div className='switch-link'>
            Already have an account? <Link to='/login'>Sign in →</Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Register;
