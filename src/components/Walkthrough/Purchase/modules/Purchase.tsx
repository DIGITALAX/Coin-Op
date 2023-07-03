import { FunctionComponent } from "react";
import Grid from "./Grid";
import { PurchaseProps } from "../types/synth.types";

const Purchase: FunctionComponent<PurchaseProps> = ({
  dispatch,
  scrollRef,
  cartItems,
  cartItem,
  setCartItem,
  setStartIndex,
  startIndex,
  signInLoading,
  address,
  openConnectModal,
  setPaymentType,
  paymentType,
  handleCheckoutCrypto,
  handleCheckoutFiat,
  fiatCheckoutLoading,
  cryptoCheckoutLoading,
  checkoutCurrency,
  setCheckoutCurrency,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col">
      <Grid
        dispatch={dispatch}
        scrollRef={scrollRef}
        cartItems={cartItems}
        cartItem={cartItem}
        setCartItem={setCartItem}
        startIndex={startIndex}
        setStartIndex={setStartIndex}
        address={address}
        openConnectModal={openConnectModal}
        signInLoading={signInLoading}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        handleCheckoutCrypto={handleCheckoutCrypto}
        handleCheckoutFiat={handleCheckoutFiat}
        fiatCheckoutLoading={fiatCheckoutLoading}
        cryptoCheckoutLoading={cryptoCheckoutLoading}
        checkoutCurrency={checkoutCurrency}
        setCheckoutCurrency={setCheckoutCurrency}
      />
    </div>
  );
};

export default Purchase;
