import { api } from "../../Config/apiConfig";

// Razorpay Checkout Popup
export const openRazorpayCheckout =
  ({ orderId, user, address }) =>
  async (dispatch) => {
    try {
      const { data } = await api.post(`/api/payments/razorpay-order/${orderId}`);
      const { key, razorpayOrderId, amount, currency } = data;

      // Load Razorpay script if missing
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://checkout.razorpay.com/v1/checkout.js";
          s.onload = resolve;
          s.onerror = reject;
          document.body.appendChild(s);
        });
      }

      return new Promise((resolve, reject) => {
        const options = {
          key,
          amount,
          currency,
          name: "HKL & Sons",
          description: `Order #${orderId}`,
          order_id: razorpayOrderId,

          prefill: {
            name: `${address?.firstName} ${address?.lastName}`.trim(),
            email: user?.email,
            contact: address?.mobile
          },

          handler: function (resp) {
            // Browser → redirect to success page
            const qs = new URLSearchParams({
              payment_id: resp.razorpay_payment_id,
              order_id: String(orderId),
            });

            window.location.href = `/payment/${orderId}?${qs.toString()}`;

            resolve({ success: true, orderId });
          },

          modal: {
            ondismiss: function () {
              resolve({ success: false }); // Payment cancelled
            }
          },

          theme: { color: "#047857" },
        };

        new window.Razorpay(options).open();
      });
    } catch (err) {
      console.error("Razorpay Checkout error:", err);
      alert("Unable to start payment. Please try again.");
      return { success: false };
    }
  };


// COD Payment — directly place order
export const placeOrderCOD = (address) => async (dispatch) => {
  try {
    const { data } = await api.post("/api/orders/cod", address);
    return data;
  } catch (error) {
    console.error("COD order error:", error);
    alert("Unable to place COD order.");
    return null;
  }
};

// Verify payment with backend
export const updatePayment = ({ paymentId, orderId }) => async (dispatch) => {
  try {
    const { data } = await api.get(
      `/api/payments?payment_id=${paymentId}&order_id=${orderId}`
    );

    console.log("✅ Payment Verified:", data);
    return data;
  } catch (error) {
    console.error("❌ Payment verification failed:", error);
    alert("Payment verification failed.");
    return null;
  }
};
