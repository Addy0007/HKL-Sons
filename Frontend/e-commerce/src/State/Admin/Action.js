import { api } from "../../Config/apiConfig";
import {
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  SET_SELECTED_PRODUCT,
  CLEAR_SELECTED_PRODUCT,
} from "./ActionType";

// ─── Create Product ───────────────────────────────────────────────────────────
export const createProduct = (productData) => async (dispatch, getState) => {
  dispatch({ type: CREATE_PRODUCT_REQUEST });

  try {
    const { auth } = getState();
    console.log("\n🔐 Creating Product - Auth Check:");
    console.log("   JWT exists:", !!auth.jwt);
    console.log("   User Role:", auth.user?.role);

    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      try {
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        console.log("   Role in JWT:", payload.role);
      } catch (e) {
        console.error("   Failed to decode JWT:", e);
      }
    }

    console.log("\n📦 Product Data Being Sent:");
    console.log("   Title:", productData.title);
    console.log("   Brand:", productData.brand);
    console.log("   Price:", productData.price);
    console.log("   Category:", productData.topLevelCategory);
    console.log("   Sizes:", productData.size);

    const { data } = await api.post(`/api/admin/products/`, productData);

    console.log("✅ Product created successfully:", data);
    dispatch({ type: CREATE_PRODUCT_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.error("\n❌ Create Product Error:");
    console.error("   Status:", error.response?.status);
    console.error("   Error Message:", error.response?.data?.message || error.message);

    if (error.response?.status === 403) {
      console.error("🚫 403 FORBIDDEN - Check user role is ROLE_ADMIN and JWT is fresh.");
    } else if (error.response?.status === 401) {
      console.error("🚫 401 UNAUTHORIZED - JWT token is missing or invalid.");
    }

    dispatch({
      type: CREATE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// ─── Update Product ───────────────────────────────────────────────────────────
export const updateProduct = (productId, productData) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_PRODUCT_REQUEST });

  try {
    const { auth } = getState();
    console.log("\n🔐 Updating Product - Auth Check:");
    console.log("   User Role:", auth.user?.role);

    const { data } = await api.put(
      `/api/admin/products/${productId}`,
      productData
    );

    console.log("✅ Product updated:", data);
    dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.error("❌ Update product error:", error);
    dispatch({
      type: UPDATE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// ─── Delete Product ───────────────────────────────────────────────────────────
export const deleteProduct = (productId) => async (dispatch, getState) => {
  dispatch({ type: DELETE_PRODUCT_REQUEST });

  try {
    const { auth } = getState();
    console.log("\n🔐 Deleting Product - Auth Check:");
    console.log("   User Role:", auth.user?.role);
    console.log("   Product ID:", productId);

    const { data } = await api.delete(`/api/admin/products/${productId}/delete`);

    console.log("✅ Product deleted:", data);
    dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: { productId, message: data } });
    return data;
  } catch (error) {
    console.error("❌ Delete product error:", error);
    console.error("❌ Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    dispatch({
      type: DELETE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// ─── Select product for editing (call this when user clicks "Edit") ───────────
export const setSelectedProduct = (product) => ({
  type: SET_SELECTED_PRODUCT,
  payload: product,
});

// ─── Clear selected product (call on unmount or after editing) ────────────────
export const clearSelectedProduct = () => ({
  type: CLEAR_SELECTED_PRODUCT,
});