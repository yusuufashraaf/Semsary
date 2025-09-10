import MainLayout from "@layouts/MainLayout/MainLayout";
import Error from "@pages/Error/Error";
import Home from "@pages/Home/Home";
import Login from "@pages/Login/Login";
import PropertyList from "@pages/PropertyList/PropertyList";
import Register from "@pages/Register/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { properties } from "@components/PropertyList/PropertyData.js";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "property",
        element: <PropertyList listings={properties} />,
      },
    ],
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
