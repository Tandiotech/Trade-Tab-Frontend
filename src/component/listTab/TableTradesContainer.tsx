import { useState, useMemo } from 'react';
import LineTrade from './Cuentas/LineTrade';
import { headersTrades } from './headers';

type TradeRecord = Record<string, any>;
interface TableTradesContainerProps {
  data?: TradeRecord[];
  currentFilter?: string;
  recordPerPage: number;
  selectedFilters: Array<{ name: string } | any>;
}

const ALL_FIELDS = '__ALL__'; // NEW

export default function TableTradesContainer({
  data = [],
  recordPerPage,
  selectedFilters,
}: TableTradesContainerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<{ key: string | null; asc: boolean }>({
    key: null,
    asc: true,
  });

  // NEW: búsqueda global / por campo
  const [search, setSearch] = useState<string>(''); // cadena a buscar
  const [searchField, setSearchField] = useState<string>(ALL_FIELDS); // campo a buscar (o todos)

  const headerMap: Record<string, string> = {
    Ticket: '_id',
    'Open Time': 'openTime',
    Symbol: 'symbol',
    Type: 'type',
    Volume: 'volume',
    'Open Price': 'openPrice',
    'Close Time': 'closeTime',
    'Close Price': 'closePrice',
    Pips: 'pips',
    Profit: 'profit',
  };

  const handleSort = (headerName: string) => {
    const key = headerMap[headerName];
    if (!key) return;

    setSortOrder(prevSortOrder => ({
      key,
      asc: prevSortOrder.key === key ? !prevSortOrder.asc : true,
    }));
    setCurrentPage(1); // UX: vuelve a la primera página al cambiar orden
  };

  const compareValues = (a: TradeRecord, b: TradeRecord, key: string) => {
    const valA = a[key];
    const valB = b[key];

    if (typeof valA === 'number' && typeof valB === 'number') {
      return valA - valB;
    }
    if (typeof valA === 'string' && typeof valB === 'string') {
      return valA.localeCompare(valB);
    }
    if (key.toLowerCase().includes('time')) {
      const timeA = new Date(valA as any).getTime();
      const timeB = new Date(valB as any).getTime();
      return timeA - timeB;
    }
    return 0;
  };

  const filteredHeaders = headersTrades.filter(header => !selectedFilters.includes(header));

  // NEW: claves visibles (sobre las que buscamos por defecto)
  const visibleKeys = useMemo(
    () => filteredHeaders.map((h: any) => headerMap[h.name as string]).filter(Boolean),
    [filteredHeaders]
  );

  // NEW: función de “match” para una celda
  const cellMatches = (value: any, q: string) => {
    if (q === '') return true;
    if (value == null) return false;

    const query = q.toLowerCase().trim();

    if (typeof value === 'number') {
      // match por substring en representación string
      return String(value).toLowerCase().includes(query);
    }

    // fechas → probar ISO y local
    if (value instanceof Date || (typeof value === 'string' && /\d{4}-\d{2}-\d{2}/.test(value))) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        const iso = d.toISOString().toLowerCase();
        const loc = d.toLocaleString().toLowerCase();
        return iso.includes(query) || loc.includes(query);
      }
    }

    // string genérico (símbolo, tipo, ticket, etc.)
    return String(value).toLowerCase().includes(query);
  };

  // NEW: filtrado → luego orden → luego paginado
  const filteredData = useMemo(() => {
    if (!search) return data;

    // ¿buscamos en todos los visibles o en uno específico?
    if (searchField === ALL_FIELDS) {
      return data.filter(row => {
        for (const k of visibleKeys) {
          if (cellMatches(row[k], search)) return true;
        }
        return false;
      });
    } else {
      // buscar solo en la clave elegida (si existe)
      return data.filter(row => cellMatches(row[searchField], search));
    }
  }, [data, search, searchField, visibleKeys]);

  const sortedData = useMemo(() => {
    if (!sortOrder.key) return [...filteredData];
    return [...filteredData].sort((a, b) => {
      const comparison = compareValues(a, b, sortOrder.key as string);
      return sortOrder.asc ? comparison : -comparison;
    });
  }, [filteredData, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / recordPerPage);
  const lastIndex = Math.min(currentPage * recordPerPage, sortedData.length);
  const firstIndex = Math.max(0, lastIndex - recordPerPage);
  const records = sortedData.slice(firstIndex, lastIndex);

  const getPaginationItems = () => {
    const pages = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      const startPage = Math.max(2, currentPage - 2);
      const endPage = Math.min(totalPages - 1, currentPage + 2);
      if (startPage > 2) pages.push('...');
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const sortStateFor = (headerName: string): 'none' | 'ascending' | 'descending' => {
    const key = headerMap[headerName];
    if (!key || sortOrder.key !== key) return 'none';
    return sortOrder.asc ? 'ascending' : 'descending';
  };

  return (
    <div>
      {/* Barra superior: búsqueda + selector de campo */}
      <div className='flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <div className='relative'>
            <input
              type='text'
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder='Search by symbol, ticket, price, date, etc.'
              className='w-64 bg-slate-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-600/50'
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setCurrentPage(1);
                }}
                className='absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 px-2'
                title='Clear'
              >
                ×
              </button>
            )}
          </div>

          <div className='flex items-center gap-1'>
            <span className='text-xs text-gray-400'>Field:</span>
            <select
              value={searchField}
              onChange={e => {
                setSearchField(e.target.value);
                setCurrentPage(1);
              }}
              className='bg-slate-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none'
              title='Select a field to search'
            >
              <option value={ALL_FIELDS}>All</option>
              {filteredHeaders.map((h: any) => {
                const k = headerMap[h.name];
                if (!k) return null;
                return (  
                  <option key={k} value={k}>
                    {h.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Hint: ordenar */}
        <div className='flex items-center gap-2 text-xs text-gray-400'>
          <span className='inline-flex h-5 w-5 items-center justify-center rounded bg-gray-800/70 border border-gray-700'>
            ↕
          </span>
          Click on a heading to sort
        </div>
      </div>

      <div className='table-content rounded-2xl w-full md:p-5 overflow-y-hidden lg:overflow-x-auto custom-scrollbar2 min-h-full bg-slate-900 text-white'>
        <table className='w-full table-fixed' style={{ borderSpacing: '0 4px', borderCollapse: 'separate' }}>
          <colgroup>
            {filteredHeaders.map((header: any, key: number) => {
              const name = header.name as string;
              // Define fixed widths for each column to prevent shifting
              let width = '120px';
              if (name === 'Ticket') width = '100px';
              if (name === 'Open Time' || name === 'Close Time') width = '140px';
              if (name === 'Symbol') width = '130px';
              if (name === 'Type') width = '90px';
              if (name === 'Volume') width = '90px';
              if (name === 'Open Price' || name === 'Close Price') width = '100px';
              if (name === 'Profit') width = '110px';
              
              return <col key={key} style={{ width }} />;
            })}
            <col style={{ width: '100px' }} /> {/* Result column */}
          </colgroup>
          
          <thead>
            <tr className='relative'>
              {filteredHeaders.map((header: any, key: number) => {
                const name = header.name as string;
                const rightAligned =
                  name === 'Profit' ||
                  name === 'Pips' ||
                  name === 'Volume' ||
                  name === 'Open Price' ||
                  name === 'Close Price';

                const centerAligned = name === 'Type';

                const state = sortStateFor(name);

                return (
                  <th
                    key={key}
                    role='columnheader'
                    aria-sort={state}
                    className='px-4 py-3 pb-5 xl:px-3 whitespace-nowrap'
                  >
                    <button
                      type='button'
                      onClick={() => handleSort(name)}
                      title={`Sort by ${name}`}
                      className={`group flex items-center gap-1 w-full select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60 rounded
                        ${rightAligned ? 'justify-end text-right' : centerAligned ? 'justify-center text-center' : 'justify-start text-left'}`}
                    >
                      <span
                        className={`text-sm font-semibold uppercase tracking-wider ${
                          selectedFilters.length > 0 ? 'text-gray-400' : 'text-gray-300'
                        }`}
                      >
                        {name}
                      </span>
                      <span
                        aria-hidden='true'
                        className={`text-xs leading-none transition-all duration-200
                          ${state === 'none' ? 'opacity-40 group-hover:opacity-80 text-blue-400' : 'opacity-100 text-teal-400'}`}
                      >
                        {state === 'none' ? '↕' : state === 'ascending' ? '▲' : '▼'}
                      </span>
                    </button>
                  </th>
                );
              })}
              <th className='px-4 py-3 pb-5 xl:px-3 text-center'>
                <span className='text-sm font-semibold uppercase tracking-wider text-gray-300'>
                  Result
                </span>
              </th>
            </tr>
            <tr>
              <th colSpan={filteredHeaders.length + 1} className='p-0'>
                <div className='h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent w-full'></div>
              </th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={filteredHeaders.length} className='text-center py-8 text-gray-400'>
                  Sin resultados para “{search}”
                </td>
              </tr>
            ) : (
              records.map((_trade: any, index: number) => (
                <LineTrade {..._trade} key={index} setdisplayCardModal={() => {}} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='pagination-controls mt-5'>
        <div className='flex justify-start sm:justify-center items-center gap-2 w-full overflow-x-auto sm:overflow-visible whitespace-nowrap px-2'>
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className='hidden sm:inline-flex text-xl md:text-4xl px-2 py-1 text-gray-300 disabled:opacity-50'
          >
            «
          </button>

          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className='hidden sm:inline-flex text-xl md:text-4xl px-2 py-1 text-gray-300 disabled:opacity-50'
          >
            ‹
          </button>

          {getPaginationItems().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && setCurrentPage(page)}
              className={`
                flex-shrink-0 px-3 py-1 rounded-md text-sm md:text-xl
                ${
                  page === currentPage
                    ? 'bg-teal-500 text-white'
                    : page === '...'
                      ? 'cursor-default text-gray-300'
                      : 'text-gray-300 hover:bg-gray-700'
                }
              `}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className='hidden sm:inline-flex text-xl md:text-4xl px-2 py-1 text-gray-300 disabled:opacity-50'
          >
            ›
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className='hidden sm:inline-flex text-xl md:text-4xl px-2 py-1 text-gray-300 disabled:opacity-50'
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
