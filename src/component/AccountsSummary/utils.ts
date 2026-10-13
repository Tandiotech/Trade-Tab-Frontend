export const fmtCurrency = (n?: number) =>
  n == null || isNaN(n) ? '—' : n.toLocaleString(undefined, { maximumFractionDigits: 2 });

export const fmtPct = (n?: number) => (n == null ? '—' : `${(n * 100).toFixed(1)}%`);

export const getRelativeTime = (dateString?: string): string => {
  if (!dateString) return '—';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};
