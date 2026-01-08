import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { companiesAPI } from "../../services/api.js";

const initialState = {
  companies: [],
  selectedCompany: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCompanies = createAsyncThunk(
  "companies/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await companiesAPI.getAll();
      return response.companies || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCompany = createAsyncThunk(
  "companies/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companiesAPI.create(data);
      return response.company || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCompany = createAsyncThunk(
  "companies/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await companiesAPI.update(id, data);
      return response.company || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  "companies/delete",
  async (id, { rejectWithValue }) => {
    try {
      await companiesAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchCompanies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companies.push(action.payload);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter(
          (c) => c.id !== action.payload
        );
      });
  },
});

export const { setSelectedCompany, clearError } = companiesSlice.actions;
export default companiesSlice.reducer;
