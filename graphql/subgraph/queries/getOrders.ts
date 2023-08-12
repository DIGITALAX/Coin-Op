import { gql } from "@apollo/client";
import { graphClient, graphClientTestnet } from "../../../lib/subgraph/client";

const ORDERS = `
  query($buyerAddress: String) {
    orderCreateds(where: {buyer: $buyerAddress},orderBy: blockTimestamp, orderDirection: desc) {
      transactionHash
      totalPrice
      subOrderStatuses
      subOrderIsFulfilled
      subOrderIds
      sinPKP
      prices
      orderId
      message
      fulfillmentInformation
      fulfillerIds
      collectionIds
      pkpTokenId
      chosenAddress
      buyer
      blockTimestamp
      blockNumber
    }
  }
`;

const ORDERS_PKP = `
  query($pkpTokenId: String) {
    orderCreateds(where: {pkpTokenId: $pkpTokenId},orderBy: blockTimestamp, orderDirection: desc) {
      transactionHash
      totalPrice
      subOrderStatuses
      subOrderIsFulfilled
      subOrderIds
      sinPKP
      pkpTokenId
      prices
      orderId
      message
      fulfillmentInformation
      fulfillerIds
      collectionIds
      chosenAddress
      buyer
      blockTimestamp
      blockNumber
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

export const getOrdersPKP = async (pkpTokenId: string): Promise<any> => {
  const queryPromise = graphClientTestnet.query({
    query: gql(ORDERS_PKP),
    variables: {
      pkpTokenId,
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
