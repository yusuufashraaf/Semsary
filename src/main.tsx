import { createRoot } from "react-dom/client";

import AppRouter from "@routes/AppRouter.tsx";
// styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";
import { Provider } from "react-redux";
import { persistor,store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <AppRouter />
        </PersistGate>

    </Provider>
);
