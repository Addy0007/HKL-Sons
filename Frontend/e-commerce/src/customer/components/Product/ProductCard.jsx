import "./ProductCard.css";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  if (!product) return null; // Prevent breaking UI if product is missing

  const {
    id,
    imageUrl,
    brand = "Unknown Brand",
    title = "Product",
    price = 0,
    discountedPrice = 0,
    discountPercent = 0,
    quantity = 0, // ✅ Ensure safe fallback
  } = product;

  // ✅ Click handler — only active if product is in stock
  const handleClick = () => {
    if (quantity <= 0) return; // Prevent navigation for out-of-stock items

    console.log("🛍️ Clicked product:", { id, title, brand });
    if (!id) {
      console.error("❌ Product ID missing:", product);
      return;
    }

    navigate(`/product/${id}`);
  };

  return (
    <div
      onClick={quantity > 0 ? handleClick : undefined}
      className={`productCard relative w-full h-full bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${
        quantity > 0
          ? "cursor-pointer hover:scale-[1.03]"
          : "opacity-70 cursor-not-allowed"
      }`}
    >
      {/* ---------- Product Image ---------- */}
      <div className="aspect-[3/4] w-full overflow-hidden relative">
        <img
          className="h-full w-full object-cover object-center"
          src={imageUrl}
          alt={title}
          onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
          loading="lazy"
        />

        {/* ---------- Out of Stock Overlay ---------- */}
        {quantity <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="text-white text-sm font-semibold px-3 py-1 bg-gray-800 rounded-md">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* ---------- Text Info ---------- */}
      <div className="textPart p-3">
        <p className="font-semibold opacity-70 text-sm truncate">{brand}</p>
        <p className="text-gray-800 text-sm truncate">{title}</p>

        <div className="flex items-center space-x-2 mt-2">
          <p className="font-semibold text-gray-900">₹{discountedPrice}</p>
          <p className="line-through opacity-50 text-sm">₹{price}</p>
          <p className="text-green-600 font-semibold text-xs">
            {discountPercent}% OFF
          </p>
        </div>

        {/* ---------- Optional Low Stock Indicator ---------- */}
        {quantity > 0 && quantity <= 3 && (
          <p className="text-xs text-orange-600 font-medium mt-1">
            ⚠️ Only {quantity} left in stock!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
