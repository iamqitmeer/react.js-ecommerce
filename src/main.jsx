import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import IsUserAvailableProvider from "./context/IsUserHe.jsx";
import IsUserDataAvailableProvider from "./context/UserDetails.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NextUIProvider>
      <IsUserAvailableProvider>
      <IsUserDataAvailableProvider>

        <App />
       
      </IsUserDataAvailableProvider>
      </IsUserAvailableProvider>
    </NextUIProvider>
  </StrictMode>
);
