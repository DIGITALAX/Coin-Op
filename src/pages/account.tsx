import { NextPage } from "next";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import useSignIn from "@/components/Common/hooks/useSignIn";
import Head from "next/head";
import AllOrders from "@/components/Account/modals/AllOrders";
import useOrders from "@/components/Account/hooks/useOrders";

const Account: NextPage = (): JSX.Element => {
  const profile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const allOrders = useSelector(
    (state: RootState) => state.app.allOrdersReducer.value
  );
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { handleLensSignIn, signInLoading } = useSignIn();
  const { ordersLoading } = useOrders();
  return (
    <div className="relative w-full h-full flex flex-col gap-5">
      <Head>
        <title>Coin Op | Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AllOrders
        signInLoading={signInLoading}
        handleLensSignIn={handleLensSignIn}
        openConnectModal={openConnectModal}
        address={address}
        profile={profile}
        ordersLoading={ordersLoading}
      />
    </div>
  );
};

export default Account;
