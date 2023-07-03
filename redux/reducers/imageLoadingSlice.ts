import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ImageLoadingState {
  value: boolean;
}

const initialImageLoadingState: ImageLoadingState = {
  value: false,
};

export const imageLoadingSlice = createSlice({
  name: "imageLoading",
  initialState: initialImageLoadingState,
  reducers: {
    setImageLoading: (
      state: ImageLoadingState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setImageLoading } = imageLoadingSlice.actions;

export default imageLoadingSlice.reducer;
