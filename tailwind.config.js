/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
      './storage/framework/views/*.php',
      './resources/views/**/*.blade.php',
      './resources/js/**/*.jsx',
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        },
        fontSize: {
          // Custom font sizes based on the dashboard requirements
          'heading': ['1.25rem', { lineHeight: '1.5rem' }], // 20px for main headings like "Dashboard"
          'section': ['1.125rem', { lineHeight: '1.375rem' }], // 18px for section titles like "Monthly Assets"
          'metric': ['1.75rem', { lineHeight: '2rem' }], // 28px for key metrics (large numbers)
          'metric-medium': ['1.5rem', { lineHeight: '1.75rem' }], // 24px for medium metrics
          'nav': ['0.9375rem', { lineHeight: '1.25rem' }], // 15px for navigation items
          'indicator': ['0.8125rem', { lineHeight: '1rem' }], // 13px for small indicator text like percentages
        },
      },
    },
    plugins: [require('daisyui')],
    daisyui: {
      themes: ["light"],
    },
  }