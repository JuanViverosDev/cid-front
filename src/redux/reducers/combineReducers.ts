import { combineReducers } from 'redux';

import { authSlice, sidebarSlice } from '../states';

export default combineReducers({
  auth: authSlice,
  sidebar: sidebarSlice,
});
