import React, { useEffect } from "react";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCart, removeCartItem, updateCartItem, toggleCartItemSelection } from "../../../State/Cart/Action";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

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

  const handleToggleSelection = (itemId) => {
    console.log("Cart: Toggling selection for item", itemId);
    dispatch(toggleCartItemSelection(itemId));
  };

  // ✅ Validate quantity against stock before increasing
  const handleIncrease = (item) => {
    const maxQuantity = item.product.quantity || 0;
    
    if (item.quantity >= maxQuantity) {
      alert(`Maximum available quantity is ${maxQuantity}`);
      return;
    }
    
    dispatch(updateCartItem(item.id, item.quantity + 1));
  };

  // Filter only selected items for price calculation
  const selectedItems = cartItems.filter(item => item.selected !== false);

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  const discountedTotal = selectedItems.reduce(
    (sum, item) => sum + item.quantity * item.product.discountedPrice,
    0
  );

  const discount = subtotal - discountedTotal;
  const delivery = discountedTotal > 499 ? 0 : 50;
  const grandTotal = discountedTotal + delivery;

  const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected !== false);
  
  const handleSelectAll = () => {
    cartItems.forEach(item => {
      const shouldToggle = allSelected ? item.selected !== false : item.selected === false;
      if (shouldToggle) {
        dispatch(toggleCartItemSelection(item.id));
      }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-2xl font-semibold text-emerald-800">
              My Shopping Cart
            </h2>
            
            {cartItems.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="text-sm font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-2"
              >
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 accent-emerald-700 cursor-pointer"
                />
                Select All
              </button>
            )}
          </div>

          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={() => handleIncrease(item)} // ✅ Use validated handler
                onDecrease={() => {
                  if (item.quantity > 1) {
                    dispatch(updateCartItem(item.id, item.quantity - 1));
                  } else {
                    dispatch(updateCartItem(item.id, 0));
                  }
                }}
                onRemove={() => dispatch(removeCartItem(item.id))}
                onToggleSelection={handleToggleSelection}
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
            Price Details ({selectedItems.length} of {cartItems.length} items selected)
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
            className="mt-6 w-full bg-emerald-700 text-white font-medium py-3 rounded-md hover:bg-emerald-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleCheckout}
            disabled={selectedItems.length === 0}
          >
            Proceed to Checkout ({selectedItems.length} items)
          </button>

          {selectedItems.length === 0 && cartItems.length > 0 && (
            <p className="text-xs text-orange-600 text-center mt-2">
              Please select at least one item to checkout
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Cart;