import { AnyAction, Dispatch } from "redux";
import { setLitClient } from "../../../redux/reducers/litClientSlice";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

export const connectLit = async (
  dispatch: Dispatch<AnyAction>
): Promise<LitJsSdk.LitNodeClient | undefined> => {
  try {
    const client = new LitJsSdk.LitNodeClient({
      debug: true,
      alertWhenUnauthorized: true,
      chain: 137,
      provider: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    });
    await client.connect();
    dispatch(setLitClient(client));
    return client;
  } catch (err: any) {
    console.error(err.message);
  }
};
