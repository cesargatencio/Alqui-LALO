// client/src/components/PaypalButton/PaypalButton.jsx
import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import "./PaypalButton.css";

const PaypalButton = ({ monto = "10.00", onPagoExitoso }) => {
  return (
    <div className="paypal-button-container">
      <PayPalButtons
        style={{ layout: "vertical", color: "blue", shape: "pill", label: "pay" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: monto,
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            alert(`Pago completado por ${details.payer.name.given_name}`
              
            );
            if (onPagoExitoso) {
              onPagoExitoso(details);
            }
          });
        }}
        onCancel={() => alert("Pago cancelado")}
        onError={(err) => {
          console.error("Error en el pago:", err);
          alert("Error en el pago");
        }}
      />
    </div>
  );
};

export default PaypalButton;
