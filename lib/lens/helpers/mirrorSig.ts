import { omit } from "lodash";
import { AnyAction, Dispatch } from "redux";
import { PublicClient, WalletClient } from "viem";
import { polygon } from "viem/chains";
import { setIndexModal } from "../../../redux/reducers/indexModalSlice";
import LensHubProxy from "./../../../abis/LensHubProxy.json";
import broadcast from "../../../graphql/lens/mutations/broadcast";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../../constants";
import { RelaySuccess } from "@/components/Common/types/generated";
import handleIndexCheck from "./handleIndexCheck";
import mirrorPost from "../../../graphql/lens/mutations/mirror";

const mirrorSig = async (
  mirrorOn: string,
  clientWallet: WalletClient,
  publicClient: PublicClient,
  address: `0x${string}`,
  dispatch: Dispatch<AnyAction>
) => {
  try {
    const mirror = await mirrorPost({
      mirrorOn,
    });

    const typedData = mirror?.data?.createOnchainMirrorTypedData.typedData;

    const signature = await clientWallet.signTypedData({
      domain: omit(typedData?.domain, ["__typename"]),
      types: omit(typedData?.types, ["__typename"]),
      primaryType: "Mirror",
      message: omit(typedData?.value, ["__typename"]),
      account: address as `0x${string}`,
    });

    const broadcastResult = await broadcast({
      id: mirror?.data?.createOnchainMirrorTypedData?.id,
      signature,
    });

    if (broadcastResult?.data?.broadcastOnchain?.__typename == "RelayError") {
      const { request } = await publicClient.simulateContract({
        address: LENS_HUB_PROXY_ADDRESS_MATIC,
        abi: LensHubProxy,
        functionName: "mirror",
        chain: polygon,
        args: [
          {
            profileId: typedData?.value.profileId,
            metadataURI: typedData?.value.metadataURI,
            pointedProfileId: typedData?.value.pointedProfileId,
            pointedPubId: typedData?.value.pointedPubId,
            referrerProfileIds: typedData?.value.referrerProfileIds,
            referrerPubIds: typedData?.value.referrerPubIds,
            referenceModuleData: typedData?.value.referenceModuleData,
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
          (broadcastResult?.data?.broadcastOnchain as RelaySuccess).txHash,
          dispatch
        );
      }, 7000);
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default mirrorSig;
