const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post(async (req: any, res: NextApiResponse<any>) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(req.body.amount),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });

    return res.status(200);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default handler;
