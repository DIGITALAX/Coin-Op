import {
  PaymentType,
  Status,
  StatusMarket,
} from "../components/Account/types/account.types";
import { Fulfiller } from "../components/Sell/types/sell.types";
export const GROVE_GATEWAY: string = "https://api.grove.storage/";
export const INFURA_GATEWAY_INTERNAL: string =
  "https://themanufactory.xyz/api/infura/";
export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io";
export const IPFS_REGEX: RegExp = /\b(Qm[1-9A-Za-z]{44}|ba[A-Za-z2-7]{57})\b/;
export const COIN_OP_OPEN_ACTION: `0x${string}` =
  "0x77D6D8A6d059820AD2C6DC2e3Fba73BcB1eFddf8";
export const VENICE_BASE_URL: string = "https://api.venice.ai/api/v1";
export const LOCALES: string[] = ["en", "es"];

export const COIN_OP_PARENT: `0x${string}` =
  "0x5215f9b79bee0f043dc7dcce870750033a8480c5";
export const COIN_OP_DESIGNER: `0x${string}` =
  "0x1c7ec8b9100ae14cf0d2eacde7b08cda6863fc44";
export const COIN_OP_MARKET: `0x${string}` =
  "0xdb28aaf0aee89b4383d59f6da948883f538e9da5";
export const INFRA_ID: string =
  "0x0000000000000000000000000000000000000000000000000000000000000001";
export const MATERIAL_CHILD: `0x${string}` =
  "0xadc3f6c9fe006d997fa6124ccc253c6de6244e85";
export const COLOR_CHILD: `0x${string}` =
  "0x59271b2d618dd4fe5ab998d8ad8a3da77f15c716";
export const SIZES: string[] = ["xxs", "xs", "s", "m", "l", "xl", "2xl"];
export const APP_COLORS: string[] = [
  "bg-morado",
  "bg-arbol",
  "bg-rosa",
  "bg-apagado",
  "bg-mar",
  "bg-coral",
  "bg-pez",
  "bg-corazon",
  "bg-dorado",
];

export const FULFILLERS: Fulfiller[] = [
  {
    title: "The Manufactory",
    uri: "ipfs://QmfCoKxKmrJw1fAgwqWh6a3MmJ1h8cv4jh2mQx15CrgyT5",
    base: 1,
    vig: 5,
    address: "0xdD35935C12E3748704C96492E5565d34daE73De7",
  },
];

export const NEGATIVE_PROMPT: string =
  "(worst quality, low quality), (bad face), (deformed eyes), (bad eyes), ((extra hands)), extra fingers, too many fingers, fused fingers, bad arm, distorted arm, extra arms, fused arms, extra legs, missing leg, disembodied leg, extra nipples, detached arm, liquid hand, inverted hand, disembodied limb, oversized head, extra body, extra navel, (hair between eyes), twins, doubles";

export const orderStatus: { [key in number]: Status } = {
  [0]: Status.Fulfilled,
  [1]: Status.Shipped,
  [2]: Status.Shipping,
  [3]: Status.Designing,
};

export const orderStatusMarket: { [key in number]: StatusMarket } = {
  [0]: StatusMarket.Paid,
  [1]: StatusMarket.Cancelled,
  [2]: StatusMarket.Refunded,
  [3]: StatusMarket.Disputed,
};

export const paymentType: { [key in number]: PaymentType } = {
  [0]: PaymentType.Child,
  [1]: PaymentType.Template,
  [2]: PaymentType.Parent,
  [3]: PaymentType.Fulfiller,
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
  "0x7642fca8eEFEF0678a30F7Cf5892590545Aa154A";

export const DIGITALAX_PUBLIC_KEY: string =
  "0x0432166686bda53a75de0cdf3360bf47993b4277315798b2e28b2e662af7965a5b018950eeccede9ba01adf2563d2a8e731a881f39deb0c58cec6bfe3e8a812c28";

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
      // address: "0x28547B5b6B405A1444A17694AC84aa2d6A03b3Bd",
      address: "0x3D7f4Fc4E17Ead2ABBcf282A38F209D683e03835",
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

export const WALKTHROUGH_IMAGES: {
  image: string;
  title: string;
  content: string;
}[] = [
  {
    image: "QmdsEWxXPdTva7JL29JQFqFhxx77BHiYRMrgVnDQ22G17c",
    title: "Format",
    content: "format_content",
  },
  {
    image: "QmRzn9byKrUeS6c7fCKTJ47RXVF2kAG6gDizHwJyck8yz2",
    title: "Layer",
    content: "layer_content",
  },
  {
    image: "QmSHJdszBSPVmzi9aNf8ArUhMjH5g7YL1Ph6MJvmhayQg7",
    title: "Synth",
    content: "synth_content",
  },
  {
    image: "QmcyWnosoaiF7bneC2fLCro6MRB7DBvsFBg5oasrso4pUT",
    title: "Composite",
    content: "composite_content",
  },
  {
    image: "QmeDNvxmeNX9sP1CJJFeyMH8fSLvVZBNYsTJG5hfLy7zqc",
    title: "Pattern",
    content: "pattern_content",
  },
  {
    image: "QmU6hHG4spLviz5xvV2q7TCZiaqwtNvcgu8wiHTpq5d5QH",
    title: "Blender",
    content: "blender_content",
  },
  {
    image: "QmRQgekXK1Dy8hoYuyM61kroxLpaqzJ3AuGAE97KDMyE4j",
    title: "Fulfill",
    content: "fulfill_content",
  },
  {
    image: "QmVvYdhfSWScCTRRwbxf2Xi6KGHKt33m6FtsKGe7QjKgpP",
    title: "Sell",
    content: "sell_content",
  },
];
