import TraderDNA from "../../component/3d/TraderDNA";


export default function TraderGenome() {
  const traderProfile = {
    riskLevel: "Risk Taker",
    investmentStrategy: "Long-term",
    preferredAssets: ["Gold", "Stocks", "Cryptocurrencies"],
    tradingFrequency: "Frequent",
    strategyOverview: `
      This trader is highly engaged in the markets, frequently seeking opportunities to maximize returns. 
      With a strong preference for high-risk assets like cryptocurrencies and stocks, this trader is not afraid 
      to take significant risks in pursuit of high rewards. However, they also recognize the value of stability 
      and maintain a long-term position in gold as a hedge against market volatility.
    `,
    behaviorAnalysis: [
      {
        title: "Risk Profile",
        description: "The trader exhibits a high-risk profile, characterized by frequent trading and a significant allocation to volatile assets like cryptocurrencies and tech stocks. They are willing to tolerate short-term losses for the potential of substantial long-term gains."
      },
      {
        title: "Investment Strategy",
        description: "A mix of aggressive and conservative strategies. While a majority of the portfolio is allocated to high-growth assets, a portion is kept in stable, long-term holdings like gold, which provides a counterbalance to the riskier positions."
      },
      {
        title: "Preferred Assets",
        description: "The trader's portfolio is heavily weighted towards high-risk, high-reward assets, including cryptocurrencies and stocks. Gold remains a key asset for long-term security and as a hedge against inflation and market downturns."
      },
      {
        title: "Trading Frequency",
        description: "Trades frequently, particularly in volatile markets, looking to capitalize on short-term price movements. The trader's active trading approach indicates a hands-on strategy, constantly monitoring and adjusting their positions."
      }
    ]
  };

  return (
    <div className="h-screen relative  text-white flex flex-col items-center p-10">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative bg-gray-900 p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Trader DNA Analysis</h1>
          <p className="text-lg mb-6">{traderProfile.strategyOverview}</p>
          <div className="space-y-4">
            {traderProfile.behaviorAnalysis.map((item, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-full">
          <div className="absolute inset-0">
            <TraderDNA />
          </div>
        </div>
        <div className="bottom-10 absolute w-1/2 right-10 p-4 rounded-lg text-center">
            <p className="text-lg font-medium">
            <span className="font-bold">Type: </span>{traderProfile.riskLevel} | 
            <span className="font-bold"> Strategy: </span>{traderProfile.investmentStrategy} | 
            <span className="font-bold"> Preferred Assets: </span>{traderProfile.preferredAssets.join(", ")} | 
            <span className="font-bold"> Trading Frequency: </span>{traderProfile.tradingFrequency}
            </p>
        </div>
      </div>


    </div>
  );
}
