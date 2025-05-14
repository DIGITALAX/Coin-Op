import { FormEvent, MouseEvent, RefObject, SetStateAction } from "react";
import { CartItem } from "../../Prerolls/types/prerolls.types";

export interface Template {
  name: string;
  type: string;
  image: string;
}

export type TemplateProps = {
  template: Template | undefined;
  chosenTemplate: Template | undefined;
  dict: any;
  locked?: boolean;
};

export type SetProps = {
  synthLayer: SynthLayer;
};

export type ModelSelectProps = {
  models: string[];
  dict: any;
};

export type ModelProps = {
  model: string;
};

export interface SynthConfig {
  type: string;
  prompt: string;
  image?: Blob | MediaSource;
}

export type ModelsProps = {
  dict: any;
  config: {
    model: string;
    controlType: number;
    stylePreset: string;
  };
  setConfig: (
    e: SetStateAction<{
      model: string;
      controlType: number;
      stylePreset: string;
    }>
  ) => void;
};
export type PresetProps = {
  dict: any;
  config: {
    model: string;
    controlType: number;
    stylePreset: string;
  };
  setConfig: (
    e: SetStateAction<{
      model: string;
      controlType: number;
      stylePreset: string;
    }>
  ) => void;
};

export type DashProps = {
  dict: any;
  handleSynth: () => Promise<void>;
  synthLoading: boolean;
  config: {
    model: string;
    controlType: number;
    stylePreset: string;
  };
  setConfig: (
    e: SetStateAction<{
      model: string;
      controlType: number;
      stylePreset: string;
    }>
  ) => void;
};

export interface SynthData {
  synths: string[];
  chosen: string;
}

export interface SynthLayer {
  uri: string;
  poster: string;
  children: ChildLayer[];
  price: string;
  id: string;
}

export interface ChildLayer {
  uri: string;
  price: string;
  id: string;
}

export interface CurrentWalkthrough {
  template?: Template;
  completedSynths?: Map<string, SynthData>;
  synth?: SynthLayer;
  layer?: ChildLayer;
  printLayers?: SynthLayer[];
}

export type CompleteImagesProps = {
  handleDownloadImage: (image: string) => void;
  synthLoading: boolean;
  itemClicked: boolean;
  setItemClicked: (e: boolean) => void;
};

export type CanvasOptionProps = {
  bool_option?: boolean;
  string_option?: string;
  image: string;
  bgColor?: string;
  setShowBool?: (bool_option: boolean) => void;
  setShowString?: (string_option: string) => void;
  width: number;
  height: number;
  color?: boolean;
  text?: string;
  toolTip: string;
};

export type BottomMenuProps = {
  showBottomOptions: boolean;
  setShowBottomOptions: (e: boolean) => void;
  colorPicker: boolean;
  setColorPicker: (e: boolean) => void;
  hex: string;
  synthLoading: boolean;
  setHex: (e: string) => void;
  setThickness: (e: boolean) => void;
  thickness: boolean;
  setBrushWidth: (e: number) => void;
  brushWidth: number;
  setTool: (e: string) => void;
  undo: (patternId: string) => void;
  redo: (patternId: string) => void;
  handleReset: () => void;
  font: string;
  setFont: (e: string) => void;
  setFontOpen: (e: boolean) => void;
  fontOpen: boolean;
  materialBackground: string;
  setMaterialBackground: (e: string) => void;
  materialOpen: boolean;
  setMaterialOpen: (e: boolean) => void;
};

export type CanvasProps = {
  synthLoading: boolean;
  canvasRef: (canvas: HTMLCanvasElement) => void;
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: (e: MouseEvent) => void;
  newLayersLoading: boolean;
  isDragging: boolean;
  showBottomOptions: boolean;
  setShowBottomOptions: (e: boolean) => void;
  colorPicker: boolean;
  setColorPicker: (e: boolean) => void;
  hex: string;
  setHex: (e: string) => void;
  setThickness: (e: boolean) => void;
  thickness: boolean;
  setBrushWidth: (e: number) => void;
  brushWidth: number;
  setTool: (e: string) => void;
  tool: string;
  undo: (patternId: string) => void;
  redo: (patternId: string) => void;
  handleReset: () => void;
  action: string;
  writingRef: RefObject<HTMLTextAreaElement | null>;
  handleBlur: (e: FormEvent) => void;
  selectedElement: ElementInterface | null;
  font: string;
  setFont: (e: string) => void;
  setFontOpen: (e: boolean) => void;
  fontOpen: boolean;
  materialBackground: string;
  setMaterialBackground: (e: string) => void;
  materialOpen: boolean;
  setMaterialOpen: (e: boolean) => void;
};

