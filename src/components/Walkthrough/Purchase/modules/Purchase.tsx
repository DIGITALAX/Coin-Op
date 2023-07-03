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
  profile,
  handleLensSignIn,
  openConnectModal,
  setPaymentType,
  paymentType,
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
        handleLensSignIn={handleLensSignIn}
        profile={profile}
        signInLoading={signInLoading}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
      />
    </div>
  );
};

export default Purchase;
