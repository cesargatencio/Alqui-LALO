// client/src/components/PaypalButton/PaypalButton.jsx
import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import "./PaypalButton.css";

const PaypalButton = ({ monto = "10.00", onPagoExitoso }) => {
  const [errorPago, setErrorPago] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

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
            setMensajeExito(`Pago completado por ${details.payer.name.given_name}`);
            if (onPagoExitoso) {
              onPagoExitoso(details);
            }
          });
        }}
        onCancel={() => {
          // Puedes dejar esto vacío o mostrar un mensaje en pantalla si lo deseas
        }}
        onError={(err) => {
          console.error("Error en el pago:", err);
          setErrorPago(true); // Mostrar el modal de error
        }}
      />
      {mensajeExito && (
        <div className="mensaje-exito" style={{ marginTop: "1rem" }}>
          {mensajeExito}
        </div>
      )}
      {errorPago && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Error en el pago</h3>
            <p>Ocurrió un problema al procesar tu pago. Intenta nuevamente.</p>
            <button className="btn-guardar" onClick={() => setErrorPago(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaypalButton;
