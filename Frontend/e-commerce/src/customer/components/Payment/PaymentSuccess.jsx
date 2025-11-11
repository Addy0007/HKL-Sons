import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { updatePayment } from '../../../State/Payment/Action';

const PaymentSuccess = () => {
  const [paymentId, setPaymentId] = useState(null);
  const [verifying, setVerifying] = useState(true);

  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Extract Razorpay payment info from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const razorpayPaymentId =
      urlParams.get("razorpay_payment_id") ||
      urlParams.get("payment_id") ||
      urlParams.get("razorpay_payment_link_id");

    if (razorpayPaymentId) {
      setPaymentId(razorpayPaymentId);
    } else {
      // ❌ No payment id → redirect to order page
      navigate(`/account/order/${orderId}`);
    }
  }, [orderId, navigate]);

  // ✅ Verify payment on backend
  useEffect(() => {
    if (paymentId) {
      dispatch(updatePayment({ paymentId, orderId }))
        .then(() => {
          setVerifying(false);
          // ✅ After verifying, go to order details
          navigate(`/account/order/${orderId}`);
        });
    }
  }, [paymentId, orderId, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-emerald-700 mb-4">Processing Payment...</h1>

        <p className="text-gray-600 mb-6">
          Please wait while we confirm your payment.
        </p>

        <div className="animate-spin h-10 w-10 border-4 border-emerald-700 border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
