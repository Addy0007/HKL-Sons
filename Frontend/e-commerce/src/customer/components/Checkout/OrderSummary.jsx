import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../../../State/Order/Action";

const OrderSummary = ({ address, onEdit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state);

  // ✅ Selected Items Only
  const selectedItems = cart.cartItems?.filter(item => item.selected !== false) || [];

  // ✅ If no selected items, send back to cart
  useEffect(() => {
    if (selectedItems.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [selectedItems, navigate]);

  // ✅ Calculate totals based only on selected items
  const subtotal = selectedItems.reduce((sum, item) => sum + item.discountedPrice, 0);
  const shipping = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    if (selectedItems.length === 0) {
      alert("No selected items to checkout.");
      return navigate("/cart");
    }
    dispatch(createOrder({ address, navigate }));
  };

  if (selectedItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-800 mb-6">Order Summary</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* Delivery Address */}
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

            {/* ✅ Order Items Card */}
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

          {/* RIGHT SIDE PRICE BOX */}
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

              <button
                onClick={handlePlaceOrder}
                className="w-full mt-6 bg-emerald-700 text-white py-3 rounded-lg font-semibold hover:bg-emerald-800 transition"
              >
                Place Order
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
