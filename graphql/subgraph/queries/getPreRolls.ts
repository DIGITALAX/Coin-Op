import { gql } from "@apollo/client";
import { graphClientTestnet } from "../../../lib/subgraph/client";

const ALL_PREROLLS = `
  query {
    collectionCreateds {
        printType
        price
        discount
        collectionId
        amount
        blockTimestamp
        uri
      }
  }
`;

export const getAllPreRolls = async (): Promise<any> => {
  const queryPromise = graphClientTestnet.query({
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