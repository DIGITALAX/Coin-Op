import { NextPage } from "next";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import useSignIn from "@/components/Common/hooks/useSignIn";

const Account: NextPage = (): JSX.Element => {
  const profile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { handleLensSignIn, signInLoading } = useSignIn();
  return <div className="relative w-full h-full flex flex-col gap-5"></div>;
};

export default Account;
