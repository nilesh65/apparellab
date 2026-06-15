import { generateText, generateImage } from "ai"
import cloudinary from "../config/cloudinary.config";
import { Env } from "../config/env.config";
import Listing from "../models/listing.model";
import Product from "../models/products.model";
import { BadRequestException, InternalServerException, NotFoundException } from "../utils/app-error";
import { CreateListingType } from "../validators/listing.validator";

import { InferenceClient } from "@huggingface/inference";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Order from "../models/order.model";

const genAI = new GoogleGenerativeAI(Env.GEMINI_API_KEY!);

const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, "-");
const client = new InferenceClient(Env.HF_TOKEN);


export const createListingService = async (userId: string, data: CreateListingType) => {
  try {
    const template = await Product.findById(data.templateId);
    if (!template) throw new NotFoundException("Template not found");
    if (!template.template) throw new BadRequestException("Product not temp;ate");
    if (!template.basePrice) throw new BadRequestException("Product not temp;ate");

    if (data.sellingPrice < template.basePrice) {
      throw new BadRequestException(`Selling price must be at least ${template.basePrice}`);
    }

    // Upload the artwork
    const uploaded = await cloudinary.uploader.upload(
  data.artworkUrl, {
    folder: "ApparelLab-ai/artworks",
    resource_type: "image",
    access_mode: "public"  // ye add karo
  }
)

    const listing = await Listing.create({
      userId,
      templateId: data.templateId,
      title: data.title,
      description: data.description,
      sellingPrice: data.sellingPrice,
      colorIds: data.colorIds,
      artworkUrl: uploaded.secure_url,
      artworkPlacement: data.artworkPlacement
    })

    return { listing }

  } catch (error) {
    throw new InternalServerException("Internal error")
  }
}


export const getUserListingsService = async (userId: string) => {
  try {
    const listings = await Listing.find({ userId, isArchived: false })
      .populate("templateId")
      .populate("colorIds")
      .sort({ createdAt: -1 })
      .lean()
    return { listings }
  } catch (error) {
    throw new InternalServerException("Internal Error")
  }
}

export const getListingBySlugService = async (slug: string) => {
  try {
    const listing = await Listing.findOne({ slug, isArchived:false })
      .populate("templateId")
      .populate("colorIds")
      .lean()

    if (!listing) throw new NotFoundException("Listing not found")
    const colors = (listing.colorIds as any[]).map((color) => ({
      ...color,
      mockupImageUrl: color.name
        ? `${Env.BASE_URL}/api/listing/mockup/${slug}/${toSlug(color.name)}.jpg`
        : null
    }));
    const template = listing.templateId as any;

    return {
      listing: {
        ...listing,
        _id: listing._id,
        slug: listing.slug,
        title: listing.title,
        description: listing.description,
        sellingPrice: listing.sellingPrice,
        templateId: undefined,
        templateName: template?.name,
        templateBody: template?.body,
        sizes: template?.sizes,
        colorIds: colors
      }
    }

  } catch (error) {
    throw new InternalServerException("Internal server error")
  }
}


