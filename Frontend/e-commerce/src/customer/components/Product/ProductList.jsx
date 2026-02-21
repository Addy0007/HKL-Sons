import { useState } from "react";
import Product from "./Product";
import ProductFilter from "../Filter/ProductFilter";
import { SlidersHorizontal, X } from "lucide-react";

export default function ProductList() {
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── MOBILE FILTER DRAWER ── */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilter(false)}
          />
          <div className="relative z-10 w-[80vw] max-w-xs bg-white h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
              <span className="font-semibold text-gray-900">Filters</span>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4">
              <ProductFilter />
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE FILTER TRIGGER BAR ── */}
      <div className="md:hidden bg-white border-b px-4 py-2.5 flex items-center sticky top-[64px] z-30 shadow-sm">
        <button
          onClick={() => setShowMobileFilter(true)}
          className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>
      </div>

      {/* ── MAIN LAYOUT: edge-to-edge, no max-width constraints ── */}
      <div className="flex">

        {/* SIDEBAR — flush left, full height, sticky */}
        <aside className="hidden md:block w-52 lg:w-60 flex-shrink-0 bg-white border-r border-gray-200 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
          <div className="px-5 py-4">
            <ProductFilter />
          </div>
        </aside>

        {/* PRODUCT AREA — fills all remaining width */}
        <main className="flex-1 min-w-0 px-4 lg:px-6 py-4">
          <Product />
        </main>

      </div>
    </div>
  );
}