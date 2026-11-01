/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#635BFF',
          50: '#F0EFFF',
          100: '#E0DEFF',
          200: '#C2BCFF',
          300: '#A39BFF',
          400: '#8479FF',
          500: '#635BFF',
          600: '#4A42E8',
          700: '#352CCC',
          800: '#2118A8',
          900: '#100A7A',
        },
        navy: {
          DEFAULT: '#151A2D',
          light: '#1E2640',
          dark: '#0E1020',
        },
        secondary: '#8B90A5',
        lavender: {
          DEFAULT: '#EEF0FF',
          dark: '#DDE0FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #635BFF 0%, #8B5CF6 100%)',
        'gradient-card': 'linear-gradient(135deg, #F7F8FC 0%, #EEF0FF 100%)',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(99, 91, 255, 0.08)',
        'card-hover': '0 8px 30px rgba(99, 91, 255, 0.15)',
        'nav': '0 1px 0 rgba(0,0,0,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