export interface SvgPatternType {
  id: number;
  points?: {
    x: number;
    y: number;
  }[][];
  type: string;
  posX?: number;
  posY?: number;
  stroke?: string;
  clipElement?: SvgPatternType;
  image?: HTMLImageElement;
  fill?: string;
  strokeWidth?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  text?: string;
  offsetY?: number;
  offsetX?: number;
  width?: number;
  height?: number;
  offsetXs?: number[];
  offsetYs?: number[];
  scaleFactorX?: number;
  scaleFactorY?: number;
  bounds?: {
    left: number;
    top: number;
  };
}

export interface ElementInterface {
  id: number;
  type: string;
  x1?: number;
  y1?: number;
  x2?: number;
  clipElement?: SvgPatternType;
  width?: number;
  height?: number;
  y2?: number;
  offsetY?: number;
  offsetX?: number;
  offsetXs?: number[];
  offsetYs?: number[];
  points?: {
    x: number;
    y: number;
  }[];
  fill?: string;
  text?: string;
  stroke?: string;
  strokeWidth?: number;
  fillStyle?: string;
  image?: HTMLImageElement;
  position?: string;
  lineDash?: number[];
  font?: string;
}

export interface Details {
  address: string;
  zip: string;
  city: string;
  state: string;
  country: string;
  color?: string;
  size?: string;
}

export interface OracleData {
  currency: string;
  rate: string;
  wei: string;
}

export type CheckoutProps = {
  setCartItem: (e: CartItem) => void;
  cartItem: CartItem | undefined;
  handleCheckoutCrypto: () => Promise<void>;
  cryptoCheckoutLoading: boolean;
  dict: any;
  setCheckoutCurrency: (e: string) => void;
  checkoutCurrency: string;
  fulfillmentDetails: Details;
  approved: boolean;
  handleApproveSpend: () => Promise<void>;
  openCountryDropDown: boolean;
  setOpenCountryDropDown: (e: SetStateAction<boolean>) => void;
  encrypted:
    | {
        postId: string;
        data: string;
      }[]
    | undefined;
  setFulfillmentDetails: (e: SetStateAction<Details>) => void;
  encryptFulfillment: () => Promise<void>;
  setEncrypted: (
    e: SetStateAction<
      | {
          postId: string;
          data: string;
        }[]
      | undefined
    >
  ) => void;
};

export type CryptoProps = {
  encrypted:
    | {
        postId: string;
        data: string;
      }[]
    | undefined;
  dict: any;
  handleCheckoutCrypto?: () => Promise<void>;
  cryptoCheckoutLoading?: boolean;
  encryptFulfillment: () => Promise<void>;
  approved?: boolean;
  handleApproveSpend?: () => Promise<void>;
};

export type ItemsProps = {
  dict: any;
  cartItem: CartItem | undefined;
  checkoutCurrency: string;
  setCartItem: (e: CartItem) => void;
  setEncrypted: (
    e: SetStateAction<
      | {
          postId: string;
          data: string;
        }[]
      | undefined
    >
  ) => void;
};

export type ShippingInfoProps = {
  fulfillmentDetails: Details;
  setFulfillmentDetails: (e: SetStateAction<Details>) => void;
  openCountryDropDown: boolean;
  dict: any;
  setOpenCountryDropDown: (e: SetStateAction<boolean>) => void;
  setEncrypted: (
    e: SetStateAction<
      | {
          postId: string;
          data: string;
        }[]
      | undefined
    >
  ) => void;
  encrypted:
    | {
        postId: string;
        data: string;
      }[]
    | undefined;
};

export type InputTypeVenice = {
  model: string;
  prompt: string;
  width: number;
  height: number;
  steps: number;
  hide_watermark: boolean;
  return_binary: boolean;
  cfg_scale: number;
  style_preset: string;
  negative_prompt: string;
  safe_mode: boolean;
};
