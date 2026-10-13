import { Link } from 'react-router-dom';
import { OFFICIAL_TELEGRAM } from '@/utils/GlobalVars';
import { ArrowRight } from 'lucide-react';

const tools = [
  {
    title: 'Habit Journal',
    description:
      'Minimum notes, clear tags, focus on repetition. It\'s not about writing for writing: it\'s about building a process.',
    link: '/signup',
    linkText: 'Get started',
  },
  {
    title: 'Guardrails',
    description:
      'Simple rules: daily stop-loss, trade limit, size per setup. Protect capital and mind.',
    link: '/signup',
    linkText: 'Add account',
  },
  {
    title: 'Leak Alerts',
    description:
      'Light pattern detection: tilt, overtrading, bad hours, toxic instruments.',
    link: '/signup',
    linkText: 'See demo',
  },
  {
    title: 'Weekly Review',
    description:
      'A 60 second summary: what you did well, what leak to attack, and the plan for the week.',
    link: '/signup',
    linkText: 'Start free',
  },
  {
    title: 'Session Map',
    description:
      'Identify your best session and protect the worst. "Don\'t trade when you\'re your worst version".',
    link: '#score',
    linkText: 'See pillars',
  },
  {
    title: 'Community',
    description:
      'Telegram for support and accountability. The community pushes the habit, not the hype.',
    link: OFFICIAL_TELEGRAM,
    linkText: 'Join',
    external: true,
  },
];

export default function ToolsGrid() {
  return (
    <section id='tools' className='py-20 px-4 sm:px-6 lg:px-8 bg-[#050A1D]'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4'>
            Tools that feed the score
          </h2>
          <p className='text-lg text-gray-400 max-w-3xl mx-auto'>
            Everything in the product has a reason to exist: increase your consistency.
          </p>
        </div>

        {/* Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {tools.map((tool, index) => {
            const LinkComponent = tool.external ? 'a' : Link;
            const linkProps = tool.external
              ? { href: tool.link, target: '_blank', rel: 'noopener noreferrer' }
              : { to: tool.link };

            return (
              <div
                key={index}
                className='bg-gray-900/50 border border-teal-500/30 rounded-xl p-6 backdrop-blur-sm hover:border-teal-500/50 hover:bg-gray-900/70 transition-all duration-200 group'
              >
                {/* Icon */}
                <div className='w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-500/30 transition-colors duration-200'>
                  <div className='w-3 h-3 bg-teal-500 rounded-full'></div>
                </div>

                {/* Content */}
                <h3 className='text-xl font-semibold text-white mb-3'>{tool.title}</h3>
                <p className='text-gray-400 text-sm mb-4 leading-relaxed'>{tool.description}</p>

                {/* Link */}
                <LinkComponent
                  {...linkProps}
                  className='inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium text-sm transition-colors duration-200'
                >
                  <span>{tool.linkText}</span>
                  <ArrowRight className='w-4 h-4' />
                </LinkComponent>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
