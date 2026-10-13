import { Link } from 'react-router-dom';
import { Mail, Sparkles, MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '@/services/generateWhatsAppLink';

const VerifyEmail = () => {
  const handleSupportClick = () => {
    const message = 'I want to start trading and need help getting started with TradeTab';
    const whatsappLink = generateWhatsAppLink(
      import.meta.env.VITE_PHONE_SUPPORT || '+447494208836',
      message
    );
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white relative overflow-hidden'>
      {/* Background decorative elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 right-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-20 left-20 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
      </div>

      <div className='relative z-10 w-full max-w-md px-6'>
        <div className='bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-slate-900/50 backdrop-blur-sm'>
          {/* Icon */}
          <div className='flex justify-center mb-6'>
            <div className='relative'>
              <div className='absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse' />
              <div className='relative bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-4 rounded-full border border-emerald-500/30'>
                <Mail className='h-8 w-8 text-emerald-400' />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className='text-2xl sm:text-3xl font-bold text-white mb-3 text-center'>
            Verify Your Email
          </h1>

          {/* Description */}
          <p className='text-slate-300 text-sm sm:text-base mb-8 text-center leading-relaxed'>
            We've sent a verification email to your inbox. Please click the link in the email to
            verify your account and get started.
          </p>

          {/* CTA Section - Interactive */}
          <button
            onClick={handleSupportClick}
            className='mb-8 w-full group relative overflow-hidden p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-800/30 border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 text-left'
          >
            <div className='flex items-start gap-3 relative z-10'>
              <div className='relative shrink-0'>
                <div className='absolute inset-0 bg-emerald-500/20 rounded-full blur-md group-hover:blur-lg transition-all' />
                <MessageCircle className='h-5 w-5 text-emerald-400 group-hover:text-emerald-300 relative transition-colors' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-xs sm:text-sm text-slate-300 font-medium mb-1 group-hover:text-white transition-colors'>
                  Never traded before?
                </p>
                <p className='text-xs sm:text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors'>
                  Contact our support team and we'll help you get started with trading.
                </p>
              </div>
              <Sparkles className='h-4 w-4 text-emerald-400/50 group-hover:text-emerald-400 shrink-0 mt-0.5 transition-colors' />
            </div>
            <div className='absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:via-emerald-500/5 group-hover:to-emerald-500/5 transition-all duration-300' />
          </button>

          {/* Button */}
          <Link
            to='/'
            className='block w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 text-center'
          >
            Back to Home
          </Link>

          {/* Helper text */}
          <p className='text-xs text-slate-500 text-center mt-6'>
            Didn't receive the email? Check your spam folder or{' '}
            <Link to='/' className='text-emerald-400 hover:text-emerald-300 underline'>
              try again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
