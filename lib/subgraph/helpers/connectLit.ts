import { AnyAction, Dispatch } from "redux";
import { setLitClient } from "../../../redux/reducers/litClientSlice";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

export const connectLit = async (
  dispatch: Dispatch<AnyAction>
): Promise<LitJsSdk.LitNodeClient | undefined> => {
  try {
    const client = new LitJsSdk.LitNodeClient({
      debug: false,
      alertWhenUnauthorized: true,
      litNetwork: "cayenne",
    });
    await client.connect();
    dispatch(setLitClient(client));
    return client;
  } catch (err: any) {
    console.error(err.message);
  }
};
