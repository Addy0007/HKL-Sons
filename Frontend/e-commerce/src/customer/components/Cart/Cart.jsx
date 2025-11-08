import React, { useEffect } from "react";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCart, removeCartItem, updateCartItem } from "../../../State/Cart/Action";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Load cart on mount
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  // Handle Checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      return navigate("/login", {
        state: {
          from: "/checkout?step=2",
          message: "Please sign in to continue checkout.",
        },
      });
    }
    navigate("/checkout?step=2");
  };

  // ✅ Calculate all price values
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  const discountedTotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.discountedPrice,
    0
  );

  const discount = subtotal - discountedTotal;
  const delivery = discountedTotal > 499 ? 0 : 50; // Example delivery rule
  const grandTotal = discountedTotal + delivery;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-2xl font-semibold text-emerald-800 border-b pb-2">
            My Shopping Cart
          </h2>

          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={() => dispatch(updateCartItem(item.id, item.quantity + 1))}
                onDecrease={() => {
                  if (item.quantity > 1) {
                    dispatch(updateCartItem(item.id, item.quantity - 1));
                  } else {
                    dispatch(updateCartItem(item.id, 0));
                  }
                }}
                onRemove={() => dispatch(removeCartItem(item.id))}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 text-emerald-700 hover:text-emerald-800 font-medium"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SECTION: PRICE DETAILS */}
        <div className="bg-white border rounded-xl shadow-md p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
            Price Details ({cartItems.length} items)
          </h3>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Total MRP</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount on MRP</span>
              <span className="text-green-600">− ₹{discount}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-blue-600">
                {delivery === 0 ? "Free" : `₹${delivery}`}
              </span>
            </div>

            <hr className="border-gray-200 my-3" />

            <div className="flex justify-between text-base font-semibold text-gray-900">
              <span>Total Amount</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          <button
            className="mt-6 w-full bg-emerald-700 text-white font-medium py-3 rounded-md hover:bg-emerald-800 transition"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;
