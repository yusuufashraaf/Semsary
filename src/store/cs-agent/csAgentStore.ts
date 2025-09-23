// CS Agent Store - Following the pattern from src/store/admin/adminStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  CsAgentNotification,
  VerificationStatus,
  Priority,
  PropertyType,
  PropertyState,
  WorkloadStatus
} from "@app-types/cs-agent/cs-agent";

// ==================== UI State Store ====================
interface CsAgentUIState {
  sidebarCollapsed: boolean;
  darkMode: boolean;
  activePage: string;
  notifications: CsAgentNotification[];
  loading: {
    global: boolean;
    dashboard: boolean;
    properties: boolean;
    verification: boolean;
    documents: boolean;
  };
  setSidebarCollapsed: (collapsed: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
  setActivePage: (page: string) => void;
  addNotification: (notification: CsAgentNotification) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  setLoading: (key: keyof CsAgentUIState["loading"], loading: boolean) => void;
}

export const useCsAgentUIStore = create<CsAgentUIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarCollapsed: false,
        darkMode: false,
        activePage: "dashboard",
        notifications: [],
        loading: {
          global: false,
          dashboard: false,
          properties: false,
          verification: false,
          documents: false,
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
        markNotificationAsRead: (id) =>
          set(
            (state) => ({
              notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
              ),
            }),
            false,
            "markNotificationAsRead"
          ),
        markAllNotificationsAsRead: () =>
          set(
            (state) => ({
              notifications: state.notifications.map((n) => ({ ...n, read: true })),
            }),
            false,
            "markAllNotificationsAsRead"
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
        name: "cs-agent-ui-store",
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          darkMode: state.darkMode,
        }),
      }
    ),
    { name: "cs-agent-ui-store" }
  )
);

// ==================== Filter State Store ====================
interface CsAgentFilterState {
  propertyFilters: {
    status?: VerificationStatus[];
    priority?: Priority;
    property_type?: PropertyType;
    property_state?: PropertyState;
    search?: string;
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    sort_order?: "asc" | "desc";
  };
  dashboardFilters: {
    period?: string;
    agent_id?: number;
    workload_status?: WorkloadStatus;
  };
  setPropertyFilters: (filters: Partial<CsAgentFilterState["propertyFilters"]>) => void;
  setDashboardFilters: (filters: Partial<CsAgentFilterState["dashboardFilters"]>) => void;
  clearPropertyFilters: () => void;
  clearDashboardFilters: () => void;
  clearAllFilters: () => void;
}

export const useCsAgentFilterStore = create<CsAgentFilterState>()(
  devtools(
    (set) => ({
      propertyFilters: {},
      dashboardFilters: {},
      setPropertyFilters: (filters) =>
        set(
          (state) => ({
            propertyFilters: { ...state.propertyFilters, ...filters },
          }),
          false,
          "setPropertyFilters"
        ),
      setDashboardFilters: (filters) =>
        set(
          (state) => ({
            dashboardFilters: { ...state.dashboardFilters, ...filters },
          }),
          false,
          "setDashboardFilters"
        ),
      clearPropertyFilters: () =>
        set({ propertyFilters: {} }, false, "clearPropertyFilters"),
      clearDashboardFilters: () =>
        set({ dashboardFilters: {} }, false, "clearDashboardFilters"),
      clearAllFilters: () =>
        set(
          { propertyFilters: {}, dashboardFilters: {} },
          false,
          "clearAllFilters"
        ),
    }),
    { name: "cs-agent-filter-store" }
  )
);

// ==================== Selection State Store ====================
interface CsAgentSelectionState {
  selectedProperties: number[];
  selectedDocuments: number[];
  selectAllProperties: boolean;
  selectAllDocuments: boolean;
  setSelectedProperties: (ids: number[]) => void;
  setSelectedDocuments: (ids: number[]) => void;
  setSelectAllProperties: (selectAll: boolean) => void;
  setSelectAllDocuments: (selectAll: boolean) => void;
  togglePropertySelection: (id: number) => void;
  toggleDocumentSelection: (id: number) => void;
  toggleSelectAllProperties: () => void;
  toggleSelectAllDocuments: () => void;
  clearSelections: () => void;
}

