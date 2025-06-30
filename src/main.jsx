import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import App from "./App";
import "./index.css";

const initialOptions = {
  "client-id": "AQF3IeppNSHQi6dSRHPnammJTwjxkGGoSia_zs0zRm58zxwBxyOCeu5-ey9aX-CpZZ__Gn8Vn7FNW39j", // Tu Sandbox Client ID
  currency: "USD",
  intent: "capture",
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PayPalScriptProvider options={initialOptions}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PayPalScriptProvider>
  </React.StrictMode>
);
