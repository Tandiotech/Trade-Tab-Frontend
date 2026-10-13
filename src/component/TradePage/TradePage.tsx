import { useState, useMemo, useCallback, useEffect } from 'react';
import { ITrade } from '@/pages/metrics/interface';
import { FilterState } from '@/component/TradeFilters';
import TradeSummaryCard from '@/component/TradeSummaryCard';
import BestTradesTable from '@/component/BestTradesTable';
import TradeAnalyticsChart from '@/component/TradeAnalyticsChart';
import MostUsedPairs from '@/component/MostUsedPairs';
import TradeHistoryTable from '@/component/TradeHistoryTable';
import TradeFilters from '@/component/TradeFilters';
import TradeInsights from '@/component/TradeInsights';
import { PageSkeleton, LoadingOverlay } from './LoadingSystem';
import { AnalyticsGrid, SummaryGrid } from './GridSystem';
import { ThemeToggle, ColorSchemeSelector } from './ThemeSystem';
import { RealTimeUpdates, QuickActions, EnhancedTradeDetailsModal } from './InteractiveFeatures';
import { useTradePageShortcuts } from './KeyboardShortcuts';
import { useNotifications } from '@/context/NotificationContext';

interface TradePageProps {
  trades: ITrade[];
  loading?: boolean;
  className?: string;
}

