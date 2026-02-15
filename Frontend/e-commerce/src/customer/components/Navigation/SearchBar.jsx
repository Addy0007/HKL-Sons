// src/customer/components/Navigation/SearchBar.jsx
// No longer depends on NavigationConfig or searchMapper

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../../../Config/apiConfig";

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced live search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/products/search?q=${encodeURIComponent(query.trim())}`);
        setSuggestions(data || []);
        setShowDropdown(true);
        setActiveIndex(-1);
      } catch (err) {
        console.error("Search error:", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Click a specific product → go to product detail page
  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  // Press Enter or "View all results"
  // → fetch category path from backend using the first result's category id
  // → navigate to /women/footwear/heels  (or whatever the path is)
  // → fallback to /search?q= if anything fails
  const handleSearch = async () => {
    if (!query.trim()) return;

    const firstResult = suggestions[0];
    const categoryId = firstResult?.category?.id;

    if (categoryId) {
      try {
        const { data: pathParts } = await api.get(`/api/categories/path/${categoryId}`);
        // pathParts = ["women", "footwear", "heels"]
        if (pathParts && pathParts.length === 3) {
          navigate(`/${pathParts[0]}/${pathParts[1]}/${pathParts[2]}`);
          setQuery("");
          setSuggestions([]);
          setShowDropdown(false);
          return;
        }
      } catch (err) {
        console.error("Category path error:", err);
      }
    }

    // Fallback
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === "Enter") handleSearch();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleProductClick(suggestions[activeIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative hidden lg:block ml-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          className="border border-gray-300 rounded-full px-4 py-1.5 w-72 text-sm focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 pr-16 transition"
        />

        {query && (
          <button onClick={handleClear} className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}

        <button onClick={handleSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-700">
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <MagnifyingGlassIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {suggestions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No products found for "{query}"
            </div>
          ) : (
            <>
              <div className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Products
              </div>

              <ul>
                {suggestions.map((product, index) => (
                  <li key={product.id}>
                    <button
                      onClick={() => handleProductClick(product)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition ${
                        index === activeIndex ? "bg-teal-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {product.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.brand}
                          {product.category?.name && (
                            <span className="ml-1 text-gray-400">· {product.category.name}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <div className="text-sm font-bold text-gray-900">
                          ₹{product.discountedPrice?.toLocaleString() || product.price?.toLocaleString()}
                        </div>
                        {product.discountPercent > 0 && (
                          <div className="text-xs text-green-600">{product.discountPercent}% off</div>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleSearch}
                className="w-full px-4 py-2.5 text-sm text-teal-700 font-medium hover:bg-teal-50 border-t border-gray-100 text-center transition"
              >
                View all results for "{query}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}