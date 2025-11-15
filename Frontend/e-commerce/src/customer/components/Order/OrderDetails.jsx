import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, CheckCircle, Truck, Package } from "lucide-react";
import axios from "axios";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  const token = localStorage.getItem("jwt"); // your token storage

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5454/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrder(res.data);
      } catch (err) {
        console.log("Error fetching order:", err);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  if (!order) {
    return <div className="p-6 text-center">Loading order details...</div>;
  }

  // Dynamic status steps
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Order Details
        </h1>

        {/* Delivery Address */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className="mr-2" size={24} />
            Delivery Address
          </h2>

          <div className="border-2 border-blue-500 bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold text-gray-700">
              {order.shippingAddress.firstName}{" "}
              {order.shippingAddress.lastName}
            </p>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.streetAddress}
            </p>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.zipCode}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Phone: {order.shippingAddress.mobile}
            </p>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Order Status
          </h2>

          <div className="flex justify-between items-center relative">
            {orderSteps.map((step, index) => {
              const status =
                index < currentStepIndex
                  ? "completed"
                  : index === currentStepIndex
                  ? "active"
                  : "pending";

              return (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 relative"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10
                      ${
                        status === "completed"
                          ? "bg-green-500 text-white"
                          : status === "active"
                          ? "bg-blue-500 text-white"
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
                  <p className="text-xs mt-2 font-medium text-gray-700">
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

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Order Items
          </h2>

          <div className="space-y-4">
            {order.orderItems.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {product.productName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Size: {product.size}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Sold by: HKLSons</p>
                    <p className="text-lg font-bold text-gray-800 mt-2">
                      ₹{product.price}
                    </p>
                  </div>
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium">
                  Rate & Review
                </button>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-800">
                ₹{order.totalPrice}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Discount:</span>
              <span className="font-semibold text-green-600">
                -₹{order.discount}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span className="text-blue-600">
                ₹{order.totalDiscountedPrice}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