const TradePageContent: React.FC<TradePageProps> = ({
  trades,
  loading = false,
  className = '',
}) => {
  const { addNotification, updateNotification } = useNotifications();

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    symbols: [],
    types: [],
    results: [],
    dateRange: { start: '', end: '' },
    profitRange: { min: null, max: null },
    volumeRange: { min: null, max: null },
    pipsRange: { min: null, max: null },
    durationRange: { min: null, max: null },
  });

  const [selectedTrade, setSelectedTrade] = useState<ITrade | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'analytics' | 'history'>('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showExportModal, setShowExportModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const { registerTradeShortcuts, unregisterTradeShortcuts } = useTradePageShortcuts();

  // ✅ Diccionario de validadores
  const validators: Record<string, (trade: ITrade, f: any) => boolean> = {
    search: (t, f) => {
      if (!f) return true;
      const s = f.toLowerCase();
      return (
        t.symbol?.toLowerCase().includes(s) ||
        t.type?.toLowerCase().includes(s) ||
        t._id?.toLowerCase().includes(s) ||
        t.profit?.toString().includes(s)
      );
    },
    symbols: (t, f: string[]) => !f.length || f.includes(t.symbol),
    types: (t, f: string[]) => !f.length || f.includes(t.type),
    results: (t, f: string[]) => {
      if (!f.length) return true;
      const profit = t.profit;
      const result = profit > 0 ? 'profit' : profit < 0 ? 'loss' : 'break-even';
      return f.includes(result);
    },
    dateRange: (t, f) => {
      if (!t.openTime) return true;
      const d = new Date(t.openTime);
      return (!f.start || d >= new Date(f.start)) && (!f.end || d <= new Date(f.end));
    },
    profitRange: (t, f) =>
      (f.min === null || t.profit >= f.min) && (f.max === null || t.profit <= f.max),
    volumeRange: (t, f) =>
      (f.min === null || (t.volume || 0) >= f.min) && (f.max === null || (t.volume || 0) <= f.max),
    pipsRange: (t, f) =>
      (f.min === null || (t.pips || 0) >= f.min) && (f.max === null || (t.pips || 0) <= f.max),
    durationRange: (t, f) => {
      if (!t.openTime || !t.closeTime) return true;
      const dur =
        (new Date(t.closeTime).getTime() - new Date(t.openTime).getTime()) / (1000 * 60 * 60);
      return (f.min === null || dur >= f.min) && (f.max === null || dur <= f.max);
    },
  };

  // ✅ Filtro optimizado con el diccionario
  const filteredTrades = useMemo(() => {
    if (!trades?.length) return [];
    return trades.filter(t =>
      Object.entries(validators).every(([key, fn]) => fn(t, (filters as any)[key]))
    );
  }, [trades, filters]);

  // 🧮 Helpers
  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).reduce((count, [key, val]) => {
      if (
        key === 'dateRange' ||
        key === 'profitRange' ||
        key === 'volumeRange' ||
        key === 'pipsRange' ||
        key === 'durationRange'
      ) {
        const hasMinMax = val.min !== null || val.max !== null || val.start || val.end;
        return count + (hasMinMax ? 1 : 0);
      }
      if (Array.isArray(val) && val.length > 0) return count + 1;
      if (typeof val === 'string' && val.trim()) return count + 1;
      return count;
    }, 0);
  }, [filters]);

  // ⚙️ Handlers
  const handleFiltersChange = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);
      if (activeFiltersCount > 0) {
        addNotification({
          type: 'info',
          title: 'Filters Applied',
          message: `${activeFiltersCount} active filter${activeFiltersCount > 1 ? 's' : ''}.`,
        });
      }
    },
    [activeFiltersCount, addNotification]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    const id = addNotification({
      type: 'info',
      title: 'Refreshing Data',
      message: 'Updating trades list...',
      status: 'connecting',
      progress: 30,
    });
    try {
      await new Promise(r => setTimeout(r, 1000));
      setLastUpdate(new Date());
      updateNotification(id, {
        type: 'success',
        title: 'Data Refreshed',
        message: `Updated ${trades.length} trades.`,
        status: 'success',
        progress: 100,
      });
    } catch {
      updateNotification(id, {
        type: 'error',
        title: 'Refresh Failed',
        message: 'Could not refresh trades.',
        status: 'error',
        progress: 100,
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [addNotification, updateNotification, trades.length]);

  const handleExport = useCallback(() => setShowExportModal(true), []);
  const handleExportComplete = useCallback(
    (file: string) => {
      setShowExportModal(false);
      addNotification({
        type: 'success',
        title: 'Export Complete',
        message: `File "${file}" saved successfully.`,
      });
    },
    [addNotification]
  );
  const handleExportError = useCallback(
    (err: string) => {
      setShowExportModal(false);
      addNotification({
        type: 'error',
        title: 'Export Failed',
        message: err,
      });
    },
    [addNotification]
  );

  const handleTradeEdit = useCallback(
    (t: ITrade) =>
      addNotification({
        type: 'info',
        title: 'Trade Updated',
        message: `Trade ${t._id} modified.`,
      }),
    [addNotification]
  );

  const handleTradeDelete = useCallback(
    (id: string) =>
      addNotification({
        type: 'warning',
        title: 'Trade Removed',
        message: `Trade ${id} closed.`,
      }),
    [addNotification]
  );

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      symbols: [],
      types: [],
      results: [],
      dateRange: { start: '', end: '' },
      profitRange: { min: null, max: null },
      volumeRange: { min: null, max: null },
      pipsRange: { min: null, max: null },
      durationRange: { min: null, max: null },
    });
    addNotification({
      type: 'info',
      title: 'Filters Cleared',
      message: 'All filters reset.',
    });
  }, [addNotification]);

  // Keyboard shortcuts
  const handleToggleFilters = useCallback(() => setShowFilters(v => !v), []);
  const handleViewChange = useCallback(
    (v: 'overview' | 'analytics' | 'history') => setActiveView(v),
    []
  );
  const handleSearch = useCallback(() => {
    const el = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (el) el.focus();
  }, []);
  const handleCompare = useCallback(() => setShowComparisonModal(true), []);

  useEffect(() => {
    registerTradeShortcuts({
      onRefresh: handleRefresh,
      onExport: handleExport,
      onToggleFilters: handleToggleFilters,
      onToggleView: handleViewChange,
      onSearch: handleSearch,
      onClearFilters: handleClearFilters,
      onShowHelp: () => {}, // ✅ agregamos función vacía para cumplir el tipo
    });

    return unregisterTradeShortcuts;
  }, [
    registerTradeShortcuts,
    unregisterTradeShortcuts,
    handleRefresh,
    handleExport,
    handleToggleFilters,
    handleViewChange,
    handleSearch,
    handleClearFilters,
  ]);

  if (loading) return <PageSkeleton className={className} />;

  // ✅ UI
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${className}`}
    >
      {/* Header */}
      <div className='bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40'>
        <div className='container mx-auto px-4 py-6 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-white mb-2'>Trading Dashboard</h1>
            <p className='text-slate-400'>
              {filteredTrades.length} of {trades.length} trades
              {activeFiltersCount > 0 && (
                <span className='ml-2 text-blue-400'>
                  ({activeFiltersCount} active filter{activeFiltersCount !== 1 ? 's' : ''})
                </span>
              )}
            </p>
          </div>
          <div className='flex items-center space-x-4'>
            <QuickActions
              onExport={handleExport}
              onRefresh={handleRefresh}
              onCompare={handleCompare}
              isExporting={isExporting}
              isRefreshing={isRefreshing}
            />
            <div className='hidden lg:flex items-center space-x-2'>
              <ThemeToggle />
              <ColorSchemeSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className='container mx-auto px-4 py-8'>
        {showFilters && (
          <div className='mb-8'>
            <TradeFilters trades={trades} onFiltersChange={handleFiltersChange} className='mb-6' />
          </div>
        )}

        <div className='mb-6'>
          <RealTimeUpdates
            onRefresh={handleRefresh}
            lastUpdate={lastUpdate}
            isUpdating={isRefreshing}
          />
        </div>

        <LoadingOverlay isLoading={false}>
          {activeView === 'overview' && (
            <div className='space-y-8'>
              <SummaryGrid>
                <div className='lg:col-span-2'>
                  <TradeSummaryCard trades={filteredTrades} />
                </div>
                <div>
                  <TradeInsights trades={filteredTrades} />
                </div>
              </SummaryGrid>
              <AnalyticsGrid>
                <BestTradesTable trades={filteredTrades} maxTrades={5} />
                <TradeAnalyticsChart trades={filteredTrades} />
              </AnalyticsGrid>
              <MostUsedPairs trades={filteredTrades} maxPairs={6} />
            </div>
          )}
          {activeView === 'analytics' && (
            <div className='space-y-8'>
              <AnalyticsGrid>
                <TradeAnalyticsChart trades={filteredTrades} />
                <TradeInsights trades={filteredTrades} />
              </AnalyticsGrid>
              <AnalyticsGrid>
                <BestTradesTable trades={filteredTrades} maxTrades={10} />
                <MostUsedPairs trades={filteredTrades} maxPairs={10} />
              </AnalyticsGrid>
            </div>
          )}
          {activeView === 'history' && (
            <div className='space-y-8'>
              <SummaryGrid>
                <div className='lg:col-span-1'>
                  <TradeSummaryCard trades={filteredTrades} />
                </div>
                <div className='lg:col-span-2'>
                  <TradeInsights trades={filteredTrades} />
                </div>
              </SummaryGrid>
              <TradeHistoryTable
                trades={filteredTrades}
                pageSize={25}
                onTradeClick={setSelectedTrade}
              />
            </div>
          )}
        </LoadingOverlay>
      </div>

      <EnhancedTradeDetailsModal
        trade={selectedTrade}
        onClose={() => setSelectedTrade(null)}
        onEdit={handleTradeEdit}
        onDelete={handleTradeDelete}
      />
    </div>
  );
};

const TradePage: React.FC<TradePageProps> = props => <TradePageContent {...props} />;
export default TradePage;
