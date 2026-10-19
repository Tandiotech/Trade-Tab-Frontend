import { Link } from 'react-router-dom';
import { social_media } from '../../../utils/Social_media';

export const FooterAffiliate = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', to: '/#features' },
      { label: 'Pricing', to: '/#pricing' },
      { label: 'Analytics', to: '/metrics' },
      { label: 'Trading Journal', to: '/journal' },
    ],
    company: [
      { label: 'About Us', to: '/#about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact', to: '/contact' },
    ],
    support: [
      { label: 'Help Center', to: '/settings/faq' },
      { label: 'Terms & Conditions', to: '/settings/termsAndconditions' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Status', to: '/status' },
    ],
  };

  return (
    <footer className='relative overflow-hidden'>
      {/* Background gradient effect */}
      <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(6,182,212,0.1),transparent_50%)]' />
      
      <div className='relative px-4 pt-16 pb-8 mx-auto md:px-24 lg:px-8 border border-cyan-800/50 hover:border-cyan-500/70 transition-all duration-500 rounded-2xl backdrop-blur-sm'>
        {/* Main content */}
        <div className='grid gap-10 mb-12 sm:grid-cols-2 lg:grid-cols-12'>
          {/* Brand section */}
          <div className='sm:col-span-2 lg:col-span-5'>
            <Link to='/' aria-label='Go home' title='TradeTab' className='inline-flex items-center group'>
              <img 
                src='/logo-lockup.png' 
                className='h-9 transition-transform duration-300 group-hover:scale-105' 
                alt='TradeTab Logo' 
              />
            </Link>
            <div className='mt-6 lg:max-w-md'>
              <p className='text-sm leading-relaxed text-gray-400'>
                At TradeTab, we empower traders with cutting-edge tools and insights to make informed
                trading decisions. Our platform delivers comprehensive analytics, performance tracking,
                and real-time market data to help you navigate the forex market with confidence.
              </p>
              
              {/* Social media */}
              <div className='mt-8'>
                <h3 className='text-base font-semibold tracking-wide text-gray-300 mb-4'>
                  Connect With Us
                </h3>
                <div className='flex flex-wrap gap-3'>
                  {social_media(40).map((item, index) => (
                    <a
                      key={index}
                      href={item.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='group relative p-2 rounded-lg bg-slate-800/50 hover:bg-cyan-500/10 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300'
                      aria-label={`Visit our ${item.name || 'social media'}`}
                    >
                      <div className='text-gray-500 group-hover:text-cyan-400 transition-colors duration-300'>
                        {item.component}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Links sections */}
          <div className='sm:col-span-2 lg:col-span-7'>
            <div className='grid grid-cols-2 gap-8 sm:grid-cols-3'>
              {/* Product */}
              <div>
                <h3 className='text-base font-semibold tracking-wide text-gray-300 mb-4'>
                  Product
                </h3>
                <ul className='space-y-3'>
                  {footerLinks.product.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.to}
                        className='text-sm text-gray-500 hover:text-cyan-400 transition-colors duration-200 inline-flex items-center group'
                      >
                        <span className='group-hover:translate-x-1 transition-transform duration-200'>
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className='text-base font-semibold tracking-wide text-gray-300 mb-4'>
                  Company
                </h3>
                <ul className='space-y-3'>
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.to}
                        className='text-sm text-gray-500 hover:text-cyan-400 transition-colors duration-200 inline-flex items-center group'
                      >
                        <span className='group-hover:translate-x-1 transition-transform duration-200'>
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className='text-base font-semibold tracking-wide text-gray-300 mb-4'>
                  Support
                </h3>
                <ul className='space-y-3'>
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.to}
                        className='text-sm text-gray-500 hover:text-cyan-400 transition-colors duration-200 inline-flex items-center group'
                      >
                        <span className='group-hover:translate-x-1 transition-transform duration-200'>
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className='pt-8 border-t border-slate-700/50'>
          <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
            <p className='text-sm text-gray-500'>
              © {currentYear} TradeTab. All rights reserved.
            </p>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <span>Made with</span>
              <span className='text-red-500 animate-pulse'>♥</span>
              <span>for traders worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
