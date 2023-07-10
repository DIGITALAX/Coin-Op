import { AnyAction, Dispatch } from "redux";
import { Layer } from "../../Layer/types/layer.types";

export type SynthProps = {
  dispatch: Dispatch<AnyAction>;
  synthLayerSelected: Layer | undefined;
  synthLayer: Layer | undefined;
  synthConfig: SynthConfig;
  handleSynth: () => Promise<void>;
  synthLoading: boolean;
  presets: string[];
};

export type GridProps = {
  dispatch: Dispatch<AnyAction>;
  synthLayerSelected: Layer | undefined;
  synthLayer: Layer | undefined;
  synthConfig: SynthConfig;
  handleSynth: () => Promise<void>;
  synthLoading: boolean;
  presets: string[];
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
