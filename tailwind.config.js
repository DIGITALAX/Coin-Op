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
        vcr: "Vcr",
        bit: "Bitblox"
      },
      colors: {
        oscurazul: "#030D6B",
        fresa: "#B620E0",
        ama: "#FBDB86",
        moda: "#CFB0FA",
        leg: "#32C5FF",
        mod: "#6236FF",
        sol: "#FFC800",
        azul: "#2A36F6",
        eme: "#6DD400",
        smo: "#32C5FF",
        gris: "#6D7278",
        ligero: "#E5F0D4",
        mist: "#81A8F8",
        pozo: "#00ABFE",
        fuego: "#E50013",
        bb: "#00abfe",
        offBlack: "#111313",
        verde: "#25EC68",
      },
      height: {
        98: "28rem",
        99: "30rem",
        100: "36rem",
        110: "38rem",
        120: "50rem",
        130: "55rem",
        150: "70rem",
        160: "95rem",
      },
      width: {
        100: "30rem",
        calc: "calc(100vw - 20rem - 20rem - 1rem)",
        calc2: "calc(100vw - 10rem)",
        calc3: "calc(100vw)",
      },
      fontSize: {
        xxs: "0.5rem",
        xxxs: "0.6rem",
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
        before: "1050px",
        tablet: "900px",
      },
    },
  },
  plugins: [],
};
