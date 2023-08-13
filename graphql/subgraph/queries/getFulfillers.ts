import { gql } from "@apollo/client";
import { graphClient, graphClientTestnet } from "../../../lib/subgraph/client";

const ALL_FULFILLERS = `
  query {
    fulfillerCreateds {
        fulfillerPercent
        fulfillerId
        fulfillerAddress
    }
  }
`;

export const getFulfillers = async (): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(ALL_FULFILLERS),
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
