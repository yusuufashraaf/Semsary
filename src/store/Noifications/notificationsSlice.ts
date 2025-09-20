// store/notificationsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RentNotification = {
  id: number;
  message: string;
  property_id?: number;
};

interface NotificationsState {
  items: RentNotification[];
}

const initialState: NotificationsState = {
  items: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<RentNotification>) => {
      state.items.unshift(action.payload);
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;