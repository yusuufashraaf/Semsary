import MainLayout from "@layouts/MainLayout/MainLayout";
import Home from "@pages/Home/Home";
import Profile from "@pages/Profile/Profile";
import PropertyList from "@pages/PropertyList/PropertyList";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/hook";
import { useEffect, useRef } from "react";
import ActCheckAuth from "@store/Auth/Act/ActCheckAuth";
import PropertyDetails from "@pages/PropertyDetails/PropertyDetails";
import LoadingScreen from "@components/common/LoaderScreen/LoadingScreen";
import ErrorScreen from "@components/common/ErrorScreen/ErrorScreen";
import EditProperty from "@components/owner/EditProperty";
import AboutUs from "@components/AboutUs/AboutUs";
import ContactUs from "@components/ContactUs/ContactUs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ResetPassword, ForgotPassword, OAuthCallback, Login, Register } from "@pages/index";
import Logout from "@pages/Logout/Logout";
import Chatbot from "@components/Chatbot/Chatbot";
import ProtectedRoute from "@components/common/ProtectedRoute/ProtectedRoute";

// ADD ADMIN IMPORTS
import { AdminLayout } from "@components/admin/AdminLayout";
import { DashboardPage } from "@pages/admin/DashboardPage";
import { AdminProfilePage } from "@pages/admin/AdminProfilePage";
import { UsersPage } from '@pages/admin/UsersPage';

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
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/:section",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
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
        element: (
          <ProtectedRoute>
            <Logout />
          </ProtectedRoute>
        ),
      },
      {
        path: "property",
        element: <PropertyList />, // This should now have navbar
      },
      {
        path: "property/:id",
        element: <PropertyDetails />,
      },      {
        path: "property/:id/edit",
        element: (
            <ProtectedRoute allowedRoles={['user', 'owner', 'admin']}>
            <EditProperty />
          </ProtectedRoute>
        ),
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/contact",
        element: <ContactUs />,
      },
    ],
  },
  // ADMIN ROUTES AS SEPARATE ROUTE GROUP WITH PROTECTION
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "users",
        element: (
          <UsersPage />
        ),
      },
      {
        path: "properties",
        element: (
          <div className="p-6 text-center">Properties Page (Coming Soon)</div>
        ),
      },
      {
        path: "transactions",
        element: (
          <div className="p-6 text-center">Transactions Page (Coming Soon)</div>
        ),
      },
      {
        path: "analytics",
        element: (
          <div className="p-6 text-center">Analytics Page (Coming Soon)</div>
        ),
      },
      {
        path: "settings",
        element: (
          <div className="p-6 text-center">Settings Page (Coming Soon)</div>
        ),
      },
      {
        path: "profile",
        element: <AdminProfilePage />,
      },
    ],
  },
]);

function AppRouter() {
  const dispatch = useAppDispatch();
  const { isInitialized, loading } = useAppSelector((state) => state.Authslice);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      console.log("🚀 AppRouter: Initializing auth check...");
      dispatch(ActCheckAuth());
    }
  }, [dispatch]);

  console.log("🔄 AppRouter render:", { isInitialized, loading });

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
     <div className="fixed bottom-4 right-4">
      <Chatbot />
      </div>
    </>
  );
}

export default AppRouter;
