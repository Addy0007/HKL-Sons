import React from "react";
import { Route, Routes } from "react-router-dom";
import Admin from "../Admin/Components/Admin";
import AdminRoute from "../Admin/Components/Admin/AdminRoute";

export default function AdminRouter() {
  return (
    <AdminRoute>
      <Routes>
        <Route path="/*" element={<Admin />} />
      </Routes>
    </AdminRoute>
  );
}
