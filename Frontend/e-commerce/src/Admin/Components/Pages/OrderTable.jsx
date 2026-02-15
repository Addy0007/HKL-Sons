import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllOrders,
  confirmOrder,
  shipOrder,
  deliverOrder,
  cancelOrder,
  deleteOrder,
} from "../../../State/AdminOrder/Action";

const statusColors = {
  PENDING: "bg-gray-500",
  CONFIRMED: "bg-blue-600",
  SHIPPED: "bg-indigo-600",
  DELIVERED: "bg-green-600",
  CANCELLED: "bg-red-600",
  PLACED: "bg-teal-600",
};

const getNextStatuses = (current) => {
  switch (current) {
    case "PENDING":
      return ["CONFIRMED", "CANCELLED"];
    case "PLACED":
      return ["CONFIRMED", "CANCELLED"];
    case "CONFIRMED":
      return ["SHIPPED", "CANCELLED"];
    case "SHIPPED":
      return ["DELIVERED"];
    default:
      return [];
  }
};

const OrderTable = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.adminOrder);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const handleStatusChange = (order, nextStatus) => {
    if (!nextStatus) return;

    switch (nextStatus) {
      case "CONFIRMED":
        dispatch(confirmOrder(order.id));
        break;
      case "SHIPPED":
        dispatch(shipOrder(order.id));
        break;
      case "DELIVERED":
        dispatch(deliverOrder(order.id));
        break;
      case "CANCELLED":
        dispatch(cancelOrder(order.id));
        break;
      default:
        break;
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-lg font-semibold">Loading orders...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Orders</h2>

      <div className="w-full overflow-hidden rounded-xl border shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Update</th>
              <th className="p-3">Delete</th>
            </tr>
          </thead>

          <tbody>
            {orders?.map((order) => {
              const itemCount = order.orderItems?.length || 0;
              const customerName = order.shippingAddress 
                ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                : "N/A";

              return (
                <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                  {/* ORDER ID */}
                  <td className="p-3">
                    <div className="font-semibold text-blue-600">
                      {order.orderId || `#${order.id}`}
                    </div>
                  </td>

                  {/* CUSTOMER */}
                  <td className="p-3">
                    <div className="font-medium text-gray-900">{customerName}</div>
                    <div className="text-xs text-gray-500">
                      {order.shippingAddress?.mobile}
                    </div>
                  </td>

                  {/* ITEMS - EXPANDABLE */}
                  <td className="p-3">
                    <details className="cursor-pointer">
                      <summary className="font-semibold text-emerald-600 hover:text-emerald-700">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </summary>
                      <div className="mt-2 space-y-2 pl-2 border-l-2 border-gray-200">
                        {order.orderItems?.map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <img
                              src={item.product?.imageUrl || "/no-image.png"}
                              alt="product"
                              className="h-10 w-10 rounded object-cover bg-gray-200 flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-medium text-gray-900 truncate">
                                {item.product?.title || "No Title"}
                              </div>
                              <div className="text-xs text-gray-500">
                                Size: {item.size} | Qty: {item.quantity}
                              </div>
                              <div className="text-xs font-semibold text-gray-700">
                                ₹{item.price?.toLocaleString() || 0}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  </td>

                  {/* TOTAL PRICE */}
                  <td className="p-3">
                    <div className="font-bold text-lg text-gray-900">
                      ₹{order.totalDiscountedPrice?.toLocaleString() || order.totalPrice?.toLocaleString() || 0}
                    </div>
                    {order.discount > 0 && (
                      <div className="text-xs text-green-600">
                        Saved ₹{order.discount?.toLocaleString()}
                      </div>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-white rounded-full text-xs font-semibold whitespace-nowrap ${
                        statusColors[order.orderStatus] || "bg-gray-500"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="p-3">
                    <div className="text-sm text-gray-600">
                      {order.orderDate 
                        ? new Date(order.orderDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </div>
                  </td>

                  {/* UPDATE STATUS */}
                  <td className="p-3">
                    {getNextStatuses(order.orderStatus).length === 0 ? (
                      <span className="text-gray-400 text-xs">No Action</span>
                    ) : (
                      <select
                        onChange={(e) => handleStatusChange(order, e.target.value)}
                        className="border px-2 py-1 rounded text-sm"
                      >
                        <option value="">Update...</option>
                        {getNextStatuses(order.orderStatus).map((next) => (
                          <option key={next} value={next}>
                            {next}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>

                  {/* DELETE */}
                  <td className="p-3">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete order ${order.orderId || order.id}?`)) {
                          dispatch(deleteOrder(order.id));
                        }
                      }}
                      className="border border-red-400 text-red-500 px-3 py-1 rounded hover:bg-red-50 transition text-xs font-medium"
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {orders?.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No orders found
        </div>
      )}
    </div>
  );
};

export default OrderTable;