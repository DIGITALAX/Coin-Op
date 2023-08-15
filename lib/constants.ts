import { Appearance } from "@stripe/stripe-js";

export const INFURA_GATEWAY: string = "https://chromadin.infura-ipfs.io";

export const BASE_URL: string = "https://api.lens.dev";

export const LENS_HUB_PROXY_ADDRESS_MUMBAI: `0x${string}` =
  "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82";
export const LENS_PERIPHERY_CONTRACT_MUMBAI: `0x${string}` =
  "0xD5037d72877808cdE7F669563e9389930AF404E8";
export const LENS_HUB_PROXY_ADDRESS_MATIC: `0x${string}` =
  "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";
export const LENS_PERIPHERY_CONTRACT_MATIC: `0x${string}` =
  "0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f";

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

export const COIN_OP_MARKET: `0x${string}` =
  "0x0E8fD2e1927F2354a7a1d636525A2Be0c7CA8694";
export const COIN_OP_ORACLE: `0x${string}` =
  "0x7e066A206a982F7Aa0d6d0D4c5bC74E4bD048dF3";
export const COIN_OP_FULFILLMENT: `0x${string}` =
  "0x84E7493b1DB31bf643FD0C8A129B3b8acfD9413b";
export const PKP_ADDRESS: `0x${string}` =
  "0xb1d06c81fd47dd1abb1172feb369306a2746f220";
export const IPFS_CID_PKP: string =
  "QmQv8pjUnz3wkTzQJtbv6gpBzdHDQHyqAAUryAmvioUh3L";
export const PKP_TOKEN_ID: string =
  "82219119439491908067162140632966258754043386597747120916337702503268800114842";
export const PKP_PUBLIC_KEY: `0x${string}` =
  "0x041fc46ca07e11644b4e3b6cd8f1977066526a76a8320e17a96483f7ccb1ba3cc71e0014b2f0475171167a01a4200f04b90407a49d8749e53e853d784bf2d4cde2";

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

export const REDIRECT_URL: string = "https://coinop.themanufactory.xyz";
export const REDIRECT_URL_TEST: string = "http://localhost:3000";

export const APPEARANCE: Appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#76b3f4",
    colorBackground: "#000000",
    fontFamily: "Manaspace",
  },
};
