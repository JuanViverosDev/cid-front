export interface CREATE_CONTACT_TYPE_MODEL {
  communicationName: string;
  communicationState: boolean;
}

export interface UPDATE_CONTACT_TYPES_MODEL {
  communicationName?: string;
  communicationState?: boolean;
}
export interface UPDATE_CONTACT_TYPE_STATE_MODEL {
  communicationState: boolean;
}
