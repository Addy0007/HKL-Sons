import React, { lazy } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
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

// ✅ Reserved path prefixes that should NEVER match the ProductList wildcard route.
// These are either API paths or known frontend route prefixes.
const RESERVED_PREFIXES = [
  "api",
  "checkout",
  "account",
  "payment",
  "product",
  "cart",
  "products",
  "profile",
  "login",
  "signup",
  "signin",
  "forgot-password",
  "reset-password",
  "about",
  "privacy",
  "terms",
  "claim",
];

// ✅ Guard component: prevents wildcard route from swallowing reserved paths.
// If /:levelOne matches a reserved prefix, redirect to home instead of
// rendering ProductList (which was causing /api/locations/states to be
// treated as a product category route).
const ProductListGuard = () => {
  const { levelOne } = useParams();
  if (RESERVED_PREFIXES.includes(levelOne?.toLowerCase())) {
    return <Navigate to="/" replace />;
  }
  return <ProductList />;
};

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

          {/* ✅ Checkout — must come BEFORE the wildcard route so
              /checkout/address and /checkout/summary are never swallowed */}
          <Route
            path="/checkout/address"
            element={
              <RequireAuth>
                <CheckoutAddress />
              </RequireAuth>
            }
          />
          <Route
            path="/checkout/summary"
            element={
              <RequireAuth>
                <CheckoutSummary />
              </RequireAuth>
            }
          />
          <Route path="/checkout" element={<Navigate to="/checkout/address" replace />} />

          {/* ✅ Account routes — also before wildcard */}
          <Route path="/account/order" element={<Order />} />
          <Route path="/account/order/:orderId" element={<OrderDetails />} />

          {/* ✅ Profile */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          {/* ✅ Auth pages */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ✅ Product detail — before wildcard */}
          <Route path="/product/:productId" element={<ProductDetails />} />

          {/* ✅ Footer pages */}
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/claim" element={<Claim />} />

          {/* ✅ Wildcard product category route — LAST, with guard.
              This was previously catching /api/locations/states because
              React Router matched it as levelOne=api, levelTwo=locations,
              levelThree=states before Nginx could proxy it. The guard
              redirects any reserved prefix to home instead. */}
          <Route path="/:levelOne/:levelTwo/:levelThree" element={<ProductListGuard />} />

        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerRoutes;