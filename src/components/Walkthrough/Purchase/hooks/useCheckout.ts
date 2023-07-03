import { PreRoll } from "@/components/Common/types/common.types";
import { useState } from "react";

const useCheckout = () => {
  const [cartItem, setCartItem] = useState<PreRoll | undefined>();
  const [startIndex, setStartIndex] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<string>("fiat");

  return {
    cartItem,
    setCartItem,
    startIndex,
    setStartIndex,
    paymentType,
    setPaymentType,
  };
};

export default useCheckout;
