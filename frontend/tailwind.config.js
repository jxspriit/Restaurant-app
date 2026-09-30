/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#211D1A",
        cream: "#FAF6EF",
        copper: { DEFAULT: "#B5502D", dark: "#8F3E22", light: "#D97F5C" },
        olive: "#4B5320",
        gold: "#C99A4A",
        terracotta: "#EFDCC9",
        charcoal: "#3A342F",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(33,29,26,0.08)",
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
