/** @type {import('tailwindcss').Config} */

import formsPlugin from '@tailwindcss/forms';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// import { opacity } from 'html2canvas/dist/types/css/property-descriptors/opacity';
// import { boxShadow } from 'html2canvas/dist/types/css/property-descriptors/box-shadow';
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Busca solo en los archivos dentro de 'src' y subdirectorios
  ],
  darkMode: ['class', 'class'],
  theme: {
    extend: {
      screens: {
        'screens-640': '640px',
        'screens-1200': '1200px',
      },
      animation: {
        border: 'border 4s linear infinite',
      },
      keyframes: {
        border: {
          to: { '--border-angle': '360deg' },
        },
      },
      scrollBehavior: ['smooth'],
      listStyleImage: {
        Listimage: 'url("./src/assets/images/logo/oficial/logo-short-white.svg")',
      },
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      width: {
        30: '30%',
        35: '35%',
        40: '40%',
        44: '44%',
        66: '66%',
        70: '70%',
        88: '88%',
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
        '5xl': '48px',
      },
      boxShadow: {
        green: '0px 0px 40px 10px #27DD654D',
      },
      colors: {
        tradetab: {
          lime: '#4FB982',
          purple: '#2B2933',
        },
        navbar: {
          900: '000000',
        },
        darkblack: {
          300: '#747681',
          400: '#2A313C',
          500: '#23262B',
          600: '#1D1E24',
          700: '#14101E',
          800: '#151925',
        },
        native: {
          100: '#59C28B',
        },
        purple: {
          400: '#2B2935',
          450: '#3C325D',
          500: '#14101E',
          600: '#2C2D33',
        },
        success: {
          50: '#fba726',
          100: '#ea991d',
          200: '#d98b13',
          300: 'silver',
          400: '#59C28B',
        },
        warning: {
          100: '#FDE047',
          200: '#FACC15',
          300: '#EAB308',
        },
        error: {
          50: '#FCDEDE',
          100: '#FF7171',
          200: '#FF4747',
          300: '#DD3333',
        },
        bgray: {
          50: '#FAFAFA',
          100: '#F7FAFC',
          200: '#EDF2F7',
          300: '#E2E8F0',
          400: '#CBD5E0',
          500: '#A0AEC0',
          600: '#718096',
          700: '#4A5568',
          800: '#2D3748',
          900: '#1A202C',
        },
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        bamber: {
          50: '#FFFBEB',
          100: '#FFC837',
          500: '#F6A723',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      backgroundImage: {
        'bgc-dark': `url('./src/assets/images/background/comming-soon-dark.svg')`,
        'bgc-light': `url('./src/assets/images/background/coming-soon-bg.svg')`,
        'notfound-dark': `url('./src/assets/images/background/404-dark.jpg')`,
        login: `url('/assets/img/bg/login_bg.png')`,
      },

      animation: {
        pulse_bg: 'Pulsebg 3s linear infinite',
        PulseCalendarbg: 'Pulsebg 3s linear infinite',
        typing: 'typing 2s steps(20)  alternate, blink .7s ',
        glow: 'glow 2s linear infinite',
        glow_dark: 'glow-dark 2s linear infinite',
        pulse_bg_Delete: 'PulsebgRed 3s linear infinite',
        epic_entry: 'epic_entry 1s linear ease-in-out',
      },
      keyframes: {
        Pulsebg: {
          '0%, 100%': {
            background: '#1D1E24',
          },
          '50%': {
            background: '#2A313C',
          },
        },
        PulsebgRed: {
          '0%, 100%': {
            background: '#dc2626',
          },
          '25%': {
            background: '#d63c3c',
          },
          '75%': {
            background: '#c91818',
          },
          '50%': {
            background: '#b91c1c',
          },
        },
        PulseCalendarbg: {
          '0%, 100%': {
            background: '#151515',
          },
          '50%': {
            background: '#2A313C',
          },
        },
        epic_entry: {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
            width: '100%',
          },
        },
        typing: {
          '0%': {
            width: '0%',
            visibility: 'hidden',
          },
          '100%': {
            width: '100%',
          },
        },
        blink: {
          '50%': {
            borderColor: 'transparent',
          },
          '100%': {
            borderColor: 'white',
          },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(0, 155, 255, 0.7)',
          },
          '50%': {
            boxShadow: '0 0 10px rgba(0, 255, 155, 0)',
          },
        },
        glow_dark: {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)',
          },
          '50%': {
            boxShadow: '0 0 10px rgba(0, 0, 0, 0)',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [formsPlugin, require('tailwindcss-animate')],
};
