import { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import { findProductById } from '../../../State/Product/Action'
import { addItemToCart } from '../../../State/Cart/Action';
import ProductReviewSection from './ProductReviewSection';

// Placeholder images for thumbnails
const placeholderImages = [
  'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
  'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg',
  'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg',
  'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-featured-product-shot.jpg',
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { product, loading } = useSelector((state) => state.product);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');

  // Fetch product on mount
  useEffect(() => {
    if (productId) {
      dispatch(findProductById(productId));
    }
  }, [productId, dispatch]);

  // Set first available size when product loads
  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      const firstAvailableSize = product.sizes.find(s => s.quantity > 0);
      if (firstAvailableSize) {
        setSelectedSize(firstAvailableSize.name);
      }
    }
  }, [product]);

const handleAddToCart = async () => {
  const data = {
    productId: Number(productId), // ✅ Convert
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

  // Create images array with product image + placeholders
  const images = [
    { src: product.imageUrl, alt: product.title },
    ...placeholderImages.slice(1).map(src => ({ src, alt: product.title }))
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-8 py-3">
          <ol role="list" className="flex items-center space-x-2 text-sm">
            <li>
              <a href="/" className="text-gray-600 hover:text-gray-900 font-medium">
                Home
              </a>
              <svg className="h-4 w-4 text-gray-400 mx-2 inline" fill="currentColor" viewBox="0 0 16 20">
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </li>
            <li>
              <a href={`/${product.category?.parentCategory?.parentCategory?.name || 'men'}`} 
                 className="text-gray-600 hover:text-gray-900 font-medium">
                {product.category?.parentCategory?.parentCategory?.name || 'Men'}
              </a>
              <svg className="h-4 w-4 text-gray-400 mx-2 inline" fill="currentColor" viewBox="0 0 16 20">
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </li>
            <li>
              <a href={`/${product.category?.parentCategory?.parentCategory?.name || 'men'}/${product.category?.parentCategory?.name || 'clothing'}`}
                 className="text-gray-600 hover:text-gray-900 font-medium">
                {product.category?.parentCategory?.name || 'Clothing'}
              </a>
              <svg className="h-4 w-4 text-gray-400 mx-2 inline" fill="currentColor" viewBox="0 0 16 20">
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium">{product.category?.name || 'Product'}</li>
          </ol>
        </div>
      </nav>

      {/* Product Section */}
      <section className="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT: Images */}
          <div className="flex flex-col gap-4">
            <div className="w-full bg-gray-100 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={classNames(
                    'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                    selectedImage === idx
                      ? 'border-emerald-600'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col">
            <h1 className="text-lg lg:text-2xl font-semibold text-gray-900 tracking-tight">
              {product.title}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              {product.brand} • {product.color}
            </p>

            {/* Price + Rating */}
            <div className="mt-5 flex flex-wrap items-center gap-5 text-lg text-gray-900">
              <p className="font-semibold">₹{product.discountedPrice}</p>
              <p className="opacity-50 line-through text-base">₹{product.price}</p>
              <p className="text-green-600 font-medium">{product.discountPercent}% Off</p>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-3 mt-3">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm font-medium text-gray-600">5890 ratings</span>
              <span className="text-sm font-medium text-gray-600">390 reviews</span>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-base mt-6 leading-relaxed">
              {product.description || 'High-quality product crafted with care and attention to detail. Perfect for everyday wear and special occasions.'}
            </p>

            {/* Highlights */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Highlights</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">✓</span>
                  <span className="text-gray-700 text-sm">Premium quality material</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">✓</span>
                  <span className="text-gray-700 text-sm">Comfortable fit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">✓</span>
                  <span className="text-gray-700 text-sm">Easy to maintain</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">✓</span>
                  <span className="text-gray-700 text-sm">Available in multiple sizes</span>
                </li>
              </ul>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Select Size</h3>
                  <a href="#" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
                    Size guide
                  </a>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
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
            )}

            {/* Add to Cart */}
            <button 
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="mt-8 w-full sm:w-2/3 bg-emerald-700 text-white font-semibold py-2.5 rounded-md hover:bg-emerald-800 transition-colors shadow-sm hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>

            {/* Details */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Details</h3>
              <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                <p><strong>Brand:</strong> {product.brand}</p>
                <p><strong>Color:</strong> {product.color}</p>
                <p><strong>Available Quantity:</strong> {product.quantity}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Reviews */}
      <ProductReviewSection />
    </div>
  )
}