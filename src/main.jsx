import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import IsUserAvailableProvider from "./context/IsUserHe.jsx";
import IsUserDataAvailableProvider from "./context/UserDetails.jsx";
import CartContextProvider from "./context/CartContext.jsx";
import FavouriteContextProvider from "./context/FavouriteContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NextUIProvider>
      <CartContextProvider>
        <FavouriteContextProvider>
          <IsUserAvailableProvider>
            <IsUserDataAvailableProvider>
              <App />
            </IsUserDataAvailableProvider>
          </IsUserAvailableProvider>
        </FavouriteContextProvider>
      </CartContextProvider>
    </NextUIProvider>
  </StrictMode>
);
