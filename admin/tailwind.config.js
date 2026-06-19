/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: "#c9a84c", light: "#e8d5a3", dark: "#a0802c" },
        dark: { DEFAULT: "#0e0c0a", 2: "#1a1612", 3: "#252018" },
        cream: "#f5f0e8",
        "text-muted": "#9a8a6a",
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        trebuchet: [
          '"Trebuchet MS"',
          '"TrebuchetMS"',
          '"TrebuchetMS-Bold"',
          '"Trebuchet MS Bold"',
          '"TrebuchetMS-Italic"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
