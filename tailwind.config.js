/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: {
          950: '#07090d',
          900: '#0b0e14',
          800: '#11151c',
          700: '#1a1f29',
          600: '#272d3a'
        },
        accent: {
          400: '#7c9cff',
          500: '#5b7cfa',
          600: '#4866e6'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(124,156,255,0.25), 0 12px 40px -10px rgba(91,124,250,0.4)',
        soft: '0 4px 24px -4px rgba(0,0,0,0.4)'
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1)',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        pulseSoft: {
          '0%,100%': { opacity: 0.6 },
          '50%': { opacity: 1 }
        }
      }
    }
  },
  plugins: []
};