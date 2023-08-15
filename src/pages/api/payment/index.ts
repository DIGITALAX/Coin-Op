const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { chunkString } from "../../../../lib/subgraph/helpers/chunkString";

const handler = nextConnect();

handler.post(async (req: any, res: NextApiResponse<any>) => {
  try {
    let customer;
    let tokenIdChunks: { [key: string]: string } = {};

    const chunks = chunkString(req.body.encryptedTokenId, 490);

    chunks.forEach((chunk, index) => {
      tokenIdChunks[`part_${index + 1}`] = chunk;
    });

    const customers = await stripe.customers.list({
      "metadata[part_2]": tokenIdChunks["part_2"],
    });

    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        metadata: req.body.encryptedTokenId,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      customer: customer.id,
      amount: Number(req.body.amount),
      currency: "usd",
      payment_method_types: ["card"],
      metadata: req.body.encryptedInformation,
      confirm: false,
    });

    return res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default handler;
