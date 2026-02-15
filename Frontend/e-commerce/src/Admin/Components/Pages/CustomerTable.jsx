import React, { useEffect, useState } from "react";
import { Search, Mail, Phone, X, Package } from "lucide-react";
import api from "../../../Config/apiConfig";

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/admin/customers");

      const uniqueCustomers = data.reduce((acc, customer) => {
        const key = customer.mobile || customer.email;
        if (!acc.some((c) => (c.mobile || c.email) === key)) {
          acc.push(customer);
        }
        return acc;
      }, []);

      setCustomers(uniqueCustomers);
      setFilteredCustomers(uniqueCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobile?.includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  // ✅ FIXED: Fetch all orders and filter by customer mobile or email
  const handleViewDetails = async (customer) => {
    setSelectedCustomer(customer);
    setLoadingOrders(true);

    try {
      // Using the same working endpoint as OrderTable
      const { data } = await api.get("/api/admin/orders");

      // Filter orders that belong to this customer
      const filtered = (Array.isArray(data) ? data : data.orders || []).filter(
        (order) =>
          order.shippingAddress?.mobile === customer.mobile ||
          order.user?.email === customer.email ||
          order.user?.id === customer.id
      );

      setCustomerOrders(filtered);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setCustomerOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setCustomerOrders([]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total: {filteredCustomers.length} customers
          </p>
        </div>

        {/* Search */}
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  {searchTerm ? "No customers found" : "No customers yet"}
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition">
                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                        {customer.firstName?.charAt(0)}
                        {customer.lastName?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </div>
                        <div className="text-xs text-gray-500">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail size={14} className="text-gray-400" />
                        {customer.email}
                      </div>
                      {customer.mobile && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone size={14} className="text-gray-400" />
                          {customer.mobile}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatDate(customer.createdAt)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleViewDetails(customer)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Package size={16} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Customer Details</h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">

              {/* Customer Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-2xl">
                    {selectedCustomer.firstName?.charAt(0)}
                    {selectedCustomer.lastName?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-500" />
                        <span className="text-gray-700">{selectedCustomer.email}</span>
                      </div>
                      {selectedCustomer.mobile && (
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-500" />
                          <span className="text-gray-700">{selectedCustomer.mobile}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Customer ID:</span>
                        <span className="font-semibold text-gray-900">{selectedCustomer.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Joined:</span>
                        <span className="font-semibold text-gray-900">
                          {formatDate(selectedCustomer.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={20} />
                  Order History
                  {!loadingOrders && (
                    <span className="text-sm font-normal text-gray-500">
                      ({customerOrders.length} orders)
                    </span>
                  )}
                </h4>

                {loadingOrders ? (
                  <div className="text-center py-8 text-gray-500">Loading orders...</div>
                ) : customerOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    No orders found for this customer
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-semibold text-gray-900">
                              Order #{order.orderId || order.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(order.orderDate)}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.orderStatus === "DELIVERED"
                                ? "bg-green-100 text-green-700"
                                : order.orderStatus === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : order.orderStatus === "SHIPPED"
                                ? "bg-indigo-100 text-indigo-700"
                                : order.orderStatus === "CONFIRMED"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-sm mb-2">
                          <span className="text-gray-600">
                            {order.orderItems?.length || 0}{" "}
                            {order.orderItems?.length === 1 ? "item" : "items"}
                          </span>
                          <span className="font-bold text-gray-900">
                            ₹{(order.totalDiscountedPrice || order.totalPrice || 0).toLocaleString()}
                          </span>
                        </div>

                        {/* Show first product */}
                        {order.orderItems && order.orderItems.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
                            <img
                              src={order.orderItems[0].product?.imageUrl}
                              alt={order.orderItems[0].product?.title}
                              className="w-12 h-12 rounded object-cover bg-gray-100"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {order.orderItems[0].product?.title}
                              </div>
                              {order.orderItems.length > 1 && (
                                <div className="text-xs text-gray-500">
                                  +{order.orderItems.length - 1} more item(s)
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;