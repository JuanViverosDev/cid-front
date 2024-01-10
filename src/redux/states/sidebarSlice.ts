import { createSlice } from '@reduxjs/toolkit';

import { SIDEBAR_STATE } from '../../models';

export const SidebarEmptyState: SIDEBAR_STATE = {
  open: false,
};

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: SidebarEmptyState,
  reducers: {
    toggleOpen: (state) => {
      return {
        open: !state.open,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleOpen } = sidebarSlice.actions;

export default sidebarSlice.reducer;
