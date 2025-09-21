/* eslint-disable @typescript-eslint/no-explicit-any */
// src/stores/adminStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Notification, UserRole, UserStatus } from "@app-types/admin/admin"; // User, Property, Transaction not used

// UI State Store
interface UIState {
  sidebarCollapsed: boolean;
  darkMode: boolean;
  activePage: string;
  notifications: Notification[];
  loading: {
    global: boolean;
    dashboard: boolean;
    users: boolean;
    properties: boolean;
    transactions: boolean;
  };
  setSidebarCollapsed: (collapsed: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
  setActivePage: (page: string) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  setLoading: (key: keyof UIState["loading"], loading: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({ // get not used
        sidebarCollapsed: false,
        darkMode: false,
        activePage: "dashboard",
        notifications: [],
        loading: {
          global: false,
          dashboard: false,
          users: false,
          properties: false,
          transactions: false,
        },
        setSidebarCollapsed: (collapsed) =>
          set({ sidebarCollapsed: collapsed }, false, "setSidebarCollapsed"),
        setDarkMode: (darkMode) => set({ darkMode }, false, "setDarkMode"),
        setActivePage: (page) =>
          set({ activePage: page }, false, "setActivePage"),
        addNotification: (notification) =>
          set(
            (state) => ({
              notifications: [...state.notifications, notification],
            }),
            false,
            "addNotification"
          ),
        removeNotification: (id) =>
          set(
            (state) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
            }),
            false,
            "removeNotification"
          ),
        setLoading: (key, loading) =>
          set(
            (state) => ({
              loading: { ...state.loading, [key]: loading },
            }),
            false,
            "setLoading"
          ),
      }),
      {
        name: "admin-ui-store",
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          darkMode: state.darkMode,
        }),
      }
    ),
    { name: "admin-ui-store" }
  )
);

// Filter State Store
interface FilterState {
  userFilters: {
    role?: UserRole;
    status?: UserStatus;
    search?: string;
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    sort_order?: "asc" | "desc";
  };
  propertyFilters: {
    status?: string;
    type?: string;
    priceRange?: [number, number];
    location?: string;
    dateRange?: [Date | null, Date | null];
    search?: string;
  };
  transactionFilters: {
    status?: string;
    type?: string;
    paymentGateway?: string;
    amountRange?: [number, number];
    dateRange?: [Date | null, Date | null];
    userId?: number;
    propertyId?: number;
  };
  setUserFilters: (filters: Partial<FilterState["userFilters"]>) => void;
  setPropertyFilters: (
    filters: Partial<FilterState["propertyFilters"]>
  ) => void;
  setTransactionFilters: (
    filters: Partial<FilterState["transactionFilters"]>
  ) => void;
  clearUserFilters: () => void;
  clearPropertyFilters: () => void;
  clearTransactionFilters: () => void;
}

export const useFilterStore = create<FilterState>()(
  devtools(
    (set) => ({
      userFilters: {},
      propertyFilters: {},
      transactionFilters: {},
      setUserFilters: (filters) =>
        set(
          (state) => ({
            userFilters: { ...state.userFilters, ...filters },
          }),
          false,
          "setUserFilters"
        ),
      setPropertyFilters: (filters) =>
        set(
          (state) => ({
            propertyFilters: { ...state.propertyFilters, ...filters },
          }),
          false,
          "setPropertyFilters"
        ),
      setTransactionFilters: (filters) =>
        set(
          (state) => ({
            transactionFilters: { ...state.transactionFilters, ...filters },
          }),
          false,
          "setTransactionFilters"
        ),
      clearUserFilters: () =>
        set({ userFilters: {} }, false, "clearUserFilters"),
      clearPropertyFilters: () =>
        set({ propertyFilters: {} }, false, "clearPropertyFilters"),
      clearTransactionFilters: () =>
        set({ transactionFilters: {} }, false, "clearTransactionFilters"),
    }),
    { name: "admin-filter-store" }
  )
);

// Selection State Store (for bulk actions)
interface SelectionState {
  selectedUsers: number[];
  selectedProperties: number[];
  selectedTransactions: number[];
  selectAllUsers: boolean;
  selectAllProperties: boolean;
  selectAllTransactions: boolean;
  setSelectedUsers: (ids: number[]) => void;
  setSelectedProperties: (ids: number[]) => void;
  setSelectedTransactions: (ids: number[]) => void;
  setSelectAllUsers: (selectAll: boolean) => void;
  setSelectAllProperties: (selectAll: boolean) => void;
  setSelectAllTransactions: (selectAll: boolean) => void;
  toggleUserSelection: (id: number) => void;
  togglePropertySelection: (id: number) => void;
  toggleTransactionSelection: (id: number) => void;
  toggleSelectAllUsers: () => void;
  toggleSelectAllProperties: () => void;
  toggleSelectAllTransactions: () => void;
  clearSelections: () => void;
}

