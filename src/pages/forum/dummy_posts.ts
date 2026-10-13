const dummyPostsForum: any = [
  {
    _id: '1',
    title: 'Withdraw issue',
    content:
      'I deposited $4,500 with this broker and passed KYC within 2 hours. However, I’ve been having issues withdrawing my profits for 6 days now.',
    votes: 25,
    comments: [
      {
        userName: 'Broker X Support',
        content:
          'We’re sorry for the inconvenience. Please contact our support team at bit.ly/2KEOXnx, and we will expedite your withdrawal request.',
        admin: true,
      },
      { userName: 'Trader99', content: 'Same here, I’ve been waiting 5 days for my withdrawal.' },
      {
        userName: 'FXKing',
        content: 'It’s been a nightmare withdrawing. What’s going on with this broker?',
      },
      {
        userName: 'JoeTrader',
        content: 'I’m facing the same issue. Is this common with this broker?',
      },
    ],
  },
  {
    _id: '2',
    title: 'Best broker for beginners?',
    content:
      'I’m new to trading and want to know which broker is best for beginners. Any recommendations?',
    votes: 50,
    comments: [
      {
        userName: 'Broker Support',
        content:
          'We offer a beginner-friendly platform with demo accounts to practice. Contact us for personalized assistance.',
        admin: true,
      },
      { userName: 'AliceW', content: 'I started here, but the withdrawal process isn’t great.' },
      { userName: 'NewTrader22', content: 'The platform is easy to use, but support is slow.' },
    ],
  },
  {
    _id: '3',
    title: 'Risk management strategies',
    content: 'What are some of the best risk management strategies you’ve used in trading?',
    votes: 34,
    comments: [
      {
        userName: 'Broker Support',
        content:
          'Always use stop losses and don’t risk more than 2% per trade. We also recommend setting clear risk parameters.',
        admin: true,
      },
      {
        userName: 'RiskyTrader',
        content: 'Yeah, I’ve been burned by not setting a stop loss too.',
      },
      { userName: 'FXGuy', content: 'Good advice, but I need to get better at following it!' },
    ],
  },
  {
    _id: '4',
    title: 'How to use leverage effectively?',
    content: 'Leverage seems risky. How can I use it without taking on too much risk?',
    votes: 40,
    comments: [
      {
        userName: 'Broker Support',
        content:
          'We recommend using lower leverage ratios, especially for beginner traders. You can reach out to our team for more guidance.',
        admin: true,
      },
      {
        userName: 'JohnTrader',
        content: 'Leverage can destroy your account if not used properly.',
      },
      {
        userName: 'RiskyJohn',
        content: 'Definitely need to be cautious with leverage, lesson learned the hard way!',
      },
    ],
  },
  {
    _id: '5',
    title: 'What’s the best way to analyze the market?',
    content:
      'I’m struggling with market analysis. Should I focus more on technical or fundamental analysis?',
    votes: 18,
    comments: [
      {
        userName: 'Broker Support',
        content:
          'Technical analysis is great for short-term trades, but a combination of both is ideal for overall strategy.',
        admin: true,
      },
      {
        userName: 'SwingTrader',
        content: 'I find technical analysis more useful for day trading.',
      },
      {
        userName: 'MarketGuru',
        content: 'Fundamental analysis helps a lot with long-term investments.',
      },
    ],
  },
  {
    _id: '6',
    title: 'Tips for reducing emotional trading',
    content: 'How do you manage emotions when trades go bad?',
    votes: 60,
    comments: [
      {
        userName: 'Broker Support',
        content:
          'Always have a clear strategy, and stick to it. If you need assistance managing your trades, feel free to reach out to us.',
        admin: true,
      },
      {
        userName: 'ZenTrader',
        content: 'Taking a break and sticking to my strategy works for me.',
      },
      {
        userName: 'CalmInvestor',
        content: 'Breathing exercises have helped me calm my nerves during bad trades.',
      },
    ],
  },
];

export default dummyPostsForum;
