import { CartItem } from "@/components/Common/types/common.types";
import { useState } from "react";

const useCheckout = () => {
  const [cartItem, setCartItem] = useState<CartItem | undefined>();
  const [startIndex, setStartIndex] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<string>("fiat");
  const [cryptoCheckoutLoading, setCryptoCheckoutLoading] =
    useState<boolean>(false);
  const [fiatCheckoutLoading, setFiatCheckoutLoading] =
    useState<boolean>(false);
  const [checkoutCurrency, setCheckoutCurrency] = useState<string>("USDT");

  const handleCheckoutFiat = async () => {
    setFiatCheckoutLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setFiatCheckoutLoading(false);
  };
  const handleCheckoutCrypto = async () => {
    setCryptoCheckoutLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setCryptoCheckoutLoading(false);
  };

  return {
    cartItem,
    setCartItem,
    startIndex,
    setStartIndex,
    paymentType,
    setPaymentType,
    handleCheckoutFiat,
    handleCheckoutCrypto,
    cryptoCheckoutLoading,
    fiatCheckoutLoading,
    checkoutCurrency,
    setCheckoutCurrency,
  };
};

export default useCheckout;
