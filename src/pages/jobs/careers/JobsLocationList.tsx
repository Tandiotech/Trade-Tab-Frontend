import { useMemo, useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import type { JobLocation, SelectedJobLocation } from './jobsCareers.types';

type Props = {
  locations: JobLocation[];
  selected: SelectedJobLocation | null;
  onSelect: (location: SelectedJobLocation) => void;
};

export function JobsLocationList({ locations, selected, onSelect }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter(
      loc =>
        loc.city.toLowerCase().includes(q) ||
        loc.country.toLowerCase().includes(q)
    );
  }, [locations, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, JobLocation[]>();
    for (const loc of filtered) {
      const list = map.get(loc.country) ?? [];
      list.push(loc);
      map.set(loc.country, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const isSelected = (loc: JobLocation) =>
    selected?.city === loc.city && selected?.country === loc.country;

  return (
    <div className='tt-careers-location-list flex flex-col gap-3'>
      <div className='relative'>
        <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tt-fg-3)]' />
        <input
          type='search'
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='Search city or country…'
          className='tt-careers-input w-full py-2.5 pl-10 pr-3 text-sm'
          aria-label='Search locations'
        />
      </div>
      <div className='tt-careers-location-list__scroll min-h-0 flex-1 overflow-y-auto'>
        <button
          type='button'
          onClick={() => onSelect({ city: 'Global (Remote)', country: 'Remote' })}
          className={`mb-2 flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
            selected?.city === 'Global (Remote)'
              ? 'border-[var(--tt-brand)] bg-[var(--tt-brand-dim)] text-[var(--tt-fg-0)]'
              : 'border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] text-[var(--tt-fg-1)] hover:border-[var(--tt-line-2)]'
          }`}
        >
          <MapPin className='h-4 w-4 shrink-0 text-[var(--tt-brand)]' />
          Global (Remote)
        </button>
        {grouped.length === 0 ? (
          <p className='py-4 text-center text-sm text-[var(--tt-fg-3)]'>No locations match your search.</p>
        ) : (
          grouped.map(([country, cities]) => (
            <div key={country} className='mb-3'>
              <p className='mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--tt-fg-3)]'>
                {country}
              </p>
              <ul className='space-y-1'>
                {cities.map(loc => (
                  <li key={`${loc.city}-${loc.country}`}>
                    <button
                      type='button'
                      onClick={() => onSelect({ city: loc.city, country: loc.country })}
                      className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                        isSelected(loc)
                          ? 'border-[var(--tt-brand)] bg-[var(--tt-brand-dim)] text-[var(--tt-fg-0)]'
                          : 'border-transparent bg-[var(--tt-bg-1)] text-[var(--tt-fg-1)] hover:border-[var(--tt-line-1)] hover:bg-[var(--tt-bg-2)]'
                      }`}
                    >
                      <MapPin className='h-3.5 w-3.5 shrink-0 text-[var(--tt-brand)]' />
                      {loc.city}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
