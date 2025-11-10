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
import AccountDetail from "./screens/AccountDetail";
import DashboardScreen from "./admin/screens/DashboardScreen";
import ManageTourScreen from "./admin/screens/ManageTour/ManageTourScreen"; 
import FormTourScreen from "./admin/screens/ManageTour/FormTourScreen";
import TourDetailScreen from "./screens/TourDetailScreen";
import TourDetailAdminScreen from "./admin/screens/ManageTour/TourDetailAdminScreen"
import ManageDestinationScreen from "./admin/screens/ManageDestination/ManageDestinationScreen";
import FormDestinationScreen from "./admin/screens/ManageDestination/FormDestinationScreen";
import DestinationDeatilScreen from "./admin/screens/ManageDestination/DestinationDetailAdminScreen";


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
        { path: "manage-destination", element: <ManageDestinationScreen />},
        { path: "destinations/:id/edit", element: <FormDestinationScreen />},
        { path: "destinations/new", element: <FormDestinationScreen />},
        { path: "destinations/detail/:id", element: <DestinationDeatilScreen />},

      ],
    },
    {
      path: "/me",
      index: true,
      element: (
        <MainLayout>
          <AccountDetail />
        </MainLayout>
      ),
    },
  ]);

  return rootElements;
}
