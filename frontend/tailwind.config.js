/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"   // This ensures all React files are scanned
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
