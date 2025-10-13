import React, { useState } from 'react'
import { Star } from 'lucide-react'
import ProductReviewSection from './ProductReviewSection'

const product = {
  name: 'Basic Tee 6-Pack',
  price: '$192',
  href: '#',
  breadcrumbs: [
    { id: 1, name: 'Men', href: '#' },
    { id: 2, name: 'Clothing', href: '#' },
  ],
  images: [
    {
      src: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
      alt: 'Two each of gray, white, and black shirts laying flat.',
    },
    {
      src: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg',
      alt: 'Model wearing plain black basic tee.',
    },
    {
      src: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg',
      alt: 'Model wearing plain gray basic tee.',
    },
    {
      src: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-featured-product-shot.jpg',
      alt: 'Model wearing plain white basic tee.',
    },
  ],
  sizes: [
    { name: 'XS', inStock: true },
    { name: 'S', inStock: true },
    { name: 'M', inStock: true },
    { name: 'L', inStock: true },
  ],
  description:
    'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
  highlights: [
    'Hand cut and sewn locally',
    'Dyed with our proprietary colors',
    'Pre-washed & pre-shrunk',
    'Ultra-soft 100% cotton',
  ],
  details:
    'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('S')

  const handleAddToCart = (e) => {
    e.preventDefault()
    alert(`Added to cart: ${product.name}, Size: ${selectedSize}`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-8 py-3">
          <ol role="list" className="flex items-center space-x-2 text-sm">
            {product.breadcrumbs.map((breadcrumb, idx) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a
                    href={breadcrumb.href}
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    {breadcrumb.name}
                  </a>
                  {idx < product.breadcrumbs.length - 1 && (
                    <svg
                      className="h-4 w-4 text-gray-400 mx-2"
                      fill="currentColor"
                      viewBox="0 0 16 20"
                    >
                      <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                    </svg>
                  )}
                </div>
              </li>
            ))}
            <li className="text-gray-900 font-medium">{product.name}</li>
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
                src={product.images[selectedImage].src}
                alt={product.images[selectedImage].alt}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
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
              Basic Tee 6-Pack
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Ultra-soft, breathable tees for everyday comfort.
            </p>

            {/* Price + Rating */}
            <div className="mt-5 flex flex-wrap items-center gap-5 text-lg text-gray-900">
              <p className="font-semibold">Rs 199</p>
              <p className="opacity-50 line-through text-base">Rs 211</p>
              <p className="text-green-600 font-medium">5% Off</p>
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
              {product.description}
            </p>

            {/* Highlights */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Highlights</h3>
              <ul className="space-y-2">
                {product.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">✓</span>
                    <span className="text-gray-700 text-sm">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Size Selection */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Select Size</h3>
                <a
                  href="#"
                  className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
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
                        : size.inStock
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
                      disabled={!size.inStock}
                      className="hidden"
                    />
                    {size.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="mt-8 w-full sm:w-2/3 bg-emerald-700 text-white font-semibold py-2.5 rounded-md hover:bg-emerald-800 transition-colors shadow-sm hover:shadow-md"
            >
              Add to Cart
            </button>

            {/* Details */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Details</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.details}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Reviews */}
      <ProductReviewSection />
    </div>
  )
}
