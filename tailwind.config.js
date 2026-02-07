/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#eef4ff',
          100: '#dce8ff',
          200: '#bpd6ff', // typo fix: b9d6ff. I will calculate shades roughly based on the base color #1746A2
          // Using a tool or estimation for shades of #1746A2 (Cobalt Blue)
          // 50: #eff4fc, 100: #e2ebf8, 200: #cddbf0, 300: #abc3e5, 400: #81a4d8, 500: #5f86cc, 600: #4269bf, 700: #3354ad, 800: #1746A2 (Base), 900: #1e3a75, 950: #132448
          // Let's use the user's base as 800 or 600? Usually 500 or 600 is base. Let's make 600 the base #1746A2.
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#1746A2', // Base Cobalt Blue
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
          950: '#0f172a',
        },
        'secondary': {
          // Base #F27326 (Pumpkin Spice) as 600
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#F27326', // Base Pumpkin Spice
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        'neutral-bg': '#F9F8F6', // Bright Snow
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Amiri', 'serif'],
      },
    },
  },
  plugins: [],
}
