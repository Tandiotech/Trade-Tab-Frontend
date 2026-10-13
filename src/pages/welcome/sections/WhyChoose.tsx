import WorldMap from './WorldMap';

export default function WhyChoose() {
  // const data_why_tt = [
  //   {
  //     title: 'Advanced Analytics',
  //     description: 'Enhance your trading strategy with state-of-the-art data analysis tools.',
  //     img: 'assets/img/icon/h2_choose_icon01.svg',
  //     delay: '.2s',
  //   },
  //   {
  //     title: '100% FREE',
  //     description:
  //       'Begin your journey today with our complimentary journaling and analysis tools. Improve your trading strategies and make informed decisions.',
  //     img: 'assets/img/icon/h2_choose_icon02.svg',
  //     delay: '.4s',
  //   },
  //   {
  //     title: 'Break Through Technology',
  //     description:
  //       "The most efficient and synchronized software available on the market today, delivering unparalleled speed and functionality for all users' needs.",
  //     img: 'assets/img/icon/h2_choose_icon03.svg',
  //     delay: '.6s',
  //   },
  //   {
  //     title: 'Global Community',
  //     description:
  //       'Join a thriving community of verified and like-minded traders from around the world with our unique sharable link feature.',
  //     img: 'assets/img/icon/h2_choose_icon04.svg',
  //     delay: '.8s',
  //   },
  // ];

  return (
    <section
      id='whychoose'
      className=' hidden md:block md:py-20 px-20 bg-gradient-to-b from-black via-slate-950 to-black'
    >
      <div className='max-w-7xl mx-auto'>
        <div className='w-full pb-20 flex flex-col items-center text-center mb-2 mt-10'>
          <p className=' mb-6  text-5xl font-bold leading-none  text-white text-center  md:mx-auto'>
            Why Choose Us
          </p>
          <p className='text-2xl  text-slate-200 '> TradeTab WorldWide Reach</p>
        </div>

        <WorldMap />

        {/* <div className='mx-auto justify-center lg:grid lg:grid-cols-4'>
          {data_why_tt.map((item, key) => (
            <div
              key={key}
              className='choose-item-two wow fadeInUp flex flex-col items-center' // changed items-start to items-center
              data-wow-delay={item.delay}
            >
              <div className='choose-icon-two self-center'>
                <img
                  className=' block mx-auto ' // ensures center alignment
                  src={item.img}
                  alt={item.title}
                />
              </div>
              <div className='choose-content text-center'>
                <h2 className='title'>
                  <a href='#'>{item.title}</a>
                </h2>

                <p className=' text-xl font-semibold'>{item.description}</p>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
