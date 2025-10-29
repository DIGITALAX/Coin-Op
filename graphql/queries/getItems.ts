import { graphFactoryClient } from "@/app/lib/graph/client";
import { gql } from "@apollo/client";

const PARENTS = `
query($designer: String!, $parentContract: String!) {
  parents(where: {designer: $designer, parentContract: $parentContract, status: 2}, orderBy: blockTimestamp, orderDirection: desc) {
    infraId
    designId
    parentContract
    designer
    designerProfile {
      uri
      metadata {
        title
        description
        image
      }
    }
    scm
    title
    symbol
    digitalPrice
    physicalPrice
    printType
    availability
    infraCurrency
    digitalMarketsOpenToAll
    physicalMarketsOpenToAll
    authorizedMarkets {
      contractAddress
      isActive
      title
      symbol
      marketURI
      marketMetadata {
        title
        description
        image
      }
      infraId
    }
    status
    totalPurchases
    maxDigitalEditions
    maxPhysicalEditions
    currentDigitalEditions
    currentPhysicalEditions
    childReferences {
      childContract
      childId
      amount
      isTemplate
      childTemplate {
        uri
        status
        availability
        physicalPrice
        metadata {
          title
          image
        }
      }
      child {
        uri
        status
        availability
        physicalPrice
        metadata {
          title 
          image
        }
      }
    }
    tokenIds
    createdAt
    updatedAt
    blockNumber
    blockTimestamp
    transactionHash
    uri
    metadata {
      id
      title
      description
      image
      tags
      prompt
      attachments {
        uri
        type
      }
      aiModel
      loras
      workflow
      version
    }
    marketRequests {
      tokenId
      marketContract
      isPending
      approved
      timestamp
    }
    authorizedChildren {
      childContract
      childId
      availability
      uri
      metadata {
        image
        title
      }
    }
    authorizedTemplates {
      templateContract
      templateId
      availability
      uri
      metadata {
        title
        image
      }
    }
    workflow {
      estimatedDeliveryDuration
      digitalSteps {
        instructions
        fulfiller {
          fulfiller
          uri
          isActive
          basePrice
          vigBasisPoints
          metadata {
            title
            image
          }
        }
        subPerformers {
          performer
          splitBasisPoints
        }
      }
      physicalSteps {
        instructions
        fulfiller {
          fulfiller
          uri
          isActive
          basePrice
          vigBasisPoints
          metadata {
            title
            image
          }
        }
        subPerformers {
          performer
          splitBasisPoints
        }
      }
    }
  }
}
`;

