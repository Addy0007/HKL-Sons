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
} from "./ActionType";

// Create Product
export const createProduct = (productData) => async (dispatch, getState) => {
  dispatch({ type: CREATE_PRODUCT_REQUEST });

  try {
    // ✅ Debug: Check auth state
    const { auth } = getState();
    console.log("\n🔐 Creating Product - Auth Check:");
    console.log("   JWT exists:", !!auth.jwt);
    console.log("   User:", auth.user);
    console.log("   User Role:", auth.user?.role);
    
    // ✅ Debug: Check JWT in localStorage
    const jwt = localStorage.getItem("jwt");
    console.log("   JWT in localStorage:", jwt ? "Present" : "Missing");
    
    if (jwt) {
      // Decode JWT to see what's inside
      try {
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        console.log("   JWT Payload:", payload);
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
    console.error("   Status Text:", error.response?.statusText);
    console.error("   Error Message:", error.response?.data?.message || error.message);
    console.error("   Full Error:", error.response?.data);
    
    // Specific error messages
    if (error.response?.status === 403) {
      console.error("\n🚫 403 FORBIDDEN - Possible causes:");
      console.error("   1. User role is not ROLE_ADMIN");
      console.error("   2. JWT token doesn't contain role");
      console.error("   3. JWT token is invalid or expired");
      console.error("\n🔧 Solutions:");
      console.error("   1. Check database: User role should be 'ROLE_ADMIN'");
      console.error("   2. Logout and login again to get fresh JWT");
      console.error("   3. Check backend JwtProvider adds role to token");
    } else if (error.response?.status === 401) {
      console.error("\n🚫 401 UNAUTHORIZED:");
      console.error("   JWT token is missing or invalid");
      console.error("   Please logout and login again");
    }
    
    dispatch({ 
      type: CREATE_PRODUCT_FAILURE, 
      payload: error.response?.data?.message || error.message 
    });
    throw error;
  }
};

// Update Product
export const updateProduct = (productId, productData) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_PRODUCT_REQUEST });

  try {
    const { auth } = getState();
    console.log("\n🔐 Updating Product - Auth Check:");
    console.log("   User Role:", auth.user?.role);
    
    const { data } = await api.put(
      `/api/admin/products/${productId}/update`, 
      productData
    );
    
    console.log("✅ Product updated:", data);
    dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.error("❌ Update product error:", error);
    dispatch({ 
      type: UPDATE_PRODUCT_FAILURE, 
      payload: error.response?.data?.message || error.message 
    });
    throw error;
  }
};

// Delete Product
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
      data: error.response?.data
    });
    
    dispatch({ 
      type: DELETE_PRODUCT_FAILURE, 
      payload: error.response?.data?.message || error.message 
    });
    throw error;
  }
};