export const useSelectionStore = create<SelectionState>()(
  devtools(
    (set) => ({ // get not used
      selectedUsers: [],
      selectedProperties: [],
      selectedTransactions: [],
      selectAllUsers: false,
      selectAllProperties: false,
      selectAllTransactions: false,
      setSelectedUsers: (ids) =>
        set({ selectedUsers: ids }, false, "setSelectedUsers"),
      setSelectedProperties: (ids) =>
        set({ selectedProperties: ids }, false, "setSelectedProperties"),
      setSelectedTransactions: (ids) =>
        set({ selectedTransactions: ids }, false, "setSelectedTransactions"),
      setSelectAllUsers: (selectAll) =>
        set({ selectAllUsers: selectAll }, false, "setSelectAllUsers"),
      setSelectAllProperties: (selectAll) =>
        set({ selectAllProperties: selectAll }, false, "setSelectAllProperties"),
      setSelectAllTransactions: (selectAll) =>
        set({ selectAllTransactions: selectAll }, false, "setSelectAllTransactions"),
      toggleUserSelection: (id) =>
        set(
          (state) => ({
            selectedUsers: state.selectedUsers.includes(id)
              ? state.selectedUsers.filter((userId) => userId !== id)
              : [...state.selectedUsers, id],
          }),
          false,
          "toggleUserSelection"
        ),
      togglePropertySelection: (id) =>
        set(
          (state) => ({
            selectedProperties: state.selectedProperties.includes(id)
              ? state.selectedProperties.filter((propId) => propId !== id)
              : [...state.selectedProperties, id],
          }),
          false,
          "togglePropertySelection"
        ),
      toggleTransactionSelection: (id) =>
        set(
          (state) => ({
            selectedTransactions: state.selectedTransactions.includes(id)
              ? state.selectedTransactions.filter((txId) => txId !== id)
              : [...state.selectedTransactions, id],
          }),
          false,
          "toggleTransactionSelection"
        ),
      toggleSelectAllUsers: () =>
        set(
          (state) => ({ selectAllUsers: !state.selectAllUsers }),
          false,
          "toggleSelectAllUsers"
        ),
      toggleSelectAllProperties: () =>
        set(
          (state) => ({ selectAllProperties: !state.selectAllProperties }),
          false,
          "toggleSelectAllProperties"
        ),
      toggleSelectAllTransactions: () =>
        set(
          (state) => ({ selectAllTransactions: !state.selectAllTransactions }),
          false,
          "toggleSelectAllTransactions"
        ),
      clearSelections: () =>
        set(
          {
            selectedUsers: [],
            selectedProperties: [],
            selectedTransactions: [],
            selectAllUsers: false,
            selectAllProperties: false,
            selectAllTransactions: false,
          },
          false,
          "clearSelections"
        ),
    }),
    { name: "admin-selection-store" }
  )
);

// Modal State Store
interface ModalState {
  modals: {
    userDetails: { open: boolean; userId?: number };
    propertyDetails: { open: boolean; propertyId?: number };
    transactionDetails: { open: boolean; transactionId?: number };
    userEdit: { open: boolean; userId?: number };
    propertyApproval: { open: boolean; propertyId?: number };
    transactionRefund: { open: boolean; transactionId?: number };
    bulkActions: {
      open: boolean;
      type?: "users" | "properties" | "transactions";
    };
  };
  openModal: (modal: keyof ModalState["modals"], data?: any) => void;
  closeModal: (modal: keyof ModalState["modals"]) => void;
  closeAllModals: () => void;
}

export const useModalStore = create<ModalState>()(
  devtools(
    (set) => ({
      modals: {
        userDetails: { open: false },
        propertyDetails: { open: false },
        transactionDetails: { open: false },
        userEdit: { open: false },
        propertyApproval: { open: false },
        transactionRefund: { open: false },
        bulkActions: { open: false },
      },
      openModal: (modal, data = {}) =>
        set(
          (state) => ({
            modals: {
              ...state.modals,
              [modal]: { open: true, ...data },
            },
          }),
          false,
          "openModal"
        ),
      closeModal: (modal) =>
        set(
          (state) => ({
            modals: {
              ...state.modals,
              [modal]: { open: false },
            },
          }),
          false,
          "closeModal"
        ),
      closeAllModals: () =>
        set(
          (state) => ({
            modals: Object.keys(state.modals).reduce(
              (acc, key) => ({
                ...acc,
                [key]: { open: false },
              }),
              {} as ModalState["modals"]
            ),
          }),
          false,
          "closeAllModals"
        ),
    }),
    { name: "admin-modal-store" }
  )
);

// Utility functions for notifications
export const useNotifications = () => {
  const { notifications, addNotification, removeNotification } = useUIStore();

  const showNotification = (
    type: Notification["type"],
    title: string,
    message: string,
    options?: { autoClose?: boolean; duration?: number }
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: Notification = {
      id,
      type,
      title,
      message,
      autoClose: options?.autoClose ?? true,
      duration: options?.duration ?? 5000,
    };

    addNotification(notification);

    if (notification.autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }

    return id;
  };

  const showSuccess = (
    title: string,
    message: string,
    options?: { autoClose?: boolean; duration?: number }
  ) => showNotification("success", title, message, options);

  const showError = (
    title: string,
    message: string,
    options?: { autoClose?: boolean; duration?: number }
  ) => showNotification("error", title, message, options);

  const showWarning = (
    title: string,
    message: string,
    options?: { autoClose?: boolean; duration?: number }
  ) => showNotification("warning", title, message, options);

  const showInfo = (
    title: string,
    message: string,
    options?: { autoClose?: boolean; duration?: number }
  ) => showNotification("info", title, message, options);

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
  };
};
