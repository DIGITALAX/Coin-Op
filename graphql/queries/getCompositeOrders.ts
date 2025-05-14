import { graphFGOClient } from "@/app/lib/graph/client";
import { gql } from "@apollo/client";

const ORDERS = `
query($buyer: String!) {
  orderCreateds(where: {buyer: $buyer}) {
    orderId
      totalPrice
      currency
      parentId
      tokenId
      parentTokenId
      blockNumber
      buyer
      blockTimestamp
      transactionHash
      compositeURI
      compositeMetadata {
      image 
      title
      color
      size
      }
      messages
      details
      isFulfilled
      status
  }
}
`;

export const getCompositeOrders = async (buyer: string): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(ORDERS),
    variables: {
      buyer,
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
