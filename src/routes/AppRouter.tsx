import UserAccount from "@components/Profile/UserAccount";
import UserNotifications from "@components/Profile/UserNotifications";
import UserPurchases from "@components/Profile/UserPurchases";
import UserReviews from "@components/Profile/UserReviews";
import MainLayout from "@layouts/MainLayout/MainLayout";
import Home from "@pages/Home/Home";
import Login from "@pages/Login/Login";
import Profile from "@pages/Profile/Profile";
import PropertyList from "@pages/PropertyList/PropertyList";
import Register from "@pages/Register/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/hook";
import { useEffect } from "react";
import ActCheckAuth from "@store/Auth/Act/ActCheckAuth";
import PropertyDetails from "@pages/PropertyDetails/PropertyDetails";
import LoadingScreen from "@components/common/LoaderScreen/LoadingScreen";
import ErrorScreen from "@components/common/ErrorScreen/ErrorScreen";
import ForgetPassword from "@pages/ForgetPassword/ForgetPassword";
import ResetPassword from "@pages/ResetPassword/ResetPassword";
import OAuthCallback from "@pages/OAuthCallback/OAuthCallback";
import OwnerDashboard from "@pages/OwnerDashboard/OwnerDashboard";
import DashboardOverview from "@components/owner/DashboardOverview";
import ManageProperties from "@components/owner/ManageProperties";
import AddPropertyForm from "@components/owner/AddPropertyForm";
import EditProperty from "@components/owner/EditProperty";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        path: "/auth/callback",
        element: <OAuthCallback />,
      },
      {
        path:"forgot-password",
        element:<ForgetPassword />
      },
      {
        path:"/reset-password",
        element:<ResetPassword />

      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "profile/home",
        element: <Profile />,
      },
      {
        path: "profile/reviews",
        element: <UserReviews />,
      },
      {
        path: "profile/account",
        element: <UserAccount />,
      },
      {
        path: "profile/notifications",
        element: <UserNotifications />,
      },
      {
        path: "profile/purchases",
        element: <UserPurchases />,
      },
      {
        path: "property",
        element: <PropertyList />,
      },
      {
        path: "property/:id",
        element: <PropertyDetails />,
      },
       { 
        path: "property/:id/edit",
        element: <EditProperty />,
      },
      {
      path: "/owner-dashboard",
      element: <OwnerDashboard />,
      children: [
        {
          index: true,
          element: <DashboardOverview />,
        },
        {
          path: "manage-properties",
          element: <ManageProperties />,
        },
        {
          path: "add-property",
          element: <AddPropertyForm />,
        },
      ],
    }
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
  return(
  <>
     <RouterProvider router={router} />;
     <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
  </>
  ) 
}

export default AppRouter;
