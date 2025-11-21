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

  // ✅ Extract Razorpay payment_id from URL
  useEffect(() => {
    const url = new URLSearchParams(window.location.search);

    const id =
      url.get("razorpay_payment_id") || // Razorpay default
      url.get("payment_id") ||          // Your backend callback param
      url.get("paymentId");             // fallback

    if (!id) {
      // ❌ No payment ID → redirect back to order page
      navigate(`/account/order/${orderId}`, { replace: true });
      return;
    }

    setPaymentId(id);
  }, [orderId, navigate]);

  // ✅ Call backend to verify the payment
  useEffect(() => {
    if (!paymentId) return;

    const verify = async () => {
      try {
        const result = await dispatch(
          updatePayment({ paymentId, orderId })
        );

        console.log("Payment verification result:", result);
      } catch (e) {
        console.error("Verification error:", e);
      } finally {
        setProcessing(false);
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
          <div className="animate-spin h-10 w-10 border-4 border-emerald-700 border-t-transparent rounded-full mx-auto"></div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
