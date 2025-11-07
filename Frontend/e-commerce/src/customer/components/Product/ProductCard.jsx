import "./ProductCard.css";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  if (!product) return null; // Prevent breaking UI

  const {
    id,
    imageUrl,
    brand = "Unknown Brand",
    title = "Product",
    price = 0,
    discountedPrice = 0,
    discountPercent = 0,
  } = product;

  // ✅ Add click handler with logging
  const handleClick = () => {
    console.log("🛍️ Clicked product:", { id, title, brand }); // Debug log
    
    if (!id) {
      console.error("❌ Product ID is missing!", product);
      return;
    }
    
    console.log("📍 Navigating to:", `/product/${id}`);
    navigate(`/product/${id}`);
  };

  return (
    <div
      onClick={handleClick} // ✅ Use the handler instead
      className="productCard w-full h-full bg-white rounded-lg shadow-sm overflow-hidden transition-all cursor-pointer hover:scale-[1.03]"
    >
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img
          className="h-full w-full object-cover object-center"
          src={imageUrl}
          alt={title}
          onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
          loading="lazy"
        />
      </div>

      <div className="textPart p-3">
        <p className="font-semibold opacity-70 text-sm">{brand}</p>
        <p className="text-gray-800 text-sm truncate">{title}</p>

        <div className="flex items-center space-x-2 mt-2">
          <p className="font-semibold text-gray-900">₹{discountedPrice}</p>
          <p className="line-through opacity-50 text-sm">₹{price}</p>
          <p className="text-green-600 font-semibold text-xs">
            {discountPercent}% OFF
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;