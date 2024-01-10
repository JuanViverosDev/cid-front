export interface LOGIN_MODEL {
  email: string;
  password: string;
}

export interface FORGOT_PASS_MODEL {
  emailUser: string;
}

export interface AUTH {
  reLogin: boolean;
  data: {
    stsTokenManager: {
      token?: string;
    },
    menu?: any[];
    user?: {
      fireBaseUUID: string;
      id: string;
      userName: string;
      userLastName: string;
      idNumber: string;
      userEmail: string;
      userRole: {
        createdAt: string;
        id: number;
        roleName: string;
        roleState: boolean;
        updatedAt: string;
      };
      userState: string;
    };
  };
}
