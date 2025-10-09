import { Routes, Route } from "react-router-dom";
import Footer from "./customer/components/Footer/Footer";
import Navigation from "./customer/components/Navigation";
import HomePage from "./customer/components/Pages/HomePage/HomePage";
import Product from "./customer/components/Product/Product";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow">
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/" element={<Product />} />
          {/* or keep this version if you prefer /products URL:
          <Route path="/products" element={<Product />} /> */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
