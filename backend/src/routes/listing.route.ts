import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { createListingController, deleteListingController, generateArtworkController, getListingBySlugController, getMockupUrlController, getUserListingsController } from "../controllers/listing.controller";


const listingRoutes = Router()
  .get("/all", requireAuth, getUserListingsController)
  .get("/mockup/:slug/:colorName", getMockupUrlController)
  .get("/:slug", getListingBySlugController)
  .post("/generate-artwork", requireAuth, generateArtworkController)
  .post("/create", requireAuth, createListingController)
  .delete("/:id",requireAuth,deleteListingController)
export default listingRoutes
