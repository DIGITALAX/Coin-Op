import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get(async (req: any, res: NextApiResponse<any>) => {
  try {
    const results = await fetch("http://127.0.0.1:7860/sdapi/v1/progress", {
      method: "GET",
    });
    const json = await results.json();
    return res.json({ json });
  } catch (err: any) {
    console.error(err.message);
  }
});

export default handler;
