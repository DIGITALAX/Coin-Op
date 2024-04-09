import { FormEvent, MouseEvent, Ref } from "react";
import { AnyAction, Dispatch } from "redux";
import { SynthData } from "../../../../../redux/reducers/completedSynthsSlice";
import { TFunction } from "i18next";
import { NextRouter } from "next/router";

export type SynthProps = {
  synthRef: Ref<HTMLDivElement>;
  dispatch: Dispatch<AnyAction>;
  scrollToComposite: () => void;
  controlType: number;
  router: NextRouter;
  t: TFunction<"common", undefined>;
  setControlType: (e: number) => void;
  isDragging: boolean;
  itemClicked: boolean;
  setItemClicked: (e: boolean) => void;
  canvasExpand: boolean;
  handleDownloadImage: (image: string) => void;
  selectedElement: ElementInterface | null;
  newLayersLoading: boolean;
  layerToSynth: {
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
  completedSynths: Map<string, SynthData>;
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
  itemClicked: boolean;
  t: TFunction<"common", undefined>;
  controlType: number;
  setControlType: (e: number) => void;
  setItemClicked: (e: boolean) => void;
  layerToSynth: {
    id: number;
    layer: string | undefined;
  };
  router: NextRouter;
  handleDownloadImage: (image: string) => void;
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
  completedSynths: Map<string, SynthData>;
};

export interface SynthConfig {
  type: string;
  prompt: string;
  image?: Blob | MediaSource;
}

export type DashProps = {
  synthConfig: SynthConfig;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  handleSynth: () => Promise<void>;
  synthLoading: boolean;
  controlType: number;
  canvasExpand: boolean;
  setControlType: (e: number) => void;
  t: TFunction<"common", undefined>;
};

export type PresetProps = {
  presets: string[];
  synthConfig: SynthConfig;
  dispatch: Dispatch<AnyAction>;
  t: TFunction<"common", undefined>;
};

export type CanvasProps = {
  synthLoading: boolean;
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
  synthLoading: boolean;
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

export interface InputTypeAutomatic {
  prompt: string;
  steps: number;
  cfg_scale: number;
  negative_prompt?: string;
  batch_size: number;
  init_images?: string[];
  image_cfg_scale?: number;
  restore_faces: boolean;
  sampler_name: string;
  seed: number;
  width: number;
  height: number;
  sampler_index: string;
  controlnet_units?: [
    {
      input_image: string;
      mask: string;
      module: string;
      model: string;
      weight: number;
      resize_mode: string;
      lowvram: boolean;
      processor_res: number;
      threshold_a: number;
      threshold_b: number;
      guidance: number;
      guidance_start: number;
      guidance_end: number;
      guessmode: boolean;
    }
  ];
}

export type CompleteImagesProps = {
  canvasExpand: boolean;
  completeImages: Map<string, SynthData>;
  handleDownloadImage: (image: string) => void;
  dispatch: Dispatch<AnyAction>;
  layerToSynth: {
    id: number;
    layer: string | undefined;
  };
  synthLoading: boolean;
  itemClicked: boolean;
  setItemClicked: (e: boolean) => void;
};
