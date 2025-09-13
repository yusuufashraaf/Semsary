import MainLayout from "@layouts/MainLayout/MainLayout";
import Home from "@pages/Home/Home";
import Login from "@pages/Login/Login";
import PropertyList from "@pages/PropertyList/PropertyList";
import Register from "@pages/Register/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { properties } from "@components/PropertyList/PropertyData.js";
import { useAppDispatch, useAppSelector } from "@store/hook";
import { useEffect } from "react";
import ActCheckAuth from "@store/Auth/Act/ActCheckAuth";
import PropertyDetails from "@pages/PropertyDetails/PropertyDetails";
import LoadingScreen from "@components/common/LoaderScreen/LoadingScreen";
import ErrorScreen from "@components/common/ErrorScreen/ErrorScreen";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorScreen />,
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
      {
        path: "property/:id",
        element: <PropertyDetails />,
      },
    ],
  },
]);

function AppRouter() {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector(
    (state) => state.Authslice.isInitialized
  );

  useEffect(() => {
    dispatch(ActCheckAuth());
  }, [dispatch]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }
  return <RouterProvider router={router} />;
}

export default AppRouter;
