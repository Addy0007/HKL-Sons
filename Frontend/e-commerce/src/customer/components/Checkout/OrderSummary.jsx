import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../../../State/Order/Action";

const OrderSummary = ({ address, onEdit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state);

  // ✅ Check if cart is empty and redirect to cart page
  useEffect(() => {
    if (!cart.cartItems || cart.cartItems.length === 0) {
      console.warn("Cart is empty, redirecting to cart page");
      navigate("/cart", { replace: true });
    }
  }, [cart.cartItems, navigate]);

  // Calculate totals
  const calculateSubtotal = () => {
    return cart.cartItems?.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0) || 0;
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 500 ? 0 : 40; // Free shipping above ₹500
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    // ✅ Double-check cart before placing order
    if (!cart.cartItems || cart.cartItems.length === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      navigate("/cart");
      return;
    }

    const reqData = {
      address,
      navigate,
    };
    dispatch(createOrder(reqData));
  };

  // ✅ Don't render if cart is empty
  if (!cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/cart")}
            className="bg-emerald-700 text-white py-2 px-6 rounded-md hover:bg-emerald-800"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-800 mb-6">Order Summary</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Address & Items */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Delivery Address Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-emerald-800">Delivery Address</h2>
                <button
                  onClick={onEdit}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              
              <div className="text-gray-700 space-y-1">
                <p className="font-semibold">
                  {address.firstName} {address.lastName}
                </p>
                <p>{address.streetAddress}</p>
                <p>
                  {address.city}, {address.district}
                </p>
                <p>
                  {address.state} - {address.zipCode}
                </p>
                <p className="pt-2">
                  <span className="font-medium">Phone:</span> {address.mobile}
                </p>
              </div>
            </div>

            {/* Order Items Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-emerald-800 mb-4">
                Order Items ({cart.cartItems?.length || 0})
              </h2>
              
              <div className="space-y-4">
                {cart.cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b last:border-b-0"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.product?.imageUrl || "/placeholder.png"}
                        alt={item.product?.title || "Product"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.product?.title || "Product Name"}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.product?.brand || "Brand"}
                      </p>
                      {item.size && (
                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{item.price} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Price Breakdown */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-emerald-800 mb-4">
                Price Details
              </h2>

              <div className="space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-gray-700">
                  <span>Tax (GST 18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Message */}
              {subtotal < 500 && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-lg text-sm text-emerald-700">
                  Add ₹{(500 - subtotal).toFixed(2)} more for FREE shipping!
                </div>
              )}

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                className="w-full mt-6 bg-emerald-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-800 transition-colors"
              >
                Place Order
              </button>

              {/* Security Message */}
              <div className="mt-4 text-center text-xs text-gray-500">
                <p>🔒 Secure Checkout</p>
                <p className="mt-1">Your payment information is encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;