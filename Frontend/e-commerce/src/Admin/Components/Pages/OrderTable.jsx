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

// NEXT STATUS logic
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
      return []; // Delivered or Cancelled
  }
};

const OrderTable = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.adminOrder);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  // STATUS UPDATE HANDLER
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
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Order ID</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Update</th>
              <th className="p-3">Delete</th>
            </tr>
          </thead>

          <tbody>
            {orders?.map((order) => {
              const item = order.orderItems?.[0] || {};
              const product = item.product || {};

              const image = product.imageUrl || "/no-image.png";
              const title = product.title || "No Title";

              return (
                <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                  {/* IMAGE */}
                  <td className="p-3">
                    <img
                      src={image}
                      alt="product"
                      className="h-12 w-12 rounded object-cover bg-gray-200"
                    />
                  </td>

                  {/* TITLE */}
                  <td className="p-3 max-w-[200px]">
                    <div className="font-medium">
                      {title.slice(0, 40)}
                      {title.length > 40 ? "..." : ""}
                    </div>
                  </td>

                  {/* ORDER-ID */}
                  <td className="p-3">{order.orderId}</td>

                  {/* PRICE */}
                  <td className="p-3 font-semibold">
                    ₹{order.totalPrice?.toLocaleString() || 0}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-white rounded-full text-xs ${
                        statusColors[order.orderStatus] || "bg-gray-500"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* DROPDOWN UPDATE STATUS */}
                  <td className="p-3">
                    {getNextStatuses(order.orderStatus).length === 0 ? (
                      <span className="text-gray-400">No Action</span>
                    ) : (
                      <select
                        onChange={(e) => handleStatusChange(order, e.target.value)}
                        className="border px-2 py-1 rounded"
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
                      onClick={() => dispatch(deleteOrder(order.id))}
                      className="border border-red-400 text-red-500 px-3 py-1 rounded hover:bg-red-50 transition"
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
    </div>
  );
};

export default OrderTable;
