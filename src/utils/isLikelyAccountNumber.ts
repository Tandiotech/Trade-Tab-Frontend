// utils/isLikelyAccountNumber.ts
/**
 * Checks if `accountNumber` is "likely" valid, based on length and digits only.
 * Example criteria:
 * - 5 to 10+ digits (adjust to your real constraints)
 * - Only numeric characters
 */
export function isLikelyAccountNumber(accountNumber: string): boolean {
  // If needed, tweak the minimum and maximum length
  const minLen = 5;
  const maxLen = 12; // or 15, if some accounts are longer
  const regex = new RegExp(`^[0-9]{${minLen},${maxLen}}$`);
  return regex.test(accountNumber.trim());
}
