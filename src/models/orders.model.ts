//Order Reasons Services
export interface GET_ORDERS_LIST_MODEL {
  start_date: string;
  end_date: string;
}
export interface FORCED_COMPLETE_ORDER_MODEL {
  providerState: string;
  order: any;
}

export interface SAVE_PRODUCTS_IN_ORDER_MODEL {
  weight: string;
  tracking_store: string;
  discount: string;
  height: string;
  width: string;
  large: string;
  volumetric_weight: string;
  state: boolean;
  color: string;
  size: string;
  price: string;
}

export interface UPDATE_ORDER_STATE_REASON_MODEL {
  state: any;
  reason: any;
}
export interface UPDATE_ORDER_CUSTOMER_INFO_MODEL {
  address_order: string;
  address_invoice: string;
  postalCode: string;
  city: any;
  country: any;
  personalShopper: number;
  taxes: number;
  discount: number;
}

export interface CREATE_COMMENT_ON_ORDER {
  order: string;
  description: string;
  internalNote: boolean;
  reason: any;
}
