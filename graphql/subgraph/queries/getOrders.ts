import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/subgraph/client";

const ORDERS = `
query($buyer: String!) {
  orderCreateds(where: {buyer: $buyer}) {
      orderId
      totalPrice
      currency
      pubId
      blockNumber
      profileId
      buyer
      blockTimestamp
      transactionHash
      images
      names
      messages
      details
      subOrderPrice
      subOrderStatus
      subOrderCollectionIds
      subOrderIsFulfilled
      subOrderAmount
  }
}
`;

const ORDERS_ID = `
  query($buyer: String, $transactionHash: String) {
    orderCreateds(where: {buyer: $buyer, transactionHash: $transactionHash},orderBy: blockTimestamp, orderDirection: desc) {
      orderId
      totalPrice
      currency
      pubId
      blockNumber
      profileId
      buyer
      blockTimestamp
      transactionHash
      images
      names
      messages
      details
      subOrderPrice
      subOrderStatus
      subOrderCollectionIds
      subOrderIsFulfilled
      subOrderAmount
    }
  }
`;

const COLLECTION_ORDER = `
  query($collectionId: String!) {
    collectionCreateds(where: {collectionId: $collectionId}, first: 1) {
      origin
      pubId
      collectionMetadata {
        title
        images
      }
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

export const getOrderInformation = async (
  buyerAddress: string,
  transactionHash: string
): Promise<any> => {
  const queryPromise = graphPrintClient.query({
    query: gql(ORDERS_ID),
    variables: {
      buyerAddress,
      transactionHash,
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

export const getCollectionOrder = async (
  collectionId: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTION_ORDER),
    variables: {
      collectionId,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  timeoutId && clearTimeout(timeoutId);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
