import { useState } from "react";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import About from "./screens/About/About";
import Contact from "./screens/Contact/Contact";
import Home from "./screens/Home/Home";
import Products from "./screens/Products/Products";
import AppLayout from "./screens/AppLayout";
import ProductDetail from "./screens/Products/ProductDetail";
import Login from "./screens/Login/Login";
import Register from "./screens/Register/Register";
import EditProfile from "./screens/EditProfile/EditProfile";

function App() {
  const [count, setCount] = useState(0);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/edit_profile",
          element: <EditProfile />,
        },
        {
          path: "/product/:id",
          element: <ProductDetail />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
