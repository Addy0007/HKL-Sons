// src/customer/components/Navigation/MobileSearchBar.jsx

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../../../Config/apiConfig";

export default function MobileSearchBar({ onSearch }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);

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
      } catch (err) {
        console.error("Search error:", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    if (onSearch) onSearch();
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    const firstResult = suggestions[0];
    const categoryId = firstResult?.category?.id;

    if (categoryId) {
      try {
        const { data: pathParts } = await api.get(`/api/categories/path/${categoryId}`);
        if (pathParts && pathParts.length === 3) {
          navigate(`/${pathParts[0]}/${pathParts[1]}/${pathParts[2]}`);
          setQuery("");
          setSuggestions([]);
          setShowDropdown(false);
          if (onSearch) onSearch();
          return;
        }
      } catch (err) {
        console.error("Category path error:", err);
      }
    }

    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    if (onSearch) onSearch();
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          autoFocus
        />

        {query && (
          <button
            onClick={() => { setQuery(""); setSuggestions([]); setShowDropdown(false); }}
            className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}

        <button onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-700">
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
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden max-h-80 overflow-y-auto">
          {suggestions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No products found for "{query}"
            </div>
          ) : (
            <>
              <ul>
                {suggestions.map((product) => (
                  <li key={product.id}>
                    <button
                      onClick={() => handleProductClick(product)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{product.title}</div>
                        <div className="text-xs text-gray-500">{product.brand}</div>
                      </div>

                      <div className="flex-shrink-0 text-sm font-bold text-gray-900">
                        ₹{product.discountedPrice?.toLocaleString() || product.price?.toLocaleString()}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleSearch}
                className="w-full px-4 py-2.5 text-sm text-teal-700 font-medium hover:bg-teal-50 border-t border-gray-100 text-center"
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