import mongoose from "mongoose";
import stripeClient from "../config/stripe.config";
import Listing from "../models/listing.model";
import Order, { OrderStatus } from "../models/order.model";
import { BadRequestException, InternalServerException, NotFoundException } from "../utils/app-error";
import { CreateOrderType } from "../validators/order.validator";
import { Env } from "../config/env.config";


export const createOrderService = async (
  data: CreateOrderType
) => {
  const listing = await Listing.findById(data.listingId)
    .populate("colorIds")
  if (!listing) throw new NotFoundException("Listing not found");
  const isColorValid = listing.colorIds?.some((color: any) => color._id.toString() === data.colorId);

  if (!isColorValid) throw new BadRequestException("Color is invalid")

  const order = await Order.create({
    listingId: data.listingId,
    colorId: data.colorId,
    size: data.size,
    customerEmail: data.customerEmail,
    customerName: data.customerName,
    amount: listing.sellingPrice,
    isPaid: false,
    status: OrderStatus.PENDING,
    shippingAddress: data.shippingAddress,
  })

  const session = await stripeClient.checkout.sessions.create({
    mode: "payment",
    customer_email: data.customerEmail,
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: listing.title },
        unit_amount: Math.round(listing.sellingPrice * 100),
      },
      quantity: 1,
    }],
    metadata: {
      orderId: (order._id as mongoose.Types.ObjectId).toString()
    },
    success_url: `${Env.FRONTEND_ORIGIN}/thank-you?orderId=${order._id}`,
    cancel_url: `${Env.FRONTEND_ORIGIN}/listing/${listing.slug}?error=true`,
  })

  if (!session.url) {
    await Order.findByIdAndDelete(order._id)
    throw new InternalServerException("Failed to create checkout session")
  }

  return { url: session.url }
}


export const getUserOrdersService = async (userId: string) => {
  const listings = await Listing.find({ userId }).select("_id");
  const listingIds = listings.map((listing) => listing._id);

  const orders = await Order.find({
    listingId: {
      $in: listingIds
    }
  }).populate("listingId", "title slug artworkUrl")
    .populate("colorId", "name color")
    .sort({ createdAt: -1 })

  return orders
}
