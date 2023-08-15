import { joinSignature } from "@ethersproject/bytes";
import { serialize } from "@ethersproject/transactions";
import { connectLit } from "./connectLit";
import { AnyAction, Dispatch } from "redux";
import { ethers } from "ethers";
import { IPFS_CID_PKP, PKP_PUBLIC_KEY } from "../../constants";

export const litExecute = async (
  provider: ethers.providers.JsonRpcProvider,
  dispatch: Dispatch<AnyAction>,
  litClient: any,
  tx: any,
  sigName: string,
  authSig: any
) => {
  let client = litClient;
  if (!client) {
    client = await connectLit(dispatch);
  }

  const results = await client.executeJs({
    ipfsId: IPFS_CID_PKP,
    authSig,
    jsParams: {
      publicKey: PKP_PUBLIC_KEY,
      tx,
      sigName,
    },
  });

  const signature = results.signatures[sigName];
  const sig: {
    r: string;
    s: string;
    recid: number;
    signature: string;
    publicKey: string;
    dataSigned: string;
  } = signature as {
    r: string;
    s: string;
    recid: number;
    signature: string;
    publicKey: string;
    dataSigned: string;
  };

  const encodedSignature = joinSignature({
    r: "0x" + sig.r,
    s: "0x" + sig.s,
    recoveryParam: sig.recid,
  });
  const serialized = serialize(tx as any, encodedSignature);
  const transactionHash = await provider.sendTransaction(serialized);

  await transactionHash.wait();
};
