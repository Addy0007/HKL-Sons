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
export const createProduct = (productData) => async (dispatch) => {
  dispatch({ type: CREATE_PRODUCT_REQUEST });

  try {
    const { data } = await api.post(`/api/admin/products/`, productData);
    
    console.log("✅ Product created:", data);
    dispatch({ type: CREATE_PRODUCT_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.error("❌ Create product error:", error);
    dispatch({ 
      type: CREATE_PRODUCT_FAILURE, 
      payload: error.response?.data?.message || error.message 
    });
    throw error;
  }
};

// Update Product
export const updateProduct = (productId, productData) => async (dispatch) => {
  dispatch({ type: UPDATE_PRODUCT_REQUEST });

  try {
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
export const deleteProduct = (productId) => async (dispatch) => {
  dispatch({ type: DELETE_PRODUCT_REQUEST });

  try {
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