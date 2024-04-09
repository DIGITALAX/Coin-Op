import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../../lib/lens/client";
import {
  LensTransactionStatusRequest,
  LensTransactionStatusQuery,
  LensTransactionStatusDocument,
  LensTransactionStatusType,
} from "./../../../src/components/Common/types/generated";
import { AnyAction, Dispatch } from "redux";
import { setIndexModal } from "../../../redux/reducers/indexModalSlice";
import { setModalOpen } from "../../../redux/reducers/modalOpenSlice";
import { TFunction } from "i18next";

const handleIndexCheck = async (
  tx: LensTransactionStatusRequest,
  dispatch: Dispatch<AnyAction>,
  t: TFunction<"common", undefined>
) => {
  const indexedStatus = await pollUntilIndexed(tx);
  if (indexedStatus) {
    dispatch(
      setIndexModal({
        actionOpen: true,
        actionMessage: t("succ"),
      })
    );
  } else {
    dispatch(
      setModalOpen({
        actionOpen: true,
        actionMessage: t("try"),
      })
    );
  }

  const timeoutId = setTimeout(() => {
    dispatch(
      setIndexModal({
        actionOpen: false,
        actionMessage: undefined,
      })
    );
  }, 3000);

  return () => clearTimeout(timeoutId);
};

export const getIndexed = async (
  request: LensTransactionStatusRequest
): Promise<FetchResult<LensTransactionStatusQuery>> => {
  return await apolloClient.query({
    query: LensTransactionStatusDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};

const pollUntilIndexed = async (
  request: LensTransactionStatusRequest
): Promise<boolean> => {
  let count = 0;
  while (count < 10) {
    try {
      const { data } = await getIndexed(request);
      if (data && data.lensTransactionStatus) {
        switch (data.lensTransactionStatus.status) {
          case LensTransactionStatusType.Failed:
            return false;
          case LensTransactionStatusType.OptimisticallyUpdated:
          case LensTransactionStatusType.Complete:
            return true;
          case LensTransactionStatusType.Processing:
            count += 1;
            await new Promise((resolve) => setTimeout(resolve, 6000));
            if (count == 10) return true;
            break;
          default:
            throw new Error("Unexpected status");
        }
      }
    } catch (err: any) {
      count += 1;
      console.error(err.message);
      continue;
    }
  }
  return false;
};

export default handleIndexCheck;
