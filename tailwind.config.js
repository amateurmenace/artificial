/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#3d5a4c',
          light: '#4a6b5a',
          dark: '#2d4a3c',
        },
        sage: {
          DEFAULT: '#48a89a',
          light: '#5bc4b4',
          dark: '#3a8a7e',
        },
        cream: {
          DEFAULT: '#f5f3ef',
          dark: '#e2e0dc',
        },
        gold: {
          DEFAULT: '#d4a84b',
          dark: '#c49a3a',
          light: '#e4b85b',
        },
        coral: '#6b8cce',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Space Mono', 'Fira Code', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'game': '0 4px 20px rgba(61, 90, 76, 0.15)',
        'game-hover': '0 8px 30px rgba(61, 90, 76, 0.25)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-soft': 'bounce 0.6s ease-in-out',
      },
    },
  },
  plugins: [],
}
