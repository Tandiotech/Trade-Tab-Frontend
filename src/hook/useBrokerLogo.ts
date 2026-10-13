import { useState, useCallback, useMemo, useEffect } from 'react';
import { getLogoDevUrl } from '../utils/logoDev';
import { resolveDbLogoUrl } from '../utils/brokerLogoUrl';
import { getPartnerBrokerLogoUrl } from '../utils/brokerPartnerLogo';

interface UseBrokerLogoOptions {
  dbLogo?: string | null;
  website?: string | null;
  fallback?: string;
  /** Name, abbreviation, slug — used to pick /assets/img/partners/*.png */
  partnerLookupStrings?: (string | null | undefined)[];
}

function uniqUrls(urls: (string | null | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of urls) {
    if (!u) continue;
    if (seen.has(u)) continue;
    seen.add(u);
    out.push(u);
  }
  return out;
}

/**
 * Logo resolution chain:
 * 1) DB URL (absolute, or prefixed with API base if relative)
 * 2) Known partner PNG under /public/assets/img/partners/
 * 3) Logo.dev (requires VITE_LOGO_DEV_PUBLIC_KEY)
 * 4) fallback (default /logo.png)
 */
export function useBrokerLogo({
  dbLogo,
  website,
  fallback = '/logo.png',
  partnerLookupStrings,
}: UseBrokerLogoOptions) {
  const logoDevUrl = useMemo(() => getLogoDevUrl(website), [website]);

  const partnerUrl = useMemo(
    () => getPartnerBrokerLogoUrl(...(partnerLookupStrings ?? [])),
    [JSON.stringify(partnerLookupStrings ?? [])],
  );

  const candidates = useMemo(
    () =>
      uniqUrls([
        resolveDbLogoUrl(dbLogo),
        partnerUrl,
        logoDevUrl,
      ]),
    [dbLogo, partnerUrl, logoDevUrl],
  );

  const fingerprint = candidates.join('|');

  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [fingerprint]);

  const logoSrc = useMemo(
    () =>
      candidateIndex < candidates.length
        ? candidates[candidateIndex]!
        : fallback,
    [candidateIndex, candidates, fallback],
  );

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const img = e.currentTarget;
      img.onerror = null;
      setCandidateIndex(i => (i < candidates.length ? i + 1 : i));
    },
    [candidates],
  );

  return {
    logoSrc,
    handleError,
    isLoading: candidateIndex < candidates.length && logoSrc !== fallback,
  };
}