export const getMockupUrlService = async (slug: string, colorName: string) => {
  const listing = await Listing.findOne({ slug })
    .populate("colorIds")
    .populate("templateId")

  if (!listing) throw new NotFoundException("Listing not found");

  const color = (listing.colorIds as any[]).find(
    (color) => toSlug(color.name) === colorName.replace(".jpg", ""))

  if (!color) throw new NotFoundException("Color not found");

  const template = listing.templateId as any;
  const printableArea = template.printableArea;
  const getPublicId = (url: string) =>
    url.split("/upload/")[1]
      .replace(/^v\d+\//, "") // remove version prefix e.g. v1773951553/
      .replace(/\.[^.]+$/, "") // remove extension
      .replace(/\//g, ":"); // slashes → colons

  const artworkPulicId = getPublicId(listing.artworkUrl);
  const mockupPublicId = getPublicId(color.mockupUrl);

  const { refDisplayWidth } = listing.artworkPlacement

  const mockup_width = 900;

  const scale = mockup_width / (refDisplayWidth ?? 662)

  const url = cloudinary.url(mockupPublicId, {
    transformation: [
      { overlay: artworkPulicId },
      {
        width: Math.round(printableArea.width * scale),
        height: Math.round(printableArea.height * scale),
        crop: "fit"
      },
      {
        flags: "layer_apply",
        gravity: "north_west",
        x: Math.round(printableArea.left * scale),
        y: Math.round(printableArea.top * scale)
      }
    ],
    format: "jpg",
    quality: 90
  })

  return url


}
export const deleteListingService = async(listingId: string,
  userId: string)=>{
  
    const listing = await Listing.findOne({
      _id: listingId,
      userId
    })
    if(!listing){
      throw new NotFoundException("Listing not found")
    }
    const hasOrders = await Order.exists({
      listingId
    })
    if(hasOrders){
      listing.isArchived=true
      await listing.save()
      return {
        message: "Listing archived successfully",
        action: "archived"
      }
    }
    await listing.deleteOne()
    return {
      message: "Listing deleted successfully"
    }
}

export const improvePromptWithGemini = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(`
You are a prompt enhancer for AI image generation.

Rules:
- Keep the same meaning.
- Do not add new subjects.
- Improve visual detail, composition, style, textures.
- Output one line only.

User Prompt:
${prompt}
`);

    return result.response.text().trim();
  } catch (err) {
    console.error("Gemini Error:", err);
    return prompt;
  }
};

export const generateArtworkService = async (prompt: string) => {
  try {
    // STEP 1: Enhance prompt with Gemini
    const enhancedPrompt = await improvePromptWithGemini(prompt);
    console.log("✅ Enhanced Prompt:", enhancedPrompt);

    // STEP 2: Generate image with Stable Diffusion XL
    const imageBlob = await client.textToImage({
      provider: "nscale",
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: enhancedPrompt,
      parameters: {
        num_inference_steps: 30,
        guidance_scale: 7.5
      },
    });

    if (!imageBlob) throw new InternalServerException("Image generation failed");

    // STEP 3: Blob → Buffer
   let buffer: Buffer;
if (typeof imageBlob === "string") {
  const res = await fetch(imageBlob);
  buffer = Buffer.from(await res.arrayBuffer());
} else {
  buffer = Buffer.from(await (imageBlob as Blob).arrayBuffer());
}

    // STEP 4: Upload to Cloudinary
    const uploadImg = await cloudinary.uploader.upload(
      `data:image/png;base64,${buffer.toString("base64")}`,
      {
        folder: "ApparelLab-ai/artworks",
        resource_type: "image",
        access_mode: "public"
      }
    );
    console.log("✅ Uploaded to Cloudinary:", uploadImg.secure_url);

    // STEP 5: Remove background
    const formData = new FormData();
    formData.append("image_url", uploadImg.secure_url);
    formData.append("size", "auto");

    const bgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": Env.REMOVE_BG_API_KEY! },
      body: formData,
    });

    if (!bgRes.ok) {
      const err = await bgRes.text();
      console.error("❌ RemoveBG Error:", err);
      throw new InternalServerException("Background removal failed");
    }

    const bgBuffer = Buffer.from(await bgRes.arrayBuffer());

    // STEP 6: Final upload to Cloudinary
    const finalUpload = await cloudinary.uploader.upload(
      `data:image/png;base64,${bgBuffer.toString("base64")}`,
      {
        folder: "ApparelLab-ai/artworks",
        resource_type: "image",
        access_mode: "public"
      }
    );
    console.log("✅ Final artwork URL:", finalUpload.secure_url);

    return { artworkUrl: finalUpload.secure_url };

  } catch (error: any) {
    console.error("******* ARTWORK ERROR*********");
    console.error(error?.message || error);
    console.error("*****************************");
    throw new InternalServerException("Failed to generate artwork");
  }
};
