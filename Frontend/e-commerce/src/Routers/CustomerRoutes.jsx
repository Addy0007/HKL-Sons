import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../customer/components/Pages/HomePage/HomePage';
import Navigation from '../customer/components/Navigation';
import Footer from '../customer/components/Footer/Footer';
import Cart from '../customer/components/Cart/Cart';
import Product from '../customer/components/Product/Product';
import ProductList from '../customer/components/Product/ProductList';
import ProductDetails from '../customer/components/ProductDetails/ProductDetails';
import Order from '../customer/components/Order/Order';
import OrderDetails from '../customer/components/Order/OrderDetails';
import SignIn from '../customer/components/Signin/SignIn';
import RequireAuth from "./RequireAuth";

// ✅ New checkout step components
import CheckoutAddress from '../customer/components/Checkout/CheckoutAddress';
import CheckoutSummary from '../customer/components/Checkout/CheckoutSummary';

const CustomerRoutes = () => {
  return (
    <div>
      <Navigation />
      
      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/products" element={<Product />} />
          <Route path="/productDetails" element={<ProductDetails />} />

          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/:levelOne/:levelTwo/:levelThree" element={<ProductList />} />

          {/* ✅ Checkout Step 1 */}
          <Route 
            path="/checkout/address" 
            element={
              <RequireAuth>
                <CheckoutAddress />
              </RequireAuth>
            } 
          />

          {/* ✅ Checkout Step 2 */}
          <Route 
            path="/checkout/summary" 
            element={
              <RequireAuth>
                <CheckoutSummary />
              </RequireAuth>
            } 
          />

          {/* ✅ If user types /checkout manually → redirect to /checkout/address */}
          <Route path="/checkout" element={<Navigate to="/checkout/address" replace />} />

          <Route path="/account/order" element={<Order />} />
          <Route path="/account/order/:orderId" element={<OrderDetails />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default CustomerRoutes;
