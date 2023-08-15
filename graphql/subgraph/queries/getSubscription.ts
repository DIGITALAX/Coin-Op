import { gql } from "@apollo/client";
import { graphClient, graphClientTestnet } from "../../../lib/subgraph/client";

const SUBSCRIPTION = `
  query($tokenId: String) {
    subscriberAddeds(where: {tokenId: $tokenId},orderBy: blockTimestamp, orderDirection: desc) {
      subscriberId
      subscribedTimestamp
      unSubscribedTimestamp
      resubscribedTimestamp
      isSubscribed
      transactionHash
    }
  }
`;

export const getSubscriptionsPKP = async (tokenId: string): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(SUBSCRIPTION),
    variables: {
      tokenId,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
