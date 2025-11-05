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
      element: (
        <MainLayout>
          <AdminScreen />
        </MainLayout>
      ),
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
