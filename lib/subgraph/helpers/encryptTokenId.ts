import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { AuthSig } from "@lit-protocol/types";

export const encryptToken = async (
  client: LitJsSdk.LitNodeClient | undefined,
  address: `0x${string}`,
  authSig: AuthSig,
  currentPKP: string
): Promise<string | undefined> => {
  try {
    let encryptedTokenId: string | undefined;

    await client?.connect();
   
    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
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
        authSig,
        chain: "polygon",
        dataToEncrypt: currentPKP,
      },
      client!
    );

    encryptedTokenId = JSON.stringify({
      ciphertext: ciphertext,
      dataToEncryptHash: dataToEncryptHash,
    });

    return encryptedTokenId;
  } catch (err: any) {
    console.error(err.message);
  }
};
