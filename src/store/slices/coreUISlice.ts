import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CoreUISliceState {
  isSidebarOpen: boolean;
  sidebarShow: boolean;
}

const initialState: CoreUISliceState = {
  isSidebarOpen: false,
  sidebarShow: true,
};

const coreUISlice = createSlice({
  name: "coreUI",
  initialState,
  reducers: {
    toggleSidebar: (state, action: PayloadAction<CoreUISliceState>) => {
      state.sidebarShow = action.payload.sidebarShow;
    },
  },
});

export const { toggleSidebar } = coreUISlice.actions;

export default coreUISlice.reducer;
