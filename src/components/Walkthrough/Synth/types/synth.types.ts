import { MouseEvent, Ref, WheelEvent } from "react";
import { AnyAction, Dispatch } from "redux";

export type SynthProps = {
  dispatch: Dispatch<AnyAction>;
  scrollToComposite: () => void;
  isDragging: boolean;
  newLayersLoading: boolean;
  synthLayerSelected: string | undefined;
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
  synthLayer:
    | {
        parentURI: string;
        childTokenURIs: string[];
        parentPrice: string;
        childPrice: string;
        childPosterURI: string;
        parentId: number;
        childId: number;
      }
    | undefined;
  synthConfig: SynthConfig;
  handleSynth: () => Promise<void>;
  synthLoading: boolean;
  presets: string[];
  canvasRef: Ref<HTMLCanvasElement>;
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: (e: MouseEvent) => void;
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
};

export type GridProps = {
  dispatch: Dispatch<AnyAction>;
  scrollToComposite: () => void;
  newLayersLoading: boolean;
  synthLayerSelected: string | undefined;
  isDragging: boolean;
  synthLayer:
    | {
        parentURI: string;
        childTokenURIs: string[];
        parentPrice: string;
        childPrice: string;
        childPosterURI: string;
        parentId: number;
        childId: number;
      }
    | undefined;
  synthConfig: SynthConfig;
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
  handleSynth: () => Promise<void>;
  synthLoading: boolean;
  presets: string[];
  canvasRef: Ref<HTMLCanvasElement>;
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: (e: MouseEvent) => void;
};

export interface SynthConfig {
  type: string;
  prompt: string;
  image?: Blob | MediaSource;
}

export type DashProps = {
  synthConfig: SynthConfig;
  dispatch: Dispatch<AnyAction>;
  handleSynth: () => Promise<void>;
  synthLoading: boolean;
};

export type PresetProps = {
  presets: string[];
  synthConfig: SynthConfig;
  dispatch: Dispatch<AnyAction>;
};

export type CanvasProps = {
  canvasRef: Ref<HTMLCanvasElement>;
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
};

export type BottomMenuProps = {
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
}

export interface ElementInterface {
  id: number;
  type: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
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
}

export interface Point2 {
  x: number;
  y: number;
}
