import { omit } from "lodash";
import { AnyAction, Dispatch } from "redux";
import { PublicClient, WalletClient } from "viem";
import { polygon } from "viem/chains";
import handleIndexCheck from "./handleIndexCheck";
import LensHubProxy from "./../../../abis/LensHubProxy.json";
import { setIndexModal } from "../../../redux/reducers/indexModalSlice";
import {
  ActOnOpenActionInput,
  RelaySuccess,
} from "@/components/Common/types/generated";
import broadcast from "../../../graphql/lens/mutations/broadcast";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../../constants";
import { collectPost } from "../../../graphql/lens/mutations/collect";

const actSig = async (
  forId: string,
  actOn: ActOnOpenActionInput,
  clientWallet: WalletClient,
  publicClient: PublicClient,
  address: `0x${string}`,
  dispatch: Dispatch<AnyAction>
) => {
  try {
    const collect = await collectPost({
      for: forId,
      actOn,
    });
    const typedData = collect.data?.createActOnOpenActionTypedData.typedData;

    const signature = await clientWallet.signTypedData({
      domain: omit(typedData?.domain, ["__typename"]),
      types: omit(typedData?.types, ["__typename"]),
      primaryType: "Act",
      message: omit(typedData?.value, ["__typename"]),
      account: address as `0x${string}`,
    });

    const broadcastResult = await broadcast({
      id: collect?.data?.createActOnOpenActionTypedData?.id,
      signature,
    });
    if (broadcastResult?.data?.broadcastOnchain?.__typename == "RelayError") {
      const { request } = await publicClient.simulateContract({
        address: LENS_HUB_PROXY_ADDRESS_MATIC,
        abi: LensHubProxy,
        functionName: "act",
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
        ],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      const tx = await publicClient.waitForTransactionReceipt({ hash: res });
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Indexing Interaction",
        })
      );
      await handleIndexCheck(
        {
          forTxHash: tx.transactionHash,
        },
        dispatch
      );
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
