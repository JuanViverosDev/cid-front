export interface CREATE_SECTION_MODEL {
  section_name: string;
  section_state: boolean;
  section_type: string;
  order: number;
  rows: number;
  quantity: number;
  description: string;
  detail: any[];
}
export interface UPDATE_SECTION_MODEL {
  section_name?: string;
  section_state?: boolean;
  section_type?: string;
  order?: number;
  rows?: number;
  quantity?: number;
  description?: string;
  detail?: any[];
}
export interface UPDATE_SECTION_STATUS_MODEL {
  state: boolean;
}
