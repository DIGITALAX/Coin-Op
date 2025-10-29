import { graphFactoryClient, graphPrintClient } from "@/app/lib/graph/client";
import { gql } from "@apollo/client";

const ORDERS = `
query($buyer: String!) {
  orderCreateds(where: {buyer: $buyer}) {
       orderId
      totalPrice
      currency
      blockNumber
      buyer
      blockTimestamp
      transactionHash
      collection {
      collectionId
        metadata {
          images
          title
        }
      }
      messages
      details
       isFulfilled
      status
  }
}
`;

export const getOrders = async (buyer: string): Promise<any> => {
  const queryPromise = graphPrintClient.query({
    query: gql(ORDERS),
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

const ORDERS_MARKET = `
query($buyer: String!) {
  orders(where: {buyer: $buyer}) {
      totalPayments
      orderStatus
      orderId
      fulfillmentData
      blockTimestamp
      blockNumber
      transactionHash
      parentId
      parentAmount
      parentContract
      isPhysical
      fulfillment {
        currentStep
        createdAt
        lastUpdated
        estimatedDeliveryDuration
      digitalSteps {
        instructions
        fulfiller {
          fulfiller
          uri
          metadata {
            title
            image
          }
}}
      physicalSteps {
        instructions
        fulfiller {
          fulfiller
          uri
          metadata {
            title
            image
          }
}
}
        isPhysical
        fulfillmentOrderSteps {
          notes
          completedAt
          isCompleted
          stepIndex
        }
      }
      payments {  
        fulfillerId
        amount
        recipient 
        paymentType
      }
      parent {
        uri
        metadata {
          title
          image
        }
      }
  }
}
`;

export const getOrdersMarket = async (buyer: string): Promise<any> => {
  const queryPromise = graphFactoryClient.query({
    query: gql(ORDERS_MARKET),
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
