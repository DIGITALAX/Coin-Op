import { graphPrintClient } from "@/app/lib/graph/client";
import {  gql } from "@apollo/client";

const ORDERS = `
query($buyer: String!) {
  orderCreateds(where: {buyer: $buyer}) {
       orderId
      totalPrice
      currency
      postId
      blockNumber
      buyer
      blockTimestamp
      transactionHash
      collection {
      collectionId
        metadata {
          images
          title
        }
      }
      messages
      details
       isFulfilled
      status
  }
}
`;

export const getOrders = async (buyer: string): Promise<any> => {
  const queryPromise = graphPrintClient.query({
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
