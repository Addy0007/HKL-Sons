// src/components/Navigation/SearchBar.jsx

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { findRouteFromSearch } from "./searchMapper";
export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");


const handleSearch = () => {
  if (!query.trim()) return;

  const route = findRouteFromSearch(query.trim());

  if (route) {
    navigate(route); // redirect to category page
  } else {
    navigate(`/search?q=${query.trim()}`); // fallback: normal search page
  }

  setQuery("");
};


  return (
    <div className="relative hidden lg:block ml-6">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="border rounded-full px-4 py-1.5 w-64 text-sm focus:outline-none focus:border-teal-600"
      />
      <button
        onClick={handleSearch}
        className="absolute right-2 top-1.5 text-gray-500 hover:text-teal-700"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
