import { FunctionComponent } from "react";
import { PurchaseProps } from "../types/synth.types";
import Grid from "./Grid";

const Purchase: FunctionComponent<PurchaseProps> = ({
  dispatch,
  scrollRef,
  cartItems,
  signInLoading,
  address,
  openConnectModal,
  chain,
  openChainModal,
  fulfillmentDetails,
  handleApproveSpend,
  cryptoCheckoutLoading,
  handleCheckoutCrypto,
  approved,
  oracleValue,
  cartItem,
  checkoutCurrency,
  setCartItem,
  setCheckoutCurrency,
  encryptFulfillment,
  encrypted,
  setOpenCountryDropDown,
  openCountryDropDown,
  setFulfillmentDetails,
  setStartIndex,
  startIndex,
  lensConnected,
  handleLensSignIn,
  setEncrypted,
  router,
  t,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col">
      <Grid
        router={router}
        setEncrypted={setEncrypted}
        lensConnected={lensConnected}
        handleLensSignIn={handleLensSignIn}
        oracleValue={oracleValue}
        checkoutCurrency={checkoutCurrency}
        setCartItem={setCartItem}
        setFulfillmentDetails={setFulfillmentDetails}
        cartItem={cartItem}
        setCheckoutCurrency={setCheckoutCurrency}
        encryptFulfillment={encryptFulfillment}
        dispatch={dispatch}
        scrollRef={scrollRef}
        cartItems={cartItems}
        address={address}
        t={t}
        openConnectModal={openConnectModal}
        signInLoading={signInLoading}
        fulfillmentDetails={fulfillmentDetails}
        chain={chain}
        openChainModal={openChainModal}
        handleApproveSpend={handleApproveSpend}
        handleCheckoutCrypto={handleCheckoutCrypto}
        approved={approved}
        cryptoCheckoutLoading={cryptoCheckoutLoading}
        openCountryDropDown={openCountryDropDown}
        setOpenCountryDropDown={setOpenCountryDropDown}
        encrypted={encrypted}
        setStartIndex={setStartIndex}
        startIndex={startIndex}
      />
    </div>
  );
};

export default Purchase;
