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
      metadata: {
        social: req.body.social,
      },
      expand: ["latest_invoice.payment_intent"],
    });

    return res.status(200).json({ success: subscription });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default handler;
