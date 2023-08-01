import { FormEvent, MouseEvent, Ref, WheelEvent } from "react";
import { AnyAction, Dispatch } from "redux";

export type SynthProps = {
  dispatch: Dispatch<AnyAction>;
  scrollToComposite: () => void;
  isDragging: boolean;
  canvasExpand: boolean;
  selectedElement: ElementInterface | null;
  newLayersLoading: boolean;
  synthLayerSelected: {
    id: number;
    layer: string | undefined;
  };
  showBottomOptions: boolean;
  setShowBottomOptions: (e: boolean) => void;
  colorPicker: boolean;
  setColorPicker: (e: boolean) => void;
  hex: string;
  undo: (patternId: string) => void;
  redo: (patternId: string) => void;
  action: string;
  writingRef: Ref<HTMLTextAreaElement>;
  handleBlur: (e: FormEvent) => void;
  handleReset: () => void;
  setHex: (e: string) => void;
  setThickness: (e: boolean) => void;
  thickness: boolean;
  setBrushWidth: (e: number) => void;
  brushWidth: number;
  setTool: (e: string) => void;
  tool: string;
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
  font: string;
  setFont: (e: string) => void;
  setFontOpen: (e: boolean) => void;
  fontOpen: boolean;
  materialBackground: string;
  setMaterialBackground: (e: string) => void;
  materialOpen: boolean;
  setMaterialOpen: (e: boolean) => void;
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
  canvasExpand: boolean;
};

export type GridProps = {
  dispatch: Dispatch<AnyAction>;
  scrollToComposite: () => void;
  canvasExpand: boolean;
  newLayersLoading: boolean;
  synthLayerSelected: {
    id: number;
    layer: string | undefined;
  };
  isDragging: boolean;
  selectedElement: ElementInterface | null;
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
  tool: string;
  presets: string[];
  undo: (patternId: string) => void;
  redo: (patternId: string) => void;
  action: string;
  writingRef: Ref<HTMLTextAreaElement>;
  handleBlur: (e: FormEvent) => void;
  handleReset: () => void;
  canvasRef: Ref<HTMLCanvasElement>;
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: (e: MouseEvent) => void;
  font: string;
  setFont: (e: string) => void;
  setFontOpen: (e: boolean) => void;
  fontOpen: boolean;
  materialBackground: string;
  setMaterialBackground: (e: string) => void;
  materialOpen: boolean;
  setMaterialOpen: (e: boolean) => void;
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
  canvasExpand: boolean;
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
  dispatch: Dispatch<AnyAction>;
  action: string;
  writingRef: Ref<HTMLTextAreaElement>;
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
  layerToSynth: {
    id: number;
    layer: string | undefined;
  };
};

export type BottomMenuProps = {
  showBottomOptions: boolean;
  setShowBottomOptions: (e: boolean) => void;
  colorPicker: boolean;
  setColorPicker: (e: boolean) => void;
  hex: string;
  canvasExpand: boolean;
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
  dispatch: Dispatch<AnyAction>;
  setFontOpen: (e: boolean) => void;
  fontOpen: boolean;
  materialBackground: string;
  setMaterialBackground: (e: string) => void;
  materialOpen: boolean;
  setMaterialOpen: (e: boolean) => void;
  layerToSynth: {
    id: number;
    layer: string | undefined;
  };
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

export interface Point2 {
  x: number;
  y: number;
}
