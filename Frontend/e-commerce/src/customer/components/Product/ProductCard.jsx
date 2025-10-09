// src/customer/components/ProductCard.jsx
import React from 'react';
import "./ProductCard.css";

const ProductCard = ({
  imageUrl,
  brand = "Unknown Brand",
  title = "Product",
  price = 0,
  discountedPrice = 0,
  discountPercent = 0
}) => {
  return (
    <div className="productCard w-[15rem] m-3 transition-all cursor-pointer hover:scale-105">
      <div className="h-[20rem]">
        <img
          className="h-full w-full object-cover object-left-top rounded-t-lg"
          src={imageUrl}
          alt={title}
          onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
        />
      </div>

      <div className="textPart bg-white p-3 rounded-b-lg shadow-sm">
        <div>
          <p className="font-bold opacity-60 text-sm">{brand}</p>
          <p className="text-gray-800">{title}</p>
        </div>

        <div className="flex items-center space-x-2 mt-2">
          <p className="font-semibold text-gray-900">₹{discountedPrice}</p>
          <p className="line-through opacity-50 text-sm">₹{price}</p>
          <p className="text-green-600 font-semibold text-sm">{discountPercent}% OFF</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
