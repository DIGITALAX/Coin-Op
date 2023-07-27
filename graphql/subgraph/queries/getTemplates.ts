import { gql } from "@apollo/client";
import { graphClientTestnet } from "../../../lib/subgraph/client";

const TEMPLATES_PRINTTYPE = `
  query($printType: String) {
    fgotemplateCreateds(where: {printType: $printType}) {
      childTokenURIs
      childTokenIds
      parentTokenId
      parentURI
      childPosterURIs
      printType
      price
      childPrices
    }
  }
`;

export const getTemplatesByPrintType = async (
  printType: string
): Promise<any> => {
  const queryPromise = graphClientTestnet.query({
    query: gql(TEMPLATES_PRINTTYPE),
    variables: {
      printType,
    },
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
