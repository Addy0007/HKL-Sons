import { useState } from "react";
import Product from "./Product";
import ProductFilter from "../Filter/ProductFilter";
import { Menu, X } from "lucide-react";

export default function ProductList() {
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  return (
    // ✅ Added top padding to account for fixed navbar (adjust value based on your navbar height)
    <div className="pt-32 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* MOBILE FILTER TOGGLE */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
          >
            {showMobileFilter ? <X size={20} /> : <Menu size={20} />}
            <span className="font-medium">
              {showMobileFilter ? "Hide Filters" : "Show Filters"}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* LEFT SIDE FILTERS - Desktop always visible, Mobile conditional */}
          <div className={`
            md:col-span-3 
            ${showMobileFilter ? 'block' : 'hidden md:block'}
          `}>
            <ProductFilter />
          </div>

          {/* RIGHT SIDE PRODUCT GRID */}
          <div className="md:col-span-9">
            <Product />
          </div>

        </div>
      </div>
    </div>
  );
}