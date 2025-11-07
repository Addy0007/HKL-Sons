import React from "react"
import "./CartItem.css"
import { IconButton } from "@mui/material"
import { Add, Remove, Delete } from "@mui/icons-material"

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const { product, size, quantity } = item;

  return (
    <div className={`cart-item p-5 border rounded-xl shadow-md bg-white hover:shadow-lg transition duration-200 
      ${quantity === 0 ? "opacity-50" : "opacity-100"}`}>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-5">

          {/* Product Image */}
          <div className="w-[6rem] h-[6rem] sm:w-[8rem] sm:h-[8rem] flex-shrink-0">
            <img
              className="w-full h-full object-cover object-top rounded-md border"
              src={product.imageUrl}
              alt={product.title}
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-2">
            <p className="font-semibold text-gray-900 text-lg">{product.title}</p>
            <p className="text-gray-600 text-sm">Size: {size}</p>
            <p className="text-gray-500 text-sm">Seller: {product.brand}</p>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <p className="font-semibold text-gray-900 text-lg">₹{product.discountedPrice}</p>
              <p className="opacity-50 line-through text-sm">₹{product.price}</p>
              <p className="text-green-600 font-medium text-sm">{product.discountPercent}% Off</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t mt-2 pt-4">
          <div className="flex items-center gap-3">

            {/* Quantity Control */}
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm w-fit">
              {/* Only show decrease button if quantity > 0 */}
              {quantity > 0 && (
                <IconButton size="small" onClick={onDecrease}>
                  <Remove fontSize="small" />
                </IconButton>
              )}

              <div className={`px-4 py-1 text-sm font-semibold bg-gray-50 min-w-[2rem] text-center ${
                quantity === 0 ? "text-gray-400" : "text-gray-800"
              }`}>
                {quantity}
              </div>

              <IconButton 
                size="small" 
                onClick={onIncrease}
              >
                <Add fontSize="small" />
              </IconButton>
            </div>

            {/* Remove */}
            <button
              onClick={onRemove}
              className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition"
            >
              <Delete fontSize="small" /> Remove
            </button>
          </div>
        </div>

        {/* Show this label when item is in "waiting to be removed" state */}
        {quantity === 0 && (
          <p className="text-xs text-red-500 italic pl-1">
            Will be removed automatically soon
          </p>
        )}

      </div>
    </div>
  )
}

export default CartItem;