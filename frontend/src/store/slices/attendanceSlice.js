import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { attendanceAPI } from "../../services/api.js";

const initialState = {
  records: [],
  reportData: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchAttendanceByCompanyAndDate = createAsyncThunk(
  "attendance/fetchByCompanyAndDate",
  async ({ companyId, date }, { rejectWithValue }) => {
    try {
      const response = await attendanceAPI.getByCompanyAndDate(companyId, date);
      return response.attendance || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAttendance = createAsyncThunk(
  "attendance/mark",
  async ({ employeeId, data }, { rejectWithValue }) => {
    try {
      const response = await attendanceAPI.markAttendance(employeeId, data);
      return response.attendance || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAttendance = createAsyncThunk(
  "attendance/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await attendanceAPI.updateAttendance(id, data);
      return response.attendance || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEmployeeReport = createAsyncThunk(
  "attendance/fetchEmployeeReport",
  async ({ employeeId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await attendanceAPI.getEmployeeReport(
        employeeId,
        startDate,
        endDate
      );
      return response.attendance || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCompanyReport = createAsyncThunk(
  "attendance/fetchCompanyReport",
  async ({ companyId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await attendanceAPI.getCompanyReport(
        companyId,
        startDate,
        endDate
      );
      return response.attendance || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearRecords: (state) => {
      state.records = [];
    },
    clearReportData: (state) => {
      state.reportData = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    // For demo purposes - update attendance locally
    setLocalAttendance: (state, action) => {
      const index = state.records.findIndex(
        (r) =>
          r.employeeId === action.payload.employeeId &&
          r.date === action.payload.date
      );
      if (index !== -1) {
        state.records[index] = action.payload;
      } else {
        state.records.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch by company and date
      .addCase(fetchAttendanceByCompanyAndDate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceByCompanyAndDate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
      })
      .addCase(fetchAttendanceByCompanyAndDate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Mark attendance
      .addCase(markAttendance.fulfilled, (state, action) => {
        const index = state.records.findIndex(
          (r) =>
            r.employeeId === action.payload.employeeId &&
            r.date === action.payload.date
        );
        if (index !== -1) {
          state.records[index] = action.payload;
        } else {
          state.records.push(action.payload);
        }
      })
      // Update attendance
      .addCase(updateAttendance.fulfilled, (state, action) => {
        const index = state.records.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })
      // Fetch employee report
      .addCase(fetchEmployeeReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEmployeeReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reportData = action.payload;
      })
      .addCase(fetchEmployeeReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch company report
      .addCase(fetchCompanyReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCompanyReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reportData = action.payload;
      })
      .addCase(fetchCompanyReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRecords, clearReportData, clearError, setLocalAttendance } =
  attendanceSlice.actions;
export default attendanceSlice.reducer;
