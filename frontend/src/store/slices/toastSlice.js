import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    open: false,
    title: "",
    description: "",
    variant: "info",
  },
  reducers: {
    showToast: (state, action) => {
      return {
        open: true,
        ...action.payload,
      };
    },
    hideToast: (state) => {
      state.open = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
