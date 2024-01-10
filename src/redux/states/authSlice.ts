import { createSlice } from '@reduxjs/toolkit';

/** Import Interfaces **/
import { AUTH } from '../../models/';

export const AuthEmptyState: AUTH = {
  reLogin: false,
  data: {
    stsTokenManager: {
      token: ''
    },
    menu: [],
    user: {
      fireBaseUUID: '',
      id: '',
      userName: '',
      userLastName: '',
      idNumber: '',
      userEmail: '',
      userRole: {
        createdAt: '',
        id: 0,
        roleName: '',
        roleState: true,
        updatedAt: '',
      },
      userState: '',
    },
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState: AuthEmptyState,
  reducers: {
    setNewToken(state, action) {      
      state.data.stsTokenManager.token = action.payload;
    },

    setSidebarMenu(state, action) {
      state.data.menu = action.payload;
    },

    setLoggedUser(state, action) {
      state.data.user = action.payload;
    },
    setReLogin(state, action) {
      state.reLogin = action.payload;
    },

    logOut() {
      return {
        ...AuthEmptyState,
      };
    },
  },
});
export const { setNewToken, setSidebarMenu, logOut, setLoggedUser, setReLogin } = authSlice.actions;

export default authSlice.reducer;
