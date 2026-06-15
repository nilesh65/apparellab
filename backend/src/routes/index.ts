import { Router } from "express";
import productRoutes from "./product.route";
import listingRoutes from "./listing.route";
import orderRoutes from "./order.route";

const router = Router();
router.use("/product", productRoutes)
router.use("/listing", listingRoutes)
router.use("/order", orderRoutes)

export default router;
