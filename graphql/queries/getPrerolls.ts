import { graphPrintClient } from "@/app/lib/graph/client";
import { FetchResult, gql } from "@apollo/client";

const ALL_PREROLLS = `
  query($origin: String!) {
    collectionCreateds(where: { origin: $origin }, orderDirection: desc, orderBy: blockNumber, first: 1000) {
      amount
      drop {
        metadata {
          cover
          title
        }
        collections {
          collectionId
        }
        uri
      }
      metadata {
        access
        visibility
        video
        title
        onChromadin
        sex
        style
        tags
        prompt
        sizes
        microbrand
        mediaTypes
        mediaCover
        id
        description
        audio
        colors
        images
        microbrandCover
      }
      postId
      acceptedTokens
      uri
      printType
      price
      designer
      tokenIdsMinted
      dropId
      collectionId
      unlimited
      origin
      blockTimestamp
      }
  }
`;

const PREROLL_ID = `
  query($collectionId: String) {
    collectionCreateds(where: {collectionId: $collectionId}, first: 1) {
      amount
      drop {
        metadata {
          cover
          title
        }
        collections {
          collectionId
        }
        uri
      }
      metadata {
        access
        visibility
        video
        title
        onChromadin
        sex
        style
        tags
        prompt
        sizes
        microbrand
        mediaTypes
        mediaCover
        id
        description
        audio
        colors
        images
        microbrandCover
      }
      postId
      acceptedTokens
      uri
      printType
      price
      designer
      tokenIdsMinted
      dropId
      collectionId
      unlimited
      origin
      blockTimestamp
      }
  }
`;

export const getAllPrerolls = async (): Promise<any> => {
  const queryPromise = graphPrintClient.query({
    query: gql(ALL_PREROLLS),
    variables: {
      origin: "1",
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

export const getPrerollId = async (collectionId: string): Promise<any> => {
  const queryPromise = graphPrintClient.query({
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

export const getPrerollSearch = async (
  where: Object
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(`
    query($first: Int, $skip: Int) {
      collectionCreateds(where: {${serializeQuery(
        where
      )}}, first: 1000, orderDirection: desc, orderBy: blockTimestamp) {
        amount
      drop {
        metadata {
          cover
          title
        }
        collections {
          collectionId
        }
        uri
      }
      metadata {
        access
        visibility
        video
        title
        onChromadin
        sex
        style
        tags
        prompt
        sizes
        microbrand
        mediaTypes
        mediaCover
        id
        description
        audio
        colors
        images
        microbrandCover
      }
      postId
      acceptedTokens
      uri
      printType
      price
      designer
      tokenIdsMinted
      dropId
      collectionId
      unlimited
      origin
      blockTimestamp
      }
    }
  `),
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
    return () => clearTimeout(timeoutId);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);

  timeoutId && clearTimeout(timeoutId);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

const serializeQuery = (
  obj: { [key: string]: any },
  depth: number = 0
): string => {
  const indent: string = "  ".repeat(depth);
  const entries: string[] = Object.entries(obj).map(([key, value]): string => {
    if (Array.isArray(value)) {
      const arrayValues: string = value
        .map((val) => {
          if (typeof val === "object" && val !== null) {
            // Enclose each object in the array with {}
            return `{\n${serializeQuery(val, depth + 1)}\n${indent}}`;
          } else {
            return serializeQuery(val, depth + 1);
          }
        })
        .join(",\n" + indent);
      return `${key}: [\n${indent}${arrayValues}\n${indent}]`;
    } else if (typeof value === "object" && value !== null) {
      return `${key}: {\n${serializeQuery(value, depth + 1)}\n${indent}}`;
    } else {
      return `${key}: ${JSON.stringify(value)}`;
    }
  });
  return entries.join(",\n" + indent);
};
