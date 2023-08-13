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
      domain: "coinop.themanufactory.xyz",
      address: currentPKP?.pkpWallet.address,
      statement: "This is an Auth Sig for Coin Op",
      uri: "https://coinop.themanufactory.xyz",
      version: "1",
      chainId: 137,
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
