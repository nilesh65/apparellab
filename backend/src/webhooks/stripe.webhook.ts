import { Request, Response } from "express";
import Stripe from "stripe";
import stripeClient from "../config/stripe.config";
import { Env } from "../config/env.config";
import { HTTPSTATUS } from "../config/http.config";
import Order, { OrderStatus } from "../models/order.model";

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  let event: Stripe.Event;

  try {
    event = stripeClient.webhooks.constructEvent(
      req.body,
      sig,
      Env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error: any) {
    return res.status(HTTPSTATUS.BAD_REQUEST).send(`Webhook Error ${error?.message}`)
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleOrderCheckoutCompleted(session)
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleOrderCheckoutFailed(session)
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }
    return res.status(HTTPSTATUS.OK).json({ received: true });
  } catch (error: any) {
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).send(
      `Webhook Error ${error?.message}`
    )

  }
}

async function handleOrderCheckoutCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.log("No OrderId in session metadata")
    return;
  }

  try {
    await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
      status: OrderStatus.AWAITING_SHIPMENT
    })
    console.log(`Order marked as paid`)
  } catch (error) {
    console.log("Error updating order")
    return;
  }
}


async function handleOrderCheckoutFailed(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.log("No OrderId in session metadata")
    return;
  }

  try {
    await Order.findByIdAndUpdate(orderId, {
      isPaid: false,
      status: OrderStatus.FAILED,
    })
    console.log(`Order marked as failed`)
  } catch (error) {
    console.log("Error updating order")
    return;
  }
}
