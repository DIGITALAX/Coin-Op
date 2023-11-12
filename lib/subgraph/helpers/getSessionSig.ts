import * as LitJsSdk_authHelpers from "@lit-protocol/auth-helpers";
import { BaseProvider } from "@lit-protocol/lit-auth-client";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { AuthMethod } from "@lit-protocol/types";

export const getSessionSig = async (
  authMethod: AuthMethod,
  currentPKP: {
    ethAddress: string;
    publicKey: string;
    tokenId: {
      hex: `0x${string}` | undefined;
      type: string;
    };
  },
  provider: BaseProvider,
  litNodeClient: LitNodeClient
) => {
  try {
    const litResource = new LitJsSdk_authHelpers.LitPKPResource(
      currentPKP.tokenId.hex!
    );

    const sessionSigs = await provider.getSessionSigs({
      pkpPublicKey: currentPKP.publicKey!,
      authMethod: {
        authMethodType: 6,
        accessToken: authMethod.accessToken,
      },
      sessionSigsParams: {
        chain: "polygon",
        resourceAbilityRequests: [
          {
            resource: litResource,
            ability: LitJsSdk_authHelpers.LitAbility.PKPSigning,
          },
        ],
      },
      litNodeClient,
    });
    return sessionSigs;
  } catch (e: any) {
    console.error(e.message);
  }
};
