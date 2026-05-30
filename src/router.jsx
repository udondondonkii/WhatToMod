import { createBrowserRouter, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Dashboard from "./components/Dashboard";
import ModuleTree from "./components/ModuleTree";

export const router = createBrowserRouter([
    {path: "/", element: <Navigate to="/signin" replace />},
    {path: "/signup", element: <Signup />},
    {path: "/signin", element: <Signin />},
    {path: "/dashboard", element: <Dashboard />},
    {path: "/moduleTree", element: <ModuleTree />}
]);