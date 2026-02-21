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

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const colours = searchParams.get("color")
    ? searchParams.get("color").split(",")
    : null;
  const sizes = searchParams.get("size")
    ? searchParams.get("size").split(",")
    : null;
  const price = searchParams.get("price") || "0-99999";
  const [minPrice, maxPrice] = price.split("-").map(Number);
  const minDiscount = Number(searchParams.get("discount") || 0);
  const sort = searchParams.get("sort") || "price_low";
  const pageNumber = Number(searchParams.get("page") || 1);
  const stock = searchParams.get("stock") || null;

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

  const handleSortChange = (e) => {
    const p = new URLSearchParams(location.search);
    p.set("sort", e.target.value);
    p.set("page", "1");
    navigate(`${location.pathname}?${p.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const p = new URLSearchParams(location.search);
    p.set("page", newPage);
    navigate(`${location.pathname}?${p.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCategoryName = () => {
    if (!params.levelThree) return "All Products";
    return params.levelThree
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const totalProducts =
    products?.totalElements || products?.content?.length || 0;
  const totalPages = products?.totalPages || 0;

  const getPageNumbers = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (pageNumber > 3) pages.push("...");
    for (
      let i = Math.max(2, pageNumber - 1);
      i <= Math.min(totalPages - 1, pageNumber + 1);
      i++
    ) {
      pages.push(i);
    }
    if (pageNumber < totalPages - 2) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  return (
    <div>
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            {getCategoryName()}
          </h1>
          {!loading && (
            <p className="text-xs text-gray-500 mt-0.5">
              {totalProducts} item{totalProducts !== 1 ? "s" : ""}
              {totalPages > 1 && ` · Page ${pageNumber} of ${totalPages}`}
            </p>
          )}
        </div>

        {/* SORT */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={15} className="text-gray-400" />
          <select
            value={sort}
            onChange={handleSortChange}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
          >
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="discount">Best Discount</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
        </div>
      )}

      {/* ── ERROR ── */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* ── PRODUCT GRID ── */}
      {!loading && !error && (
        <>
          {products?.content?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
              {products.content.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-700 font-medium text-lg">
                No products found
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters
              </p>
            </div>
          )}

          {/* ── PAGINATION ── */}
          {products?.content?.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 mt-10 pb-6 select-none">
              <button
                onClick={() => handlePageChange(Math.max(1, pageNumber - 1))}
                disabled={pageNumber === 1}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                ←
              </button>

              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-gray-400 text-sm"
                  >
                    ···
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[36px] px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      pageNumber === page
                        ? "bg-gray-900 text-white border-gray-900"
                        : "border-gray-200 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, pageNumber + 1))
                }
                disabled={pageNumber === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}