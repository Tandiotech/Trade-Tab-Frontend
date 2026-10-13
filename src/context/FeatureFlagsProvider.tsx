// src/context/FeatureFlagsProvider.tsx
import { createContext, useContext } from 'react';
import { resolveEditionFlags, Feature } from '@/config/featureFlags';

type Ctx = { has: (f: Feature) => boolean; all: Set<Feature> };
const FeatureCtx = createContext<Ctx>({ has: () => false, all: new Set() });


export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  const edition = (import.meta.env.VITE_APP_EDITION as 'pro' | 'standard') || 'standard';
  const flags = resolveEditionFlags(edition);

  return (
    <FeatureCtx.Provider value={{ has: f => flags.has(f), all: flags }}>
      {children}
    </FeatureCtx.Provider>
  );
}
const useFeatures = () => useContext(FeatureCtx);
