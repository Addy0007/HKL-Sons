import React from 'react';
import "./ProductCard.css";

const ProductCard = ({
  imageUrl,
  brand = "Unknown Brand",
  title = "Product",
  price = 0,
  discountedPrice = 0,
  discountPercent = 0,
}) => {
  return (
    <div className="productCard w-full h-full bg-white rounded-lg shadow-sm overflow-hidden transition-all cursor-pointer hover:scale-[1.03]">
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img
          className="h-full w-full object-cover object-center"
          src={imageUrl}
          alt={title}
          onError={(e) => (e.target.src = 'https://via.placeholder.com/300')}
        />
      </div>

      <div className="textPart p-3">
        <p className="font-semibold opacity-70 text-sm">{brand}</p>
        <p className="text-gray-800 text-sm truncate">{title}</p>

        <div className="flex items-center space-x-2 mt-2">
          <p className="font-semibold text-gray-900">₹{discountedPrice}</p>
          <p className="line-through opacity-50 text-sm">₹{price}</p>
          <p className="text-green-600 font-semibold text-xs">{discountPercent}% OFF</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
