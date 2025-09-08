import { createRoot } from "react-dom/client";

import AppRouter from "@routes/AppRouter.tsx";
// styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(<AppRouter />);
