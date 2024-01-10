//Request Types
export interface CREATE_REQUEST_TYPES_MODEL {
  typeReqName: string;
}
export interface UPDATE_REQUEST_TYPE_MODEL {
  typeReqName: string;
  typeReqState: boolean;
}
export interface UPDATE_REQUEST_TYPE_STATE_MODEL {
  typeReqState: boolean;
}
