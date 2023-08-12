import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PaymentType {
  value:string;
}

const initialPaymentType: PaymentType = {
  value: "crypto",
};

export const paymentTypeSlice = createSlice({
  name: "paymentType",
  initialState: initialPaymentType,
  reducers: {
    setPaymentType: (
      state: PaymentType,
      action: PayloadAction<string>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setPaymentType } = paymentTypeSlice.actions;

export default paymentTypeSlice.reducer;
