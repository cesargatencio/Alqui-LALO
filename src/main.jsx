import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "./index.css";

const initialOptions = {
  "client-id": "AQF3IeppNSHQi6dSRHPnammJTwjxkGGoSia_zs0zRm58zxwBxyOCeu5-ey9aX-CpZZ__Gn8Vn7FNW39j",
  currency: "USD",
  intent: "capture",
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PayPalScriptProvider options={initialOptions}>
      <App />
    </PayPalScriptProvider>
  </React.StrictMode>
);
