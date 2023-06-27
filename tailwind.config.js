/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mega: "Megamax Jones",
        monu: "Monument Regular",
        aqua: "Aquatico Regular",
        sat: "Satoshi Regular",
        satB: "Satoshi Black",
      },
      colors: {
        oscurazul: "#030D6B",
        fresa: "#B620E0",
        ama: "#FBDB86"
      },
      height: {
        100: "36rem"
      }
    },
  },
  plugins: [],
};
