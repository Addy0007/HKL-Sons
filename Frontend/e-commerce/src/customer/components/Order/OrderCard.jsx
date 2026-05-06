import React from "react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  // Guard: skip render if no items
  if (!order?.orderItems?.length) return null;

  // FIX: backend returns flat fields on item (productName, imageUrl, price)
  // NOT a nested item.product object — matches what OrderDetails.jsx uses
  const item = order.orderItems[0];

  const statusBadge = {
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    RETURNED: "bg-orange-100 text-orange-700",
    SHIPPED: "bg-blue-100 text-blue-700",
    OUT_FOR_DELIVERY: "bg-[#1F3D2B]/10 text-[#1F3D2B]",
    CONFIRMED: "bg-purple-100 text-purple-700",
    PLACED: "bg-[#EDE9E0] text-[#2C2C2C]",
    PENDING: "bg-yellow-100 text-yellow-700",
  };

  const badgeClass =
    statusBadge[order.orderStatus] || "bg-[#EDE9E0] text-[#2C2C2C]";

  const orderDate = order.orderDate
    ? new Date(order.orderDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div
      onClick={() => navigate(`/account/order/${order.id}`)}
      className="bg-[#F6F3EC] border border-[#C6A15B]/20 rounded-lg hover:shadow-lg transition-shadow duration-300 overflow-hidden mb-4 cursor-pointer"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-5">

        {/* LEFT: Image + Product info */}
        <div className="lg:col-span-6 flex items-center gap-4">
          <img
            src={item.imageUrl}
            alt={item.productName}
            className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-md border border-[#C6A15B]/20 flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#2C2C2C] text-base lg:text-lg mb-2 truncate">
              {item.productName}
            </h3>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#3D3D3D]">
              {item.size && (
                <span>
                  Size: <span className="font-medium">{item.size}</span>
                </span>
              )}
              <span>
                Qty: <span className="font-medium">{item.quantity}</span>
              </span>
              {order.orderItems.length > 1 && (
                <span className="text-[#555555]">
                  +{order.orderItems.length - 1} more item
                  {order.orderItems.length - 1 > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}
              >
                {order.orderStatus.replaceAll("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* MIDDLE: Price */}
        <div className="lg:col-span-2 flex items-center justify-start lg:justify-center">
          <div className="text-left lg:text-center">
            <p className="text-xs text-[#555555] mb-1">Total</p>
            <p className="text-2xl font-bold text-[#2C2C2C]">
              ₹{order.totalDiscountedPrice ?? order.totalPrice}
            </p>
          </div>
        </div>

        {/* RIGHT: Date + Track button */}
        <div className="lg:col-span-4 flex items-center">
          <div className="w-full">
            {orderDate && (
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-[#1F3D2B] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-[#3D3D3D]">
                  Ordered on:{" "}
                  <span className="font-semibold text-[#1F3D2B]">
                    {orderDate}
                  </span>
                </p>
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent card click firing too
                navigate(`/account/order/${order.id}`);
              }}
              className="mt-3 w-full lg:w-auto px-4 py-2 bg-[#1F3D2B] text-white text-sm font-medium rounded-md hover:bg-[#162d1f] transition-colors"
            >
              Track Order
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderCard;