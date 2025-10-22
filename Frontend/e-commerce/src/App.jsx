import { Routes, Route } from "react-router-dom";
import CustomerRoutes from "./Routers/CustomerRoutes";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/*" element={<CustomerRoutes />} />
      </Routes>
    </div>
  );
}

export default App;