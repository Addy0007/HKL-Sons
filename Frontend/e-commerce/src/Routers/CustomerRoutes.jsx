import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./RequireAuth";

const HomePage = lazy(() => import('../customer/components/Pages/HomePage/HomePage'));
const Cart = lazy(() => import('../customer/components/Cart/Cart'));
const Product = lazy(() => import('../customer/components/Product/Product'));
const ProductList = lazy(() => import('../customer/components/Product/ProductList'));
const ProductDetails = lazy(() => import('../customer/components/ProductDetails/ProductDetails'));
const Order = lazy(() => import('../customer/components/Order/Order'));
const OrderDetails = lazy(() => import('../customer/components/Order/OrderDetails'));

const SignIn = lazy(() => import('../customer/components/Signin/SignIn'));
const ForgotPassword = lazy(() => import('../customer/components/Signin/ForgotPassword'));
const ResetPassword = lazy(() => import('../customer/components/Signin/ResetPassword'));

const CheckoutAddress = lazy(() => import('../customer/components/Checkout/CheckoutAddress'));
const CheckoutSummary = lazy(() => import('../customer/components/Checkout/CheckoutSummary'));
const PaymentSuccess = lazy(() => import('../customer/components/Payment/PaymentSuccess'));

const About = lazy(() => import('../customer/components/Pages/About'));
const Privacy = lazy(() => import('../customer/components/Pages/Privacy'));
const Terms = lazy(() => import('../customer/components/Pages/Terms'));
const Claim = lazy(() => import('../customer/components/Pages/Claim'));

const Profile = lazy(() => import('../customer/components/Navigation/Profile'));

import Navigation from '../customer/components/Navigation/Navigation';
import Footer from '../customer/components/Footer/Footer';


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