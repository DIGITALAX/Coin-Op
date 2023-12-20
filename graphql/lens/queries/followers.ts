import { FetchResult } from "@apollo/client";
import { authClient, apolloClient } from "../../../lib/lens/client";
import {
  FollowersDocument,
  FollowersQuery,
  FollowersRequest,
} from "@/components/Common/types/generated";

export const followers = async (
  request: FollowersRequest,
  connected: boolean
): Promise<FetchResult<FollowersQuery>> => {
  return await (connected ? apolloClient : authClient).query({
    query: FollowersDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default followers;
