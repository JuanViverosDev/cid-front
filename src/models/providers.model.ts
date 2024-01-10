//Providers models
export interface CREATE_PROVIDERS_MODEL {
  name: string;
  state: boolean;
  activity: string;
}
export interface UPDATE_PROVIDERS_MODEL {
  name?: string;
  state?: boolean;
  activity?: string;
}
export interface UPDATE_PROVIDERS_STATE_MODEL {
  state: boolean;
}
