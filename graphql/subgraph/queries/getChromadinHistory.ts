import { gql } from "@apollo/client";
import { graphClientChromadin } from "../../../lib/subgraph/client";

const HISTORY_CHROMADIN = `
  query($buyer: String!) {
    tokensBoughts(where: {buyer: $buyer}) {
        tokenIds
    }
    updatedChromadinMarketTokensBoughts(where: {buyer: $buyer}) {
        tokenIds
    }
  }
`;

export const getChromadinBought = async (buyer: string): Promise<any> => {
  const queryPromise = graphClientChromadin.query({
    query: gql(HISTORY_CHROMADIN),
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
