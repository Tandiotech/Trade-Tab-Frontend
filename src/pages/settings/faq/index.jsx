import { useState } from 'react';
import FaqTab from '../../../component/settings/FaqTab';

function Faq({ name, activeTab }) {
  const [activeFaq, setActiveFaq] = useState([1]);
  const handleActiveFaq = id => {
    if (activeFaq?.find(item => item === id)) {
      setActiveFaq(activeFaq.filter(item => item !== id));
    } else {
      setActiveFaq([...activeFaq, id]);
    }
  };

  const questions = [
    {
      title: 'How many accounts can I host on the platform?',
      content: 'We would say as much as you need, you can run from one to unlimited.',
    },
    {
      title: 'What types of trading strategies can I do on TradeTab?',
      content:
        'TradeTab allows you to journaling and other various strategies, including hedging and algorithmic trading, ensuring flexibility for all trading styles.',
    },
    {
      title: 'Is my data secure on TradeTab?',
      content:
        'Yes, TradeTab implements advanced encryption and security protocols to ensure that all your trading data and personal information are fully protected.',
    },
    {
      title: 'Can I access TradeTab from multiple devices?',
      content:
        'Absolutely, you can access your TradeTab account from multiple devices including desktop, mobile, and tablet, with real-time synchronization.',
    },
    {
      title: 'Does TradeTab support integration with third-party tools?',
      content:
        'Yes, TradeTab supports integration with various third-party tools and platforms like MetaTrader 4 and 5, allowing for seamless operation.',
    },
    {
      title: 'What is the minimum balance required to start trading on TradeTab?',
      content:
        'TradeTab is a metrics platform only and deposit requieremts maybe subject to the broker you are trading with.',
    },
  ];

  return (
    <div
      id='tab5'
      className={`tab-pane p-5 rounded-2xl bg-gradient-to-t from-cyan-700 via-transparent to-transparent md:border border-cyan-800 hover:border-cyan-500 ease-in-out duration-300 ${name === activeTab && 'active'}`}
    >
      <div className='md:px-5 md:py-2'>
        <h3 className='text-2xl font-bold text-white mb-5'>FAQ</h3>
        <hr className='opacity-50 mb-5' />

        <div>
          {questions.map((item, key) => (
            <FaqTab
              key={key + 9}
              title={key + 1 + '.' + item.title}
              desc={item.content}
              id={key + 1}
              activeId={activeFaq}
              handleActive={handleActiveFaq}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default Faq;
