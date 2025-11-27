import React from "react";
import { useNavigate } from "react-router-dom";

const HomeSectionCart = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!product?.id) return;
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer flex flex-col items-center bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden w-[15rem] mx-3 
                 hover:scale-[1.02] transition-transform duration-200"
    >
      <div className="h-[13rem] w-[10rem] flex items-center justify-center bg-gray-50">
        <img
          className="object-cover object-top w-full h-full"
          src={product.imageUrl}
          alt={product.title || "Product image"}
          loading="lazy"
        />
      </div>

      <div className="p-4 w-full">
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {product.brand}
        </h3>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
          {product.title}
        </p>

        {/* Optional price UI – remove if you don't have these fields */}
        {product.discountedPrice != null && (
          <div className="mt-2 flex items-center gap-2">
            <span className="font-semibold text-emerald-700 text-sm">
              ₹{product.discountedPrice}
            </span>
            {product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.price}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeSectionCart;
