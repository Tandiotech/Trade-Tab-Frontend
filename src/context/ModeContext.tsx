import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type AppMode = 'real' | 'example';

interface ModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isExampleMode: boolean;
  isRealMode: boolean;
  canAccessFeature: (requiresAccount: boolean) => boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

const MODE_STORAGE_KEY = 'tradetab_app_mode';

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(() => {
    // Load from localStorage or default to 'real'
    const saved = localStorage.getItem(MODE_STORAGE_KEY);
    return (saved === 'example' || saved === 'real') ? saved : 'real';
  });

  const setMode = useCallback((newMode: AppMode) => {
    setModeState(newMode);
    localStorage.setItem(MODE_STORAGE_KEY, newMode);
  }, []);

  // Check if a feature can be accessed based on mode and account requirement
  const canAccessFeature = useCallback((requiresAccount: boolean) => {
    if (!requiresAccount) return true; // Feature doesn't require account
    if (mode === 'example') return true; // Example mode allows all features
    // In real mode, feature requires account (will be checked by pages/components)
    return true; // Pages will handle the actual account check
  }, [mode]);

  const value: ModeContextType = {
    mode,
    setMode,
    isExampleMode: mode === 'example',
    isRealMode: mode === 'real',
    canAccessFeature,
  };

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}

