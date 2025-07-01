import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Contracts from "./pages/Contracts";
import Upload from "./pages/Upload";
import Analytics from "./pages/Analytics";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/contracts", element: <Contracts /> },
      { path: "/upload", element: <Upload /> },
      { path: "/analytics", element: <Analytics /> },
    ],
  },
]);
