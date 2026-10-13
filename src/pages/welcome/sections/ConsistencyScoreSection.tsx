export default function ConsistencyScoreSection() {
  const pillars = [
    { name: 'Discipline', progress: 75 },
    { name: 'Risk Control', progress: 82 },
    { name: 'Execution', progress: 68 },
    { name: 'Emotional Control', progress: 71 },
  ];

  const steps = [
    {
      number: '1',
      title: 'Detect 1 main leak',
      badge: 'Auto',
      badgeColor: 'bg-teal-500/20 text-teal-400',
    },
    {
      number: '2',
      title: 'Apply 1 guardrail',
      badge: 'Rule',
      badgeColor: 'bg-teal-500/20 text-teal-400',
    },
    {
      number: '3',
      title: 'Repeat 2 habits',
      badge: 'Habits',
      badgeColor: 'bg-teal-500/20 text-teal-400',
    },
  ];

  return (
    <section id='score' className='py-20 px-4 sm:px-6 lg:px-8 bg-[#050A1D]'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4'>
            The value: your <span className='text-teal-400'>Consistency Score</span> (simple and
            addictive)
          </h2>
          <p className='text-lg text-gray-400 max-w-3xl mx-auto'>
            Instead of boasting dashboards, you sell a number that the trader wants to increase
            each week.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className='grid lg:grid-cols-2 gap-8'>
          {/* Left Panel - 4 Pillars */}
          <div className='bg-gray-900/50 border border-teal-500/30 rounded-xl p-8 backdrop-blur-sm'>
            <h3 className='text-xl font-semibold text-white mb-2'>
              Your score is made up of 4 pillars
            </h3>
            <p className='text-gray-400 text-sm mb-6'>
              This is perfect for a landing with a hook: a "score" that guides actions. Each pillar
              has a concrete improvement that the user can execute.
            </p>

            <div className='space-y-6'>
              {pillars.map((pillar, index) => (
                <div key={index}>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-white font-medium'>{pillar.name}</span>
                    <span className='text-teal-400 text-sm font-semibold'>{pillar.progress}%</span>
                  </div>
                  <div className='w-full h-2.5 bg-gray-800 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-500'
                      style={{ width: `${pillar.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - 3 Steps */}
          <div className='bg-gray-900/50 border border-teal-500/30 rounded-xl p-8 backdrop-blur-sm'>
            <h3 className='text-xl font-semibold text-white mb-2'>
              How it works (in 3 steps)
            </h3>
            <p className='text-gray-400 text-sm mb-6'>
              Each week TradeTab gives you a clear "up" of the score.
            </p>

            <div className='space-y-4'>
              {steps.map((step, index) => (
                <div
                  key={index}
                  className='flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200'
                >
                  <div className='flex-shrink-0 w-10 h-10 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center font-bold text-lg'>
                    {step.number}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3'>
                      <span className='text-white font-medium'>{step.title}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${step.badgeColor} font-medium`}
                      >
                        {step.badge}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
