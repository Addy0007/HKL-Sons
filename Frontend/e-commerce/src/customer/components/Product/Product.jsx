"use client";

import { useEffect } from "react";
import { findProducts } from "../../../State/Product/Action";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import ProductCard from "./ProductCard";

export default function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const { products, loading, error } = useSelector((state) => state.product);

  // Read filters from URL
  const searchParams = new URLSearchParams(location.search);

  const colourValue = searchParams.get("color")?.split(",") || [];
  const sizeValue = searchParams.get("size")?.split(",") || [];
  const priceValue = searchParams.get("price") || "0-99999";
  const [minPrice, maxPrice] = priceValue.split("-").map(Number);
  const discountValue = Number(searchParams.get("discount") || 0);
  const sortValue = searchParams.get("sort") || "price_low";
  const pageNumber = Number(searchParams.get("page") || 1);
  const stock = searchParams.get("stock") || "in_stock";

  // ✅ Fetch products on filter change
  useEffect(() => {
    const reqData = {
      category: params.levelThree,   // URL structure: /men/clothing/shirts
      colors: colourValue,
      sizes: sizeValue,
      minPrice,
      maxPrice,
      minDiscount: discountValue,
      sort: sortValue,
      pageNumber: pageNumber - 1,
      pageSize: 12,
      stock,
    };

    dispatch(findProducts(reqData));
  }, [
    params.levelThree,
    colourValue,
    sizeValue,
    minPrice,
    maxPrice,
    discountValue,
    sortValue,
    pageNumber,
    stock,
  ]);

  return (
    <div className="bg-white min-h-screen pt-24 px-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* LOADING */}
      {loading && <p className="text-gray-700 text-center">Loading products...</p>}

      {/* ERROR */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {!loading && products?.content?.length > 0 ? (
          products.content.map((item) => (
            <ProductCard
              key={item.id}
              imageUrl={item.imageUrl}
              brand={item.brand}
              title={item.title}
              price={item.price}
              discountedPrice={item.discountedPrice}
              discountPercent={item.discountPercent}
              onClick={() => navigate(`/product/${item.id}`)}
            />
          ))
        ) : (
          !loading && <p className="text-gray-500 col-span-full text-center">No products found.</p>
        )}
      </div>

      {/* PAGINATION */}
      {products?.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            disabled={pageNumber <= 1}
            onClick={() => navigate({ search: `?page=${pageNumber - 1}` })}
            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-40"
          >
            ← Prev
          </button>

          <span className="text-gray-700 font-semibold">
            Page {pageNumber} of {products.totalPages}
          </span>

          <button
            disabled={pageNumber >= products.totalPages}
            onClick={() => navigate({ search: `?page=${pageNumber + 1}` })}
            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
