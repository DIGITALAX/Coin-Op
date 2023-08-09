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
        mana: "Manaspace",
      },
      colors: {
        oscurazul: "#030D6B",
        fresa: "#B620E0",
        ama: "#FBDB86",
        leg: "#32C5FF",
        mod: "#6236FF",
        sol: "#FFC800",
        azul: "#2A36F6",
        eme: "#6DD400",
        smo: "#32C5FF",
        gris: "#6D7278",
        ligero: "#E5F0D4",
      },
      height: {
        100: "36rem",
        110: "38rem",
        120: "50rem",
        130: "55rem",
        150: "70rem",
        160: "95rem"
      },
      width: {
        100: "30rem",
        calc: "calc(100vw - 20rem - 20rem - 1rem)",
        calc2: "calc(100vw - 10rem)",
        calc3: "calc(100vw)"
      },
      fontSize: {
        xxs: "0.5rem",
      },
      zIndex: {
        1: 1,
        2: 2,
      },
      backgroundImage: {
        cross:
          "url('https://chromadin.infura-ipfs.io/ipfs/QmPKU1ck9PLyFchFpe2vzJh3eyxSYij28ixTdRzaHi4E1p')",
      },
      screens: {
        preG: "480px",
        synth: "1450px",
        900: "900px"
      },
    },
  },
  plugins: [],
};