export const getParents = async (
  designer: string,
  parentContract: string
): Promise<any> => {
  const queryPromise = graphFactoryClient.query({
    query: gql(PARENTS),
    variables: {
      designer,
      parentContract,
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

const TEMPLATE = `
query($templateId: Int!, $templateContract: String!) {
  templates(where: {templateId: $templateId, templateContract: $templateContract}, orderBy: blockTimestamp, orderDirection: desc) {
    templateId
    templateContract
    supplier 
    supplierProfile {
      uri
      version
      metadata {
        image
        title
        description
        link
      }
    }
    childType
    scm
    title
    symbol
    digitalPrice
    physicalPrice
    version
    maxPhysicalEditions
    currentPhysicalEditions
    uriVersion
    usageCount
    supplyCount
    infraCurrency
    uri
    metadata
    status
    availability
    isImmutable
    digitalMarketsOpenToAll
    physicalMarketsOpenToAll
    digitalReferencesOpenToAll
    physicalReferencesOpenToAll
    standaloneAllowed
    authorizedMarkets {
      contractAddress
      isActive
      title
      symbol
      marketURI
      marketMetadata {
        title
        description
        image
      }
      infraId
    }
    childReferences {
      childContract
      childId
      placementURI
      amount
      isTemplate
      childTemplate {
        uri
        status
        availability
        physicalPrice
        metadata {
          title
          image
        }
      }
      child {
        uri
        status
        availability
        physicalPrice
        metadata {
          title
          image
        }
      }
    }
    createdAt
    updatedAt
    blockNumber
    blockTimestamp
    transactionHash
    authorizedParents {
      parentContract
      designId
      uri
      availability
      metadata {
        title
        image
      }
    }
    authorizedTemplates {
      templateContract
      templateId
      availability
      uri
      metadata {
        title
        image
      }
    }
    parentRequests {
      childId
      requestedAmount
      parentId
      parentContract
      isPending
      approved
      approvedAmount
      timestamp
      parent {
        uri 
        metadata {
          image
          title
        }
      }
    }
    templateRequests {
      childId
      requestedAmount
      templateId
      templateContract
      isPending
      approved
      approvedAmount
      timestamp
      template {
        uri 
        metadata {
          image
          title
        }
      }
    }
    marketRequests {
      tokenId
      marketContract
      isPending 
      approved
      timestamp
    }
    authorizedChildren {
      childContract
      childId
      uri
      availability
      metadata {
        title
        image
      }
    }
    physicalRights {
      buyer
      child {
        childId
        childContract
        uri
        metadata {
          title
          image
        }
      }
    }
  }
}
`;

export const getTemplate = async (
  templateId: number,
  templateContract: string
): Promise<any> => {
  const queryPromise = graphFactoryClient.query({
    query: gql(TEMPLATE),
    variables: {
      templateId,
      templateContract,
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

const CHILD = `
query($childId: Int!, $childContract: String!) {
  childs(where: {childId: $childId, childContract: $childContract}, orderBy: blockTimestamp, orderDirection: desc) {
    childId
    infraId
    childContract
    supplier 
    supplierProfile {
      uri
      version
      metadata {
        image
        title
        description
        link
      }
    }
    childType
    scm
    title
    symbol
    digitalPrice
    physicalPrice
    version
    maxPhysicalEditions
    currentPhysicalEditions
    uriVersion
    usageCount
    supplyCount
    infraCurrency
    uri
    metadata
    status
    availability
    isImmutable
    digitalMarketsOpenToAll
    physicalMarketsOpenToAll
    digitalReferencesOpenToAll
    physicalReferencesOpenToAll
    standaloneAllowed
    authorizedMarkets {
      contractAddress
      isActive
      title
      symbol
      marketURI
      marketMetadata {
        title
        description
        image
      }
      infraId
    }
    createdAt
    updatedAt
    blockNumber
    blockTimestamp
    transactionHash
    authorizedParents {
      parentContract
      designId
      availability
      uri
      metadata {
        title
        image
      }
    }
    authorizedTemplates {
      templateContract
      templateId
      availability
      uri
      metadata {
        title
        image
      }
    }
    parentRequests {
      childId
      requestedAmount
      parentId
      parentContract
      isPending
      approved
      approvedAmount
      timestamp
      parent {
        uri 
        metadata {
          image
          title
        }
      }
    }
    templateRequests {
      childId
      requestedAmount
      templateId
      templateContract
      isPending
      approved
      approvedAmount
      timestamp
      template {
        uri 
        metadata {
          image
          title
        }
      }
    }
    marketRequests {
      tokenId
      marketContract
      isPending 
      approved
      timestamp
    }
    physicalRights {
      buyer
      child {
        childId
        childContract
        uri
        metadata {
          title
          image
        }
      }
    }
  }
}
`;

export const getChild = async (
  childId: number,
  childContract: string
): Promise<any> => {
  try {
    const queryPromise = graphFactoryClient.query({
      query: gql(CHILD),
      variables: {
        childId,
        childContract,
      },
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Query timed out after 10 seconds"));
      }, 10000);
    });

    const result: any = await Promise.race([queryPromise, timeoutPromise]);
    return result;
  } catch (error) {
    throw error;
  }
};

const ALL_PARENTS = `
query($parentContract: String!, $first: Int!, $skip: Int!) {
  parents(where: {parentContract: $parentContract}, first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
    infraId
    designId
    parentContract
    designer
    designerProfile {
      uri
      metadata {
        title
        description
        image
      }
    }
    scm
    title
    symbol
    digitalPrice
    physicalPrice
    printType
    availability
    infraCurrency
    digitalMarketsOpenToAll
    physicalMarketsOpenToAll
    authorizedMarkets {
      contractAddress
      isActive
      title
      symbol
      marketURI
      marketMetadata {
        title
        description
        image
      }
      infraId
    }
    status
    totalPurchases
    maxDigitalEditions
    maxPhysicalEditions
    currentDigitalEditions
    currentPhysicalEditions
    childReferences {
      childContract
      childId
      amount
      isTemplate
      childTemplate {
        uri
        status
        physicalPrice
        availability
        metadata {
          title
          image
        }
      }
      child {
        uri
        status
        physicalPrice
        availability
        metadata {
          title 
          image
        }
      }
    }
    tokenIds
    createdAt
    updatedAt
    blockNumber
    blockTimestamp
    transactionHash
    uri
    metadata {
      id
      title
      description
      image
      tags
      prompt
      attachments {
        uri
        type
      }
      aiModel
      loras
      workflow
      version
    }
    marketRequests {
      tokenId
      marketContract
      isPending
      approved
      timestamp
    }
    authorizedChildren {
      childContract
      childId
      availability
      uri
      metadata {
        image
        title
      }
    }
    authorizedTemplates {
      templateContract
      templateId
      availability
      uri
      metadata {
        title
        image
      }
    }
    workflow {
      estimatedDeliveryDuration
      digitalSteps {
        instructions
        fulfiller {
          fulfiller
          uri
          isActive
          basePrice
          vigBasisPoints
          metadata {
            title
            image
          }
        }
        subPerformers {
          performer
          splitBasisPoints
        }
      }
      physicalSteps {
        instructions
        fulfiller {
          fulfiller
          uri
          isActive
          basePrice
          vigBasisPoints
          metadata {
            title
            image
          }
        }
        subPerformers {
          performer
          splitBasisPoints
        }
      }
    }
  }
}
`;

export const getAllParents = async (
  parentContract: string,
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFactoryClient.query({
    query: gql(ALL_PARENTS),
    variables: {
      parentContract,
      first,
      skip,
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
