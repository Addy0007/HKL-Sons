import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCart } from "../../../State/Cart/Action";
import OrderSummary from "./OrderSummary";

const CheckoutSummary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const address = useSelector((state) => state.checkout.address);
  const { cart } = useSelector((state) => state);

  // ✅ If someone refreshes or lands here directly → send back to address step
  useEffect(() => {
    if (!address) {
      console.warn("No address found, redirecting to address page");
      navigate("/checkout/address", { replace: true });
    }
  }, [address, navigate]);

  // ✅ Fetch cart if it's empty or undefined (handles refresh & navigation issues)
  useEffect(() => {
    if (!cart.cartItems || cart.cartItems.length === 0) {
      console.log("Cart is empty, fetching cart data...");
      dispatch(getCart());
    }
  }, [dispatch]); // Only run once on mount

  // ✅ Show loading while cart is being fetched
  if (cart.loading) {
    return (
      <div className="min-h-screen bg-[#F6F3EC] py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F3D2B] mx-auto mb-4"></div>
          <p className="text-[#3D3D3D]">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // ✅ Redirect to cart if still empty after loading
  if (!cart.loading && (!cart.cartItems || cart.cartItems.length === 0)) {
    return (
      <div className="min-h-screen bg-[#F6F3EC] py-10 px-4 flex items-center justify-center">
        <div className="text-center bg-[#F6F3EC] p-8 rounded-xl shadow border border-[#C6A15B]/20">
          <p className="text-[#3D3D3D] mb-4 text-lg">Your cart is empty</p>
          <button
            onClick={() => navigate("/cart")}
            className="bg-[#1F3D2B] text-white py-2 px-6 rounded-md hover:bg-[#162d1f]"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  if (!address) return null;

  return <OrderSummary address={address} onEdit={() => navigate("/checkout/address")} />;
};

export default CheckoutSummary;