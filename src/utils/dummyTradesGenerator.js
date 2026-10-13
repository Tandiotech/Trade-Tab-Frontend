export const generateDummyTrades = () => {
  const today = new Date();
  // const months = [-2, -1, 0];
  const months = [-1, 0, 1];

  return months.flatMap(monthOffset => {
    const date = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, dayIndex) => {
      const day = dayIndex + 1;
      const closeDate = new Date(date.getFullYear(), date.getMonth(), day);

      // Skip weekends (Saturday = 6, Sunday = 0)
      if (closeDate.getDay() === 6 || closeDate.getDay() === 0) {
        return null;
      }

      const isWon = Math.random() < 0.8;
      const success = isWon ? 'won' : 'lost';
      const profit = isWon ? Math.floor(Math.random() * 100) + 1 : Math.floor(Math.random() * -100);

      // Generate openTime within 0-3 days before closeTime
      const daysBeforeClose = Math.floor(Math.random() * 4); // 0, 1, 2, or 3
      const openDate = new Date(closeDate);
      openDate.setDate(closeDate.getDate() - daysBeforeClose);

      return {
        // type: 'DEAL_TYPE_TRADE',
        type: 'DEAL_TYPE_BUY',
        closeTime: `${closeDate.getFullYear()}-${String(closeDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')} 10:00:00`,
        openTime: `${openDate.getFullYear()}-${String(openDate.getMonth() + 1).padStart(2, '0')}-${String(openDate.getDate()).padStart(2, '0')} 09:00:00`,
        profit,
        success,
      };
    }).filter(Boolean);
  });
};
