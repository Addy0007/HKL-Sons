import { api } from "../../Config/apiConfig";
import { clearCheckoutAddress } from "../Checkout/Action";
import { getCart } from "../Cart/Action"; // ✅ Import getCart action
import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  GET_ORDER_BY_ID_REQUEST,
  GET_ORDER_BY_ID_SUCCESS,
  GET_ORDER_BY_ID_FAILURE,
} from "./ActionType";

// Create Order
export const createOrder = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST });

  try {
    console.log("📦 Sending order request...");
    console.log("📍 Address data:", reqData.address);
    
    const { data } = await api.post(`/api/orders`, {
      address: reqData.address
    });

    console.log("✅ Order Created:", data);

    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });

    if (data?.id) {
      // ✅ Clear checkout address after successful order
      dispatch(clearCheckoutAddress());
      
      // ✅ Refresh cart to get updated (empty) cart from backend
      dispatch(getCart());
      
      // ✅ Navigate to order details page
      reqData.navigate(`/account/order/${data.id}`);
    }

  } catch (error) {
    console.error("❌ Order Error:", error);
    console.error("❌ Error response:", error.response?.data);
    dispatch({ type: CREATE_ORDER_FAILURE, payload: error.message });
    
    // ✅ Show error to user
    alert("Failed to create order: " + (error.response?.data?.message || error.message));
  }
};

// Get Order by ID
export const getOrderById = (orderId) => async (dispatch) => {
  dispatch({ type: GET_ORDER_BY_ID_REQUEST });

  try {
    const { data } = await api.get(`/api/orders/${orderId}`);
    console.log("✅ Order fetched:", data);
    dispatch({ type: GET_ORDER_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    console.error("❌ Get order error:", error);
    dispatch({ type: GET_ORDER_BY_ID_FAILURE, payload: error.message });
  }
};
export const createPendingOrder = (orderData) => async (dispatch) => {
  try {
    const { data } = await api.post("/api/orders/pending", {
      address: orderData.address,        // ✅ correctly extract address
      couponCode: orderData.couponCode,  // ✅ also pass coupon
    });
    return data;
  } catch (error) {
    console.error("Create Pending Order Error:", error);
    alert("Unable to create order.");
    return null;
  }
};
