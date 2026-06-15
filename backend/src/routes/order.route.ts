import { Router } from "express";
import { createOrderController, getUserOrdersController } from "../controllers/order.controller";
import { requireAuth } from "../middlewares/auth.middleware";


const orderRoutes = Router()
  .post("/create", createOrderController)
  .get("/user", requireAuth, getUserOrdersController);

export default orderRoutes
