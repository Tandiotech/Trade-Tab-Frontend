import { Suspense, type ReactNode } from 'react';
import { useInViewOnce } from '../hooks/useInViewOnce';

type MetricsDeferredSectionProps = {
  fallback: ReactNode;
  children: ReactNode;
  rootMargin?: string;
};

/** Mount children (e.g. lazy chart sections) when scrolled near viewport */
export function MetricsDeferredSection({
  fallback,
  children,
  rootMargin = '160px',
}: MetricsDeferredSectionProps) {
  const { ref, inView } = useInViewOnce(rootMargin);

  return (
    <div ref={ref} className='min-h-[1px]'>
      {inView ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
}
