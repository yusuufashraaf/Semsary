import { createRoot } from "react-dom/client";
import AppRouter from "@routes/AppRouter.tsx";

// Styles - Keep Bootstrap and main website styles only
import "@styles/themes.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";
import "./components/Profile/profile-components.css";
import { Provider } from "react-redux";
import { persistor, store } from "@store/index";
import { PersistGate } from "redux-persist/integration/react";

// For the Admin dashboard
import { QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@lib/queryClient";
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.info = () => {};
}

createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
