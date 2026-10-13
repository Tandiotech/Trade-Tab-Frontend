// src/config/featureFlags.ts
export type Feature =
  | 'basicChart'
  | 'advancedChart'
  | 'ButtonUpdateEquity'
  | 'publicProfiles'
  | 'prioritySync'
  | 'multiAccounts';

export function resolveEditionFlags(edition: 'pro' | 'standard'): Set<Feature> {
  return new Set(
    edition === 'pro'
      ? ['basicChart', 'advancedChart', 'ButtonUpdateEquity', 'publicProfiles']
      : ['basicChart']
  );
}
