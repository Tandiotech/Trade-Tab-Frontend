import { motion } from 'framer-motion';
import { BiUser, BiBuilding, BiIdCard, BiCrown, BiStats } from 'react-icons/bi';

export default function HeaderMetrics({
  broker = { name: '', id: '' },
  userName = 'Trade Tab',
  lastName,
  account_type,
}) {
  const isDemo = account_type === 'ACCOUNT_TRADE_MODE_DEMO';
  const fullName = `${userName} ${lastName || ''}`.trim();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
      },
    },
  };

  return (
    <motion.div variants={containerVariants} initial='hidden' animate='visible' className='m-y-4'>
      <motion.div
        variants={headerVariants}
        className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8'
      >
     
        {/* Right: User Info + Broker Info (all in a row) */}
        <div className='flex flex-col gap-5'>
          <div className='flex flex-wrap items-center gap-2'>
    
            {/* Name + Type + Broker */}
            <div className='flex flex-col gap-1'>
              <div className='flex items-center flex-wrap gap-3'>
                {/* Full Name */}
                <h1 className='text-2xl font-bold text-white flex items-center gap-3'>
      
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                      isDemo
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                        : 'bg-green-500/10 text-green-400 border border-green-500/30'
                    }`}
                  >
                    {isDemo ? (
                      <>
                        <BiCrown className='text-yellow-400' />
                        Demo
                      </>
                    ) : (
                      <>
                        <BiCrown className='text-green-400' />
                        Real
                      </>
                    )}
                  </motion.span>

                  {/* Broker Name */}
                  {broker?.name && (
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className='flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/30 rounded-full'
                    >
                      <BiBuilding className='text-blue-400 text-sm' />
                      {broker.name}
                    </motion.span>
                  )}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
