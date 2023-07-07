import { gql } from "@apollo/client";
import { graphClientTestnet } from "../../../lib/subgraph/client";

const TEMPLATES_PRINTTYPE = `
  query {
    collectionMinteds(orderBy: blockTimestamp) {
        amount
        acceptedTokens
        basePrices
        blockTimestamp
        collectionId
        discount
        dropId
        fulfillerId
        grantCollectorsOnly
        grantName
        owner
        printType
        uri
        tokenIds
        pubId
        dynamicNFTAddress
      }
  }
`;

export const getTemplatesByPrintType = async (): Promise<any> => {
  const queryPromise = graphClientTestnet.query({
    query: gql(TEMPLATES_PRINTTYPE),
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
