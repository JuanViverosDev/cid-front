//Brands models
export interface CREATE_BRAND_MODEL {
  name: string;
  img_brand_base64: string;
  state: boolean;
}
export interface UPDATE_BRAND_MODEL {
  name?: string;
  img_brand_base64?: string;
  state?: boolean;
}
export interface UPDATE_BRAND_STATE_MODEL {
  state: boolean;
}
