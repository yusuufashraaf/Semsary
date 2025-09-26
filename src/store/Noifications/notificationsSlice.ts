import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserNotifications, markNotificationAsRead } from "@services/axios-global";

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
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

// 🔹 Fetch notifications from API
export const fetchNotifications = createAsyncThunk<
    Notification[],
    number, // userId
    { rejectValue: string }
  >("notifications/fetchNotifications", async (userId, { rejectWithValue }) => {
  try {
    const data = await fetchUserNotifications(userId);
    return data;
  } catch (error) {
    return rejectWithValue("Failed to fetch notifications");
  }
});

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
    // 🔹 Add notification from WebSocket
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload); // prepend latest
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching notifications";
      })

      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
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
