/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#4f46e5',
        accent: '#8b5cf6',
        background: '#0f172a',
        card: 'rgba(30, 41, 59, 0.7)',
        long: '#10b981',
        short: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-long': '0 0 5px #10b981, 0 0 20px rgba(16, 185, 129, 0.3)',
        'neon-short': '0 0 5px #ef4444, 0 0 20px rgba(239, 68, 68, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
