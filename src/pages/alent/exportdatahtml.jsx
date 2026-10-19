import PDFTableHead from "./table/PDFTableHead";
const imgLogo = "/logo-lockup.png";
import {useEffect, useState} from "react";

function ExportDataHtml({
  dataMetrics,
  accountData = {balance: 340},
  TRADES = [],
  accountStats = {},
  userData,
  symbolName = [],
  switchStates,
}) {
  const totalTrades = accountStats?.total_trades;
  const totalTradesWon = accountStats?.total_trades_won;
  const totalTradesLost = accountStats?.total_trades_lost;
  const FloatingPL =
    accountStats.profit_loss + accountStats.total_withdrawals + accountStats.total_deposits;

  const winRatePercentage = totalTrades === 0 ? 0 : (totalTradesWon / totalTrades) * 100;
  const lossRatePercentage = totalTrades === 0 ? 0 : (totalTradesLost / totalTrades) * 100;

  const symbolNameData = symbolName;
  const symbolMappings = {
    CDPJPU: "EUR/USD",
    CHJPY: "CHF/JPY",
  };

  // Transformar los datos de símbolos según el mapeo
  const formattedSymbols = symbolNameData?.map(symbol => {
    if (symbol in symbolMappings) {
      return symbolMappings[symbol];
    } else {
      return symbol;
    }
  });

  const AccountInfo = [
    {
      title: "Balance:",
      // value: `${dataMetrics.balance} ${dataMetrics.currency} `,
      value: `${dataMetrics.balance} USD`,
    },
    {
      title: "Deposits:",
      value: `$ ${dataMetrics.deposits} `,
    },
    {
      title: "Withdrawals:",
      value: `$ ${dataMetrics.withdrawals} `,
    },
    // {
    //   title: "Broker:",
    //   value: `${accountData?.broker.substring(0, 22)} `,
    // },
    {
      title: "Equity:",
      value: `${dataMetrics?.absoluteGain} `,
    },
    {
      title: "Daily Gain:",
      value: `${dataMetrics?.dailyGain} `,
    },
    {
      title: "Monthly Gain:",
      value: `${dataMetrics?.monthlyGain} `,
    },
    {
      title: "Trades:",
      value: `${dataMetrics?.trades} `,
    },
    {
      title: "CAGR:",
      value: `${dataMetrics?.cagr} `,
    },
    {
      title: "Highest Balance:",
      value: `${dataMetrics?.highestBalance} `,
    },
    {
      title: "Won trades(%):",
      value: `${dataMetrics?.wonTradesPercent} `,
    },
    {
      title: "Lost trades(%):",
      value: `${dataMetrics?.lostTrades} `,
    },
    {
      title: "Max Drawdown:",
      value: `${dataMetrics.maxDrawdown} `,
    },
    {
      title: "Active since:",
      value: `${dataMetrics?.createdAt.substring(0, 10)} `,
    },
  ];

  const TradingStats = [
    {
      title: "Sharp Ratio:",
      value: `${dataMetrics.sharpeRatio} %`,
    },
    {
      title: "Win Rate:",
      value: `${winRatePercentage} %`,
    },
    {
      title: "Loss Rate:",
      value: `${lossRatePercentage} %`,
    },
    {
      title: "Total Lots:",
      value: `${dataMetrics.lots} `,
    },
    {
      title: "Z-Score:",
      value: `${dataMetrics.zScore} `,
    },
    {
      title: "Longs Won:",
      value: `${dataMetrics.longWonTrades} `,
    },
    {
      title: "Shorts Won:",
      value: `${dataMetrics.shortWonTrades} `,
    },
    {
      title: "Best Trade:",
      value: `${dataMetrics.bestTrade} `,
    },
    {
      title: "Worst Trade:",
      value: `${dataMetrics.worstTrade} `,
    },

    {
      title: "Average Win:",
      value: `${dataMetrics.averageWin} `,
    },
    {
      title: "Average Loss:",
      value: `${dataMetrics.averageLoss} `,
    },
    {
      title: "Last Trade:",
      value: `${dataMetrics.updatedAt} `,
    },
  ];

  const AccountSummaryAd = [
    {
      title: "Floating P/L",
      value: `${FloatingPL} `,
    },
    {
      title: "Equity:",
      value: `${dataMetrics.equity + FloatingPL} `,
    },
  ];

  const TotalBox = [
    {
      title: "Deposits:",
      value: `${dataMetrics.total_deposits} `,
    },
    {
      title: "Withdrawals:",
      value: `${dataMetrics.total_withdrawals} `,
    },
    {
      title: "Total Profit:",
      value: `${dataMetrics.profit} `,
    },
  ];

  const tradesData = {
    trades: TRADES.map((trade, index) => ({
      Ticket: trade.ticket,
      "Open Time": trade.open_time,
      Type: trade.type,
      Size: trade.lots,
      Item: trade.symbol,
      Price: trade.open_price,
      "S/L": trade.stop_loss,
      "T/P": trade.take_profit,
      "Close Time": trade.close_time.substring(0, 10),
      "Close Price": trade.close_price,
      Commission: trade.commission,
      Index: index,
      "R/O Swap": trade.swap,
      "Trade P/l": trade.profit,
    })),
  };

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setCurrentDate(new Date());
  }
  return (
    <main id="pdf-content" className="bg-white  text-black h-full  ">
      <div className=" relative h-40 bg-darkblack-700 rounded-t-3xl p-4 ">
        <div className=" h-full flex  items-center justify-between text-white ">
          <img src={imgLogo} alt="imglogo" className="w-40" />
          <div className="font-bold flex flex-col justify-left items-start z-20">
            <p
              className={` w-full flex  ${
                switchStates["Account ID"] === true ? "justify-between" : " justify-start"
              }`}
            >
              {" "}
              # Account:{" "}
              <span className="font-medium">
                {switchStates["Account ID"] === true ? accountData.account_number : "****"}
              </span>
            </p>
            <p className=" w-full">
              {" "}
              Generated: <span className="font-medium">{currentDate.toLocaleDateString()}</span>
            </p>
          </div>
        </div>
        <span className="absolute bottom-9  text-9xl w-full tracking-[2.5rem] text-white uppercase text-opacity-10">
          Metrics
        </span>
      </div>
      <section className="px-4 space-y-2">
        <div className=" h-fit flex justify-between items-center py-1">
          <div className="w-fit text-darkblack-500 ">
            <h2 className="text-darkblack-600 font-bold">Account Profile</h2>
            {switchStates["Account Profile"] === true ? (
              <>
                <p className="text-xl text-success-300 font-bold ">{accountData.account_name}</p>
                <p>
                  User ID: <span> #{userData._id.substring(0, 7)} </span>
                </p>
                <p>
                  Username: <span>{userData.userName} </span>
                </p>
              </>
            ) : (
              <>
                <p className="text-xl text-darkblack-700 font-bold ">****</p>
                <p>
                  User ID: <span className=" text-darkblack-700 font-bold"> **** </span>
                </p>
                <p>
                  Username: <span className=" text-darkblack-700 font-bold">**** </span>
                </p>
              </>
            )}
          </div>
          <div className="w-fit text-darkblack-500 text-right">
            <h2 className="text-darkblack-600 font-bold">Trading account</h2>
            {switchStates["Trading Account"] === true ? (
              <>
                <p className="text-xl text-success-300 font-bold">
                  Metatrader {accountData.mt_version}
                </p>
                <p>Broker: {accountData.broker}</p>
                <p>Server: {accountData.server}</p>
              </>
            ) : (
              <>
                <p className="text-xl text-success-300 font-bold">
                  Metatrader <span className=" text-darkblack-700 font-bold"> **** </span>
                </p>
                <p>
                  Broker: <span className=" text-darkblack-700 font-bold"> **** </span>
                </p>
                <p>
                  Server: <span className=" text-darkblack-700 font-bold"> **** </span>
                </p>
              </>
            )}
          </div>
        </div>
        <div className="w-full  ">
          <h2 className="text-darkblack-700 font-bold text-lg py-1">Account information:</h2>

          <div className="grid grid-cols-3 grid-rows-4 gap-2">
            {AccountInfo.map((item, key) => (
              <p
                className="text-base bg-bgray-600 bg-opacity-10 p-2 flex items-center space-x-2"
                key={key}
              >
                <span className="font-bold">{item.title}</span>{" "}
                <span className="text-darkblack-500 capitalize">
                  {switchStates["Account Info"] === true ? item.value : "****"}
                </span>
              </p>
            ))}
          </div>
        </div>
        <div className="w-full ">
          <h2 className="text-darkblack-700 font-bold text-lg py-1">Trading stats:</h2>

          <div className="grid grid-cols-3 grid-rows-4 gap-2">
            {TradingStats.map((item, key) => (
              <p
                className="text-base bg-bgray-600 bg-opacity-10 p-2 flex items-center space-x-2"
                key={key}
              >
                <span className="font-bold">{item.title}</span>{" "}
                <span className="text-darkblack-500 capitalize">
                  {switchStates["Tradings Stats"] === true ? item.value : "****"}
                </span>
              </p>
            ))}
          </div>
        </div>

        <div className="w-full ">
          <h2 className="text-darkblack-700 font-bold text-lg py-1">Account Summary:</h2>

          <div className="grid  grid-rows-2 border-t-2 border-t-darkblack-700 border-b-2 border-b-darkblack-700 ">
            {AccountSummaryAd.map((item, key) => (
              <div
                className={`w-full bg-bgray-200 bg-opacity-30 flex items-center ${
                  item.title == "Equity:"
                    ? "border-b-2 border-t-2 border-darkblack-300 border-opacity-40"
                    : ""
                }   `}
                key={key}
              >
                <p
                  className={`text-base  py-1 px-1 flex  items-center    ${
                    item.title === "Assets:" ? "w-full space-x-8 h-fit" : "w-30 justify-between "
                  }  `}
                >
                  <span className="font-bold">{item.title}</span>{" "}
                  <span className={`text-darkblack-500 ${item.title === "Assets:" ? "" : ""}`}>
                    {switchStates["Account Summary"] === true ? item.value : "****"}
                  </span>
                </p>
              </div>
            ))}
          </div>
          <div className=" py-1 flex  flex-col space-y-2 w-30  ">
            {TotalBox.map((item, key) => (
              <div
                className={`flex flex-col space-y-2  w-full ${
                  item.title == "Total Balance:" ? "border-t-2 border-t-darkblack-600 pt-2 " : " "
                }`}
                key={key}
              >
                <p className={`flex  justify-between items-center text-darkblack-500  `}>
                  <span
                    className={`px-3 py-1  font-bold ${
                      item.title == "Total Balance:"
                        ? "text-success-300 text-base whitespace-nowrap "
                        : "text-darkblack-700  text-xs "
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="text-xs">
                    {switchStates["Account Summary"] === true ? `$ ${item.value}` : "****"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full py-2">
          <span className="font-bold">Assets:</span>{" "}
          <span className={`text-darkblack-500 text-sm`}>
            {switchStates["Assets"] === true ? formattedSymbols.join(" - ") : "****"}
          </span>
        </div>
        <section className=" mt-24 w-2 ">
          <table className="w-2 mt-28 text-xs">
            <PDFTableHead />

            <tbody className="text-darkblack-700">
              {tradesData.trades.map((trade, index) => (
                <tr key={index}>
                  {Object.values(trade).map((value, index) => (
                    <td
                      key={index}
                      className="border-2 p-2 text-[13px] font-bold  whitespace-nowrap border-darkblack-300"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}

export default ExportDataHtml;
