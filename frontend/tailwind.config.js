/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        ink: "#0f172a",
        mist: "#f8fafc",
        glow: "#f97316",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.16)",
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.15), transparent 35%), radial-gradient(circle at 80% 0%, rgba(249,115,22,0.14), transparent 24%), linear-gradient(135deg, rgba(248,250,252,1), rgba(240,253,250,1))",
        "mesh-dark":
          "radial-gradient(circle at 0% 0%, rgba(16,185,129,0.18), transparent 32%), radial-gradient(circle at 100% 10%, rgba(249,115,22,0.16), transparent 20%), linear-gradient(135deg, rgba(2,6,23,1), rgba(15,23,42,1))",
      },
    },
  },
  plugins: [],
};
