// src/hooks/useCategories.js

import { useEffect, useState } from "react";
import { api } from "../Config/apiConfig";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/api/categories/tree")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Failed to load categories", err));
  }, []);

  return categories;
};
