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
import { ResetPassword, ForgotPassword, OAuthCallback, Login, Register, VerifyEmail, PaymentForm, VerifyPhone, UploadId } from "@pages/index";
import Logout from "@pages/Logout/Logout";
import Chatbot from "@components/Chatbot/Chatbot";
import ProtectedRoute from "@components/common/ProtectedRoute/ProtectedRoute";
// import CheckoutWrapper from "@components/Checkout/CheckoutWrapper";

// ADD ADMIN IMPORTS
import { AdminLayout } from "@components/admin/AdminLayout";
import { DashboardPage } from "@pages/admin/DashboardPage";
import { AdminProfilePage } from "@pages/admin/AdminProfilePage";
import { UsersPage } from "@pages/admin/UsersPage";
import { PropertiesPage } from "@pages/admin/PropertiesPage";
import { PropertyDetailPage } from "@components/admin/properties/PropertyDetailPage";
import PaymentCallback from "@pages/PaymentCallback/PaymentCallback";
import TermsAndConditions from "@components/TermsAndConditions/TermsAndCondition";
import PrivacyPolicy from "@components/PrivacyPolicy/PrivacyPolicy";
import { CsAgentsPage } from "@pages/admin/CsAgentsPage";
import { CsAgentDetailsPage } from "@pages/admin/CsAgentDetailsPage";
import { AssignmentsPage } from "@pages/admin/AssignmentsPage";
// ADD CS AGENT IMPORTS
import { CsAgentLayout } from "@components/cs-agent/CsAgentLayout";
import { CsAgentProfilePage } from "@pages/cs-agent/CsAgentProfilePage";
import { PropertyTaskQueuePage } from "@pages/cs-agent/PropertyTaskQueuePage";
import { PropertyVerificationPage } from "@pages/cs-agent/PropertyVerificationPage";
import { CsAgentDashboardPage } from "@pages/cs-agent/CsAgentDashboardPage";
import { AgentAssignmentModal } from "@components/admin/modals/AgentAssignmentModal";


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
        path:"verify-email",
        element:<VerifyEmail />
      },
      {
        path:"verify-phone",
        element:<VerifyPhone />
      },
      {
        path:"/upload-id",
        element:<UploadId />
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
        path:"payment/success",
        element:<PaymentCallback />
      },
      {
        path: "payment/failed",
        element:<PaymentCallback />
      },
      {
        path:"payment",
        element:<PaymentForm />
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
      },
      {
        path: "property/:id/edit",
        element: (
          <ProtectedRoute allowedRoles={["user", "owner", "admin"]}>
            <EditProperty />
          </ProtectedRoute>
        ),
      },
      {
        path: "about",
        element: <AboutUs />,
      },
      {
        path: "/contact",
        element: <ContactUs />,
      },
       {
        path: "/terms-and-conditions",
        element: <TermsAndConditions />
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />
      },
    ],
  },
  // ADMIN ROUTES AS SEPARATE ROUTE GROUP WITH PROTECTION
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
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
        element: <UsersPage />,
      },
      {
        path: "properties",
        element: <PropertiesPage />,
      },
      {
        path: "properties/:id",
        element: <PropertyDetailPage />,
      },
      {
        path: "transactions",
        element: (
          <div className="p-6 text-center">Transactions Page (Coming Soon)</div>
        ),
      },
      {
        path: "analytics",
               element: <AgentAssignmentModal />

      },
      {
        path: "settings",
        element: <AgentAssignmentModal />
      },
     

      {
        path: "profile",
        element: <AdminProfilePage />,
      },
      {
        path: "cs-agents",
        element: <CsAgentsPage />,
      },
      {
        path: "cs-agents/:agentId",
        element: <CsAgentDetailsPage />,
      },
      {
        path: "assignments",
        element: <AgentAssignmentModal />,
      },
    ],
  },
  // CS AGENT ROUTES AS SEPARATE ROUTE GROUP WITH PROTECTION
  {
    path: "/cs-agent",
    element: (
      <ProtectedRoute allowedRoles={["agent"]}>
        <CsAgentLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        element: <CsAgentDashboardPage />,
      },
      {
        path: "dashboard",
        element: <CsAgentDashboardPage />,
      },
      {
        path: "properties",
        element: <PropertyTaskQueuePage />,
      },
      {
        path: "properties/:id",
        element: <PropertyVerificationPage />,
      },
      {
        path: "properties/:id/verify",
        element: <PropertyVerificationPage />,
      },
      {
        path: "verifications",
        element: (
          <div className="p-6 text-center">
            Verification History (Coming Soon)
          </div>
        ),
      },
      {
        path: "performance",
        element: (
          <div className="p-6 text-center">
            Performance Analytics (Coming Soon)
          </div>
        ),
      },
      {
        path: "profile",
        element: <CsAgentProfilePage />,
      },
      
    ],
  },
  // {
  //       path: "checkout",
  //       element: <CheckoutWrapper />,
  // }
]);

function AppRouter() {
  const dispatch = useAppDispatch();
  const { isInitialized, loading,user } = useAppSelector((state) => state.Authslice);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      dispatch(ActCheckAuth());
    }
  }, [dispatch]);


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
