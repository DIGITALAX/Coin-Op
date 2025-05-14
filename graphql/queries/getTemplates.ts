import { graphFGOClient } from "@/app/lib/graph/client";
import { gql } from "@apollo/client";

const TEMPLATES_PRINTTYPE = `
  query($printType: Int!) {
    parentCreateds(where: {printType: $printType}) {
        poster
        uri
        printType
        id
        price
        childIds
        children {
          price
          uri
          id
        }
    }
  }
`;

export const getTemplatesByPrintType = async (
  printType: number
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
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
