import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, CheckCircle, Truck, Package } from "lucide-react";
import api from "../../../Config/apiConfig";
import { optimizeImage } from "../../../utils/optimizeImage";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/api/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.log("Error fetching order:", err);
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F3EC]">
        <div className="text-center text-[#3D3D3D] text-sm">
          Loading order details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F3EC]">
        <div className="text-center text-red-600 text-sm px-4">{error}</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F3EC]">
        <div className="text-center text-[#3D3D3D] text-sm px-4">
          No order found.
        </div>
      </div>
    );
  }

  // ---- helpers / derived values ----
  const orderSteps = [
    { label: "Placed", key: "PLACED" },
    { label: "Confirmed", key: "CONFIRMED" },
    { label: "Shipped", key: "SHIPPED" },
    { label: "Out for Delivery", key: "OUT_FOR_DELIVERY" },
    { label: "Delivered", key: "DELIVERED" },
  ];

  const currentStepIndex = orderSteps.findIndex(
    (step) => step.key === order.orderStatus
  );

  const statusBadge = {
    DELIVERED: "bg-green-50 text-green-700 border border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border border-red-200",
    RETURNED: "bg-orange-50 text-orange-700 border border-orange-200",
    SHIPPED: "bg-blue-50 text-blue-700 border border-blue-200",
    OUT_FOR_DELIVERY: "bg-[#1F3D2B]/10 text-[#1F3D2B] border border-[#1F3D2B]/20",
    CONFIRMED: "bg-purple-50 text-purple-700 border border-purple-200",
    PLACED: "bg-[#EDE9E0] text-[#2C2C2C] border border-[#C6A15B]/20",
    PENDING: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  };

  const statusClass =
    statusBadge[order.orderStatus] ||
    "bg-[#EDE9E0] text-[#2C2C2C] border border-[#C6A15B]/20";

  const orderDate = order.orderDate
    ? new Date(order.orderDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  // ---- UI ----
  return (
    <div className="min-h-screen bg-[#F6F3EC] px-3 py-4 sm:px-6 sm:py-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">

        {/* Page Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold text-[#2C2C2C]">
            Order Details
          </h1>
        </div>

        {/* Order Summary Header */}
        <div className="bg-[#F6F3EC] rounded-xl shadow-sm border border-[#C6A15B]/20 p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#555555]">
                Order ID
              </p>
              <p className="text-sm sm:text-base font-semibold text-[#2C2C2C] break-all">
                #{order.id}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:items-center">
              {orderDate && (
                <div className="text-xs sm:text-sm text-[#3D3D3D]">
                  <span className="font-medium text-[#2C2C2C]">
                    Ordered on:
                  </span>{" "}
                  {orderDate}
                </div>
              )}

              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusClass}`}
              >
                {order.orderStatus.replaceAll("_", " ")}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap text-xs sm:text-sm text-[#3D3D3D] gap-x-6 gap-y-1">
            <p>
              <span className="font-medium text-[#2C2C2C]">Total Items:</span>{" "}
              {order.orderItems?.length || 0}
            </p>
            <p>
              <span className="font-medium text-[#2C2C2C]">Amount:</span> ₹
              {order.totalDiscountedPrice ?? order.totalPrice}
            </p>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-[#F6F3EC] rounded-xl shadow-sm border border-[#C6A15B]/20 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-md bg-[#1F3D2B]/10 text-[#1F3D2B]">
              <MapPin size={18} />
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-[#2C2C2C]">
              Delivery Address
            </h2>
          </div>

          <div className="border border-[#1F3D2B]/20 bg-[#1F3D2B]/5 p-3 sm:p-4 rounded-lg text-xs sm:text-sm">
            <p className="font-semibold text-[#2C2C2C] mb-0.5">
              {order.shippingAddress.firstName}{" "}
              {order.shippingAddress.lastName}
            </p>
            <p className="text-[#3D3D3D]">
              {order.shippingAddress.streetAddress}
            </p>
            <p className="text-[#3D3D3D]">
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.zipCode}
            </p>
            <p className="text-[#3D3D3D] mt-1.5">
              <span className="font-medium text-[#2C2C2C]">Phone:</span>{" "}
              {order.shippingAddress.mobile}
            </p>
          </div>
        </div>

        {/* Order Status – Mobile (vertical list) */}
        <div className="bg-[#F6F3EC] rounded-xl shadow-sm border border-[#C6A15B]/20 p-4 sm:p-5 sm:hidden">
          <h2 className="text-sm font-semibold text-[#2C2C2C] mb-4">
            Order Status
          </h2>

          <div className="space-y-3">
            {orderSteps.map((step, index) => {
              const status =
                index < currentStepIndex
                  ? "completed"
                  : index === currentStepIndex
                  ? "active"
                  : "pending";

              return (
                <div
                  key={step.key}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs
                        ${
                          status === "completed"
                            ? "bg-green-500"
                            : status === "active"
                            ? "bg-[#1F3D2B]"
                            : "bg-gray-300 text-gray-600"
                        }`}
                    >
                      {status === "completed" ? (
                        <CheckCircle size={18} />
                      ) : status === "active" ? (
                        <Truck size={18} />
                      ) : (
                        <Package size={18} />
                      )}
                    </div>
                    <span className="text-xs font-medium text-[#2C2C2C]">
                      {step.label}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] uppercase tracking-wide ${
                      status === "completed"
                        ? "text-green-600"
                        : status === "active"
                        ? "text-[#1F3D2B]"
                        : "text-[#555555]"
                    }`}
                  >
                    {status === "completed"
                      ? "Done"
                      : status === "active"
                      ? "In Progress"
                      : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status – Desktop/Tablet (horizontal tracker) */}
        <div className="hidden sm:block bg-[#F6F3EC] rounded-xl shadow-sm border border-[#C6A15B]/20 p-5">
          <h2 className="text-sm sm:text-base font-semibold text-[#2C2C2C] mb-6">
            Order Status
          </h2>

          <div className="overflow-x-auto">
            <div className="flex justify-between items-center min-w-[480px] relative">
              {orderSteps.map((step, index) => {
                const status =
                  index < currentStepIndex
                    ? "completed"
                    : index === currentStepIndex
                    ? "active"
                    : "pending";

                return (
                  <div
                    key={step.key}
                    className="flex flex-col items-center flex-1 relative"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10
                        ${
                          status === "completed"
                            ? "bg-green-500 text-white"
                            : status === "active"
                            ? "bg-[#1F3D2B] text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                    >
                      {status === "completed" ? (
                        <CheckCircle size={20} />
                      ) : status === "active" ? (
                        <Truck size={20} />
                      ) : (
                        <Package size={20} />
                      )}
                    </div>
                    <p className="text-xs mt-2 font-medium text-[#2C2C2C]">
                      {step.label}
                    </p>
                    {index < orderSteps.length - 1 && (
                      <div
                        className={`absolute top-5 left-1/2 w-full h-1 
                          ${
                            index < currentStepIndex
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        style={{ transform: "translateY(-50%)" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-[#F6F3EC] rounded-xl shadow-sm border border-[#C6A15B]/20 p-4 sm:p-5">
          <h2 className="text-sm sm:text-base font-semibold text-[#2C2C2C] mb-4 sm:mb-5">
            Order Items
          </h2>

          <div className="divide-y divide-[#C6A15B]/10">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
              >
                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                  <img
                    src={optimizeImage(item.imageUrl, 200)}
                    alt={item.productName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-[#C6A15B]/20"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-[#2C2C2C] line-clamp-2">
                      {item.productName}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#3D3D3D]">
                      <span>
                        Size:{" "}
                        <span className="font-medium">{item.size}</span>
                      </span>
                      <span>
                        Qty:{" "}
                        <span className="font-medium">{item.quantity}</span>
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#555555]">
                      Sold by: <span className="font-medium">HKLSons</span>
                    </p>
                    <p className="mt-1.5 text-sm sm:text-base font-bold text-[#2C2C2C]">
                      ₹{item.price}
                    </p>
                  </div>
                </div>

                <div className="sm:self-center sm:text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${item.productId}`);
                    }}
                    className="w-full sm:w-auto text-xs sm:text-sm mt-1 sm:mt-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#1F3D2B] hover:bg-[#162d1f] text-white font-medium"
                  >
                    Rate &amp; Review
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="mt-5 pt-4 border-t border-[#C6A15B]/20">
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex justify-between items-center">
                <span className="text-[#3D3D3D]">Subtotal</span>
                <span className="font-semibold text-[#2C2C2C]">
                  ₹{order.totalPrice}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#3D3D3D]">Discount</span>
                <span className="font-semibold text-green-600">
                  -₹{order.discount}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-[#C6A15B]/20 text-sm sm:text-lg font-semibold">
                <span className="text-[#2C2C2C]">Total</span>
                <span className="text-[#1F3D2B]">
                  ₹{order.totalDiscountedPrice}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;