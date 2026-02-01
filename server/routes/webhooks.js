import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", { apiVersion: "2023-10-16" });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post("/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    if (endpointSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
        event = JSON.parse(req.body); // Modo dev inseguro
    }
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Idempotência já é tratada pelo Stripe enviando event.id únicos,
  // mas idealmente verificaríamos se event.id já foi processado no DB.

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("Payment success:", session.id);
      // Lógica de adicionar créditos via função SQL
      break;
    default:
      // console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

export default router;
