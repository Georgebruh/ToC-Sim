/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0b0b0f',
        primary: '#8b5cf6',
        'primary-dim': '#a78bfa',
        'on-primary': '#f5f3ff',
        secondary: '#22d3ee',
        'secondary-dim': '#67e8f9',
        surface: '#15151c',
        'surface-container-lowest': '#121218',
        'surface-container-low': '#171821',
        'surface-container': '#1d1f29',
        'surface-container-high': '#252836',
        'surface-container-highest': '#2f3444',
        'on-surface': '#f3f4f6',
        'on-surface-variant': '#acaaae',
        'outline-variant': '#48474b',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

