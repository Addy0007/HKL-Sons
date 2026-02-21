import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../customer/components/Pages/HomePage/HomePage';
import Navigation from '../customer/components/Navigation/Navigation';
import Footer from '../customer/components/Footer/Footer';
import Cart from '../customer/components/Cart/Cart';
import Product from '../customer/components/Product/Product';
import ProductList from '../customer/components/Product/ProductList';
import ProductDetails from '../customer/components/ProductDetails/ProductDetails';
import Order from '../customer/components/Order/Order';
import OrderDetails from '../customer/components/Order/OrderDetails';
import SignIn from '../customer/components/Signin/SignIn';
import ForgotPassword from "../customer/components/Signin/ForgotPassword";
import ResetPassword from "../customer/components/Signin/ResetPassword";
import Profile from "../customer/components/Navigation/Profile";   

import RequireAuth from "./RequireAuth";

// ✅ Checkout step components
import CheckoutAddress from '../customer/components/Checkout/CheckoutAddress';
import CheckoutSummary from '../customer/components/Checkout/CheckoutSummary';
import PaymentSuccess from '../customer/components/Payment/PaymentSuccess';

// ✅ Footer page components
import About from '../customer/components/Pages/About';
import Privacy from '../customer/components/Pages/Privacy';
import Terms from '../customer/components/Pages/Terms';
import Claim from '../customer/components/Pages/Claim';

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
          <Route path="/payment/:orderId" element={<PaymentSuccess />} />
          <Route path="/:levelOne/:levelTwo/:levelThree" element={<ProductList />} />
          <Route path="/product/:productId" element={<ProductDetails />} />

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

          {/* ✅ Profile - protected */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ✅ Footer pages */}
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/claim" element={<Claim />} />

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default CustomerRoutes;