import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createListingSchema, generateArtworkSchema, GetMockupUrlSchema, slugSchema } from "../validators/listing.validator";
import { HTTPSTATUS } from "../config/http.config";
import { createListingService, deleteListingService, generateArtworkService, getListingBySlugService, getMockupUrlService, getUserListingsService } from "../services/listing.service";
import Listing from "../models/listing.model";


export const createListingController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const body = createListingSchema.parse(req.body);
    const data = await createListingService(userId, body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Listing created successfully",
      ...data
    })
  }
)


export const getUserListingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const data = await getUserListingsService(userId);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Listing fetched successfully",
      ...data
    })
  }
)

export const getListingBySlugController = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = slugSchema.parse(req.params)
    const data = await getListingBySlugService(slug);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Listing fetched successfully",
      ...data
    })
  }
)


export const getMockupUrlController = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug, colorName } = GetMockupUrlSchema.parse(req.params);
    const url = await getMockupUrlService(slug, colorName);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.redirect(301, url)
  }
)

export const generateArtworkController = asyncHandler(
  async (req: Request, res: Response) => {
    const { prompt } = generateArtworkSchema.parse(req.body);
    const { artworkUrl } = await generateArtworkService(prompt);
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Artwork generated successfully",
      artworkUrl
    })
  }
)

export const deleteListingController = asyncHandler(
  async(req: Request, res: Response)=> {
    await deleteListingService(req.params.id as string,req.user.id)

  return res.status(HTTPSTATUS.OK).json({message: "Listing deleted successfully"})
}
)
