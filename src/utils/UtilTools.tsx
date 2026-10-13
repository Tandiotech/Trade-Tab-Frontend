export const isEmptyObject = (obj: any) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

export default function formatNumber(num: any) {
  if (num) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }
}
