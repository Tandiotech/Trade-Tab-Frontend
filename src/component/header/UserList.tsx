import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { http } from '@/utils/http_request';

interface IUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  name?: string;
  email: string;
  country?: string;
  rol: number;
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export default function UsersList() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchUsers = useCallback(
    async (pageNum = 1, searchTerm = '') => {
      try {
        setLoading(true);

        const res = await http.get('/user', {
          params: { page: pageNum, limit: 10, search: searchTerm },
        });

        if (res.data.status === 200) {
          setUsers(res.data.users);
          setPagination(res.data.pagination);
          setPage(res.data.pagination.currentPage);
          setLastFetchedAt(Date.now());
        }
      } catch (error: any) {
        console.error('Error fetching users:', error);
        const status = error.response?.status;
        if (status === 403) {
          toast.error('You do not have permission to access this page');
          navigate('/');
        } else if (status === 401) {
          toast.error('Session expired, please log in again');
          navigate('/login');
        } else {
          toast.error('Unexpected error loading users');
        }
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchUsers(page, debouncedSearch);
  }, [page, debouncedSearch, fetchUsers]);

  const handleSearchInputChange = (value: string) => {
    if (page !== 1) setPage(1);
    setSearch(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    setDebouncedSearch(trimmed);
    if (page !== 1) setPage(1);
    else fetchUsers(1, trimmed);
  };

  const handlePageChange = (newPage: number) => {
    if (!pagination) return;
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
  };

  const handleImpersonate = async (userId: string) => {
    try {
      const res = await http.post(`/auth/impersonate/${userId}`);
      if (res.data.status === 200) {
        const { token, user } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        toast.success(`Now logged in as ${user.email}`);
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    } catch (error: any) {
      console.error('Error impersonating user:', error);
      toast.error(error.response?.data?.message ?? 'Failed to impersonate user');
    }
  };

  const handleRefresh = () => {
    fetchUsers(page, debouncedSearch);
  };

  const handleClearSearch = () => {
    setSearch('');
    setDebouncedSearch('');
    setPage(1);
  };

  const totalUsers = useMemo(() => pagination?.totalUsers ?? 0, [pagination]);

  const formattedLastFetch = useMemo(() => {
    if (!lastFetchedAt) return null;
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(lastFetchedAt);
  }, [lastFetchedAt]);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(value));

  const renderSkeletonRows = () =>
    Array.from({ length: users.length ? Math.min(users.length, 5) : 5 }).map((_, idx) => (
      <tr key={`skeleton-${idx}`} className='animate-pulse'>
        <td className='px-4 py-3'>
          <div className='h-3.5 w-32 rounded bg-slate-800/80' />
        </td>
        <td className='px-4 py-3'>
          <div className='h-3.5 w-40 rounded bg-slate-800/80' />
        </td>
        <td className='px-4 py-3'>
          <div className='h-3.5 w-24 rounded bg-slate-800/80' />
        </td>
        <td className='px-4 py-3'>
          <div className='h-5 w-16 rounded-full bg-slate-800/80' />
        </td>
        <td className='px-4 py-3'>
          <div className='h-3.5 w-24 rounded bg-slate-800/80' />
        </td>
        <td className='px-4 py-3'>
          <div className='h-8 w-20 rounded-md bg-slate-800/80' />
        </td>
      </tr>
    ));

  return (
    <section className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100 space-y-8'>
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-semibold tracking-tight text-white'>Users</h1>
          <p className='text-sm text-slate-400'>
            Browse and manage every account registered on the platform.
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-400'>
          {formattedLastFetch && (
            <span className='flex items-center gap-1 rounded-full bg-slate-800/60 px-3 py-1'>
              <span className='inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400' />
              Updated at {formattedLastFetch}
            </span>
          )}
          <button
            onClick={handleRefresh}
            type='button'
            className='inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1.5 text-slate-300 transition hover:border-blue-500/60 hover:text-white'
          >
            <span className={`h-1.5 w-1.5 rounded-full ${loading ? 'bg-blue-500 animate-pulse' : 'bg-slate-500'}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <div className='rounded-xl border border-slate-800 bg-slate-900/60 p-5'>
          <p className='text-xs uppercase tracking-wide text-slate-500'>Total users</p>
          <p className='mt-2 text-2xl font-semibold text-white'>
            {Intl.NumberFormat().format(totalUsers)}
          </p>
        </div>
        <div className='rounded-xl border border-slate-800 bg-slate-900/60 p-5'>
          <p className='text-xs uppercase tracking-wide text-slate-500'>Current page</p>
          <p className='mt-2 text-lg font-medium text-white'>
            {pagination ? `${pagination.currentPage} / ${pagination.totalPages}` : '—'}
          </p>
        </div>
        <div className='rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:col-span-2 lg:col-span-1'>
          <p className='text-xs uppercase tracking-wide text-slate-500'>Showing</p>
          <p className='mt-2 text-lg font-medium text-white'>
            {users.length ? `${users.length} users on this page` : 'No users loaded'}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSearch}
        className='flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4 sm:flex-row sm:items-center sm:justify-between'
      >
        <label className='flex flex-1 items-center gap-2 rounded-lg border border-transparent bg-slate-950/60 px-3 py-2 transition focus-within:border-blue-500/60'>
          <svg
            aria-hidden='true'
            width='16'
            height='16'
            viewBox='0 0 20 20'
            fill='none'
            className='text-slate-500'
          >
            <path
              d='M9 3.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm6.53 11.47L17.5 16'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
            />
          </svg>
          <input
            type='search'
            placeholder='Search by name or email'
            value={search}
            onChange={e => handleSearchInputChange(e.target.value)}
            className='flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none'
            aria-label='Search users by name or email'
          />
          {search && (
            <button
              type='button'
              onClick={handleClearSearch}
              className='rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white'
            >
              Clear
            </button>
          )}
        </label>

        <div className='flex items-center gap-2'>
          <button
            type='submit'
            className='inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
          >
            Apply
          </button>
        </div>
      </form>

      <div className='overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60 shadow-lg shadow-black/20'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-slate-800'>
            <thead className='bg-slate-900/80 text-xs uppercase tracking-wide text-slate-500'>
              <tr>
                <th className='px-4 py-3 text-left font-medium'>Name</th>
                <th className='px-4 py-3 text-left font-medium'>Email</th>
                <th className='px-4 py-3 text-left font-medium'>Country</th>
                <th className='px-4 py-3 text-left font-medium'>Role</th>
                <th className='px-4 py-3 text-left font-medium'>Created</th>
                <th className='px-4 py-3 text-left font-medium'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-900'>
              {loading && renderSkeletonRows()}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={6} className='px-6 py-16 text-center text-sm text-slate-500'>
                    <div className='mx-auto flex max-w-xs flex-col items-center gap-3'>
                      <svg
                        width='48'
                        height='48'
                        viewBox='0 0 24 24'
                        fill='none'
                        className='text-slate-700'
                        aria-hidden='true'
                      >
                        <path
                          d='M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM21 21a8.966 8.966 0 0 0-6-3.339M9 17.661A8.966 8.966 0 0 0 3 21'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      <p className='text-base font-medium text-slate-300'>No users match the filters</p>
                      <p className='text-xs text-slate-500'>
                        Try adjusting your search or clearing filters to see more results.
                      </p>
                      <button
                        type='button'
                        onClick={handleClearSearch}
                        className='mt-2 rounded-lg border border-slate-700/70 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-blue-500/60 hover:text-white'
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {!loading &&
                users.map(u => (
                  <tr key={u._id} className='transition hover:bg-slate-900/40'>
                    <td className='px-4 py-3 text-sm font-medium text-white'>
                      {u.name || `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || '—'}
                    </td>
                    <td className='px-4 py-3 text-sm text-slate-300'>{u.email}</td>
                    <td className='px-4 py-3 text-sm text-slate-400'>{u.country || '—'}</td>
                    <td className='px-4 py-3'>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          u.rol === 1
                            ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/40'
                            : 'bg-slate-800/80 text-slate-300 ring-1 ring-inset ring-slate-700/60'
                        }`}
                      >
                        {u.rol === 1 ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-sm text-slate-400'>{formatDate(u.createdAt)}</td>
                    <td className='px-4 py-3 text-sm'>
                      <button
                        onClick={() => handleImpersonate(u._id)}
                        className='inline-flex items-center justify-center rounded-lg border border-blue-500/40 bg-blue-600/80 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400'
                      >
                        Login as
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className='flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-4 text-sm text-slate-300 sm:flex-row'>
          <div className='flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500'>
            <span>Page</span>
            <span className='rounded-md bg-slate-800 px-2 py-1 font-semibold text-white'>
              {pagination.currentPage}
            </span>
            <span className='text-slate-600'>of</span>
            <span className='rounded-md bg-slate-800 px-2 py-1 font-semibold text-white'>
              {pagination.totalPages}
            </span>
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                page === 1
                  ? 'cursor-not-allowed bg-slate-800/60 text-slate-500'
                  : 'bg-slate-800/80 text-white hover:bg-slate-700'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                page === pagination.totalPages
                  ? 'cursor-not-allowed bg-slate-800/60 text-slate-500'
                  : 'bg-slate-800/80 text-white hover:bg-slate-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
