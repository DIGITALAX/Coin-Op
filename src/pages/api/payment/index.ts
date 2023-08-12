const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post(async (req: any, res: NextApiResponse<any>) => {
  try {
 
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(req.body.amount),
      currency: "usd",
      payment_method_types: ["card"],
      metadata: req.body.encryptedInformation,
      // automatic_payment_methods: {
      //   enabled: true,
      // },
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
