//Brands models
export interface CREATE_PAYMENT_METHOD_MODEL {
  description: string;
  state: boolean;
}
export interface UPDATE_PAYMENT_METHOD_MODEL {
  description?: string;
  state?: boolean;
}
export interface UPDATE_PAYMENT_METHOD_MODEL_STATE {
  state: boolean;
}
