import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useNavigate } from "react-router-dom";
import api from "../../../Config/apiConfig";

const MainCorosel = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/products/featured');
        console.log('🎯 Featured products loaded:', data);
        setFeaturedProducts(data);
        setError(null);
      } catch (err) {
        console.error('❌ Error loading featured products:', err);
        setError('Failed to load carousel');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center rounded-xl mx-3 md:mx-6 my-4 animate-pulse">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  const items = featuredProducts.map((product, index) => (
    <div
      key={product.id || index}
      className="relative w-full cursor-pointer overflow-hidden group"
      onClick={() => handleProductClick(product.id)}
    >
      {/* ========== MOBILE VIEW ========== */}
      <div className="block lg:hidden relative">
        <img
          src={product.imageUrl}
          alt={product.title}
          draggable="false"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/800x1200?text=No+Image";
          }}
          className="w-full h-[60vh] object-cover object-top rounded-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-xl" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">{product.title}</h2>
          <p className="text-sm opacity-90 mb-3">
            {product.brand} • ₹{product.discountedPrice}
          </p>
          <div className="inline-block bg-white text-gray-900 px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors">
            Shop Now →
          </div>
        </div>
      </div>

      {/* ========== DESKTOP VIEW ========== */}
      <div className="hidden lg:flex items-stretch h-[75vh] rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">

        {/* Left side - Content (no overlap with arrows) */}
        <div className="w-1/2 flex items-center">
          {/* Padding-left is larger (pl-20) to avoid left arrow overlap */}
          <div className="pl-20 pr-10 xl:pl-28 xl:pr-14 w-full">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-3">
              Featured
            </p>
            <h2 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4 text-gray-900 leading-tight">
              {product.title}
            </h2>
            <p className="text-lg text-gray-500 mb-2">{product.brand}</p>
            <div className="flex items-center gap-3 mb-6">
              <p className="text-2xl font-bold text-gray-900">
                ₹{product.discountedPrice}
              </p>
              {product.discountPercent > 0 && (
                <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                  {product.discountPercent}% OFF
                </span>
              )}
              {product.price && product.price !== product.discountedPrice && (
                <span className="text-gray-400 line-through text-lg">
                  ₹{product.price}
                </span>
              )}
            </div>
            <p className="text-base text-gray-500 mb-8 leading-relaxed line-clamp-3 max-w-md">
              {product.description || "Premium quality product"}
            </p>
            <button
              className="bg-gray-900 text-white px-8 py-4 rounded-full text-base font-semibold 
                         hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                handleProductClick(product.id);
              }}
            >
              Shop Now →
            </button>
          </div>
        </div>

        {/* Right side - Image: object-contain so full image is always visible */}
        <div className="w-1/2 h-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.title}
            draggable="false"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/1000x1200?text=No+Image";
            }}
            className="h-full w-full object-contain object-center 
                       transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  ));

  return (
    <div className="relative px-3 md:px-6 py-4">
      <AliceCarousel
        mouseTracking
        autoPlay
        autoPlayInterval={4000}
        infinite
        animationDuration={800}
        keyboardNavigation
        items={items}
        disableDotsControls={false}
        disableButtonsControls={false}
        responsive={{
          0: { items: 1 },
          768: { items: 1 },
          1024: { items: 1 },
        }}
        renderDotsItem={(e) => (
          <div
            className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
              e.isActive ? "bg-gray-900 w-8" : "bg-gray-400 hover:bg-gray-600"
            }`}
          />
        )}
        renderPrevButton={() => (
          <button
            className="
              absolute left-2 md:left-4 top-1/2 -translate-y-1/2
              bg-white/90 hover:bg-white shadow-lg
              w-10 h-10 md:w-12 md:h-12
              rounded-full flex items-center justify-center
              text-xl md:text-2xl font-bold text-gray-800
              transition-all duration-300 z-20
              hover:scale-110 active:scale-95
            "
            aria-label="Previous slide"
          >
            ‹
          </button>
        )}
        renderNextButton={() => (
          <button
            className="
              absolute right-2 md:right-4 top-1/2 -translate-y-1/2
              bg-white/90 hover:bg-white shadow-lg
              w-10 h-10 md:w-12 md:h-12
              rounded-full flex items-center justify-center
              text-xl md:text-2xl font-bold text-gray-800
              transition-all duration-300 z-20
              hover:scale-110 active:scale-95
            "
            aria-label="Next slide"
          >
            ›
          </button>
        )}
      />
    </div>
  );
};

export default MainCorosel;