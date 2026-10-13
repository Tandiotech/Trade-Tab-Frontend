import React from 'react';

interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
}

interface GridItemProps {
  children: React.ReactNode;
  className?: string;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

const GridContainer: React.FC<GridContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 ${className}`}>
      {children}
    </div>
  );
};

const GridItem: React.FC<GridItemProps> = ({ 
  children, 
  className = '', 
  span = 1,
  sm,
  md,
  lg,
  xl
}) => {
  const getSpanClass = (size: number) => {
    const spanMap: Record<number, string> = {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6',
      7: 'col-span-7',
      8: 'col-span-8',
      9: 'col-span-9',
      10: 'col-span-10',
      11: 'col-span-11',
      12: 'col-span-12',
    };
    return spanMap[size] || 'col-span-1';
  };

  const getResponsiveSpanClass = (size: number | undefined, prefix: string) => {
    if (!size) return '';
    const spanMap: Record<number, string> = {
      1: `${prefix}-col-span-1`,
      2: `${prefix}-col-span-2`,
      3: `${prefix}-col-span-3`,
      4: `${prefix}-col-span-4`,
      5: `${prefix}-col-span-5`,
      6: `${prefix}-col-span-6`,
      7: `${prefix}-col-span-7`,
      8: `${prefix}-col-span-8`,
      9: `${prefix}-col-span-9`,
      10: `${prefix}-col-span-10`,
      11: `${prefix}-col-span-11`,
      12: `${prefix}-col-span-12`,
    };
    return spanMap[size] || '';
  };

  const spanClasses = [
    getSpanClass(span),
    getResponsiveSpanClass(sm, 'sm'),
    getResponsiveSpanClass(md, 'md'),
    getResponsiveSpanClass(lg, 'lg'),
    getResponsiveSpanClass(xl, 'xl'),
  ].filter(Boolean).join(' ');

  return (
    <div className={`${spanClasses} ${className}`}>
      {children}
    </div>
  );
};

// Predefined layout components for common patterns
const DashboardGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${className}`}>
      {children}
    </div>
  );
};

const CardGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
};

export const AnalyticsGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-1 xl:grid-cols-2 gap-6 ${className}`}>
      {children}
    </div>
  );
};

export const SummaryGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
};

// Responsive breakpoint utilities
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = React.useState<'sm' | 'md' | 'lg' | 'xl'>('sm');

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setBreakpoint('xl');
      } else if (width >= 1024) {
        setBreakpoint('lg');
      } else if (width >= 768) {
        setBreakpoint('md');
      } else {
        setBreakpoint('sm');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

// Responsive visibility utilities
interface ResponsiveProps {
  children: React.ReactNode;
  showOn?: 'sm' | 'md' | 'lg' | 'xl';
  hideOn?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Responsive: React.FC<ResponsiveProps> = ({ 
  children, 
  showOn, 
  hideOn, 
  className = '' 
}) => {
  const getVisibilityClass = () => {
    if (showOn) {
      const showMap = {
        sm: 'block sm:hidden',
        md: 'hidden md:block lg:hidden',
        lg: 'hidden lg:block xl:hidden',
        xl: 'hidden xl:block',
      };
      return showMap[showOn];
    }
    
    if (hideOn) {
      const hideMap = {
        sm: 'hidden sm:block',
        md: 'block md:hidden',
        lg: 'block lg:hidden',
        xl: 'block xl:hidden',
      };
      return hideMap[hideOn];
    }
    
    return '';
  };

  return (
    <div className={`${getVisibilityClass()} ${className}`}>
      {children}
    </div>
  );
};
