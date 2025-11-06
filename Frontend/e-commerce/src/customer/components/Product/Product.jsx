"use client";

import { useEffect, useMemo } from "react";
import { findProducts } from "../../../State/Product/Action";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { ArrowUpDown } from "lucide-react";

export default function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const { products, loading, error } = useSelector((state) => state.product);

  // ✅ Extract filters from URL
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const colours = searchParams.get("color") ? searchParams.get("color").split(",") : null;
  const sizes = searchParams.get("size") ? searchParams.get("size").split(",") : null;

  const price = searchParams.get("price") || "0-99999";
  const [minPrice, maxPrice] = price.split("-").map(Number);

  const minDiscount = Number(searchParams.get("discount") || 0);
  const sort = searchParams.get("sort") || "price_low";
  const pageNumber = Number(searchParams.get("page") || 1);
  const stock = searchParams.get("stock") || null;

  // ✅ Fetch products whenever URL changes
  useEffect(() => {
    const reqData = {
      category: params.levelThree,
      colors: colours,
      sizes: sizes,
      minPrice,
      maxPrice,
      minDiscount,
      sort,
      pageNumber: pageNumber - 1,
      pageSize: 12,
      stock,
    };

    dispatch(findProducts(reqData));
  }, [location.search, params.levelThree, dispatch]);

  // Handle sort change
  const handleSortChange = (e) => {
    const params = new URLSearchParams(location.search);
    params.set("sort", e.target.value);
    params.set("page", "1");
    navigate(`${location.pathname}?${params.toString()}`);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(location.search);
    params.set("page", newPage);
    navigate(`${location.pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryName = () => {
    if (!params.levelThree) return "Products";
    return params.levelThree.charAt(0).toUpperCase() + params.levelThree.slice(1);
  };

  const totalProducts = products?.totalElements || products?.content?.length || 0;
  const totalPages = products?.totalPages || 0;

  // 🔍 DEBUG: Log to see what data we're getting
  useEffect(() => {
    console.log("📦 Products data:", products);
    console.log("📄 Total Pages:", totalPages);
    console.log("🔢 Total Products:", totalProducts);
    console.log("📍 Current Page:", pageNumber);
  }, [products, totalPages, totalProducts, pageNumber]);

  // Generate smart page numbers (with ellipsis for many pages)
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Add ellipsis if current page is far from start
    if (pageNumber > 3) {
      pages.push('...');
    }
    
    // Show pages around current page
    for (let i = Math.max(2, pageNumber - 1); i <= Math.min(totalPages - 1, pageNumber + 1); i++) {
      pages.push(i);
    }
    
    // Add ellipsis if current page is far from end
    if (pageNumber < totalPages - 2) {
      pages.push('...');
    }
    
    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="bg-white min-h-screen">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getCategoryName()}</h1>
          {!loading && (
            <p className="text-sm text-gray-600 mt-1">
              {totalProducts} Product{totalProducts !== 1 ? "s" : ""} Found
              {totalPages > 1 && ` • Page ${pageNumber} of ${totalPages}`}
            </p>
          )}
        </div>

        {/* SORT DROPDOWN */}
        <div className="flex items-center space-x-3">
          <ArrowUpDown size={18} className="text-gray-600" />
          <select
            value={sort}
            onChange={handleSortChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="discount">Discount</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.content?.length > 0 ? (
          products.content.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          !loading && (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">No products found.</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
            </div>
          )
        )}
      </div>

      {/* ✅ IMPROVED PAGINATION WITH ELLIPSIS */}
      {products?.content?.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 pb-10 select-none">

          {/* LEFT ARROW */}
          <button
            onClick={() => handlePageChange(Math.max(1, pageNumber - 1))}
            disabled={pageNumber === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            aria-label="Previous page"
          >
            ←
          </button>

          {/* PAGE NUMBERS WITH SMART ELLIPSIS */}
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                  ...
                </span>
              );
            }
            
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`min-w-[40px] px-3 py-2 border rounded-lg transition-colors ${
                  pageNumber === page
                    ? "bg-blue-600 text-white border-blue-600 font-semibold"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={pageNumber === page ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}

          {/* RIGHT ARROW */}
          <button
            onClick={() => handlePageChange(Math.min(totalPages, pageNumber + 1))}
            disabled={pageNumber === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            aria-label="Next page"
          >
            →
          </button>

        </div>
      )}
    </div>
  );
}