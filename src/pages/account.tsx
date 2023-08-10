import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import AllOrders from "@/components/Account/modals/AllOrders";
import useOrders from "@/components/Account/hooks/useOrders";
import { setPreRollAnim } from "../../redux/reducers/preRollAnimSlice";
import { useEffect } from "react";

const Account: NextPage = (): JSX.Element => {
  const allOrders = useSelector(
    (state: RootState) => state.app.allOrdersReducer.value
  );
  const preRollAnim = useSelector(
    (state: RootState) => state.app.preRollAnimReducer.value
  );
  const dispatch = useDispatch();
  const { openConnectModal } = useConnectModal();
  const {
    ordersLoading,
    handleDecryptFulfillment,
    decryptLoading,
    orderOpen,
    setOrderOpen,
    connected,
    updateFulfillmentInformation,
    updateLoading,
    updatedInformation,
    setUpdatedInformation,
    decryptMessageLoading,
    handleDecryptMessage,
  } = useOrders();

  useEffect(() => {
    if (preRollAnim) {
      setTimeout(() => {
        console.log("here");
        dispatch(setPreRollAnim(false));
      }, 3000);
    }
  }, [preRollAnim]);
  return (
    <div className="relative w-full h-full flex flex-col gap-5">
      <Head>
        <title>Coin Op | Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AllOrders
        openConnectModal={openConnectModal}
        connected={connected}
        ordersLoading={ordersLoading}
        allOrders={allOrders}
        handleDecryptFulfillment={handleDecryptFulfillment}
        decryptLoading={decryptLoading}
        orderOpen={orderOpen}
        setOrderOpen={setOrderOpen}
        dispatch={dispatch}
        updateFulfillmentInformation={updateFulfillmentInformation}
        updatedInformation={updatedInformation}
        updateLoading={updateLoading}
        setUpdatedInformation={setUpdatedInformation}
        decryptMessageLoading={decryptMessageLoading}
        handleDecryptMessage={handleDecryptMessage}
      />
    </div>
  );
};

export default Account;
