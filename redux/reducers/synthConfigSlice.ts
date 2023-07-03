import { createSlice } from "@reduxjs/toolkit";

export interface SynthConfigState {
  type: string;
  prompt: string;
  image?:  Blob | MediaSource;
}

const initialSynthConfigState: SynthConfigState = {
  type: "txt2img",
  prompt:
    "neon graffiti neo-tokyo, 1970s sci-fi,setting sun,digital art oil painting, bright lighting, energetic brush strokes, whimsical, in the style of coin-op-mix-1",
};

export const synthConfigSlice = createSlice({
  name: "synthConfig",
  initialState: initialSynthConfigState,
  reducers: {
    setSynthConfig: (
      state: SynthConfigState,
      { payload: { actionType, actionPrompt, actionImage } }
    ) => {
      state.type = actionType;
      state.prompt = actionPrompt;
      state.image = actionImage;
    },
  },
});

export const { setSynthConfig } = synthConfigSlice.actions;

export default synthConfigSlice.reducer;
