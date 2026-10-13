export type JobLocation = {
  city: string;
  country: string;
  coords: [number, number];
};

export type JobsCareersVariant = 'public' | 'inApp';

export type SelectedJobLocation = {
  city: string;
  country: string;
};

export function formatJobLocation(loc: SelectedJobLocation | null): string {
  if (!loc) return 'Global (Remote)';
  if (loc.city === 'Global (Remote)') return loc.city;
  return `${loc.city}, ${loc.country}`;
}
