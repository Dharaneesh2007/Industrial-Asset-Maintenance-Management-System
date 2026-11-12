import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import assetService from '../../services/assetService';

export const fetchAssets = createAsyncThunk(
  'assets/fetchAssets',
  async (arg = 0, { rejectWithValue }) => {
    try {
      const page = typeof arg === 'object' && arg !== null ? (arg.page ?? 0) : (arg ?? 0);
      const size = typeof arg === 'object' && arg !== null ? (arg.size ?? 10) : 10;
      const data = await assetService.getAll(page, size);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch assets';
      return rejectWithValue(message);
    }
  }
);

export const createAsset = createAsyncThunk(
  'assets/createAsset',
  async (assetData, { rejectWithValue }) => {
    try {
      const data = await assetService.create(assetData);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create asset';
      return rejectWithValue(message);
    }
  }
);

export const decommissionAsset = createAsyncThunk(
  'assets/decommissionAsset',
  async (id, { rejectWithValue }) => {
    try {
      await assetService.decommission(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to decommission asset';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  items: [],
  totalPages: 0,
  totalElements: 0,
  loading: false,
  error: null,
  searchQuery: '',
};

const assetSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.content || (Array.isArray(action.payload) ? action.payload : []);
        state.totalPages = action.payload?.totalPages || 0;
        state.totalElements = action.payload?.totalElements || 0;
      })
      .addCase('assets/fetchAll/fulfilled', (state, action) => {
        state.loading = false;
        state.items = action.payload?.content || (Array.isArray(action.payload) ? action.payload : []);
        state.totalPages = action.payload?.totalPages || 0;
        state.totalElements = action.payload?.totalElements || 0;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAsset.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(decommissionAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(decommissionAsset.fulfilled, (state, action) => {
        state.loading = false;
        const asset = state.items.find((item) => item.id === action.payload);
        if (asset) {
          asset.currentStatus = 'DECOMMISSIONED';
        }
      })
      .addCase(decommissionAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery } = assetSlice.actions;
export default assetSlice.reducer;
