
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

export interface ProductVariant {
  id: string;
  sku: string;
  price: string;
  stock: number;
  attributes: Record<string, unknown>;
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
