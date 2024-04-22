/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      textColor: {
        primary: "#eaebec",
        secondary: "#eaebec80",
        gray: "#eaebec50",
      },
      borderColor: {
        "gray-black": "#1A1A1A",
      },
    },
  },
  plugins: [],
};
