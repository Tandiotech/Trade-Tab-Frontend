import { dummy_brokers_news } from './dummy_news';
import './style.css';

export default function BrokersNews() {
  return (
    <section className="div_entry flex flex-col pb-32">

      <div className="container mx-auto">

        <div className="container text-white">
          <div className="row justify-content-center">
            <div className="col-xl-6">
              <div className="section-title text-center mb-50">
                <span className="sub-title mt-2">Broker Insights</span>
                {/* <h2 className="title">Latest Articles on <span>Brokerage</span></h2> */}
                <h2 className="title">Latest Brokerage <span>Article</span></h2>
                
              </div>
            </div>
          </div>
          </div>

        <div className="flex flex-wrap justify-center">
          {dummy_brokers_news.map((article, index) => (
            <div className="w-full md:w-1/2 lg:w-1/4 p-4 text-white" key={index}>
              <div className="  h-full shadow-lg rounded-2xl overflow-hidden  border bg-slate-900 border-cyan-800 hover:border-cyan-500 ease-in-out duration-300">
                <div className="p-4">
                  <div className="flex justify-center">
                    <img className="w-36 rounded-md " src={article.icon} alt="" />
                  </div>
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-semibold">
                      <a href={article.link}>{article.title}</a>
                    </h2>
                    <p className="mt-2 text-gray-300">{article.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> 

   
    </section>
  );
}
