import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Settings,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import ScamsGeneralInformation from '../brokerComplainReport/ScamsGeneralInformation';
import ResolutionStats from '../brokerComplainReport/ResolutionStats';
import BrokerComplaintForm from '../brokerComplainReport/brokerComplaintForm/BrokerComplaintForm';
import { Helmet } from 'react-helmet-async';

interface Complaint {
  id: number;
  title: string;
  details: string;
  category: string;
  sentiment: 'positive' | 'negative';
  screenshotUrl?: string;
  date: string;
}

interface BrokerComplaintReportProps {
  brokerName: string;
  complaints: Complaint[];
}

const scamWarningTips = [
  {
    id: 1,
    icon: ShieldAlert,
    title: 'Unregulated Brokers',
    description:
      'Always check whether the broker is regulated by a reputable financial authority, such as the Financial Conduct Authority (FCA) in the UK, the Commodity Futures Trading Commission (CFTC) in the US, or the Australian Securities and Investments Commission (ASIC). Unregulated brokers may not follow industry standards, making it easier for them to engage in fraudulent activities.',
    color: 'from-red-500/20 to-orange-500/20',
    iconColor: 'text-red-400',
    borderColor: 'border-red-500/30',
  },
  {
    id: 2,
    icon: TrendingDown,
    title: 'Guaranteed Profits and Unrealistic Promises',
    description:
      'Be cautious of brokers who promise guaranteed returns or advertise extremely high profits with little or no risk. Forex trading inherently carries risks, and any broker claiming otherwise is likely not being honest.',
    color: 'from-orange-500/20 to-yellow-500/20',
    iconColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
  },
  {
    id: 3,
    icon: DollarSign,
    title: 'Difficulty Withdrawing Funds',
    description:
      'One of the most common signs of a scam is when a broker makes it difficult or impossible for you to withdraw your funds. They may impose excessive withdrawal fees, require unnecessary documentation, or simply ignore your requests. Legitimate brokers usually have straightforward withdrawal processes.',
    color: 'from-yellow-500/20 to-amber-500/20',
    iconColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
  },
  {
    id: 4,
    icon: AlertTriangle,
    title: 'Pressure to Deposit More Money',
    description:
      "Scammers often pressure traders to deposit more money, claiming it will help secure better returns. They might use aggressive sales tactics or suggest that you're missing out on a significant opportunity if you don't act quickly. Always be cautious if you feel pressured to increase your investment.",
    color: 'from-amber-500/20 to-red-500/20',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
  },
  {
    id: 5,
    icon: Settings,
    title: 'Manipulated Trading Platforms',
    description:
      'Some fraudulent brokers manipulate their trading platforms to create the illusion of profitable trades or to execute trades in a way that benefits them. Watch out for unusual slippage, price discrepancies, or frequent platform glitches, as these can be signs of manipulation. Always conduct thorough research before choosing a forex broker and ensure they are well-reviewed and properly regulated.',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const BrokerComplaintReportNotConnected: React.FC<BrokerComplaintReportProps> = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-20 -right-20 w-96 h-96 bg-tradetab-lime/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/3 rounded-full blur-3xl' />
      </div>

      <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-8 sm:py-12 lg:py-16'>
        <Helmet prioritizeSeoTags>
          <meta name='description' content='Report.' />
          <meta property='og:type' content='website' />
          <title>Report</title>
          <link rel='canonical' href='https://tradetab.com/reportB' />
          <meta property='og:title' content='TradeTab with listen to your reports to keep track' />
        </Helmet>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='mb-8 sm:mb-12 lg:mb-16'
        >
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 rounded-lg bg-gradient-to-br from-tradetab-lime/20 to-green-500/20 border border-tradetab-lime/30'>
              <Sparkles className='w-6 h-6 text-tradetab-lime' />
            </div>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-200 via-white to-slate-300 bg-clip-text text-transparent'>
              Identify and Avoid Forex Trading Scams
            </h1>
          </div>
          <p className='text-slate-400 text-base sm:text-lg max-w-3xl'>
            Stay protected with our comprehensive guide to recognizing and avoiding fraudulent forex
            brokers. Your safety is our priority.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 lg:mb-16'>

          {/* Sidebar - Stats & Info */}
          <div className='lg:col-span-3 space-y-6'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ResolutionStats />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ScamsGeneralInformation />
            </motion.div>
          </div>

          {/* Main Form */}
          <div className='lg:col-span-9'>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BrokerComplaintForm />
            </motion.div>
          </div>
        </div>

        {/* Scam Prevention Guide Section */}
        <motion.section
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className='mb-12 lg:mb-16'
        >
          <motion.div variants={itemVariants} className='mb-8 sm:mb-12'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30'>
                <ShieldAlert className='w-6 h-6 text-blue-400' />
              </div>
              <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-200'>
                How to Avoid Being Scammed
              </h2>
            </div>
            <p className='text-slate-300 text-base sm:text-lg max-w-4xl leading-relaxed'>
              When dealing with forex brokers, it's essential to be vigilant and aware of potential
              scams. Here are five key things to watch out for:
            </p>
          </motion.div>

          {/* Scam Warning Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8'>
            {scamWarningTips.map((tip) => {
              const IconComponent = tip.icon;
              return (
                <motion.div
                  key={tip.id}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredCard(tip.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${tip.color} backdrop-blur-sm border ${tip.borderColor} p-6 sm:p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
                >
                  {/* Animated background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tip.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Content */}
                  <div className='relative z-10'>
                    <div className='flex items-start gap-4 mb-4'>
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${tip.color} border ${tip.borderColor} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className={`w-6 h-6 ${tip.iconColor}`} />
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <span className='text-sm font-bold text-slate-400'>#{tip.id}</span>
                          <h3 className='text-xl sm:text-2xl font-bold text-slate-100 group-hover:text-white transition-colors'>
                            {tip.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <p className='text-slate-300 leading-relaxed text-sm sm:text-base group-hover:text-slate-200 transition-colors'>
                      {tip.description}
                    </p>

                    {/* Hover indicator */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tip.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                    />
                  </div>

                  {/* Shine effect on hover */}
                  {hoveredCard === tip.id && (
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{ duration: 0.6 }}
                      className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12'
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-tradetab-lime/10 via-green-500/10 to-tradetab-lime/10 border border-tradetab-lime/30 p-8 sm:p-12 text-center'
        >
          <div className='absolute inset-0 bg-gradient-to-r from-tradetab-lime/5 to-transparent opacity-50' />
          <div className='relative z-10'>
            <CheckCircle2 className='w-12 h-12 text-tradetab-lime mx-auto mb-4' />
            <h3 className='text-2xl sm:text-3xl font-bold text-slate-100 mb-4'>
              Stay Protected with TradeTab
            </h3>
            <p className='text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-6'>
              Report suspicious brokers and help protect the trading community. Together, we can
              create a safer trading environment for everyone.
            </p>
            <div className='flex items-center justify-center gap-2 text-tradetab-lime'>
              <span className='font-semibold'>Get Started Now</span>
              <ArrowRight className='w-5 h-5' />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BrokerComplaintReportNotConnected;
