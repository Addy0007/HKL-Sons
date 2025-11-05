import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux"; // ✅ ADD
import { store } from "./State/Store"; // ✅ ADD
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}> {/* ✅ ADD */}
        <App />
      </Provider> {/* ✅ ADD */}
    </BrowserRouter>
  </StrictMode>
);