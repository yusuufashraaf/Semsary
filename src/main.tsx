import { createRoot } from "react-dom/client";

import AppRouter from "@routes/AppRouter.tsx";
// styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";
import { Provider } from "react-redux";
import store from "./store";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
    <AppRouter />

    </Provider>
);
