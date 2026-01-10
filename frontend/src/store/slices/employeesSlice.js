import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { employeesAPI } from "../../services/api.js";

const initialState = {
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,
  isCreating: false,
  isPaying: false,
};

// Async thunks
export const fetchEmployeesByCompany = createAsyncThunk(
  "employees/fetchByCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await employeesAPI.getByCompany(companyId);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllEmployees = createAsyncThunk(
  "employees/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await employeesAPI.getAllEmployees();
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createEmployee = createAsyncThunk(
  "employees/create",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await employeesAPI.create(data);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error);
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
      return rejectWithValue(error);
    }
  }
);

export const markAttendance = createAsyncThunk(
  "employees/markAttendance",
  async (data, { rejectWithValue }) => {
    try {
      const response = await employeesAPI.markAttendance(data);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const advanceEmployeePayment = createAsyncThunk(
  "employees/advancePayment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await employeesAPI.advancePayment(data);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error);
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
    setAttendanceStatus: (state, action) => {
      const { employeeId, status } = action.payload;
      const employee = state.employees.find((e) => e.id === employeeId);
      if (employee) {
        employee.attendance_status = status;
      }
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
      // Fetch all employees
      .addCase(fetchAllEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload;
      })
      .addCase(fetchAllEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createEmployee.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.isCreating = false;
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.isCreating = false;
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
      })
      .addCase(advanceEmployeePayment.pending, (state) => {
        state.isPaying = true;
      })
      .addCase(advanceEmployeePayment.fulfilled, (state) => {
        state.isPaying = false;
      })
      .addCase(advanceEmployeePayment.rejected, (state, action) => {
        state.isPaying = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedEmployee,
  clearEmployees,
  clearError,
  setAttendanceStatus,
} = employeesSlice.actions;
export default employeesSlice.reducer;
