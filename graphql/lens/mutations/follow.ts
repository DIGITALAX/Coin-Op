import { FetchResult } from "@apollo/client";
import {
  CreateFollowTypedDataDocument,
  CreateFollowTypedDataMutation,
  FollowRequest,
} from "./../../../src/components/Common/types/generated";
import { apolloClient } from "../../../lib/lens/client";

const createFollowTypedData = async (
  request: FollowRequest
): Promise<FetchResult<CreateFollowTypedDataMutation>> => {
  return await apolloClient.mutate({
    mutation: CreateFollowTypedDataDocument,
    variables: {
      request,
    },
    fetchPolicy: "no-cache",
  });
};

export default createFollowTypedData;
