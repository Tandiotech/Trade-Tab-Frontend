// Function to calculate the date adding business days (excluding weekends when needed)
export const addBusinessDays = (
  startDate: Date,
  daysToAdd: number,
  includeWeekends: boolean
): Date => {
  let daysAdded = 0;
  const newDate = new Date(startDate);

  while (daysAdded < daysToAdd) {
    newDate.setDate(newDate.getDate() + 1);

    // If weekends are excluded, only count business days
    if (includeWeekends || (newDate.getDay() !== 6 && newDate.getDay() !== 0)) {
      daysAdded++;
    }
  }

  return newDate;
};
