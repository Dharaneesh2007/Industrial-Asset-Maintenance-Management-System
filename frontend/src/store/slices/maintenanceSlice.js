import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import maintenanceService from '../../services/maintenanceService';

export const fetchSchedules = createAsyncThunk(
  'maintenance/fetchSchedules',
  async (_, { rejectWithValue }) => {
    try {
      const data = await maintenanceService.getSchedules();
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch schedules';
      return rejectWithValue(message);
    }
  }
);

export const completeTask = createAsyncThunk(
  'maintenance/completeTask',
  async (logData, { rejectWithValue }) => {
    try {
      const data = await maintenanceService.completeTask(logData);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to complete task';
      return rejectWithValue(message);
    }
  }
);

export const createSchedule = createAsyncThunk(
  'maintenance/createSchedule',
  async (scheduleData, { rejectWithValue }) => {
    try {
      const data = await maintenanceService.createSchedule(scheduleData);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create schedule';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  schedules: [],
  loading: false,
  error: null,
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    clearMaintenanceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload || [];
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(completeTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.loading = false;
        const targetId = action.meta?.arg?.scheduleId;
        if (targetId !== undefined) {
          state.schedules = state.schedules.filter((s) => s.id !== targetId);
        }
      })
      .addCase(completeTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules.push(action.payload);
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMaintenanceError } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
