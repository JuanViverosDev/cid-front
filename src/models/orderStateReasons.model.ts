//Order Reasons Services
export interface CREATE_NEW_ORDER_REASON_MODEL {
  name: string;
  state: boolean;
}
export interface UPDATE_NEW_ORDER_REASON_MODEL {
  name?: string;
  state?: boolean;
}
export interface UPDATE_ORDER_REASON_STATE_MODEL {
  state: boolean;
}
