import { groupBy } from "lodash";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { items, email } = req.body;
  const groupedItems = Object.values(groupBy(items, "id"));

  const transformedItems = groupedItems.map((group) => ({
    description: group[0].description,
    quantity: group.length,
    price_data: {
      currency: "INR",
      unit_amount: group[0].price * 103 * 100,
      product_data: {
        name: group[0].title,
        images: [group[0].image],
      },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_rates: ["shr_1IzlggKRTJh2GFCJdSTMR2wC"],
    shipping_address_collection: {
      allowed_countries: ["IN"],
    },
    line_items: transformedItems,
    mode: "payment",
    success_url: `${process.env.HOST}/success`,
    cancel_url: `${process.env.HOST}/checkout`,
    metadata: {
      email,
      images: JSON.stringify(groupedItems.map((group) => group[0].image)),
    },
  });

  res.status(200).json({ id: session.id });
};
