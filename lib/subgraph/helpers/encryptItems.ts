import { CartItem, Details } from "@/components/Common/types/common.types";
import { LitNodeClient, encryptString } from "@lit-protocol/lit-node-client";
import { AuthSig, AccessControlConditions } from "@lit-protocol/types";
import { DIGITALAX_ADDRESS } from "../../constants";

export const encryptItems = async (
  client: LitNodeClient,
  fulfillmentDetails: Details,
  address: `0x${string}`,
  authSig: AuthSig,
  cartItems: CartItem[]
): Promise<
  | {
      pubId: string;
      data: string;
    }[]
  | undefined
> => {
  try {
    let encryptedItems: {
      pubId: string;
      data: string;
    }[] = [];

    let groupedItems: {
      [key: string]: {
        colors: string[];
        sizes: string[];
        amounts: number[];
        collectionIds: string[];
        types: string[];
        prices: number[];
      };
    } = {};

    cartItems?.forEach((item: CartItem) => {
      const pubId = item?.item?.pubId;
      if (!groupedItems[pubId]) {
        groupedItems[pubId] = {
          colors: [],
          sizes: [],
          amounts: [],
          collectionIds: [],
          types: [],
          prices: [],
        };
      }

      groupedItems[pubId].colors.push(item?.chosenColor);
      groupedItems[pubId].sizes.push(item?.chosenSize);
      groupedItems[pubId].types.push("coinop");
      groupedItems[pubId].amounts.push(item?.chosenAmount);
      groupedItems[pubId].collectionIds.push(item?.item?.collectionId);
      groupedItems[pubId].prices.push(
        Number(item?.item?.prices?.[item?.chosenIndex!])
      );
    });

    const accessControlConditions = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "polygon",
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: address.toLowerCase(),
        },
      },
      {
        operator: "or",
      },
      {
        contractAddress: "",
        standardContractType: "",
        chain: "polygon",
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: address?.toLowerCase() as string,
        },
      },
    ] as AccessControlConditions;

    for (const [pubId, item] of Object.entries(groupedItems)) {
      const { ciphertext, dataToEncryptHash } = await encryptString(
        {
          accessControlConditions,
          authSig,
          chain: "polygon",
          dataToEncrypt: JSON.stringify({
            ...fulfillmentDetails,
            ...item,
            origin: "0",
            fulfillerAddress: [DIGITALAX_ADDRESS],
          }),
        },
        client as any
      );

      encryptedItems.push({
        pubId,
        data: JSON.stringify({
          ciphertext,
          dataToEncryptHash,
          accessControlConditions,
        }),
      });
    }

    return encryptedItems;
  } catch (err: any) {
    console.error(err.message);
  }
};
