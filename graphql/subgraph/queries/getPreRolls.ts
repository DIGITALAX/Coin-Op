import { gql } from "@apollo/client";
import { graphClient } from "../../../lib/subgraph/client";

const ALL_PREROLLS = `
  query {
    collectionCreateds(orderDirection: desc, orderBy: blockNumber) {
        printType
        price
        discount
        collectionId
        amount
        blockTimestamp
        uri
        fulfillerAddress
      }
  }
`;

const PREROLL_ID = `
  query($collectionId: String) {
    collectionCreateds(where: {collectionId: $collectionId}) {
      printType
      price
      discount
      collectionId
      amount
      blockTimestamp
      uri
      fulfillerAddress
    }
  }
`;

export const getAllPreRolls = async (): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(ALL_PREROLLS),
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 20000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getPreRollId = async (collectionId: string): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(PREROLL_ID),
    variables: {
      collectionId,
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
