import React from "react";
import { IconButton, Checkbox } from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";

const CartItem = ({ item, onIncrease, onDecrease, onRemove, onToggleSelection }) => {
  const { product, size, quantity, selected = true } = item;

  // ✅ Get max available quantity from product
  const maxQuantity = product.quantity || 0;
  const isAtMaxQuantity = quantity >= maxQuantity;

  console.log(`CartItem ${item.id}: quantity=${quantity}, maxQuantity=${maxQuantity}`);

  const handleCheckboxChange = (e) => {
    console.log("Checkbox clicked, current selected:", selected);
    onToggleSelection(item.id);
  };

  return (
    <div 
      className={`cart-item p-5 border rounded-xl shadow-md bg-white transition duration-200 
        ${quantity === 0 ? "opacity-50" : "opacity-100"}
        ${!selected ? "bg-gray-50 border-gray-300" : "hover:shadow-lg border-emerald-200"}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-5">

          {/* Selection Checkbox */}
          <div className="flex items-start">
            <Checkbox
              checked={selected === true}
              onChange={handleCheckboxChange}
              sx={{
                color: "#059669",
                "&.Mui-checked": { color: "#059669" },
              }}
            />
          </div>

          {/* Product Image */}
          <div className="w-[6rem] h-[6rem] sm:w-[8rem] sm:h-[8rem] flex-shrink-0">
            <img
              className={`w-full h-full object-cover object-top rounded-md border ${
                !selected ? "opacity-60" : ""
              }`}
              src={product.imageUrl}
              alt={product.title}
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-2">
            <p className={`font-semibold text-lg ${!selected ? "text-gray-500" : "text-gray-900"}`}>
              {product.title}
            </p>
            <p className="text-gray-600 text-sm">Size: {size}</p>
            <p className="text-gray-500 text-sm">Seller: {product.brand}</p>

            {/* ✅ Stock availability indicator */}
            {maxQuantity > 0 && maxQuantity <= 5 && (
              <p className="text-orange-600 text-xs font-medium">
                ⚠️ Only {maxQuantity} left in stock
              </p>
            )}
            {maxQuantity === 0 && (
              <p className="text-red-600 text-xs font-medium">
                ❌ Out of stock
              </p>
            )}

            {/* Price */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <p className={`font-semibold text-lg ${!selected ? "text-gray-500" : "text-gray-900"}`}>
                ₹{product.discountedPrice}
              </p>
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
              {quantity > 0 && (
                <IconButton 
                  size="small" 
                  onClick={onDecrease} 
                  disabled={!selected}
                >
                  <Remove fontSize="small" />
                </IconButton>
              )}

              <div className={`px-4 py-1 text-sm font-semibold bg-gray-50 min-w-[2rem] text-center ${
                quantity === 0 ? "text-gray-400" : "text-gray-800"
              }`}>
                {quantity}
              </div>

              {/* ✅ Disable Add button when at max quantity */}
              <IconButton 
                size="small" 
                onClick={onIncrease} 
                disabled={!selected || isAtMaxQuantity || maxQuantity === 0}
                title={isAtMaxQuantity ? "Maximum quantity reached" : ""}
              >
                <Add 
                  fontSize="small" 
                  className={isAtMaxQuantity ? "text-gray-400" : ""}
                />
              </IconButton>
            </div>

            {/* ✅ Show current/max quantity */}
            <span className="text-xs text-gray-500">
              {quantity}/{maxQuantity}
            </span>

            {/* Remove */}
            <button
              onClick={onRemove}
              className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition"
            >
              <Delete fontSize="small" /> Remove
            </button>
          </div>
        </div>

        {/* Show labels */}
        {!selected && (
          <p className="text-xs text-orange-600 italic pl-1">
            ℹ️ This item will remain in your cart but won't be included in checkout
          </p>
        )}
        
        {isAtMaxQuantity && quantity > 0 && (
          <p className="text-xs text-orange-600 italic pl-1">
            ⚠️ Maximum available quantity in cart
          </p>
        )}
        
        {quantity === 0 && (
          <p className="text-xs text-red-500 italic pl-1">
            Will be removed automatically soon
          </p>
        )}
      </div>
    </div>
  );
};

export default CartItem;