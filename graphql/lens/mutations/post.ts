import { FetchResult } from "@apollo/client";
import {
  CreateOnchainPostTypedDataDocument,
  CreateOnchainPostTypedDataMutation,
  OnchainPostRequest,
} from "./../../../src/components/Common/types/generated";
import { apolloClient } from "../../../lib/lens/client";

export const createPostTypedData = async (
  request: OnchainPostRequest
): Promise<FetchResult<CreateOnchainPostTypedDataMutation>> => {
  return await apolloClient.mutate({
    mutation: CreateOnchainPostTypedDataDocument,
    variables: {
      request,
    },
  });
};
