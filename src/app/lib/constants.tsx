import { Status } from "../components/Account/types/account.types";
export const GROVE_GATEWAY: string = "https://api.grove.storage/";
export const INFURA_GATEWAY_INTERNAL: string =
  "https://themanufactory.xyz/api/infura/";
export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io";
export const IPFS_REGEX: RegExp = /\b(Qm[1-9A-Za-z]{44}|ba[A-Za-z2-7]{57})\b/;
export const COIN_OP_OPEN_ACTION: `0x${string}` =
  "0x77D6D8A6d059820AD2C6DC2e3Fba73BcB1eFddf8";
export const VENICE_BASE_URL: string = "https://api.venice.ai/api/v1";

export const NEGATIVE_PROMPT: string =
  "(worst quality, low quality), (bad face), (deformed eyes), (bad eyes), ((extra hands)), extra fingers, too many fingers, fused fingers, bad arm, distorted arm, extra arms, fused arms, extra legs, missing leg, disembodied leg, extra nipples, detached arm, liquid hand, inverted hand, disembodied limb, oversized head, extra body, extra navel, (hair between eyes), twins, doubles";

export const orderStatus: { [key in number]: Status } = {
  [0]: Status.Fulfilled,
  [1]: Status.Shipped,
  [2]: Status.Shipping,
  [3]: Status.Designing,
};

export const CHROMADIN: `0x${string}` =
  "0x16a362A10C1f6Bc0565C8fFAd298f1c2761630C5";
export const printTypeToString: { [key in number]: string } = {
  [0]: "sticker",
  [1]: "poster",
  [2]: "shirt",
  [3]: "hoodie",
  [4]: "sleeve",
  [5]: "crop",
};
export const printTypeToNumber: { [key in string]: number } = {
  ["sticker"]: 0,
  ["poster"]: 1,
  ["shirt"]: 2,
  ["hoodie"]: 3,
};
export const MODELS: string[] = [
  "flux-dev-uncensored",
  "lustify-sdxl",
  "fluently-xl",
  "pony-realism",
];
export const STYLE_PRESETS: string[] = [
  "Analog Film",
  "Line Art",
  "Neon Punk",
  "Pixel Art",
  "Texture",
  "Abstract",
  "Graffiti",
  "Pointillism",
  "Pop Art",
  "Psychedelic",
  "Renaissance",
  "Surrealist",
  "Retro Arcade",
  "Retro Game",
  "Street Fighter",
  "Legend of Zelda",
  "Gothic",
  "Grunge",
  "Horror",
  "Minimalist",
  "Monochrome",
  "Nautical",
  "Collage",
  "Kirigami",
  "Film Noir",
  "HDR",
  "Long Exposure",
  "Neon Noir",
  "Silhouette",
  "Tilt-Shift",
];

export const ALL_FONTS: string[] = [
  "Manaspace",
  "Hermano Alto Stamp",
  "Megamax Jones",
  "Monument Regular",
  "Aquatico Regular",
  "Satoshi Regular",
  "Satoshi Black",
];

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

export const DIGITALAX_ADDRESS: `0x${string}` =
  "0xAA3e5ee4fdC831e5274FE7836c95D670dC2502e6";

export const ASSETS: {
  name: string;
  symbol: string;
  decimals: number;
  contract: {
    address: string;
    chainId: number;
  };
  cover: string;
}[] = [
  {
    name: "MONA",
    symbol: "MONA",
    decimals: 18,
    contract: {
      address: "0x28547B5b6B405A1444A17694AC84aa2d6A03b3Bd",
      // address: "0x72ab7C7f3F6FF123D08692b0be196149d4951a41",
      chainId: 232,
    },
    cover: "QmS6f8vrNZok9j4pJttUuWpNrjsf4vP9RD5mRL36z6UdaL",
  },
  {
    name: "WGHO",
    symbol: "WGHO",
    decimals: 18,
    contract: {
      address: "0x6bDc36E20D267Ff0dd6097799f82e78907105e2F",
      // address: "0xeee5a340Cdc9c179Db25dea45AcfD5FE8d4d3eB8",
      chainId: 232,
    },
    cover: "QmZRqza7VxetyQh2JWvxC6PsnXVUPVV7vU3RS1XUhuqmNA",
  },
];
