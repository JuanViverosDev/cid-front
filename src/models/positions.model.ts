export interface CREATE_POSITIONS_MODEL {
  positionName: string;
  positionState: boolean;
}
export interface UPDATE_POSITIONS_MODEL {
  positionName?: string;
  positionState?: boolean;
}
export interface UPDATE_POSITIONS_STATE_MODEL {
  positionState: boolean;
}
