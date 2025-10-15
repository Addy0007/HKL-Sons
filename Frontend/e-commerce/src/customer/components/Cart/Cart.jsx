import React from "react";
import CartItem from "./CartItem";

const Cart = () => {
  // Dummy price data (later this will come from backend or context)
  const priceDetails = {
    items: 3,
    subtotal: 897,
    discount: 120,
    delivery: 49,
  };

  const totalAmount = priceDetails.subtotal - priceDetails.discount + priceDetails.delivery;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SECTION — CART ITEMS */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-2xl font-semibold text-emerald-800 border-b pb-2">
            My Shopping Cart
          </h2>

          {/* Cart Items */}
          <CartItem />
          <CartItem />
          <CartItem />
        </div>

        {/* RIGHT SECTION — PRICE DETAILS */}
        <div className="bg-white border rounded-xl shadow-md p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
            Price Details
          </h3>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Price ({priceDetails.items} items)</span>
              <span>₹{priceDetails.subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">− ₹{priceDetails.discount}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-gray-800">₹{priceDetails.delivery}</span>
            </div>

            <hr className="border-gray-200 my-3" />

            <div className="flex justify-between text-base font-semibold text-gray-900">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <button
            className="mt-6 w-full bg-emerald-700 text-white font-medium py-3 rounded-md hover:bg-emerald-800 transition shadow-sm hover:shadow-md"
            onClick={() => alert("Proceeding to checkout...")}
          >
            Proceed to Checkout
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Secure payment • Easy returns • 100% genuine products
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
