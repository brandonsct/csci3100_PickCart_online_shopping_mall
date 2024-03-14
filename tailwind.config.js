/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        100: "100px",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
