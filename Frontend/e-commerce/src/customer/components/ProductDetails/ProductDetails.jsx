import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Share2, Check, Copy, X } from 'lucide-react';
import { findProductById } from '../../../State/Product/Action';
import { addItemToCart } from '../../../State/Cart/Action';
import ProductReviewSection from './ProductReviewSection';
import "./LoginPrompt.css";

const placeholderImage = 'https://via.placeholder.com/600x800?text=No+Image';

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

  // Share state
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

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

  // ─── Share Handler ───────────────────────────────────────────────────────────
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: product?.title || 'Check out this product!',
      text: `${product?.title} — only ₹${product?.discountedPrice}! ${product?.discountPercent}% off.`,
      url: shareUrl,
    };

    // Use native share sheet on mobile if supported
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error — silently ignore
      }
    } else {
      // Fallback: show our custom share modal on desktop
      setShowShareModal(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Share to specific platforms
  const shareLinks = product ? [
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      color: 'bg-green-500 hover:bg-green-600',
      href: `https://wa.me/?text=${encodeURIComponent(`${product.title} — only ₹${product.discountedPrice}! ${product.discountPercent}% off.\n${window.location.href}`)}`,
    },
    {
      name: 'Telegram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      color: 'bg-sky-500 hover:bg-sky-600',
      href: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`${product.title} — only ₹${product.discountedPrice}!`)}`,
    },
    {
      name: 'X / Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
        </svg>
      ),
      color: 'bg-black hover:bg-gray-800',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${product.title} — only ₹${product.discountedPrice}! ${product.discountPercent}% off.`)}&url=${encodeURIComponent(window.location.href)}`,
    },
  ] : [];
  // ────────────────────────────────────────────────────────────────────────────

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
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

  const images = product.images && product.images.length > 0
    ? product.images.map(url => ({ src: url, alt: product.title }))
    : [{ src: product.imageUrl || placeholderImage, alt: product.title }];

  const highlights = product.highlights
    ? product.highlights.split(',').map(h => h.trim()).filter(Boolean)
    : [
        "Premium quality fabric",
        "Comfortable & breathable fit",
        "Perfect for casual & festive occasions",
        "Available in multiple sizes"
      ];

  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* LEFT IMAGES */}
          <div className="flex flex-col gap-4">
            <div className="w-full bg-gray-100 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = placeholderImage}
              />
            </div>

            {images.length > 1 && (
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
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.src = placeholderImage}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT DETAILS */}
          <div className="flex flex-col">

            {/* Title + Share button row */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-lg lg:text-2xl font-semibold text-gray-900 tracking-tight">
                {product.title}
              </h1>

              {/* ── SHARE BUTTON ── */}
              <button
                onClick={handleShare}
                title="Share this product"
                className="flex-shrink-0 flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-700 border border-gray-200 hover:border-emerald-400 rounded-lg px-3 py-1.5 transition-all"
              >
                <Share2 size={15} />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

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
                {highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">✓</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {/* PRODUCT DETAILS */}
            {(product.material || product.careInstructions || product.countryOfOrigin) && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Product Details</h3>
                <dl className="space-y-2 text-sm text-gray-700">
                  {product.material && (
                    <>
                      <dt className="font-medium inline">Material: </dt>
                      <dd className="inline">{product.material}</dd>
                      <br />
                    </>
                  )}
                  {product.careInstructions && (
                    <>
                      <dt className="font-medium inline">Care: </dt>
                      <dd className="inline">{product.careInstructions}</dd>
                      <br />
                    </>
                  )}
                  {product.countryOfOrigin && (
                    <>
                      <dt className="font-medium inline">Origin: </dt>
                      <dd className="inline">{product.countryOfOrigin}</dd>
                    </>
                  )}
                </dl>
              </div>
            )}

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
              disabled={product.quantity <= 0 || !selectedSize}
              onClick={handleAddToCart}
              className={`mt-8 w-full sm:w-2/3 px-4 py-2.5 rounded-md font-semibold shadow-sm transition-colors ${
                product.quantity <= 0
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-emerald-700 hover:bg-emerald-800 text-white"
              }`}
            >
              {product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </section>

      <ProductReviewSection productId={productId} />

      {/* ── LOGIN POPUP MODAL ── */}
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

      {/* ── SHARE MODAL (desktop fallback) ── */}
      {showShareModal && product && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-semibold text-gray-900 mb-1">Share this product</h3>
            <p className="text-xs text-gray-500 mb-5 line-clamp-1">{product.title}</p>

            {/* Platform buttons */}
            <div className="flex gap-3 mb-5">
              {shareLinks.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={platform.name}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-white text-xs font-medium transition-all ${platform.color}`}
                >
                  {platform.icon}
                  {platform.name}
                </a>
              ))}
            </div>

            {/* Copy link */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <span className="flex-1 text-xs text-gray-500 truncate">
                {window.location.href}
              </span>
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  copied
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-emerald-700 text-white hover:bg-emerald-800'
                }`}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}