import UserAccount from "@components/Profile/UserAccount";
import UserNotifications from "@components/Profile/UserNotifications";
import UserPurchases from "@components/Profile/UserPurchases";
import UserReviews from "@components/Profile/UserReviews";
import MainLayout from "@layouts/MainLayout/MainLayout";
import Error from "@pages/Error/Error";
import Home from "@pages/Home/Home";
import Login from "@pages/Login/Login";
import Profile from "@pages/Profile/Profile";
import PropertyList from "@pages/PropertyList/PropertyList";
import Register from "@pages/Register/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { properties } from "@components/PropertyList/PropertyData.js";
import { useAppDispatch, useAppSelector } from "@store/hook";
import { useEffect } from "react";
import ActCheckAuth from "@store/Auth/Act/ActCheckAuth";
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
      {
        path: "property",
        element: <PropertyList listings={properties} />,
      },
    ],
  },
]);

function AppRouter() {
    const dispatch =useAppDispatch();
    const isInitialized= useAppSelector(state=>state.Authslice.isInitialized)

    useEffect(()=>{
        dispatch(ActCheckAuth());
    },[dispatch])


    if (!isInitialized) {
        return (
          <h3>Please wait...</h3>
        );
    }
  return <RouterProvider router={router} />;
}

export default AppRouter;
