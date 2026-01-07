import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import companiesReducer from "./slices/companiesSlice.js";
import employeesReducer from "./slices/employeesSlice.js";
import attendanceReducer from "./slices/attendanceSlice.js";
import toastReducer from "./slices/toastSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    companies: companiesReducer,
    employees: employeesReducer,
    attendance: attendanceReducer,
    toast: toastReducer,
  },
});