export const useCsAgentSelectionStore = create<CsAgentSelectionState>()(
  devtools(
    (set) => ({
      selectedProperties: [],
      selectedDocuments: [],
      selectAllProperties: false,
      selectAllDocuments: false,
      setSelectedProperties: (ids) =>
        set({ selectedProperties: ids }, false, "setSelectedProperties"),
      setSelectedDocuments: (ids) =>
        set({ selectedDocuments: ids }, false, "setSelectedDocuments"),
      setSelectAllProperties: (selectAll) =>
        set({ selectAllProperties: selectAll }, false, "setSelectAllProperties"),
      setSelectAllDocuments: (selectAll) =>
        set({ selectAllDocuments: selectAll }, false, "setSelectAllDocuments"),
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
      toggleDocumentSelection: (id) =>
        set(
          (state) => ({
            selectedDocuments: state.selectedDocuments.includes(id)
              ? state.selectedDocuments.filter((docId) => docId !== id)
              : [...state.selectedDocuments, id],
          }),
          false,
          "toggleDocumentSelection"
        ),
      toggleSelectAllProperties: () =>
        set(
          (state) => ({ selectAllProperties: !state.selectAllProperties }),
          false,
          "toggleSelectAllProperties"
        ),
      toggleSelectAllDocuments: () =>
        set(
          (state) => ({ selectAllDocuments: !state.selectAllDocuments }),
          false,
          "toggleSelectAllDocuments"
        ),
      clearSelections: () =>
        set(
          {
            selectedProperties: [],
            selectedDocuments: [],
            selectAllProperties: false,
            selectAllDocuments: false,
          },
          false,
          "clearSelections"
        ),
    }),
    { name: "cs-agent-selection-store" }
  )
);

// ==================== Modal State Store ====================
interface CsAgentModalState {
  modals: {
    propertyDetails: { open: boolean; propertyId?: number };
    verificationUpdate: { open: boolean; assignmentId?: number };
    documentUpload: { open: boolean; propertyId?: number };
    documentPreview: { open: boolean; documentId?: number };
    confirmStatus: { open: boolean; assignmentId?: number; newStatus?: VerificationStatus };
    bulkActions: { open: boolean; action?: string };
    timeline: { open: boolean; assignmentId?: number };
  };
  openModal: (modal: keyof CsAgentModalState["modals"], data?: any) => void;
  closeModal: (modal: keyof CsAgentModalState["modals"]) => void;
  closeAllModals: () => void;
}

export const useCsAgentModalStore = create<CsAgentModalState>()(
  devtools(
    (set) => ({
      modals: {
        propertyDetails: { open: false },
        verificationUpdate: { open: false },
        documentUpload: { open: false },
        documentPreview: { open: false },
        confirmStatus: { open: false },
        bulkActions: { open: false },
        timeline: { open: false },
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
              {} as CsAgentModalState["modals"]
            ),
          }),
          false,
          "closeAllModals"
        ),
    }),
    { name: "cs-agent-modal-store" }
  )
);

// ==================== Upload State Store ====================
interface UploadState {
  uploadProgress: Record<string, number>;
  uploadingFiles: File[];
  uploadErrors: Record<string, string>;
  setUploadProgress: (fileId: string, progress: number) => void;
  addUploadingFile: (file: File) => void;
  removeUploadingFile: (fileName: string) => void;
  setUploadError: (fileId: string, error: string) => void;
  clearUploadState: () => void;
}

export const useCsAgentUploadStore = create<UploadState>()(
  devtools(
    (set) => ({
      uploadProgress: {},
      uploadingFiles: [],
      uploadErrors: {},
      setUploadProgress: (fileId, progress) =>
        set(
          (state) => ({
            uploadProgress: { ...state.uploadProgress, [fileId]: progress },
          }),
          false,
          "setUploadProgress"
        ),
      addUploadingFile: (file) =>
        set(
          (state) => ({
            uploadingFiles: [...state.uploadingFiles, file],
          }),
          false,
          "addUploadingFile"
        ),
      removeUploadingFile: (fileName) =>
        set(
          (state) => ({
            uploadingFiles: state.uploadingFiles.filter((f) => f.name !== fileName),
          }),
          false,
          "removeUploadingFile"
        ),
      setUploadError: (fileId, error) =>
        set(
          (state) => ({
            uploadErrors: { ...state.uploadErrors, [fileId]: error },
          }),
          false,
          "setUploadError"
        ),
      clearUploadState: () =>
        set(
          {
            uploadProgress: {},
            uploadingFiles: [],
            uploadErrors: {},
          },
          false,
          "clearUploadState"
        ),
    }),
    { name: "cs-agent-upload-store" }
  )
);

// ==================== Utility Functions for Notifications ====================
export const useCsAgentNotifications = () => {
  const { 
    notifications, 
    addNotification, 
    removeNotification, 
    markNotificationAsRead, 
    markAllNotificationsAsRead 
  } = useCsAgentUIStore();

  const showNotification = (
    type: CsAgentNotification["type"],
    title: string,
    message: string,
    options?: { autoClose?: boolean; duration?: number }
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: CsAgentNotification = {
      id,
      type,
      title,
      message,
      read: false,
      autoClose: options?.autoClose ?? true,
      duration: options?.duration ?? 5000,
      timestamp: new Date().toISOString(),
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
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };
};
