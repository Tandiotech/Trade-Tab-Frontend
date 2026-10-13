import { useEffect } from 'react';

/** Warm the metrics route chunk after app shell is interactive */
export function MetricsPrefetch() {
  useEffect(() => {
    const run = () => {
      void import('@/pages/metrics/Metrics');
    };
    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(run, { timeout: 3000 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(run, 1500);
    return () => clearTimeout(t);
  }, []);

  return null;
}
