import { SiweMessage } from "siwe";

export const generateAuthSignature = async (
  currentPKP:
    | {
        ethAddress: string;
        publicKey: string;
        tokenId: {
          hex: string;
          type: string;
        };
        sessionSig: any;
        pkpWallet: any;
      }
    | undefined
) => {
  try {
    const siweMessage = new SiweMessage({
      domain: "localhost",
      address: currentPKP?.pkpWallet.address,
      statement: "This is an Auth Sig for Coin Op",
      uri: "https://localhost:3000",
      version: "1",
      chainId: 80001,
    });
    const signedMessage = siweMessage.prepareMessage();
    const sig = await currentPKP?.pkpWallet.signMessage(signedMessage);
    return {
      sig,
      derivedVia: "web3.eth.personal.sign",
      signedMessage,
      address: currentPKP?.pkpWallet.address,
    };
  } catch (err: any) {
    console.error(err.message);
  }
};
