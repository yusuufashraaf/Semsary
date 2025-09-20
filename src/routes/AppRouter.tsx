import MainLayout from "@layouts/MainLayout/MainLayout";
import Home from "@pages/Home/Home";
import Profile from "@pages/Profile/Profile";
import PropertyList from "@pages/PropertyList/PropertyList";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/hook";
import { useEffect } from "react";
import ActCheckAuth from "@store/Auth/Act/ActCheckAuth";
import PropertyDetails from "@pages/PropertyDetails/PropertyDetails";
import LoadingScreen from "@components/common/LoaderScreen/LoadingScreen";
import ErrorScreen from "@components/common/ErrorScreen/ErrorScreen";
import OwnerDashboard from "@pages/OwnerDashboard/OwnerDashboard";
import DashboardOverview from "@components/owner/DashboardOverview";
import ManageProperties from "@components/owner/ManageProperties";
import AddPropertyForm from "@components/owner/AddPropertyForm";
import EditProperty from "@components/owner/EditProperty";
import AboutUs from "@components/AboutUs/AboutUs";
import ContactUs from "@components/ContactUs/ContactUs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ResetPassword,ForgotPassword, OAuthCallback, Login, Register, } from "@pages/index";
import Logout from "@pages/Logout/Logout";
import Chatbot from "@components/Chatbot/Chatbot";
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
        element:<ForgotPassword />
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
        path: "profile",
        element: <Profile />,
      },
      {
        path: "profile/:section",
        element: <Profile />,
      },
    //  {
    //   path: "profiles",
    //   element: <UserLayout />,
    //   children: [
    //     {
    //       path: 'basicInfo',
    //       element: <BasicInfo />,
    //     },
    //     {
    //       path: 'changeEmail',
    //       element: <ChangeEmail />,
    //     },
    //     {
    //       path: 'changePassword',
    //       element: <ChangePassword />,
    //     },
    //     {
    //       path: 'changePhone',
    //       element: <ChangePhone />,
    //     }
    //   ],
    // },
       {
        path: "logout",
        element: <Logout />,
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
    },
    {
      path: "/about",
      element: <AboutUs />,
    },
    {
      path: "/contact",
      element: <ContactUs />,
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
     <div className="fixed bottom-4 right-4">
        <Chatbot />
      </div>
  </>
  ) 
}

export default AppRouter;
