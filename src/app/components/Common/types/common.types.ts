import {
  Account,
  BigDecimal,
  DateTime,
  EvmAddress,
  Post,
  SessionClient,
} from "@lens-protocol/client";
import { Preroll } from "../../Prerolls/types/prerolls.types";

export interface LensConnected {
  profile?: Account;
  sessionClient?: SessionClient;
}

export enum Indexar {
  Inactivo = "inactivo",
  Exito = "success",
  Indexando = "indexing",
}

export type MobileFotosProps = {
  dict: any;
};

export interface FullScreenVideo {
  open: boolean;
  time?: number;
  duration?: number;
  isPlaying?: boolean;
  volume?: number;
  volumeOpen?: boolean;
  allVideos: Post[];
  cursor?: string | undefined;
  index: number;
}

export type SearchBoxProps = {
  promptSearch: Preroll;
  handleAddToCart: (e: Preroll) => void;
  dict: any;
};

export interface SimpleCollect {
  isImmutable?: boolean | null | undefined;
  endsAt?: DateTime | null | undefined;
  followerOnGraph?:
    | {
        globalGraph: true;
      }
    | {
        graph: EvmAddress;
      }
    | null
    | undefined;
  collectLimit?: number | null | undefined;
  payToCollect?:
    | {
        referralShare?: number | null | undefined;
        recipients: {
          percent: number;
          address: EvmAddress;
        }[];
        amount: {
          value: BigDecimal;
          currency: EvmAddress;
        };
      }
    | null
    | undefined;
}

export type DownloadProps = {
  dict: any;
  position: {
    x: number;
    y: number;
  };
};

export type AppMarketProps = {
  dict: any
}

export interface EncryptedData {
  [address: string]: {
    ephemPublicKey: string;
    iv: string;
    ciphertext: string;
  };
}