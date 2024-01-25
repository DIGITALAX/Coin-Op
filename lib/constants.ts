export const INFURA_GATEWAY: string = "https://chromadin.infura-ipfs.io";
export const IPFS_REGEX: RegExp = /\b(Qm[1-9A-Za-z]{44}|ba[A-Za-z2-7]{57})\b/;
export const BASE_URL: string = "https://api-v2.lens.dev";

export const COIN_OP_OPEN_ACTION: `0x${string}` =
  "0x3710f718f9E78a58FEcfF5Cd9cc41a4b7466BB14";
export const LENS_HUB_PROXY_ADDRESS_MUMBAI: `0x${string}` =
  "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82";
export const LENS_PERIPHERY_CONTRACT_MUMBAI: `0x${string}` =
  "0xD5037d72877808cdE7F669563e9389930AF404E8";
export const LENS_HUB_PROXY_ADDRESS_MATIC: `0x${string}` =
  "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";
export const LENS_PERIPHERY_CONTRACT_MATIC: `0x${string}` =
  "0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f";
export const DIGITALAX_ADDRESS: `0x${string}` =
  "0xAA3e5ee4fdC831e5274FE7836c95D670dC2502e6";

export const ACCEPTED_TOKENS: string[][] = [
  [
    "QmYYUQ8nGDnyuk8jQSung1WmTksvLEQBXjnCctdRrKtsNk",
    "WMATIC",
    "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  ],
  [
    "QmZRhUgjK6bJM8fC7uV145yf66q2e7vGeT7CLosw1SdMdN",
    "WETH",
    "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
  ],
  [
    "QmSbpsDRwxSCPBWPkwWvcb49jViSxzmNHjYy3AcGF3qM2x",
    "USDT",
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  ],
  [
    "QmS6f8vrNZok9j4pJttUuWpNrjsf4vP9RD5mRL36z6UdaL",
    "MONA",
    "0x6968105460f67c3bf751be7c15f92f5286fd0ce5",
  ],
];

export const ACCEPTED_TOKENS_MUMBAI: string[][] = [
  [
    "QmYYUQ8nGDnyuk8jQSung1WmTksvLEQBXjnCctdRrKtsNk",
    "WMATIC",
    "0x3cf7283c025d82390e86d2feb96eda32a393036b",
  ],
  [
    "QmZRhUgjK6bJM8fC7uV145yf66q2e7vGeT7CLosw1SdMdN",
    "WETH",
    "0x566d63f1cc7f45bfc9b2bdc785ffcc6f858f0997",
  ],
  [
    "QmSbpsDRwxSCPBWPkwWvcb49jViSxzmNHjYy3AcGF3qM2x",
    "USDT",
    "0x07b722856369f6b923e1f276abca58dd3d15243d",
  ],
  [
    "QmS6f8vrNZok9j4pJttUuWpNrjsf4vP9RD5mRL36z6UdaL",
    "MONA",
    "0xf87b6343c172720ac9cc7d1c9465d63454a8ef30",
  ],
];

export const allFonts: string[] = [
  "Manaspace",
  "Hermano Alto Stamp",
  "Megamax Jones",
  "Monument Regular",
  "Aquatico Regular",
  "Satoshi Regular",
  "Satoshi Black",
];

export const negative_prompt: string = "";

export const REDIRECT_URL_TEST: string = "http://localhost:3001";

export const DIGITALAX_PROFILE_ID_LENS: string = "0x016305";

export const COUNTRIES: string[] = [
  "United States",
  "Algeria",
  "Argentina",
  "Australia",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Egypt",
  "France",
  "Germany",
  "Greece",
  "India",
  "Indonesia",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Kenya",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Tanzania",
  "Thailand",
  "Turkey",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "Venezuela",
  "Vietnam",
];

export const TAGS: string[] = [
  "AI",
  "public domain",
  "cc0",
  "cypherpunk",
  "solarpunk",
  "lofi",
  "bedroom punk",
  "crypto",
  "Autonomy",
  "retrofuturism",
  "cybernetics",
  "bio punk",
  "digital art",
  "urban exploration",
  "ambient",
  "sustainable",
  "augmented",
  "fashion",
  "abstract expressionism",
  "street photography",
  "minimalist landscapes",
  "digital surrealism",
  "contemporary sculpture",
  "vintage fashion",
  "ceramic artistry",
  "urban graffiti",
  "fantasy illustration",
  "retro pop culture",
  "artisan crafts",
  "eco-friendly designs",
  "watercolor botanicals",
  "avant-garde film",
  "jazz age posters",
  "psychedelic patterns",
  "geometric tattoos",
  "steampunk inventions",
  "gothic architecture",
  "conceptual installations",
  "Abstract",
  "Bohemian",
  "Cyberpunk",
  "Deco",
  "Ethereal",
  "Futurism",
  "Graffiti",
  "neo",
  "Holographic",
  "Impressionist",
  "Juxtaposed",
  "Kinetic",
  "Luminous",
  "Minimalist",
  "Neon",
  "Organic",
  "Pixel",
  "Quirky",
  "Retro",
  "Surreal",
  "Textured",
];

export const printStringToNumber: { [key: string]: string } = {
  ["Sticker"]: "0",
  ["Poster"]: "1",
  ["Shirt"]: "2",
  ["Hoodie"]: "3",
  ["Sleeve"]: "4",
  ["Crop"]: "5",
  ["NFTOnly"]: "6",
  ["Custom"]: "7",
  ["Other"]: "8",
};

export const printTypeToString: { [key in number]: string } = {
  [0]: "sticker",
  [1]: "poster",
  [2]: "shirt",
  [3]: "hoodie",
  [4]: "sleeve",
  [5]: "crop",
};
