import React, { useState } from 'react';
import { Package, MapPin, Truck, CheckCircle, Home } from 'lucide-react';

const OrderDetails = () => {
  const [selectedAddress, setSelectedAddress] = useState(0);
  
  const addresses = [
    {
      id: 1,
      label: 'Home',
      name: 'John Doe',
      street: '123 Main Street, Apartment 4B',
      city: 'New York, NY 10001',
      phone: '+1 (555) 123-4567'
    },
    {
      id: 2,
      label: 'Office',
      name: 'John Doe',
      street: '456 Business Ave, Suite 200',
      city: 'New York, NY 10002',
      phone: '+1 (555) 987-6543'
    },
    {
      id: 3,
      label: 'Other',
      name: 'Jane Doe',
      street: '789 Park Lane, Building C',
      city: 'Brooklyn, NY 11201',
      phone: '+1 (555) 456-7890'
    }
  ];

  const orderSteps = [
    { label: 'Order Placed', status: 'completed' },
    { label: 'Confirmed', status: 'completed' },
    { label: 'Shipped', status: 'active' },
    { label: 'Out for Delivery', status: 'pending' },
    { label: 'Delivered', status: 'pending' }
  ];

  const products = [
    {
      id: 1,
      name: 'Premium Cotton T-Shirt',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
      color: 'Navy Blue',
      size: 'L',
      price: 29.99
    },
    {
      id: 2,
      name: 'Casual Denim Jeans',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      color: 'Dark Wash',
      size: '32',
      price: 59.99
    },
    {
      id: 3,
      name: 'Classic Leather Sneakers',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop',
      color: 'White',
      size: '10',
      price: 89.99
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Order Details</h1>

        {/* Delivery Address Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className="mr-2" size={24} />
            Delivery Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {addresses.map((address, index) => (
              <div
                key={address.id}
                onClick={() => setSelectedAddress(index)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedAddress === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700">{address.label}</span>
                  {selectedAddress === index && (
                    <CheckCircle className="text-blue-500" size={20} />
                  )}
                </div>
                <p className="text-sm text-gray-600">{address.name}</p>
                <p className="text-sm text-gray-600">{address.street}</p>
                <p className="text-sm text-gray-600">{address.city}</p>
                <p className="text-sm text-gray-600 mt-2">{address.phone}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Status</h2>
          <div className="relative">
            <div className="flex justify-between items-center">
              {orderSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center flex-1 relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      step.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : step.status === 'active'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step.status === 'completed' ? (
                      <CheckCircle size={20} />
                    ) : step.status === 'active' ? (
                      <Truck size={20} />
                    ) : (
                      <Package size={20} />
                    )}
                  </div>
                  <p className="text-xs mt-2 text-center font-medium text-gray-700">
                    {step.label}
                  </p>
                  {index < orderSteps.length - 1 && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-1 ${
                        step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Items</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-600">Color: {product.color}</p>
                    <p className="text-sm text-gray-600">Size: {product.size}</p>
                    <p className="text-sm text-gray-500 mt-1">Sold by: HKLSons</p>
                    <p className="text-lg font-bold text-gray-800 mt-2">
                      ${product.price}
                    </p>
                  </div>
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Rate & Review
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-800 font-semibold">
                ${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Shipping:</span>
              <span className="text-gray-800 font-semibold">$5.99</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span className="text-blue-600">
                ${(products.reduce((sum, p) => sum + p.price, 0) + 5.99).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;