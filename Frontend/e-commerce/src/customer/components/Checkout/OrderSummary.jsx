import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { createPendingOrder } from "../../../State/Order/Action";
import { openRazorpayCheckout, placeOrderCOD } from "../../../State/Payment/Action";
import { api } from "../../../Config/apiConfig";

const OrderSummary = ({ address, onEdit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, auth } = useSelector((state) => state);
  const [processing, setProcessing] = useState(false);

  // ─── Payment method locked to COD for now (Razorpay coming soon) ───
  const paymentMethod = "COD";
  // const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);

  // Available coupons for this user
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);

  // ✅ FIX #1: Use useMemo to stabilize selectedItems reference
  const selectedItems = useMemo(() => {
    return cart?.cartItems?.filter((item) => item.selected !== false) ?? [];
  }, [cart?.cartItems]);

  // ✅ FIX #2: Calculate subtotal with useMemo
  const subtotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + (Number(item.discountedPrice) || 0), 0);
  }, [selectedItems]);

  useEffect(() => {
    if (!selectedItems || selectedItems.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [selectedItems, navigate]);

  // Check if user is first-time buyer
  useEffect(() => {
    const checkFirstTimeUser = async () => {
      try {
        const response = await api.get("/api/coupons/first-time-check");
        setIsFirstTimeUser(response.data.isFirstTimeUser);
      } catch (error) {
        console.error("Error checking first-time user:", error);
      }
    };

    if (auth.jwt) {
      checkFirstTimeUser();
    }
  }, [auth.jwt]);

  // ✅ FIX #3: Fetch available coupons
  useEffect(() => {
    const fetchAvailableCoupons = async () => {
      try {
        const response = await api.get(`/api/coupons/available?orderAmount=${subtotal}`);
        setAvailableCoupons(response.data || []);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    if (auth.jwt && selectedItems.length > 0) {
      fetchAvailableCoupons();
    }
  }, [auth.jwt, selectedItems.length, subtotal]);

  // Price calculations
  const shipping = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.18;
  const totalBeforeCoupon = subtotal + shipping + tax;
  const total = totalBeforeCoupon - couponDiscount;

  // ✅ FIX #4: Wrap handleApplyCoupon in useCallback
  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setValidatingCoupon(true);
    setCouponError("");

    try {
      const response = await api.post("/api/coupons/validate", {
        couponCode: couponCode.trim(),
        orderAmount: subtotal,
      });

      if (response.data.valid) {
        setAppliedCoupon(response.data);
        setCouponDiscount(response.data.discountAmount);
        setCouponError("");
        setShowCouponInput(false);
      } else {
        setCouponError(response.data.message || "Invalid coupon code");
        setAppliedCoupon(null);
        setCouponDiscount(0);
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError("Failed to apply coupon. Please try again.");
      setAppliedCoupon(null);
      setCouponDiscount(0);
    } finally {
      setValidatingCoupon(false);
    }
  }, [couponCode, subtotal]);

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    setCouponError("");
  };

  const handleSelectCoupon = (coupon) => {
    setCouponCode(coupon.code);
    setShowAvailableCoupons(false);
    setShowCouponInput(true);
    setTimeout(() => handleApplyCoupon(), 100);
  };

  const handlePlaceOrder = async () => {
    if (!selectedItems || selectedItems.length === 0) {
      alert("No selected items to checkout.");
      return navigate("/cart");
    }

    if (!address || !address.firstName) {
      alert("Please provide a delivery address.");
      return;
    }

    if (processing) return;
    setProcessing(true);

    try {
      const orderData = {
        address,
        couponCode: appliedCoupon ? appliedCoupon.couponCode : null,
      };

      // ─── COD only for now ───────────────────────────────────────────
      console.debug("Placing COD order...");
      const result = await dispatch(placeOrderCOD(orderData));
      if (result && result.id) {
        navigate(`/account/order/${result.id}`);
      } else {
        alert("Failed to place order. Try again.");
      }

      // ─── Razorpay flow — uncomment when bank account is ready ───────
      // if (paymentMethod === "COD") {
      //   const result = await dispatch(placeOrderCOD(orderData));
      //   if (result && result.id) {
      //     navigate(`/account/order/${result.id}`);
      //   } else {
      //     alert("Failed to place COD order. Try again.");
      //   }
      //   return;
      // }
      //
      // const pendingOrder = await dispatch(createPendingOrder(orderData));
      // if (!pendingOrder || !pendingOrder.id) {
      //   alert("Unable to create order. Please try again.");
      //   return;
      // }
      //
      // const paymentResult = await dispatch(openRazorpayCheckout({
      //   orderId: pendingOrder.id,
      //   user: auth?.user,
      //   address,
      // }));
      //
      // if (paymentResult && paymentResult.success) {
      //   const finalOrderId = paymentResult.orderId || pendingOrder.id;
      //   navigate(`/account/order/${finalOrderId}`);
      // } else {
      //   alert("Payment was not completed. You can retry from Orders page.");
      // }
      // ───────────────────────────────────────────────────────────────

    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (!selectedItems || selectedItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#F6F3EC] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1F3D2B] mb-6">Order Summary</h1>

        {/* First-time user banner */}
        {isFirstTimeUser && (
          <div className="mb-6 bg-gradient-to-r from-[#1F3D2B] to-[#2d5a3d] text-white rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-[#F6F3EC] rounded-full p-2">
                <svg
                  className="w-6 h-6 text-[#1F3D2B]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">🎉 Welcome! This is your first order!</h3>
                <p className="text-sm text-white/80">
                  Use code{" "}
                  <strong className="bg-[#F6F3EC] text-[#1F3D2B] px-2 py-0.5 rounded font-mono">
                    FIRST20
                  </strong>{" "}
                  to get 20% off!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT PANEL */}
          <div className="lg:col-span-2 space-y-6">

            {/* Address */}
            <div className="bg-[#F6F3EC] rounded-xl shadow border border-[#C6A15B]/20 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#1F3D2B]">Delivery Address</h2>
                <button
                  onClick={onEdit}
                  className="text-[#1F3D2B] hover:text-[#162d1f] text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="text-[#3D3D3D] space-y-1">
                <p className="font-semibold text-[#2C2C2C]">
                  {address.firstName} {address.lastName}
                </p>
                <p style={{ whiteSpace: "pre-line" }}>{address.streetAddress}</p>
                <p>
                  {address.city}, {address.district}
                </p>
                <p>
                  {address.state} - {address.zipCode}
                </p>
                <p className="pt-2">
                  <span className="font-medium text-[#2C2C2C]">Phone:</span> {address.mobile}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-[#F6F3EC] rounded-xl shadow border border-[#C6A15B]/20 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#1F3D2B]">
                  Order Items ({selectedItems.length})
                </h2>
                <button
                  onClick={() => navigate("/cart")}
                  className="text-sm font-medium text-[#1F3D2B] hover:text-[#162d1f] underline"
                >
                  Modify Selection
                </button>
              </div>

              <div className="space-y-4">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-[#C6A15B]/10 last:border-b-0"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#EDE9E0] flex-shrink-0">
                      <img
                        src={item.product?.imageUrl}
                        alt={item.product?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#2C2C2C]">{item.product?.title}</h3>
                      <p className="text-sm text-[#555555]">{item.product?.brand}</p>
                      {item.size && (
                        <p className="text-sm text-[#555555]">Size: {item.size}</p>
                      )}
                      <p className="text-sm text-[#3D3D3D]">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#2C2C2C]">₹{item.discountedPrice}</p>
                      <p className="text-sm text-[#555555] line-through">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-1">
            <div className="bg-[#F6F3EC] rounded-xl shadow border border-[#C6A15B]/20 p-6 sticky top-4 space-y-6">

              {/* Price Details */}
              <div>
                <h2 className="text-xl font-semibold text-[#1F3D2B] mb-4">Price Details</h2>
                <div className="space-y-3 text-[#3D3D3D] text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Coupon Discount ({appliedCoupon.discountPercentage}%)</span>
                      <span>-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-[#C6A15B]/20 pt-3 flex justify-between text-lg font-bold text-[#2C2C2C]">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="text-xs text-green-600 text-center">
                      🎉 You saved ₹{couponDiscount.toFixed(2)} with this coupon!
                    </div>
                  )}
                </div>
              </div>

              {/* Coupon Section */}
              <div className="border-t border-[#C6A15B]/20 pt-4">
                <h3 className="text-sm font-medium text-[#2C2C2C] mb-3">Have a Coupon Code?</h3>

                {!appliedCoupon ? (
                  <>
                    {!showCouponInput ? (
                      <button
                        onClick={() => setShowCouponInput(true)}
                        className="w-full py-2 border-2 border-dashed border-[#1F3D2B]/50 text-[#1F3D2B] rounded-lg font-medium hover:bg-[#1F3D2B]/5 transition"
                      >
                        + Apply Coupon
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Enter code"
                            className="flex-1 px-3 py-2 border border-[#C6A15B]/30 rounded-lg text-sm uppercase bg-[#F6F3EC] text-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
                          />
                          <button
                            onClick={handleApplyCoupon}
                            disabled={validatingCoupon}
                            className="px-4 py-2 bg-[#1F3D2B] text-white rounded-lg text-sm font-medium hover:bg-[#162d1f] disabled:bg-gray-400"
                          >
                            {validatingCoupon ? "..." : "Apply"}
                          </button>
                        </div>

                        {couponError && (
                          <p className="text-xs text-red-600">{couponError}</p>
                        )}

                        <button
                          onClick={() => setShowCouponInput(false)}
                          className="text-xs text-[#555555] hover:text-[#2C2C2C]"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* Available Coupons */}
                    {availableCoupons.length > 0 && (
                      <div className="mt-3">
                        <button
                          onClick={() => setShowAvailableCoupons(!showAvailableCoupons)}
                          className="text-xs text-[#1F3D2B] hover:text-[#162d1f] font-medium flex items-center gap-1"
                        >
                          {showAvailableCoupons ? "Hide" : "View"} Available Coupons (
                          {availableCoupons.length})
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              showAvailableCoupons ? "rotate-180" : ""
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        {showAvailableCoupons && (
                          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                            {availableCoupons.map((coupon) => (
                              <div
                                key={coupon.id}
                                onClick={() => handleSelectCoupon(coupon)}
                                className="p-3 border border-[#1F3D2B]/20 rounded-lg cursor-pointer hover:bg-[#1F3D2B]/5 transition"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-mono text-sm font-bold text-[#1F3D2B]">
                                      {coupon.code}
                                    </p>
                                    <p className="text-xs text-[#3D3D3D]">
                                      {coupon.description}
                                    </p>
                                  </div>
                                  <div className="bg-[#1F3D2B]/10 text-[#1F3D2B] px-2 py-1 rounded text-xs font-bold">
                                    {coupon.discountPercentage}% OFF
                                  </div>
                                </div>
                                {coupon.minOrderAmount && (
                                  <p className="text-xs text-[#555555] mt-1">
                                    Min. order: ₹{coupon.minOrderAmount}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono text-sm font-bold text-green-700">
                          {appliedCoupon.couponCode}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Coupon applied successfully!
                        </p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-600 hover:text-red-700 text-xs font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method — COD only, Razorpay coming soon */}
              <div className="border-t border-[#C6A15B]/20 pt-4">
                <h3 className="text-sm font-medium text-[#2C2C2C] mb-3">Payment Method</h3>

                <label className="flex items-center gap-3 p-3 border-2 border-[#1F3D2B] bg-[#1F3D2B]/5 rounded-lg cursor-default">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked
                    readOnly
                  />
                  <div>
                    <div className="font-medium text-[#2C2C2C] text-sm">Cash on Delivery</div>
                    <div className="text-xs text-[#555555]">Pay when your order arrives</div>
                  </div>
                </label>

                {/* ─── Uncomment below when Razorpay bank account is ready ───────────
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-[#1F3D2B]/5 mt-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="RAZORPAY"
                    checked={paymentMethod === "RAZORPAY"}
                    onChange={() => setPaymentMethod("RAZORPAY")}
                  />
                  <div>
                    <div className="font-medium text-[#2C2C2C] text-sm">Online Payment</div>
                    <div className="text-xs text-[#555555]">UPI / Cards / Wallets / NetBanking</div>
                  </div>
                </label>
                ─────────────────────────────────────────────────────────────────── */}
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full bg-[#1F3D2B] text-white py-3 rounded-lg font-semibold hover:bg-[#162d1f] transition disabled:bg-gray-400"
              >
                {processing ? "Processing..." : "Place Order"}
              </button>

              <p className="text-center text-xs text-[#555555]">🔒 Secure Checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;