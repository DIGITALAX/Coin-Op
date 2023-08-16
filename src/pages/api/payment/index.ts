const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post(async (req: any, res: NextApiResponse<any>) => {
  try {
    let customer;

    const customers = await stripe.customers.list();

    const filteredCustomers = customers.data.filter((cust: any) => {
      return (
        cust.metadata &&
        cust.metadata.part_2 === req.body.encryptedTokenId["part_2"]
      );
    });

    if (filteredCustomers && filteredCustomers?.length > 0) {
      customer = filteredCustomers[0];
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
