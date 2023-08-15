import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { connectLit } from "./connectLit";
import { AnyAction, Dispatch } from "redux";

export const encryptToken = async (
  litClient: LitJsSdk.LitNodeClient | undefined,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}`,
  authSig: any,
  currentPKP: string
): Promise<string | undefined> => {
  try {
    let encryptedTokenId: string | undefined;
    let client = litClient;
    if (!client) {
      client = await connectLit(dispatch);
    }

    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      currentPKP
    );

    const encryptedSymmetricKey = await client!?.saveEncryptionKey({
      accessControlConditions: [
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
      ],
      symmetricKey,
      authSig,
      chain: "polygon",
    });

    const buffer = await encryptedString.arrayBuffer();
    encryptedTokenId = JSON.stringify({
      encryptedString: JSON.stringify(Array.from(new Uint8Array(buffer))),
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        "base16"
      ),
    });

    return encryptedTokenId;
  } catch (err: any) {
    console.error(err.message);
  }
};
