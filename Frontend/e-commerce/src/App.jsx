import { Routes, Route } from "react-router-dom";
import Footer from "./customer/components/Footer/Footer";
import Navigation from "./customer/components/Navigation";
import HomePage from "./customer/components/Pages/HomePage/HomePage";
import Product from "./customer/components/Product/Product";
import ProductDetails from "./customer/components/ProductDetails/ProductDetails";
import Cart from "./customer/components/Cart/Cart";
import Checkout from "./customer/components/Checkout/Checkout";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow">
        <Routes>

          <Route path="/" element={<HomePage />} /> 
          <Route path="/products" element={<Product />} />
          <Route path="/productDetails" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
