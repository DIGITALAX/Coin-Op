import * as LitJsSdk_authHelpers from "@lit-protocol/auth-helpers";

export const getSessionSig = async (
  authMethod: any,
  currentPKP: any,
  provider: any,
  litNodeClient: any
) => {
  try {
    await litNodeClient.connect();

    const litResource = new LitJsSdk_authHelpers.LitPKPResource(
      currentPKP.tokenId.hex
    );

    const sessionSigs = await provider.getSessionSigs({
      pkpPublicKey: currentPKP.publicKey,
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
