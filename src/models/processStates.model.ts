//Providers models
export interface CREATE_PROCESS_STATES_MODEL {
  processStateName: string;
}
export interface UPDATE_PROCESS_STATES_MODEL {
  processStateName?: string;
  processStateState?: boolean;
}
export interface UPDATE_PROCESS_STATES_STATE_MODEL {
  processStateState: boolean;
}
