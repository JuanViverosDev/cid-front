export interface CREATE_PRODUCT_REQUEST_MODEL {
  name: string;
  description: string;
  weight: number;
  price: number;
  quantity: number;
  product_url: string;
  state: boolean;
  brandId: number;
  categoryId: number;
  subcategoryId: number;
  image_url: string;
  height: number;
  width: number;
  large: number;
  volumetric_weight: number;
  feature: any[];
}
export interface UPDATE_PRODUCT_MODEL {
  name?: string;
  description?: string;
  weight?: number;
  price?: number;
  quantity?: number;
  product_url?: string;
  state?: boolean;
  brandId?: number;
  categoryId?: number;
  subcategoryId?: number;
  image_url?: string;
  height?: number;
  width?: number;
  large?: number;
  volumetric_weight?: number;
  feature?: any[];
}
export interface UPDATE_PRODUCT_STATE_MODEL {
  state: boolean;
}
