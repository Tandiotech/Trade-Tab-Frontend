import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';

export default function ProfilePage() {
  const { handle } = useParams();

  // --- Mocked data (replace with real fetch by handle) ---
  const profile = useMemo(() => ({
    handle: handle || 'alpha',
    displayName: 'Alpha Trader',
    bio: 'Risk-first FX swing trader. Sharing trades and journaling process.',
    country: 'US',
    badges: ['risk-disciplined', 'weekly-top-10'],
    stats: {
      returnPct30d: 12.3,
      maxDrawdown30d: 3.4,
      winRate30d: 61,
      volumeLots30d: 210,
      activeFollowers: 127,
    },
    // soft-funnel links
    links: {
      partner: 'https://broker.example.com/signup?utm_source=tradetab&utm_medium=profile&utm_campaign=join-challenge&utm_content=alpha',
      telegram: 'https://t.me/your_vip_group',
      calendly: 'https://calendly.com/analyst-alpha/15min',
    }
  }), [handle]);

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/u/${profile.handle}`);
    } catch {}
  };

  return (
    <div className='px-4 sm:px-6 md:px-8 pt-4 md:pt-6 text-white max-w-6xl mx-auto w-full'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold'>@{profile.handle}</h1>
          <p className='text-white/70 mt-1'>{profile.displayName}</p>
        </div>
        <div className='flex items-center gap-2'>
          <button onClick={copyShare} className='px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 transition'>Share</button>
          <Link to='/leaderboards' className='px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition'>Leaderboards</Link>
        </div>
      </div>

      {/* Grid: profile + CTA */}
      <div className='mt-5 grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Left: Profile card */}
        <div className='md:col-span-2 rounded-xl border border-white/10 p-4 bg-white/5'>
          <div className='flex items-center gap-3'>
            <div className='h-14 w-14 rounded-full bg-white/20' />
            <div>
              <div className='font-semibold'>{profile.displayName}</div>
              <div className='text-white/60 text-sm'>{profile.bio}</div>
            </div>
          </div>

          {/* Quick stats */}
          <div className='mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center'>
            <div className='rounded-lg bg-white/10 p-3'>
              <div className='text-xs text-white/60'>30d Return</div>
              <div className='text-lg font-semibold'>{profile.stats.returnPct30d}%</div>
            </div>
            <div className='rounded-lg bg-white/10 p-3'>
              <div className='text-xs text-white/60'>30d Max DD</div>
              <div className='text-lg font-semibold'>{profile.stats.maxDrawdown30d}%</div>
            </div>
            <div className='rounded-lg bg-white/10 p-3'>
              <div className='text-xs text-white/60'>30d Win rate</div>
              <div className='text-lg font-semibold'>{profile.stats.winRate30d}%</div>
            </div>
            <div className='rounded-lg bg-white/10 p-3'>
              <div className='text-xs text-white/60'>30d Volume</div>
              <div className='text-lg font-semibold'>{profile.stats.volumeLots30d} lots</div>
            </div>
            <div className='rounded-lg bg-white/10 p-3'>
              <div className='text-xs text-white/60'>Active members</div>
              <div className='text-lg font-semibold'>{profile.stats.activeFollowers}</div>
            </div>
          </div>

          {/* Performance preview */}
          <div className='mt-6 rounded-xl border border-white/10 p-4 bg-white/5'>
            <div className='flex items-center justify-between'>
              <div className='font-semibold mb-3'>Recent performance</div>
              <div className='text-xs text-white/50'>Preview • unlock full analytics</div>
            </div>
            <div className='relative'>
              <div className='h-40 rounded-lg bg-white/10 flex items-center justify-center text-white/40'>
                Chart placeholder
              </div>
              <div className='absolute inset-0 rounded-lg backdrop-blur-[1px] bg-gradient-to-t from-black/40 to-transparent pointer-events-none' />
            </div>
            <div className='mt-2 text-xs text-white/60'>Full trade breakdown available once live access is activated.</div>
          </div>

          {/* Badges */}
          <div className='mt-4 rounded-xl border border-white/10 p-4 bg-white/5'>
            <div className='font-semibold mb-2'>Badges</div>
            <div className='flex flex-wrap gap-2'>
              {profile.badges.map((b) => (
                <span key={b} className='px-2 py-1 bg-white/10 rounded-full text-xs'>{b}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Sticky CTA card (soft funnel) */}
        <aside className='md:col-span-1'>
          <div className='rounded-2xl border border-teal-500/30 bg-gradient-to-b from-teal-950/40 to-black/30 p-5 sticky md:top-6'>
            <div className='text-sm text-teal-300 font-semibold'>Weekly Challenge</div>
            <h3 className='text-xl font-bold mt-1'>Join {profile.displayName}'s Team</h3>
            <p className='text-white/70 text-sm mt-1'>Unlock the private feed, VIP Telegram, market analyst calls and account passer access.</p>

            {/* Progress / Social proof */}
            <div className='mt-4'>
              <div className='flex items-center justify-between text-xs text-white/60'>
                <span>This season</span>
                <span>{profile.stats.activeFollowers} joined</span>
              </div>
              <div className='mt-2 h-2 rounded-full bg-white/10'>
                <div className='h-2 rounded-full bg-teal-500' style={{ width: '72%' }} />
              </div>
              <div className='mt-2 text-xs text-white/50'>Spots filling fast</div>
            </div>

            {/* Primary CTA */}
            <a
              // href={profile.links.partner}
              href='https://www.puprime.partners/forex-trading-account/?affid=7522363'
              target='_blank'
              rel='noopener noreferrer'
              className='mt-5 block text-center w-full px-4 py-3 rounded-lg bg-teal-600 hover:bg-teal-500 font-semibold transition'
            >
              Activate Live Access
            </a>
            <div className='text-[11px] text-white/50 mt-1 text-center'>Minimum live activation $50 to unlock perks</div>

            {/* Secondary CTAs */}
            <div className='mt-4 flex flex-col gap-2'>
              <a
                href={profile.links.telegram}
                target='_blank'
                rel='noopener noreferrer'
                className='w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm text-center transition'
              >
                Contact the Team on Telegram
              </a>
              <a
                href={profile.links.calendly}
                target='_blank'
                rel='noopener noreferrer'
                className='w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm text-center transition'
              >
                Book an Analyst Call
              </a>
            </div>

            {/* Micro FAQ to handle objections */}
            <div className='mt-5 space-y-2'>
              <details className='group rounded-lg bg-white/5 border border-white/10 p-3'>
                <summary className='cursor-pointer list-none font-medium text-sm flex items-center justify-between'>
                  What do I unlock?
                  <span className='text-white/40 group-open:rotate-180 transition'>⌄</span>
                </summary>
                <ul className='mt-2 text-xs text-white/70 list-disc pl-4'>
                  <li>VIP Telegram and private trade notes</li>
                  <li>Weekly analyst call + Q&A</li>
                  <li>Priority account passer workflow</li>
                  <li>Full performance analytics</li>
                </ul>
              </details>
              <details className='group rounded-lg bg-white/5 border border-white/10 p-3'>
                <summary className='cursor-pointer list-none font-medium text-sm flex items-center justify-between'>
                  How do I qualify?
                  <span className='text-white/40 group-open:rotate-180 transition'>⌄</span>
                </summary>
                <p className='mt-2 text-xs text-white/70'>Activate a live account through our partner link and complete a quick KYC. You’ll receive access instructions instantly.</p>
              </details>
            </div>
          </div>
        </aside>
      </div>

      {/* Soft bottom banner */}
      <div className='mt-6 rounded-xl border border-white/10 p-4 bg-gradient-to-r from-teal-900/30 to-cyan-900/20 flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
        <div>
          <div className='font-semibold'>Ready to join {profile.displayName}'s weekly challenge?</div>
          <div className='text-white/70 text-sm'>Stay consistent, get feedback, level up with a real team.</div>
        </div>
        <a
          href={profile.links.partner}
          target='_blank'
          rel='noopener noreferrer'
          className='px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 font-semibold text-center'
        >
          Get Live Access
        </a>
      </div>
    </div>
  );
}
