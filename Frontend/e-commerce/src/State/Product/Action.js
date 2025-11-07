import { api } from "../../Config/apiConfig";
import {
  FIND_PRODUCTS_REQUEST,
  FIND_PRODUCTS_SUCCESS,
  FIND_PRODUCTS_FAILURE,
  FIND_PRODUCT_BY_ID_REQUEST,
  FIND_PRODUCT_BY_ID_SUCCESS,
  FIND_PRODUCT_BY_ID_FAILURE,
} from "./ActionType";

// Get Products with Filters
export const findProducts = (reqData) => async (dispatch) => {
  dispatch({ type: FIND_PRODUCTS_REQUEST });

  try {
    console.log("🚀 API Request params:", {
      category: reqData.category,
      colors: reqData.colors,
      sizes: reqData.sizes,
      minPrice: reqData.minPrice,
      maxPrice: reqData.maxPrice,
      minDiscount: reqData.minDiscount,
      sort: reqData.sort,
      stock: reqData.stock,
      pageNumber: reqData.pageNumber,
      pageSize: reqData.pageSize,
    });

    const { data } = await api.get(`/api/products`, {
      params: {
        category: reqData.category,
        color: reqData.colors,     // ✅ Send as "color" to match backend @RequestParam name
        size: reqData.sizes,       // ✅ Send as "size" to match backend @RequestParam name
        minPrice: reqData.minPrice,
        maxPrice: reqData.maxPrice,
        minDiscount: reqData.minDiscount,
        sort: reqData.sort,
        stock: reqData.stock,
        pageNumber: reqData.pageNumber,
        pageSize: reqData.pageSize,
      },
    });

    console.log("✅ API Response:", data);
    console.log("✅ Products count:", data?.content?.length || 0);

    dispatch({ type: FIND_PRODUCTS_SUCCESS, payload: data });
  } catch (error) {
    console.error("❌ API Error:", error);
    console.error("❌ Error response:", error.response?.data);
    dispatch({ type: FIND_PRODUCTS_FAILURE, payload: error.message });
  }
};

// Get Single Product
export const findProductById = (productId) => async (dispatch) => {
  dispatch({ type: FIND_PRODUCT_BY_ID_REQUEST });

  try {
    const { data } = await api.get(`/api/products/${productId}`);
    dispatch({ type: FIND_PRODUCT_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FIND_PRODUCT_BY_ID_FAILURE, payload: error.message });
  }
};