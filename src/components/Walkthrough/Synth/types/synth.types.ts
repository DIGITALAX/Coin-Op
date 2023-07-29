import { MouseEvent, Ref, WheelEvent } from "react";
import { AnyAction, Dispatch } from "redux";

export type SynthProps = {
  dispatch: Dispatch<AnyAction>;
  scrollToComposite: () => void;
  newLayersLoading: boolean;
  synthLayerSelected: string | undefined;
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
  handleWheel: (e: WheelEvent) => void;
};

export type GridProps = {
  dispatch: Dispatch<AnyAction>;
  scrollToComposite: () => void;
  newLayersLoading: boolean;
  synthLayerSelected: string | undefined;
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
  handleWheel: (e: WheelEvent) => void;
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
  handleWheel: (e: WheelEvent) => void;
  synthLayerSelected: string | undefined;
  newLayersLoading: boolean;
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
