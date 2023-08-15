const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post(async (req: any, res: NextApiResponse<any>) => {
  try {
    const customer = await stripe.customers.create({
      email: req.body.email,
      metadata: {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
      },
    });

    const attachedPaymentMethod = await stripe.paymentMethods.attach(
      req.body.paymentMethodId,
      {
        customer: customer.id,
      }
    );

    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: attachedPaymentMethod.id,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_KEY }],
      expand: ["latest_invoice.payment_intent"],
    });

    return res.status(200).json(subscription);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default handler;
