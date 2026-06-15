
export interface PrintArea {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ProductType {
  _id: string;
  type: "TSHIRT" | "HOODIE"| "SWEATSHIRT";
  template: boolean;
  section: "catalog" | "featured";
  name: string;
  body: string;
  displayUrl: string;
  basePrice: number;
  sizes: string[];
  baseUrl: string;
  printableArea: PrintArea;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  message: string;
  products: {
    catalog: ProductType[];
    featured: ProductType[];
  };
}

export type GetAllProductsResponse = ProductsResponse;

export interface ProductColorType {
  _id: string;
  templateId: string;
  name: string;
  color: string;
  mockupUrl: string;
}

export interface ProductTemplateResponse {
  message: string;
  template: ProductType;
  colors: ProductColorType[];
}
