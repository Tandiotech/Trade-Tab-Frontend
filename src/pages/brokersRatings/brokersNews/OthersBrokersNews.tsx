import { useEffect, useRef } from 'react';
import { dummy_brokers_news } from './dummy_news';

export default function OthersBrokersNews() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    let scrollInterval: NodeJS.Timeout;

    if (scrollContainer) {
      let scrollPosition = 0;
      const scrollStep = scrollContainer.scrollWidth / dummy_brokers_news.length;

      scrollInterval = setInterval(() => {
        scrollPosition += scrollStep;
        if (scrollPosition >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollPosition = 0;
        }
        scrollContainer.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }, 5000); // Scroll every 5 seconds
    }

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <section className="choose-area pb-32">
      <div className="w-full py-10">
        <div className="text-center mb-10">
          <span className="text-xl text-gray-700 font-semibold">Brokers insights</span>
          <h2 className="text-4xl font-bold mt-2">Latest Articles on <span className="text-indigo-500">Brokerage</span></h2>
        </div>
  
        <div ref={scrollContainerRef} className="flex space-x-6 overflow-x-auto no-scrollbar px-4">
          {dummy_brokers_news.map((article, index) => (
            <div key={index} className="flex-none w-80 h-96 shadow-md rounded-md p-4">
              <div className="choose-item h-full">
                <div className="choose-icon mb-4">
                  <img src={article.icon} alt="" className="w-12 h-12 rounded-3xl block mx-auto"/>
                </div>
                <div className="choose-content">
                  <h2 className="text-lg font-semibold mb-2"><a href={article.link}>{article.title}</a></h2>
                  <p className="text-gray-600">{article.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
