import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import { findProductById } from '../../../State/Product/Action';
import { addItemToCart } from '../../../State/Cart/Action';
import ProductReviewSection from './ProductReviewSection';
import "./LoginPrompt.css";

const placeholderImages = [
  'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
  'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg',
  'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg',
  'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-featured-product-shot.jpg',
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, loading } = useSelector((state) => state.product);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (productId) {
      dispatch(findProductById(productId));
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (product?.sizes?.length > 0) {
      const firstAvailableSize = product.sizes.find(s => s.quantity > 0);
      if (firstAvailableSize) setSelectedSize(firstAvailableSize.name);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true); // ✅ Show popup instead of redirect
      return;
    }

    const data = {
      productId: Number(productId),
      size: selectedSize,
      quantity: 1
    };

    await dispatch(addItemToCart(data));
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const images = [
    { src: product.imageUrl, alt: product.title },
    ...placeholderImages.slice(1).map(src => ({ src, alt: product.title }))
  ];

  return (
    <div className="min-h-screen bg-white pt-20">

      {/* PRODUCT UI (unchanged) */}
      <section className="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* LEFT IMAGES */}
          <div className="flex flex-col gap-4">
            <div className="w-full bg-gray-100 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
              <img src={images[selectedImage].src} alt={images[selectedImage].alt} className="w-full h-full object-cover" />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={classNames(
                    'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                    selectedImage === idx ? 'border-emerald-600' : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT DETAILS */}
          <div className="flex flex-col">
            <h1 className="text-lg lg:text-2xl font-semibold text-gray-900 tracking-tight">{product.title}</h1>
            <p className="text-gray-600 mt-1 text-sm">{product.brand} • {product.color}</p>

            <div className="mt-5 flex gap-5 text-lg text-gray-900">
              <p className="font-semibold">₹{product.discountedPrice}</p>
              <p className="opacity-50 line-through text-base">₹{product.price}</p>
              <p className="text-green-600 font-medium">{product.discountPercent}% Off</p>
            </div>

            {/* DESCRIPTION */}
<p className="text-gray-700 text-base mt-6 leading-relaxed">
  {product.description || 
    "High-quality product crafted with care and attention to detail. Perfect for everyday wear and special occasions."
  }
</p>

{/* HIGHLIGHTS */}
<div className="mt-8">
  <h3 className="text-sm font-semibold text-gray-900 mb-3">Highlights</h3>
  <ul className="space-y-2 text-sm text-gray-700">
    <li className="flex items-start gap-2">
      <span className="text-emerald-600 mt-1">✓</span>
      Premium quality fabric
    </li>
    <li className="flex items-start gap-2">
      <span className="text-emerald-600 mt-1">✓</span>
      Comfortable & breathable fit
    </li>
    <li className="flex items-start gap-2">
      <span className="text-emerald-600 mt-1">✓</span>
      Perfect for casual & festive occasions
    </li>
    <li className="flex items-start gap-2">
      <span className="text-emerald-600 mt-1">✓</span>
      Available in multiple sizes
    </li>
  </ul>
</div>


            {/* SIZE SELECTOR */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map(size => (
                  <label
                    key={size.name}
                    className={classNames(
                      'flex items-center justify-center py-2 px-2 rounded-lg border-2 text-sm font-medium cursor-pointer transition-all',
                      selectedSize === size.name
                        ? 'border-emerald-700 bg-emerald-700 text-white'
                        : size.quantity > 0
                        ? 'border-gray-300 text-gray-900 hover:border-gray-400'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    )}
                  >
                    <input
                      type="radio"
                      name="size"
                      value={size.name}
                      checked={selectedSize === size.name}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      disabled={size.quantity === 0}
                      className="hidden"
                    />
                    {size.name}
                  </label>
                ))}
              </div>
            </div>

            {/* ADD TO CART BUTTON */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="mt-8 w-full sm:w-2/3 bg-emerald-700 text-white font-semibold py-2.5 rounded-md hover:bg-emerald-800 transition-colors shadow-sm hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>

          </div>
        </div>
      </section>

      <ProductReviewSection />


      {/* ✅ LOGIN POPUP MODAL */}
      {showLoginPrompt && (
        <div className="login-popup-overlay animate-fadeIn">
          <div className="login-popup-box animate-slideUp">
            <h3 className="text-lg font-semibold text-gray-900 text-center">Sign In Required</h3>
            <p className="text-gray-600 text-sm text-center mt-2">
              Please sign in to add items to your cart.
            </p>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="popup-btn-secondary"
              >
                Back
              </button>

              <button
                onClick={() =>
                  navigate("/login", {
                    state: { from: `/product/${productId}`, message: "Sign in to continue shopping." }
                  })
                }
                className="popup-btn-primary"
              >
                Sign In / Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
