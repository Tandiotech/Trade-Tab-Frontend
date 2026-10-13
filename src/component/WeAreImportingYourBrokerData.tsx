import { useEffect, useState } from 'react';

export default function WeAreImportingYourBrokerData({ loading }: { loading: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (loading) {
      // Simulate progress bar increments
      interval = setInterval(() => {
        setProgress(prev => (prev < 99 ? prev + 10 : prev)); // Increment until 90%
      }, 100); // Adjust interval duration as needed
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      // When loading completes, set progress to 100%
      setTimeout(() => setProgress(100), 100);
    }
  }, [loading]);

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-darkblue-900 text-white'>
      <h2 className='text-2xl font-semibold mb-4'>We're importing your broker data</h2>
      {/* <p className="text-xl mb-8">Check back in soon</p> */}
      <div className='flex items-center space-x-2'>
        <span>Loading...</span>
        <div className='w-56 h-6 bg-gray-700 rounded-md overflow-hidden'>
          <div
            className='h-full bg-green-500 transition-all duration-300'
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
