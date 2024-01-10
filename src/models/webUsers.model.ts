export interface CREATE_WEB_USERS_MODEL {
  userName: string;
  userLastName: string;
  userEmail: string;
  password: string;
}

export interface UPDATE_WEB_USERS_MODEL {
  userName?: string;
  userLastName?: string;
  userEmail?: string;
  password?: string;
  userState?: boolean;
}

export interface UPDATE_WEB_USER_STATE_MODEL {
  userState: boolean;
}
