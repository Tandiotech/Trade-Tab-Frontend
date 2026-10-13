export const detectPatterns = (trades) => {
    let certificates = [];
  
    // The greater the number, the more difficult it is to achieve
    const medals = [
      "/assets/img/goals/1.webp",  // Easiest
      "/assets/img/goals/2.webp",
      "/assets/img/goals/3.webp",
      "/assets/img/goals/4.webp",
      "/assets/img/goals/5.webp",
      "/assets/img/goals/6.webp"   // Hardest
    ];
  
    // Initialize variables to track streaks and patterns
    let winStreak = 0;
    let highVolumeTrades = 0;
    let quickTrades = 0;
    let longTrades = 0;
    let largeProfitTrades = 0;
    let differentMarkets = new Set();
    let consistentProfitTrades = 0;
    let quickRecovery = false;
    let highPipTrades = 0;
  
    trades.forEach((trade, index) => {
      // Success streak (3 wins in a row)
      if (trade.success === "won") {
        winStreak++;
      } else {
        winStreak = 0; // Reset win streak on loss
      }
  
      // Detect High Volume Trades (>20)
      if (trade.volume > 20) {
        highVolumeTrades++;
      }
  
      // Detect Quick Trades (< 1 hour)
      if (trade.durationInMinutes < 60) {
        quickTrades++;
      }
  
      // Detect Long Trades (> 24 hours)
      if (trade.durationInMinutes > 1440) {
        longTrades++;
      }
  
      // Detect Large Profit Trades (> $1000)
      if (trade.profit > 1000) {
        largeProfitTrades++;
      }
  
      // Detect different markets
      differentMarkets.add(trade.symbol);
  
      // Consistent profit trades
      if (trade.profit > 0) {
        consistentProfitTrades++;
      }
  
      // Detect Quick Recovery (Loss followed by Win)
      if (index > 0 && trades[index - 1].success === "lost" && trade.success === "won") {
        quickRecovery = true;
      }
  
      // Detect High Pips Trades (> 300 pips)
      if (trade.pips > 300) {
        highPipTrades++;
      }
  
      // Generate Certificates based on merit-worthy patterns
      if (winStreak === 3) {
        certificates.push({ 
          name: "3 WIN STREAK", 
          medal: medals[0],
          description: "Achieved 3 consecutive winning trades, showing consistent performance."
        });
      }
      if (winStreak === 5) {
        certificates.push({ 
          name: "5 WIN STREAK", 
          medal: medals[1],
          description: "Achieved 5 consecutive winning trades, demonstrating strong trading skills."
        });
      }
    });
  
    // Additional Certificates Based on Aggregate Data
    if (highVolumeTrades >= 3) {
      certificates.push({ 
        name: "HIGH VOLUME TRADER", 
        medal: medals[2],
        description: "Traded with high volumes in multiple trades, showing risk tolerance and capital usage."
      });
    }
    if (quickTrades >= 3) {
      certificates.push({ 
        name: "FAST TRADER", 
        medal: medals[3],
        description: "Completed 3 or more quick trades under 1 hour, showcasing rapid decision-making skills."
      });
    }
    if (longTrades >= 3) {
      certificates.push({ 
        name: "LONG-TERM TRADER", 
        medal: medals[3],
        description: "Held positions for more than 24 hours in 3 or more trades, indicating patience and long-term strategy."
      });
    }
    if (largeProfitTrades >= 3) {
      certificates.push({ 
        name: "HIGH PROFIT TRADER", 
        medal: medals[4],
        description: "Achieved over $1000 in profit on 3 or more trades, showing significant profitability."
      });
    }
    if (differentMarkets.size >= 5) {
      certificates.push({ 
        name: "MULTI-MARKET TRADER", 
        medal: medals[5],
        description: "Traded in 5 or more different markets, demonstrating versatility and market knowledge."
      });
    }
    if (consistentProfitTrades >= 5) {
      certificates.push({ 
        name: "CONSISTENT PROFITS", 
        medal: medals[4],
        description: "Consistently made profits on 5 or more trades, proving steady performance."
      });
    }
    if (quickRecovery) {
      certificates.push({ 
        name: "QUICK RECOVERY", 
        medal: medals[3],
        description: "Recovered from a loss by winning the next trade, showcasing resilience and strategic thinking."
      });
    }
    if (highPipTrades >= 3) {
      certificates.push({ 
        name: "HIGH PIP TRADER", 
        medal: medals[5],
        description: "Achieved over 300 pips in 3 or more trades, reflecting mastery in pip management and large moves."
      });
    }
  
    // Remove duplicate certificates
    const uniqueCertificates = certificates.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
  
    return uniqueCertificates;
  };
  