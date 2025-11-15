import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import api from "../../../Config/apiConfig"

const ORDER_STATUS_OPTIONS = [
  { label: "Pending", value: "PENDING" },
  { label: "Placed", value: "PLACED" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Returned", value: "RETURNED" },
];

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch User Orders
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/orders/user");
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
    setLoading(false);
  };

  // 🔥 Apply Filters
  const filteredOrders =
    selectedFilters.length === 0
      ? orders
      : orders.filter((order) => selectedFilters.includes(order.orderStatus));

  // 🔥 Toggle checkbox filters
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
        
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-900 text-white rounded-lg font-medium"
          >
            <span>Filters</span>
            <svg
              className={`w-5 h-5 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside
          className={`${
            showFilters ? "block" : "hidden"
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

            {/* Status Filters */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                  Order Status
                </h3>

                <div className="space-y-3">
                  {ORDER_STATUS_OPTIONS.map((option) => (
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

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-6xl">

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                My Orders
              </h1>
              <p className="text-gray-600">
                {filteredOrders.length}{" "}
                {filteredOrders.length === 1 ? "order" : "orders"} found
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-10 text-gray-500 text-lg">
                Loading orders...
              </div>
            )}

            {/* No Orders */}
            {!loading && filteredOrders.length === 0 && (
              <div className="text-center py-10 text-gray-500 text-lg">
                No orders found.
              </div>
            )}

            {/* Render Orders */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Order;
