import { gql } from "@apollo/client";
import { graphClient, graphClientTestnet } from "../../../lib/subgraph/client";

const ORDERS = `
  query($buyerAddress: String) {
    orderCreateds(where: {buyer: $buyerAddress},orderBy: blockTimestamp, orderDirection: desc) {
        orderIds
        prices
        totalPrice
        transactionHash
        fulfillmentInformation
        buyer
        blockTimestamp
        isFulfilled
        orderStatus
        orderStatusTimestamps
        blockNumber
        chosenAddress
        collectionIds
    }
  }
`;

export const getOrders = async (buyerAddress: string): Promise<any> => {
  const queryPromise = graphClientTestnet.query({
    query: gql(ORDERS),
    variables: {
      buyerAddress,
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

