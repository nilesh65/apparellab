import mongoose, { Document, Schema } from "mongoose";

export enum ProductType {
  TSHIRT = "TSHIRT",
  HOODIE = "HOODIE",
  SWEATSHIRT = "SWEATSHIRT"
}

export const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"] as const;


export enum Section {
  CATALOG = "catalog",
  FEATURED = "featured",
}

export interface PrintableArea {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ProductDocument extends Document {
  type: ProductType;
  template: boolean;
  section: Section;
  name: string;
  body: string;
  displayUrl: string;

  // only template
  basePrice?: number;
  baseUrl?: string;  // can also be called transparent temp mockup url
  sizes?: typeof SIZE_OPTIONS;
  printableArea?: PrintableArea;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<ProductDocument>(
  {
    type: {
      type: String,
      enum: [ProductType.TSHIRT, ProductType.HOODIE,ProductType.SWEATSHIRT],
      required: true
    },
    template: {
      type: Boolean,
      default: false
    },
    section: {
      type: String,
      enum: Section,
      default: Section.CATALOG
    },
    name: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true,
    },
    displayUrl: {
      type: String,
      required: true,
    },

    // Only needed for template
    basePrice: {
      type: Number,
      default: undefined,
    },
    sizes: {
      type: [String],
      enum: SIZE_OPTIONS,
      default: undefined,
    },
    baseUrl: {
      type: String,
      default: undefined,
    },
    printableArea: {
      top: {
        type: Number,
      },
      left: {
        type: Number,
      },
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
    },
  },
  { timestamps: true }
)

const Product = mongoose.model<ProductDocument>("Product",
  productSchema
)

export default Product
