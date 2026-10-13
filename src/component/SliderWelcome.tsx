import { useEffect, useState } from 'react';

const slides = [
  {
    image: '/assets/img/interfaz/chart2.jpg',
    title: 'Maximize your Skills & Potential',
    description:
      'Elevate your trading Journey and enhance your trading skills with TradeTab. Your all-in-one trading journal is designed to provide deep insights into every aspect of your trading strategy. Track every trade you make, analyze performance data, and discover new opportunities for improvement.',
  },
  {
    image: '/assets/img/interfaz/chart1.jpg',
    title: 'The right indicators to evaluate',
    description:
      "Evaluate your trading performance like never before. Dive into advanced metrics, spot patterns in your trading behaviour, and uncover actionable insights. With TradeTab, you can identify what's working, pinpoint areas for improvement, and make data-driven decisions to refine your strategy.",
  },
  {
    image: '/assets/img/interfaz/chart3.jpg',
    title: 'Capture Every Trade in Detail',
    description:
      "Never miss a beat with TradeTab's detailed trade logging. From entry and exit points to notes on market conditions; track every element of your trades with precision. Our comprehensive journaling feature helps you record, reflect, and improve with every single trade.",
  },
];

function SliderWelcome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          setCurrentSlide(prev => (prev + 1) % slides.length);
          return 0;
        }
        return prevProgress + 2; // Increment by 2 every 100ms to complete in 5 seconds
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='py-20 bg-black flex items-center justify-center p-4 relative z-30'>
      <div className='glow-circle-left'></div>
      <div className='max-w-6xl w-full bg-black rounded-xl  overflow-hidden shadow-2xl'>
        <div className='flex flex-col md:flex-row'>
          {/* Left content */}
          <div className='w-full md:w-1/2 p-8 flex flex-col h-full justify-center'>
            <h2 className='text-4xl font-bold text-white  mb-4 transition-opacity duration-500'>
              {slides[currentSlide].title}
            </h2>
            <p className='text-gray-300 text-lg mb-6 transition-opacity duration-500'>
              {slides[currentSlide].description}
            </p>

            {/* Progress bar */}
            <div className='h-1 bg-gray-700 rounded-full overflow-hidden'>
              <div
                className='h-full bg-emerald-500 transition-all duration-100 ease-linear'
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Slide indicators */}
            <div className='flex gap-2 mt-4'>
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    currentSlide === index ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right image */}
          <div className='w-full md:w-1/2 relative h-64 md:h-auto'>
            {slides.map((slide, index) => (
              <img
                key={index}
                src={slide.image}
                alt={slide.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  currentSlide === index ? 'opacity-100' : 'opacity-0'
                }`}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding='async'
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SliderWelcome;
