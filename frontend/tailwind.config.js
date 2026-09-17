/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--accent)',
        surface: 'var(--bg-surface)',
        sidebar: 'var(--bg-sidebar)',
        card: 'var(--bg-card)',
        elevated: 'var(--bg-elevated)',
        border: 'var(--border-color)',
        brand: {
          magenta: 'var(--brand-magenta)',
          pink: 'var(--brand-pink)',
          rose: 'var(--brand-rose)',
        },
        'accent-green': 'var(--accent-green)',
        'accent-blue': 'var(--accent-blue)',
        'accent-red': 'var(--accent-red)',
        'accent-yellow': 'var(--accent-yellow)',
        'accent-purple': 'var(--accent-purple)',
        'info-bg': 'var(--info-bg)',
        'success-bg': 'var(--success-bg)',
        'warning-bg': 'var(--warning-bg)',
        'danger-bg': 'var(--danger-bg)',
        'danger-text': 'var(--danger-text)',
        'success-text': 'var(--success-text)',
        'warning-text': 'var(--warning-text)',
        'info-text': 'var(--info-text)',
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
