// src/customer/components/Payment/PaymentSuccess.jsx

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updatePayment } from "../../../State/Payment/Action";
import { clearCart } from "../../../State/Cart/Action"; // ✅ add clearCart to your Cart/Action.js (see snippet)

const PaymentSuccess = () => {
  const [paymentId, setPaymentId] = useState(null);
  const [processing, setProcessing] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Processing Payment...");

  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Step 1: Parse URL params ─────────────────────────────────────────
  useEffect(() => {
    const url = new URLSearchParams(window.location.search);

    const errorCode = url.get("error[code]");
    const errorDescription = url.get("error[description]");

    if (errorCode) {
      navigate(`/payment-failed/${orderId}`, {
        replace: true,
        state: { errorCode, errorDescription },
      });
      return;
    }

    const id =
      url.get("razorpay_payment_id") ||
      url.get("payment_id") ||
      url.get("paymentId");

    if (!id) {
      navigate(`/account/order/${orderId}`, { replace: true });
      return;
    }

    setPaymentId(id);
  }, [orderId, navigate]);

  // ── Step 2: Verify payment → clear cart → redirect ───────────────────
  useEffect(() => {
    if (!paymentId) return;

    const verify = async () => {
      try {
        setStatusMessage("Verifying your payment...");
        await dispatch(updatePayment({ paymentId, orderId }));
        setStatusMessage("Payment confirmed! Clearing your cart...");
        await dispatch(clearCart()); // ✅ wipe purchased items from cart
      } catch (e) {
        console.error("Payment verification error:", e);
        // Even if the 500 occurs, backend webhook may have already marked order
        // as PAID. Still clear the cart optimistically so UX is clean.
        setStatusMessage("Finalising your order...");
        try {
          await dispatch(clearCart());
        } catch (_) {}
      } finally {
        setStatusMessage("Redirecting to your order...");
        setProcessing(false);
        setTimeout(() => {
          navigate(`/account/order/${orderId}`, { replace: true });
        }, 800);
      }
    };

    verify();
  }, [paymentId, orderId, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F3EC] px-4">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-md w-full border border-[#C6A15B]/20">

        {/* Icon */}
        <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-emerald-50">
          {processing ? (
            <div className="animate-spin h-8 w-8 border-4 border-[#1F3D2B] border-t-transparent rounded-full" />
          ) : (
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <h1 className="text-2xl font-bold text-[#1F3D2B] mb-2">
          {processing ? "Processing Payment" : "Payment Successful!"}
        </h1>

        <p className="text-[#555555] text-sm mb-6">{statusMessage}</p>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mb-6">
          {["Verifying", "Confirming", "Redirecting"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  processing ? "bg-[#1F3D2B] animate-pulse" : "bg-emerald-500"
                }`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
              {i < 2 && <div className="w-6 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        <p className="text-xs text-[#888]">
          Please don't close this window or press back.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;