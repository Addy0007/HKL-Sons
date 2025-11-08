import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../customer/components/Pages/HomePage/HomePage';
import Navigation from '../customer/components/Navigation';
import Footer from '../customer/components/Footer/Footer';
import Cart from '../customer/components/Cart/Cart';
import Product from '../customer/components/Product/Product';
import ProductList from '../customer/components/Product/ProductList';
import ProductDetails from '../customer/components/ProductDetails/ProductDetails';
import Checkout from '../customer/components/Checkout/Checkout';
import Order from '../customer/components/Order/Order';
import OrderDetails from '../customer/components/Order/OrderDetails';
import SignIn from '../customer/components/Signin/SignIn';
import RequireAuth from "./RequireAuth";

const CustomerRoutes = () => {
  return (
    <div>
      <Navigation />
      
      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/login" element={<SignIn />} /> {/* ✅ FIXED */}
          <Route path="/signup" element={<SignIn />} /> {/* ✅ FIXED */}
          <Route path="/signin" element={<SignIn />} /> {/* Keep this too if needed */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/products" element={<Product />} />
          <Route path="/productDetails" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account/order" element={<Order />} />
          <Route path="/account/order/:orderId" element={<OrderDetails />} />
          <Route path="/:levelOne/:levelTwo/:levelThree" element={<ProductList />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>
  }
/>
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default CustomerRoutes;