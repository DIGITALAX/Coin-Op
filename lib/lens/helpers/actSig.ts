import { omit } from "lodash";
import { AnyAction, Dispatch } from "redux";
import { PublicClient, WalletClient } from "viem";
import { polygon } from "viem/chains";
import { splitSignature } from "ethers/lib/utils";
import handleIndexCheck from "./handleIndexCheck";
import LensHubProxy from "./../../../abis/LensHubProxy.json";
import { setPurchase } from "../../../redux/reducers/purchaseSlice";
import { setIndexModal } from "../../../redux/reducers/indexModalSlice";
import {
  ActOnOpenActionInput,
  RelaySuccess,
} from "@/components/Common/types/generated";
import collect from "../../../graphql/lens/mutations/collect";
import broadcast from "../../../graphql/lens/mutations/broadcast";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../../constants";

const actSig = async (
  forId: string,
  actOn: ActOnOpenActionInput,
  clientWallet: WalletClient,
  publicClient: PublicClient,
  address: `0x${string}`,
  dispatch: Dispatch<AnyAction>
) => {
  try {
    const collectPost = await collect({
      for: forId,
      actOn,
    });
    const typedData =
      collectPost.data?.createActOnOpenActionTypedData.typedData;

    const signature = await clientWallet.signTypedData({
      domain: omit(typedData?.domain, ["__typename"]),
      types: omit(typedData?.types, ["__typename"]),
      primaryType: "Act",
      message: omit(typedData?.value, ["__typename"]),
      account: address as `0x${string}`,
    });

    const broadcastResult = await broadcast({
      id: collectPost?.data?.createActOnOpenActionTypedData?.id,
      signature,
    });
    if (broadcastResult?.data?.broadcastOnchain?.__typename == "RelayError") {
      const { v, r, s } = splitSignature(signature);
      const { request } = await publicClient.simulateContract({
        address: LENS_HUB_PROXY_ADDRESS_MATIC,
        abi: LensHubProxy,
        functionName: "actWithSig",
        chain: polygon,
        args: [
          {
            publicationActedProfileId:
              typedData?.value.publicationActedProfileId,
            publicationActedId: typedData?.value.publicationActedId,
            actorProfileId: typedData?.value.actorProfileId,
            referrerProfileIds: typedData?.value.referrerProfileIds,
            referrerPubIds: typedData?.value.referrerPubIds,
            actionModuleAddress: typedData?.value.actionModuleAddress,
            actionModuleData: typedData?.value.actionModuleData,
          },
          {
            v,
            r,
            s,
            deadline: typedData?.value.deadline,
            signer: address,
          },
        ],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      dispatch(
        setPurchase({
          actionOpen: false,
          actionId: "",
          actionIndex: undefined,
        })
      );
      await publicClient.waitForTransactionReceipt({ hash: res });
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Indexing Interaction",
        })
      );
      await handleIndexCheck(res, dispatch);
    } else {
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Indexing Interaction",
        })
      );
      setTimeout(async () => {
        await handleIndexCheck(
          (broadcastResult?.data?.broadcastOnchain as RelaySuccess)?.txHash,
          dispatch
        );
      }, 7000);
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default actSig;
