import { graphFactoryClient } from "@/app/lib/graph/client";
import { gql } from "@apollo/client";

const GET_DESIGNER = `
query($infraId: String!, $designer: String!) {
  designers(where: {infraId: $infraId, designer: $designer}) {
    infraId
    designerId
    designer
    blockNumber
    isActive
    blockTimestamp
    uri
    version
    metadata {
      title
      image
      link
      description
    }
  }
}
`;

export const getDesigner = async (
  infraId: string,
  designer: string
): Promise<any> => {
  const queryPromise = graphFactoryClient.query({
    query: gql(GET_DESIGNER),
    variables: {
      infraId,
      designer,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

