import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme types
type Theme = 'dark' | 'light' | 'auto';
type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'red';

// Theme context
interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  isDark: boolean;
  colors: ColorPalette;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Color palettes for different schemes
interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  border: {
    primary: string;
    secondary: string;
  };
  gradient: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const colorPalettes: Record<ColorScheme, ColorPalette> = {
  blue: {
    primary: 'blue-600',
    secondary: 'blue-500',
    accent: 'cyan-500',
    success: 'green-500',
    warning: 'yellow-500',
    error: 'red-500',
    info: 'blue-500',
    background: {
      primary: 'slate-900',
      secondary: 'slate-800',
      tertiary: 'slate-700',
    },
    text: {
      primary: 'white',
      secondary: 'slate-300',
      tertiary: 'slate-400',
    },
    border: {
      primary: 'slate-700',
      secondary: 'slate-600',
    },
    gradient: {
      primary: 'from-slate-800 to-slate-900',
      secondary: 'from-blue-600 to-blue-700',
      accent: 'from-cyan-500 to-blue-600',
    },
  },
  green: {
    primary: 'green-600',
    secondary: 'green-500',
    accent: 'emerald-500',
    success: 'green-500',
    warning: 'yellow-500',
    error: 'red-500',
    info: 'blue-500',
    background: {
      primary: 'slate-900',
      secondary: 'slate-800',
      tertiary: 'slate-700',
    },
    text: {
      primary: 'white',
      secondary: 'slate-300',
      tertiary: 'slate-400',
    },
    border: {
      primary: 'slate-700',
      secondary: 'slate-600',
    },
    gradient: {
      primary: 'from-slate-800 to-slate-900',
      secondary: 'from-green-600 to-green-700',
      accent: 'from-emerald-500 to-green-600',
    },
  },
  purple: {
    primary: 'purple-600',
    secondary: 'purple-500',
    accent: 'violet-500',
    success: 'green-500',
    warning: 'yellow-500',
    error: 'red-500',
    info: 'blue-500',
    background: {
      primary: 'slate-900',
      secondary: 'slate-800',
      tertiary: 'slate-700',
    },
    text: {
      primary: 'white',
      secondary: 'slate-300',
      tertiary: 'slate-400',
    },
    border: {
      primary: 'slate-700',
      secondary: 'slate-600',
    },
    gradient: {
      primary: 'from-slate-800 to-slate-900',
      secondary: 'from-purple-600 to-purple-700',
      accent: 'from-violet-500 to-purple-600',
    },
  },
  orange: {
    primary: 'orange-600',
    secondary: 'orange-500',
    accent: 'amber-500',
    success: 'green-500',
    warning: 'yellow-500',
    error: 'red-500',
    info: 'blue-500',
    background: {
      primary: 'slate-900',
      secondary: 'slate-800',
      tertiary: 'slate-700',
    },
    text: {
      primary: 'white',
      secondary: 'slate-300',
      tertiary: 'slate-400',
    },
    border: {
      primary: 'slate-700',
      secondary: 'slate-600',
    },
    gradient: {
      primary: 'from-slate-800 to-slate-900',
      secondary: 'from-orange-600 to-orange-700',
      accent: 'from-amber-500 to-orange-600',
    },
  },
  red: {
    primary: 'red-600',
    secondary: 'red-500',
    accent: 'rose-500',
    success: 'green-500',
    warning: 'yellow-500',
    error: 'red-500',
    info: 'blue-500',
    background: {
      primary: 'slate-900',
      secondary: 'slate-800',
      tertiary: 'slate-700',
    },
    text: {
      primary: 'white',
      secondary: 'slate-300',
      tertiary: 'slate-400',
    },
    border: {
      primary: 'slate-700',
      secondary: 'slate-600',
    },
    gradient: {
      primary: 'from-slate-800 to-slate-900',
      secondary: 'from-red-600 to-red-700',
      accent: 'from-rose-500 to-red-600',
    },
  },
};

// Theme provider component
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: ColorScheme;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'dark',
  defaultColorScheme = 'blue',
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme);

  // Determine if dark mode is active
  const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Get current color palette
  const colors = colorPalettes[colorScheme];

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply color scheme classes
    Object.entries(colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--color-${key}`, `var(--${value})`);
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--color-${key}-${subKey}`, `var(--${subValue})`);
        });
      }
    });
  }, [isDark, colors]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        // Trigger re-render when system theme changes
        setTheme('auto');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    colorScheme,
    setTheme,
    setColorScheme,
    isDark,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme toggle component
export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'auto':
        return '🔄';
      default:
        return '🌙';
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'auto':
        return 'Auto';
      default:
        return 'Dark';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors duration-200 ${className}`}
      title={`Current theme: ${getLabel()}`}
    >
      <span className="text-lg">{getIcon()}</span>
      <span className="text-sm font-medium">{getLabel()}</span>
    </button>
  );
};

// Color scheme selector component
export const ColorSchemeSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { colorScheme, setColorScheme } = useTheme();

  const schemes: { key: ColorScheme; label: string; icon: string }[] = [
    { key: 'blue', label: 'Blue', icon: '🔵' },
    { key: 'green', label: 'Green', icon: '🟢' },
    { key: 'purple', label: 'Purple', icon: '🟣' },
    { key: 'orange', label: 'Orange', icon: '🟠' },
    { key: 'red', label: 'Red', icon: '🔴' },
  ];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {schemes.map((scheme) => (
        <button
          key={scheme.key}
          onClick={() => setColorScheme(scheme.key)}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            colorScheme === scheme.key
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
          }`}
          title={scheme.label}
        >
          <span className="text-lg">{scheme.icon}</span>
        </button>
      ))}
    </div>
  );
};

// Utility function to get theme-aware classes
const getThemeClasses = (baseClasses: string, theme: Theme, colors: ColorPalette): string => {
  const themeClasses = theme === 'dark' ? 'dark' : '';
  return `${baseClasses} ${themeClasses}`.trim();
};

// Predefined component styles
const componentStyles = {
  card: 'bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-lg',
  cardHover: 'hover:border-slate-600 transition-colors duration-200',
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200',
    success: 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200',
    error: 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200',
  },
  input: 'bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  badge: {
    success: 'bg-green-900/30 text-green-400 px-2 py-1 rounded-full text-xs font-medium',
    warning: 'bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium',
    error: 'bg-red-900/30 text-red-400 px-2 py-1 rounded-full text-xs font-medium',
    info: 'bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full text-xs font-medium',
  },
};
