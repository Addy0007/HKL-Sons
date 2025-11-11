import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { createPendingOrder } from "../../../State/Order/Action";
import { openRazorpayCheckout, placeOrderCOD } from "../../../State/Payment/Action"; // NEW

const OrderSummary = ({ address, onEdit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, auth } = useSelector((state) => state);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY"); // "RAZORPAY" | "COD"

  const selectedItems = cart.cartItems?.filter((item) => item.selected !== false) || [];

  useEffect(() => {
    if (selectedItems.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [selectedItems, navigate]);

  const subtotal = selectedItems.reduce((sum, item) => sum + item.discountedPrice, 0);
  const shipping = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    if (selectedItems.length === 0) {
      alert("No selected items to checkout.");
      return navigate("/cart");
    }

    setProcessing(true);
    try {
      if (paymentMethod === "COD") {
        // 1) Place COD order directly (no Razorpay)
        const codOrder = await dispatch(placeOrderCOD(address));
        if (codOrder?.id) {
          navigate(`/account/order/${codOrder.id}`);
        } else {
          alert("Failed to place COD order. Try again.");
        }
        return;
      }

      // 2) Razorpay flow: create pending order -> open popup
      const newOrder = await dispatch(createPendingOrder(address));
      if (!newOrder?.id) {
        alert("Unable to create order. Please try again.");
        return;
      }

      await dispatch(
        openRazorpayCheckout({
          orderId: newOrder.id,
          user: auth?.user,
          address,
          onSuccess: () => {},  // optional hook
          onFailure: () => {},  // optional hook
        })
      );
      // After popup success, your PaymentSuccess page handles verification + redirect.

    } catch (e) {
      console.error("Checkout error:", e);
      alert("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (selectedItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-800 mb-6">Order Summary</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Address + Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-emerald-800">Delivery Address</h2>
                <button onClick={onEdit} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  Edit
                </button>
              </div>
              <div className="text-gray-700 space-y-1">
                <p className="font-semibold">{address.firstName} {address.lastName}</p>
                <p>{address.streetAddress}</p>
                <p>{address.city}, {address.district}</p>
                <p>{address.state} - {address.zipCode}</p>
                <p className="pt-2"><span className="font-medium">Phone:</span> {address.mobile}</p>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-emerald-800">
                  Order Items ({selectedItems.length})
                </h2>
                <button
                  onClick={() => navigate("/cart")}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700 underline"
                >
                  Modify Selection
                </button>
              </div>

              <div className="space-y-4">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={item.product?.imageUrl} alt={item.product?.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product?.title}</h3>
                      <p className="text-sm text-gray-500">{item.product?.brand}</p>
                      {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{item.discountedPrice}</p>
                      <p className="text-sm text-gray-500 line-through">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Summary + Payment method */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-emerald-800 mb-4">Price Details</h2>

              <div className="space-y-3 text-gray-700 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
                <div className="flex justify-between"><span>Tax (18% GST)</span><span>₹{tax.toFixed(2)}</span></div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Payment Method</h3>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-emerald-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="RAZORPAY"
                    checked={paymentMethod === "RAZORPAY"}
                    onChange={() => setPaymentMethod("RAZORPAY")}
                  />
                  <div>
                    <div className="font-medium text-gray-900">Pay Online (UPI / Wallets / Cards / NetBanking)</div>
                    <div className="text-xs text-gray-500">GPay / PhonePe / Paytm on mobile; UPI ID & QR on desktop</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-emerald-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                  />
                  <div>
                    <div className="font-medium text-gray-900">Cash on Delivery (COD)</div>
                    <div className="text-xs text-gray-500">Pay with cash at the time of delivery</div>
                  </div>
                </label>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full mt-6 bg-emerald-700 text-white py-3 rounded-lg font-semibold hover:bg-emerald-800 transition disabled:bg-gray-400"
              >
                {processing ? "Processing..." : "Place Order"}
              </button>

              <p className="text-center text-xs text-gray-500 mt-3">🔒 Secure Checkout</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
