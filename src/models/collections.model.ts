//Collections models
export interface CREATE_COLLECTION_MODEL {
  name: string;
  description: string;
  state: boolean;
  img_collection: string;
  miniature_collection: string;
  order: number;
  rows: number;
  products: any;
}
export interface UPDATE_COLLECTION_MODEL {
  name?: string;
  description?: string;
  state?: boolean;
  img_collection?: string;
  miniature_collection?: string;
  order?: number;
  rows?: number;
  products?: any;
}
export interface UPDATE_COLLECTION_STATE_MODEL {
  state: boolean;
}
