import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {  markNotificationAsRead } from "@services/axios-global";
import { actFetchNotifications } from "./Act/actFetchNotifications";

export interface Notification {
  id: string;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  feedback?: string;
  created_at: string;
  updated_at: string;
  property_id?: number;
}

interface NotificationsState {
  items: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  loading: false,
  error: null,
};


// 🔹 Mark notification as read
export const markAsRead = createAsyncThunk<
  { notificationId: number },
  { userId: number; notificationId: number },
  { rejectValue: string }
>(
  "notifications/markAsRead",
  async ({ userId, notificationId }, { rejectWithValue }) => {
    try {
      await markNotificationAsRead(userId, notificationId);
      return { notificationId };
    } catch (error) {
      return rejectWithValue("Failed to mark notification as read");
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload); // prepend latest
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(actFetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actFetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        
        state.items = action.payload;
      })
      .addCase(actFetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Error fetching notifications";
      })

      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action ) => {
        const notification = state.items.find(
          (n) => n.id === action.payload.notificationId 
        );
        if (notification) {
          notification.is_read = true;
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload ?? "Error marking notification as read";
      });
  },
});

export const { addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
