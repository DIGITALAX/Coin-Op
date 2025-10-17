"use client";
import templates from "./../../public/templates.json";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
  createContext,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Context, Post, PublicClient, mainnet } from "@lens-protocol/client";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { StorageClient } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
import {
  FullScreenVideo,
  Indexar,
  LensConnected,
  SimpleCollect,
} from "./components/Common/types/common.types";
import { CartItem, Preroll } from "./components/Prerolls/types/prerolls.types";
import {
  CurrentWalkthrough,
  OracleData,
  SynthConfig,
} from "./components/Walkthrough/types/walkthrough.types";

export const config = createConfig(
  getDefaultConfig({
    appName: "Coinop",
    walletConnectProjectId: process.env
      .NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
    appUrl: "https://coinop.themanufactory.xyz",
    appIcon: "https://coinop.themanufactory.xyz/favicon.ico",
    chains: [chains.mainnet],
    transports: {
      [chains.mainnet.id]: http("https://rpc.lens.xyz"),
    },
    connectors: [],
    ssr: true,
  })
);

const queryClient = new QueryClient();

export const SynthContext = createContext<
  | {
      synthArea: {
        width: number;
        height: number;
        originalWidth: number;
        originalHeight: number;
      };
      setSynthArea: (
        e: SetStateAction<{
          width: number;
          height: number;
          originalWidth: number;
          originalHeight: number;
        }>
      ) => void;
      elements: any[];
      setElements: (e: SetStateAction<any[]>) => void;
      canvasSize: {
        width: number;
        height: number;
        oldWidth: number;
        oldHeight: number;
      };
      setCanvasSize: (
        e: SetStateAction<{
          width: number;
          height: number;
          oldWidth: number;
          oldHeight: number;
        }>
      ) => void;
      canvasExpand: boolean;
      setCanvasExpand: (e: SetStateAction<boolean>) => void;
      rollSearch: Preroll[];
      setRollSearch: (e: SetStateAction<Preroll[]>) => void;
      setSynthConfig: (e: SetStateAction<SynthConfig>) => void;
      synthConfig: SynthConfig;
      current: CurrentWalkthrough;
      setCurrent: (e: SetStateAction<CurrentWalkthrough>) => void;
    }
  | undefined
>(undefined);

export const ScrollContext = createContext<{
  scrollRef: RefObject<HTMLDivElement | null>;
  synthRef: RefObject<HTMLDivElement | null>;
  prerollRef: RefObject<HTMLDivElement | null>;
  compositeRef: RefObject<HTMLDivElement | null>;
}>({
  scrollRef: null!,
  synthRef: null!,
  prerollRef: null!,
  compositeRef: null!,
});

export const ModalContext = createContext<
  | {
      setPostCollect: (
        e: SetStateAction<{
          id?: string;
          type: SimpleCollect | undefined;
        }>
      ) => void;
      postCollect: {
        id?: string;
        type: SimpleCollect | undefined;
      };
      oracleData: OracleData[];
      setOracleData: (e: SetStateAction<OracleData[]>) => void;
      apiKey: string | undefined;
      setApiKey: (e: SetStateAction<string | undefined>) => void;
      openApiKey: boolean;
      setOpenAPIKey: (e: SetStateAction<boolean>) => void;
      setFullScreenVideo: (e: SetStateAction<FullScreenVideo>) => void;
      fullScreenVideo: FullScreenVideo;
      setConnect: (e: SetStateAction<boolean>) => void;
      connect: boolean;
      setCrearCuenta: (e: SetStateAction<boolean>) => void;
      crearCuenta: boolean;
      quoteBox:
        | {
            type: string;
            quote: Post;
          }
        | undefined;
      setQuoteBox: (
        e: SetStateAction<
          | {
              type: string;
              quote: Post;
            }
          | undefined
        >
      ) => void;
      reactBox:
        | {
            type: string;
            id: string;
          }
        | undefined;
      setReactBox: (
        e: SetStateAction<
          | {
              type: string;
              id: string;
            }
          | undefined
        >
      ) => void;
      cartItems: CartItem[];
      setCartItems: (e: SetStateAction<CartItem[]>) => void;
      modalOpen: string | undefined;
      modalSuccess: string | undefined;
      setModalSuccess: (e: SetStateAction<string | undefined>) => void;
      setModalOpen: (e: SetStateAction<string | undefined>) => void;
      cartAddAnim: string | undefined;
      setCartAddAnim: (e: SetStateAction<string | undefined>) => void;
      searchExpand: Preroll | undefined;
      setSearchExpand: (e: SetStateAction<Preroll | undefined>) => void;
      prerollsLoading: boolean;
      setPrerollsLoading: (e: SetStateAction<boolean>) => void;
      prerollAnim: boolean;
      setPrerollAnim: (e: SetStateAction<boolean>) => void;
      clienteLens: PublicClient<Context> | undefined;
      lensConectado: LensConnected | undefined;
      setLensConectado: (e: SetStateAction<LensConnected | undefined>) => void;
      error: string | undefined;
      setError: (e: SetStateAction<string | undefined>) => void;
      signless: boolean;
      setSignless: (e: SetStateAction<boolean>) => void;
      indexar: Indexar;
      setIndexar: (e: SetStateAction<Indexar>) => void;
      clienteAlmacenamiento: StorageClient | undefined;
      verImagen: string | undefined;
      setVerImagen: (e: SetStateAction<string | undefined>) => void;
      prerolls: Preroll[];
      setPrerolls: (e: SetStateAction<Preroll[]>) => void;
    }
  | undefined
