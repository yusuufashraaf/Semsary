import UserAccount from "@components/Profile/UserAccount";
import UserNotifications from "@components/Profile/UserNotifications";
import UserPurchases from "@components/Profile/UserPurchases";
import UserReviews from "@components/Profile/UserReviews";
import MainLayout from "@layouts/MainLayout/MainLayout";
import Error from "@pages/Error/Error";
import Home from "@pages/Home/Home";
import Login from "@pages/Login/Login";
import Profile from "@pages/Profile/Profile";
import Register from "@pages/Register/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
    ],
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
