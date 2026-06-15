import mongoose, { Document } from "mongoose";

// Can also be called templatecolors
export interface ProductColorDocument extends Document {
  templateId: mongoose.Schema.Types.ObjectId;
  name: string;
  color: string;
  mockupUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const productColorSchema = new mongoose.Schema<ProductColorDocument>(
  {
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true
    },
    mockupUrl: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

const ProductColor = mongoose.model<ProductColorDocument>
  ("ProductColor", productColorSchema)

export default ProductColor
