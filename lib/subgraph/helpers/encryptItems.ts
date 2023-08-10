import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { connectLit } from "./connectLit";
import { AnyAction, Dispatch } from "redux";
import { CartItem } from "@/components/Common/types/common.types";

export const encryptItems = async (
  litClient: LitJsSdk.LitNodeClient | undefined,
  dispatch: Dispatch<AnyAction>,
  information: {
    sizes: string[];
    colors: string[];
    collectionIds: number[];
    collectionAmounts: number[];
  },
  fulfillerGroups: { [key: string]: CartItem[] },
  fulfillmentDetails: {
    name: string;
    contact: string;
    address: string;
    zip: string;
    city: string;
    state: string;
    country: string;
  },
  address: `0x${string}`
): Promise<string[] | undefined> => {
  try {
    let client = litClient;
    if (!client) {
      client = await connectLit(dispatch);
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: "mumbai",
    });
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      JSON.stringify({
        ...fulfillmentDetails,
        ...information,
      })
    );

    let fulfillerDetails = [];

    for (let fulfillerAddress in fulfillerGroups) {
      let fulfillerEditions: any[] = [];

      fulfillerGroups[fulfillerAddress].forEach((item) => {
        fulfillerEditions.push({
          contractAddress: "",
          standardContractType: "",
          chain: "mumbai",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: item.fulfillerAddress.toLowerCase(),
          },
        });

        fulfillerEditions.push({
          operator: "or",
        });
      });

      const encryptedSymmetricKey = await client!?.saveEncryptionKey({
        accessControlConditions: [
          ...fulfillerEditions,
          {
            contractAddress: "",
            standardContractType: "",
            chain: "mumbai",
            method: "",
            parameters: [":userAddress"],
            returnValueTest: {
              comparator: "=",
              value: address?.toLowerCase() as string,
            },
          },
        ],
        symmetricKey,
        authSig,
        chain: "mumbai",
      });

      const buffer = await encryptedString.arrayBuffer();
      fulfillerDetails.push(
        JSON.stringify({
          fulfillerAddress,
          encryptedString: JSON.stringify(Array.from(new Uint8Array(buffer))),
          encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
            encryptedSymmetricKey,
            "base16"
          ),
        })
      );
    }

    return fulfillerDetails;
  } catch (err: any) {
    console.error(err.message);
  }
};