>(undefined);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [clienteLens, setClienteLens] = useState<PublicClient | undefined>();
  const [postCollect, setPostCollect] = useState<{
    id?: string;
    type: SimpleCollect | undefined;
  }>({
    type: undefined,
  });
  const [connect, setConnect] = useState<boolean>(false);
  const [openApiKey, setOpenAPIKey] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string | undefined>();
  const [oracleData, setOracleData] = useState<OracleData[]>([]);
  const [crearCuenta, setCrearCuenta] = useState<boolean>(false);
  const [prerolls, setPrerolls] = useState<Preroll[]>([]);
  const [verImagen, setVerImagen] = useState<string | undefined>();
  const clienteAlmacenamiento = StorageClient.create();
  const [lensConectado, setLensConectado] = useState<LensConnected>();
  const [cartAddAnim, setCartAddAnim] = useState<string | undefined>();
  const [modalOpen, setModalOpen] = useState<string | undefined>();
  const [modalSuccess, setModalSuccess] = useState<string | undefined>();
  const [signless, setSignless] = useState<boolean>(false);
  const [prerollsLoading, setPrerollsLoading] = useState<boolean>(false);
  const [prerollAnim, setPrerollAnim] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [indexar, setIndexar] = useState<Indexar>(Indexar.Inactivo);
  const [searchExpand, setSearchExpand] = useState<Preroll | undefined>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [reactBox, setReactBox] = useState<
    | {
        id: string;
        type: string;
      }
    | undefined
  >();
  const [quoteBox, setQuoteBox] = useState<
    | {
        type: string;
        quote: Post;
      }
    | undefined
  >();
  const [fullScreenVideo, setFullScreenVideo] = useState<FullScreenVideo>({
    open: false,
    allVideos: [],
    index: 0,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<HTMLDivElement>(null);
  const prerollRef = useRef<HTMLDivElement>(null);
  const compositeRef = useRef<HTMLDivElement>(null);

  const [synthConfig, setSynthConfig] = useState<SynthConfig>({
    type: "txt2img",
    prompt:
      "neon graffiti neo-tokyo, 1970s sci-fi,setting sun,digital art oil painting, bright lighting, energetic brush strokes, whimsical, in the style of coin-op-mix-1",
  });
  const [canvasExpand, setCanvasExpand] = useState<boolean>(false);
  const [rollSearch, setRollSearch] = useState<Preroll[]>([]);
  const [current, setCurrent] = useState<CurrentWalkthrough>({
    template: templates?.[0],
  });
  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
    oldWidth: number;
    oldHeight: number;
  }>({
    width: 0,
    height: 0,
    oldHeight: 0,
    oldWidth: 0,
  });
  const [elements, setElements] = useState<any[]>([]);
  const [synthArea, setSynthArea] = useState<{
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
  }>({
    width: 0,
    height: 0,
    originalWidth: 0,
    originalHeight: 0,
  });

  useEffect(() => {
    if (!clienteLens) {
      setClienteLens(
        PublicClient.create({
          environment: mainnet,
          storage: window.localStorage,
        })
      );
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-font-family": '"Manaspace", cursive',
          }}
        >
          <ScrollContext.Provider
            value={{ scrollRef, synthRef, prerollRef, compositeRef }}
          >
            <SynthContext.Provider
              value={{
                synthArea,
                setSynthArea,
                elements,
                setElements,
                canvasSize,
                setCanvasSize,
                synthConfig,
                setSynthConfig,
                rollSearch,
                setRollSearch,
                current,
                setCurrent,
                canvasExpand,
                setCanvasExpand,
              }}
            >
              <ModalContext.Provider
                value={{
                  postCollect,
                  setPostCollect,
                  oracleData,
                  setOracleData,
                  openApiKey,
                  setOpenAPIKey,
                  apiKey,
                  modalSuccess,
                  setModalSuccess,
                  setApiKey,
                  fullScreenVideo,
                  setFullScreenVideo,
                  prerollsLoading,
                  setPrerollsLoading,
                  reactBox,
                  setReactBox,
                  quoteBox,
                  setQuoteBox,
                  cartItems,
                  setCartItems,
                  modalOpen,
                  setModalOpen,
                  cartAddAnim,
                  setCartAddAnim,
                  connect,
                  setConnect,
                  crearCuenta,
                  setCrearCuenta,
                  searchExpand,
                  setSearchExpand,
                  prerollAnim,
                  setPrerollAnim,
                  prerolls,
                  setPrerolls,
                  clienteLens,
                  clienteAlmacenamiento,
                  lensConectado,
                  setLensConectado,
                  error,
                  setError,
                  signless,
                  setSignless,
                  verImagen,
                  setVerImagen,
                  setIndexar,
                  indexar,
                }}
              >
                {children}
              </ModalContext.Provider>
            </SynthContext.Provider>
          </ScrollContext.Provider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
