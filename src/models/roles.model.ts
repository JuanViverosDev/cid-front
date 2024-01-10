export interface ROLE {
  id: number;
  name: string;
  state: boolean;
  createdAt: string;
  updatedAt: string;
  modules: [];
}

export interface CREATE_NEW_ROLE_MODEL {
  roleName: string;
  roleModules: any[];
  requestManager: boolean;
  roleState: boolean;
}

export interface UPDATE_ROLE_MODEL {
  roleName?: string;
  roleState?: boolean;
  requestManager: boolean;

  modules?: any[];
}

export interface UPDATE_ROLE_STATE_MODEL {
  roleState: boolean;
}
