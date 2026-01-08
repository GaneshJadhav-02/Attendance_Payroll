import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { employeesAPI } from "../../services/api.js";

const initialState = {
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchEmployeesByCompany = createAsyncThunk(
  "employees/fetchByCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await employeesAPI.getByCompany(companyId);
      return response.employees || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createEmployee = createAsyncThunk(
  "employees/create",
  async ({ companyId, data }, { rejectWithValue }) => {
    try {
      const response = await employeesAPI.create(companyId, data);
      return response.employee || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await employeesAPI.update(id, data);
      return response.employee || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (id, { rejectWithValue }) => {
    try {
      await employeesAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
    clearEmployees: (state) => {
      state.employees = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch by company
      .addCase(fetchEmployeesByCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployeesByCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployeesByCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(
          (e) => e.id !== action.payload
        );
      });
  },
});

export const { setSelectedEmployee, clearEmployees, clearError } =
  employeesSlice.actions;
export default employeesSlice.reducer;
