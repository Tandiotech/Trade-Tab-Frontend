import React, { memo, useMemo, useCallback, useRef, useEffect } from 'react';

// Virtual scrolling hook for large datasets
const useVirtualScrolling = (
  items: any[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    visibleRange,
  };
};

// Debounced search hook
const useDebouncedSearch = (value: string, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized data processing hook
const useMemoizedDataProcessing = <T,>(
  data: T[],
  processingFunction: (data: T[]) => any,
  dependencies: any[] = []
) => {
  return useMemo(() => {
    if (!data || data.length === 0) return null;
    return processingFunction(data);
  }, [data, ...dependencies]);
};

// Optimized table row component
interface OptimizedTableRowProps {
  item: any;
  index: number;
  onRowClick?: (item: any) => void;
  renderCell: (item: any, key: string) => React.ReactNode;
  className?: string;
}

const OptimizedTableRow = memo<OptimizedTableRowProps>(({
  item,
  index,
  onRowClick,
  renderCell,
  className = ''
}) => {
  const handleClick = useCallback(() => {
    if (onRowClick) {
      onRowClick(item);
    }
  }, [item, onRowClick]);

  const cells = useMemo(() => {
    return Object.keys(item).map(key => (
      <td key={key} className="px-4 py-3 text-sm text-white">
        {renderCell(item, key)}
      </td>
    ));
  }, [item, renderCell]);

  return (
    <tr
      onClick={handleClick}
      className={`hover:bg-slate-700/50 transition-colors duration-200 cursor-pointer ${className}`}
    >
      {cells}
    </tr>
  );
});

OptimizedTableRow.displayName = 'OptimizedTableRow';

// Virtual scrolling table component
interface VirtualScrollingTableProps {
  data: any[];
  itemHeight: number;
  containerHeight: number;
  onRowClick?: (item: any) => void;
  renderCell: (item: any, key: string) => React.ReactNode;
  className?: string;
}

export const VirtualScrollingTable = memo<VirtualScrollingTableProps>(({
  data,
  itemHeight,
  containerHeight,
  onRowClick,
  renderCell,
  className = ''
}) => {
  const {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
  } = useVirtualScrolling(data, itemHeight, containerHeight);

  const visibleRows = useMemo(() => {
    return visibleItems.map((item, index) => (
      <OptimizedTableRow
        key={item.id || index}
        item={item}
        index={index}
        onRowClick={onRowClick}
        renderCell={renderCell}
      />
    ));
  }, [visibleItems, onRowClick, renderCell]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <table className="w-full">
            <tbody>
              {visibleRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

VirtualScrollingTable.displayName = 'VirtualScrollingTable';

// Optimized chart component with lazy loading
interface OptimizedChartProps {
  data: any[];
  type: 'line' | 'bar' | 'doughnut';
  loading?: boolean;
  className?: string;
}

export const OptimizedChart = memo<OptimizedChartProps>(({
  data,
  type,
  loading = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const chartData = useMemo(() => {
    if (!isVisible || !data) return null;
    
    // Simulate chart data processing
    return {
      labels: data.map((_, index) => `Item ${index + 1}`),
      datasets: [{
        data: data.map(item => item.value || Math.random() * 100),
        backgroundColor: data.map(() => `hsl(${Math.random() * 360}, 70%, 50%)`),
      }],
    };
  }, [data, isVisible]);

  if (loading) {
    return (
      <div className={`bg-slate-800 rounded-xl border border-slate-700 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div ref={chartRef} className={`bg-slate-800 rounded-xl border border-slate-700 p-6 ${className}`}>
      {isVisible && chartData ? (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {type.charAt(0).toUpperCase() + type.slice(1)} Chart
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-slate-400">
              Chart would render here with {chartData.datasets[0].data.length} data points
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <div className="text-slate-400">Loading chart...</div>
        </div>
      )}
    </div>
  );
});

OptimizedChart.displayName = 'OptimizedChart';

// Optimized filter component
interface OptimizedFilterProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const OptimizedFilter = memo<OptimizedFilterProps>(({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  className = ''
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebouncedSearch(searchTerm);

  const filteredOptions = useMemo(() => {
    if (!debouncedSearchTerm) return options;
    return options.filter(option =>
      option.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [options, debouncedSearchTerm]);

  const handleOptionClick = useCallback((option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  }, [onChange]);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-left flex items-center justify-between transition-colors duration-200"
      >
        <span>{value || placeholder}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10">
          <div className="p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search options..."
              className="w-full bg-slate-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-700 transition-colors duration-200"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

OptimizedFilter.displayName = 'OptimizedFilter';

// Performance monitoring component
interface PerformanceMonitorProps {
  componentName: string;
  renderCount?: boolean;
  memoryUsage?: boolean;
  className?: string;
}

export const PerformanceMonitor = memo<PerformanceMonitorProps>(({
  componentName,
  renderCount = true,
  memoryUsage = true,
  className = ''
}) => {
  const renderCountRef = useRef(0);
  const [memoryInfo, setMemoryInfo] = React.useState<any>(null);

  renderCountRef.current += 1;

  useEffect(() => {
    if (memoryUsage && 'memory' in performance) {
      const updateMemoryInfo = () => {
        setMemoryInfo((performance as any).memory);
      };
      
      updateMemoryInfo();
      const interval = setInterval(updateMemoryInfo, 1000);
      
      return () => clearInterval(interval);
    }
  }, [memoryUsage]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className={`bg-slate-900 border border-slate-600 rounded-lg p-2 text-xs ${className}`}>
      <div className="text-slate-400">
        <div>Component: {componentName}</div>
        {renderCount && <div>Renders: {renderCountRef.current}</div>}
        {memoryUsage && memoryInfo && (
          <div>
            Memory: {Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024)}MB
          </div>
        )}
      </div>
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

// Bundle size optimization utilities
const bundleOptimizations = {
  // Lazy load heavy components
  lazyLoadComponent: <T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>
  ) => {
    return React.lazy(importFunc);
  },

  // Preload critical components
  preloadComponent: (importFunc: () => Promise<any>) => {
    importFunc();
  },

  // Dynamic import with loading state
  dynamicImport: <T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    fallback?: React.ComponentType
  ) => {
    const LazyComponent = React.lazy(importFunc);
    
    return (props: any) => (
      <React.Suspense fallback={fallback ? <fallback /> : <div>Loading...</div>}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  },
};

// Memory optimization utilities
const memoryOptimizations = {
  // Cleanup function for event listeners
  useEventListener: (event: string, handler: (e: Event) => void, element?: Element) => {
    const savedHandler = useRef<(e: Event) => void>();

    useEffect(() => {
      savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
      const targetElement = element || window;
      const eventListener = (e: Event) => savedHandler.current?.(e);
      
      targetElement.addEventListener(event, eventListener);
      
      return () => {
        targetElement.removeEventListener(event, eventListener);
      };
    }, [event, element]);
  },

  // Debounced resize handler
  useDebouncedResize: (callback: () => void, delay: number = 250) => {
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
      const handleResize = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(callback, delay);
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [callback, delay]);
  },

  // Cleanup function for intervals
  useInterval: (callback: () => void, delay: number | null) => {
    const savedCallback = useRef<() => void>();

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      if (delay === null) return;

      const id = setInterval(() => savedCallback.current?.(), delay);
      return () => clearInterval(id);
    }, [delay]);
  },
};

// All utilities are already exported individually above
