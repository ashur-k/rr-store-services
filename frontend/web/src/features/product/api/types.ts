export interface ProductImage {
  id: string;
  image_url: string;
  display_order: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductColor {
  id: string;
  name: string;
  hex_code: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: string;
  stock: number;
  attributes: Record<string, unknown>;
  color: ProductColor | null;
  images: ProductImage[];
}

export interface Product {
  id: string;
  store_id: string;
  category_id: string | null;
  category: ProductCategory | null;
  name: string;
  description: string | null;
  has_variants: boolean;
  rate: number;
  new_edition: boolean;
  discount_30_percent: boolean;
  price: string | null;
  stock: number | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductImageCreate {
  image_url: string;
  display_order?: number;
}

export interface ProductVariantCreate {
  sku: string;
  price: number;
  stock: number;
  attributes?: Record<string, unknown>;
  images?: ProductImageCreate[];
}

export interface ProductCreate {
  store_id: string;
  name: string;
  description?: string | null;
  has_variants: boolean;
  price?: number | null;
  stock?: number | null;
  images?: ProductImageCreate[];
  variants?: ProductVariantCreate[];
  category_id?: string | null;
  rate?: number;
  new_edition?: boolean;
  discount_30_percent?: boolean;
}

export interface ProductUpdate {
  name: string;
  description: string | null;
  category_id: string | null;
  has_variants: boolean;
  rate: number;
  new_edition: boolean;
  discount_30_percent: boolean;
  price: number | null;
  stock: number | null;
  images: ProductImageCreate[];
  variants: ProductVariantCreate[];
}

export interface ProductColor {
  id: string;
  name: string;
  hex_code: string;
}

export interface ProductVariantCreate {
  sku: string;
  color_id: string | null;
  price: number;
  stock: number;
  attributes?: Record<string, unknown>;
  images?: ProductImageCreate[];
}
