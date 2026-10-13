import { useEffect, useRef } from 'react';

export default function RouletteArticles({ articles = [] }: { articles: any[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    let scrollInterval: NodeJS.Timeout;

    if (scrollContainer) {
      let scrollPosition = 0;
      const scrollStep = scrollContainer.scrollWidth / articles.length;

      scrollInterval = setInterval(() => {
        scrollPosition += scrollStep;
        if (scrollPosition >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollPosition = 0;
        }
        scrollContainer.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }, 4000);
    }

    return () => clearInterval(scrollInterval);
  }, [articles.length]);

  return (
    <div
      ref={scrollContainerRef}
      className='flex overflow-x-auto no-scrollbar snap-x snap-mandatory w-full py-6 space-x-6'
      style={{ scrollBehavior: 'smooth' }}
    >
      {articles.map((article, index) => (
        <article
          key={index}
          className='snap-start bg-darkblack-500 border border-teal-500 p-6 rounded-lg shadow-xl flex flex-col justify-between w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 transition-transform hover:scale-105 hover:shadow-2xl'
        >
          <section className='mb-6'>


            <img
              src={article.img??"/background.jpg"}
              alt={`banner ${article.title}`}
              className='rounded-t-lg w-full h-32 object-cover'
            />


            <h3 className='text-teal-400 font-bold text-xl mb-3 leading-tight tracking-wide'>
              {article.title}
            </h3>
            <p className='text-gray-300 font-light text-sm leading-relaxed line-clamp-3'>
              {article.content}
            </p>
          </section>

          <div className='mt-auto'>
            <a
              href={article.link}
              className='inline-block bg-teal-600 text-white py-2 px-6 text-sm font-semibold hover:text-bgray-700 rounded-full transition-colors hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50'
              target='_blank'
              rel='noopener noreferrer'
            >
              Read more
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
