import React, { useState } from "react"
import { IconButton } from "@mui/material"
import { Add, Remove, Delete } from "@mui/icons-material"

const CartItem = () => {
  const [quantity, setQuantity] = useState(1)

  const handleIncrease = () => setQuantity((prev) => prev + 1)
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  const handleRemove = () => alert("Item removed from cart")

  return (
    <div className="p-5 border rounded-xl shadow-md bg-white hover:shadow-lg transition duration-200">
      {/* Container */}
      <div className="flex flex-col gap-4">
        {/* Top Section - Image + Info */}
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Product Image */}
          <div className="w-[6rem] h-[6rem] sm:w-[8rem] sm:h-[8rem] flex-shrink-0">
            <img
              className="w-full h-full object-cover object-top rounded-md border"
              src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-featured-product-shot.jpg"
              alt="product"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-2">
            <p className="font-semibold text-gray-900 text-lg">Basic Tee 6-Pack</p>
            <p className="text-gray-600 text-sm">Size: L, Color: White</p>
            <p className="text-gray-500 text-sm">Seller: PremiumWear Co.</p>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <p className="font-semibold text-gray-900 text-lg">₹199</p>
              <p className="opacity-50 line-through text-sm">₹211</p>
              <p className="text-green-600 font-medium text-sm">5% Off</p>
            </div>
          </div>
        </div>

        {/* Bottom Section - Quantity + Remove */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2 border-t border-gray-100 mt-2 pt-4">
          {/* Quantity + Remove together */}
          <div className="flex items-center gap-3">
            {/* Quantity Control */}
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm w-fit">
              <IconButton
                size="small"
                onClick={handleDecrease}
                className="text-emerald-700 hover:text-white hover:bg-emerald-700 transition"
              >
                <Remove fontSize="small" />
              </IconButton>

              <div className="px-4 py-1 text-sm font-semibold text-gray-800 bg-gray-50 min-w-[2rem] text-center">
                {quantity}
              </div>

              <IconButton
                size="small"
                onClick={handleIncrease}
                className="text-emerald-700 hover:text-white hover:bg-emerald-700 transition"
              >
                <Add fontSize="small" />
              </IconButton>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition"
            >
              <Delete fontSize="small" /> Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem
