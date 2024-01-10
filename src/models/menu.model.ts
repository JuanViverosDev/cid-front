//Categories models
export interface CREATE_NEW_CATEGORY_MODEL {
  name: string;
  description: string;
  state: boolean;
  modules: any[];
}
export interface UPDATE_CATEGORY_MODEL {
  name?: string;
  description?: string;
  state?: boolean;
  modules?: any[];
}
export interface UPDATE_CATEGORY_STATE_MODEL {
  state: boolean;
}

//Modules models
export interface CREATE_NEW_MODULE_MODEL {
  name: string;
  description: string;
  state: boolean;
  url: string;
  icon: string;
}
export interface UPDATE_MODULE_MODEL {
  name?: string;
  description?: string;
  state?: boolean;
  url?: string;
  icon?: string;
}
export interface UPDATE_MODULE_STATE_MODEL {
  state: boolean;
}
