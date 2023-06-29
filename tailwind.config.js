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
        herm: "Hermano Alto Stamp",
      },
      colors: {
        oscurazul: "#030D6B",
        fresa: "#B620E0",
        ama: "#FBDB86",
        leg: "#32C5FF",
        mod: "#6236FF",
        sol: "#FFC800",
      },
      height: {
        100: "36rem",
      },
      fontSize: {
        xxs: "0.5rem",
      },
      backgroundImage: {
        cross:
          "url('https://chromadin.infura-ipfs.io/ipfs/QmX7qQsdvNDRnqg7C3S2LLTcpeBB81cFsjzt6PdnK1kkkF')",
      },
    },
  },
  plugins: [],
};
