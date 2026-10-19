import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  BookOpen,
  TrendingUp,
  Award,
  Users,
  Target,
  DollarSign,
  BarChart3,
  GraduationCap,
  Zap,
  Shield,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import LandingNavbar from '@/pages/welcome/sections/LandingNavbar';
import { FooterAffiliate } from '@/pages/affiliate/sections/footer';
import '@/pages/shared/TradeTabDesign.css';

type UniversityVariant = 'public' | 'app';

type UniversityProps = {
  variant?: UniversityVariant;
};

const LEVEL_BADGE: Record<string, string> = {
  Beginner: 'bg-[var(--tt-profit-dim)] text-[var(--tt-profit)] border-[var(--tt-profit)]/30',
  Intermediate: 'bg-[var(--tt-brand-dim)] text-[var(--tt-brand)] border-[var(--tt-brand)]/30',
  Advanced: 'bg-[oklch(0.78_0.13_200/0.15)] text-[var(--tt-brand-2)] border-[var(--tt-brand-2)]/30',
  Expert: 'bg-[oklch(1_0_0/0.06)] text-[var(--tt-fg-1)] border-[var(--tt-line-2)]',
};

export default function University({ variant = 'public' }: UniversityProps) {
  const navigate = useNavigate();
  const isPublic = variant === 'public';

  const handleGetStarted = () => {
    navigate('/login');
  };

  useEffect(() => {
    document.title =
      'TradeTab University - Learn Forex Trading, Track Progress & Monetize Your Skills | Free Trading Courses';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Join TradeTab University to master forex trading with 25+ expert courses. Learn trading strategies, track your progress, earn certifications, and monetize your market skills. Start free today!'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content =
        'Join TradeTab University to master forex trading with 25+ expert courses. Learn trading strategies, track your progress, earn certifications, and monetize your market skills. Start free today!';
      document.head.appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute(
        'content',
        'forex trading courses, trading education, learn forex, trading strategies, technical analysis, risk management, algorithmic trading, trading certification, forex training, online trading courses'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content =
        'forex trading courses, trading education, learn forex, trading strategies, technical analysis, risk management, algorithmic trading, trading certification, forex training, online trading courses';
      document.head.appendChild(meta);
    }

    const updateOrCreateMetaTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    };

    updateOrCreateMetaTag('og:title', 'TradeTab University - Master Forex Trading | Free Trading Education');
    updateOrCreateMetaTag(
      'og:description',
      'Learn forex trading from beginner to expert. 25+ courses, track progress, earn certifications. Join 2,353+ successful traders. Start free!'
    );
    updateOrCreateMetaTag('og:type', 'website');
    updateOrCreateMetaTag('og:url', window.location.href);

    const updateOrCreateTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    };

    updateOrCreateTwitterTag('twitter:card', 'summary_large_image');
    updateOrCreateTwitterTag('twitter:title', 'TradeTab University - Master Forex Trading');
    updateOrCreateTwitterTag(
      'twitter:description',
      'Learn forex trading from beginner to expert. 25+ courses, track progress, earn certifications. Start free!'
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', window.location.href);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', window.location.href);
      document.head.appendChild(canonical);
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'TradeTab University',
      description:
        'Professional forex trading education platform offering comprehensive courses from beginner to expert level',
      url: window.location.href,
      logo: 'https://tradetab.com/logo-lockup.png',
      courseMode: 'online',
      offers: {
        '@type': 'Offer',
        category: 'Financial Education',
        price: '0',
        priceCurrency: 'USD',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Trading Courses',
        itemListElement: [
          {
            '@type': 'Course',
            name: 'Forex Fundamentals',
            description: 'Learn the basics of forex trading for beginners',
            provider: { '@type': 'Organization', name: 'TradeTab University' },
            courseLevel: 'Beginner',
            timeRequired: 'P4W',
          },
          {
            '@type': 'Course',
            name: 'Technical Analysis Mastery',
            description: 'Master technical analysis for trading success',
            provider: { '@type': 'Organization', name: 'TradeTab University' },
            courseLevel: 'Intermediate',
            timeRequired: 'P6W',
          },
          {
            '@type': 'Course',
            name: 'Advanced Risk Management',
            description: 'Learn advanced strategies to manage trading risk',
            provider: { '@type': 'Organization', name: 'TradeTab University' },
            courseLevel: 'Advanced',
            timeRequired: 'P8W',
          },
          {
            '@type': 'Course',
            name: 'Algorithmic Trading',
            description: 'Build and deploy automated trading algorithms',
            provider: { '@type': 'Organization', name: 'TradeTab University' },
            courseLevel: 'Expert',
            timeRequired: 'P12W',
          },
        ],
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.7',
        reviewCount: '2353',
        bestRating: '5',
      },
    });
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const features: { icon: LucideIcon; title: string; description: string }[] = [
    {
      icon: BookOpen,
      title: 'Comprehensive Courses',
      description: 'Learn from beginner to advanced trading strategies with our structured curriculum',
    },
    {
      icon: BarChart3,
      title: 'Track Your Progress',
      description: 'Monitor your learning journey and trading performance with detailed analytics',
    },
    {
      icon: Award,
      title: 'Earn Certifications',
      description: 'Showcase your expertise with professional trading certifications',
    },
    {
      icon: DollarSign,
      title: 'Monetize Your Skills',
      description: 'Share your strategies and insights to earn revenue from your trading knowledge',
    },
    {
      icon: Users,
      title: 'Community Learning',
      description: 'Connect with thousands of traders and learn from their experiences',
    },
    {
      icon: Target,
      title: 'Real Trading Practice',
      description: 'Apply what you learn with integrated trading tools and simulations',
    },
  ];

  const courses = [
    { title: 'Forex Fundamentals', level: 'Beginner', duration: '4 weeks', students: '1,234' },
    { title: 'Technical Analysis Mastery', level: 'Intermediate', duration: '6 weeks', students: '892' },
    { title: 'Advanced Risk Management', level: 'Advanced', duration: '8 weeks', students: '567' },
    { title: 'Algorithmic Trading', level: 'Expert', duration: '12 weeks', students: '234' },
  ];

  const stats = [
    { number: '25+', label: 'Expert Courses' },
    { number: '2,353+', label: 'Active Students' },
    { number: '94%', label: 'Success Rate' },
    { number: '50,800+', label: 'Student Earnings' },
  ];

  const journeySteps = [
    { step: '01', title: 'Sign Up Free', desc: 'Create your trading account and access free forex courses instantly' },
    {
      step: '02',
      title: 'Learn & Practice',
      desc: 'Study forex trading courses and practice with real trading simulation tools',
    },
    {
      step: '03',
      title: 'Track Progress',
      desc: 'Monitor your learning journey and trading performance with analytics',
    },
    { step: '04', title: 'Monetize Skills', desc: 'Share trading strategies and earn revenue from your forex expertise' },
  ];

  return (
    <div className='relative min-h-screen overflow-x-hidden tt-theme bg-[var(--tt-bg-0)]'>
      {isPublic ? (
        <Helmet prioritizeSeoTags>
          <meta
            name='description'
            content='Master trading with TradeTab University. Access expert-driven tutorials, guides, and resources to enhance your trading strategies and decision-making skills.'
          />
          <meta property='og:type' content='website' />
          <meta property='og:title' content='TradeTab University: Learn, Trade, Succeed' />
          <meta
            property='og:description'
            content='Your ultimate platform to sharpen your trading expertise. Explore in-depth guides, data-driven analysis, and expert strategies.'
          />
          <meta property='og:url' content='https://tradetab.com/university' />
          <link rel='canonical' href='https://tradetab.com/university' />
          <title>TradeTab University: Learn and Enhance Your Trading Skills</title>
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:title' content='TradeTab University: Learn and Enhance Your Trading Skills' />
          <meta
            name='twitter:description'
            content='Discover expert trading tutorials, metrics analysis, and strategies to maximize your profits.'
          />
        </Helmet>
      ) : null}

      {isPublic ? <LandingNavbar /> : null}

      <main className='tt-landing'>
        {/* Hero */}
        <section className='tt-hero relative' aria-labelledby='hero-heading'>
          <div className='tt-glow-bg tt-hero-glow-1' aria-hidden />
          <div className='tt-glow-bg tt-hero-glow-2' aria-hidden />
          <div className='tt-hero-inner relative z-[2]'>
            <article>
              <div className='tt-hero-eyebrow'>
                <GraduationCap className='h-4 w-4 shrink-0 text-[var(--tt-brand)]' aria-hidden />
                <span>Professional Forex Trading Education</span>
              </div>

              <h1 id='hero-heading'>
                Master Forex Trading & The
                <br />
                <span className='tt-accent'>Financial Markets</span>
                <br />
                With Confidence
              </h1>

              <p className='tt-hero-sub'>
                Join TradeTab University and transform your trading journey with expert-led courses. Learn forex
                trading strategies, track your progress with advanced analytics, earn professional certifications,
                and monetize your market skills with our comprehensive online trading platform.
              </p>

              <div className='tt-hero-ctas'>
                <button
                  type='button'
                  onClick={handleGetStarted}
                  className='tt-btn tt-btn-primary bg-[var(--tt-brand)] px-8 py-3.5 text-[15px] text-[oklch(0.14_0.014_250)]'
                  style={{ borderColor: 'var(--tt-brand)' }}
                  aria-label='Start learning forex trading for free'
                >
                  Start Learning Free
                  <Zap className='h-4 w-4' aria-hidden />
                </button>
                <button
                  type='button'
                  onClick={handleGetStarted}
                  className='tt-btn tt-btn-ghost px-8 py-3.5 text-[15px]'
                  aria-label='Browse forex trading courses'
                >
                  View Courses
                </button>
              </div>

              <div className='flex flex-wrap items-center gap-6 pt-2'>
                <div className='flex items-center gap-2 text-sm text-[var(--tt-fg-3)]'>
                  <Shield className='h-4 w-4 text-[var(--tt-brand)]' aria-hidden />
                  Certified Trading Content
                </div>
                <div className='flex items-center gap-2 text-sm text-[var(--tt-fg-3)]'>
                  <Users className='h-4 w-4 text-[var(--tt-brand)]' aria-hidden />
                  2K+ Trading Community
                </div>
              </div>
            </article>

            <figure className='relative'>
              <div className='tt-chart-card relative p-6 md:p-8'>
                <img
                  src='/assets/img/trader-1.png'
                  alt='Professional forex trader analyzing market charts and trading strategies on multiple screens - TradeTab University student success story'
                  className='w-full h-auto rounded-xl'
                  loading='eager'
                />
                <div
                  className='tt-float-card absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6'
                  style={{ borderColor: 'var(--tt-line-2)' }}
                >
                  <p className='tt-fl'>Success Rate</p>
                  <p className='tt-fv text-[var(--tt-profit)]'>94%</p>
                </div>
                <div
                  className='tt-float-card absolute -top-4 -right-4 md:-top-6 md:-right-6'
                  style={{ borderColor: 'var(--tt-line-2)' }}
                >
                  <p className='tt-fl'>Student Earnings</p>
                  <p className='tt-fv'>50,800+</p>
                </div>
              </div>
              <figcaption className='sr-only'>
                Successful forex trader working with TradeTab University platform
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Stats */}
        <section className='tt-trust px-4 md:px-8' aria-labelledby='stats-heading'>
          <h2 id='stats-heading' className='sr-only'>
            Trading Education Statistics and Success Metrics
          </h2>
          <div className='tt-trust-metrics'>
            {stats.map((stat, index) => (
              <div key={index} className='tt-trust-metric'>
                <p className='tt-n'>
                  {stat.number.includes('%') ? (
                    <>
                      <span className='tt-g'>{stat.number.replace('%', '')}</span>%
                    </>
                  ) : (
                    stat.number
                  )}
                </p>
                <p className='tt-l'>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className='tt-section px-4 md:px-8' aria-labelledby='features-heading'>
          <div className='tt-section-head'>
            <p className='tt-kicker mb-3'>Why TradeTab University</p>
            <h2 id='features-heading'>
              Why Choose TradeTab University for Forex Trading Education?
            </h2>
            <p>
              Everything you need to become a successful forex and cryptocurrency trader in one comprehensive
              online learning platform
            </p>
          </div>

          <div className='mx-auto grid max-w-[1280px] gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5' role='list'>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <article
                  key={index}
                  className='tt-vp-card flex flex-col gap-3 p-5 md:p-6'
                  role='listitem'
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--tt-brand-dim)] text-[var(--tt-brand)]'>
                    <Icon className='h-5 w-5' aria-hidden />
                  </div>
                  <h3 className='text-lg font-semibold text-[var(--tt-fg-0)]'>{feature.title}</h3>
                  <p className='text-sm leading-relaxed text-[var(--tt-fg-2)]'>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Courses */}
        <section
          className='tt-section border-t border-[var(--tt-line-1)] px-4 md:px-8'
          aria-labelledby='courses-heading'
        >
          <div className='tt-section-head'>
            <p className='tt-kicker mb-3'>Course catalog</p>
            <h2 id='courses-heading'>Popular Forex Trading Courses</h2>
            <p>
              Start your forex trading journey with our most sought-after online courses — from beginner to expert
              level
            </p>
          </div>

          <div
            className='mx-auto grid max-w-[1280px] gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5'
            role='list'
          >
            {courses.map((course, index) => (
              <article
                key={index}
                className='tt-vp-card cursor-pointer p-5 transition-colors hover:border-[var(--tt-line-3)] md:p-6'
                role='listitem'
                itemScope
                itemType='https://schema.org/Course'
              >
                <meta itemProp='provider' content='TradeTab University' />
                <span
                  className={`mb-4 inline-block rounded-full border px-3 py-1 text-xs font-semibold ${LEVEL_BADGE[course.level] ?? LEVEL_BADGE.Expert}`}
                >
                  <span itemProp='courseLevel'>{course.level}</span>
                </span>
                <h3 className='mb-4 text-lg font-semibold text-[var(--tt-fg-0)]' itemProp='name'>
                  {course.title}
                </h3>
                <div className='flex items-center justify-between text-sm text-[var(--tt-fg-3)]'>
                  <span className='flex items-center gap-1'>
                    <TrendingUp className='h-4 w-4' aria-hidden />
                    <span itemProp='timeRequired'>{course.duration}</span>
                  </span>
                  <span className='flex items-center gap-1'>
                    <Users className='h-4 w-4' aria-hidden />
                    {course.students} students
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className='mt-12 text-center'>
            <button
              type='button'
              onClick={handleGetStarted}
              className='tt-btn tt-btn-ghost px-8 py-3.5 text-[15px]'
              aria-label='View all forex trading courses'
            >
              View All Courses <ArrowRight className='h-4 w-4' />
            </button>
          </div>
        </section>

        {/* Journey */}
        <section className='tt-section px-4 md:px-8' aria-labelledby='journey-heading'>
          <div className='tt-section-head'>
            <p className='tt-kicker mb-3'>How it works</p>
            <h2 id='journey-heading'>Your Journey to Forex Trading Success</h2>
            <p>Follow our proven 4-step path from beginner trader to professional forex expert</p>
          </div>

          <div className='relative mx-auto grid max-w-[1280px] gap-4 md:grid-cols-4 md:gap-5' role='list'>
            <div
              className='pointer-events-none absolute left-0 right-0 top-[4.5rem] hidden h-px bg-[var(--tt-line-1)] md:block'
              aria-hidden
            />

            {journeySteps.map((item, index) => (
              <article key={index} className='tt-card relative p-6 text-center' role='listitem'>
                <div
                  className='mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-[oklch(0.14_0.014_250)]'
                  style={{ background: 'var(--tt-brand)' }}
                  aria-hidden
                >
                  {item.step}
                </div>
                <h3 className='mb-3 text-lg font-semibold text-[var(--tt-fg-0)]'>{item.title}</h3>
                <p className='text-sm leading-relaxed text-[var(--tt-fg-2)]'>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className='tt-final-cta' aria-labelledby='cta-heading'>
          <div
            className='pointer-events-none absolute inset-0 opacity-50'
            style={{
              background:
                'radial-gradient(600px 400px at 30% 20%, var(--tt-brand-dim), transparent), radial-gradient(500px 360px at 70% 80%, var(--tt-profit-dim), transparent)',
            }}
            aria-hidden
          />
          <div className='relative z-10'>
            <h2 id='cta-heading'>Ready to Start Your Forex Trading Journey?</h2>
            <p className='mx-auto mt-0 max-w-2xl text-base text-[var(--tt-fg-2)]'>
              Join thousands of successful forex traders who transformed their financial future with TradeTab
              University&apos;s comprehensive trading education
            </p>
            <div className='mt-8 inline-flex flex-wrap justify-center gap-3'>
              <button
                type='button'
                onClick={handleGetStarted}
                className='tt-btn tt-btn-primary bg-[var(--tt-brand)] px-8 py-3.5 text-[15px] text-[oklch(0.14_0.014_250)]'
                style={{ borderColor: 'var(--tt-brand)' }}
                aria-label='Start learning forex trading for free - no credit card required'
              >
                Get Started Free
                <Zap className='h-4 w-4' aria-hidden />
              </button>
              <Link to='/login' className='tt-btn tt-btn-ghost px-8 py-3.5 text-[15px] no-underline'>
                Already have an account? Login
              </Link>
            </div>
            <p className='mt-6 text-sm text-[var(--tt-fg-3)]'>
              No credit card required · 7-day free trial · Cancel anytime
            </p>
          </div>
        </section>
      </main>

      {isPublic ? <FooterAffiliate /> : null}
    </div>
  );
}
