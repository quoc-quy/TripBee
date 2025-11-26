import { useRoutes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import TourScreen from "./screens/TourScreen";
import DestinationScreen from "./screens/DestinationScreen";
import AboutScreen from "./screens/AboutScreen";
import ContactScreen from "./screens/ContactScreen";
import AdminScreen from "./screens/AdminScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import FormTourScreen from "./admin/screens/ManageTour/FormTourScreen";
import TourDetailAdminScreen from "./admin/screens/ManageTour/TourDetailAdminScreen";
import ManageDestinationScreen from "./admin/screens/ManageDestination/ManageDestinationScreen";
import FormDestinationScreen from "./admin/screens/ManageDestination/FormDestinationScreen";
import DestinationDeatilScreen from "./admin/screens/ManageDestination/DestinationDetailAdminScreen";
import TourDetailScreen from "./screens/TourDetailScreen";
import DashboardScreen from "./admin/screens/DashboardScreen";
import ManageTourScreen from "./admin/screens/ManageTour/ManageTourScreen";
import AccountLayout from "./screens/Account/layouts/AccountLayout";
import Profile from "./screens/Account/pages/Profile";
import ChangePassword from "./screens/Account/pages/ChangePassword";
import HistoryTour from "./screens/Account/pages/HistoryTour";
import FavouriteTour from "./screens/Account/pages/FavouriteTour";
import ManagePromotionScreen from "./admin/screens/PromotionScreen/ManagePromotionScreen";
import FormPromotionScreen from "./admin/screens/PromotionScreen/FormPromotionScreen";
import UserAdminScreen from "./admin/screens/ManageUserScreen/ManageUserScreen";
// import UserDetailScreen from "./admin/screens/ManageUserScreen/UserDetailAdminScreen";
// import UserEditScreen from "./admin/screens/ManageUserScreen/UserEditAdminScreen";
import PaymentScreen from "./screens/PaymentScreen/PaymentScreen";
import ContactMessageScreen from "./admin/screens/ContactMessageScreen/ContactMessageScreen";
import ManageReviewScreen from "./admin/screens/ReviewScreen/ManageReviewScreen";

export default function useRouteElements() {
  const rootElements = useRoutes([
    {
      path: "/",
      index: true,
      element: (
        <MainLayout>
          <HomeScreen />
        </MainLayout>
      ),
    },
    {
      path: "/login",
      element: (
        <MainLayout>
          <LoginScreen />
        </MainLayout>
      ),
    },
    {
      path: "/register",
      element: (
        <MainLayout>
          <RegisterScreen />
        </MainLayout>
      ),
    },
    {
      path: "/tours",
      element: (
        <MainLayout>
          <TourScreen />
        </MainLayout>
      ),
    },
    {
      path: "/tours",
      element: (
        <MainLayout>
          <TourScreen />
        </MainLayout>
      ),
    },
    {
      path: "/tours/:id",
      element: (
        <MainLayout>
          <TourDetailScreen />
        </MainLayout>
      ),
    },
    {
      path: "/payment/:id",
      element: (
        <MainLayout>
          <PaymentScreen />
        </MainLayout>
      ),
    },
    {
      path: "/destinations",
      element: (
        <MainLayout>
          <DestinationScreen />
        </MainLayout>
      ),
    },
    {
      path: "/about",
      element: (
        <MainLayout>
          <AboutScreen />
        </MainLayout>
      ),
    },
    {
      path: "/contact",
      element: (
        <MainLayout>
          <ContactScreen />
        </MainLayout>
      ),
    },
    {
      path: "/admin",
      element: <AdminScreen />,
      children: [
        { path: "dashboard", element: <DashboardScreen /> },
        { path: "manage-tour", element: <ManageTourScreen /> },
        { path: "tours/new", element: <FormTourScreen /> },
        { path: "tours/:id/edit", element: <FormTourScreen /> },
        { path: "tours/details/:id", element: <TourDetailAdminScreen /> },
        { path: "manage-destination", element: <ManageDestinationScreen /> },
        { path: "destinations/:id/edit", element: <FormDestinationScreen /> },
        { path: "destinations/new", element: <FormDestinationScreen /> },
        {
          path: "destinations/detail/:id",
          element: <DestinationDeatilScreen />,
        },
        { path: "promotions", element: <ManagePromotionScreen /> },
        { path: "users", element: <UserAdminScreen /> },
        // { path: "users/:id", element: <UserDetailScreen /> },
        // { path: "users/:id/edit", element: <UserEditScreen /> },
        { path: "contact-messages", element: <ContactMessageScreen /> },
        {
          path: "/admin/reviews",
          element: <ManageReviewScreen />,
        },
      ],
    },
    // {
    //   path: "/account",
    //   element: (
    //     <MainLayout>
    //       <AccountDetail />
    //     </MainLayout>
    //   ),
    // },
    {
      path: "/account",
      element: (
        <MainLayout>
          <AccountLayout />
        </MainLayout>
      ),
      children: [
        {
          path: "/account/profile",
          element: <Profile />,
        },
        {
          path: "/account/password",
          element: <ChangePassword />,
        },
        {
          path: "/account/historyTour",
          element: <HistoryTour />,
        },
        {
          path: "/account/favouriteTour",
          element: <FavouriteTour />,
        },
      ],
    },
  ]);

  return rootElements;
}
