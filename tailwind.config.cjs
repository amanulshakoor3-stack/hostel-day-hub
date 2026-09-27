/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        festival: {
          purple: {
            950: '#1a0b36',
            900: '#2e1065',
            800: '#4c1d95',
            700: '#6d28d9',
            600: '#7c3aed',
            500: '#8b5cf6',
            100: '#ede9fe',
            50: '#f5f3ff',
          },
          blue: {
            950: '#0b193d',
            900: '#172554',
            800: '#1e40af',
            700: '#1d4ed8',
            600: '#2563eb',
            500: '#3b82f6',
            100: '#dbeafe',
            50: '#eff6ff',
          },
          orange: {
            900: '#7c2d12',
            800: '#9a3412',
            700: '#c2410c',
            600: '#ea580c',
            500: '#f97316',
            400: '#fb923c',
            300: '#fdba74',
            100: '#ffedd5',
            50: '#fff7ed',
          },
          cream: {
            50: '#fffdfa',
            100: '#fef8ee',
            200: '#fdf2db',
            300: '#fae5be',
            400: '#f5d39a',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 0.9, transform: 'scale(1.05)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
}
