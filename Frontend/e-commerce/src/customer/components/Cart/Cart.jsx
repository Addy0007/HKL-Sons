import React, { useEffect } from "react";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCart, removeCartItem, updateCartItem } from "../../../State/Cart/Action";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, cart } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleCheckout = () => {
    navigate('/checkout?step=2');
  };
const priceDetails = {
  subtotal: cart?.totalPrice || 0,
  discount: cart?.discount || 0,
  delivery: 0 // Or calculate based on your logic
};
  const totalAmount = priceDetails.subtotal - priceDetails.discount + priceDetails.delivery;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-2xl font-semibold text-emerald-800 border-b pb-2">
            My Shopping Cart
          </h2>

          {cartItems?.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={() => dispatch(updateCartItem(item.id, item.quantity + 1))}
         onDecrease={() => {
            if (item.quantity > 1) {
              dispatch(updateCartItem(item.id, item.quantity - 1));
            } else {
              dispatch(updateCartItem(item.id, 0)); // allow zero
            }
          }}

              onRemove={() => dispatch(removeCartItem(item.id))}
            />
          ))}
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-white border rounded-xl shadow-md p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
            Price Details
          </h3>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{priceDetails.subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">− ₹{priceDetails.discount}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>₹{priceDetails.delivery}</span>
            </div>

            <hr className="border-gray-200 my-3" />

            <div className="flex justify-between text-base font-semibold text-gray-900">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <button
            className="mt-6 w-full bg-emerald-700 text-white font-medium py-3 rounded-md hover:bg-emerald-800 transition shadow-sm hover:shadow-md"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;
