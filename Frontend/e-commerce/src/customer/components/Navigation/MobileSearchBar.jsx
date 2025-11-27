// src/components/Navigation/MobileSearchBar.jsx

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { findRouteFromSearch } from "./searchMapper";

export default function MobileSearchBar({ onSearch }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;

    const route = findRouteFromSearch(query.trim());

    if (route) {
      navigate(route);
    } else {
      navigate(`/search?q=${query.trim()}`);
    }

    setQuery("");
    if (onSearch) onSearch();
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
      />
      <button
        onClick={handleSearch}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-700"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </div>
  );
}