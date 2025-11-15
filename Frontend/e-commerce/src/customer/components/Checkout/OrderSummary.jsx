import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { createPendingOrder } from "../../../State/Order/Action";
import { openRazorpayCheckout, placeOrderCOD } from "../../../State/Payment/Action";

const OrderSummary = ({ address, onEdit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, auth } = useSelector((state) => state);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY"); // "RAZORPAY" | "COD"

  // Items user selected for checkout (filter out any selected=false)
  const selectedItems = cart?.cartItems?.filter((item) => item.selected !== false) ?? [];

  useEffect(() => {
    if (!selectedItems || selectedItems.length === 0) {
      // no items -> go back to cart
      navigate("/cart", { replace: true });
    }
  }, [selectedItems, navigate]);

  // price calcs
  const subtotal = selectedItems.reduce((sum, item) => sum + (Number(item.discountedPrice) || 0), 0);
  const shipping = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    if (!selectedItems || selectedItems.length === 0) {
      alert("No selected items to checkout.");
      return navigate("/cart");
    }

    if (!address || !address.firstName) {
      alert("Please provide a delivery address.");
      return;
    }

    if (processing) return; // guard double-clicks
    setProcessing(true);

    try {
      if (paymentMethod === "COD") {
        // COD: place order directly (server should save order and mark payment status COD/PENDING)
        console.debug("Placing COD order...");
        const result = await dispatch(placeOrderCOD(address)); // should return order object
        // Expectation: placeOrderCOD returns created order (with id)
        if (result && result.id) {
          navigate(`/account/order/${result.id}`);
        } else {
          console.error("placeOrderCOD returned invalid result:", result);
          alert("Failed to place COD order. Try again.");
        }
        return;
      }

      // RAZORPAY flow:
      // 1) create a pending order on server (status PENDING). Backend returns the order (id).
      console.debug("Creating pending order...");
      const pendingOrder = await dispatch(createPendingOrder(address));
      if (!pendingOrder || !pendingOrder.id) {
        console.error("createPendingOrder failed or returned no id:", pendingOrder);
        alert("Unable to create order. Please try again.");
        return;
      }

      console.debug("Pending order created, id=", pendingOrder.id);

      // 2) open Razorpay checkout popup. This action should handle popup and server-side verification.
      //    It should resolve to something like { success: true, orderId: <id> } after server verifies payment.
      const paymentResult = await dispatch(openRazorpayCheckout({
        orderId: pendingOrder.id,
        user: auth?.user,
        address,
      }));

      // openRazorpayCheckout MUST return a result that tells us if payment succeeded
      if (paymentResult && paymentResult.success) {
        // success -> navigate to order detail page (backend should have finalized the order)
        // Many systems use returned orderId or paymentResult.orderId
        const finalOrderId = paymentResult.orderId || pendingOrder.id;
        navigate(`/account/order/${finalOrderId}`);
      } else {
        console.warn("Payment not completed or cancelled:", paymentResult);
        alert("Payment was not completed. You can retry from Orders page.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (!selectedItems || selectedItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-800 mb-6">Order Summary</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-emerald-800">Delivery Address</h2>
                <button onClick={onEdit} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  Edit
                </button>
              </div>
              <div className="text-gray-700 space-y-1">
                <p className="font-semibold">{address.firstName} {address.lastName}</p>
                <p style={{whiteSpace: "pre-line"}}>{address.streetAddress}</p>
                <p>{address.city}, {address.district}</p>
                <p>{address.state} - {address.zipCode}</p>
                <p className="pt-2"><span className="font-medium">Phone:</span> {address.mobile}</p>
              </div>
            </div>

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
