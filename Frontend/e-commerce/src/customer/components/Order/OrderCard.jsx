import React from "react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ order }) => {
  const navigate=useNavigate();
  return (
    <div onClick={()=>navigate(`/account/order/${5}`)} className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300 overflow-hidden mb-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-5">
        {/* Grid 1: Image and Product Info */}
        <div className="lg:col-span-6 flex items-center gap-4">
          <img
            src={order.image}
            alt={order.title}
            className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-md border border-gray-200 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base lg:text-lg mb-2 truncate">
              {order.title}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
              <span>Size: <span className="font-medium">{order.size}</span></span>
              <span>Color: <span className="font-medium">{order.color}</span></span>
            </div>
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : order.status === "Returned"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Grid 2: Price */}
        <div className="lg:col-span-2 flex items-center justify-start lg:justify-center">
          <div className="text-left lg:text-center">
            <p className="text-xs text-gray-500 mb-1 lg:mb-2">Price</p>
            <p className="text-2xl font-bold text-gray-900">${order.price}</p>
          </div>
        </div>

        {/* Grid 3: Delivery Info */}
        <div className="lg:col-span-4 flex items-center">
          <div className="w-full">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-700">
                Expected: <span className="font-semibold text-emerald-700">{order.expectedDelivery}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              <p className="text-xs text-gray-600">
                Tracking: <span className="font-mono font-medium">#{order.trackingId}</span>
              </p>
            </div>
            <button className="mt-3 w-full lg:w-auto px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
              Track Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;