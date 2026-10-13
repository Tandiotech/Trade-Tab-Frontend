import React, { useEffect, useCallback, useState } from 'react';

// Keyboard shortcut interface
interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  description: string;
  action: () => void;
  category: string;
  disabled?: boolean;
}

// Keyboard shortcuts context
interface KeyboardShortcutsContextType {
  shortcuts: KeyboardShortcut[];
  registerShortcut: (shortcut: KeyboardShortcut) => void;
  unregisterShortcut: (key: string) => void;
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
}

const KeyboardShortcutsContext = React.createContext<KeyboardShortcutsContextType | undefined>(undefined);

// Keyboard shortcuts provider
interface KeyboardShortcutsProviderProps {
  children: React.ReactNode;
}

export const KeyboardShortcutsProvider: React.FC<KeyboardShortcutsProviderProps> = ({ children }) => {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    setShortcuts(prev => {
      const existing = prev.findIndex(s => s.key === shortcut.key);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = shortcut;
        return updated;
      }
      return [...prev, shortcut];
    });
  }, []);

  const unregisterShortcut = useCallback((key: string) => {
    setShortcuts(prev => prev.filter(s => s.key !== key));
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement ||
      (event.target as HTMLElement)?.contentEditable === 'true'
    ) {
      return;
    }

    const matchingShortcut = shortcuts.find(shortcut => {
      if (shortcut.disabled) return false;
      
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        !!shortcut.ctrlKey === event.ctrlKey &&
        !!shortcut.shiftKey === event.shiftKey &&
        !!shortcut.altKey === event.altKey &&
        !!shortcut.metaKey === event.metaKey
      );
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const value: KeyboardShortcutsContextType = {
    shortcuts,
    registerShortcut,
    unregisterShortcut,
    showHelp,
    setShowHelp,
  };

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
      <KeyboardShortcutsHelp />
    </KeyboardShortcutsContext.Provider>
  );
};

// Hook to use keyboard shortcuts
const useKeyboardShortcuts = (): KeyboardShortcutsContextType => {
  const context = React.useContext(KeyboardShortcutsContext);
  if (context === undefined) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');
  }
  return context;
};

