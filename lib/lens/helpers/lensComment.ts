import { omit } from "lodash";
import LensHubProxy from "./../../../abis/LensHubProxy.json";
import { AnyAction, Dispatch } from "redux";
import commentPost from "../../../graphql/lens/mutations/comment";
import { polygon } from "viem/chains";
import broadcast from "../../../graphql/lens/mutations/broadcast";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../../constants";
import { PublicClient, WalletClient } from "viem";
import handleIndexCheck from "../../../graphql/lens/queries/indexed";
import {
  InputMaybe,
  OpenActionModuleInput,
} from "@/components/Common/types/generated";
import validateMetadata from "../../../graphql/lens/queries/validate";
import cleanCollect from "./cleanCollect";
import { setModalOpen } from "../../../redux/reducers/modalOpenSlice";
import { setIndexModal } from "../../../redux/reducers/indexModalSlice";

const lensComment = async (
  id: string,
  contentURI: string,
  dispatch: Dispatch<AnyAction>,
  openActionModules: InputMaybe<OpenActionModuleInput[]> | undefined,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient,
  clearComment: () => void
): Promise<void> => {
  if (
    openActionModules &&
    openActionModules?.hasOwnProperty("collectOpenAction") &&
    openActionModules?.[0]?.collectOpenAction?.hasOwnProperty(
      "simpleCollectOpenAction"
    )
  ) {
    openActionModules = cleanCollect(openActionModules);
  }

  const metadata = await validateMetadata({
    rawURI: contentURI,
  });

  if (!metadata?.data?.validatePublicationMetadata.valid) {
    dispatch(
      setModalOpen({
        actionOpen: true,
        actionMessage:
          "Something went wrong indexing your interaction. Try again?",
      })
    );
    return;
  }

  const data = await commentPost({
    commentOn: id,
    contentURI: contentURI,
    openActionModules,
  });

  const typedData = data?.data?.createOnchainCommentTypedData.typedData;

  const signature = await clientWallet.signTypedData({
    domain: omit(typedData?.domain, ["__typename"]),
    types: omit(typedData?.types, ["__typename"]),
    primaryType: "Comment",
    message: omit(typedData?.value, ["__typename"]),
    account: address as `0x${string}`,
  });

  const broadcastResult = await broadcast({
    id: data?.data?.createOnchainCommentTypedData?.id,
    signature,
  });

  if (broadcastResult?.data?.broadcastOnchain.__typename === "RelaySuccess") {
    clearComment();
    await handleIndexCheck(
      {
        forTxId: broadcastResult?.data?.broadcastOnchain.txId,
      },
      dispatch
    );
  } else {
    const { request } = await publicClient.simulateContract({
      address: LENS_HUB_PROXY_ADDRESS_MATIC,
      abi: LensHubProxy,
      functionName: "comment",
      chain: polygon,
      args: [
        {
          profileId: typedData?.value.profileId,
          contentURI: typedData?.value.contentURI,
          pointedProfileId: typedData?.value.pointedProfileId,
          pointedPubId: typedData?.value.pointedPubId,
          referrerProfileIds: typedData?.value.referrerProfileIds,
          referrerPubIds: typedData?.value.referrerPubIds,
          referenceModuleData: typedData?.value.referenceModuleData,
          actionModules: typedData?.value.actionModules,
          actionModulesInitDatas: typedData?.value.actionModulesInitDatas,
          referenceModule: typedData?.value.referenceModule,
          referenceModuleInitData: typedData?.value.referenceModuleInitData,
        },
      ],
      account: address,
    });
    const res = await clientWallet.writeContract(request);
    const tx = await publicClient.waitForTransactionReceipt({ hash: res });
    dispatch(
      setIndexModal({
        actionOpen: true,
        actionMessage: "Indexing Interaction",
      })
    );
    clearComment();
    await handleIndexCheck(
      {
        forTxHash: tx.transactionHash,
      },
      dispatch
    );
  }
  setTimeout(() => {
    dispatch(
      setIndexModal({
        actionOpen: false,
        actionMessage: undefined,
      })
    );
  }, 3000);
};

export default lensComment;
