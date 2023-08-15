import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessagesModal } from "../../../../redux/reducers/messagesModalSlice";
import { RootState } from "../../../../redux/store";
import { setModalOpen } from "../../../../redux/reducers/modalOpenSlice";
import { joinSignature } from "@ethersproject/bytes";
import { serialize } from "@ethersproject/transactions";
import CoinOpPKPABI from "../../../../abis/CoinOpMarket.json";
import { setSubscriptionInfo } from "../../../../redux/reducers/subscriptionInfoSlice";
import { useRouter } from "next/router";
import {
  COIN_OP_SUBSCRIPTION,
  IPFS_CID_PKP,
  PKP_ADDRESS,
  PKP_PUBLIC_KEY,
} from "../../../../lib/constants";
import { ethers } from "ethers";
import { setIsSubscribed } from "../../../../redux/reducers/isSubscribedSlice";
import { connectLit } from "../../../../lib/subgraph/helpers/connectLit";
import CoinOpSubscriptionABI from "../../../../abis/CoinOpSubscription.json";

const useSubscription = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [subscriptionLoading, setSubscriptionLoading] =
    useState<boolean>(false);
  const subscriptionInfo = useSelector(
    (state: RootState) => state.app.subscriptionInfoReducer.value
  );
  const litClient = useSelector(
    (state: RootState) => state.app.litClientReducer.value
  );
  const currentPKP = useSelector(
    (state: RootState) => state.app.currentPKPReducer.value
  );

  const handleSubscription = async (): Promise<void> => {
    setSubscriptionLoading(true);
    try {
      if (!stripe || !elements || !currentPKP) {
        return;
      }

      if (
        subscriptionInfo?.email.trim() === "" ||
        subscriptionInfo?.firstName.trim() === "" ||
        subscriptionInfo?.lastName.trim() === ""
      ) {
        dispatch(
          setModalOpen({
            actionOpen: true,
            actionMessage: "Fill out your Contact & Payment details first.",
          })
        );
        return;
      }

      const cardElement = elements.getElement("card");

      if (!cardElement) {
        dispatch(
          setMessagesModal({
            actionOpen: true,
            actionMessage: "Something went wrong. Try again?",
          })
        );
        return;
      }

      const result = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (result.error) {
        dispatch(
          setMessagesModal({
            actionOpen: true,
            actionMessage: "Something went wrong. Try again?",
          })
        );
        return;
      }

      const paymentMethodId = result.paymentMethod.id;
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: subscriptionInfo!.email,
          firstName: subscriptionInfo!.firstName,
          lastName: subscriptionInfo!.lastName,
          paymentMethodId,
        }),
      });
      await res.json();

      if (res.status === 200) {
        await createPKPSubscription();
        setSubscriptionLoading(false);
        dispatch(
          setSubscriptionInfo({
            email: "",
            firstName: "",
            lastName: "",
          })
        );
        dispatch(
          setMessagesModal({
            actionOpen: true,
            actionMessage:
              "Subscription Confirmed. Return to your account page soon for next steps and keep an eye out on your email for web3 and AI instructables.",
          })
        );
        dispatch(setIsSubscribed(true));
        await router.push("account");
      }
    } catch (err: any) {
      setSubscriptionLoading(false);
      dispatch(
        setMessagesModal({
          actionOpen: true,
          actionMessage: "Something went wrong. Try again?",
        })
      );
      console.error(err.messsage);
    }
  };

  const createTxData = async (provider: ethers.providers.JsonRpcProvider) => {
    try {
      const contractInterface = new ethers.utils.Interface(
        CoinOpSubscriptionABI as any
      );

      const latestBlock = await provider.getBlock("latest");
      const baseFeePerGas = latestBlock.baseFeePerGas;
      const maxFeePerGas = baseFeePerGas?.add(
        ethers.utils.parseUnits("10", "gwei")
      );
      const maxPriorityFeePerGas = ethers.utils.parseUnits("3", "gwei");
      return {
        to: COIN_OP_SUBSCRIPTION,
        nonce: (await provider.getTransactionCount(PKP_ADDRESS)) || 0,
        chainId: 137,
        gasLimit: ethers.BigNumber.from("8000000"),
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        from: "{{publicKey}}",
        data: contractInterface.encodeFunctionData("subscribeWithPKP", [
          BigInt(currentPKP?.tokenId.hex!).toString(),
        ]),
        value: ethers.BigNumber.from(0),
        type: 2,
      };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const createPKPSubscription = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        137
      );
      const tx = await createTxData(provider);

      let client = litClient;
      if (!client) {
        client = await connectLit(dispatch);
      }

      const results = await client.executeJs({
        ipfsId: IPFS_CID_PKP,
        authSig: currentPKP?.authSig,
        jsParams: {
          publicKey: PKP_PUBLIC_KEY,
          tx,
          sigName: "addSubscription",
        },
      });

      const signature = results.signatures["addSubscription"];
      const sig: {
        r: string;
        s: string;
        recid: number;
        signature: string;
        publicKey: string;
        dataSigned: string;
      } = signature as {
        r: string;
        s: string;
        recid: number;
        signature: string;
        publicKey: string;
        dataSigned: string;
      };

      const encodedSignature = joinSignature({
        r: "0x" + sig.r,
        s: "0x" + sig.s,
        recoveryParam: sig.recid,
      });
      const serialized = serialize(tx as any, encodedSignature);
      const transactionHash = await provider.sendTransaction(serialized);

      await transactionHash.wait();
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return {
    handleSubscription,
    subscriptionLoading,
  };
};

export default useSubscription;
