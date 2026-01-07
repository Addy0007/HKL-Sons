// src/customer/components/Payment/PaymentSuccess.jsx

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updatePayment } from "../../../State/Payment/Action";

const PaymentSuccess = () => {
  const [paymentId, setPaymentId] = useState(null);
  const [processing, setProcessing] = useState(true);

  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Extract Razorpay params and detect errors
  useEffect(() => {
    const url = new URLSearchParams(window.location.search);

    const errorCode = url.get("error[code]");
    const errorDescription = url.get("error[description]");

    // ❌ Payment failed (Razorpay error)
    if (errorCode) {
      navigate(`/payment-failed/${orderId}`, {
        replace: true,
        state: { errorCode, errorDescription },
      });
      return;
    }

    // ✅ Success: get payment id
    const id =
      url.get("razorpay_payment_id") || // Razorpay default
      url.get("payment_id") ||          // custom
      url.get("paymentId");             // fallback

    if (!id) {
      // ❌ No payment ID → go back to order page
      navigate(`/account/order/${orderId}`, { replace: true });
      return;
    }

    setPaymentId(id);
  }, [orderId, navigate]);

  // ✅ Verify payment on backend
  useEffect(() => {
    if (!paymentId) return;

    const verify = async () => {
      try {
        await dispatch(updatePayment({ paymentId, orderId }));
        // Backend should:
        // - verify signature
        // - update order as PAID
      } catch (e) {
        console.error("Payment verification error:", e);
        // Optional: navigate to payment-failed page instead
        // navigate(`/payment-failed/${orderId}`, { replace: true });
      } finally {
        setProcessing(false);
        // ✅ In both success/failure of verify, go to order details
        navigate(`/account/order/${orderId}`, { replace: true });
      }
    };

    verify();
  }, [paymentId, orderId, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-emerald-700 mb-4">
          {processing ? "Processing Payment..." : "Redirecting..."}
        </h1>

        <p className="text-gray-600 mb-6">
          {processing
            ? "Please wait while we confirm your payment."
            : "Payment verified. Redirecting to your order..."}
        </p>

        {processing && (
          <div className="animate-spin h-10 w-10 border-4 border-emerald-700 border-t-transparent rounded-full mx-auto" />
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
