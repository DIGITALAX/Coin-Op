import quotePost from "../../../graphql/lens/mutations/quote";
import { omit } from "lodash";
import LensHubProxy from "./../../../abis/LensHubProxy.json";
import { AnyAction, Dispatch } from "redux";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../../constants";
import { polygon } from "viem/chains";
import { PublicClient, WalletClient } from "viem";
import {
  InputMaybe,
  OpenActionModuleInput,
} from "@/components/Common/types/generated";
import cleanCollect from "./cleanCollect";
import validateMetadata from "../../../graphql/lens/queries/validate";
import { setModalOpen } from "../../../redux/reducers/modalOpenSlice";
import broadcast from "../../../graphql/lens/mutations/broadcast";
import { setIndexModal } from "../../../redux/reducers/indexModalSlice";
import handleIndexCheck from "./handleIndexCheck";
import { TFunction } from "i18next";

const lensQuote = async (
  quoteOn: string,
  contentURI: string,
  dispatch: Dispatch<AnyAction>,
  openActionModules: InputMaybe<OpenActionModuleInput[]> | undefined,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient,
  t: TFunction<"common", undefined>,
  closeBox?: () => void
): Promise<void> => {
  if (
    openActionModules &&
    openActionModules?.[0]?.hasOwnProperty("collectOpenAction") &&
    openActionModules?.[0]?.collectOpenAction?.hasOwnProperty(
      "simpleCollectOpenAction"
    )
  ) {
    openActionModules = cleanCollect(openActionModules);
  } else {
    openActionModules = [
      {
        collectOpenAction: {
          simpleCollectOpenAction: {
            followerOnly: false,
          },
        },
      },
    ];
  }

  const metadata = await validateMetadata({
    rawURI: contentURI,
  });

  if (!metadata?.data?.validatePublicationMetadata.valid) {
    dispatch(
      setModalOpen({
        actionOpen: true,
        actionMessage: t("try"),
      })
    );
    return;
  }

  const data = await quotePost({
    contentURI,
    quoteOn,
    openActionModules,
  });

  const typedData = data?.data?.createOnchainQuoteTypedData?.typedData;

  const signature = await clientWallet.signTypedData({
    domain: omit(typedData?.domain, ["__typename"]),
    types: omit(typedData?.types, ["__typename"]),
    primaryType: "Quote",
    message: omit(typedData?.value, ["__typename"]),
    account: address as `0x${string}`,
  });

  const broadcastResult = await broadcast({
    id: data?.data?.createOnchainQuoteTypedData?.id,
    signature,
  });

  if (broadcastResult?.data?.broadcastOnchain.__typename === "RelaySuccess") {
    dispatch(
      setIndexModal({
        actionOpen: true,
        actionMessage: t("index"),
      })
    );
    closeBox && closeBox();
    await handleIndexCheck(
      {
        forTxId: broadcastResult?.data?.broadcastOnchain?.txId,
      },
      dispatch,
      t
    );
  } else {
    const { request } = await publicClient.simulateContract({
      address: LENS_HUB_PROXY_ADDRESS_MATIC,
      abi: LensHubProxy,
      functionName: "quote",
      chain: polygon,
      args: [
        {
          profileId: typedData?.value.profileId,
          contentURI: typedData?.value.contentURI,
          pointedProfileId: typedData?.value?.pointedProfileId,
          pointedPubId: typedData?.value?.pointedPubId,
          referrerProfileIds: typedData?.value?.referrerProfileIds,
          referrerPubIds: typedData?.value?.referrerPubIds,
          referenceModuleData: typedData?.value?.referenceModuleData,
          actionModules: typedData?.value.actionModules,
          actionModulesInitDatas: typedData?.value.actionModulesInitDatas,
          referenceModule: typedData?.value.referenceModule,
          referenceModuleInitData: typedData?.value.referenceModuleInitData,
        },
      ],
      account: address,
    });
    const res = await clientWallet.writeContract(request);
    dispatch(
      setIndexModal({
        actionOpen: true,
        actionMessage: t("index"),
      })
    );
    closeBox && closeBox();
    const tx = await publicClient.waitForTransactionReceipt({ hash: res });
    await handleIndexCheck(
      {
        forTxHash: tx.transactionHash,
      },
      dispatch,
      t
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

export default lensQuote;
