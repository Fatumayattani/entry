/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'entry-teal': {
          DEFAULT: '#2D9B9B',
          light: '#4DB8B8',
          dark: '#1F7070',
        },
        'entry-yellow': {
          DEFAULT: '#FFD700',
          light: '#FFE44D',
          dark: '#E6C200',
        },
        'entry-pink': {
          DEFAULT: '#FF69B4',
          light: '#FF8FC7',
          dark: '#FF4DA0',
        },
        'entry-blue': {
          DEFAULT: '#87CEEB',
          light: '#A5D9F0',
          dark: '#6BB8DC',
        },
        'entry-cream': '#F5F5F0',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
};
