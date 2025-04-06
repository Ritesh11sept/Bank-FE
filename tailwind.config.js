/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'scale-in': 'scaleIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out 0.3s both',
        'pulse-slow': 'pulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '70%': { transform: 'scale(1.8)' },
          '100%': { opacity: '1', transform: 'scale(1.5)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%': { transform: 'translate(-50%, -50%) scale(1)' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.2)' },
          '100%': { transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at center, transparent 0%, rgba(16,185,129,0.3) 100%)',
      },
    },
  },
  plugins: [],
}