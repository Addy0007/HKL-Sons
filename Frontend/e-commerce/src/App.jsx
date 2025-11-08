import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { getUser } from "./State/Auth/Action";
import CustomerRoutes from "./Routers/CustomerRoutes";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token && !user) {
      dispatch(getUser());
    }
  }, [user, dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/*" element={<CustomerRoutes />} />
      </Routes>
    </div>
  );
}

export default App;
