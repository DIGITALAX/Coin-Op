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
      return res.status(400).json({ success: false });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
    });

    if (subscriptions.data.length < 1) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });
    }
    const canceledSubscription = await stripe.subscriptions.del(
      subscriptions.data[0].id
    );

    if (canceledSubscription.status === "canceled") {
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Failed to cancel the subscription" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default handler;
