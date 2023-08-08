export interface Order {
  orderId: string;
  totalPrice: string;
  transactionHash: string;
  fulfillmentInformation: {
    encryptedString: number[];
    encryptedSymmetricKey: string;
    decryptedFulfillment:
      | {
          address: string;
          city: string;
          contact: string;
          name: string;
          state: string;
          zip: string;
          country: string;
          sizes: string[];
          collectionIds: string[];
          collectionAmounts: string[];
        }
      | undefined;
  };
  fulfillerId: string;
  buyer: string;
  blockTimestamp: string;
  isFulfilled: boolean;
  orderStatus: string[];
  orderStatusTimestamps: string[];
  blockNumber: string;
  chosenAddress: string;
  collectionId: string;
  collectionDetails: {
    name: string;
    prices: string[];
    uri:  {
        image: string;
        prompt: string;
        tags: string;
        category: string;
      };
    amount: string;
    soldTokens: string[];
    noLimit: boolean;
    collectionId: string;
    tokenIds: string[];
    chosenSize: string;
    sizes: string[];
    fulfillerAddress: string;
    fulfillerId: string;
  }[];
}