// Keyboard shortcuts help modal
const KeyboardShortcutsHelp: React.FC = () => {
  const { shortcuts, showHelp, setShowHelp } = useKeyboardShortcuts();

  if (!showHelp) return null;

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  const formatKeyCombo = (shortcut: KeyboardShortcut): string => {
    const parts: string[] = [];
    
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.altKey) parts.push('Alt');
    if (shortcut.shiftKey) parts.push('Shift');
    if (shortcut.metaKey) parts.push('Cmd');
    
    parts.push(shortcut.key.toUpperCase());
    
    return parts.join(' + ');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white">Keyboard Shortcuts</h3>
          <button
            onClick={() => setShowHelp(false)}
            className="text-slate-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category} className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">{category}</h4>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">{shortcut.description}</span>
                    <kbd className={`px-2 py-1 bg-slate-600 text-slate-200 rounded text-sm font-mono ${
                      shortcut.disabled ? 'opacity-50' : ''
                    }`}>
                      {formatKeyCombo(shortcut)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {shortcuts.length === 0 && (
            <div className="text-center text-slate-400 py-8">
              No keyboard shortcuts available
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-slate-700">
          <div className="text-sm text-slate-400 text-center">
            Press <kbd className="px-1 py-0.5 bg-slate-600 text-slate-200 rounded text-xs">Esc</kbd> to close
          </div>
        </div>
      </div>
    </div>
  );
};

// Trade page specific shortcuts hook
export const useTradePageShortcuts = () => {
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts();

  const registerTradeShortcuts = useCallback((actions: {
    onRefresh: () => void;
    onExport: () => void;
    onToggleFilters: () => void;
    onToggleView: (view: 'overview' | 'analytics' | 'history') => void;
    onShowHelp: () => void;
    onSearch: () => void;
    onClearFilters: () => void;
  }) => {
    // Navigation shortcuts
    registerShortcut({
      key: '1',
      description: 'Switch to Overview view',
      action: () => actions.onToggleView('overview'),
      category: 'Navigation',
    });

    registerShortcut({
      key: '2',
      description: 'Switch to Analytics view',
      action: () => actions.onToggleView('analytics'),
      category: 'Navigation',
    });

    registerShortcut({
      key: '3',
      description: 'Switch to History view',
      action: () => actions.onToggleView('history'),
      category: 'Navigation',
    });

    // Action shortcuts
    registerShortcut({
      key: 'r',
      ctrlKey: true,
      description: 'Refresh data',
      action: actions.onRefresh,
      category: 'Actions',
    });

    registerShortcut({
      key: 'e',
      ctrlKey: true,
      description: 'Export trades',
      action: actions.onExport,
      category: 'Actions',
    });

    registerShortcut({
      key: 'f',
      ctrlKey: true,
      description: 'Toggle filters',
      action: actions.onToggleFilters,
      category: 'Actions',
    });

    registerShortcut({
      key: '/',
      description: 'Focus search',
      action: actions.onSearch,
      category: 'Actions',
    });

    registerShortcut({
      key: 'Escape',
      description: 'Clear filters',
      action: actions.onClearFilters,
      category: 'Actions',
    });

    // Help shortcut
    registerShortcut({
      key: '?',
      description: 'Show keyboard shortcuts',
      action: actions.onShowHelp,
      category: 'Help',
    });

    registerShortcut({
      key: 'F1',
      description: 'Show keyboard shortcuts',
      action: actions.onShowHelp,
      category: 'Help',
    });
  }, [registerShortcut]);

  const unregisterTradeShortcuts = useCallback(() => {
    const keys = ['1', '2', '3', 'r', 'e', 'f', '/', 'Escape', '?', 'F1'];
    keys.forEach(key => unregisterShortcut(key));
  }, [unregisterShortcut]);

  return {
    registerTradeShortcuts,
    unregisterTradeShortcuts,
  };
};

// Global keyboard shortcuts hook
const useGlobalShortcuts = () => {
  const { registerShortcut, unregisterShortcut, setShowHelp } = useKeyboardShortcuts();

  const registerGlobalShortcuts = useCallback(() => {
    // Global help shortcut
    registerShortcut({
      key: '?',
      ctrlKey: true,
      description: 'Show keyboard shortcuts',
      action: () => setShowHelp(true),
      category: 'Global',
    });

    // Global escape to close modals
    registerShortcut({
      key: 'Escape',
      description: 'Close modal/dialog',
      action: () => {
        // This would be handled by individual components
        // but we can provide a global escape handler
        const modals = document.querySelectorAll('[data-modal]');
        if (modals.length > 0) {
          const lastModal = modals[modals.length - 1] as HTMLElement;
          const closeButton = lastModal.querySelector('[data-modal-close]') as HTMLElement;
          if (closeButton) {
            closeButton.click();
          }
        }
      },
      category: 'Global',
    });
  }, [registerShortcut, setShowHelp]);

  const unregisterGlobalShortcuts = useCallback(() => {
    unregisterShortcut('?');
    unregisterShortcut('Escape');
  }, [unregisterShortcut]);

  return {
    registerGlobalShortcuts,
    unregisterGlobalShortcuts,
  };
};

// Keyboard shortcut indicator component
interface ShortcutIndicatorProps {
  shortcut: string;
  className?: string;
}

const ShortcutIndicator: React.FC<ShortcutIndicatorProps> = ({ 
  shortcut, 
  className = '' 
}) => {
  const formatShortcut = (shortcut: string): string[] => {
    return shortcut.split('+').map(key => key.trim());
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {formatShortcut(shortcut).map((key, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-slate-400">+</span>}
          <kbd className="px-1.5 py-0.5 bg-slate-600 text-slate-200 rounded text-xs font-mono">
            {key}
          </kbd>
        </React.Fragment>
      ))}
    </div>
  );
};

// Keyboard shortcut button component
interface ShortcutButtonProps {
  onClick: () => void;
  shortcut: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const ShortcutButton: React.FC<ShortcutButtonProps> = ({
  onClick,
  shortcut,
  children,
  className = '',
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative group ${className}`}
    >
      {children}
      <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <ShortcutIndicator shortcut={shortcut} />
      </div>
    </button>
  );
};
