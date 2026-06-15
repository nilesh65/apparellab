import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createOrderSchema } from "../validators/order.validator";
import { HTTPSTATUS } from "../config/http.config";
import { createOrderService, getUserOrdersService } from "../services/order.service";


export const createOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createOrderSchema.parse(req.body);

    const { url } = await createOrderService(body);

    return res.status(HTTPSTATUS.OK).json({
      message: "Order created successfully",
      url
    })
  }
)

export const getUserOrdersController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const orders = await getUserOrdersService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Orders fetched successfully",
      orders
    })
  }
)
