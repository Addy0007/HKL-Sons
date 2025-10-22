import React, { useState } from "react";
import OrderCard from "./OrderCard";

const orderStatus = [
  { label: "On The Way", value: "on_the_way" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Returned", value: "returned" },
];

const orders = [
  {
    title: "Men's Slim Fit Jeans",
    size: "M",
    color: "Black",
    price: 50,
    image: "https://via.placeholder.com/100x100?text=Jeans",
    expectedDelivery: "Mar 3, 2025",
    trackingId: "ORD12345",
    status: "On The Way",
  },
  {
    title: "Cotton Round Neck T-Shirt",
    size: "L",
    color: "Blue",
    price: 25,
    image: "https://via.placeholder.com/100x100?text=Tshirt",
    expectedDelivery: "Feb 28, 2025",
    trackingId: "ORD12346",
    status: "Delivered",
  },
  {
    title: "Running Shoes",
    size: "9",
    color: "White",
    price: 80,
    image: "https://via.placeholder.com/100x100?text=Shoes",
    expectedDelivery: "Mar 10, 2025",
    trackingId: "ORD12347",
    status: "Cancelled",
  },
  {
    title: "Wireless Headphones",
    size: "-",
    color: "Black",
    price: 120,
    image: "https://via.placeholder.com/100x100?text=Headphones",
    expectedDelivery: "Mar 6, 2025",
    trackingId: "ORD12348",
    status: "Delivered",
  },
];

const Order = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (value) => {
    setSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((f) => f !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-900 text-white rounded-lg font-medium"
          >
            <span>Filters</span>
            <svg
              className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Sidebar Filter - Extreme Left */}
        <aside
          className={`${
            showFilters ? 'block' : 'hidden'
          } lg:block lg:w-64 lg:min-h-screen bg-white border-r border-gray-200 lg:sticky lg:top-0 lg:h-screen overflow-y-auto`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              {selectedFilters.length > 0 && (
                <button
                  onClick={() => setSelectedFilters([])}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                  Order Status
                </h3>
                <div className="space-y-3">
                  {orderStatus.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={selectedFilters.includes(option.value)}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-6xl">
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                My Orders
              </h1>
              <p className="text-gray-600">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
              </p>
            </div>

            <div className="space-y-4">
              {orders.map((order, index) => (
                <OrderCard key={index} order={order} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Order;